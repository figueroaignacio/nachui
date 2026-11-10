import ts from 'typescript';
import {
  catalogSlug,
  isScreenPath,
  projectCandidates,
  resolveImport,
  type CatalogDir,
} from './paths.js';
import type { StudioFiles } from './workspace.js';

export type StudioCheckRule = 'syntax' | 'import' | 'export' | 'entry';

export type StudioDiagnostic = {
  file: string;
  line?: number;
  rule: StudioCheckRule;
  message: string;
};

export type StudioCheckResult = {
  ok: boolean;
  checked: number;
  diagnostics: StudioDiagnostic[];
};

/** Source of a catalog file, `('components', 'card')`, or null when it does not exist. */
export type CatalogSourceLookup = (dir: CatalogDir, name: string) => Promise<string | null>;

export const MAX_DIAGNOSTICS = 20;

type ImportUse = {
  specifier: string;
  line: number;
  names: string[];
  typeOnly: boolean;
};

function lineOf(source: ts.SourceFile, position: number): number {
  return source.getLineAndCharacterOfPosition(position).line + 1;
}

function parse(path: string, code: string): ts.SourceFile {
  return ts.createSourceFile(
    path,
    code,
    ts.ScriptTarget.Latest,
    true,
    path.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

function syntaxDiagnostics(path: string, code: string): StudioDiagnostic[] {
  const result = ts.transpileModule(code, {
    fileName: path,
    reportDiagnostics: true,
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });

  return (result.diagnostics ?? []).map((diagnostic) => ({
    file: path,
    line:
      diagnostic.file && diagnostic.start !== undefined
        ? lineOf(diagnostic.file, diagnostic.start)
        : undefined,
    rule: 'syntax' as const,
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
  }));
}

function collectImports(source: ts.SourceFile): ImportUse[] {
  const uses: ImportUse[] = [];

  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const clause = statement.importClause;
      const names: string[] = [];
      if (clause?.name) names.push('default');
      if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const element of clause.namedBindings.elements) {
          names.push((element.propertyName ?? element.name).text);
        }
      }
      uses.push({
        specifier: statement.moduleSpecifier.text,
        line: lineOf(source, statement.getStart(source)),
        names,
        typeOnly: Boolean(clause?.isTypeOnly),
      });
    }

    if (
      ts.isExportDeclaration(statement) &&
      statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      const names =
        statement.exportClause && ts.isNamedExports(statement.exportClause)
          ? statement.exportClause.elements.map(
              (element) => (element.propertyName ?? element.name).text,
            )
          : [];
      uses.push({
        specifier: statement.moduleSpecifier.text,
        line: lineOf(source, statement.getStart(source)),
        names,
        typeOnly: statement.isTypeOnly,
      });
    }
  }

  return uses;
}

function hasExportModifier(node: ts.Node): boolean {
  return (
    ts.canHaveModifiers(node) &&
    (ts.getModifiers(node) ?? []).some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
  );
}

function hasDefaultModifier(node: ts.Node): boolean {
  return (
    ts.canHaveModifiers(node) &&
    (ts.getModifiers(node) ?? []).some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)
  );
}

/** Every name a module exports, `default` included. */
export function collectExports(path: string, code: string): Set<string> {
  const source = parse(path, code);
  const names = new Set<string>();

  for (const statement of source.statements) {
    if (ts.isExportAssignment(statement)) {
      names.add('default');
      continue;
    }

    if (ts.isExportDeclaration(statement)) {
      if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) names.add(element.name.text);
      }
      continue;
    }

    if (!hasExportModifier(statement)) continue;

    if (hasDefaultModifier(statement)) {
      names.add('default');
      continue;
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.add(declaration.name.text);
      }
      continue;
    }

    if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name
    ) {
      names.add(statement.name.text);
    }
  }

  return names;
}

function missingNames(wanted: string[], available: Set<string>): string[] {
  return wanted.filter((name) => !available.has(name));
}

/**
 * Checks what a bundler and a reviewer would catch before the preview runs:
 * syntax, imports that point nowhere or outside NachUI, names a file does not
 * export, and a screen to render. It does not type check against props.
 */
export async function checkProject(
  files: StudioFiles,
  getCatalogSource: CatalogSourceLookup,
): Promise<StudioCheckResult> {
  const diagnostics: StudioDiagnostic[] = [];
  const paths = Object.keys(files).sort();
  const catalogExports = new Map<string, Promise<Set<string> | null>>();
  const projectExports = new Map<string, Set<string>>();

  const exportsOfCatalog = (dir: CatalogDir, name: string) => {
    const key = `${dir}/${name}`;
    let pending = catalogExports.get(key);
    if (!pending) {
      pending = getCatalogSource(dir, name).then((code) =>
        code === null ? null : collectExports(`${key}.tsx`, code),
      );
      catalogExports.set(key, pending);
    }
    return pending;
  };

  const exportsOfProject = (path: string) => {
    let names = projectExports.get(path);
    if (!names) {
      names = collectExports(path, files[path] ?? '');
      projectExports.set(path, names);
    }
    return names;
  };

  const screens = paths.filter(isScreenPath);
  if (screens.length === 0) {
    diagnostics.push({
      file: 'screens/',
      rule: 'entry',
      message: 'There is no screen yet. Write screens/<name>.tsx with a default export.',
    });
  }

  for (const screen of screens) {
    if (!exportsOfProject(screen).has('default')) {
      diagnostics.push({
        file: screen,
        rule: 'entry',
        message: 'A screen needs a default export with the component to render.',
      });
    }
  }

  for (const path of paths) {
    const code = files[path] ?? '';
    const syntax = syntaxDiagnostics(path, code);
    diagnostics.push(...syntax);
    if (syntax.length > 0) continue;

    const source = parse(path, code);

    for (const use of collectImports(source)) {
      const target = resolveImport(path, use.specifier);

      if (target.kind === 'unknown') {
        diagnostics.push({
          file: path,
          line: use.line,
          rule: 'import',
          message: `${use.specifier}: ${target.reason}`,
        });
        continue;
      }

      if (target.kind === 'package') {
        if (!target.allowed) {
          diagnostics.push({
            file: path,
            line: use.line,
            rule: 'import',
            message: `${use.specifier} is not available. Use NachUI components and React only.`,
          });
        }
        continue;
      }

      if (target.kind === 'project') {
        const found = projectCandidates(target.base).find((candidate) => candidate in files);
        if (!found) {
          diagnostics.push({
            file: path,
            line: use.line,
            rule: 'import',
            message: `${use.specifier} does not exist in this project.`,
          });
          continue;
        }
        const missing = missingNames(use.names, exportsOfProject(found));
        if (missing.length > 0) {
          diagnostics.push({
            file: path,
            line: use.line,
            rule: 'export',
            message: `${found} does not export ${missing.join(', ')}.`,
          });
        }
        continue;
      }

      const available = await exportsOfCatalog(target.dir, target.name);
      if (!available) {
        diagnostics.push({
          file: path,
          line: use.line,
          rule: 'import',
          message: `${target.dir}/${target.name} is not in NachUI (${catalogSlug(target.dir, target.name)}). Call listComponents to see what exists.`,
        });
        continue;
      }

      const missing = missingNames(use.names, available);
      if (missing.length > 0) {
        diagnostics.push({
          file: path,
          line: use.line,
          rule: 'export',
          message: `${target.dir}/${target.name} does not export ${missing.join(', ')}. It exports ${[...available].filter((name) => name !== 'default').join(', ')}.`,
        });
      }
    }
  }

  return {
    ok: diagnostics.length === 0,
    checked: paths.length,
    diagnostics: diagnostics.slice(0, MAX_DIAGNOSTICS),
  };
}

/** NachUI files the project imports directly, as `{ dir, name }`, without repeats. */
export function projectCatalogImports(
  files: StudioFiles,
): Array<{ dir: CatalogDir; name: string }> {
  const seen = new Map<string, { dir: CatalogDir; name: string }>();
  for (const [path, code] of Object.entries(files)) {
    for (const use of collectImports(parse(path, code))) {
      const target = resolveImport(path, use.specifier);
      if (target.kind === 'catalog') {
        seen.set(`${target.dir}/${target.name}`, { dir: target.dir, name: target.name });
      }
    }
  }
  return [...seen.values()].sort((a, b) =>
    `${a.dir}/${a.name}`.localeCompare(`${b.dir}/${b.name}`),
  );
}

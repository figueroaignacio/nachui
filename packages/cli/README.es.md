# NachUI CLI

[English](./README.md) | [Español]

La Interfaz de Línea de Comandos oficial para el ecosistema NachUI. Diseñada para ayudarte a integrar, administrar y actualizar primitivas de React de alta fidelidad directamente en el código de tu proyecto sin complicaciones.

## Stack Tecnológico

- **Framework de CLI**: [Commander](https://github.com/tj/commander.js)
- **Prompts Interactivos**: [@clack/prompts](https://github.com/natemoo-re/clack)
- **Estilos de Consola**: [Kleur](https://github.com/lukeed/kleur)
- **Validación de Datos**: [Zod](https://zod.dev/)

## Características Clave

### 1. Integración Radicalmente Simple

Inicializa NachUI en tu entorno de trabajo, configura tu proyecto y agrega componentes de React diseñados a la perfección directamente en tu código fuente. Tú eres el dueño del código.

### 2. Flujo de Trabajo Optimizado

Administra el ciclo de vida completo de tus componentes desde la terminal: lista las primitivas disponibles, agrega nuevas, actualiza las existentes de manera sencilla, o elimina las que ya no necesitas.

### 3. Prioridad a la Experiencia del Desarrollador

Construido con prompts interactivos elegantes, validación de errores útil y comandos intuitivos que respetan tu tiempo.

## Uso

Puedes ejecutar el CLI directamente a través de `npx` (o tu gestor de paquetes preferido) sin necesidad de instalarlo globalmente.

```bash
# Preparar los tokens del tema, nachui.json y el helper cn
npx nachui init

# Agregar componentes con todos los archivos que importan
npx nachui add button hybrids/confirm

# Listar todos los componentes disponibles
npx nachui list

# Actualizar un componente instalado
npx nachui update button

# Eliminar un componente instalado
npx nachui remove button
```

`add` escribe cada archivo en `<baseDir>/<carpeta de la familia>/<nombre>`, con la misma estructura que el código de NachUI (`components/`, `layout/`, `ai/`, `hybrids/`, `icons/`, `lib/`), así los imports relativos como `../lib/cn` se resuelven. `baseDir` está en `nachui.json` y por defecto es `src`.

Flags: `add --overwrite` reemplaza los archivos que difieren del registro, `--yes` omite las preguntas en todos los comandos y nunca reemplaza archivos que modificaste (salvo `update --yes`, que actualiza el componente que nombraste).

Define `NACHUI_API_URL` para usar un registro local o propio, por ejemplo `http://localhost:3001/api/v1`.

## Desarrollo

```bash
pnpm --filter nachui test         # vitest
pnpm --filter nachui check-types
pnpm --filter nachui lint
pnpm --filter nachui build
```

## Arquitectura

- `src/commands`: un archivo por comando (`init`, `add`, `list`, `update`, `remove`).
- `src/lib`: el cliente del registro, la lectura de `nachui.json`, la ubicación de los archivos, la resolución del árbol de dependencias y el manejo del gestor de paquetes.
- `src/index.ts`: el punto de entrada, que procesa los argumentos con `commander`.

import type { Metadata } from 'next';
import Link from 'next/link';
import { GithubMark } from '@/features/shell/github-mark';
import { LinkButton } from '@/features/shell/link-button';
import { Logo } from '@/features/shell/logo';
import { LoginPreview } from '@/features/shell/login-preview';
import { signInUrl } from '@/lib/api';

export const metadata: Metadata = { title: 'Sign in' };

const ERRORS: Record<string, string> = {
  denied: 'GitHub sign in was cancelled. Try again when you are ready.',
  expired: 'That sign in link expired. Start again from here.',
  github: 'GitHub did not answer. Try again in a moment.',
  failed: 'Something went wrong signing you in. Try again.',
};

function safeNext(value: string | string[] | undefined): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : '/';
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const error = typeof params.error === 'string' ? ERRORS[params.error] : undefined;

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <main className="flex flex-col justify-between gap-12 px-5 py-6 sm:px-10 lg:px-16 lg:py-10">
        <Logo label="NachUI Studio" />
        <div className="flex max-w-md flex-col gap-7">
          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl">
              Screens you can ship, from a sentence.
            </h1>
            <p className="text-muted-strong text-base leading-relaxed">
              Studio builds with NachUI only, checks every import and opens a pull request with code
              that is yours.
            </p>
          </div>
          {error ? (
            <p
              role="alert"
              className="border-destructive-border bg-destructive-surface text-destructive-text rounded-lg border px-3 py-2 text-sm"
            >
              {error}
            </p>
          ) : null}
          <LinkButton href={signInUrl(next)} size="lg" className="h-11 gap-2.5">
            <GithubMark />
            Continue with GitHub
          </LinkButton>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We only read your public profile. Access to a repository is asked for later, the first
            time you open a pull request.
          </p>
        </div>
        <nav aria-label="Legal" className="text-muted-strong flex gap-5 text-sm">
          <Link
            href="/example"
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            See an example
          </Link>
          <a
            href="https://nachui.tech/docs"
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            Docs
          </a>
          <a
            href="https://github.com/figueroaignacio/nachui"
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            Source
          </a>
        </nav>
      </main>
      <aside
        aria-label="Product preview"
        className="bg-surface-muted border-border studio-dots m-3 hidden items-center justify-center rounded-3xl border p-12 lg:flex"
      >
        <LoginPreview />
      </aside>
    </div>
  );
}

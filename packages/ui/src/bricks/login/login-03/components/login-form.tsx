'use client';

import { Button } from '../../../../components/button';
import { Card } from '../../../../components/card';
import { Input } from '../../../../components/input';
import { Label } from '../../../../components/label';
import { Separator } from '../../../../components/separator';

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function Login03() {
  return (
    <Card className="w-full flex-row overflow-hidden rounded-xl shadow-sm">
      <div className="bg-muted/30 hidden w-1/2 flex-col justify-between p-10 lg:flex">
        <div className="text-foreground text-lg font-bold tracking-tight">NachUI</div>
        <div className="space-y-3">
          <blockquote className="text-foreground text-lg leading-relaxed italic">
            &ldquo;This library has saved me countless hours of work and helped me deliver stunning
            designs faster than ever before.&rdquo;
          </blockquote>
          <div>
            <p className="text-foreground text-sm font-medium">Sofia Davis</p>
            <p className="text-muted-foreground text-xs">Lead Designer, Acme Inc.</p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-sm space-y-6">
          <Card.Header compact className="items-center p-0 text-center">
            <Card.Title as="h2" className="text-2xl font-bold">
              Login to your account
            </Card.Title>
            <Card.Description>Enter your email and password to continue</Card.Description>
          </Card.Header>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" leftIcon={<GitHubIcon />}>
              GitHub
            </Button>
            <Button variant="outline" leftIcon={<GoogleIcon />}>
              Google
            </Button>
          </div>
          <Separator label="or" />
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input label="Email" type="email" placeholder="me@example.com" autoComplete="email" />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-03-password">Password</Label>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </Button>
              </div>
              <Input id="login-03-password" type="password" autoComplete="current-password" />
            </div>
            <Button type="submit" fullWidth>
              Sign in
            </Button>
          </form>
          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{' '}
            <a
              href="/signup"
              className="text-foreground font-medium underline underline-offset-4 hover:opacity-80"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </Card>
  );
}

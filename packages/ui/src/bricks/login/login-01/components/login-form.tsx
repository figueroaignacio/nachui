'use client';

import { Button } from '../../../../components/button';
import { Card } from '../../../../components/card';
import { Checkbox } from '../../../../components/checkbox';
import { Input } from '../../../../components/input';
import { Label } from '../../../../components/label';

export function LoginForm() {
  return (
    <Card className="w-full max-w-sm">
      <Card.Header>
        <Card.Title>Login to your account</Card.Title>
        <Card.Description>Enter your email below to login to your account</Card.Description>
      </Card.Header>
      <Card.Content>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Email" type="email" placeholder="me@example.com" autoComplete="email" />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-01-password">Password</Label>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Forgot your password?
              </Button>
            </div>
            <Input id="login-01-password" type="password" autoComplete="current-password" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="login-01-remember" />
            <Label htmlFor="login-01-remember" className="text-sm font-normal">
              Remember me
            </Label>
          </div>
          <Button type="submit" fullWidth>
            Login
          </Button>
        </form>
      </Card.Content>
      <Card.Footer align="center" className="pb-6">
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{' '}
          <a
            href="/signup"
            className="text-foreground font-medium underline underline-offset-4 hover:opacity-80"
          >
            Sign up
          </a>
        </p>
      </Card.Footer>
    </Card>
  );
}

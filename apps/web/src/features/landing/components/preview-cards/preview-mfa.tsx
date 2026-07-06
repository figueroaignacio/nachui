import { Avatar } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';

export function PreviewMfa() {
  return (
    <div
      className="border-border bg-card flex flex-col items-center gap-5 rounded-2xl border p-5"
      role="form"
      aria-label="Two Factor Authentication"
    >
      <div className="flex flex-col items-center gap-2">
        <Avatar.Group>
          <Avatar className="border border-zinc-200 ring-2 ring-white dark:border-zinc-800 dark:ring-zinc-950">
            <Avatar.Image src="https://github.com/figueroaignacio.png" alt="@figueroaignacio" />
            <Avatar.Fallback>IF</Avatar.Fallback>
          </Avatar>
          <Avatar className="border border-zinc-200 ring-2 ring-white dark:border-zinc-800 dark:ring-zinc-950">
            <Avatar.Image src="https://github.com/nicvazquezdev.png" alt="@nicvazquezdev" />
            <Avatar.Fallback>NV</Avatar.Fallback>
          </Avatar>
          <Avatar className="border border-zinc-200 ring-2 ring-white dark:border-zinc-800 dark:ring-zinc-950">
            <Avatar.Image src="https://github.com/ManuZarraga.png" alt="@ManuZarraga" />
            <Avatar.Fallback>MZ</Avatar.Fallback>
          </Avatar>
          <Avatar className="border border-zinc-200 ring-2 ring-white dark:border-zinc-800 dark:ring-zinc-950">
            <Avatar.Fallback>+3</Avatar.Fallback>
          </Avatar>
        </Avatar.Group>
      </div>

      <div className="flex w-full flex-col items-center space-y-3 text-center">
        <div className="space-y-1">
          <h3 className="text-sm font-bold tracking-tight text-zinc-900 uppercase dark:text-zinc-50">
            MFA Required
          </h3>
          <p className="text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            Enter the 6-digit verification code from Google Authenticator.
          </p>
        </div>
        <div
          className="flex justify-center gap-1.5"
          role="group"
          aria-label="One-time password characters"
        >
          {[3, 8, 4, 1, 0, 0].map((v, i) => (
            <Input
              key={i}
              className="bg-muted/40 focus:ring-primary/20 h-9 w-8 border-zinc-200 px-0 text-center text-xs font-bold text-zinc-950 focus:ring-1 dark:border-zinc-800 dark:text-zinc-50"
              defaultValue={v.toString()}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
          Lost access?{' '}
          <button
            type="button"
            className="cursor-pointer font-semibold text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-50"
          >
            Use recovery code
          </button>
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-2">
        <Button variant="default" size="sm" className="h-8 text-xs font-bold">
          Verify
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs font-bold">
          Cancel
        </Button>
      </div>
    </div>
  );
}

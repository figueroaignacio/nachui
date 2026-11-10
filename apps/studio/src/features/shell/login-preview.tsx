import { TemplateThumb } from '@/features/home/templates';

const SCENES = [
  { prompt: 'A pricing page with three plans', kind: 'pricing' },
  { prompt: 'An analytics dashboard for a store', kind: 'dashboard' },
  { prompt: 'Account settings with a side menu', kind: 'settings' },
] as const;

/** A loop of prompts turning into screens. Pure CSS, so it runs on the server rendered page. */
export function LoginPreview() {
  return (
    <div aria-hidden="true" className="flex w-full max-w-[520px] flex-col gap-4">
      <div className="bg-muted relative ms-auto h-11 w-[300px] rounded-2xl rounded-ee-md px-4 py-3 text-sm">
        {SCENES.map((scene, index) => (
          <span
            key={scene.prompt}
            className="studio-cycle absolute inset-x-4 top-3"
            style={{ animationDelay: `${index * 3}s` }}
          >
            <span className="studio-type block" style={{ animationDelay: `${index * 3}s` }}>
              {scene.prompt}
            </span>
          </span>
        ))}
      </div>
      <div className="relative aspect-[16/10] w-full">
        {SCENES.map((scene, index) => (
          <span
            key={scene.kind}
            className="studio-cycle border-border bg-card absolute inset-0 overflow-hidden rounded-2xl border shadow-xl"
            style={{ animationDelay: `${index * 3 + 0.6}s` }}
          >
            <span className="block h-1/2 w-1/2 origin-top-left scale-200">
              <TemplateThumb kind={scene.kind} />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

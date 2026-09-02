import { Textarea } from '../../components/textarea';

export function Default() {
  return (
    <div className="w-full max-w-sm">
      <Textarea aria-label="Release notes" placeholder="What changed in this release?" />
    </div>
  );
}

import { Textarea } from '../../components/textarea';

export function AutoResize() {
  return (
    <div className="w-full max-w-sm">
      <Textarea
        label="Reply"
        description="Grows with what you type, up to six lines."
        placeholder="Thanks for the report, we are looking into it."
        autoResize
        maxRows={6}
      />
    </div>
  );
}

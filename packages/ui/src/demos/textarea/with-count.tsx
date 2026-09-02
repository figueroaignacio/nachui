import { Textarea } from '../../components/textarea';

export function WithCount() {
  return (
    <div className="w-full max-w-sm">
      <Textarea
        label="Short bio"
        defaultValue="Platform engineer at Northwind Labs. I keep the deploy pipeline boring."
        maxLength={160}
        showCount
        rows={3}
      />
    </div>
  );
}

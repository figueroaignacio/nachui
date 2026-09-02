import { Textarea } from '../../components/textarea';

export function WithLabel() {
  return (
    <div className="w-full max-w-sm">
      <Textarea
        label="Incident summary"
        description="Shown on the public status page while the incident is open."
        placeholder="Elevated error rates on the EU region"
        rows={4}
      />
    </div>
  );
}

'use client';

import { Tool } from '../../ai/tool';

export function Statuses() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Tool status="pending">
        <Tool.Header name="analyze_job_description" description="Waiting for the previous call" />
        <Tool.Content>
          <Tool.Input value={{ body: 'Senior frontend engineer, remote, React and Next.js' }} />
        </Tool.Content>
      </Tool>
      <Tool status="running">
        <Tool.Header name="get_experience" description="Reading the work history" />
        <Tool.Content>
          <Tool.Input value={{ locale: 'en' }} />
        </Tool.Content>
      </Tool>
      <Tool status="complete">
        <Tool.Header name="get_projects" description="3 projects returned" />
        <Tool.Content>
          <Tool.Input value={{ locale: 'en', limit: 3 }} />
          <Tool.Output value={['nachui', 'portfolio', 'links']} />
        </Tool.Content>
      </Tool>
      <Tool status="error" defaultOpen>
        <Tool.Header name="send_contact_email" description="The mail provider rejected it" />
        <Tool.Content>
          <Tool.Input value={{ to: 'contact@ignaciofigueroa.dev', subject: 'Hi' }} />
          <Tool.Output error value="422 Unprocessable Entity: recipient domain is not verified" />
        </Tool.Content>
      </Tool>
    </div>
  );
}

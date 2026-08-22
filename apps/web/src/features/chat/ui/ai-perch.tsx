import { AiFace } from './ai-face';
import type { AiExpression } from './ai-avatar';

type AiPerchProps = {
  width?: number;
  expression?: AiExpression;
  className?: string;
};

export function AiPerch({ width = 44, expression = 'awake', className }: AiPerchProps) {
  return (
    <svg
      width={width}
      height={(width * 24) / 32}
      viewBox="0 0 32 24"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-hidden="true"
      data-expression={expression}
      className={className ? `ai-avatar ai-perch ${className}` : 'ai-avatar ai-perch'}
    >
      <g className="ai-breathe">
        <g transform="translate(4 0)">
          <AiFace cropped />
        </g>
      </g>
      <g className="ai-leg-dangle">
        <rect x="12" y="24" width="3" height="5" fill="#E8845A" />
        <rect x="11" y="29" width="4" height="1" fill="#D4704A" />
      </g>
      <g className="ai-leg-dangle">
        <rect x="17" y="24" width="3" height="5" fill="#E8845A" />
        <rect x="17" y="29" width="4" height="1" fill="#D4704A" />
      </g>
    </svg>
  );
}

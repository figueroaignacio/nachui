import { AiFace } from './ai-face';

type AiWorkingProps = {
  width?: number;
};

export function AiWorking({ width = 64 }: AiWorkingProps) {
  return (
    <svg
      width={width}
      height={(width * 30) / 32}
      viewBox="0 0 32 30"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-hidden="true"
      data-expression="working"
      className="ai-avatar ai-scene"
    >
      <g className="ai-lean">
        <g className="ai-breathe">
          <g transform="translate(4 1)">
            <AiFace lit />
          </g>
        </g>
      </g>

      <g className="ai-laptop">
        <g className="ai-lid">
          <rect x="7" y="17" width="18" height="8" fill="#444" />
          <rect x="8" y="18" width="16" height="6" fill="#3A3A3A" />
          <rect className="ai-mark" x="14" y="20" width="4" height="3" fill="#2F2F2F" />
          <rect className="ai-spill" x="8" y="17" width="16" height="1" fill="#A8E6D7" />
        </g>

        <rect x="5" y="25" width="22" height="3" fill="#333" />
        <rect x="7" y="26" width="18" height="1" fill="#555" />
        <rect x="4" y="27" width="24" height="1" fill="#555" />

        <g className="ai-hands">
          <g className="ai-hand">
            <rect x="9" y="25" width="4" height="2" fill="#E8845A" />
            <rect x="9" y="25" width="4" height="1" fill="#D4704A" />
          </g>
          <g className="ai-hand">
            <rect x="19" y="25" width="4" height="2" fill="#E8845A" />
            <rect x="19" y="25" width="4" height="1" fill="#D4704A" />
          </g>
        </g>
      </g>
    </svg>
  );
}

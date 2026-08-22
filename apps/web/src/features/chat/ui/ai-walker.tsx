import { AiFace } from './ai-face';

type AiWalkerProps = {
  width?: number;
};

export function AiWalker({ width = 56 }: AiWalkerProps) {
  return (
    <svg
      width={width}
      height={(width * 28) / 32}
      viewBox="0 0 32 28"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-hidden="true"
      data-expression="working"
      className="ai-avatar ai-walking"
    >
      <g className="ai-sit">
        <g className="ai-gait">
          <g className="ai-lean">
            <g className="ai-breathe">
              <g transform="translate(4 0)">
                <AiFace cropped lit />
              </g>
            </g>
          </g>

          <g className="ai-legs-walk">
            <g className="ai-leg-frame">
              <rect x="10" y="24" width="3" height="3" fill="#E8845A" />
              <rect x="19" y="24" width="3" height="3" fill="#E8845A" />
              <rect x="9" y="27" width="4" height="1" fill="#D4704A" />
              <rect x="19" y="27" width="4" height="1" fill="#D4704A" />
            </g>
            <g className="ai-leg-frame">
              <rect x="12" y="24" width="3" height="3" fill="#E8845A" />
              <rect x="17" y="24" width="3" height="3" fill="#E8845A" />
              <rect x="12" y="27" width="3" height="1" fill="#D4704A" />
              <rect x="17" y="27" width="3" height="1" fill="#D4704A" />
            </g>
          </g>

          <g className="ai-legs-sit">
            <g className="ai-leg-dangle">
              <rect x="12" y="24" width="3" height="5" fill="#E8845A" />
              <rect x="11" y="29" width="4" height="1" fill="#D4704A" />
            </g>
            <g className="ai-leg-dangle">
              <rect x="17" y="24" width="3" height="5" fill="#E8845A" />
              <rect x="17" y="29" width="4" height="1" fill="#D4704A" />
            </g>
          </g>
        </g>

        <g transform="translate(0 -1)">
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
        </g>
      </g>
    </svg>
  );
}

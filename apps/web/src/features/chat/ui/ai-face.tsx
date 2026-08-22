type AiFaceProps = {
  lit?: boolean;
  cropped?: boolean;
};

export function AiFace({ lit = false, cropped = false }: AiFaceProps) {
  return (
    <>
      <path fill="#2C1810" d="M6 1h12v3H6ZM5 2h14v3H5Z" />
      <path fill="#E8845A" d="M4 4h16v12H4Z" />
      <path fill="#D4704A" d="M2 8h2v5H2Zm18 0h2v5h-2Z" />
      <path fill="#E8845A" d="M10 16h4v2h-4Z" />
      {cropped ? (
        <>
          <path fill="#1a1a1a" d="M4 18h16v6H4Z" />
          <path fill="#2a2a2a" d="M9 18h6v6H9Z" />
          <path fill="#111" d="M2 19h2v5H2Zm18 0h2v5h-2Z" />
        </>
      ) : (
        <>
          <path fill="#1a1a1a" d="M0 18h24v6H0Z" />
          <path fill="#2a2a2a" d="M9 18h6v6H9Z" />
          <path fill="#111" d="M0 18h3v6H0Zm21 0h3v6h-3Z" />
        </>
      )}
      {lit && <rect className="ai-glow" x="4" y="4" width="16" height="12" fill="#A8E6D7" />}
      <g className="ai-eyes">
        <g className="ai-eye">
          <rect x="6" y="9" width="5" height="2" fill="#2C1810" />
          {lit && <rect className="ai-glint" x="7" y="10" width="3" height="1" fill="#A8E6D7" />}
        </g>
        <g className="ai-eye">
          <rect x="13" y="9" width="5" height="2" fill="#2C1810" />
          {lit && <rect className="ai-glint" x="14" y="10" width="3" height="1" fill="#A8E6D7" />}
        </g>
      </g>
      <g className="ai-headset">
        <path fill="#222" d="M5 2h14v2H5ZM3 3h2v6H3Zm16 0h2v6h-2Z" />
        <path fill="#444" d="M2 8h4v5H2Z" />
        <path fill="#333" d="M2 9h2v3H2Z" />
        <path fill="#444" d="M18 8h4v5h-4Z" />
        <path fill="#333" d="M20 9h2v3h-2Z" />
        <path fill="#333" d="M21 12h1v4h-1Z" />
        <path fill="#444" d="M20 15h3v2h-3Z" />
      </g>
    </>
  );
}

import { useState } from "react";
import "../../css/Posts.css";

type Props = {
  text?: string | null;
  lines?: number; //default 2
};

const ExpandableText = ({ text, lines = 2 }: Props) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  return (
    <div>
      <div
        className={
          expanded ? "post-text" : `post-text post-text-clamp-${lines}`
        }
      >
        {text}
      </div>
      <button
        type="button"
        className="post-text-toggle"
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? "Show less" : "_other"}
      </button>
    </div>
  );
};
export default ExpandableText;

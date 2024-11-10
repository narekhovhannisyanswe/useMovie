import { useState } from 'react';

export default function TextExpander({
  collapsedNumWords = 20,
  expandButtonText = 'Show text',
  collapseButtonText = 'Collapse text',
  buttonColor = 'ff6622',
  children,
}) {
  const [collapsed, setCollapsed] = useState(false);

  const handleExpandClick = () => setCollapsed((collapsed) => !collapsed);

  const text = collapsed
    ? (children || '').split(' ').slice(0, collapsedNumWords).join(' ') + '...'
    : children;

  return (
    <div>
      {text}
      <span
        style={{ color: buttonColor, cursor: 'pointer' }}
        onClick={handleExpandClick}
      >
        {collapsed ? expandButtonText : collapseButtonText}
      </span>
    </div>
  );
}

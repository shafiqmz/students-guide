import React from 'react';
import Tooltip from '@mui/material/Tooltip';

function TruncatedTextWithTooltip({ text, maxLength }) {
  const truncatedText = text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  return (
    <Tooltip enterDelay={1500} title={text} arrow>
      <span>{truncatedText}</span>
    </Tooltip>
  );
}

export default TruncatedTextWithTooltip;

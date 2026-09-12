import React from 'react';

interface Props {
  announcement: string;
}

export const ScreenReaderAnnouncer: React.FC<Props> = ({ announcement }) => {
  return (
    <div
      id="sr-announcer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};

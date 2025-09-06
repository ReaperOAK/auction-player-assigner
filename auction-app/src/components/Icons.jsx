import React from 'react';

export const IconTrophy = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M8 3h8v2a4 4 0 01-4 4 4 4 0 01-4-4V3z" fill="currentColor" opacity=".95" />
    <path d="M4 7v2a6 6 0 006 6v3H8v2h8v-2h-2v-3a6 6 0 006-6V7h-2" stroke="currentColor" strokeWidth="0" fill="currentColor" />
  </svg>
);

export const IconEdit = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4 13.5V16h2.5L15.87 6.63l-2.5-2.5L4 13.5z" fill="currentColor" />
  </svg>
);

export const IconTrash = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M6 7v7a2 2 0 002 2h4a2 2 0 002-2V7H6z" fill="currentColor" />
    <path d="M8 3h4l1 1h3v2H4V4h3l1-1z" fill="currentColor" />
  </svg>
);

export const IconMale = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="11" cy="8" r="3" fill="currentColor" />
    <path d="M5 21c0-3 4-5 6-5s6 2 6 5" fill="currentColor" />
  </svg>
);

export const IconFemale = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="7" r="3" fill="currentColor" />
    <path d="M9 14h6v2H9v3H7v-3H5v-2h2v-1a3 3 0 016 0v1z" fill="currentColor" />
  </svg>
);

export const IconWarning = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M10 2L2 18h16L10 2z" fill="currentColor" />
  </svg>
);

export default null;

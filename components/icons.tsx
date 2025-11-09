import React from 'react';

export const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const CodeBracketIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

export const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const SparklesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m11-13l-1.06-1.06a2 2 0 00-2.83 0L12 5l-1.06-1.06a2 2 0 00-2.83 0L7.05 5.05a2 2 0 000 2.83L12 12l4.95-4.95a2 2 0 000-2.83z" />
    </svg>
);

export const XMarkIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const LogoutIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
);

export const Cog6ToothIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.11.55.897.09 1.996.606 2.546.517.55.158 1.533.685 2.053.527.52.158 1.533.685 2.053.527.52.158 1.533.685 2.053l-.22.22c-.527-.52-.158-1.533-.685-2.053-.527-.52-.158-1.533-.685-2.053-.516-.55-.09-1.649-.606-2.546-.55-.897-1.02-.368-1.11.11.09.542-.56 1.007-1.11.11-.55-.897-.09-1.996-.606-2.546-.517-.55-.158-1.533-.685-2.053-.527-.52-.158-1.533-.685-2.053-.527-.52-.158-1.533-.685-2.053l.22-.22c.527.52.158 1.533.685 2.053.527.52.158 1.533.685 2.053.516.55.09 1.649.606 2.546.55.897 1.02.368 1.11-.11zM12 6.536a5.464 5.464 0 1 0 0 10.928 5.464 5.464 0 0 0 0-10.928z" />
    </svg>
);

export const TrashIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.033-2.124H8.033c-1.12 0-2.033.944-2.033 2.124v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

export const ChatBubbleLeftRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.372c-1.03.103-1.98-.7-1.98-1.728v-4.286c0-.97.616-1.813 1.5-2.097L20.25 8.511zM10.5 15.622v-4.286c0-.97.616-1.813 1.5-2.097l1.722-.574c.884-.284 1.5.558 1.5 1.528v4.286c0 .97-.616 1.813-1.5 2.097l-1.722.574c-.884.284-1.5-.558-1.5-1.528zM3 14.25v-4.286c0-.97.616-1.813 1.5-2.097l1.722-.574c.884-.284 1.5.558 1.5 1.528v4.286c0 .97-.616 1.813-1.5 2.097l-1.722.574c-.884.284-1.5-.558-1.5-1.528z" />
    </svg>
);

export const CpuChipIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M12 18.75v-1.5m3.75-1.5v-1.5m-7.5 0v1.5m7.5-3v-1.5m-7.5 0v1.5m7.5-3v-1.5m-7.5 0v1.5m7.5-3V3m-7.5 0V3m3.75 18v-1.5m-3.75 0v-1.5m3.75-3v-1.5m-3.75 0v-1.5m3.75-3V3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5H7.5c-2.485 0-4.5 2.015-4.5 4.5v7.5c0 2.485 2.015 4.5 4.5 4.5h7.5c2.485 0 4.5-2.015 4.5-4.5v-7.5z" />
    </svg>
);

export const UserGroupIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-1.063M15 19.128v-3.872M15 19.128l-2.625-.372a9.337 9.337 0 0 0-4.121 1.063M3 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-1.063M3 19.128v-3.872M3 19.128l2.625-.372a9.337 9.337 0 0 0 4.121 1.063m0 0a9.283 9.283 0 0 1-3.473-.762m3.473-.762a9.283 9.283 0 0 0-3.473-.762m0 0a9.283 9.283 0 0 0 3.473.762m-3.473.762L9 15m0 0a9.283 9.283 0 0 1-3.473-.762M9 15a9.283 9.283 0 0 0-3.473-.762m0 0a9.283 9.283 0 0 1 3.473.762M9 15v3.872m0 0l-2.625-.372a9.337 9.337 0 0 1-4.121 1.063M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const ClockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

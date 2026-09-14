export const paths = {
  home: '/',
  applications: '/applications',
  application: (id: string) => `/applications/${encodeURIComponent(id)}`,
} as const;

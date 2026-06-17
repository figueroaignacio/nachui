export const namespaces = {
  en: async () => ({
    ui: (await import('../locales/en/ui.json')).default,
    sections: (await import('../locales/en/sections.json')).default,
    components: (await import('../locales/en/components.json')).default,
    docs: (await import('../locales/en/docs.json')).default,
    siteConfig: (await import('../locales/en/siteConfig.json')).default,
    pages: (await import('../locales/en/pages.json')).default,
  }),
  es: async () => ({
    ui: (await import('../locales/es/ui.json')).default,
    sections: (await import('../locales/es/sections.json')).default,
    components: (await import('../locales/es/components.json')).default,
    docs: (await import('../locales/es/docs.json')).default,
    siteConfig: (await import('../locales/es/siteConfig.json')).default,
    pages: (await import('../locales/es/pages.json')).default,
  }),
} as const;

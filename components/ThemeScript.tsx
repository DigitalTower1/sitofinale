import Script from 'next/script';

const THEME_SCRIPT = `(() => {
  const storageKey = 'digital-tower-theme';
  const root = document.documentElement;
  const body = document.body;

  const removeInlineStyles = () => {
    root.removeAttribute('style');
    if (body) {
      body.removeAttribute('style');
    }
  };

  const apply = (theme) => {
    root.dataset.theme = theme;
    if (body) {
      body.dataset.theme = theme;
    }
  };

  removeInlineStyles();

  try {
    const stored = window.localStorage.getItem(storageKey);
    const systemPrefersLight = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: light)').matches;
    const theme = stored === 'light' || stored === 'dark' ? stored : systemPrefersLight ? 'light' : 'dark';
    apply(theme);
  } catch (error) {
    apply('dark');
  }
})();`;

export function ThemeScript() {
  return <Script id="theme-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}

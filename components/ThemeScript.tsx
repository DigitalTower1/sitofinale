const THEME_SCRIPT = `(() => {
  const storageKey = 'digital-tower-theme';
  const root = document.documentElement;
  const body = document.body;

  const apply = (theme) => {
    root.dataset.theme = theme;
    if (body) {
      body.dataset.theme = theme;
    }
  };

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
  return <script id="theme-script" dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}

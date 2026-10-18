/** Telegram-only adapter. Existing website appearance and browser behavior stay unchanged. */
export type TelegramInset = { top?: number; bottom?: number; left?: number; right?: number };
export type TelegramBackButton = {
  show: () => void;
  hide: () => void;
  onClick: (handler: () => void) => void;
  offClick: (handler: () => void) => void;
};
export type TelegramMiniApp = {
  initData?: string;
  platform?: string;
  ready: () => void;
  expand: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  setBottomBarColor?: (color: string) => void;
  safeAreaInset?: TelegramInset;
  contentSafeAreaInset?: TelegramInset;
  onEvent?: (event: string, handler: () => void) => void;
  offEvent?: (event: string, handler: () => void) => void;
  BackButton?: TelegramBackButton;
  HapticFeedback?: { impactOccurred?: (style: 'light' | 'medium' | 'heavy') => void };
};

declare global {
  interface Window { Telegram?: { WebApp?: TelegramMiniApp }; }
}

/** Do not rely on initDataUnsafe for authentication. Only signed initData goes to the API. */
export function telegramApp(): TelegramMiniApp | null {
  const app = window.Telegram?.WebApp;
  if (!app || typeof app.ready !== 'function') return null;
  // The SDK can exist in a normal browser, but no Telegram session has been established.
  const parameters = `${window.location.search}&${window.location.hash}`;
  return app.initData || (app.platform && app.platform !== 'unknown') || /tgWebApp(Data|Platform|Version|ThemeParams)/.test(parameters) ? app : null;
}

export function telegramInitData(): string {
  return telegramApp()?.initData || '';
}

/** Call once, inside the React app. No UI elements are added. */
export function mountTelegram(): () => void {
  const app = telegramApp();
  if (!app) return () => {};
  const root = document.documentElement;
  root.classList.add('agrohub-in-telegram');
  const syncInsets = () => {
    const inset = app.contentSafeAreaInset || app.safeAreaInset || {};
    // Nonnegative numeric values only, never a raw CSS string from an external source.
    const safe = (v: number | undefined) => Math.max(0, Math.min(100, Number(v) || 0));
    root.style.setProperty('--agro-tg-top', `${safe(inset.top)}px`);
    root.style.setProperty('--agro-tg-bottom', `${safe(inset.bottom)}px`);
  };
  syncInsets();
  app.onEvent?.('safeAreaChanged', syncInsets);
  app.onEvent?.('contentSafeAreaChanged', syncInsets);
  try { app.setHeaderColor?.('#18372a'); } catch { /* older Telegram clients */ }
  try { app.setBackgroundColor?.('#f7f8f5'); } catch { /* older Telegram clients */ }
  try { app.setBottomBarColor?.('#f7f8f5'); } catch { /* older Telegram clients */ }
  app.expand();
  // Reveal the WebView after React has committed the first interface.
  app.ready();
  return () => {
    app.offEvent?.('safeAreaChanged', syncInsets);
    app.offEvent?.('contentSafeAreaChanged', syncInsets);
    root.classList.remove('agrohub-in-telegram');
    root.style.removeProperty('--agro-tg-top');
    root.style.removeProperty('--agro-tg-bottom');
  };
}

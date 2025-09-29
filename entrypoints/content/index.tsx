import '@/styles/app.scss';
import App from './App.tsx';
import { createRoot } from 'react-dom/client';

// TODO: extract to separate package
enum TradeDomain {
  GLOBAL = 'pathofexile.com',
  GLOBAL_WWW = 'www.pathofexile.com',
  BRAZIL = 'br.pathofexile.com',
  RUSSIA = 'ru.pathofexile.com',
  THAILAND = 'th.pathofexile.com',
  GERMANY = 'de.pathofexile.com',
  FRANCE = 'fr.pathofexile.com',
  SPAIN = 'es.pathofexile.com',
  JAPAN = 'jp.pathofexile.com',
  KOREA = 'poe.game.daum.net',
}

const WEB_ACCESSIBLE_MATCHES = Array.from(
  new Set((Object.values(TradeDomain) as TradeDomain[]).map(domain => `https://${domain}/*`)),
);

export default defineContentScript({
  matches: WEB_ACCESSIBLE_MATCHES,

  async main(ctx) {
    console.log('Hello content script.');

    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      append: 'last',
      onMount: container => {
        container.id = 'better-trading-container';
        const root = createRoot(container);
        root.render(<App />);

        return { root };
      },
      onRemove: elements => {
        elements?.root.unmount();
      },
    });

    ui.mount();
  },
});

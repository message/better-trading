import './main.css';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

export default defineContentScript({
  matches: ['*://*/*'],

  async main(ctx) {
    console.log('Hello content script.');

    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      append: 'last',
      onMount: (container) => {
        container.id = 'better-trading';
        const root = ReactDOM.createRoot(container);
        root.render(<App />);

        return { root };
      },
      onRemove: (elements) => {
        elements?.root.unmount();
      },
    });

    ui.mount();
  },
});

import "./main.css"
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

export default defineContentScript({
    matches: ["*://*/*"],
    cssInjectionMode: "ui",

    async main(ctx) {
        console.log("Hello content script.");

        const ui = await createShadowRootUi(ctx, {
            name: 'better-trading',
            position: 'inline',
            anchor: 'body',
            append: 'last',
            onMount: (container) => {
                // Create wrapper inside the target container
                const wrapper = document.createElement('div');
                wrapper.id = 'better-trading-container';
                container.append(wrapper);

                const root = ReactDOM.createRoot(wrapper);
                root.render(<App />);
                return {root, wrapper};
            },
            onRemove: (elements) => {
                elements?.root.unmount();
                elements?.wrapper.remove();
            },
        });

        ui.mount();
    },
});

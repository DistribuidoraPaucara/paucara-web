import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';

createServer((page) => {
    // Get appName from Inertia props (passed by Laravel middleware) or fallback to env/default
    const appName = (page.props as any).name || import.meta.env.VITE_APP_NAME || 'Laravel';

    return createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) => resolvePageComponent(`./presentation/pages/${name}.tsx`, import.meta.glob('./presentation/pages/**/*.tsx')),
        setup: ({ App, props }) => {
            return <App {...props} />;
        },
    });
});

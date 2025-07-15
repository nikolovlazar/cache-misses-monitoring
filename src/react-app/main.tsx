import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  RouterProvider,
  useLocation,
  useNavigationType,
} from 'react-router';

import App from './App';
import LiveSearch from './LiveSearch';
import Layout from './Layout';

import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://07211b41ecf7997e52c6e989795f3cb7@o4506044970565632.ingest.us.sentry.io/4509668555882496',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.reactRouterV7BrowserTracingIntegration({
      useEffect: useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/cache-misses-monitoring\.lazar-nikolov-94\.workers\.dev\/api/,
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const sentryCreateBrowserRouter =
  Sentry.wrapCreateBrowserRouterV7(createBrowserRouter);

const router = sentryCreateBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'live-search',
        element: <LiveSearch />,
      },
    ],
  },
]);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Provider } from 'react-redux'
import { store } from './src/store/globalStore'
import { Button } from "./src/components/imported/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "./src/components/layout/Navbar/nav.bar";
import Footer from "./src/components/layout/Footer/footer";

import "./app.css";
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Cinzel:wght@400;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Descubra a essência da moda com Ecliptica. Um universo onde sofisticação, mistério e autenticidade se encontram." />
        <meta name="keywords" content="moda, sofisticação, estilo, ecliptica, exclusividade, elegância, tendência, moda masculina, moda feminina, streetwear, luxo" />
        <meta property="og:title" content="Ecliptica - A Revolução da Moda Sofisticada" />
        <meta property="og:description" content="Mergulhe na moda enigmática e exclusiva da Ecliptica. Uma experiência para quem busca mais do que roupas, mas identidade." />
        <meta property="og:image" content="https://i.pinimg.com/736x/93/55/dd/9355dd0f9547309097693976b6114585.jpg" />
        <meta property="og:url" content="https://www.ecliptica.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ecliptica - Moda Atemporal e Misteriosa" />
        <meta name="twitter:description" content="Descubra a essência da moda com Ecliptica. Um universo onde sofisticação, mistério e autenticidade se encontram." />
        <meta name="twitter:image" content="/og-image.jpg" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.svg" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}


export default function App() {
  // Detecta ambiente
  const isServer = typeof window === 'undefined';
  
  // No servidor, renderiza sem Redux
  if (isServer) {
    return (
      <>
        <Navbar />
        <Outlet />
        <Footer />
      </>
    );
  }
  
  // No cliente, renderiza com Redux
  return (
    <Provider store={store}>
      <Navbar />
      <Outlet />
      <Footer />
    </Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let statusCode = "404"
  let message = "Page not found"
  let details = "The page you are looking for doesn't exist or has been moved."
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    statusCode = error.status.toString()
    message = error.status === 404 ? "Page not found" : "An error occurred"
    details =
      error.status === 404
        ? "The page you are looking for doesn't exist or has been moved."
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    message = "Development Error"
    details = error.message
    stack = error.stack
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-light tracking-tighter text-black mb-2">{statusCode}</h1>
          <div className="h-px w-16 bg-black/20 mx-auto mb-8" />
          <h2 className="text-xl font-light uppercase tracking-widest text-black mb-4">{message}</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">{details}</p>
          <Button
            variant="outline"
            className="rounded-none border-black text-black hover:bg-black hover:text-white transition-colors duration-300"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {stack && (
          <pre className="mt-8 p-4 bg-gray-50 border border-gray-200 text-left text-xs overflow-x-auto rounded-md">
            <code className="text-gray-800">{stack}</code>
          </pre>
        )}
      </div>
    </div>
  )
}

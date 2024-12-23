import { Links, Meta, Outlet, ScrollRestoration, Scripts, LiveReload } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import React from "react";
import Header from "./components/header";
import { useEffect } from "react";

import styles from "./tailwind.css?url";

export const meta: MetaFunction = () => {
  useEffect(() => {
    console.log("App hydrated on the client");
  }, []);
  return [
    { title: "Videotheek" },
    { name: "description", content: "Stageopdracht" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  { rel: "stylesheet", href: styles },
];

// https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap

// Define Layout to accept children
export function Layout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Layout>
      <Header />
      <Outlet />
    </Layout>
  );
}

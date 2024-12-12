import "./globals.css";

export const metadata = {
  title: "Sports-book",
  description: "Sports-book app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap" />

      </head>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}

import "./globals.css";

export const metadata = {
  title: "Sports-book",
  description: "Sports-book app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

import { Header } from "@/components/header";
import "@/app/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <Header></Header>
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}

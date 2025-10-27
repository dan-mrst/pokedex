import { Header } from "@/components/header/component";
import "@/app/globals.css";

export const metadata = {
  title: {
    template: "%s｜ポケモン図鑑",
    default: "ポケモン図鑑",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Header></Header>
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}

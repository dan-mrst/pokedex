"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";

export function Header() {
  const pathname = usePathname();

  const navigationItems = [
    { href: "/", label: "ホーム" },
    { href: "/pokemon", label: "ポケモン一覧" },
    { href: "/search", label: "ポケモン検索" },
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            ポケモン図鑑
          </Link>
          <nav>
            <ul className="flex items-center gap-8">
              {navigationItems.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className={
                      pathname === item.href
                        ? `${styles["navlink"]} ${styles["navlink--active"]}`
                        : `${styles["navlink"]}`
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

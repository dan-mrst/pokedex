"use client";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";
import { House, Grid3x2, Search } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  const navigationItems = [
    { href: "/", label: "ホーム", short: "ホーム", icon: <House /> },
    {
      href: "/pokemon",
      label: "ポケモン一覧",
      short: "一覧",
      icon: <Grid3x2 />,
    },
    { href: "/search", label: "ポケモン検索", short: "検索", icon: <Search /> },
  ];

  return (
    <header className="shadow-sm border-b bg-gray-700">
      <div className="wrapper py-1">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-secondary-400">
            ポケモン図鑑
          </Link>
          <nav>
            <ul className="flex items-center gap-8">
              {navigationItems.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className={clsx(
                      styles.navlink,
                      pathname === item.href ? styles["navlink--active"] : ""
                    )}
                  >
                    {item.icon}
                    <span className="block md:hidden text-xs">
                      {item.short}
                    </span>
                    <span className="hidden md:block">{item.label}</span>
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

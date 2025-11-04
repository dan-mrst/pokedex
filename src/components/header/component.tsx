"use client";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";
import { House, Grid3x2, Search } from "lucide-react";

import { TransitionLink } from "@/components/transition-link";

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
    <header className="shadow-sm border-b bg-gray-700 sticky top-0 z-999">
      <div className="wrapper py-1">
        <div className="flex justify-between items-center h-16">
          <TransitionLink
            href="/"
            className="text-xl font-bold text-secondary-400 flex gap-2"
          >
            <Image src="/pokedex.svg" width={24} height={24} alt="" />
            ポケモン図鑑
          </TransitionLink>
          <nav>
            <ul className="flex items-center gap-8">
              {navigationItems.map((item, i) => (
                <li key={i}>
                  <TransitionLink
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
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <PageTransitionBar />
    </header>
  );
}

function PageTransitionBar() {
  return (
    <div
      id="page-transition"
      className="absolute -bottom-1.5 w-full h-1.5 overflow-hidden hidden"
    >
      <div className="relative w-80 h-full bg-secondary-400"></div>
    </div>
  );
}

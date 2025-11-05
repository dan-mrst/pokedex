"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { cn } from "@/utils/utils";

interface Props {
  href: string;
  children: React.ReactNode;
}

export const useTransitionReset = () => {
  const router = useRouter();

  useEffect(() => {
    const animator = document.getElementById("page-transition")!;
    animator.classList.remove("page-transition-animation");
  }, [router]);
};

/**
 * アニメーション終了用の空コンポーネント
 */
export function TransitionReset() {
  useTransitionReset();
  return <></>;
}

/**
 * ページ遷移アニメーションを起動するLinkのラッパーコンポーネント
 */
export function TransitionLink({
  className,
  ...props
}: Omit<React.ComponentProps<"a">, "props"> & Props) {
  const router = useRouter();
  const clickEventHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const animator = document.getElementById("page-transition")!;
    animator.classList.add("page-transition-animation");
    setTimeout(() => {
      router.push(props.href);
    }, 10);
  };

  return (
    <Link
      href={props.href}
      className={cn(className)}
      onClick={clickEventHandler}
    >
      {props.children}
    </Link>
  );
}

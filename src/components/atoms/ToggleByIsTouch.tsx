"use client";
import { ReactNode } from "react";

import { isTouchDevice } from "@/utils/utils";

interface Props {
  touch: string | ReactNode;
  click: string | ReactNode;
}

/**
 * タッチデバイスかどうかを判定して要素をトグル表示
 */
export function ToggleByIsTouch({ touch, click }: Props) {
  return <>{isTouchDevice() ? touch : click}</>;
}

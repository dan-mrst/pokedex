"use client";

import { useRef } from "react";
import Image from "next/image";

import { ProcessedEvolutionDetails, pokemonBasic } from "@/lib/types";
import { evolutionTriggerTranslations } from "@/lib/constants";
import { toDegrees } from "@/lib/functions";

import useGetElementProperty from "@/lib/UseGetElementProperty";
import { Vector } from "@/lib/Vector";

interface EvolutionBranchProps {
  parent?: pokemonBasic;
  node: { id: number; size: number; depth: number; y: number };
  branch: Vector;
  details: ProcessedEvolutionDetails[];
  isFocused: boolean;
  isHorizontal: boolean;
}

export function EvolutionBranch({
  parent,
  node,
  branch,
  details,
  isFocused,
  isHorizontal,
}: EvolutionBranchProps) {
  const isParentScrolledOut = node.y < branch.y - node.size;

  const shouldDetailsStick = !isHorizontal && isFocused && isParentScrolledOut;

  const BRANCH_STROKE = 8;

  const ARROW_WIDTH = 24;
  const ARROW_HEIGHT = 28;

  const PARENT_SIZE = 48;

  const detailRef = useRef<HTMLDivElement>(null);
  const { getElementProperty } = useGetElementProperty<HTMLDivElement | null>(
    detailRef
  );
  const detailRect = getElementProperty();

  /**
   * 進化詳細の配列の大きさで要素の高さを見積り
   */
  const provisionalDH =
    16 *
    (details.length +
      details.reduce((sum, detail) => {
        return sum + detail.requirements.length;
      }, 0));

  const DETAIL_WIDTH = isHorizontal ? 120 : 160;
  const DETAIL_HEIGHT =
    detailRect.height > 0 ? detailRect.height : provisionalDH;

  const focusedZIndex = isHorizontal ? 2 : 100 - node.depth;

  /**
   * detailの中心位置
   */
  const detailCenter = new Vector(DETAIL_WIDTH, DETAIL_HEIGHT).mult(1 / 2);

  /**
   * 枝の矢印の中点に移動
   */
  const detailShifter = branch.mult(1 / 2);

  /**
   * branch方向に矢尻のすぐ上へスライド
   */
  const stickyShifter = branch.scale(DETAIL_HEIGHT / 2 + ARROW_WIDTH);

  /**
   * 横配置の時はx方向、縦配置の時はy方向にNodeの半径分調整
   */
  const nodeOffset = new Vector(
    Number(isHorizontal),
    Number(!isHorizontal)
  ).mult(node.size / 2);

  /**
   * detailの位置ベクトル
   *  detailの中心をNodeの中心に一致させ、branch方向へ半分だけスライド
   */
  const detail = shouldDetailsStick
    ? detailCenter.add(stickyShifter)
    : detailCenter.sub(nodeOffset).add(detailShifter);

  /**
   * 親Node（進化元）が見えない時はdetailの上に小さく表示
   * 　stickyParentの中心をNodeの中心に一致させ、detailの高さを超えるようにbranch方向へスライド
   */
  const stickyParent = new Vector(1, 1)
    .mult(PARENT_SIZE / 2)
    .sub(nodeOffset)
    .add(branch.scale(DETAIL_HEIGHT + PARENT_SIZE + node.size / 2 + 16));

  /**
   * 矢尻の位置
   */
  const arrowHead = isHorizontal
    ? new Vector(0, -ARROW_HEIGHT / 2)
    : new Vector(node.size / 2, node.size / 2 - ARROW_WIDTH / 1.5);

  const rot = toDegrees(branch.elevation);

  return (
    <div className="relative">
      <div
        data-part="branch"
        className={`absolute bg-gray-300 ${
          isFocused ? "shadow-lg bg-secondary-500" : ""
        }`}
        style={{
          width: `${branch.norm}px`,
          height: `${BRANCH_STROKE}px`,
          transformOrigin: "100% 50%",
          left: `${nodeOffset.x - branch.norm}px`,
          top: `${nodeOffset.y}px`,
          transform: `rotate(${rot}deg)`,
          zIndex: isFocused ? `${focusedZIndex}` : "-1",
          clipPath: `polygon(0 0,calc(100% - ${
            node.size / 2 + ARROW_WIDTH / 2
          }px) 0,calc(100% - ${
            node.size / 2 + ARROW_WIDTH / 2
          }px) 100%,0 100%)`,
        }}
      ></div>
      <span
        data-part="arrow-head"
        className={` bg-gray-300 ${
          isFocused ? "shadow-lg bg-secondary-500" : ""
        }`}
        style={{
          position: "absolute",
          top: `${BRANCH_STROKE / 2 + arrowHead.y}px`,
          right: arrowHead.x,
          transformOrigin: "100% 50%",
          zIndex: isFocused ? "2" : "-1",
          transform: `translateX(${node.size / 2}px) rotate(${rot}deg)`,
          width: `${ARROW_WIDTH + node.size / 2}px`,
          height: `${ARROW_HEIGHT}px`,
          clipPath: `polygon(0 0,${ARROW_WIDTH}px 50%,0 100%)`,
        }}
      ></span>
      {parent && shouldDetailsStick && (
        <div
          data-part="sticky-parent"
          className="bg-white border-4 border-secondary-500 shadow-lg rounded-full absolute"
          style={{
            width: PARENT_SIZE,
            height: PARENT_SIZE,
            left: `${-stickyParent.x}px`,
            top: `${-stickyParent.y}px`,
            zIndex: isFocused ? "100" : "1",
          }}
        >
          <Image src={parent.imageUrl} width={40} height={40} alt="" />
        </div>
      )}
      <div
        ref={detailRef}
        data-part="detail"
        className={`${
          isHorizontal ? "" : "pointer-events-none"
        } absolute text-xs bg-white border-2 rounded-sm border-gray-500 cursor-pointer transition-transform duration-300 ${
          isFocused ? "shadow-lg border-secondary-600 scale-105" : ""
        }`}
        style={{
          left: `${-detail.x}px`,
          top: `${-detail.y}px`,
          width: `${DETAIL_WIDTH}px`,
          zIndex: isFocused ? "100" : "1",
        }}
      >
        <ul>
          {details.map((detail, d) => (
            <li key={d}>
              <div
                className={`{py-1 px-2 font-bold text-white bg-gray-500  ${
                  isFocused ? "bg-secondary-600 " : ""
                }}`}
              >
                {evolutionTriggerTranslations[detail.trigger] ?? detail.trigger}
              </div>
              {detail.requirements.length > 0 && (
                <ul>
                  {detail.requirements.map((rq, r) => (
                    <li
                      key={r}
                      className="px-2"
                    >{`${rq.title}：${rq.description}`}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

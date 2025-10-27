"use client";
import { ProcessedEvolutionDetails } from "@/lib/types";
import { evolutionTriggerTranslations } from "@/lib/constants";

interface EvolutionBranchProps {
  branch: {
    length: number;
    rot: number;
    nodeSize: number;
    gap: number;
  };
  details: ProcessedEvolutionDetails[];
  isFocused: boolean;
}

export function EvolutionBranch({
  branch,
  details,
  isFocused,
}: EvolutionBranchProps) {
  const BRANCH_STROKE = 8;

  const ARROW_WIDTH = 24;
  const ARROW_HEIGHT = 28;

  const DETAIL_WIDTH = 120;
  const DETAIL_HEIGHT =
    16 * details.length + 16 * details[0].requirements.length;
  const DETAIL_X = -DETAIL_WIDTH / 2 - branch.gap / 2;

  /**
   * Branchの描画長さの半分 + 自身の高さの半分だけ下げる
   */
  const DETAIL_Y =
    (branch.length * Math.sin((Math.PI * branch.rot) / 180)) / 2 +
    DETAIL_HEIGHT / 2;
  return (
    <div className="relative">
      <div
        className={`bg-gray-300 ${isFocused ? "shadow-lg bg-pink-300" : ""}`}
        style={{
          position: "absolute",
          width: `${branch.length}px`,
          height: `${BRANCH_STROKE}px`,
          transformOrigin: "100% 50%",
          transform: `translateX(-${
            branch.length - branch.nodeSize / 2
          }px) rotate(${branch.rot}deg)`,
          zIndex: isFocused ? "2" : "-1",
          clipPath: `polygon(0 0,calc(100% - ${
            branch.nodeSize / 2 + ARROW_WIDTH / 2
          }px) 0,calc(100% - ${
            branch.nodeSize / 2 + ARROW_WIDTH / 2
          }px) 100%,0 100%)`,
        }}
      ></div>
      <span
        className={` bg-gray-300 ${isFocused ? "shadow-lg bg-pink-300" : ""}`}
        style={{
          position: "absolute",
          top: `calc(50% + ${BRANCH_STROKE / 2}px - ${ARROW_HEIGHT / 2}px)`,
          right: 0,
          transformOrigin: "100% 50%",
          zIndex: isFocused ? "2" : "-1",
          transform: `translateX(${branch.nodeSize / 2}px) rotate(${
            branch.rot
          }deg)`,
          width: `${ARROW_WIDTH + branch.nodeSize / 2}px`,
          height: `${ARROW_HEIGHT}px`,
          clipPath: `polygon(0 0,${ARROW_WIDTH}px 50%,0 100%)`,
        }}
      ></span>
      <div
        className={`text-xs bg-white border-2 rounded-sm border-gray-500 cursor-pointer transition-shadow ${
          isFocused ? "shadow-lg border-pink-300 " : ""
        }`}
        style={{
          position: "absolute",
          left: `${DETAIL_X}px`,
          top: `calc(50% - ${DETAIL_Y}px)`,
          width: `${DETAIL_WIDTH}px`,
          minHeight: `${DETAIL_HEIGHT}px`,
          zIndex: isFocused ? "100" : "1",
        }}
      >
        <ul>
          {details.map((detail, d) => (
            <li key={d}>
              <div
                className={`{py-1 px-2 font-bold text-white bg-gray-500  ${
                  isFocused ? "bg-pink-300 " : ""
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

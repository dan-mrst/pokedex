/**
 * ひらがな文字列をカタカナ文字列に変換
 */
export function hiraToKata(hira: string): string {
  return hira.replace(/[ぁ-ん]/g, (match) => {
    const kataCode = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(kataCode);
  });
}

/**
 * 弧度法を度数法に変換
 * @param radians
 * @returns degrees
 */
export function toDegrees(radians: number) {
  return (radians / Math.PI) * 180;
}

/**
 * タッチデバイス判定
 * @returns boolean
 */
export const isTouchDevice = (): boolean => "ontouchstart" in window;

/**
 * ひらがな文字列をカタカナ文字列に変換
 */
export function hiraToKata(hira: string): string {
  return hira.replace(/[ぁ-ん]/g, (match) => {
    const kataCode = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(kataCode);
  });
}

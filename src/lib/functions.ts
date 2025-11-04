/**
 * ひらがな文字列をカタカナ文字列に変換
 * @param hira ひらがな文字列
 * @returns カタカナ文字列
 */
export function hiraToKata(hira: string): string {
  return hira.replace(/[ぁ-ん]/g, (match) => {
    const kataCode = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(kataCode);
  });
}

/**
 * 弧度法を度数法に変換
 * @param radians ラジアン
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

const convolvePromiseResults = async <T>(promises: Promise<T>[]) => {
  const results = await Promise.allSettled(promises);
  const values: T[] = [];
  const errors: unknown[] = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      values.push(result.value);
    } else {
      errors.push(result.reason);
    }
  });

  return {
    fulfilled: values,
    rejected: errors,
  };
};

const getRandomDelay = (baseDelay: number, variance: number = 1000): number => {
  return baseDelay + Math.floor(Math.random() * variance);
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const cluster = <T>(array: readonly T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export async function doFetchByDivision<T, D>(
  input: ReadonlyArray<T>,
  fn: (d: T) => Promise<D>,
  maximumTaskNumber: number = 100,
  intervalMillSeconds: number = 100
) {
  const batches = cluster(input, maximumTaskNumber);
  const dividedResults: { fulfilled: D[]; rejected: unknown[] }[] = [];

  for (const batch of batches) {
    //console.log(`Starting requests at ${new Date().toISOString()}`);
    const batchResults = await convolvePromiseResults(batch.map(fn));
    //console.log(`Finished requests at ${new Date().toISOString()}`);
    dividedResults.push(batchResults);
    await sleep(getRandomDelay(intervalMillSeconds));
  }

  const allResults = dividedResults.reduce(
    (all, current) => ({
      fulfilled: [...all.fulfilled, ...current.fulfilled],
      rejected: [...all.rejected, ...current.rejected],
    }),
    { fulfilled: [], rejected: [] }
  );

  return allResults;
}

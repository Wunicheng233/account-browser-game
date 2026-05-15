import { TAKEN_USERNAMES } from "./constants";

export interface UsernameSimilarity {
  candidate: string;
  normalized: string;
  closest: string;
  score: number;
  editDistance: number;
  blocked: boolean;
}

export function normalizeUsername(value: string): string {
  return value.toLowerCase().replace(/[0-9_.-]/g, "");
}

export function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }

  return dp[a.length][b.length];
}

function simpleSimilarity(a: string, b: string): number {
  if (a.length === 0 && b.length === 0) return 100;
  const distance = editDistance(a, b);
  const maxLength = Math.max(a.length, b.length, 1);
  return Math.round((1 - distance / maxLength) * 100);
}

export function scoreUsernameSimilarity(candidate: string): UsernameSimilarity {
  const normalized = normalizeUsername(candidate);
  const scored = TAKEN_USERNAMES.map((taken) => {
    const distance = editDistance(normalized, taken);
    const containsBody = normalized.includes(taken) || taken.includes(normalized);
    const score = containsBody ? 100 : simpleSimilarity(normalized, taken);
    return { taken, score, distance, containsBody };
  }).sort((a, b) => b.score - a.score || a.distance - b.distance);

  const closest = scored[0];
  return {
    candidate,
    normalized,
    closest: closest.taken,
    score: closest.score,
    editDistance: closest.distance,
    blocked: closest.containsBody || closest.distance <= 2 || closest.score >= 70,
  };
}

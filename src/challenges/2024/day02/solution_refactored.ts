import { readAdjacentFile } from '@/utils/file.ts';
import { isSafe } from "@/challenges/2024/day02/solution.ts";

/*
	Note - when using
 */

export function partOneRefactored(input: string): number {
	const reports = input.trim().split('\n').map(report => report.trim().split(/\s+/).map(Number));

	return reports.reduce((safeCount, levels) => {
		return safeCount + (isSafe(levels) ? 1 : 0);
	}, 0);
}
export function partTwoRefactored(input: string): number {
	// ...
	return 0;
}


import { readAdjacentFile } from '@/utils/file.ts';

if (import.meta.main) {
	// const textInput = await readAdjacentFile(import.meta.url, './input.txt');
	//
	// const result = partOne(textInput);
	// const result2 = partTwo(textInput);
	//
	// console.log('Part one:', result);
	// console.log('Part two:', result2);
}

export function partOne(input: string): number {
	const reports = input.trim().split('\n').map(report => report.trim().split(/\s+/).map(Number));

	let safeCount = 0;

	for (let levels of reports) {
		if (isSafe(levels)) {
			safeCount++;
		}
	}

	return safeCount;
}
export function partTwo(input: string): number {
	const reports = input.trim().split('\n').map(report => report.trim().split(/\s+/).map(Number));

	let safeCount = 0;

	for (let levels of reports) {
		if (isSafe(levels)) {
			safeCount++;
			continue;
		}

		let canBeMadeSafe = false;
		for (let i = 0; i < levels.length; i++) {
			const testLevels = levels.slice(0, i).concat(levels.slice(i + 1));
			if (isSafe(testLevels)) {
				canBeMadeSafe = true;
				break;
			}
		}

		if (canBeMadeSafe) {
			safeCount++;
		}
	}

	return safeCount;
}

function isSafe(levels: number[]): boolean {
	let isIncreasing = true;
	let isDecreasing = true;

	for (let i = 0; i < levels.length - 1; i++) {
		const diff = levels[i + 1] - levels[i];

		if (diff < -3 || diff > 3 || diff === 0) {
			return false;
		}
		if (diff > 0) {
			isDecreasing = false;
		}
		if (diff < 0) {
			isIncreasing = false;
		}
	}

	return isIncreasing || isDecreasing;
}

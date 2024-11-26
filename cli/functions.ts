import '@std/dotenv/load';
import { DOMParser } from 'jsr:@b-fuze/deno-dom';
import { CHALLENGE_DIR, TEMPLATE_DIR, TEMPLATE_FILES } from '@cli/constants.ts';
import { FetchDataParams } from '@cli/types.ts';

const ROOT_DIR = Deno.cwd();

/**
 * Prints a help message for the Advent of Code CLI.
 *
 * The message includes usage instructions, a description of available commands, and options.
 *
 * @return {void} This function does not return a value.
 */
export function printHelpMessage(): void {
	console.log(`

🎅🏻 Advent of Code CLI (for Deno) 🎅🏻

Usage: deno task cli [commands] [options]

Commands:
  -g, --generate                Generates directories and files for the given year
  -r, --run                     Execute the solution
  -t, --test                    Run tests for the specified day
  -b, --bench                   Run benchmarks for the specified day
  -c, --clean                   Removes specified directory by <year> or <year> and <day>
  -h, --help                    Show this help message
  -f, --fetch                   Gets data from the advent of code site for a given <day> *requires session cookie in env*


Options:
  -y, --year    <year>          Specify the year (default: current year)
  -d, --day     <day>           Specify the day of the challenge (1-25)
  -p, --part    <part>          Specify the part of the challenge to run (1 or 2)
  -i, --input   <filename>      Specify the input file to use (default: input.txt)

Generate:
  $ deno task cli --generate --year 2020
  $ deno task cli --generate            # omit the year to stub for current year

Run:
  $ deno task cli --run --year 2020 --day 1 --part 1
  $ deno task cli --run --year 2020 --day 1 --part 1 --input input_sample.txt

Test:
  $ deno task cli --test --year 2020 --day 1

Bench:
  $ deno task cli --bench --year 2020 --day 1
  
Clean:
  $ deno task cli --clean --year 2020
  $ deno task cli --clean --year 2020 --day 1

Fetch:
  $ deno task cli --fetch --data --year 2020 --day 1
  $ deno task cli --fetch --question 1 --year 2020 --day 1
  `);
}

/**
 * Creates a directory structure for the specified year with subdirectories for each day up to the 25th,
 * and populates each subdirectory with template files.
 *
 * @param {string} year - The year for which directories are to be created.
 * @return {Promise<void>} A promise that resolves when directory creation and file copying are complete.
 */
export async function createDirectories(year: string): Promise<void> {
	for (let day = 1; day <= 25; day++) {
		const dayStr = day.toString().padStart(2, '0');
		const dirPath = `${ROOT_DIR}/src/${CHALLENGE_DIR}/${year}/day${dayStr}`;

		await Deno.mkdir(dirPath, { recursive: true });

		for (const fileName of TEMPLATE_FILES) {
			await copyTemplateFile(fileName, dirPath);
		}
	}
}

/**
 * Copies a template file from the templates directory to a specified destination directory.
 *
 * @param {string} fileName - The name of the template file to copy.
 * @param {string} destDir - The destination directory where the file should be copied.
 * @return {Promise<void>} A promise that resolves when the file has been successfully copied.
 */
export async function copyTemplateFile(
	fileName: string,
	destDir: string,
): Promise<void> {
	const templateContent = await Deno.readTextFile(
		`${TEMPLATE_DIR}/${fileName}`,
	);
	const destPath = `${destDir}/${fileName}`;

	if (await Deno.stat(destPath).catch(() => null)) {
		console.error(`Error: ${destPath} already exists.`);
		Deno.exit(1);
	}

	await Deno.writeTextFile(destPath, templateContent);
}

/**
 * Executes the solution for a given year, day, and part, using the provided input file.
 *
 * @param {string} year - The year of the solution to run.
 * @param {string} day - The day of the solution to run.
 * @param {string} part - The part of the solution to run ('1' or '2').
 * @param {string} inputFile - The name of the file containing the input data.
 * @return {Promise<void>} A promise that resolves when the solution has been executed.
 */
export async function runSolution(
	year: string,
	day: string,
	part: '1' | '2',
	inputFile: string,
): Promise<void> {
	try {
		const dayStr = day.padStart(2, '0');
		const solutionPath =
			`${ROOT_DIR}/src/${CHALLENGE_DIR}/${year}/day${dayStr}/solution.ts`;

		// Dynamically import the solution module
		const module = await import(`file://${solutionPath}`);

		const partFunction = part === '1' ? module.partOne : module.partTwo;
		if (typeof partFunction !== 'function') {
			console.error(
				`Part ${part} function is not defined in ${solutionPath}`,
			);
			Deno.exit(1);
		}

		const inputPath =
			`${ROOT_DIR}/src/${CHALLENGE_DIR}/${year}/day${dayStr}/${inputFile}`;
		const inputData = await Deno.readTextFile(inputPath);

		// Run
		const result = partFunction(inputData);
		console.log(
			`Result for Year ${year}, Day ${day}, Part ${part}:`,
			result,
		);
	} catch (e) {
		console.error(`Error executing solution: ${e}`);
		Deno.exit(1);
	}
}

/**
 * Executes the Deno test suite for a specific year and day.
 *
 * @param {string} year - The target year for the test suite.
 * @param {string} day - The target day for the test suite.
 * @return {Promise<void>}
 */
export async function runTests(year: string, day: string): Promise<void> {
	try {
		const dayStr = day.padStart(2, '0');
		const testPath =
			`${ROOT_DIR}/src/${CHALLENGE_DIR}/${year}/day${dayStr}/solution_test.ts`;

		const command = new Deno.Command('deno', {
			args: ['test', '--allow-read', testPath],
			stdout: 'inherit',
			stderr: 'inherit',
		});

		const { code } = await command.output();
		Deno.exit(code);
	} catch (e) {
		console.error(`Error running tests: ${e}`);
		Deno.exit(1);
	}
}

/**
 * Runs the benchmarks for a specific day.
 *
 * @param {string} year - The year of the challenge.
 * @param {string} day - The day of the challenge (1-25).
 * @return {Promise<void>} A promise that resolves when the benchmarking is complete.
 */
export async function runBenchmarks(year: string, day: string): Promise<void> {
	try {
		const dayStr = day.padStart(2, '0');
		const benchPath =
			`${ROOT_DIR}/src/${CHALLENGE_DIR}/${year}/day${dayStr}/solution_bench.ts`;

		const command = new Deno.Command('deno', {
			args: ['bench', '--allow-read', benchPath],
			stdout: 'inherit',
			stderr: 'inherit',
		});

		const { code } = await command.output();
		Deno.exit(code);
	} catch (e) {
		console.error(`Error running tests: ${e}`);
		Deno.exit(1);
	}
}

/**
 * Removes the specified directory and its contents based on the given year and optional day.
 *
 * @param {string} year - The year of the directory to be cleaned.
 * @param {string} [day] - The optional day of the directory to be cleaned.
 * @return {Promise<void>} - A promise that resolves when the directory and its contents have been removed.
 */
export async function runClean(year: string, day?: string): Promise<void> {
	const baseDirPath = `${ROOT_DIR}/src/${CHALLENGE_DIR}/${year}`;
	try {
		const stat = await Deno.stat(baseDirPath);

		if (!stat.isDirectory) {
			console.error(`Error: ${baseDirPath} is not a directory.`);
			Deno.exit(1);
		}

		if (day) {
			const dayStr = day.padStart(2, '0');
			const dirPath =
				`${ROOT_DIR}/src/${CHALLENGE_DIR}/${year}/day${dayStr}`;
			await Deno.remove(dirPath, { recursive: true });
			return;
		}

		const dirPath = `${ROOT_DIR}/src/${CHALLENGE_DIR}/${year}`;
		await Deno.remove(dirPath, { recursive: true });
		return;
	} catch (e) {
		console.error(`Error with running --clean ${e}`);
	}
}

/**
 * Fetches data from the Advent of Code website for a given year and day.
 *
 * @param {FetchDataParams} params - The parameters for fetching data.
 * @param {string} params.year - The year of the advent event.
 * @param {string} params.day - The day of the advent event.
 * @param {boolean} params.isQuestion - Whether to fetch the question or the input.
 * @param {number} [params.questionNumber=1] - The question number to fetch, defaults to 1.
 * @return {Promise<void>} A promise that resolves when the data has been fetched and saved.
 */
export async function fetchData(params: FetchDataParams): Promise<void> {
	const { year, day, isQuestion, questionNumber = 1 } = params;
	const msg = `Fetching ${
		isQuestion ? 'question' : 'input'
	} for ${year} day ${day}`;
	console.log(msg);

	const SESSION_COOKIE = Deno.env.get('SESSION_COOKIE');
	const dayStr = day.padStart(2, '0');
	const url = isQuestion
		? `https://adventofcode.com/${year}/day/${day}`
		: `https://adventofcode.com/${year}/day/${day}/input`;

	const headers = new Headers({
		'Cookie': `session=${SESSION_COOKIE}`,
	});

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers,
		});

		if (!response.ok) {
			throw new Error(`Error fetching data: ${response.statusText}`);
		}

		const data = await response.text();

		if (isQuestion) {
			await saveQuestionData(year, dayStr, data, questionNumber);
		} else {
			await saveInputData(year, dayStr, data);
		}
	} catch (e) {
		console.error(e);
		Deno.exit(1);
	}
}

/**
 * Saves the provided question data into a markdown file. It processes the HTML content
 * to extract the question description and appends it to the corresponding file path.
 *
 * @param {string} year - The year corresponding to the challenge.
 * @param {string} dayStr - The day string representing the specific day of challenge.
 * @param {string} html - The HTML content containing question descriptions.
 * @param {1 | 2} questionNumber - The question number (1 or 2) being saved.
 * @return {Promise<void>} A promise that resolves when the question data has been saved.
 * @throws {Error} If the question description is not found in the HTML content.
 */
export async function saveQuestionData(
	year: string,
	dayStr: string,
	html: string,
	questionNumber: 1 | 2,
): Promise<void> {
	const doc = new DOMParser().parseFromString(html, 'text/html');
	const questionDescriptions = Array.from(doc.querySelectorAll('.day-desc'));
	const description = questionDescriptions[questionNumber - 1]?.innerHTML;

	if (!description) {
		throw new Error('Error: Could not find the question description.');
	}

	const questionPath =
		`${ROOT_DIR}/src/${CHALLENGE_DIR}/${year}/day${dayStr}/question.md`;
	await ensureFileExists(questionPath);

	let questionContent = await readFileSafe(questionPath);

	if (questionNumber === 2 && questionContent.trim()) {
		questionContent += `\n\n---\n\n${description}`;
		await Deno.writeTextFile(questionPath, questionContent, {
			create: true,
		});
		console.log(
			`Question description for Year ${year}, Day ${dayStr} has been saved to ${questionPath}.`,
		);
		return;
	}
	await Deno.writeTextFile(questionPath, questionContent, { create: true });
	console.log(
		`Question description for Year ${year}, Day ${dayStr} has been saved to ${questionPath}.`,
	);
}

/**
 * Saves the given input data to a file corresponding to the specified year and day.
 *
 * @param {string} year - The year of the challenge.
 * @param {string} dayStr - The day of the challenge.
 * @param {string} input - The input data to save.
 * @return {Promise<void>} A promise that resolves when the input data has been saved.
 */
export async function saveInputData(
	year: string,
	dayStr: string,
	input: string,
): Promise<void> {
	const inputPath =
		`${ROOT_DIR}/src/${CHALLENGE_DIR}/${year}/day${dayStr}/input.txt`;
	await ensureFileExists(inputPath);
	await Deno.writeTextFile(inputPath, input, { create: true });
	console.log(
		`Input data for Year ${year}, Day ${dayStr} has been saved to ${inputPath}.`,
	);
}

/**
 * Ensures that the file at the specified path exists.
 * If the file does not exist, it will be created.
 *
 * @param {string} filePath - The path to the file to check or create.
 * @return {Promise<void>} A promise that resolves when the file is ensured to exist.
 */
export async function ensureFileExists(filePath: string): Promise<void> {
	try {
		await Deno.stat(filePath);
	} catch (e) {
		if (e instanceof Deno.errors.NotFound) {
			console.log(`File ${filePath} not found. Creating it.`);
			await Deno.writeTextFile(filePath, '');
		} else {
			throw new Error(`Error checking file ${filePath}: ${e}`);
		}
	}
}

/**
 * Asynchronously reads the content of a file specified by the file path.
 * If an error occurs during reading, the program will log the error and exit.
 *
 * @param {string} filePath - The path to the file to be read.
 * @return {Promise<string>} The content of the file as a string.
 */
export async function readFileSafe(filePath: string): Promise<string> {
	try {
		return await Deno.readTextFile(filePath);
	} catch (e) {
		console.error(`Error reading file ${filePath}: ${e}`);
		Deno.exit(1);
	}
}

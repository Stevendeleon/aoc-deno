import { parseArgs } from '@std/cli';

const DATE_YEAR = new Date().getFullYear();
const DEFAULT_INPUT_FILE = 'input.txt';
const TEMPLATE_FILES = [
	'input.txt',
	'input_sample.txt',
	'solution.ts',
	'solution_test.ts',
	'solution_bench.ts',
	'solution_refactored.ts',
];

const args = parseArgs(Deno.args, {
	alias: {
		year: 'y',
		day: 'd',
		part: 'p',
		input: 'i',
		run: 'r',
		help: 'h',
		generate: 'g',
		test: 't',
		bench: 'b',
		clean: 'c',
	},
	string: ['year', 'day', 'part', 'input'],
	boolean: ['run', 'help', 'generate', 'test', 'bench', 'clean'],
	default: {
		year: DATE_YEAR.toString(),
		input: DEFAULT_INPUT_FILE,
	},
});

if (args.help) {
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

Options:
  -y, --year    <year>          Specify the year (default: current year)
  -d, --day     <day>           Specify the day of the challenge (1-25)
  -p, --part    <part>          Specify the part of the challenge to run (1 or 2)
  -i, --input   <filename>      Specify the input file to use (default: input.txt)

Generate:
  $ deno task cli --generate --year 2020

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
  `);
	Deno.exit(0);
}

/**
 * Creates a directory structure for the specified year with subdirectories for each day up to the 25th,
 * and populates each subdirectory with template files.
 *
 * @param {string} year - The year for which directories are to be created.
 * @return {Promise<void>} A promise that resolves when directory creation and file copying are complete.
 */
async function createDirectories(year: string) {
	for (let day = 1; day <= 25; day++) {
		const dayStr = day.toString().padStart(2, '0');
		const dirPath = `src/${year}/day${dayStr}`;

		if (await Deno.stat(dirPath).catch(() => null)) {
			continue;
		}

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
async function copyTemplateFile(fileName: string, destDir: string) {
	const templateContent = await Deno.readTextFile(`_templates/${fileName}`);
	const destPath = `${destDir}/${fileName}`;

	if (await Deno.stat(destPath).catch(() => null)) {
		await Deno.writeTextFile(destPath, templateContent);
		return;
	}

	console.error(`Error: ${destPath} already exists.`);
	Deno.exit(1);
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
async function runSolution(
	year: string,
	day: string,
	part: string,
	inputFile: string,
) {
	try {
		const dayStr = day.padStart(2, '0');
		const solutionPath = `./src/${year}/day${dayStr}/solution.ts`;

		const module = await import(solutionPath);

		const partFunction = part === '1' ? module.partOne : module.partTwo;
		if (typeof partFunction !== 'function') {
			console.error(
				`Part ${part} function is not defined in ${solutionPath}`,
			);
			Deno.exit(1);
		}

		const inputPath = `./src/${year}/day${dayStr}/${inputFile}`;
		const inputData = await Deno.readTextFile(inputPath);

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
 * @return {void}
 */
async function runTests(year: string, day: string) {
	try {
		const dayStr = day.padStart(2, '0');
		const testPath = `./src/${year}/day${dayStr}/solution_test.ts`;

		const command = new Deno.Command('deno', {
			args: ['test', testPath],
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
async function runBenchmarks(year: string, day: string) {
	try {
		const dayStr = day.padStart(2, '0');
		const benchPath = `./src/${year}/day${dayStr}/solution_bench.ts`;

		const command = new Deno.Command('deno', {
			args: ['bench', benchPath],
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
async function runClean(year: string, day?: string) {
	const baseDirPath = `src/${year}`;
	try {
		const stat = await Deno.stat(baseDirPath);

		if (!stat.isDirectory) {
			console.error(`Error: ${baseDirPath} is not a directory.`);
			Deno.exit(1);
		}

		if (day) {
			const dayStr = day.padStart(2, '0');
			const dirPath = `src/${year}/day${dayStr}`;
			await Deno.remove(dirPath, { recursive: true });
			return;
		}

		const dirPath = `src/${year}`;
		await Deno.remove(dirPath, { recursive: true });
		return;
	} catch (e) {
		console.error(`Error with running --clean ${e}`);
	}
}

(async function () {
	const {
		year,
		day,
		part,
		input,
		run,
		generate,
		test,
		bench,
		clean,
	} = args;

	switch (true) {
		case generate:
			if (!year || isNaN(Number(year))) {
				console.error(
					'Error: Please provide a valid year using the -y or --year flag.',
				);
				Deno.exit(1);
			}

			try {
				await createDirectories(year);
				console.log(
					`Templates for year ${year} have been generated successfully.`,
				);
			} catch (e) {
				console.error(`Error creating templates: ${e}`);
				Deno.exit(1);
			}
			break;

		case test:
			if (
				!day || isNaN(Number(day)) || Number(day) < 1 ||
				Number(day) > 25
			) {
				console.error(
					'Error: Please provide a valid day (1-25) using the -d or --day flag.',
				);
				console.log('ex: `deno task cli --test --year 2020 --day 1`');
				Deno.exit(1);
			}

			if (!year || isNaN(Number(year))) {
				console.error(
					'Error: Please provide a valid year using the -y or --year flag.',
				);
				console.log('ex: `deno task cli --test --year 2020 --day 1`');
				Deno.exit(1);
			}

			await runTests(year, day);
			break;

		case bench:
			if (
				!day || isNaN(Number(day)) || Number(day) < 1 ||
				Number(day) > 25
			) {
				console.error(
					'Error: Please provide a valid day (1-25) using the -d or --day flag.',
				);
				console.log('ex: `deno task cli --bench --year 2020 --day 1`');
				Deno.exit(1);
			}

			if (!year || isNaN(Number(year))) {
				console.error(
					'Error: Please provide a valid year using the -y or --year flag.',
				);
				console.log('ex: `deno task cli --bench --year 2020 --day 1`');
				Deno.exit(1);
			}

			await runBenchmarks(year, day);
			break;

		case run:
			if (
				!day || isNaN(Number(day)) || Number(day) < 1 ||
				Number(day) > 25
			) {
				console.error(
					'Error: Please provide a valid day (1-25) using the -d or --day flag.',
				);
				Deno.exit(1);
			}

			if (!part || (part !== '1' && part !== '2')) {
				console.error(
					'Error: Please specify part 1 or 2 using the -p or --part flag.',
				);
				Deno.exit(1);
			}

			await runSolution(year, day, part, input);
			break;

		case clean:
			if (!year || isNaN(Number(year))) {
				console.error(
					'Error: Please provide a valid year using the -y or --year flag.',
				);
				Deno.exit(1);
			}

			await runClean(year, day);
			break;

		default:
			console.error(
				'Error: No command specified. Use --help for usage instructions.',
			);
			Deno.exit(1);
	}
})();

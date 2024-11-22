import { parseArgs } from "@std/cli";

const DATE_YEAR = new Date().getFullYear();
const DEFAULT_INPUT_FILE = "input.txt";
const TEMPLATE_FILES = [
	"input.txt",
	"input_sample.txt",
	"solution.ts",
	"solution_test.ts",
	"solution_refactored.ts",
];

const args = parseArgs(Deno.args, {
	alias: {
		year: "y",
		day: "d",
		part: "p",
		input: "i",
		run: "r",
		help: "h",
		template: "tmpl",
		test: "t"
	},
	string: ["year", "day", "part", "input"],
	boolean: ["run", "help", "template", "test"],
	default: {
		year: DATE_YEAR.toString(),
		input: DEFAULT_INPUT_FILE,
	},
});

if (args.help) {
	console.log(` 🎅🏻 Advent of Code CLI (Built using Deno) 🎅🏻 `)

	console.log(`
Usage: deno task cli [options]

Options:
  -tmpl, --template              Generate directories and files for the given year
  -y, --year    	<year>       Specify the year (default: current year)
  -d, --day     	<day>        Specify the day of the challenge (1-25)
  -p, --part    	<part>       Specify the part of the challenge to run (1 or 2)
  -i, --input   	<filename>   Specify the input file to use (default: input.txt)
  -r, --run                      Execute the solution
  -h, --help                     Show this help message
  --test, --tst                  Run tests for the specified day

Examples:
	Found in the README.md

  `);
	Deno.exit(0);
}

/**
 * Copies a template file to a specified destination directory.
 */
async function copyTemplateFile(fileName: string, destDir: string) {
	const templateContent = await Deno.readTextFile(`_templates/${fileName}`);
	const destPath = `${destDir}/${fileName}`;

	await Deno.writeTextFile(destPath, templateContent);
}

/**
 * Creates directories and files for the specified year.
 */
async function createDirectories(year: string) {
	for (let day = 1; day <= 25; day++) {
		const dayStr = day.toString().padStart(2, "0");
		const dirPath = `src/${year}/day${dayStr}`;
		await Deno.mkdir(dirPath, { recursive: true });

		for (const fileName of TEMPLATE_FILES) {
			await copyTemplateFile(fileName, dirPath);
		}
	}
}

/**
 * Executes the solution for a specific day and part.
 */
async function runSolution(year: string, day: string, part: string, inputFile: string) {
	try {
		const dayStr = day.padStart(2, "0");
		const solutionPath = `./src/${year}/day${dayStr}/solution.ts`;

		const module = await import(solutionPath);

		const partFunction = part === "1" ? module.partOne : module.partTwo;
		if (typeof partFunction !== "function") {
			console.error(`Part ${part} function is not defined in ${solutionPath}`)
			Deno.exit(1)
		}

		const inputPath = `./src/${year}/day${dayStr}/${inputFile}`;
		const inputData = await Deno.readTextFile(inputPath);

		const result = partFunction(inputData);
		console.log(`Result for Year ${year}, Day ${day}, Part ${part}:`, result);
	} catch (e) {
		console.error(`Error executing solution: ${e}`);
		Deno.exit(1);
	}
}

/**
 * Runs the tests for a specific day.
 */
async function runTests(year: string, day: string) {
	try {
		const dayStr = day.padStart(2, "0");
		const testPath = `./src/${year}/day${dayStr}/solution_test.ts`;

		const command = new Deno.Command("deno", {
			args: ["test", testPath],
			stdout: "inherit",
			stderr: "inherit",
		});

		const {code} = await command.output();
		Deno.exit(code);
	} catch (e) {
		console.error(`Error running tests: ${e}`);
		Deno.exit(1);
	}
}

// Main CLI Logic
(async function () {
	const { year, day, part, input, run, template, test } = args;

	switch (true) {
		case template:
			if (!year || isNaN(Number(year))) {
				console.error("Error: Please provide a valid year using the -y or --year flag.");
				Deno.exit(1);
			}

			try {
				await createDirectories(year);
				console.log(`Templates for year ${year} have been generated successfully.`);
			}
			catch (e) {
				console.error(`Error creating templates: ${e}`);
				Deno.exit(1);
			}
			break;
			
		case test:
			if (!day || isNaN(Number(day)) || Number(day) < 1 || Number(day) > 25) {
				console.error("Error: Please provide a valid day (1-25) using the -d or --day flag.");
				console.log("ex: `deno task cli --test --year 2020 --day 1\ndeno task cli -t -y 2020 -d 1`")
				Deno.exit(1);
			}

			if (!year || isNaN(Number(year))) {
				console.error("Error: Please provide a valid year using the -y or --year flag.");
				console.log("ex: `deno task cli --test --year 2020 --day 1\ndeno task cli -t -y 2020 -d 1`")
				Deno.exit(1);
			}

			await runTests(year, day);
			break;

		case run:
			if (!day || isNaN(Number(day)) || Number(day) < 1 || Number(day) > 25) {
				console.error("Error: Please provide a valid day (1-25) using the -d or --day flag.");
				Deno.exit(1);
			}

			if (!part || (part !== "1" && part !== "2")) {
				console.error("Error: Please specify part 1 or 2 using the -p or --part flag.");
				Deno.exit(1);
			}

			await runSolution(year, day, part, input);
			break;

		default:
			console.error("Error: No command specified. Use --help for usage instructions.");
			Deno.exit(1);
	}
})();

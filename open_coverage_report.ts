const { os } = Deno.build;
let openCommand;

switch (os) {
	case 'darwin':
		openCommand = 'open cov_report/index.html';
		break;
	case 'windows':
		openCommand = 'cmd /c start cov_report\\index.html';
		break;
	case 'linux':
		openCommand = 'xdg-open cov_report/index.html';
		break;
	default:
		console.error('Unsupported OS');
		Deno.exit(1);
}

const [command, ...args] = openCommand.split(' ');

const process = new Deno.Command(command, {
	args,
});

const { success } = await process.output();

if (!success) {
	console.error('Failed to open the coverage report');
	Deno.exit(1);
}

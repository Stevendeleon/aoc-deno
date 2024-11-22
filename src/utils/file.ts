/**
 * Reads a file that is located in the same directory as the caller module.
 * @param callerUrl The URL of the caller module.
 * @param fileName The name of the file to read.
 * @returns A promise that resolves to the contents of the file as a string.
 */
export async function readAdjacentFile(
	callerUrl: string,
	fileName: string,
): Promise<string> {
	const dirname = new URL('.', callerUrl).pathname;
	const filePath = `${dirname}${fileName}`;

	return await Deno.readTextFile(filePath);
}

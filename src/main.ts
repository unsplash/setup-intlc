import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as fs from "node:fs";

const downloadURL = (version: string): string =>
	`https://github.com/unsplash/intlc/releases/download/v${version}/intlc-v${version}-linux-x86_64`;

const main = async (): Promise<void> => {
	const version = core.getInput("version");
	const url = downloadURL(version);

	core.info(`Downloading v${version} from ${url}`);
	const temporary = await tc.downloadTool(url);

	core.debug(`Setting permissions on ${temporary}`);
	await fs.promises.chmod(temporary, "755");

	// Persistent for subsequent steps in the same job, anyway.
	const persistent = await tc.cacheFile(
		temporary,
		"intlc",
		"intlc",
		version,
		"x86_64",
	);

	core.debug(`Adding ${persistent} to $PATH`);
	core.addPath(persistent);
};

main();

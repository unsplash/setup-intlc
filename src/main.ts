import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as fs from "node:fs";
import * as os from "node:os";

const getDownloadURL = (version: string): string | null => {
	const sys = `${os.platform()} ${os.arch()}`;
	const prefix = `https://github.com/unsplash/intlc/releases/download/v${version}/intlc-v${version}`;
	switch (sys) {
		case "linux x64":
			return `${prefix}-linux-x86_64`;
		case "darwin arm64":
			return `${prefix}-macos-aarch64`;
		default: {
			core.setFailed(`Unsupported os/arch pair: ${sys}`);
			return null;
		}
	}
};

const main = async (): Promise<void> => {
	const version = core.getInput("version");
	const url = getDownloadURL(version);
	if (url === null) return;

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

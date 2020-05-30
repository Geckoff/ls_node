const FilesInfo = require("./FilesInfo");
const Copier = require("./Copier");
const fs = require("fs").promises;

const { ORIGINAL_FOLDER, TARGET_FOLDER, DELETE_ORIGINAL_FOLDER } = process.env;

const filesInfo = new FilesInfo(ORIGINAL_FOLDER);

(async () => {
	await filesInfo.init();

	const copier = new Copier(filesInfo, TARGET_FOLDER);
	await copier.copy();
	console.log("copying complete");

	if (DELETE_ORIGINAL_FOLDER) {
		await fs.rmdir(filesInfo.originalFolder, { recursive: true }, () => {});
		console.log("deleting complete");
	}
})();

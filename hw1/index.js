const FilesInfo = require("./FilesInfo");
const Copier = require("./Copier");
const Deleter = require("./Deleter");

const { ORIGINAL_FOLDER, TARGET_FOLDER, DELETE_ORIGINAL_FOLDER } = process.env;

const filesInfo = new FilesInfo(ORIGINAL_FOLDER);

const copier = new Copier(filesInfo, TARGET_FOLDER);
copier.copy();

if (DELETE_ORIGINAL_FOLDER) {
	const deleter = new Deleter(filesInfo);
	deleter.deleteOriginalFolder();
}

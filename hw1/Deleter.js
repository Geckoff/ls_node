const fs = require("fs");

class Deleter {
	filesInfo;
	directoriesSortedByNesting;

	constructor(filesInfo) {
		this.filesInfo = filesInfo;
	}

	//this method isn't a part of AC
	deleteFiles = () => {
		this.filesInfo.originalFiles.forEach(({ filePath }) => {
			fs.unlinkSync(filePath);
		});
	};

	deleteOriginalFolder = () => {
		fs.rmdirSync(this.filesInfo.originalFolder, { recursive: true }, () => {});
	};
}

module.exports = Deleter;

const fs = require("fs").promises;
//const fs = require("fs");
const path = require("path");

class FilesInfo {
	originalFiles = [];
	originalDirectories = [];
	originalFolder = "originalFolder";

	constructor(originalFolder) {
		if (originalFolder) {
			this.originalFolder = originalFolder;
		}
	}

	init = async () => {
		await this.getOriginalData();
	};

	traverseDir = async (dir, fileCb, folderCb) => {
		const promises = [];
		const dirContent = await fs.readdir(dir);

		for (const file of dirContent) {
			let fullPath = path.join(dir, file);
			const objectReadPromise = fs.lstat(fullPath);
			promises.push(objectReadPromise);
			const stat = await objectReadPromise;

			if (stat.isFile() && typeof fileCb === "function") {
				fileCb(fullPath, file);
			}

			if (stat.isDirectory()) {
				folderCb(fullPath);
				await this.traverseDir(fullPath, fileCb, folderCb);
			}
		}

		return Promise.all(promises);
	};

	addToOriginalFiles = (fullPath, file) => {
		this.originalFiles.push({
			filePath: fullPath,
			fileName: file,
		});
	};

	getOriginalData = () => {
		return this.traverseDir(
			this.originalFolder,
			this.addToOriginalFiles,
			this.addToOriginalDirectories
		);
	};

	addToOriginalDirectories = (dirPath) => {
		this.originalDirectories.push(dirPath);
	};
}

module.exports = FilesInfo;

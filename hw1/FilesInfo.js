const fs = require("fs");
const path = require("path");

class FilesInfo {
	originalFiles = [];
	originalDirectories = [];
	originalFolder = "originalFolder";

	constructor(originalFolder) {
		if (originalFolder) {
			this.originalFolder = originalFolder;
		}
		this.getOriginalData();
	}

	traverseDir = (dir, fileCb, folderCb) => {
		fs.readdirSync(dir).forEach((file) => {
			let fullPath = path.join(dir, file);

			if (fs.lstatSync(fullPath).isFile()) {
				if (typeof fileCb === "function") {
					fileCb(fullPath, file);
				}
			}

			if (fs.lstatSync(fullPath).isDirectory()) {
				folderCb(fullPath);
				this.traverseDir(fullPath, fileCb, folderCb);
			}
		});
	};

	addToOriginalFiles = (fullPath, file) => {
		this.originalFiles.push({
			filePath: fullPath,
			fileName: file,
		});
	};

	getOriginalData = () => {
		this.traverseDir(
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

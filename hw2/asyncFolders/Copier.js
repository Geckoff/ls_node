const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");

class Copier {
	filesInfo;
	filesToCopyData;
	targetFolder = "alphabetized";

	constructor(filesInfo, targetFolder) {
		if (targetFolder) {
			this.targetFolder = targetFolder;
		}
		this.filesInfo = filesInfo;
		this.getCopyData();
	}

	getCopyData = () => {
		this.filesToCopyData = this.filesInfo.originalFiles.map((originalFile) =>
			this.composeCopyObject(originalFile)
		);
	};

	composeCopyObject = ({ filePath, fileName }) => {
		const firstLetter = fileName[0];
		const copyToFile = path.join(this.targetFolder, firstLetter, fileName);
		const copyToFolder = path.join(this.targetFolder, firstLetter);

		return {
			copyFrom: filePath,
			copyToFile,
			copyToFolder,
		};
	};

	createFolderIfNotExists = async (folder, showExistanceError = false) => {
		try {
			await fs.mkdir(folder);
			return true;
		} catch (e) {
			showExistanceError && console.log(`Folder ${folder} already exists`, e);
			return false;
		}
	};

	copy = async () => {
		const wasFolderCreated = await this.createFolderIfNotExists(this.targetFolder, true);
		if (!wasFolderCreated) {
			return;
		}

		for (const { copyFrom, copyToFile, copyToFolder } of this.filesToCopyData) {
			await this.createFolderIfNotExists(copyToFolder);
			try {
				await fs.copyFile(copyFrom, copyToFile);
			} catch (e) {
				console.log(`File ${copyFrom} was not copied`, e);
			}
		}
	};
}

module.exports = Copier;

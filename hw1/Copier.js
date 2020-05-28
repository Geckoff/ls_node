const fs = require("fs");
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

	createFolderIfNotExists = (folder) => {
		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder);
		}
	};

	copy = () => {
		this.createFolderIfNotExists(this.targetFolder);
		this.filesToCopyData.forEach(({ copyFrom, copyToFile, copyToFolder }) => {
			this.createFolderIfNotExists(copyToFolder);
			fs.createReadStream(copyFrom)
				.pipe(fs.createWriteStream(copyToFile))
				.on("error", function (e) {
					console.log("THIS IS ERROR HANDLING AND IT WORKED!!!", e);
				});
		});
	};
}

module.exports = Copier;

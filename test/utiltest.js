var fs = require('fs');

function deleteFile (filename) {
	if (fs.existsSync(filename)) {
		fs.unlinkSync(filename);
	}
}

exports.deleteFile = deleteFile;
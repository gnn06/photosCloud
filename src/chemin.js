'use strict';

function urlToFolder(folder) {
    return folder.replace('%20', ' ');
}

exports.urlToFolder = urlToFolder;
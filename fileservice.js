'use strict';

var fs = require('fs');

exports.walk = function (rootFolder, folder) {
  if (fs.existsSync(rootFolder + '/' + folder + '/folder.json')) {
    var content = fs.readFileSync(rootFolder + '/' + folder + '/folder.json', 'utf-8');
    return JSON.parse(content);
  }
  var result = [];
  var extensionsToRetrieve = ['jpg', 'mp4'];
  var files = fs.readdirSync (rootFolder + '/' + folder, "utf-8");
  for (var i = 0; i < files.length; i++) {
    var stat = fs.statSync(rootFolder + '/' + folder + '/' + files[i]);
    if (stat.isDirectory()) {
      var subResult = this.walk(rootFolder, folder + '/' + files[i]);
      result = result.concat(subResult);
    } else {
      var extension = files[i].substr(-3).toLowerCase();
      if (extensionsToRetrieve.indexOf(extension) > -1) {
        var item = {};
        item.url = folder + '/' + files[i];
        result.push(item);
      }
    }
  }
  var content = JSON.stringify(result);
  fs.writeFileSync(rootFolder + '/' + folder + '/folder.json', content, 'utf-8');
  return result;
}

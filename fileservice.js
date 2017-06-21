'use strict';

var fs = require('fs');

exports.walk = function (rootFolder, folder) {
  // Récupérer ancien contenu
  if (fs.existsSync(rootFolder + '/' + folder + '/folder.json')) {
    var content = fs.readFileSync(rootFolder + '/' + folder + '/folder.json', 'utf-8');
    return JSON.parse(content);
  }
  // parcourir pour soit créer le contenu soit récupérer les sous-contenus
  // On isole le contenu courant des sous-contenu pour pouvoir stocker le contenu courant tout seul.
  var result = [];
  var extensionsToRetrieve = ['jpg', 'mp4'];
  var files = fs.readdirSync (rootFolder + '/' + folder, "utf-8");
  for (var i = 0; i < files.length; i++) {
    var stat = fs.statSync(rootFolder + '/' + folder + '/' + files[i]);
    if (stat.isDirectory()) {
      var subResult = this.walk(rootFolder, folder + '/' + files[i]);
	  // adapte les urls des sous-contenus 
      result = result.concat(subResult);
    } else {
	  // Ne faire la récupération que si le contenu n'a pas été préalablement récupéré	
      var extension = files[i].substr(-3).toLowerCase();
      if (extensionsToRetrieve.indexOf(extension) > -1) {
        var item = {};
        item.url = folder + '/' + files[i];
        result.push(item);
      }
    }
  }
  // stocker le contenu du répertoire courant si on vient de le construire (et pas les sous-contenu)
  var content = JSON.stringify(result);
  fs.writeFileSync(rootFolder + '/' + folder + '/folder.json', content, 'utf-8');
  return result;
}

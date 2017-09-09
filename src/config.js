var config = {}

// � terminer par un slash
config.photoPath     = "/home/pi/dev/photosCloud/real_sample/photo/";
config.largePath     = "/home/pi/dev/photosCloud/real_sample/large/";
config.thumbnailPath = "/home/pi/dev/photosCloud/real_sample/thumbnail/";
config.dataPath      = "/home/pi/dev/photosCloud/real_sample/data/";
config.trashPath     = "/home/pi/dev/photosCloud/real_sample/corbeille/";
config.conv_prog     = "convert";
config.video_prog    = 'avconv';
config.port          = 8090;

module.exports = config

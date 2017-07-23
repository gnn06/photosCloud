var config = {}

// � terminer par un slash
config.photoPath     = "//192.168.1.2/PiPhotos/original/";
config.largePath     = "//192.168.1.2/PiPhotos/large/";
config.thumbnailPath = "//192.168.1.2/PiPhotos/thumbnail/";
config.dataPath      = "//192.168.1.2/PiPhotos/data/";
config.conv_prog     = "convert";
config.video_prog    = 'ffmpeg';
config.port          = 8190;

module.exports = config

var config = {}

// DEVELOPPEMENT

const ROOT_FOLDER = '/home/pi/dev/photosCloud/real_sample/';
// const ROOT_FOLDER = '//raspberrypi/pi/dev/photosCloud/short_sample/';
// const ROOT_FOLDER = '//raspberrypi/pi/dev/photosCloud/real_sample/';

// à terminer par un slash
config.photoPath     = ROOT_FOLDER + "original/";
config.largePath     = ROOT_FOLDER + "large/";
config.thumbnailPath = ROOT_FOLDER + "thumbnail/";
config.dataPath      = ROOT_FOLDER + "data/";
config.trashPath     = ROOT_FOLDER + "corbeille/";
config.conv_prog     = "convert";
config.video_prog    = 'avconv';
config.port          = 8089;

module.exports = config

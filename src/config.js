var config = {};

// absolute path need to express.js module

// DEVELOPPEMENT

// PI
// const ROOT_FOLDER = '/home/pi/dev/photosCloud/real_sample/';
// const ROOT_FOLDER = '//raspberrypi/pi/dev/photosCloud/short_sample/';
// const ROOT_FOLDER = '/home/pi/dev/photosCloud/real_sample/';

// WINDOWS
const ROOT_FOLDER = 'y:/dev/photosCloud/real_sample/';
// const ROOT_FOLDER = '//raspberrypi/pi/dev/photosCloud/real_sample/';
// const ROOT_FOLDER = '//raspberrypi/pi/dev/photosCloud/short_sample/';

// const ROOT_FOLDER = '//raspberrypi/PiPhotos/'; // WINDOWS, galerie complete

// const ROOT_FOLDER = './real_sample/';
// const ROOT_FOLDER = 'C:/Users/gorsini/Documents/workspace/photosCloud/real_sample/';


// à terminer par un slash
config.photoPath     = ROOT_FOLDER + "original/";
config.largePath     = ROOT_FOLDER + "large/";
config.thumbnailPath = ROOT_FOLDER + "thumbnail/";
config.dataPath      = ROOT_FOLDER + "data/";
config.trashPath     = ROOT_FOLDER + "corbeille/";
config.conv_prog     = "convert";
config.video_prog    = 'avconv';
config.port          = 8090; // 8089 n'est pas accessible depuis proxy docapost

module.exports = config

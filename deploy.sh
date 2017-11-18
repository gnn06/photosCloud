#!/bin/bash
archive="release/photosCloud-$(date '+%y-%m-%d-%H-%M-%S').tar.gz"
tar --exclude=./client/bower_components --exclude=./src/config.js -zcvf $archive ./src/ ./client/ ./package.json
cd /var/photos/photosCloud
tar -zxvf ~/dev/photosCloud/$archive
npm install
cd client
bower install
sudo systemctl restart photosCloud.service

#!/bin/bash
archive="binaries/photosCloud-$(date '+%y-%m-%d-%H-%M-%S').tar.gz"
tar --exclude=./client/bower_components --exclude=./node_modules --exclude=./src/config.js -zcvf $archive ./src/ ./client/ ./package.json
cd /var/photos/application
tar -zxvf ~/dev/photosCloud/$archive
npm install
cd client
bower install
pm2 restart photoscloud

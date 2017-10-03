#!/bin/bash
tar --exclude=./client/bower_components --exclude=./src/config.js -zcvf "release/photosCloud-$(date '+%y-%m-%d-%H-%M-%S').tar.gz" ./src/ ./client/ ./package.json
cd /var/photos/photosCloud
tar -zxvf ~/dev/photosCloud/release/photosCloud-17-10-01-22-09-32.tar.gz
sudo systemctl restart photosCloud.service
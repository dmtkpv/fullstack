#!/bin/bash
source /home/stage/.nvm/nvm.sh
cd /srv/fullstack
pm2 start ecosystem.config.js
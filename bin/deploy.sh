#!/bin/bash

source /home/stage/.nvm/nvm.sh
cd /srv/fullstack

pnpm install
pnpm api database migrate:latest
pnpm api script sitemap ../app/public
pnpm app build
pm2 startOrReload ecosystem.config.js
#!/bin/bash
cd ./extension/src/sidepanel/app
npm run build-prod
cd ../../.. # we are in extension
npm run release

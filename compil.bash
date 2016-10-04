#!/bin/bash
docker run -it --rm --name mon-script -v "$PWD":/usr/src/app -w /usr/src/app node:latest npm run dumpdev

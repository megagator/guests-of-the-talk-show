#! /bin/bash

download_audio () {
    rm ./*.mp3
    < ../content/episodes.json jq '.[0].file.url' | xargs -r -I{} curl -L {} -O
}

if [[ -z $1 || $1 != '-f' ]]; then
    cd feed-parser/ || exit

    npm run parse && \
    download_audio && \
    cd ..  && \
    npm run lint && \
    npm run deploy
else
    npm run lint && \
    npm run deploy
fi

#! /bin/bash

cd feed-parser/

npm run parse && cd .. && npm run lint && npm run deploy
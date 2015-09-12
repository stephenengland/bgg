# bgg
Board Game Geek Collections app

## Setup
* Install RabbitMQ
* `npm install`

## Listen/Test Process Collection Messages
* `grunt run:server`
* (In another Command Line) `node cli-process-collection.js`

What are "Collection Messages"?

BGG requires you to wait while it processes a collection request. 
A message queue is used to ensure we properly wait for BGG to finish processing.

# bgg
Board Game Geek Collections app

## Setup
* Install RabbitMQ
* Install MongoDB
* Install Node.js/npm
* git clone this repo
* run `npm install` in the repo's directory

## Start the Server
```
grunt server
```

This will run both the collection processor (RabbitMQ based message queue) and the web server (express js)

## Listen/Test Process Collection Messages
```
grunt collectionProcessor
(In another Command Line) grunt kickoffCollection
```

This will kick off a test message and process it into RabbitMQ.

What are "Collection Messages"?

BGG requires you to wait while it processes a collection request. 
A message queue is used to ensure we properly wait for BGG to finish processing.


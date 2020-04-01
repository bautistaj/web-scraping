# MongoLib

A little MongoDB library for connect a database and do CRUD

## Getting Started
~~~js
git clone https://github.com/bautistaj/mongo-client.git
~~~

In the proyect directory 
~~~js
npm install
~~~

## Usage 
~~~js

const MongoLib = require('./index');

const connection = new MongoLib();

const array = await connection.getAll("collectionName", {});
const object = await connection.get("collectionName", id );
const idCreated = await connection.create("collectionName", {});
const idUpdated = await connection.update("collectionName", id, {});
const idDeleted = await connection.delete("collectionName", id);
~~~
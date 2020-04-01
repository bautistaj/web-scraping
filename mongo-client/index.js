const { MongoClient, ObjectId } = require('mongodb')
const { config } = require('./config')

const USER = encodeURIComponent(config.dbUser)
const PASSWORD = encodeURIComponent(config.dbPassword)
const DB_NAME = config.dbName

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`

class MongoLib {
  constructor () {
    this.client = new MongoClient(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    this.dbName = DB_NAME
  }

  /**
   * Connect
   * @returns {MongoClient}
   */
  connect () {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if (err) {
            reject(err)
          }

          console.log(`Connected succesfully to mongo ${this.dbName}`)
          resolve(this.client.db(this.dbName))
        })
      })
    }

    return MongoLib.connection
  }

  /**
   * Get all data from a collection
   * @param {String} collection
   * @param {JSON} query
   * @returns {[]} Array of objects
   */
  getAll (collection, query) {
    return this.connect().then(db => {
      return db
        .collection(collection)
        .find(query)
        .toArray()
    })
  }

  /**
   * Get spesific document from a collection
   * @param {String} collection
   * @param {String} id
   * @returns {} Object
   */
  get (collection, id) {
    return this.connect().then(db => {
      return db.collection(collection).findOne({ _id: ObjectId(id) })
    })
  }

  /**
   * Create new document
   * @param {String} collection
   * @param {JSON} data
   * @returns {String} id created
   */
  create (collection, data) {
    return this.connect()
      .then(db => {
        return db.collection(collection).insertOne(data)
      })
      .then(result => result.insertedId)
  }

  /**
   * Update documente
   * @param {String} collection
   * @param {String} id
   * @param {JSON} data
   * @returns {} Obejct updated
   */
  update (collection, id, data) {
    return this.connect()
      .then(db => {
        return db
          .collection(collection)
          .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true })
      })
      .then(result => result.upsertedId || id)
  }

  /**
   * Delete document
   * @param {string} collection
   * @param {string} id
   * @returns {string} id deleted
   */
  delete (collection, id) {
    return this.connect()
      .then(db => {
        return db.collection(collection).deleteOne({ _id: ObjectId(id) })
      })
      .then(() => id)
  }
}

module.exports = MongoLib

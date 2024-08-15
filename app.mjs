import express from 'express'
import * as mongodb from 'mongodb'
import session from 'express-session'
import mongoose from 'mongoose'
import connectMongoDBSession from 'connect-mongodb-session'
import dotenv from 'dotenv'
dotenv.config()
const MongoDBStore = connectMongoDBSession(session)

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.SERVER_PORT
console.log(MONGODB_URI)
const app = express()

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
})

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: store,
    })
)

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(PORT)
    })
    .catch((err) => {
        console.log(err)
    })

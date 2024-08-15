import express from 'express'
import * as mongodb from 'mongodb'
import * as session from 'express-session'
import mongoose from 'mongoose'
import { session as MongoDBStore } from 'connect-mongodb-session'

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.SERVER_PORT

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

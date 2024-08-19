import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import connectMongoDBSession from 'connect-mongodb-session'
import dotenv from 'dotenv'
import authRouter from './routers/auth.mjs'
import morgan from 'morgan'
import passport from 'passport'
import userRouter from './routers/user.mjs'
import messageRouter from './routers/message.mjs'
import './middleware/auth.mjs'
import cors from 'cors'
import multer from './middleware/multer.mjs'
import * as path from 'path'
import { Storage } from '@google-cloud/storage'
dotenv.config()
// const MongoDBStore = connectMongoDBSession(session)

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.SERVER_PORT
const app = express()

const storage = new Storage({
    projectId: '',
    keyFilename: '',
})

app.set('trust proxy', 1)

// const store = new MongoDBStore({
//     uri: MONGODB_URI,
//     collection: 'sessions',
// })
app.use(cors())
// logs info about request
app.use(morgan('common'))
// converts JSON to JS Object in POST, PUT, PATCH requests
app.use(express.json())
// convets form data to JS Object in POST, PUT, PATCH requests
app.use(express.urlencoded({ extended: true }))
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        // store: store,
    })
)

app.use(passport.initialize())
app.use(passport.session())
app.use(multer.single('fileData'))
app.use(authRouter)
app.use(userRouter)
app.use(messageRouter)

mongoose
    .connect(MONGODB_URI)
    .then((result) => {
        app.listen(PORT, () => {
            console.log('Server launched')
        })
    })
    .catch((err) => {
        console.log(err)
    })

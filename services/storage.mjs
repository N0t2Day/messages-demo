import { Storage } from '@google-cloud/storage'

const storage = new Storage({
    projectId: 'messages-demo-433714',
    keyFilename: 'googleCloudKey.json',
})

export const bucket = storage.bucket('bucket-messages-demo')

import Multer from 'multer'
const { v4: uuid } = require('uuid')

const TYPE_IMAGE = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const TYPE_File = {
    'application/pdf': 'pdf',
}

const fileExtChecker = (req, file, callback) => {
    const ext = TYPE_IMAGE[file.mimetype]
        ? TYPE_IMAGE[file.mimetype]
        : TYPE_File[file.mimetype]
    callback(null, uuid() + '.' + ext)
}

const storage = Multer.diskStorage({
    destination: 'uploads/images',
    filename: fileExtChecker,
})

const multer = Multer({
    storage: storage,
})

export default multer

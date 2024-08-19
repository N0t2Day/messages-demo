import Multer from 'multer'
import { v4 as uuid } from 'uuid'

const TYPE_IMAGE = {
    'image/gif': 'gif',
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const TYPE_File = {
    // 'application/pdf': 'pdf',
    'text/plain': 'txt',
}

const fileExtChecker = (req, file, callback) => {
    const ext = TYPE_IMAGE[file.mimetype]
        ? TYPE_IMAGE[file.mimetype]
        : TYPE_File[file.mimetype]
    callback(null, uuid() + '.' + ext)
}

const fileFilter = (req, file, callback) => {
    let size = +req.rawHeaders.slice(-1)[0]
    let isValid = false
    // 4 mb limit
    if (!!TYPE_IMAGE[file.mimetype] && size < 4 * 1024 * 1024) {
        isValid = true
    }
    // 100 kb limit
    if (!!TYPE_File[file.mimetype] && size < 100 * 1024) {
        isValid = true
    }
    let error = isValid ? null : new Error('Invalid mime type!')
    callback(error, isValid)
}

const storage = Multer.diskStorage({
    destination: 'uploads/images',
    filename: fileExtChecker,
})

const multer = Multer({
    storage: storage,
    fileFilter: fileFilter,
})

export default multer

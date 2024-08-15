import { jsonwebtoken as JWT } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodeToken = jwt.verify(token, 'secretKey')
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' })
    }
}

const { Storage } = require('@google-cloud/storage')
require('dotenv').config()
const projectId = process.env.PROJECT_ID
const keyFilename = process.env.FILE_KEY_NAME
const storage = new Storage({ projectId, keyFilename })
const bucket = storage.bucket(process.env.BUCKET_NAME)
class _storage {
    uploadToGcs = async (req, res, next) => {
        try {
            if (!req.file) return "error"
            const publicUrl = (filename)=>{
                return 'https://storage.googleapis.com/befitoutfit/images/' + filename
            }
            const gcsname = `${Date.now()}-${req.file.originalname}`
            const file = bucket.file(`images/${gcsname}`)
            const stream = file.createWriteStream({
                metadata: {
                    contentType: req.file.mimetype
                }
            })
            stream.on('error', (err) => {
                req.file.cloudStorageError = err
                next(err)
            })
            stream.on('finish', () => {
                req.file.cloudStorageObject = gcsname
                req.file.cloudStoragePublicUrl = publicUrl(gcsname)
                next()
            })

            stream.end(req.file.buffer)
            return {
                status: 200,
                message:"success beneran",
            }
        } catch (error) {
            console.error('Error, ', error)
        }
    }

}
module.exports = new _storage()
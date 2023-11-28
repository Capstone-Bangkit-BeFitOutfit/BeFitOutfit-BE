const { Storage } = require('@google-cloud/storage')
const path =require('path')
require('dotenv').config()
const projectId = process.env.PROJECT_ID
const keyFilename = process.env.FILE_KEYY_NAME
const storage = new Storage({ projectId, keyFilename })
const bucket = storage.bucket(process.env.BUCKET_NAME)
class _storage {
    uploadToGcs = async (req) => {
        try {
            if (!req.files){
                return "error"
            }
            console.log(req.files)
            const gcsname = "tess"
            const file = bucket.file(gcsname)
            const stream = file.createWriteStream({
                metadata: {
                    contentType: req.files.mimetype
                }
            })
            stream.on('error', (err) => {
                req.files.cloudStorageError = err
                console.log(err)
            })
            stream.on('finish', () => {
                req.files.cloudStorageObject = gcsname
                req.files.cloudStoragePublicUrl = 'https://storage.googleapis.com/befitoutfit/images/' + gcsname
            })

            stream.end(req.files.buffer)
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
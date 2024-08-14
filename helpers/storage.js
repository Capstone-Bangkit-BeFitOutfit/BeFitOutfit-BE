const { Storage } = require('@google-cloud/storage')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const prisma =  require('./database')
require('dotenv').config()
const projectId = process.env.PROJECT_ID
const keyFilename = process.env.FILE_KEY_NAME
const bucketName = process.env.BUCKET_NAME
const storage = new Storage({ projectId, keyFilename })
const bucket = storage.bucket(bucketName)
class _storage {
    uploadToGcs = (req, res, next) => {
        try {
            if (!req.file) return "error"
            const schema = Joi.object({
                photo: Joi.object({
                    mimetype: Joi.string().valid('image/png', 'image/jpeg', 'image/jpg').required(),
                    buffer: Joi.binary().required()
                })
            }).options({ abortEarly: false })
            const validation = schema.validate({
                photo: {
                    mimetype: req.file.mimetype,
                    buffer: req.file.buffer
                }
            })
            if (validation.error) {
                const errorDetails = validation.error.details[0].message
                return res.status(400).send({ message: errorDetails })
                // console.log(errorDetails)

            }
            const publicUrl = (filename) => {
                return `https://storage.googleapis.com/data-befit/images/` + filename
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
        } catch (error) {
            console.error('Error, ', error)
            return {
                code: 500,
                message: "Internal server error when upload file to cloud"
            }
        }
    }
    deleteToGcs = async (req,res,next)=>{
        try{
            const  idOutfit = Number(req.params.id)
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, 'secret-code-token');
            const user = await prisma.user.findUnique({
                where: { email: decoded.email },
                select: {
                    id: true,
                },
            });

            const validateIdOutfit = await prisma.outfit.findUnique({
                where: {
                    id: idOutfit,
                    userId: user.id,
                },
            });
            if (!validateIdOutfit) {
                return {
                    code: 404,
                    message: 'Outfit not found',
                };
            }
            const imgUrl = validateIdOutfit.photo;
            if (imgUrl) {
                const fileName = imgUrl.split('/').pop();

                // Hapus file dari bucket
                await bucket.file(`images/${fileName}`).delete();
            }
            next()
        }
        catch(err){
            console.error('Error, ', err)
            return {
                code: 500,
                message: "Internal server error when delete file to cloud"
            }
        }
    }

}
module.exports = new _storage()
const prisma = require('../helpers/database')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
class _outfit {
    addOutfit = async (req) => {
        try {
            if (req.file && req.file.cloudStoragePublicUrl) {
                const imgUrl = req.file.cloudStoragePublicUrl
                let includeValue = req.body.include
                if (includeValue === "false"){
                    includeValue=0
                }else if(includeValue === "true"){
                    includeValue=1
                }
                const schema = Joi.object({
                    name: Joi.string().required(),
                    event: Joi.string().required(),
                    photo: Joi.object({
                        mimetype: Joi.string().valid('image/png', 'image/jpeg', 'image/jpg').required(),
                        buffer: Joi.binary().required()
                    }),
                    percentage: Joi.number().required(),
                    type: Joi.string().required(),
                    include:Joi.boolean().required()
                }).options({ abortEarly: false })
                const validation = schema.validate({
                    name: req.body.name,
                    event: req.body.event,
                    photo: {
                        mimetype: req.file.mimetype,
                        buffer: req.file.buffer
                    },
                    percentage: Number(req.body.percentage),
                    type: req.body.type,
                    include:Boolean(includeValue)
                })
                if (validation.error) {
                    const errorDetails = validation.error.details.map(detail => {
                        detail.message
                    })
                    return {
                        status: false,
                        code: 422,
                        error: errorDetails.join(', ')
                    }
                }
                const token = req.headers.authorization.split(' ')[1]
                const decoded = jwt.verify(token, 'secret-code-token')
                const user = await prisma.user.findUnique({
                    where: { email: decoded.email },
                    select: {
                        id: true,
                    }
                })

                    await prisma.outfit.create({
                        data:{
                            userId:user.id,
                            nama:req.body.name,
                            event:req.body.event,
                            photo:imgUrl,
                            percentage:Number(req.body.percentage),
                            type:req.body.type,
                            include:Boolean(includeValue)
                        }
                    })
                
                return {
                    code: 201,
                    message: "created"
                }
            }
            else {
                return {
                    code: 400,
                    message: "failed - bad request",
                }
            }
        } catch (error) {
            console.error(Error, error)
            return{
                code:500,
                message: "Internal Error, " + error
            }
        }
    }
}
module.exports = new _outfit()
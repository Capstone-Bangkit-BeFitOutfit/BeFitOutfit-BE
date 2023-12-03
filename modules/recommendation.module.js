const prisma = require('../helpers/database')
const Joi = require('joi')
class _recommendation {
    getRecommendation = async (req) => {
        try {
            if(!req.query.email&&req.query.event){
                return{
                    code:400,
                    message:"failed - bad request"
                }
            }
            const schema = Joi.object({
                email:Joi.string().required(),
                event:Joi.string().required()
            })
            const validation = schema.validate({
                email:req.query.email,
                event:req.query.event
            })
            if(validation.error){
                const errorDetails = validation.error.details.map(detail=>{
                    detail.message
                })
                return{
                    status: false,
                    code:422,
                    error: errorDetails.join(', ')
                }
            }
            const user = await prisma.user.findUnique({
                where: { email: req.query.email },
                select: {
                    id: true,
                }
            })
            const findTop = await prisma.outfit.findMany({
                where:{
                    userId:user.id,
                    event:req.query.event,
                    type:"top",
                    include:true
                },
                orderBy:{
                    percentage:'desc'
                },
                take:1,
                select:{
                    id:true,
                    nama:true,
                    type:true,
                    photo:true
                }
            })
            const findBottom = await prisma.outfit.findMany({
                where:{
                    userId:user.id,
                    event:req.query.event,
                    type:"bottom",
                    include:true
                },
                orderBy:{
                    percentage:'desc'
                },
                take:1,
                select:{
                    id:true,
                    nama:true,
                    type:true,
                    photo:true
                }
            })
            const findExtra = await prisma.outfit.findMany({
                where:{
                    userId:user.id,
                    event:req.query.event,
                    type:"extra",
                    include:true
                },
                orderBy:{
                    percentage:'desc'
                },
                take:3,
                select:{
                    id:true,
                    nama:true,
                    type:true,
                    photo:true
                }
            })
            return {
                code: 200,
                message: "success",
                data:{
                    top:findTop,
                    bottom:findBottom,
                    extra:findExtra
                }
            }
        } catch (err) {
            console.error('Error recommendation module', err)
            return {
                code: 500,
                message: err
            }
        }
    }
}
module.exports = new _recommendation()
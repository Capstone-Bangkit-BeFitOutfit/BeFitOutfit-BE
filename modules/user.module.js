const Joi = require('joi');
const prisma = require('../helpers/database')
const bcrypt = require('bcrypt')
class _user {
    updateUser = async(body)=>{
        try{
            const schema = Joi.object({
                username:Joi.string().required(),
                password:Joi.string().required(),
                roleId:Joi.number().required()
            }).options({abortEarly: false})
            const validation = schema.validate(body)
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
            const getUser = await prisma.user.findUnique({
                where:{
                    username: body.username
                },
                select:{
                    username: true,
                    password: true,
                    AuthUsers:{
                        select:{
                            id:true
                        }
                    }
                }
            })
            // console.log(getUser)
            if(!bcrypt.compareSync(body.password, getUser.password)){
                return{
                    status:false,
                    code:404,
                    message: "User account not found"
                }
            }
            const authUserId = getUser.AuthUsers[0].id
            const editUser = await prisma.authUsers.update({
                where:{id:authUserId},
                data:{roleId:body.roleId}
            })
            return{
                status:true,
                code:201,
                message:"Update success",
                data:editUser
            }
        }
        catch(error){
            console.error('updateUser user module Error:', error);
            return{
                status: false,
                code:404,
                error
            }
        }
    }
}

module.exports = new _user()
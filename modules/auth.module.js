const Joi=require('joi')
const bcrypt = require('bcrypt')
const prisma = require('../helpers/database')
class _auth{
    loginUser = async (body) => {
        try{
            console.log(body.username)
            console.log(body.password)
            const schema = Joi.object({
                username:Joi.string().required(),
                password:Joi.string().required()
            }).options({abortEarly: false})
            const validation = schema.validate(body)
            if (validation.error) {
                const errorDetails = validation.error.details.map(detail => detail.message)

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(', ')
                }
            }
            const User = await prisma.user.findUnique({
                where: {
                    username: body.username,
                },
            })
            if(bcrypt.compareSync(body.password, User.password)){
                return{
                    status:false,
                    code:404,
                    message: "Password yang anda masukkan salah"
                }
            }
            // console.log (password)
            const user = await prisma.authUsers.findFirst({
                where: {
                    userId: User.id,
                    roleId:4
                },
                select:{
                    users:{
                        select:{
                            username:true,
                            password:true
                        }
                    },
                    roles:{
                        select:{
                            name:true
                        }
                    }
                }
            })
            const {users, roles} = user
            const data = {
                "username": users.username,
                "password":users.password,
                "roles":roles.name
            }
            // console.log(data)
            return {
                status: 200,
                data: data
            }
        }
        catch(error){
            console.error('loginUser user module Error:', error);
            return {
                status: false,
                code: 404,
                error
            }
        }

    }
}

module.exports = new _auth()
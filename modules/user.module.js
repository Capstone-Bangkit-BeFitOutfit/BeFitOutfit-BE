const Joi = require('joi');
const prisma = require('../helpers/database')
const bcrypt = require('bcrypt')
class _user {
    updateUser = async (userId, body) => {
        try {
            const schema = Joi.object({
                username: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required(),
            }).options({ abortEarly: false })

            const validation = schema.validate(body)

            //bad request
            if (validation.error) {
                const errorDetails = validation.error.details.map(detail => {
                    detail.message
                })

                return {
                    status: false,
                    code: 400,
                    error: errorDetails.join(', ')
                }
            }
            const getUser = await prisma.user.findUnique({
                where: {
                    username: body.username
                },
                select: {
                    username: true,
                    email: true,
                    password: true,
                }
            })

            // console.log(getUser)
            if (!bcrypt.compareSync(body.password, getUser.password)) {
                return {
                    status: false,
                    code: 404, //user not found
                    message: "User account not found"
                }
            }
            
            await prisma.user.update({
                where: { id: userId },
                data: { username: body.username,
                        email: body.email 
                }
            })
            return {
                status: true,
                code: 201, //created
                message: "Update succes",
            }
        }

        catch (error) {
            console.error('updateUser user module Error:', error);
            return {
                status: false,
                code: 500, //bad gateway
                error
            }
        }
    }
}

module.exports = new _user()
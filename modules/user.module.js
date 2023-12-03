const Joi = require('joi');
const jwt = require('jsonwebtoken')
const prisma = require('../helpers/database')
const bcrypt = require('bcrypt');
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

            // Check if new username is already taken
            const isUsernameTaken = await prisma.user.findFirst({
                where: {
                    username: body.username,
                    id: { not: userId }, // Ensure not comparing with itself
                },
            });

            if (isUsernameTaken) {
                return {
                    status: false,
                    code: 400, // Bad Request
                    message: 'Username is already taken',
                };
            }


           


            const getUser = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    username: true,
                    email: true,
                    password: true,
                }
            })



            if (!bcrypt.compareSync(body.password, getUser.password)) {
                return {
                    status: false,
                    code: 404, //user not found
                    message: "User account not found"
                }
            }

            
            const getRole = await prisma.role.findFirst({
                where: { name: "user" },
                select: {
                    id: true
                }
            })

            //data pada token
            const user = await prisma.authUsers.findFirst({
                where: {
                    userId: userId,
                    roleId: getRole.id
                },
                select: {
                    users: {
                        select: {
                            username: true,
                            email: true
                        }
                    },
                    roles: {
                        select: {
                            name: true
                        }
                    }
                }
            })
            const { users, roles } = user

            const data = {
                username: users.username,
                email: users.email,
                roles: roles.name
            }
            const token = jwt.sign(data, 'secret-code-token', { expiresIn: "1h" })
            console.log(token)


            //pengkodisian update
            await prisma.user.update({
                where: { id: userId },
                data: {
                    username: body.username,
                    email: body.email
                }
            })
            return {
                status: true,
                code: 201, //created
                message: "Update success",
                data: {
                    "username": data.username,
                    "email": data.email,
                    "token": token
                }
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
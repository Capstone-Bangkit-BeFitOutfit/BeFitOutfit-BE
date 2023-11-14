const prisma = require('../helpers/database')
const bcrypt = require('bcrypt')
class _user {
    addUser = async (req) => {
        try {
            const password = bcrypt.hashSync(req.password, 15)
            const add = await prisma.user.create({
                data: {
                    username: req.username,
                    password: password,
                    AuthUsers: {
                        create: {
                            roleId: 4
                        }
                    }
                }
            });
            const allUsers = await prisma.user.findMany({
                where: {
                    username: req.username
                }
            })
            console.dir(allUsers, { depth: null })
            return {
                status: true,
                code: 201,
                data: add,
            };
        } catch (error) {
            console.error('addUser user module Error:', error);
            return {
                status: false,
                code: 404,
                error
            }
        }
    }
}

module.exports = new _user
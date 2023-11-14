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
    loginUser = async (req) => {
        try{
            const User = await prisma.user.findUnique({
                where: {
                    username: req.username,
                },
            })
            if(bcrypt.compareSync(req.password, User.password)){
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

module.exports = new _user
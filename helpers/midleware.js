const prisma = require('./database');
const jwt = require('jsonwebtoken')
const middleware = async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, 'secret-code-token')
            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp <= currentTime) {
                return res.status(401).send({ message: 'Unauthorized - Token has expired' });
            }
            console.log(decoded.exp+" "+currentTime)
            const user = await prisma.user.findUnique({
                where: { email: decoded.email },
                select: {
                    id: true,
                }
            })
            const authRole = await prisma.authUsers.findFirst({
                where: { userId: user.id }
            })
            const getRole = await prisma.role.findFirst({
                where: { id: authRole.roleId }
            })
            if (getRole.name = "user") {
                next()
            }
            else {
                res.status(403).send({
                    status: false,
                    error: "Not Autenthicated"
                })
            }
        } catch (error) {
            const process=String(error)
            const textError = process.split(': ')
            if(textError[0]==="TokenExpiredError"){
                return res.status(404).send({message: "Token has timed out!"})
            }
            console.error('Midleware Error:', error);
            return {
                status: false,
                code: 404,
                error
            }
        }
    }
    if (!token) {
        res.status(401).send({
            status: false,
            error: "No Authorize no token"
        })
    }
}
module.exports = middleware
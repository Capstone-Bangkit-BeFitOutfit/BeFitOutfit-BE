const prisma = require('../helpers/database')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
class _outfit {

    //GET OUTFIT
    getOutfit = async (req) => {
        try {
            const token = req.headers.authorization.split(' ')[1]

            // periksa token
            if (!token) {
                return {
                    status: false,
                    code: 400,
                    message: 'Bad Request - Token is missing',
                };
            }
            const decoded = jwt.verify(token, 'secret-code-token')
            const user = await prisma.user.findUnique({
                where: { email: decoded.email },
                select: {
                    id: true,
                }
            })

            // Bad request
            if (!user) {
                return {
                    status: false,
                    code: 400,
                    message: 'Bad Request - User not found',
                };
            }
            // Retrieve outfits for the user
            const outfits = await prisma.outfit.findMany({
                where: { userId: user.id },
                select: {
                    id: true,
                    nama: true,
                    type: true,
                    event: true,
                    photo: true,
                    include: true,
                },
            })
            const listOutfits = outfits.map((outfit) => ({
                id: outfit.id,
                name: outfit.nama,
                type: outfit.type,
                event: outfit.event,
                imageUrl: outfit.photo,
                include: outfit.include
            }));
            return {
                message: 'success',
                code: 200,
                data: listOutfits,
            };
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return {
                    code: 400,
                    message: 'Bad Request - Invalid token',
                };
            }

            console.error(Error, error);
            return {
                code: 500,
                message: 'Internal Error, ' + error,
            };
        }
    };

    // ADD OUTFIT
    addOutfit = async (req, res, next) => {
        try {
            if (req.file && req.file.cloudStoragePublicUrl) {
                const imgUrl = req.file.cloudStoragePublicUrl
                let includeValue = req.body.include
                if (includeValue === "false") {
                    includeValue = 0
                } else if (includeValue === "true") {
                    includeValue = 1
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
                    include: Joi.boolean().required()
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
                    include: Boolean(includeValue)
                })
                if (validation.error) {
                    const errorDetails = validation.error.details.map(detail =>
                        detail.message
                    )
                    return {
                        status: false,
                        code: 422,
                        message: errorDetails
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
                    data: {
                        userId: user.id,
                        nama: req.body.name,
                        event: req.body.event,
                        photo: imgUrl,
                        percentage: Number(req.body.percentage),
                        type: req.body.type,
                        include: Boolean(includeValue)
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
            return {
                code: 500,
                message: "Internal Error, " + error
            }
        }
    }


    // UPDATE OUTFIT
    updateOutfit = async (req) => {
        try {
            const idOutfit = Number(req.params.id)
            let includeValue = req.body.include
            if (includeValue === "false") {
                includeValue = 0
            }
            if (includeValue === "true") {
                includeValue = 1
            }
            const schema = Joi.object({
                id: Joi.number().required(),
                name: Joi.string(),
                type: Joi.string(),
                include: Joi.boolean()
            })
            const validation = schema.validate({
                id: idOutfit,
                name: req.body.name,
                type: req.body.type,
                include: Boolean(includeValue)
            })
            if (validation.error) {
                const errorDetails = validation.error.details.map(detail =>
                    detail.message
                )
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
            const validateIdOutfit = await prisma.outfit.findUnique({
                where: {
                    id: idOutfit,
                    userId: user.id
                }
            })
            if (validateIdOutfit === null) {
                return {
                    code: 404,
                    message: "No oufit"
                }
            }
            if (req.body.name) {
                await prisma.outfit.update({
                    where: {
                        id: idOutfit,
                        userId: user.id
                    },
                    data: {
                        nama: req.body.name
                    }
                })
            }
            if (req.body.include) {
                await prisma.outfit.update({
                    where: {
                        id: idOutfit,
                        userId: user.id
                    },
                    data: {
                        include: Boolean(includeValue)
                    }
                })
            }
            if (req.body.type) {
                await prisma.outfit.update({
                    where: {
                        id: idOutfit,
                        userId: user.id
                    },
                    data: {
                        type: req.body.type
                    }
                })
            }
            return {
                code: 200,
                message: "success"
            }
        } catch (err) {
            console.error('Error, ' + err)
            return {
                code: 500,
                message: "Internal server error outfit module"
            }
        }
    }

    // DELETE OUTFIT
    deleteOutfit = async (req) => {
        try {
            const idOutfit = Number(req.params.id);
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

            // Delete the outfit
            await prisma.outfit.delete({
                where: {
                    id: idOutfit,
                },
            });

            return {
                code: 200,
                message: 'successfully deleted',
            };
        } catch (err) {
            console.error('Error, ' + err);
            return {
                code: 500,
                message: 'Internal server error outfit module',
            };
        }
    };
}

module.exports = new _outfit();
const { PrismaClient } = require('@prisma/client')
const { user } = require('./helpers/database')

const prisma = new PrismaClient()
async function main() {
  // await prisma.role.create({
  //   data:{
  //     name:"admin",
  //   }
  // })


  // await prisma.role.update({
  //     where:{id:2},
  //     data:{
  //       name:"user",
  //     }
  //   })


  // const getRole = await prisma.role.findFirst({
  //     where:{name:"user"},
  //     select:{
  //         id:true
  //     }
  // })
  // console.log(getRole.id)

  // const User = await prisma.user.findUnique({
  //     where: {email: "test@example.id"}
  // })
  // console.log(User)

  //   const user =await prisma.user.findUnique({
  //     where:{email:"test@example.id"},
  //     select:{
  //         id:true,
  //         AuthUsers:{
  //             select:{
  //                 userId:true,
  //                 roleId:true
  //             }
  //         }
  //     }
  // })
  // console.log(user)

  const getUser = await prisma.user.findUnique({
    where: {
      username: "user"
    },
    select: {
      username: true,
      password: true,
      AuthUsers: {
        select: {
          id: true
        }
      }
    }
  })
  const authUserId = getUser.AuthUsers[0].id
  await prisma.authUsers.update({
    where: { id: authUserId },
    data: { roleId: 2 }
  })
  const result = await prisma.authUsers.findFirst({
    where:{userId:1}
  })
  console.log(result)

  // const allUsers = await prisma.role.findMany({
  //     where: {
  //       name: "user"
  //     }
  //   })
  //   console.dir(allUsers, { depth: null })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
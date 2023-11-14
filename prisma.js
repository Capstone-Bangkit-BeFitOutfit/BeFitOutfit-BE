const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// ... you will write your Prisma Client queries here
async function main() {
  await prisma.user.create({
    data: {
      username: "user2",
      password: "user2",
      AuthUsers: {
        create: {
          roleId: 4
        }
      }
    }
  });



  // await prisma.role.create({
  //   data:{
  //     name:"user",
  //   }
  // })

  const allUsers = await prisma.user.findMany({
    where: {
      username: "root"
    }
  })
  console.dir(allUsers, { depth: null })
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
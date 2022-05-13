const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getUsers = async (req,res) => {
        const users = await prisma.user.findMany()
        res.json(users)
    }

module.exports = { getUsers }

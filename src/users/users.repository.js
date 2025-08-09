const prisma = require("../db/index");

const findAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
}

module.exports = {
    findAllUsers,
}
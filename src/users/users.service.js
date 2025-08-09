const prisma = require("../db/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUserbyId = async (id) => {
    if(typeof id === "string"){
        throw Error("id is not a string");
    };

    const userId = await prisma.user.findUnique({
        where:{
            id: id,
        }
    })

    if(!userId){
        throw Error("User tidak ditemukan");
    };

    return userId
};

const deleteUserbyId = async(id) => {
   await prisma.user.delete({
    where:{id: id},
   });
   
};

const registerUser = async (name, email, password) => {
    const existUser = await prisma.user.findUnique({
        where: {email: email}
    });

    if(existUser){
        throw new Error("email sudah terdaftar");
    };

    const hashPass = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data:{
            name,
            email,
            password:hashPass,
        }
    });
    return{
        id:newUser.id,
        name:newUser.name, 
        email:newUser.email,
        role:newUser.role,
    };
}

const loginUser = async(email, password) => {
    const user = await prisma.user.findUnique({where:{email}});
    if(!user){
        throw new Error("user tidak ditemukan, silahkan daftar terlebih dahulu");
    }
    const compare = await bcrypt.compare(password, user.password);
    if(!compare){
        throw new Error("password salah");
    };
    const payload ={
        id:user.id,
        name:user.name,
        role:user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:'1h'});
    console.log(token);
    return{message:"berhasil", token};
}

module.exports = {
    getUserbyId,
    deleteUserbyId,
    registerUser,
    loginUser,
}
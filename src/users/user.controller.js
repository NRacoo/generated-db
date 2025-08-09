
const express = require("express");
const {findAllUsers} = require("./users.repository");
const { deleteUserbyId, registerUser, loginUser } = require("./users.service");
const prisma = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    const Users = await findAllUsers();
    res.send(Users);
} );

router.post("/register", async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await registerUser( email, password);
        res.status(200).json({message:"user berhasil ditambahkan", user});
    } catch (error) {
        res.status(400).json({message:error.message || "terjadi kesalahan pada server"})
    }
});

router.post("/login", async(req, res) => {
    const {email, password} = req.body;
    try {
        const result = await loginUser(email, password);
        res.send({status:200, message:"berhasil login"});
    } catch (error) {
        res.status(401).json({message:error.message});
    }

})

router.delete("/:id", async (req, res) => {
    try{    
        const {id} = req.params;
        console.log("params:",id)
        const user = await prisma.user.delete({
            where: {id},
        });
        res.send("user berhasil dihapus")
    }catch(error){
        res.status(400).send({message:"user gagal dihapus"})
    }
});





module.exports = router
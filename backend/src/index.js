const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());

const userController = require("./users/user.controller");
app.use("/api/users", userController);

const verifyToken = (req, res, next) => {
    const bearerHeder = req.headers['authorization'];

    if(typeof bearerHeder !== "undefined"){
        const token = bearerHeder.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                return res.status(403).json({message: "invalid token"})
            }else{
                req.user = decoded;
                next();
            }
        })
    }else{
        res.status(401).json({message:"token not provided"})
    }
}


app.get("/protected", verifyToken, (req, res) => {
    res.json({
        message:"accees granted route",
        user:req.user
    })
})

app.listen(PORT, () => {
    console.log(`server run on port ${PORT}`);
});
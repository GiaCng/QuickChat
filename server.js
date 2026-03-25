const express = require("express");

const cors = require("cors");

const app = new express();

const User = require("./User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const connectDB = require("./db");
const { connect } = require("mongoose");
const authMiddleware = require("./middleware");

require("dotenv").config();

connectDB();
app.use(cors());

app.use(express.json());


app.post("/register", async (req,res) =>{
    const {name, email, password} = req.body;

    const hashedBcrypt = await bcrypt.hash(password, 5);

    console.log("hashedBcrypt");
    const user = new User({
        name : name,
        email : email,
        password : hashedBcrypt
    });

    console.log("thông tin",user);

    await user.save();

    res.json("Đăng ký thành công")
})

app.post("/login", async (req,res) =>{
    const {email, password} = req.body;

    const user = await User.findOne({"email" : email});

    if (!user) res.json("Không tìm thấy user");

    const hashPassword = await bcrypt.compare(password, user.password) ;

    if (!hashPassword) res.json("Sai mật khẩu");

    const token = jwt.sign({
        email: email,
        password: password
    },
    process.env.JWT_SECRET,
    {expiresIn:"1h"}
    );

    res.json(token);
})

app.get("/users", authMiddleware, async(req,res) =>{
    const users = await  User.find({
        email : { $ne : req.user.email}
    });

    console.log(users);

    res.json(users);
} )


app.listen(3001, () =>{
    console.log("Port đang chạy");
})
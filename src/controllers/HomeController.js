const User = require("../models/User.js");
const Message = require("../models/Message.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class HomeController {

    async register(req, res) {
        const { name, email, password } = req.body;

        const hashed = await bcrypt.hash(password, 5);

        const user = new User({
            name,
            email,
            password: hashed
        });

        await user.save();

        res.json("Đăng ký thành công");
    }

    async login(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.json("Không tìm thấy user");

        const check = await bcrypt.compare(password, user.password);

        if (!check) return res.json("Sai mật khẩu");

        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json(token);
    }

    async getUsers(req, res) {
        const users = await User.find({
            email: { $ne: req.user.email }
        });

        res.json(users);
    }

    async getMessages(req, res) {
        const receiverEmail = req.query.email;

        const data = await Message.find({
            $or: [
                {
                    senderEmail: req.user.email,
                    receiverEmail
                },
                {
                    senderEmail: receiverEmail,
                    receiverEmail: req.user.email
                }
            ]
        });

        res.json(data);
    }

    async createMessage(req, res) {
        const { senderEmail, receiverEmail, content } = req.body;

        const message = new Message({
            senderEmail,
            receiverEmail,
            content,
            createdAt: new Date()
        });

        await message.save();

        res.json(message);
    }

 
}

module.exports = new HomeController();
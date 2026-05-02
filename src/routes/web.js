const express = require("express");
const router = express.Router();

const HomeController = require("../controllers/HomeController");
const authMiddleware = require("../middlewares/middleware");

router.post("/register", HomeController.register);
router.post("/login", HomeController.login);

router.get("/users", authMiddleware, HomeController.getUsers);
router.get("/message", authMiddleware, HomeController.getMessages);
router.post("/create", authMiddleware, HomeController.createMessage);

module.exports = router;
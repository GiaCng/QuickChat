const mongoose = require("mongoose");

console.log("Đang connect");

const connectDB = async () =>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/chat_realtime");
        console.log("Đã kết nối cơ sở dữ liệu");
    } catch{
        console.log("Lỗi DB", err);
    }
}

module.exports = connectDB;
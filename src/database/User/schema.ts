import mongoose from 'mongoose'

interface User {
    account: String,
    password: Number,
}

export default new mongoose.Schema<User>({
    account: String,
    password: Number,
});
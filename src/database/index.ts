import mongoose from 'mongoose'
import './User/model'

async function connect() {
    await mongoose.connect('mongodb://localhost:27017/vitis', {
        autoIndex: false,
        socketTimeoutMS: 300
    })
}

connect()
.then(() => {
    console.log('db connect success')
})
.catch(() => {
    console.log('db connect error')
})
import mongoose from 'mongoose'
import './User/model'

function handleError(error: any) {
    console.error('数据库连接失败', error)
}

function connect() {
    mongoose.connection.on('error', handleError);
    const con = mongoose.connect('mongodb://localhost:27017/vitis', {
        autoIndex: false,
        socketTimeoutMS: 300
    })

    return con
}

connect()
.then(() => {
    console.log('db connect success')
})
.catch(handleError)
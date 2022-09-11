import mongoose from 'mongoose'
import './User/model'
import ENV_CONFIG from '../../env.config.json'

function handleError(error: any) {
    console.error('数据库连接失败', error)
}

function connect() {
    mongoose.connection.on('error', handleError);
    const con = mongoose.connect(ENV_CONFIG.MONGODB_URL, {
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
const { Sequelize } = require("sequelize");
require('dotenv').config()


const sequelize = new Sequelize(process.env.DB_Name, process.env.DB_USER, process.env.DB_PASSWORD,{
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    define:{
        timestamps: true
    }
})

async function testConnection(){
    try {
        await sequelize.authenticate()
        console.log("✅ Database connected successfullf")

    } catch (error) {
        console.log("❌ error while connection", error)
    }
}

  syncDB = async (force = false, alter =false) =>{
    try {
        await sequelize.sync(force, alter)
        console.log("✅ ALL MODELS WESE SYNCHRONIZED SUCCESSFULLY")
    } catch (error) {
        console.error('❌ ERROR SCYNCING MODEL ', error)
        
    }
}
syncDB()


module.exports = {testConnection, sequelize}
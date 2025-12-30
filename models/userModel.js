const {sequelize} = require('../config/db')
const {DataTypes} = require('sequelize')

const User = sequelize.define("User",{
    id:{
        type:DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement:true
    },
    name:{
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    email:{
        type:DataTypes.STRING(200),
        allowNull:false,
        unique: true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    address:{
        type: DataTypes.STRING,
        
    },
    contactNumber:{
        type: DataTypes.STRING,
        allowNull: false
    },
    role:{
        type: DataTypes.ENUM("Admin", "User", "Doctor"),
        defaultValue: 'user'
    }
},{
    timestamps:true,
    tableName: "Users"
}
)

module.exports = User
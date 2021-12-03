const { models } = require('../../config/db')
const sequelize = require('sequelize')

class AuthServices{
    addNewAccount = (AccountInfo) => {
        return new Promise(async (resolve, reject) => {
            try {

                await models.users.create({
                    username:AccountInfo.username,
                    password_hashed: AccountInfo.password,
                    full_name: (AccountInfo.firstname + " " + AccountInfo.lastname),
                    email: AccountInfo.email,
                    avatar_url: '../../public/images/avatars/person-0.png',
                    address: (AccountInfo.address + " " + AccountInfo.country),
                    role: "Customer",
                    active: 1,
                    phone_number: AccountInfo.phone_number
                }, { raw: true })

                resolve("New account added !!!")
            }
            catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = new AuthServices
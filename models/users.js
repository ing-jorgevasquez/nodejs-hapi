'use strict'

const bcrypt = require('bcrypt')

class Users {
    constructor(db){
        this.db = db
        this.ref = this.db.ref('/')
        this.collection = this.ref.child('users')
    }

    async create(data){
        data.password = await this.constructor.encript(data.password)
        const newUser = this.collection.push()
        newUser.set(data)

        return newUser.key
    }

    async validate(data){
        const userQuery = await this.collection.orderByChild('email').equalTo(data.email).once('value')
        const userFound = userQuery.val()
        if(userFound){
            const userId = Object.keys(userFound)[0]
            const passwordRight = await bcrypt.compare(data.password, userFound[userId].password)
            const result = passwordRight ? userFound[userId] : false
            return result
        }        

        return false
    }

    static async encript(passw){
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(passw, saltRounds)
        return hashedPassword
    }
}

module.exports = Users
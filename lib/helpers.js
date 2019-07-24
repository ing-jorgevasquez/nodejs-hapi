'use strict'

const handlebars = require('handlebars')

function registerHelpers(){
    handlebars.registerHelper('answersCount', (answers) => {
        const keys = Object.keys(answers)
        return keys.length
    })

    handlebars.registerHelper('ifEquals', (userA, userB, options) => {
        if(userA === userB){
            return options.fn(this)
        }
        return options.inverse(this)
    })

    return handlebars
}

module.exports = registerHelpers()
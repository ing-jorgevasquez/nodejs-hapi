'use strict'

const questions = require('../models/index').questions

async function setAnswerRight(questionId, answerId, user){
    console.log('Se ejecutó el método')

    let result
    try {
        result = await questions.setAnswerRight(questionId, answerId, user)
    } catch (error) {
        console.error(error)
        return false
    }

    return result
}

async function getLast(amount) {
    let data
    try {
        data = await questions.getLast(amount)
    } catch (error) {
        console.error(error)
    }
    return data
}

module.exports = {
    getLast: getLast,
    setAnswerRight: setAnswerRight
}
'use strict'

const {writeFile} = require('fs')
const {promisify} = require('util')
const {join} = require('path')
const uuid = require('uuid/v1')
const questions = require('../models/index').questions

const write = promisify(writeFile)

async function createQuestion(req, h){
    let result, filename
    try {
        if(Buffer.isBuffer(req.payload.image)){
            filename = `${uuid()}.png`
            await write(join(__dirname, '..', 'public', 'uploads', filename), req.payload.image)
        }
        result = await questions.create(req.payload, req.state.user, filename)
        req.log('info', `Pregunta creada con el ID ${result}`)
    } catch (error) {
        req.log('error', `Ocurrió un error creando la pregunta ${error}`)
        return h.view('ask', {
            title: 'Crear pregunta',
            error: 'Problemas creando la pregunta'
        }).code(500).takeover()
    }

    return h.redirect(`question/${result}`)
}

async function answerQuestion(req, h){
    let result
    try {
        result = await questions.answer(req.payload, req.state.user)
    } catch (error) {
        req.log('error', `Ocurrió un error guardando respuesta para la pregunta ${error}`)
    }

    return h.redirect(`/question/${req.payload.id}`)
}

async function setAnswerRight(req, h){
    let result
    try {
        result = await req.server.methods.setAnswerRight(req.params.questionId, req.params.answerId, req.state.user)
        req.log('info', result)
    } catch (error) {
        req.log('error', error)
    }

    return h.redirect(`/question/${req.params.questionId}`)
}

module.exports = {
    answerQuestion: answerQuestion,
    createQuestion: createQuestion,
    setAnswerRight: setAnswerRight
}
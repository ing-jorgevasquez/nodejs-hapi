const Boom = require('@hapi/boom')
const users = require('../models/index').users

async function createUser (req, h) {
    let result
    try {
        result = await users.create(req.payload)
    } catch (error) {
        console.error(error)
        // return h.response('Problemas creando usuario').code(500)
        return h.view('register', {
            title: 'Registro',
            error: 'Problemas creando usuario'
        })
    }

    // return h.response(`Usuario creado. ID ${result}`)
    return h.view('register', {
        title: 'Registro',
        success: 'Usuario creado exitosamente!'
    })
}

async function logout (req, h) {
    return h.redirect('/login').unstate('user')
}

function failValidation(req, h, err){
    const templates = {
        '/create-user': 'register',
        '/validate-user': 'login',
        '/create-question': 'ask',
        '/answer-question': 'question'
    }
    return h.view(templates[req.path], {
        title: 'Error de validación',
        error: 'Por favor complete los campos requeridos'
    }).code(400).takeover()
    // return Boom.badRequest('Falló la validación', req.payload)
}

async function validateUser (req, h) {
    let result
    try {
        result = await users.validate(req.payload)
        if(!result){
            // return h.response('Email y/o contraseña incorrecta').code(401)
            return h.view('login', {
                title: 'Login',
                error: 'Email y/o contraseña incorrecta'
            })
        }
    } catch (error) {
        console.error(error)
        // return h.response('Problemas validando usuario').code(500)
        return h.view('login', {
            title: 'Login',
            error: 'Problemas validando usuario'
        })
    }

    return h.redirect('/').state('user', {
        name: result.name,
        email: result.email
    })
}

module.exports = {
    createUser: createUser,
    validateUser: validateUser,
    failValidation: failValidation,
    logout: logout
}
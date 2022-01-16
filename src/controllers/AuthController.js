const AuthServices = require('../services/AuthServices')
const SendMailHandler = require('../middleware/SendMailHandler')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { token } = require('morgan')

JWT_KEY ='aiHQIfnb62JIFBEW!FioqwebeJCasd3!fj%3nfdhbDFdnsddf0yyeMMsdcG'

class AuthController {
    // [GET]  /login
    loginView(req, res) {
        if (req.query.failed) {
            res.render('auth/login', { msg: 'Username or password is incorrect!' })
        } else {
            res.render('auth/login')
        }
    }

    // [POST] /login
    login(req, res) {
        res.locals.user = req.user
        res.redirect('/')
    }

    // [GET] /logout
    logout(req, res) {
        req.logout()
        res.redirect('/')
    }

    // [GET]  /signup
    signup(req, res) { res.render('auth/signup') }

    // [GET]  /password-recovery-request
    pass_recover_request(req, res) { res.render('auth/password-recovery-request') }

    //[GET] /password-recover-notify
    password_recover_notify(req, res){ res.render('auth/password-recover-notify') }

    // [POST] /info-to-recover
    async send_mail_recover_password(req, res) {
        //send confirm mail to recover password
        const username = req.body.username 
        const user_email = req.body.email
        let token = jwt.sign({username},JWT_KEY,{expiresIn: '1d'})
        const url = process.env.DEPLOY_ENV + `/auth/password-recovery/${token}`;

        SendMailHandler({
            to: user_email,
            subject: 'Recover Password',
            html: `Please click this link to recover your password: <a href="${url}">${url}</a>`,
        });
        
        res.redirect('/auth/password-recover-notify')
    }

    //[GET] /password-recovery/:token
    password_recovery(req, res) { 
        const token = req.params.token
        res.render('auth/password-recovery',{token}) 
    }

    //[POST] /recover-password
    async recover_password(req, res) {
        /* if(req.body.password.localeCompare(req.body.password_rep)){ //compare password == repeated_password
            const isRecover = await AuthServices.updatePassword(req.body.username,req.body.password)

            res.redirect('/auth/login')
        }
      
        
        res.redirect('/auth/password-recovery/'+ req.body.token) */

        try {
            const decoded = jwt.verify(req.body.token, JWT_KEY);
            const isRecover = await AuthServices.updatePassword(decoded.username,req.body.password)
            
        } catch(err) {
            console.log(err)
            }

        res.redirect('/auth/login')
    }

    // [GET]  /password-reset
    pass_reset(req, res) { res.render('auth/password-reset') }

    // [POST] /create-account
    async create_account(req, res) {
        const result = await AuthServices.addNewAccount(req.body)
        
        //send confirm mail
        const username = req.body.username 
        const user_email = req.body.email
        let token = jwt.sign({username},JWT_KEY,{expiresIn: '1d'})
        const verify_url = process.env.DEPLOY_ENV + `/confirmation/${token}`;

        SendMailHandler({
            to: user_email,
            subject: 'Confirm Email',
            html: `Please click this email to confirm your email: <a href="${verify_url}">${verify_url}</a>`,
        });
        
        res.redirect('/verify-email') 
    }

    
}

module.exports = new AuthController
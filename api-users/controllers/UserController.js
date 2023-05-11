const User = require("../models/User")
const PasswordToken = require("../models/PasswordToken")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


 var secret = "apperture"


class UserController{   


    async findUser(req, res) {
        var id = req.params.id

        var user = await User.findById(id)

        if(user == undefined) {
            res.json({})
            res.status(404)
        } else {
            res.status(200)
            res.json(user)
        }

    }

    async index(req, res) {
      var users = await User.findAll();
      res.json(users)
    }


    async create(req, res) {

        var {email, name, password} = req.body

        if(email == undefined || email == '' || email == ' ') {
            res.status(400)
            res.json({err: "E-mail inválido"})
            return 

        }
        
            var emailExist = await User.findEmail(email)

            if(emailExist){
                res.status(406)
                res.json({err: "E-mail já cadastrado"})
                return
            }else {

                await User.new(email,password, name)
                res.status(200)
                res.json("tudo certo.") 
            }
    }

    async edit(req, res) {
        var {id, name, role, email} = req.body

        var result = await User.update(id, email,name,role)

        if(result != undefined) {

            if(result.status) {
                res.status(200)
                res.send("Ok!")
            } else {
                res.status(406)
                res.send(result.erro)
            }
        } else {
            res.status(406)
            res.send("Ocorreu um erro no servidor!")
        }

    }

    async remove(req, res) {
        var id = req.params.id

        var result = await User.delete(id)

        if(result.status) {
            res.status(200)
            res.send("deletado do sistema.")
        } else {
            res.status(406)
            res.send(result.error)
        }

    }

    async recoverPassword(req, res) {
        var email = req.body.email

        var result = await PasswordToken.create(email)

        console.log(result)
        if(result.status) {

            res.status(200)
            res.send("token " + result.token)

            //Para enviar e-mail para o usuário -> NodeMailer.send()

        }else {
            res.status(406)
            res.send(result.erro)
        }

    }

    async changePassword (req, res) {

        var token = req.body.token
        var password = req.body.password

        var isTokenValid = await PasswordToken.validate(token)

        if(isTokenValid.status){
            
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)

            res.status(200)

            res.send("Senha alterada")



        }else {
            res.status(406)
            res.send("Token inválido")
        }

    }   


    async login(req, res) {

        var{email, password} = req.body

        var user = await User.findByEmail(email)

        if(user != undefined) {

           var result = await bcrypt.compare(password, user.password)
            
           if(result) {

            
            var token = jwt.sign({email: user.email, role: user.role}, secret)

            res.status(200)
            res.json({token})


           }else {
            res.status(406)
            res.send("Senha incorreta.")
           }

        }else {
            res.json({status: false})
        }

    }


}

module.exports = new UserController()
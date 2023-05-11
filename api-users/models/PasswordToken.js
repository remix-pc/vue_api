const db = require("../database/Database")
const User = require("./User")


class PasswordToken{

    async create(email) {

       var user = await User.findByEmail(email)

       if(user != undefined){

        try{
            
            var token = Date.now()

            await db.insert({
                user_id: user.id,
                used: 0,
                token: token
            }).table("passwordtokens")

            return {status: true, token: token}

        }catch(error) {
            console.log(error)
        }


       }else {
        return {status: false, erro: "O e-mail passado não existe."}
       }

    }


    async validate(token) {
       

        try{

            var result = await db.select().where({token: token}).table("passwordtokens")

            if(result.length > 0) {

                var tk = result[0]

                if(tk.used){
                    return {status: false} 
                }else {
                    return {status: true, token: tk}
                }

            }else {
                return {status:false}
            }

            
        }catch(error) {
            return {status: false}
        }

    }


    async setUsed(token) {
        await db.update({used: 1}).where({token: token}).table("passwordtokens")
    }

}

module.exports = new PasswordToken()
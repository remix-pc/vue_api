const db = require("../database/Database")
const bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");


class User{

    async findAll() {

        try {
       
            var result = await db.select("id", "email", "role", "name").table("users");

            return result;
            
        } catch(error) {
            console.log(error)
            return undefined
        }

    }


    async findById(id){

        try {
       
            var result = await db.select("id", "email", "role", "name").where({id: id}).table("users");

            if(result.length > 0){
                return result[0]
            }else {
                return undefined
            }
            
        } catch(error) {
            console.log(error)
            return undefined
        }


    }

    async findByEmail(email){

        try {
       
            var result = await db.select("id", "email","password", "role", "name").where({email: email}).table("users");

            if(result.length > 0){
                return result[0]
            }else {
                return undefined
            }
            
        } catch(error) {
            console.log(error)
            return undefined
        }


    }


    async new(email, password, name) {

        try{

          var hash = await bcrypt.hash(password, 10);
            

         await db.insert({email, password: hash, name, role: 0}).table("users");

        }catch(error) {
            console.log(error);
        }
    } 

    async findEmail(email) {
    
        try{

          var result = await db.select("*").from("users").where({email: email});
           
          if(result.length > 0) {
            return true
          }else {
            return false
          }

        }catch(error) {
            console.log(error);
            return false
        }

    }

    async update(id, email, name, role){

       var user = await this.findById(id)

        if(user != undefined) {

            var editUser = {}

            if(email != undefined) {
                if(email != user.email) {
                   var result = await this.findEmail(email);
                   if(result == false) {

                    editUser.email = email

                   }else {
                    return {status: false, erro: "O e-mail já está cadastrado"}
                   }
                }
            }

            if(name != undefined) {
                editUser.name = name
            }
            if(role != undefined) {
                editUser.role = role
            }

            try{
                await db.update(editUser).where({id: id}).table("users")

                return {status: true}

            }catch(error) {
                return {status: false, erro: error}
            }

        } else {
            return {status: false, erro: "Usuário não existe."}
        }
    }

    async delete(id){

       var user = await this.findById(id)

       if(user != undefined) {

        try {

            await db.delete().where({id: id}).table("users")
            return {status: true}

        }catch(error) {
            return {status: false, error: error}
        }

       }else {
        return {status: false, error: "O usuário não existe"}
       }

    }


    async changePassword(newPassword, id, token){

        var hash = await bcrypt.hash(newPassword, 10)

      
        await db.update({password: hash}).where({id: id}).table("users")
        await PasswordToken.setUsed(token)


    }
}

module.exports = new User()
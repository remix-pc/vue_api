class HomeController{

    async index(req, res){
       return res.send("Olá Mundo!");
    }

    async validate(req, res){
        res.send("Ok!")
    }

}


module.exports = new HomeController();
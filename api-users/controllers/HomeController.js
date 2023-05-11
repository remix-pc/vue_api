class HomeController{

    async index(req, res){
       return res.send("Olá Mundo!");
    }

}

module.exports = new HomeController();
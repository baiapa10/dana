const{User}= require('../models/index')

class Controller{

    static async home(req, res){
        try {
            // let data = await User.findByAll()
            res.render('home')
        } catch (error) {
            res.send(error)
        }
    }


}

module.exports = Controller
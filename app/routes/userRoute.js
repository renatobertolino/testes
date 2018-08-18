const userController = require('../controllers/userController');
const { check, validationResult } = require('express-validator/check');

module.exports = (app) => {

    app.post('/login', [
        check('email').isEmail().withMessage('email is not present'),  
        check('password').exists().withMessage('password is not present'),  
      ], (req, res) => {
  
        try {
            validationResult(req).throw();  
            let data = req.body;
            userController.login(data, function(data) {
                res.json(data);
            });
        } catch (err) {
            res.status(422).json({ errors: err.mapped() });
        }  

    });
  
}
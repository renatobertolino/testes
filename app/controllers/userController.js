const connectionFactory = require('../config/connectionFactory');
const userDatabase = require('../database/userDatabase')();
const jwt = require('jsonwebtoken');
const secretKey = require('../../config/config').secretKey;
const bcrypt = require("bcrypt-nodejs");

const userNotFound = require('../../JSON/userNotFound');

const userController = {

    login: (body, callback) => {
        try {
            userDatabase.login(connectionFactory(), body, function(exception, loginDBResult) {
                if (exception) throw exception;
                if (!loginDBResult) {
                    callback(userNotFound);
                } else {
                    try{
                        bcrypt.compare(body.password, loginDBResult.password, function(err, res) {
                
                            if (res){
                                
                                loginDBResult.token = jwt.sign(loginDBResult, secretKey);
                                
                                userDatabase.updateToken(connectionFactory(), loginDBResult, function(exception, result) {   
                                    callback({ success: true, message: 'Autenticação válida', token: loginDBResult.token }); 
                                });  
    
                            }else{
                                callback(userNotFound);
                            }            
                        });
                    }catch (exception){
                        callback({  success: false, exception: exception.message });
                    }    
                }
            });
        } catch (error) {
            console.log(error)
        }
        
    }
    
}

module.exports = userController;
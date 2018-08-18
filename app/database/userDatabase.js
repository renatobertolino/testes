function userDatabase() {
}

userDatabase.login = function(connectionFactory, body, callback) {
    connectionFactory(function(err, connection) {
        
        let sql = `SELECT user_id, password FROM users WHERE email= ?;`;
        let inserts = [body.email];

		connection.query(sql, inserts, function(err, result) {
	    	connection.release();

            if (!err && result.length != 0){
				let user = {
					user_id: result[0].user_id,
                    password: result[0].password,
					token: ''
                }
                callback(err, user);	
			}else {
				callback(err, false);
			}
        });
        
	});
}

userDatabase.updateToken = function(connectionFactory, user, callback) {
	connectionFactory(function(err, connection) {

        let sql = `UPDATE users SET token= ? WHERE id= ?;`;
        let inserts = [user.token, user.id];
        
	    connection.query(sql, inserts, function(err, result) {
			connection.release();
			callback(err, result);
        });
        
	});
}


module.exports = function(){
    return userDatabase;
};
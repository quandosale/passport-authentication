var bCrypt = require('bcrypt-nodejs');

module.exports = {
    responseHandler: (res, success, message, data) => {
        res.send({
            success: success,
            message: message,
            data: data
        });
    },

    isValidPassword: (user, password) => {
		return bCrypt.compareSync(password, user.password);
    },
    
	createHash: (password) => {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}
}
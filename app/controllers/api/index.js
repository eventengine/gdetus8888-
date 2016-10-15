
const express = require('express');

const apiRouter = module.exports = express.Router();

apiRouter.post("/login", require("./login").post, function(req, res, next) {
	// Issue a remember me cookie if the option was checked
	const models = req.app.get("models");
	if (req.body.rememberme !== "true") return next();
	var token = models.tokensRememberMe.generateToken();
	models.tokensRememberMe.save(token, req.user.id).then(function() {
		res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
		next();
	}).catch(function(err) {
		next(err);
	});
}, function(req, res, next) {
	res.send({
		success: true,
		user: req.user
	});
});

apiRouter.get("/logout", require("./logout").get);
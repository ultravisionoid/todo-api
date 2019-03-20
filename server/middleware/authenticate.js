var {User}=require("./../db/models/user");


var authenticate = (req,res,next)=>{
	var token = req.header("x-auth");

	User.findByToken(token).then((user)=>{
		if(!user){
			return Promise.reject();
		}

		req.user = user;
		req.token = token;
		next();
	}).catch((e)=>{
		res.status(401).send(e+"errorchg");
	});

};
module.exports={authenticate};
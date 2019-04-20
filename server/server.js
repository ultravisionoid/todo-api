require("./config/config.js");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID}=require("mongodb");
const sharp = require("sharp");
const multer = require("multer");//for uploading files

var  {mongoose}=require("./db/mongoose");
var {Todo}=require('./db/models/todo');
var {User}=require('./db/models/user');
var {authenticate}=require("./middleware/authenticate.js");
var {sendWelcomeEmail,sendCancelationEmail}=require("./emails/accounts.js");
var app = express();
const port = process.env.PORT ;



app.use(bodyParser.json());

app.post("/todos",authenticate,(req,res)=>{
	var todo = new Todo({
		text :req.body.text,
		_creator:req.user._id,
		completed:req.body.completed||false
	})
	console.log(req.body);

	todo.save().then((doc)=>{
		res.send(doc);
	},(e)=>{

		res.status(400).send(e);
	});
});

app.get("/todos",authenticate,async(req,res)=>{
	const match={};
	const sort={};

	if(req.query.completed){
		match.completed=req.query.completed==="true";

	}
	if(req.query.sortby){
		const parts=req.query.sortby.split(":");
		sort[parts[0]]=parts[1]==="desc"?-1:1;
	}
	try{
		await req.user.populate({
			path:"todos",
			match,
			options:{
				limit:parseInt(req.query.limit),
				skip:parseInt(req.query.skip),
				sort:{
					createdAt:-1
				}
			}
		})
		.execPopulate()
		res.send(req.user.todos)
	}catch(e){
		res.status(500).send(e);
	}


});
app.get("/todos/:id",authenticate,(req,res)=>{
	var id = req.params.id;
	if(!ObjectID.isValid(id)){
		return res.status(404).send("Not found1");
	}
	Todo.findOne({
		_id:id,
		_creator:req.user._id
	}).then((todo)=>{
		if(!todo){
			return res.status(404).send("Not found2");
		}
		res.status(200).send({todo});
	}).catch((e)=>{
		res.status(404).send("Not found3");
	})

})

app.delete("/todos/:id",authenticate,(req,res)=>{
	var id  = req.params.id;
	if(!ObjectID.isValid(id)){
		return res.status(404).send("Not found1");
	}
	Todo.findOneAndRemove({
		_id:id,
		_creator:req.user._id
	},(err,doc)=>{
		if(!doc)
			return res.status(404).send("Not found");
		return res.status(200).send({
			todo:doc});
	})
	


})

app.patch("/todos/:id",authenticate,(req,res)=>{
	var id = req.params.id;
	var body = _.pick(req.body,["text","completed"])
	
	if(!ObjectID.isValid(id)){
		return res.status(404).send("Not found1");
	}
	if(_.isBoolean(body.completed)&&body.completed) {
		body.completedat = new Date().getTime();
	}else{
		body.completed = false;
		body.completedat = null;

	}
	Todo.findOneAndUpdate({
		_id:id,
		_creator:req.user._id}
		,{$set: body},{new:true}).then((todo)=>{
		if(!todo)
			return res.status(404).send();
		res.send({todo});
	}).catch((e)=>{
		res.status(404).send();
	})
});

app.post("/users",(req,res)=>{
	var body = req.body
	// console.log(body);
	var	user = new User({
		email:body.email,
		password:body.password,
		name:body.name
	});
	// console.log(user.password)
	user.save().then(()=>{
	//	res.send(user);
		sendWelcomeEmail(user.email,user.name);
		return user.generateAuthToken();

	}).then((token)=>{
		return res.header('x-auth',token).send(user);
	})
	.catch((e)=>{
		res.status(400).send(e);
	})

})





app.get("/users/me",authenticate,(req,res)=>{
	res.status(200).send(req.user);
})



app.post("/users/login",(req,res)=>{
	var body = _.pick(req.body,["email","password"])
	
	User.findByCredentials(body.email,body.password).then((user)=>{
		return user.generateAuthToken().then((token)=>{
			return res.header("x-auth",token).send(user);
		})


	}).catch((e)=>{
		res.status(400).send(e);
	})

})

app.delete("/users/me",authenticate,async(req,res)=>{
	try{
		await req.user.remove();
		sendCancelationEmail(req.user.email,req.user.name);
		res.status(200).send(req.user);
	}catch(e){
		res.status(400).send(e);
	}
})

app.delete("/users/me/token",authenticate,(req,res)=>{
	req.user.removeToken(req.token).then(()=>{
		return	res.status(200).send();
	},()=>{
		return res.status(400).send();
	})
});
// const main= async()=>{

// 	// const user=await User.findById("5c90e66102810e27a8bbcbb6");
// 	// // console.log(user);
// 	// await user.populate("todos").execPopulate();

// 	// console.log(user.todos);
// 	// console.log(1331);

// }

// main()



const upload = multer({
	dest:"upload",
	limits:{
		fileSize:1000000
	},
	fileFilter(req,file,cb){
		if(!file.originalname.match(/\.(doc|docx)$/)){
			return cb(new Error("please upload a word document"));
		}
		cb(undefined,true);
	}

});

const errorMiddleware=(req,res,next)=>{
	throw new Error("From my middleware");
}

const avatar=multer({
	limits:{
		fileSize:1000000
	},
	fileFilter(req,file,cb){
		if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
			return cb(new Error("please upload image file"));
		}
		cb(undefined,true);
	}
})
app.post("/upload",upload.single("upload"),(req,res)=>{
	res.status(200).send();
},(error,req,res,next)=>{
	res.status(400).send({error:error.message});
})

app.post("/users/me/avatar",authenticate,avatar.single("avatar"),async (req,res)=>{

	const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
	req.user.avatar=buffer;
	await req.user.save();
	res.send();
},(error,req,res,next)=>{
	res.status(400).send({error:error.message});
})


app.delete("/users/me/avatar",authenticate,(req,res)=>{
	req.user.avatar=undefined;
	req.user.save();
	res.send();
})

app.get('/users/:id/avatar',async(req,res)=>{
	try{
		const user=  await User.findById(req.params.id);
		if(!user || !user.avatar){
			throw new Error

		}
		res.set("Content-Type","image/png")
		res.send(user.avatar)


	}catch(e){
		res.status(404).send(e);
	}
})





app.listen(port,()=>{
	console.log("started on port"+port);
})


module.exports={app};







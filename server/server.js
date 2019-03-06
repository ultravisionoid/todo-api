require("./config/config.js");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID}=require("mongodb");

var  {mongoose}=require("./db/mongoose");
var {Todo}=require('./db/models/todo');
var {User}=require('./db/models/user');
var {authenticate}=require("./middleware/authenticate.js");

var app = express();
const port = process.env.PORT ;


app.use(bodyParser.json());

app.post("/todos",authenticate,(req,res)=>{
	var todo = new Todo({
		text :req.body.text,
		_creator:req.user._id
	})
	console.log(req.body);

	todo.save().then((doc)=>{
		res.send(doc);
	},(e)=>{

		res.status(400).send(e);
	});
});

app.get("/todos",authenticate,(req,res)=>{
	Todo.find({
		_creator:req.user._id
	}).then((todos)=>{
		res.send({todos});
	},(e)=>{
		res.status(400).send(e);
	})
});;
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
	var body = _.pick(req.body,["email","password"])
	// console.log(body);
	var	user = new User({
		email:body.email,
		password:body.password
	});4
	// console.log(user.password)
	user.save().then(()=>{
	//	res.send(user);
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

app.delete("/users/me/token",authenticate,(req,res)=>{
	req.user.removeToken(req.token).then(()=>{
		return	res.status(200).send();
	},()=>{
		return res.status(400).send();
	})
});






app.listen(port,()=>{
	console.log("started on port"+port);
})


module.exports={app};







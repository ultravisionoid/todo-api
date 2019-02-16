var express = require("express");
var bodyParser = require("body-parser");


var  {mongoose}=require("./db/mongoose");
var {Todo}=require('./db/models/todo');
var {user}=require('./db/models/user');

var app = express();

app.use(bodyParser.json());

app.post("/todos",(req,res)=>{
	var todo = new Todo({
		text :req.body.text
	})
	console.log(req.body);

	todo.save().then((doc)=>{
		res.send(doc);
	},(e)=>{

		res.status(400).send(e);
	});
});

app.get("/todos",(req,res)=>{
	Todo.find().then((todos)=>{
		res.send({todos});
	},(e)=>{
		res.status(400).send(e);
	})
});;


app.listen(3000,()=>{
	console.log("started on 3000 port");
})

module.exports={app};


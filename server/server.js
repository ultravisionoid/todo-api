var express = require("express");
var bodyParser = require("body-parser");
var {ObjectID}=require("mongodb");

var  {mongoose}=require("./db/mongoose");
var {Todo}=require('./db/models/todo');
var {user}=require('./db/models/user');

var app = express();
const port = process.env.PORT || 3000;


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
app.get("/todos/:id",(req,res)=>{
	var id = req.params.id;
	if(!ObjectID.isValid(id)){
		return res.status(404).send("Not found1");
	}
	Todo.findById(id).then((todo)=>{
		if(!todo){
			return res.status(404).send("Not found2");
		}
		res.status(200).send({todo});
	}).catch((e)=>{
		res.status(404).send("Not found3");
	})

})

app.delete("/todos/:id",(req,res)=>{
	var id  = req.params.id;
	if(!ObjectID.isValid(id)){
		return res.status(404).send("Not found1");
	}
	// Todo.findById(id).then((todo)=>{
	// 	if(!todo){
	// 		return res.status(404).send("Not found2");
	// 	}
	// 	res.status(200).send(todo);
	// 	Todo.findOneAndRemove({_id:id}).then((doc)=>{
	// 		if(!todo){
	// 			return res.status.send("not found")
	// 		}
	// 		// res.send("dfd"+doc);
	// 	}).catch((e)=>{
	// 		res.send("not foundc")
	// 	})

	// }).catch((e)=>{
	// 	res.status(404).send("Not found3");
	// })
	Todo.findOneAndRemove({_id:id},(err,doc)=>{
		if(!doc)
			return res.status(404).send("Not found");
		return res.status(200).send(doc);
	})
	


})

app.listen(port,()=>{
	console.log("started on port"+port);
})

module.exports={app};


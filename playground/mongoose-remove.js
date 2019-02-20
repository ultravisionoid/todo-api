const {mongoose}=require("./../server/db/mongoose.js");
const {Todo}=require("./../server/db/models/todo.js");
const {ObjectID} = require("mongodb")
const {user} = require("./../server/db/models/user.js");

Todo.remove({}).then((r)=>{
	console.log(r.result);
});
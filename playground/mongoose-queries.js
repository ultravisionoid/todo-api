const {mongoose}=require("./../server/db/mongoose.js");
const {Todo}=require("./../server/db/models/todo.js");
const {ObjectID} = require("mongodb")
const {user} = require("./../server/db/models/user.js");
var id = "5c69403423475d23d0d2d9";
if(!ObjectID.isValid(id)){
	console.log("id not valid")
}
// Todo.find({
// 	_id: id
// }).then((todos)=>{
// 	console.log(JSON.stringify(todos,undefined,2));
// });

// Todo.findOne({
// 	_id:id
// }).then((todo)=>{
// 	console.log(JSON.stringify(todo,undefined,2));
// });
// Todo.findById(id).then((todo)=>{
// 	if(!todo){
// 		return ;
// 	}
// 	console.log(JSON.stringify(todo,undefined,2))
// }).catch((e)=>{
// 	console.log(e.name);
// })
user.findById("5c64251b217d5129802e4fe1").then((User)=>{
	if(!User){
		return console.log("not found user");
	}
	console.log(JSON.stringify(User,undefined,2))
},(e)=>{
	console.log(e.name);
})
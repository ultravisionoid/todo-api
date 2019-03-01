const {ObjectID}= require("mongodb");
const jwt = require("jsonwebtoken");

const {Todo}=require("./../../db/models/todo");
const {User}=require("./../../db/models/user");



const useroneid = new ObjectID();
const usertwoid=new ObjectID();

const users = [{
	_id:useroneid,
	email:"aayush@g.com",
	password:"useronepass",
	tokens:[{
		access:"auth",
		token:jwt.sign({_id:useroneid,access:"auth"},"abc123").toString()

	}]
},{
	_id:usertwoid,
	email:"aayuash@g.com",
	password:"usertwopass",
	tokens:[{
		access:"auth",
		token:jwt.sign({_id:usertwoid,access:"auth"},"abc123").toString()

	}]

}]


const todos = [{
	_id:new ObjectID(),
	text:"first todo"
},{
	_id:new ObjectID(),
	text:"second todo",
	completed:true,
	completedat:0
}];
const populatetodos =(done)=>{
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(()=>done());
};
const populateusers= (done)=>{
	User.remove({}).then(()=>{
		var userOne = new User(users[0]).save;
		var userTwo=new User(users[1]).save;
		return User.insertMany(users)
	}).then(()=>done());
}
module.exports={todos,populatetodos,users,populateusers};

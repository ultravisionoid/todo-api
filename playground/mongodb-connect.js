//const MongoClient = require("mongodb").MongoClient;
const {MongoClient,ObjectID} = require("mongodb");

// var obj = new ObjectID();
// console.log(obj)

MongoClient.connect("mongodb://localhost:27017/ToDoApp",(err,db)=>{
	if(err){
		return console.log("unable to connect to mongodb");

	}
	console.log("connected to mongodb server");
	// db.collection('Todos').insertOne({
	// 	text:"something to do",
	// 	completed:false
	// },(err,result)=>{
	// 	if(err){
	// 		return console.log('unable to inserr todo'+err);

	// 	}
	// 	console.log(JSON.stringify(result.ops,undefined,2));
// 	// })
	db.collection("users").insertOne({
		name:'aayush',
		age:20,
		location:"kolkata"
	},(err,result)=>{
		if(err)
			return console.log(err)
		console.log(result.ops[0]._id.getTimestamp());
	});

	db.close();
});


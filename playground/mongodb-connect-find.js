const {MongoClient,ObjectID} = require("mongodb");


MongoClient.connect("mongodb://localhost:27017/ToDoApp",(err,db)=>{
	if(err){
		return console.log("unable to connect to mongodb");

	}
	console.log("connected to mongodb server");


	// db.collection("Todos").find({
	// 	_id:new ObjectID("5c5fee3d11c67618ac5c26be")})
	// .toArray().then((docs)=>{
	// 	console.log("todos:");
	// 	console.log(JSON.stringify(docs,undefined,2))
	// },(err)=>{
	// 	conosle.log("unable to fetch"+err)
	// });

	// db.collection("Todos").find().count().then((count) => {
	// 	console.log("todos count:"+count);
		
	// },(err)=>{
	// 	conosle.log("unable to fetch"+err)
	// });

	db.collection("users").find({'name':"aayush"})
	.toArray().then((docs) => {
		console.log("todos count:"+JSON.stringify(docs,undefined,2));
		
	},(err)=>{
		conosle.log("unable to fetch"+err)
	});


	db.close();
});


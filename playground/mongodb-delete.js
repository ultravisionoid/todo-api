const{MongoClient,ObjectID}=require("mongodb");

MongoClient.connect("mongodb://localhost:27017/ToDoApp",(err,db)=>{
	if(err)
		return console.log(err);
	// db.collection("Todos").deleteMany({text:"eat"}).then((result)=>{
	// 	console.log(result);
	// })
	// db.collection("Todos").deleteOne({text:"eat"}).then((result)=>{
	// 	console.log(result);
	// })
	db.collection("Todos").findOneAndDelete({text:"eat"}).then((result)=>{
		console.log(result)
	})
	db.close();
})
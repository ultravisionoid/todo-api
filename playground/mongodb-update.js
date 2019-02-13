const{MongoClient,ObjectID}=require("mongodb");

MongoClient.connect("mongodb://localhost:27017/ToDoApp",(err,db)=>{
	if(err)
		return console.log("1"+err);
	db.collection("users").findOneAndUpdate({
		_id :new  ObjectID("5c61446338b15129e0babd66")
	},{
		$set:{
			name:"aloou"
		},$inc:{
			age:1
		}
	},{
		returnOriginal:false
	}).then((results)=>{
		console.log(results)
	});
	db.close();
})
const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

var p = "123abc!";
bcrypt.genSalt(10,(err,salt)=>{
	bcrypt.hash(p,salt,(err,hash)=>{
		console.log(hash);
	})
});

var hashedpass = "$2a$10$EOjfX0eQFKjRBdVQ.YhwPOKNPvPiQ1/Rbdkdbs77nsJ8snlPz7zc6";
bcrypt.compare(p,hashedpass,(err,res)=>{
	console.log(res);
})





// // var message = "aloo ka paratha";
// // var hash = SHA256(message).toString();
// // console.log(hash);

// var data = {
// 	id:4
// };

// // var token={
// // 	data ,
// // 	hash:SHA256(JSON.stringify(data)+"somesecret").toString()
// // }
// // var r=SHA256(JSON.stringify(token.data)+"somesecret").toString();
// // // token.data.id=5;
// // // token.hash = SHA256(JSON.stringify(token.data));
// // if(r===token.hash){
// // 	console.log("a");
// // }
// // else{
// // 	console.log("b");
// // }
// var token =jwt.sign(data,"wadu")
// console.log(token)
// var decoded=jwt.verify(token,"wadu");
// console.log("decoded",decoded)



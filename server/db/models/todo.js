var mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
	text:{
		type:String,
		required:true,
		minlength:1,
		trim:true
	},
	completed:{
		type:Boolean,
		deafult:false	
	},
	completedat:{
		type:Number,
		deafult:null
	},
	_creator:{
		type:mongoose.Schema.Types.ObjectId,
		required:true,
		ref:"User"
	}
},{
	timestamps:true
})
var Todo = mongoose.model("Todo",todoSchema);
module.exports={Todo};
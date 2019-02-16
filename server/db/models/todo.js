var mongoose = require("mongoose");

var Todo = mongoose.model("Todo",{
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
	}
});
module.exports={Todo};
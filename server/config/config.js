var env = process.env.NODE_ENV || "development";
process.env.SENDGRID_API_KEY="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";

console.log("!!!!env***************"+env)
if(env==='development'||env==="test"){
	var config =require("./config.json");
	var envconfig = config[env];
	Object.keys(envconfig).forEach((key)=>{
		process.env[key]=envconfig[key];
	})	


}


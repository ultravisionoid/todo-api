const sgMail=require("@sendgrid/mail");


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sgMail.send({
// 	to:"jupower1620@gmail.com",
// 	from:"aritrorik@gmail.com",
// 	subject:"ag class test paper",
// 	text:"April Fool!!!!! LOL LMAO!!!!!"
// });

const sendWelcomeEmail = (email,name)=>{
	sgMail.send({
		to:email,
		from:"aayushjhun.login@gmail.com",
		subject:"Thanks for joining in",
		text:`Welcome to the app, ${name}.Let me know how you get along with the app.`
	})
}

const sendCancelationEmail = (email,name)=>{
	sgmail.send({
		to:email,
		from:"aayushjhun.login@gmail.com",
		subject:"Sorry to see you go!",
		text:`Goodbye,${name}. I hope to see you back somtime soon`
	})
}

module.exports={sendWelcomeEmail,sendCancelationEmail};
// sendWelcomeEmail("aayushjhun5@gmail.com","aayush jhunjhunwala")

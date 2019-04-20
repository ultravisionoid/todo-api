const sgMail=require("@sendgrid/mail");

const sendgridAPIkey='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';

sgMail.setApiKey(sendgridAPIkey);

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

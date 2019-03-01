const expect = require("expect");
const request = require("supertest");
const {ObjectID}=require("mongodb");
const {app}=require("./../server");
const {Todo}=require("./../db/models/todo");
const {User}=require("./../db/models/user");

const{todos,populatetodos,users,populateusers}=require("./seed/seed.js");

beforeEach(populateusers);
beforeEach(populatetodos);

describe("POST /todos",()=>{
	it("should create a new todo",(done) => {
		var text ="test todo text";
		request(app)
			.post("/todos")
			.send({text})
			.expect(200)
			.expect((res)=>{
				expect(res.body.text).toBe(text);
			})
			.end((err,res)=>{
				if(err){
					return done(err);
				}
				Todo.find().then((todos)=>{
					 expect(todos.length).toBe(3);
					 expect(todos[2].text).toBe(text);
					done();
				}).catch((e)=>	done(e));
			});
	});
	it("should not create todo wih invalid data",(done)=>{
		request(app)
			.post("/todos")
			.send({})
			.expect(400)
			.end((err,res)=>{
				if(err)
					return done(err)
			
				Todo.find().then((todos)=>{
					expect(todos.length).toBe(2);
					done();
				}).catch((e)=>done(e))
			})
			
	})
});


describe("Get/todos",()=>{
	it("should get all todos",(done)=>{
		request(app)
			.get("/todos")
			.expect(200)
			.expect((res)=>{
				expect(res.body.todos.length).toBe(2)
			})
			.end(done)
	})
})

describe("GET/todos/:id",()=>{
	it("should return todo doc",(done)=>{
		request(app)
			.get("/todos/"+todos[0]._id.toHexString())
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	})		
	it("should return a 404 if not found",(done)=>{
		request(app)
			.get("/todos/"+(new ObjectID()).toHexString())
			.expect(404)
			.end(done);
	});

	it("should return 404 for non-object ids",(done)=>{
		request(app)
		.get("/todos/123afbd")
		.expect(404)
		.end(done);
	})
});
describe("DELETE /todos/:id",()=>{
	it("should remove a todo",(done)=>{
		request(app)
			.delete("/todos/"+todos[0]._id.toHexString())
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(todos[0].text);	
			})
			.end((err,res)=>{
				if(err){
					return done(err);
				}
			Todo.findById(todos[0]._id.toHexString()).then((todo)=>{
				expect(todo).toBeFalsy();
				done();
			}).catch((e)=>done(e));

			})
			
	})
	it("should return a 404 not found",(done)=>{
		request(app)
			.delete("/todos/"+new ObjectID)
			.expect(404)
			.end(done)
	})
	it("shouldn return a 404 for invalid id",(done)=>{
		request(app)
			.delete("/todos/zxvdfzcvvf")
			.expect(404)
			.end(done)	
	})


})



describe("PATCH /todos /:id",()=>{
	it ("should update the todo",(done)=>{
		request(app)
			.patch("/todos/"+todos[0]._id)
			.send({
				"text":"updated",
				"completed": true
			})
			.expect(200)
			.expect((res,err)=>{
				if(err){
					done(err);
				}
				expect(res.body.todo.text).toBe("updated");
				expect(res.body.todo.completed).toBe(true);
				expect(typeof res.body.todo.completedat).toBe("number");
			})
			.end(done)


	});
	it("should clear completedat when todo is not completed",(done)=>{
		request(app)
			.patch("/todos/"+todos[1]._id)
			.send({
				"text":"updated",
				"completed": false
			})
			.expect(200)
			.expect((res,err)=>{
				if(err){
					done(err);
				}
				expect(res.body.todo.text).toBe("updated");
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedat).toBeFalsy();
			})
			.end(done)
	});
})

describe("GET/users/me",()=>{
	it("should return user if authenticated",(done)=>{
			request(app)
					.get("/users/me")
					.set("x-auth",users[0].tokens[0].token)
					.expect(200)
					.expect((res)=>{
						expect(res.body._id).toBe(users[0]._id.toHexString());
						expect(res.body.email).toBe(users[0].email);


					})
					.end(done);
	})
	it("should return 401 if not authenticared",(done)=>{
		request(app)
			.get("/users/me")
			.expect(401)
			.expect((res)=>{
				expect(res.body).toEqual({});
			})
			.end(done);
	})
})

describe("POST/users",()=>{
	it("should create a user",(done)=>{
		var email = "emaple@e.com"
		var password = "123456";
		request(app)
			.post("/users")
			.send({email,password})
			.expect(200)
			.expect((res)=>{
				expect(res.header["x-auth"]).toBeTruthy();
				expect(res.body._id).toBeTruthy();
				expect(res.body.email).toBe(email);
			})
			.end((err)=>{
				if(err){
					return done(err);
				}
				User.findOne({email}).then((user)=>{
					expect(user).toBeTruthy();
					expect(user.password).not.toBe(password);
					done();
				})
			});
	})
	it("should retunr errror if request invalid",(done)=>{
		request(app)
			.post("/users")
			.send({
				email:"aa",
				password:"12"
			})
			.expect(400)
			.end(done);
	})
	it("should not create user if email in use",(done)=>{
		request(app)
		.post("/users")
		.send({
			email:"aayuash@g.com",
			password:"123456"
		})
		.expect(400)
		.end(done);
	})
})








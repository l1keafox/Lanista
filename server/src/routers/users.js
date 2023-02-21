const express = require("express");
const { User, Owner, Gladiator, DayEvents,Feedback } = require("../models");
const auth = require("../middleware/auth");
const {
	createNewOwner,
	createNewGladiator,
} = require("./../engine/game/utils");
const router = express.Router();

async function createOwner(user) {
	const owner = await new Owner(createNewOwner());
	console.log("  -EN> New Owner with new USER Acct created");
	for (let i = 0; i < 3; i++) {
		const glad = await new Gladiator(createNewGladiator("default"));
		glad.calcuateGladiator();
		glad.ownerId = owner._id;
		owner.gladiators.push(glad.id);
		glad.save();
	}
	owner.userAcct = user._id;
	user.ownerId = owner._id;
	return owner;
}

router.get('/users/gameData',async(req,res)=>{
	res.status(200).send({tick:process.env.TICK});
})

router.post("/users", async (req, res) => {
	// Create a new user
	try {
		console.log("  -MON>New user:", req.body);
		const user = new User(req.body);
		await user.save();
		const token = await user.generateAuthToken();
		console.log(token);
		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});
router.post("/users/sendFeedback", async (req, res) => {
	const { name, message, email } = req.body;
	let userExist = await new Feedback({ name, message, email });
	userExist.save();
	res.status(200)
})


router.post("/users/createAcct", async (req, res) => {
	const { username, password, email } = req.body;
	let userExist = await User.findOne({ username: username });
	if (userExist) {
		return res.status(401).send({ error: "Create Acct failed: username exists" });
	}
	let existUser = await User.findOne({ email} );
	if(existUser){
		return res
		.status(401)
		.send({ error: "Create Acct failed: email exists" });
	}


	const newUser = await new User({ username, email, password });
	console.log("  -NEW USER>-",newUser);
	try{
		let newOwner = await createOwner(newUser);
		await newOwner.save();
		await newUser.save();
		const token = await newUser.generateAuthToken();
		res.send({ newUser, token });
	}catch(err){
		res
		.status(401)
		.send({ error: "Create Acct failed: email Form" });
	}
});

router.post("/users/login", async (req, res) => {
	//Login a registered user

	try {
		const { username, password } = req.body;
		if (!username) {
			return res
				.status(401)
				.send({ error: "Login failed! Check authentication credentials" });
		}
		const user = await User.findByCredentials(username, password);
		if (!user) {
			return res
				.status(401)
				.send({ error: "Login failed! Check authentication credentials" });
		}
			// await User.find({username})
		if (!user.ownerId) {
			const owner = await new Owner(createNewOwner());
            console.log("  -EN> Owner created with base seed acct");
			for (let i = 0; i < 3; i++) {
				const glad = await new Gladiator(createNewGladiator("default"));
				glad.calcuateGladiator();
				glad.ownerId = owner._id;
				owner.gladiators.push(glad.id);
				await glad.save();
			}

			user.ownerId = owner._id;
			owner.userAcct = user._id;
			owner.userName = user.username;

			await user.save();
			await owner.save();
		}

		const token = await user.generateAuthToken();
		// Here we should create owner
		
		res.send({ user, token });
	} catch (error) {
		let userExist = await User.findOne({ username:  req.body.username });
		if (userExist) {
			return res.status(401).send({ error: "Login Fail: password" });
		} else {
			return res.status(401).send({ error: "Error: No username, Create Account" });
		}
	}
});

router.post("/users/me/logout", auth, async (req, res) => {
	// Log user out of the application
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token != req.token;
		});
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send(error);
	}
});

router.post("/users/me/logoutall", auth, async (req, res) => {
	// Log user out of all devices
	try {
		req.user.tokens.splice(0, req.user.tokens.length);
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send(error);
	}
});
module.exports = router;

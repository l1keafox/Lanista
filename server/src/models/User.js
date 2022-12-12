const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: [
				/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
				"Please use a valid email.",
			],
		},
		password: {
			type: String,
			required: true,
			minlength: 5,
		},
		token: {
			type: String,
			// required: true
		},
		owner:{
            type:Schema.Types.ObjectId,
            ref:"Owner"
        }
	},
	{
		toJSON: {
			virtuals: true,
		},
	}
);


userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    if (this.isNew || this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next();
})

userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    this.token = jwt.sign({_id: this._id}, process.env.JWT_KEY);
    await this.save()
    return this.token;
}

userSchema.statics.findByCredentials = async (username, password) => {
    // Search for a user by username and password.
    const user = await User.findOne({ username} )
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user;
}
userSchema.methods.isCorrectPassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const User = model("user", userSchema);

module.exports = User;

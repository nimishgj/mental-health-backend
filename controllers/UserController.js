const Users = require("../models/User.model");


exports.createUser = async (request,response) => {
    const { username, email, password } = request.body;
    const errors = {};

    if (!username) {
        errors.username = "Please provide a username";
    }
    if (!email) {
        errors.email = "Please provide an email";
    }
    if (!password) {
        errors.password = "Please provide a password";
    }
    if ( Object.keys(errors).length > 0 ) {
        return response.status(400).json({
            status:false,
            message:errors
        });
    }

    const userEmail = await Users.findOne({ email:email });
    if (userEmail) return response.status(400).json({
        status:false,
        message:"Email " + email + " is already taken, please choose another email"
    });

    const userName = await Users.findOne({ username: username });
    if (userName) return response.status(400).json({
        status:false,
        message:"Username" + username + " is already taken, please choose another user name"
    });
    console.log("reacher here")
    const user = await Users.create({
        username:username,
        email:email,
        password:password
    });
    console.log(user)
    return response.status(201).json({
        status:true,
        message:"User Created Successfully",
        user
    });
}


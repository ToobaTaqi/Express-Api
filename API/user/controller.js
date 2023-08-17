const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./model");

const { sign } = require("jsonwebtoken");

const Dummy = (req, res) => {
  res.json({
    user: "Tooba " + req.body.user,
  });
};

const SignUp = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");
    const existingUser = await User.exists({ email: email });
    if (existingUser) {
      res.status(208).json({
        message: "User Already Exists",
      });
    } else {
      await User.create({
        username,
        email,
        password: password, // Store the plain password
      });
      console.log("User Created");
      res.status(201).json({
        message: "Signup Successfully",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};


const Login = async (req, res) => {
  const { password, email } = req.body;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      const decryptPassword = await compare(password, existingUser.password);
      if (email == existingUser.email && decryptPassword) {
        const token = sign(
          {
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            profile: existingUser.profile,
            role: existingUser.role,
          },
          process.env.JWT_SECRET
        );

        res.json({
          message: "Successfully Loggined",
          token: token,
        });
      } else {
        res.json({
          message: "invalid Credentials",
        });
      }
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const allUsers = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Users = await User.find();
    res.json({
      Users: Users,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const userbyEmail = async (req, res) => {
  const { email } = req.query;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Users = await User.findOne({ email: email });
    res.json({
      Users: Users,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
  const { username } = req.params; // Assuming you're passing userId in the URL parameter

  try {
    await mongoose.connect(process.env.MONGO_URI);
    const deletedUser = await User.findByIdAndDelete(username);

    if (!deletedUser) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      const remainingUsers = await User.find();
      res.status(200).json({
        message: "User deleted successfully",
        remainingUsers,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};



module.exports = {
  Dummy,
  SignUp,
  Login,
  allUsers,
  userbyEmail,
  deleteUser
};

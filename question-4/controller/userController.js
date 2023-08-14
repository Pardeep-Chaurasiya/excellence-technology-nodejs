const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const registerController = async (req, res) => {
  const { firstName, lastName, userName, email, password, confirmPassword } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !userName ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    return res
      .status(422)
      .json({ code: "Invalid_INPUT", error: "Please fill all feilds" });
  }

  const existEmail = await User.findOne({ email });
  const existUserName = await User.findOne({ userName });
  if (existEmail) {
    return res
      .status(400)
      .json({ code: "Invalid_INPUT", error: "Email already exists!!" });
  }
  if (existUserName) {
    return res
      .status(400)
      .json({ code: "Invalid_INPUT", error: "Username already exists!!" });
  }
  const salt = 10;
  const hashPassword = await bcrypt.hash(password, salt);
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "Password and Confirm Password does't matched !!" });
  }
  const newUser = new User({
    firstName,
    lastName,
    userName,
    email,
    password: hashPassword,
  });

  const saveUser = await newUser.save();
  delete saveUser.password;

  if (!saveUser) {
    return res
      .status(400)
      .json({ error: "Something went wrong while register user" });
  }
  return res.status(200).json({
    message: "User Register Successfully !!",
    User: saveUser,
  });
};

const loginController = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(422)
      .json({ code: "Invalid_INPUT", error: "Please fill all feilds" });
  }
  const existUserName = await User.findOne({ userName });
  if (existUserName) {
    existUserId = existUserName._id;
    const access_token = existUserId.toString();
    console.log(access_token);
    const comparePassword = await bcrypt.compare(
      password,
      existUserName.password
    );
    if (comparePassword) {
      return res.status(200).json({ message: "Login successfully" });
    } else {
      return res.status(400).json({ error: "Invalid username or password" });
    }
  } else {
    return res.status(404).json({ error: "User not found" });
  }
};

module.exports = { registerController, loginController };

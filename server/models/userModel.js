import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import Application from "./applicationsModel.js";

//schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required!"],
    },
    email: {
      type: String,
      required: [true, " Email is Required!"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      minlength: [6, "Password length should be greater than 6 characters"],
      select: true,
    },
    accountType: { 
      type: String, 
      default: "seeker" // Default account type as "seeker"
    },
    studentID: {
      type: String,
      required: [true, "Student Id is Required!"],
      unique: [true, "Student ID already exists"], 

    },
    semester: {
      type: String,
    },
    contact: { type: String },
    location: { type: String },
    profileUrl: { type: String },
    cvUrl: { type: String },
    projectTitle: { type: String },
    about: { type: String },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// middelwares
userSchema.pre("save", async function () {
  if (!this.isModified) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare password
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

//JSON WEBTOKEN
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

// Middleware to delete related applications when a user is deleted
userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    await Application.deleteMany({ student: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

const Users = mongoose.model("Users", userSchema);

export default Users;

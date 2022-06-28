const AuthorModel = require("../models/authorModel");
var validator = require("email-validator");
const validationchecker = require('../validators/validator')
const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");

const createAuthor = async function (req, res) {
  try {
    let author = req.body;
    let validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
    let validName = /^[A-Za-z ]+$/;

    if (
      !author.fname ||
      typeof author.fname !== "string" ||
      !validName.test(author.fname)
    ) {
      res.status(400).send({ status: false, msg: "Enter valid FirstName" });
      return;
    }

    if (
      !author.lname ||
      typeof author.lname !== "string" ||
      !validName.test(author.lname)
    ) {
      res.status(400).send({ status: false, msg: "Enter valid LastName" });
      return;
    }
    if (
      !author.password ||
      typeof author.password !== "string" ||
      !validPassword.test(author.password)
    ) {
      res.status(400).send({ status: false, msg: "Enter valid Password" });
      return;
    }
    if (author.password.length < 8) {
      res
        .status(400)
        .send({ status: false, msg: "Length Of password should be atleast 8" });
      return;
    }
    if (author.password.length > 12) {
      res
        .status(400)
        .send({ status: false, msg: "Length of password is exceeding" });
      return;
    }
    let isEmailValid = validator.validate(author.email);
    if (!isEmailValid) {
      res
        .status(400)
        .send({ status: false, msg: "Please enter valid Email Id" });
      return;
    } else {
      let authorsData = await authorModel.find();
      authorsData.map((el) => {
        if (el.email === author.email) {
          res.status(400).send("Email Id already exists");
          return;
        }
      });
    }
    let authorCreated = await AuthorModel.create(author);
    res.status(201).send({ data: authorCreated });
    return;
  } catch (err) {
    res.status(500).send({status: false, msg: err.message });
    return;
  }
};

const login = async function (req, res) {
  try {
    let userName = req.body.email;
    let password = req.body.password;
    let logIn = await authorModel.findOne({
      email: userName,
      password: password,
    });
    if (!logIn)
      return res.status(400).send({
        status: false,
        msg: "username and password is not correct",
      });
    //Generating Token
    const token = jwt.sign(
      {
        authorId: logIn._id.toString(),
      },
      "SECRET-OF-GROUP28"
    );
    res.setHeader("x-api-key", token);
    res.status(201).send({
      status: true,
      msg: "You are Logged in!!",
    });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.login = login;

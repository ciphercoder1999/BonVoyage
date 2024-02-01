require('dotenv').config();
const express = require('express');
const app = express();
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
// const port = process.env.PORT || 3000;
const port = 3000; // Choosing a port for your server
require("./assets/db/conn");
const Register = require("./assets/models/registration");
const auth = require("./assets/middleware/auth");


console.log(__dirname);

// Serving static files from the 'assets' directory
app.use(express.static('assets'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));


// Defining your routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', async (req, res) => {

  formvalue = req.body.formValue;

  if (formvalue === "form1") {
    try {

      const email = req.body.email;
      const password = req.body.password;

      const userMatch = await Register.findOne({ email: email });

      if (!userMatch) {
        return res.json("Invalid Credentials");
      }

      const isMatch = await bcrypt.compare(password, userMatch.password);

      const token = await userMatch.generateAuthToken();
      // console.log(userMatch.tokens[0].token);

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 86400000),
        httpOnly: true
      });

      if (isMatch) {
        res.status(201).json(userMatch);
      } else {
        res.status(400).json("Invalid Credentials");
      }

    } catch (error) {
      console.log(error);
    }
  }
  else if (formvalue === "form2") {

    try {

      const password = req.body.password;
      const cpassword = req.body.confirmpassword;

      if (password === cpassword) {

        const registerUser = new Register({
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          confirmpassword: req.body.confirmpassword
        })

        const token = await registerUser.generateAuthToken();

        const registered = await registerUser.save();
        res.json('Registration Done!');

      } else {
        res.json('passwords are not matching');
      }
    } catch (error) {
      res.json('Error! Already have an account');
    }
  }
})


app.get('/navigation', (req, res) => {
  res.sendFile(__dirname + '/navigation.html');
});

app.get('/dashboard', auth, (req, res) => {
  try {
    res.sendFile(__dirname + '/dashboard.html');
  } catch (error) {
    res.alert(error);
  }
});

app.get('/logout', auth, async (req, res) => {
  try {
    // localStorage.removeItem("userdata");
    req.user.tokens = req.user.tokens.filter((currElement) => {
      return currElement.token !== req.token;
    })
    res.clearCookie("jwt");
    await req.user.save();
    res.sendFile(__dirname + '/index.html');
  } catch (error) {
    res.status(500).send(error);
  }
})

// Starting the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

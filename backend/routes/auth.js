const express = require('express')
const User = require('../models/User');
const router = express.Router(); //for routing
const { body, validationResult } = require('express-validator'); //package express validator
const bcrypt = require('bcryptjs'); //hashing
const jwt = require('jsonwebtoken'); //authentication login/sigup
const fetchUser = require('../middleware/fetchUser');


const JWT_SECRET = 'Aliisagoodb$oy';

// ROUTE 1: Create a New User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 3 characters').isLength({ min: 3 }),
], async (req, res) => { //kia kaam krana chahtai(res jo hm bhejtai hain, req means body kai hissab sai dekhna)
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() }); //.json format(res dai ga)
  }
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email }); //req ka mtlb code mai sai dekhain ga
    if (user) {
      return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
    }
    //for encryption
    const salt = await bcrypt.genSalt(10); 
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);


    // res.json(user)
    success = true;
    res.json({ success, authtoken }) //res.send(display) res.json(json format)  for data show

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


// ROUTE 2: Authenticate an Existing User using: POST "/api/auth/login". No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(), //database mai hai ya nhi
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body; //jo database mai store hoga 
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET); //key generate kr dai
    console.log('authtoken', authtoken);
    success = true;
    res.json({ success, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }


});


// ROUTE 3: Get Existing User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchUser, async (req, res) => {

  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password") // .select("-password") By doing this it won't send password in response.
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router
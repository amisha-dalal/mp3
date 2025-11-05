const User = require('../models/user');

module.exports = function (router) {
  const usersRoute = router.route('/');

  usersRoute.post(async (req, res) => {
    try {
      const user = new User(req.body);
      const savedUser = await user.save();
      res.status(201).json({ message: "User created", data: savedUser });
    } catch (err) {
      //validation error if required fields not filled out (name/email)
      if (err.name == "ValidationError") {
        return res.status(400).json({error: "Required field not filled out"});
        } else if (err.code == 11000) { //this is if unique requirement violated
          return res.status(400).json({error: "Email entered was not unique"});
        } else {
           return res.status(500).json({error: "Server error creating user"});
      }
    }
  });

  return router;
};

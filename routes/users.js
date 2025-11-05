const User = require('../models/user');

module.exports = function (router) {
  const usersRoute = router.route('/');
  const userIdRoute = router.route('/:id');

  //USER POST
  usersRoute.post(async (req, res) => {
    try {
      const user = new User(req.body);
      const savedUser = await user.save();
      res.status(201).json({ message: "User created", data: savedUser });
    } catch (err) {
      //validation error if required fields not filled out (name/email)
      if (err.name == "ValidationError") {
        return res.status(400).json({message: "Required field not filled out", data: err});
      }
      if (err.code == 11000) { //this is if unique requirement violated
          return res.status(400).json({message: "Email entered was not unique", data: err});
      } 
      return res.status(500).json({message: "Server error creating user", data: err});

    }
  });

  //USER GET
  usersRoute.get(async (req, res) => {
    //right now just returning full list of users
    //come back to implement query parameters (where, sort, etc)
    try {
      const users = await User.find();
      return res.status(200).json({ message: 'Getting list of users', data: users });
    } catch(err) {
      return res.status(500).json({message: "Server error getting users", data: err});
    }
  });

  //USERID GET
  userIdRoute.get(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({message: "User not found", data: err});
      }
      return res.status(200).json({ message: 'User found', data: user});
    } catch(err) {
      return res.status(500).json({message: "Server error getting user by id", data: err});
    }
  });

  //USERID PUT
  userIdRoute.put(async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
      if (!user) {
        return res.status(404).json({message: "User not found, information not replaced", data: err});
      }
      return res.status(200).json({ message: 'User found, information replaced', data: user});
    } catch(err) {
      //validation error if required fields not filled out (name/email)
      if (err.name == "ValidationError") {
        return res.status(400).json({message: "Required field not filled out", data: err});
      }
      if (err.code == 11000) { //this is if unique requirement violated
          return res.status(400).json({message: "Email entered was not unique", data: err});
      } 
      return res.status(500).json({message: "Server error getting user by id", data: err});
    }
  });

  //USERID DELETE
  userIdRoute.delete(async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({message: "User not found", data: err});
      }
      return res.status(200).json({ message: 'User found and deleted', data: user});
    } catch(err) {
      return res.status(500).json({message: "Server error getting user by id", data: err});
    }
  });

  return router;
};

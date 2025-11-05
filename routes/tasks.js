const Task = require('../models/task');

//tried to reuse format / code from users.js
//not sure if it will work completely

module.exports = function (router) {
  const tasksRoute = router.route('/');
  const taskIdRoute = router.route('/:id');

  //TASK POST
  tasksRoute.post(async (req, res) => {
    try {
        const task = new Task(req.body);
        const savedTask = await task.save();
        res.status(201).json({ message: "Task created", data: savedTask });
    } catch(err) {
        if (err.name == "ValidationError") {
        return res.status(400).json({message: "Required field not filled out", data: err});
        }
        return res.status(500).json({message: "Server error creating user", data: err});
        }
  });

  //TASK GET
  tasksRoute.get(async (req, res) => {
    //right now just returning full list of tasks
    //come back to implement query parameters (where, sort, etc)
    try {
      const tasks = await Task.find();
      return res.status(200).json({ message: 'Getting list of tasks', data: tasks });
    } catch(err) {
      return res.status(500).json({message: "Server error getting tasks", data: err});
    }
  });

  //TASKID GET
  taskIdRoute.get(async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({message: "Task not found", data: err});
      }
      return res.status(200).json({ message: 'Task found', data: task});
    } catch(err) {
      return res.status(500).json({message: "Server error getting task by id", data: err});
    }
  });

  //TASKID PUT
  taskIdRoute.put(async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
      if (!task) {
        return res.status(404).json({message: "Task not found, information not replaced", data: err});
      }
      return res.status(200).json({ message: 'Task found, information replaced', data: task});
    } catch(err) {
      //validation error if required fields not filled out (name)
      if (err.name == "ValidationError") {
        return res.status(400).json({message: "Required field not filled out", data: err});
      }
      return res.status(500).json({message: "Server error getting task by id", data: err});
    }
  });

  //TASKID DELETE
  taskIdRoute.delete(async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).json({message: "Task not found", data: err});
      }
      return res.status(200).json({ message: 'Task found and deleted', data: task});
    } catch(err) {
      return res.status(500).json({message: "Server error getting task by id", data: err});
    }
  });

  return router;
};
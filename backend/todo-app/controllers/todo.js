const AllTodos = require("../models/todo");

/* export all todos */

exports.postTodoList = async (req, res) => {
  try {
    const response = await AllTodos.find().exec();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};

/* New todo */

exports.createTodo = async (req, res) => {
  const { title, description, project, type, who, what, priority } = req.body;

  const todos = await new AllTodos({
    title,
    description,
    project,
    type,
    who,
    what,
    priority
  }).save();

  try {
    const response = await todos;
    if (response) {
      res.status(201).json({
        response,
        success: true
      });
    } else {
      res.status(404).json({ message: "oh no something went wrong" });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};

/* update todo */

exports.changeTodo = async (req, res) => {
  try {
    const { id, status, type, done, priority,what,who } = req.body;

    const response = await AllTodos.findOneAndUpdate(
      { _id: id },
      {
        status: status,
        type: type,
        done: done,
        priority:priority,
        what:what,
        who:who
      },
      {
        new: true
      }
    );

    if (response) {
      return res
        .status(200)
        .json({ response, message: "todo have been change" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};

/* delete todo */

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.body;

    const deleter = await AllTodos.findByIdAndDelete({ _id: id });

    if (deleter) {
      return res.status(200).json({ message: "recipt  have been deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};

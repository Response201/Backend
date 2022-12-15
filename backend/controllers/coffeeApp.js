const AllCoffes = require ("../models/CoffeeApp")


 exports.postCoffee = async (req, res) => { 
  try {
    const response = await AllCoffes.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
}
  


exports.newCoffee = async (req, res) => {
   const { message } = req.body;

  const messages = new AllCoffes({
    message
  }).save();

  try {
    const response = await messages;
    if (response) {
      res.status(201).json({
        response,
        success: true
      });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
}







exports.likeCoffee= async (req, res) => {
  const { postId } = req.params;

  try {
    const likeUpdate = await AllCoffes.findByIdAndUpdate(
      {
        _id: postId
      },
      {
        $inc: {
          hearts: 1
        }
      },
      {
        new: true
      }
    );

    if (likeUpdate) {
      res.json(likeUpdate);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
}
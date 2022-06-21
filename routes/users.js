import express  from "express";
const router = express.Router();
import bcrypt from 'bcrypt'
import User from '../model/Userschema.js'



//update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          return res.status(500).json(err);
        }
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("Account has been updated");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can update only your account!");
    }
  });


  //delete
  router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  });

  //get a user
  router.get("/:id", async (req, res) => {
    try {
       const user = await User.findById(req.params.id);
        //we do not need unnecessaary information about user like password updated at
        //user._doc is basically all object
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //follow a user 

// router.put("/:id/followunfollow", async (req, res) => {
//     try {
//       const note = await User.findById(req.params.id);
//       if (!User.followers.includes(req.body.userId)) {
//         await User.updateOne({ $push: { followers: req.body.userId } });
//         res.status(200).json("The note has been liked");
//       } else {
//         await note.updateOne({ $pull: { likes: req.body.userId } });
//         res.status(200).json("The note has been disliked");
//       }
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });

router.put("/:id/follow", async (req, res) => {
  
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
 
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  // if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  
});

//get all user
router.get("/", async (req, res) => {
  try {
    const data =await User.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json(err);
  }
});

 
 
export default router;


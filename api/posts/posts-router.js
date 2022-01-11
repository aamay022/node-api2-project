// implement your posts router here
const express = require('express') // commonjs
const Posts = require('./posts-model')
const router = express.Router()

router.get('/', (req, res) => {
  
    Posts.find()
      .then(post => {
        res.json(post);
      })
      .catch(err => {
        res.status(500).json({
            message: "The posts information could not be retrieved"
        });
      });
  });
  
  router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
      .then(posts => {
        if (!posts) {
          res.status(404).json({ message: "The post with the specified ID does not exist" });
        } else {
          res.json(posts);
        }
      })
      .catch(err => {
        res.status(500).json({
          message: "The post information could not be retrieved",
        });
      });
  });
  
  
  router.post('/', async (req, res) => {
      try {
        if(!req.body.title || !req.body.contents){
            res.status(400).json({
                message: "Please provide title and contents for the post" 
            })
        }else{
            const newPost = await Posts.insert(req.body)
            res.status(201).json(newPost)
        }
      } catch (err){
        res.status(500).json({
            message: "There was an error while saving the post to the database",
        })
      }
  });
  
  router.put('/:id', (req, res) => {
    const changes = req.body;

    Posts.update(req.params.id, changes)
      .then(post => {
        if (!post) {
          res.status(404).json({ message: "The post with the specified ID does not exist" });
        } else if(!req.body.title || !req.body.contents){
            res.status(400).json({
                message: "Please provide title and contents for the post" 
            })
        } else {
            res.status(200).json(post)
        }
      })
      .catch(error => {
        res.status(400).json({
            message: "Please provide title and contents for the post",
        });
      });
  });

  router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
      .then(deletedPost => {
        if (!deletedPost) {
          res.status(404).json({ message: "The post with the specified ID does not exist" });
        } else {
            res.status(200).json(deletedPost);
        }
      })
      .catch(error => {
        res.status(500).json({
            message: "The post could not be removed",
        });
      });
  });
  


  router.get('/:id/comments', async (req, res) => {
    try {
      const posts = await Posts.findPostComments(req.params.id)
      if (!posts.length) {
        res.status(404).json({
            message: "The post with the specified ID does not exist"
        })
      } else {
        res.json(posts)
      }
    } catch (err) {
      res.status(500).json({
        message: "The comments information could not be retrieved",
      })
    }
  });

module.exports = router
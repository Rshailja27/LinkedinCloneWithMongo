const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const multer = require('multer');
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const Post = require("./models/post.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/images")));

app.use(express.urlencoded({ extended: true }));  
app.use(express.json());
app.use(methodOverride('_method'));  //override with POST having ?_method=PATCH

main().then(() => {
  console.log("connected to DB");
})
.catch((err) =>{
console.log(err);
});

async function main() {
await mongoose.connect("mongodb://127.0.0.1:27017/linkedIn");
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

app.get("/posts", async (req, res) => {
  let posts = await Post.find() ;
  res.render("index.ejs", { posts });            
        
});

app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/posts", upload.single('image'), async (req, res) => {
  const { username, name, content } = req.body;
  const image = req.file ? req.file.filename : null;
  let likes = 0;
  let repost = 0;
  let comments = [];
 
  let newPost = new Post({
    username: username,
     name: name,
     content: content,
     image:image,
     likes:likes,
     repost:repost,
     comments:comments,
  });  
    await newPost.save();
    console.log(newPost);
    res.redirect("/posts");   
});

app.get("/posts/:id", async (req, res) => {
    let { id } = req.params;
    let post = await Post.findById(id) ;  
    res.render("profile.ejs", { post });           
});

// COMMENTS ROUTE TO REACH COMMENTS FORM
app.get("/posts/:id/comments", async(req, res) => {
    const { id } = req.params;
    let post = await Post.findById(id);
    res.render("comments.ejs", { post });  
});

//Create COMMENTS ROUTE
app.post("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  const newComment = req.body.comment;  
    let post = await Post.findById(id);
    post.comments.push(newComment);
    
    await post.save();
    res.redirect(`/posts/${id}/comments`);   
});
 
// ROUTE TO GET THE COUNT OF LIKES
app.get("/posts/:id/likes", async (req, res) => {
  const { id } = req.params;
  try {
    // Find the post by ID
    let post = await Post.findById(id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    post.likes += 1;
    await post.save();
    res.redirect(`/posts`);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating likes");
  }
});

  //REPOST ROUTE
  app.post("/posts/:id/repost", async (req, res) => {
    let { id } = req.params;      
      
    let post = await Post.findById(id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    
        let rePost = new Post({
          username: post.username,
          name: post.name,
          content: post.content,
          image: post.image,
          likes:0,
          repost:0,
          comments: [],
        });  
      await rePost.save();
      post.repost += 1;
    await post.save();
      res.redirect("/posts");      
  }); 

// EDIT ROUTE TO REACH UPDATE FORM
  app.get("/posts/:id/update", async (req, res) => {
    let { id } = req.params;
    let post = await Post.findById(id);
    res.render("update-content.ejs",{ post });
     
  });  
   
 //UPDATE THE USERS DATA IN DB ROUTE
 app.patch("/posts/:id", upload.single('image'), async (req,res) => {
      let { id } = req.params;
      let newUserName = req.body.username;  
      let newName = req.body.name;  
      let newContent = req.body.content;  
      const NewImage = req.file ? req.file.filename : req.body.image;
      
      let updatePost = await Post.findByIdAndUpdate(
        id,{
        username: newUserName,
        name:newName,
        content:newContent,
        image:NewImage
      }
    );
   res.redirect("/posts");
}); 

  // Delete Route
  app.delete("/posts/:id",async (req,res) => {
    let { id } = req.params;   
    await Post.findByIdAndDelete(id);
    res.redirect("/posts");
       
  }); 

  app.get("/search", async (req, res) => {
    const { userSearch } = req.query;
    let posts = await Post.find({name: userSearch});
      if (posts.length === 0) {
          return res.send("No result found");
        }
        res.render("search.ejs", { posts });
 });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

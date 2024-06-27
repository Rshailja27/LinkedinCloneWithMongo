const mongoose = require("mongoose");
const Post = require("./models/post.js")

main().then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/linkedIn", {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
}

let allPosts = [
    {
        username:"Shailja@437",
        name:"Shailja Rajpoot",
        content:"I am learing full stack development",
        image:"shailja-photo.jpg",
        likes:0,
        repost:0,
        comments : "",
    },
    {
        username:"Shivam@700",
        name:"Shivam Singh",
        content:"I love coding",
        image:"shivam.jpg",
        likes:0,
        repost:0,
        comments : "",
    },
    {
        username:"Siddhant@97",
        name:"Siddhant Rajpoot",
        content:"I am a farmer, I love farming.",
        image:"siddhant.jpg",
        likes:0,
        repost:0,
        comments : "",
    },
    {
        username:"Shraddha@743",
        name:"Shraddha Singh",
        content:"I am a fighter, fight everyday for my rights.",
        image:"shraddha.jpg",
        likes:0,
        repost:0,
        comments : "",
    },
    
];

Post.insertMany(allPosts);
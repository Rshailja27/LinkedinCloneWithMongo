const mongoose = require("mongoose");

mongoose.set('strictQuery', true); 

main()
.catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/linkedIn", {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
}

let postSchema = new mongoose.Schema({
     username:{
        type: String,
        required :true,
    }, 
     name:{
        type: String,
        required :true,
    }, 
     content:{
        type: String,
    }, 
    image:{
        type: String,
    },
    likes:{
        type: Number,
    }, 
    repost:{
        type: Number,
    },
    comments:{
        type: [String]
    }
});

let Post = mongoose.model("Post", postSchema);

module.exports = Post;
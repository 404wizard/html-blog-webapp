import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Console } from "console";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const blogPost = [];
var allPosts = "";
var newPost = "";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

function BlogInfo (title, author, content, date) { 
    this.title = title;
    this.author = author;
    this.content = content;
    this.date = date;
};

//Dynamically built HTML cards to show each blog post as they are created.
function buildPost (blogPost, max) {
    allPosts = "";

    for (let n = 0 ; n < max; n++ ){
        if (blogPost[n].content.length <= 130) {
            var blogSummary = blogPost[n].content;
        } else {
            var blogSummary = blogPost[n].content.substring(0,130) + "...";
        }
        newPost = `
                <div class="col">
                    <div class="card shadow-sm">
                    <img class="bd-placeholder-img card-img-top" src="./images/post-header-img.jpg" width="100%" preserveAspectRatio="xMidYMid slice" focusable="false">
                    <div class="card-body">
                        <h3 class="card-title">${blogPost[n].title}</h3>
                        <h6 class="card-subtitle mb-2 text-body-secondary">Written by ${blogPost[n].author}</h6>
                        <p class="card-text">${blogSummary}</p>
                        <div class="d-flex align-items-center">
                        
                        <form name="sendData" action="/view" method="POST">
                            <input type="hidden" name="postid" value="${n}">
                            <button type="submit" class="btn btn-sm btn-outline-secondary me-2">View</button>
                        </form>
                        <form name="sendData" action="/edit" method="POST">
                            <input type="hidden" name="postid" value="${n}">
                            <button type="submit" class="btn btn-sm btn-outline-secondary me-2">Edit</button>
                        </form>
                        <form name="sendData" action="/delete" method="POST">
                            <input type="hidden" name="postid" value="${n}">
                            <button type="submit" class="btn btn-sm btn-outline-secondary me-5">Delete</button>
                        </form>
                        <small class="text-body-secondary fst-italic">Published ${blogPost[n].date}</small>
                        </div>
                    </div>
                    </div>
                </div>
        `;

        allPosts = allPosts + newPost;
    }

    return allPosts;
}

app.get("/", (req, res) => {
    res.locals = { BlogContent: blogPost, blogCards: allPosts };
    res.render(__dirname + "/views/index.ejs");
    // console.log(blogPost.length);
});

app.post("/view", (req, res) => {
    
    // console.log("The Post ID is: " + req.body.postid);
    res.locals = { BlogContent: blogPost[req.body.postid]};
    // console.log(blogPost[req.body.postid]);

    res.render(__dirname + "/views/view-post.ejs");
});

app.post("/edit", (req, res) => {
    
    // console.log("The Post ID is: " + req.body.postid);
    res.locals = { BlogContent: blogPost, PostID: req.body.postid };
    // console.log(blogPost[req.body.postid]);

    res.render(__dirname + "/views/edit-post.ejs");
});

app.get("/create", (req, res) => {
    res.render(__dirname + "/views/create-post.ejs");
});

app.post("/submit", (req, res) => {
    const month = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
    const d = new Date(); 
    
    blogPost.push (new BlogInfo(req.body.btitle, req.body.bauthor, req.body.bcontent, month[d.getMonth()] + " " + d.getDay() + ", " + d.getFullYear()));

    // console.log(blogPost);
    // console.log(blogPost.length);
    
    buildPost(blogPost, blogPost.length);
    res.locals = { BlogContent: blogPost, blogCards: allPosts };
    res.render(__dirname + "/views/index.ejs");
  });

  app.post("/resubmit", (req, res) => {

    // console.log("The postid is: " + req.body.postid)
    // console.log(blogPost);

    blogPost[req.body.postid].title = req.body.btitle;
    blogPost[req.body.postid].author = req.body.bauthor;
    blogPost[req.body.postid].content = req.body.bcontent;

    // console.log(blogPost);

    buildPost(blogPost, blogPost.length)
    res.locals = { BlogContent: blogPost, blogCards: allPosts };
    res.render(__dirname + "/views/index.ejs");
  });

  app.post("/delete", (req, res) => {

    // console.log("The postid is: " + req.body.postid)
    // console.log(blogPost);

    //Teh SPLICE method will deletes the selected blog post in array
    blogPost.splice(req.body.postid, 1); // array.splice(at position postid, remove 1 item)

    // console.log(blogPost);

    buildPost(blogPost, blogPost.length)
    res.locals = { BlogContent: blogPost, blogCards: allPosts };
    res.render(__dirname + "/views/index.ejs");
  });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
var express = require("express"),
    app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect('mongodb://localhost:27017/restful_blog_app',
    { useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs");

//use of this line??????
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "First Blog",
//     image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80",
//     body: "Hello mofos",
//     created: Date.now.
// },
//     function (err, blog) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             console.log(blog)
//         }
//     }
// )


//RESTful ROUTES
app.get("/", function (req, res) {
    res.redirect("/blogs");
})

app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, allBlogs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { blogs: allBlogs });
        }
    })
})


app.listen("3000", function () {
    console.log("live at 3000");
})

var express = require("express"),
    app = express();
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");

mongoose.connect('mongodb://localhost:27017/restful_blog_app',
    { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");

//use of this line??????
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTful ROUTES
app.get("/", function (req, res) {
    res.redirect("/blogs");
})


//INDEX ROUTE
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

//NEW ROUTE
app.get("/blogs/new", function (req, res) {
    res.render("new");
})

//CREATE ROUTE
app.post("/blogs", function (req, res) {
    //creaete blog
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        }
        else {
            //redirect to index page
            res.redirect("/blogs");
        }
    })

})

//SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("show", { blog: foundBlog })
        }
    })

})

//EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("edit", { blog: foundBlog })
        }
    })
})

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

//DELETE ROUTE
app.delete("/blogs/:id", function (req, res) {
    Blog.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect("/blogs")
        }
    })
})

app.listen("3000", function () {
    console.log("live at 3000");
})

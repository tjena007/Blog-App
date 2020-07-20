var express = require("express"),
    app = express();
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");

mongoose.connect('mongodb://localhost:27017/restful_blog_app',
    { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");

//use of this line??????
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

//NEW ROUTE
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

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {
  useUnifiedTopology: true, //important
  useNewUrlParser: true, //important
  useFindAndModify: false,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//schema setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

var campground = mongoose.model("campground", campgroundSchema);

/*
campground.create(
  {
    name: "Salmon Creek",
    image:
      "data:image/jpeg;base64,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",
    description: "selmon bhai ne yahin maara tha black buck ^_^",
  },
  {
    name: "Grenit Hill",
    image:
      "https://www.exoticamp.com/wp-content/uploads/2018/04/31353834_654595511560142_661742522199941270_n.jpg",
    description: "granite nhi grenit likha hai!!... ",
  },
  function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      console.log(campground);
    }
  }
);
*/

app.get("/", function (req, res) {
  res.render("campgrounds");
});

//index route - get req. to display all elements
app.get("/campgrounds", function (req, res) {
  campground.find({}, function (err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds", { campgrounds: campgrounds });
    }
  });
  //res.render("campgrounds", { campgrounds: campgrounds });
});

//new route - get req. to show form
app.get("/campgrounds/new", function (req, res) {
  res.render("new.ejs");
});

//create route - post req to add new element
app.post("/campgrounds", function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var newcamp = { name: name, image: image };
  campground.create(newcamp, function (err, newc) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function (req, res) {
  campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { campground: foundCampground });
    }
  });
});

app.listen(27017, function () {
  console.log("server running!");
});

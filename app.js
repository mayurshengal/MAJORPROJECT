const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");

const path = require("path");
app.set("views", path.join(__dirname , "views"));
app.set("view engine", "ejs");

const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);

app.use(express.urlencoded({extended : true}));

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//to use static files
app.use(express.static(path.join(__dirname , "/public")));

// requiring the route(folder)
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const session = require("express-session");
const flash = require("connect-flash");



let MONGO_URL = "mongodb://127.0.0.1:27017/topstay";
main()
      .then( () => {   console.log("Connected to Database");  })
      .catch( (err) => { console.log(err);   });

async function main() {
    await mongoose.connect(MONGO_URL);
}



const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}


app.get("/" , (req , res) => {
    res.send("Root is Working");
});


app.use(session(sessionOptions));
app.use(flash());


app.use((req, res , next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


app.use("/listings", listings);
app.use("/listings/:id/reviews" , reviews);


app.all("*" , (req , res , next) => {
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err, req, res, next)=>{
  let { statusCode=500 , message="Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs",{message});
//   res.status(statusCode).send(message);
});

app.listen(8080 , () => {
    console.log("app is listening on port 8080");
}); 











/*
app.get("/testlisting" , async (req , res) => {
   let  sampleListing= new Listing({
    title: "My New Villa" ,
    description:"By rhe beach" ,
    price: 1200,
    location: "Calangute Goa",
    country: "India",
   });
    
  await sampleListing.save();
  console.log("Sample was saved");
  res.send("Sucessful Testing");

});
*/
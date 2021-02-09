if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');
const houseRoutes = require('./routes/house');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const MongoDBStore = require("connect-mongo")(session);
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')

const db_url = process.env.DB_URL || 'mongodb://localhost:27017/houseOnRent';
//const db_url = 'mongodb://localhost:27017/houseOnRent';
mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection Success");
});


const app = express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views')); 

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

app.use(mongoSanitize({
  replaceWith: '_'
}));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: db_url,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {
  name: 'session',
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      //secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];

app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/da2gwlknr/"
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);



app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


app.get('/',(req,res)=>{
  res.render('home');
});

app.use('/houses',houseRoutes);

app.use('/houses/:id/reviews',reviewRoutes);

app.use('/',userRoutes);


app.all('*',(req,res,next)=>{
  next(new AppError('Page Not Found',404));
});


app.use((err,req,res,next)=>{
  if(!err.message){
    err.message = 'Something Went Wrong';
  }
  if(!err.statusCode){
    err.statusCode = 500;
  }

  res.status(err.statusCode).render('error',{err});
});


const port = process.env.PORT || 3000;
app.listen(port, ()=>{
  console.log(`Listening at port ${port}`);
});
// imports
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const userRouter = require("./routers/userRouter");
const port = process.env.PORT || 5000;
const cors = require('cors');
const orderRouter = require("./routers/orderRouter");

dotenv.config();

// instantiating express
const app = express();

//middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//for cross origin resource sharing 
app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*") //update to match detail you make requests from
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
      res.header('Access-Control-Allow-Credentials', true);
      next();
  });

//connct to mongose
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/safe-courier", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
   useFindAndModify:false,
   useCreateIndex: true
});

mongoose.Promise = global.Promise;
let db = mongoose.connection
//db.on("error", console.error.bind(console, "Failed to connect to database"));
db.once("open", () => console.log("Connected to db"))
db.on("error", (error) => {
  console.log("Failed to connect to db", error )
});


// root handler
app.get("/", (req, res) => {
    res.send("Server is ready");
  });


// //incase a route doesnt exist
// app.get('*', (req, res) => {
//     res.send('the route specified doesnt exist');
//   });
  
  app.use("/api/users", userRouter);
//   app.use("/api/products", productRouter);
  app.use('/api/orders', orderRouter)
  
  app.use((err, req, res, next) => {
    res.status(500).send({ message: err });
  });

  
  // setting port
  app.listen(port, () => {
    console.log(`Server running at port ${port}`);
  });
  
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const AppRoutes = require("./routes/approutes");
const connectDB = require("./DB/connect");
const path = require('path');
const bodyParser = require("body-parser");
const auth = require("./middlewares/auth");
const authRoutes = require('./routes/authRoutes')
const userdetailsRoute = require('./routes/userDetails')
require('dotenv').config();

app.use(bodyParser.urlencoded())
app.use(express.json());
app.use(express.static(path.join(__dirname , 'public')));

app.use("/api/userdetails",auth,userdetailsRoute)
app.use('/api/auth',authRoutes);
app.use("/api",auth,AppRoutes);
app.get('/*',(req,res)=>{
  res.sendFile(path.join(__dirname + '/public/index.html' ))
})
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();

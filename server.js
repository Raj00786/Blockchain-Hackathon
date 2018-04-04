const express   = require("express");
const morgan    = require("morgan");
const bodyParser  = require("body-parser");
var port        = process.env.PORT || 8080;
var app         = express();
var path        = require('path');
//var User        = require("./app/models/user");
var appRoutes   = require("./app/routes/api");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use("/api",appRoutes);

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname+'/public/app/views/'));
});

// app.post("/users",function (req,res) {

// });

app.listen(port);

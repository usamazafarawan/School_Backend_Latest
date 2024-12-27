// import { json } from "body-parser";

// const express = require("express")
// const cors = require("cors")
// const bodyParser = require("body-parser");
// const multer = require("multer")


// const app= express()
// app.use(cors({origin:"*"}));
// app.use( bodyParser.json({limit: '100mb'}));
// //  app.use(express.json.parse());

// app.listen(3000, ()=>{
//    console.log("sserver is lestening at the port 3000")
// });


// var storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//      cb(null, 'uploads')
//    },
//    filename: function (req, file, cb) {
//      cb(null, file.origionalname + '-' + Date.now())
//    }
//  })

// var upload = multer({ storage: storage });

// app.post("/api/file",upload.single('file'),(req,res)=>{
//    console.log('req: ', req.file);
//    // var img = fs.readFileSync(req.file.path);
//    // var encode_img = img.toString('base64');
//    // var final_img = {
//    //     contentType:req.file.mimetype,
//    //     image:new Buffer(encode_img,'base64')
//    // };
//    // imageModel.create(final_img,function(err,result){
//    //     if(err){
//    //         console.log(err);
//    //     }else{
//    //         console.log(result.img.Buffer);
//    //         console.log("Saved To database");
//    //         res.contentType(final_img.contentType);
//    //         res.send(final_img.image);
//    //     }
//    // })
// })

////////////////////////

// import express from 'express';
// const app = express();
// const port = 3000;

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(port, () => {
//   return console.log(`Express is listening at http://localhost:${port}`);
// });

// import express from 'express';
// const app = express();
// const port = 4000;

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(port, () => {
//   return console.log(`Express is listening at http://localhost:${port}`);
// });



import express from "express";
import mongoose from "mongoose";
import http from "http";
import { routes } from "./route";
const path = require('path');
const fs = require("fs");
const multer = require("multer");
const bodyParser = require('body-parser');
const cors = require("cors");

export const app = express();
const server = http.createServer(app);

 app.use(express.json({limit: '50mb'}));
  app.use(express.urlencoded({limit: '50mb',     extended:true  },));
app.use(bodyParser.json({limit: '50mb'}));


app.use(cors(
{
origin:"*"
}
));
// app.use(bodyParser.json());

// app.use(bodyParser.json({limit: '50mb'}));
/////////////////////

// app.use(bodyParser.urlencoded({limit: '50mb',
//     extended:true  },
// ))
// app.use(express.json());



// app.set("view engine","ejs");


// SET STORAGE
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, 'uploads')
   },
   filename: function (req, file, cb) {
     cb(null, file.name + '-' + Date.now())
   }
 })

var upload = multer({ storage: storage });
// Multer configuration


app.post("/uploadFeeStrucDoc",upload.single('uploadFeeStrucDoc'),(req,res)=>{
   console.log('req: ', req.body);
   // var img = fs.readFileSync(req.file.path);
   // var encode_img = img.toString('base64');
   // var final_img = {
   //     contentType:req.file.mimetype,
   //     image:new Buffer(encode_img,'base64')
   // };
   // imageModel.create(final_img,function(err,result){
   //     if(err){
   //         console.log(err);
   //     }else{
   //         console.log(result.img.Buffer);
   //         console.log("Saved To database");
   //         res.contentType(final_img.contentType);
   //         res.send(final_img.image);
   //     }
   // })
})

//////////////////////


// Upload endpoint
// app.post('/api/file', (req, res) => {
//    console.log('req: ', req.body);

//    // Connect to MongoDB
//    // MongoClient.connect(mongoURI, { useUnifiedTopology: true }, (err, client) => {
//    //   if (err) {
//    //     console.error(err);
//    //     res.status(500).send('Failed to connect to MongoDB');
//    //     return;
//    //   }
 
//    //   const db = client.db(dbName);
//    //   const collection = db.collection('files');
 
//    //   // Save the file to MongoDB
//    //   collection.insertOne({ file: req.file.buffer }, (err) => {
//    //     if (err) {
//    //       console.error(err);
//    //       res.status(500).send('Failed to upload file');
//    //     } else {
//    //       res.send('File uploaded successfully');
//    //     }
//    //     client.close();
//    //   });
//    // });
//  });
/////////////////////
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT, POST, PATCH, DELETE, OPTIONS");
    next();
});
const port = 3000;
export const TOKEN_KEY="11223344";


/**
 *  live mongo db  connection string "mongodb+srv://usama:usama@cluster0.y2fjq.mongodb.net/myApp?retryWrites=true&w=majority"
    local momgo db connection String "mongodb://127.0.0.1:27017/"
    test School database  "testSchooldb" 
   main School database  "mainSchooldb"
 */


   app.use('/api/test', (req, res) => res.send('BGS BACKEND'));

routes(app);

// const url =`mongodb://127.0.0.1:27017/testSchooldb`;
const url =`mongodb+srv://usama:usama@cluster0.y2fjq.mongodb.net/BGS_School?retryWrites=true&w=majority`;

mongoose.connect(url)
.then(() => {
   console.log('Connected to database!',url);
})
.catch(error => {
   console.log('Connection failed!:', error);
});

server.listen(port, () => {
console.log(`Express server listening ${port}`);
});

export default app;

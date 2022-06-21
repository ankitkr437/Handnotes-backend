import express from 'express';
import mongoose  from 'mongoose';
import dotenv from 'dotenv';
import connection  from './database/db.js';
import  morgan from 'morgan';
import  helmet from 'helmet';
import multer from 'multer';
import path from 'path';

import useRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import noteroute from './routes/notes.js';
import commentroute from './routes/comment.js'
import conversationroute from './routes/conversation.js'
import messageroute from './routes/message.js'
 
import cors from 'cors';
const app=express();
dotenv.config();

const port=process.env.PORT ||8000;
 
const URL=process.env.URL;
connection(URL);

 
const seturl="http://localhost:3000";
const seturl2="https://handnote.netlify.app/"
 
app.use(cors({
  origin:"*",
  methods: ['GET','POST','DELETE','UPDATE','PUT'],
  allowedHeaders:['Content-Type', 'Authorization','sessionId'],
  exposedHeaders:['sessionId'],
  preflightContinue:false
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const router = express.Router();
const __dirname = path.resolve();


app.use("/images", express.static(path.join(__dirname, "public/images"), {
  setHeaders: function(res, path) {
    res.set("Cross-Origin-Resource-Policy","cross-origin");
    res.set("Content-Security-Policy",`frame-ancestors  ${seturl2}`);
    
  }
}));
app.use("/notepdf", express.static(path.join(__dirname, "public/images/notepdfs"), {
  setHeaders: function(res, path) {
    res.set("Cross-Origin-Resource-Policy","cross-origin");
    res.set("Content-Security-Policy",`frame-ancestors  ${seturl2}`);
     
    }
}));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  
  const upload = multer({ storage: storage });
  app.post("/api/upload/", upload.single("file"), (req, res) => {
     
    try {
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error(error);
    }
  });


  const storagepdf = multer.diskStorage({
    destination: (req, pdffile, cb) => {
      cb(null, "public/images/notepdfs");
    },
    filename: (req, pdffile, cb) => {
      cb(null, req.body.pdfname);
    },
  });
  
  const uploadpdf = multer({ storage: storagepdf });
  app.post("/api/upload/pdf", uploadpdf.single("pdffile"), (req, res) => {
     
    try {
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error(error);
    }
  });


app.use('/api/users',useRoute);
app.use('/api/auth',authRoute);
app.use('/api/notes',noteroute);
app.use('/api/comments',commentroute);
app.use('/api/conversations',conversationroute);
app.use('/api/messages',messageroute);


app.get("/",(req,res)=>{
    res.send("welcome to home page"); 
})
app.listen(port,()=>console.log(`listening on port at ${port}`));
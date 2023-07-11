require('dotenv').config();

const express=require("express");
const bodyparser=require("body-parser");
const ejs =require("ejs");
const mongoose=require("mongoose");
const bcrypt= require('bcrypt');
const saltRounds=10;
 



const app=express();

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({
    extended:true
}));


app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB").then(()=>{
    console.log("Db connected..")


})
.catch((err)=>{
    console.log(err)
  })
  ;

/// for encrypion part
  const userSchema= new mongoose.Schema({
    email:String,
    password:String
  });

  
  //before add this  to carete model need to plug in
  

  const user=new mongoose.model("user",userSchema);



app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register",function(req,res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser=new user({
            email:req.body.username,
            password:hash
        });
        newUser.save().then(()=>{
           res.render("secrets");
        }).catch(err=>{
            console.log(err);
        });
    });
   
});


app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    
    
    user.findOne({email:username}).then((foundUser)=>{
        if(foundUser){
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if(result=== true){
                    res.render("secrets");
            
                }
            });
              
        }
    })
    .catch((err)=>{
        console.log(err);
    });
  
});


app.listen(3000,function(req,res){
    console.log("Server is on running port 3000");
});

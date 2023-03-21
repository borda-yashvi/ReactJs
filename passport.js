const express = require("express");
const  session  = require("express-session");
const bodyparser = require("body-parser");
const app = express.Router()
const passport = require('passport');
const { Pass } = require("./schema");
const BearerStrategy = require('passport-local').Strategy
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
app.use(session({
  secret:'yashasvi',
  resave:false,
  saveUninitialized:true,
  cookie:{secure:false,maxAge:60000}
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new BearerStrategy(
     async function(username,password,done,err) {
        console.log("====",username,">>>>",password);
      const result = await Pass.findOne({username:username})
       if(err) {return done(err)}
        if(!Pass) {return done(null,false,{message : 'user was not found'})}
        if(!Pass.password == password) {return done(null,false,{message : 'password is wrong '})}
        console.log("==1st===",result);
        return done(result);
      }
    )
)

passport.serializeUser(async function(pass,done){
  if(pass) {return done(null,pass.id)}
  return done(null,false)
})
passport.deserializeUser(async function(id,err,done){
  const des = await Pass.findById({id})
    if(err) return done(null,false)
    return done(des)
  })

app.post(`/`, 
passport.authenticate('local')
//  async function(req, res) {
//   res.json(req.Pass)
//   console.log("===req.pass===",req.Pass);
//  }
 );

// function isAuthendicate(req,res,done){
//   if(req.Pass) { return done()}
//   return res.redirect("/")
// }
// app.get(`/sum`,isAuthendicate,(req,res)=>{
//   console.log("====sum=====");
//   req.session.test?req.session.test++ : req.session.test=1
//   res.send(req.session.test.toString()+" "+req.Pass.username)
// })




app.post("/data",async (req,res)=>{
  const pass = new Pass({
     username:req.body.username,
     password:req.body.password,
     name:req.body.name
     })
     const passlist = await pass.save()
     if(!passlist) res.send("data was not found")
     res.send(passlist)
})

// app.get("/data",async (req,res)=>{
//      const passlist = await Pass.find()
//      if(!passlist) res.send("data was not found")
//      res.send(passlist)
// })
module.exports = app

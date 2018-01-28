
const 
    express=require("express")
    request=require("request")
    bodyParser=require("body-parser")
    mongoose=require("mongoose")
    app=express();

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.listen((process.env.PORT || 5000));
    

    app.get("/",(req, res)=> {
      res.send("Deployement Done");
    });
    
    app.get("/webhook", (req, res)=>{
      if (req.query["hub.verify_token"] === "this_is_my_token") {
        console.log("Verified webhook");
        res.status(200).send(req.query["hub.challenge"]);
      } else {
        console.error("Verification failed. The tokens do not match.");
        res.sendStatus(403);
      }
    });
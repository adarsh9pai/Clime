
const 
    express=require("express")
    request=require("request")
    bodyParser=require("body-parser")
    mongoose=require("mongoose")
    app=express();

const port=process.env.PORT||3000;

app.use(bodyParser,urlencoded({extended:true}));
app.use(bodyParser.json());
app.listen(port,()=>{

});

app.get('/',(req,res)=>{
    res.send("Deployment Done");
});

app.get("/webhook",(req, res)=>{
    if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
        console.log("Verified webhook");
        res.status(200).send(req.query["hub.challenge"]);
    } else {
        console.error("Verification failed. The tokens do not match.");
        res.sendStatus(403);
    }
});
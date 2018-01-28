import { urlencoded } from "../../Library/Caches/typescript/2.6/node_modules/@types/express";

const 
    express=require("express")
    request=require("request")
    bodyParser=require("body-parser")
    app=express();

const port=process.env.PORT||3000;

app.use(bodyParser,urlencoded({extended:true}));
app.use(bodyParser.json());
app.listen(port,()=>{

});

app.get('/',(req,res)=>{
    res.send("Deployment Done");
});

app.get('/webhook',(req,res)=>{
    if(req.query["hub.verify_token"]===""){
    console.log("Webhook Verified");
    res.status(200).send(req.query["hub.challenge"]);
    }
    else{
        console.log("Verification failed. Token mismatch");
        res.sendStatus(403);
    }

});

const 
express=require("express")
request=require("request")
bodyParser=require("body-parser")
mongoose=require("mongoose")
app=express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen(3000,function(){});


app.get("/",(req, res)=> {
  res.send("Deployement Done");
});

var url="http://dev.virtualearth.net/REST/v1/Locations/1%20Microsoft%20Way%20Redmond%20WA%2098052?o=xml&key=BingMapsKey";
request(url,(err,response,body)=>{
    var json=JSON.parse(body);
    console.log(json);
});
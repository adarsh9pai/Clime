const
    express=require('express')
    bodyParser=require('body-parser')
    request=require('request')
    app=express();

const port=process.env.PORT||3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.set('view engine','ejs');

app.listen(port,()=>{
console.log('Listening on Port 3000');
});

app.get('/',(req,res)=>{
    res.render("index");
});

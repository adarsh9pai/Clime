const
    express=require('express')
    bodyParser=require('body-parser')
    request=require('request')
    app=express();

const port=process.env.PORT||3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('view engine','ejs');

app.listen(port,()=>{
console.log('Listening on Port 3000');
});



app.get('/',(req,res)=>{
    res.render("index");
});



app.post('/',(req,res)=>{
// Start of OpenWeatherApp API     
city=req.body.cityInput;
const key="2e9575cfb013aac06605e69d9a75d378";
var url_owm = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;
var json_owm;
request(url_owm,(error,response,body)=>{
     json_owm=JSON.parse(body);
     res.render("results",
     {  name: json_owm.name,
        temperature:json_owm.main.temp,
        pressure:json_owm.main.pressure,
        humidity:json_owm.main.humidity,
        sea_level:json_owm.main.sea_level,
        grnd_level:json_owm.main.grnd_level,
        weather_main:json_owm.weather.main,
        weather_description:json_owm.weather.description});
     console.log(json_owm);   
    
});
//End of OpenWeatherApp API

//Start of News API
var news_json='';
const news_url='https://newsapi.org/v2/top-headlines?'+`q=${city} natural disaster&`+'sortBy=popularity&' +'apiKey=122bddc297ee4003b02b398840728704';
request(news_url,function(error,request,body){
    news_json=JSON.parse(body);
    console.log(news_json);
});



//End of News API
});




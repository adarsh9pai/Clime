
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

    app.post("/webhook",(req,res)=>{
        if(req.body.object=="page"){
            req.body.entry.forEach(function(entry) {
                entry.messaging.forEach(function(event) {
                  if (event.postback) {
                    processPostback(event);
                  } else if(event.message){
                      processMessage(event);
                  }
                });
              });
          
              res.sendStatus(200);
        }
    });

    function processPostback(event) {
        var senderId = event.sender.id;
        var payload = event.postback.payload;
      
        if (payload === "Greeting") {
          request({
            url: "https://graph.facebook.com/v2.6/" + senderId,
            qs: {
              access_token: process.env.PAGE_ACCESS_TOKEN,
              fields: "first_name"
            },
            method: "GET"
          }, function(error, response, body) {
            var greeting = "";
            if (error) {
              console.log("Error getting user's name: " +  error);
            } else {
              var bodyObj = JSON.parse(body);
              name = bodyObj.first_name;
              greeting = "Hi " + name + ". ";
            }
            var message = greeting + " I'm Mr.Clime! How may I assist you today? \n - Weather Update \n - Donate funds \n - Look for the nearest Emergency Centers \n - Call Emergency Services";
            sendMessage(senderId, {text: message});
          });
        }
      }
      
      function sendMessage(ID,msg){
          request({
              url:
              "https://graph.facebook.com/v2.6/me/messages",
              qs:{
                  access_token:process.env.PAGE_ACCESS_TOKEN
              },
              method:"POST",
              json:{
                  recipient:{id:ID},
                  message:msg,
              }
          },function(error,response,body){
              if(error){
                  console.log("Message Error"+response.error);
              }
          }
        );

      }

      function processMessage(event) {
        if (!event.message.is_echo) {
          var message = event.message;
          var senderId = event.sender.id;
      
          console.log("Received message from : " + senderId);
          console.log("Message : " + JSON.stringify(message));
          if (message.text) {
            var fMsg = message.text.toLowerCase().trim();
            console.log(fMsg);
            switch (fMsg) {
              case "weather":
              case "emergency":
              emergencyCall(ID);
              case "bank":
              case "donate":
              setDonate(senderId);
              break;
              case "call":
              sendMessage(senderId, {text: "Me Me Big Boi"});
                break;
              default:
             findCityDetails(pin);
                
            }
          } else if (message.attachments) {
            sendMessage(senderId, {text: "Sorry, I don't understand your request."});
          }
        }
      }


     function setDonate(ID){
         sendMessage(ID,{text:"You can donate to the American Red Cross @ http://www.redcross.org/donate/drtv"});
     }

     var city;

     function findCity(name)
     {
        city=name;
     }

     function emergencyCall(ID) {
       
         
          
               
                  message = {
                    attachment: {
                      type: "template",
                      payload: {
                        template_type: "generic",
                        elements: [{
                          title: "Call Emergency Services",
                          subtitle: "Would you like to call 911?",
                          buttons: [{
                            type: "postback",
                            title: "Yes",
                            payload: "+1 6825512698"
                          }]
                        }]
                      }
                    }
                  };
                  sendMessage(ID, message);
      }

     

var url_owm = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;
/*
request(url_owm,(error,response,body)=>{
     json_owm=JSON.parse(body);
     res.render("results",{weather:json_owm.name});
     console.log(json_owm);   
     */
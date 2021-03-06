
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
        }else if (payload === "ATM") {
            var message ='ATMs Near You: https://www.google.com/maps/search/ATMs+near+me'
                  sendMessage(senderId,{text:message});
          } else if (payload === "Incorrect") {
            sendMessage(senderId, {text: "Oops! Sorry about that. "});
          }else if (payload === "Hospitals") {
            var message ='Hospitals Near You: https://www.google.com/maps/search/Hospitals+near+me'
                  sendMessage(senderId,{text:message});
          } else if (payload === "Shelters") {
                var message ='Shelters Near You: https://www.google.com/maps/search/Shelters+near+me'
                      sendMessage(senderId,{text:message});
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
                /*
                case "give me the weather":  
                cityMessage(senderId);
              break;
                case "weather":
              cityMessage(senderId);
              break;
                case "hospitals near me":  
                case "shelters near me":
                case "help":
                case "i am injured":
                case "i need help":
                case "emergency":
              var text='Hospitals Near You: https://www.google.com/maps/search/hospitals+near+me'+"\n\n"+' Shelters Near You: https://www.google.com/maps/search/storm+shelters+near+me';
              sendMessage(senderId, {text:text});
              break;
              case "bank":
              case "bank near me":  
              case "atm near me":
              case "need money":
              case "banks near me":
              case "atms near me":
                 var message ='ATMs Near You: https://www.google.com/maps/search/ATMs+near+me'
                  sendMessage(senderId, message);
              
              break;
              case "donate":
              case "i want to donate":
              case "i want to help":
              setDonate(senderId);
              break;
              case "Yes":
              sendMessage(senderId,{text:'ATMs Near You: https://www.google.com/maps/search/hospitals+near+me'});
              break;
              case "911":
              case "call":
              case "Emergency Call":
              sendMessage(senderId, {text: 'If in serious emergency, dial +911'});
                break;
             */
            case "give me the weather":  
                cityMessage(senderId);
              break;
                case "weather":
              cityMessage(senderId);
              break;
           
        
              case "donate":
              setDonate(senderId);
              break;
              case "i want to donate":
              setDonate(senderId);
              break;
              case "i want to help":
              setDonate(senderId);
              break;

              case "hospitals near me":
              message = {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{
                      title: "What do you want to look for?",
                      subtitle: "",
                      buttons: [{
                        type: "postback",
                        title: "Hospitals",
                        payload: "Hospitals"
                      }, {
                        type: "postback",
                        title: "Shelters",
                        payload: "Shelters"
                      }]
                    }]
                  }
                }
              };
              sendMessage(senderId,message);
              break; 
              case "shelters near me":
              message = {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{
                      title: "What do you want to look for?",
                      subtitle: "",
                      buttons: [{
                        type: "postback",
                        title: "Hospitals",
                        payload: "Hospitals"
                      }, {
                        type: "postback",
                        title: "Shelters",
                        payload: "Shelters"
                      }]
                    }]
                  }
                }
              };
              sendMessage(senderId,message);
              break; 
            break;
              case "help":
              message = {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{
                      title: "What do you want to look for?",
                      subtitle: "",
                      buttons: [{
                        type: "postback",
                        title: "Hospitals",
                        payload: "Hospitals"
                      }, {
                        type: "postback",
                        title: "Shelters",
                        payload: "Shelters"
                      }]
                    }]
                  }
                }
              };
              sendMessage(senderId,message);
              break; 
              case "i am injured":
              message = {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{
                      title: "What do you want to look for?",
                      subtitle: "",
                      buttons: [{
                        type: "postback",
                        title: "Hospitals",
                        payload: "Hospitals"
                      }, {
                        type: "postback",
                        title: "Shelters",
                        payload: "Shelters"
                      }]
                    }]
                  }
                }
              };
              sendMessage(senderId,message);
              break; 

              case "emergency":
              message = {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{
                      title: "What do you want to look for?",
                      subtitle: "",
                      buttons: [{
                        type: "postback",
                        title: "Hospitals",
                        payload: "Hospitals"
                      }, {
                        type: "postback",
                        title: "Shelters",
                        payload: "Shelters"
                      }]
                    }]
                  }
                }
              };
              sendMessage(senderId,message);
              break; 


            case "call":
              sendMessage(senderId, {text: 'If in serious emergency, dial +911'});
            break;  
              

             case "bank":
             message = {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{
                      title: "Do you want to look for ATMs near you?",
                      subtitle: "",
                      buttons: [{
                        type: "postback",
                        title: "Yes",
                        payload: "ATM"
                      }, {
                        type: "postback",
                        title: "No",
                        payload: "Incorrect"
                      }]
                    }]
                  }
                }
              };
              sendMessage(senderId,message);
              break; 

            case "bank near me":  
            message = {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{
                      title: "Do you want to look for ATMs near you?",
                      subtitle: "",
                      buttons: [{
                        type: "postback",
                        title: "Yes",
                        payload: "ATM"
                      }, {
                        type: "postback",
                        title: "No",
                        payload: "Incorrect"
                      }]
                    }]
                  }
                }
              };
              sendMessage(senderId,message);
              break; 

              //
            case "atm near me":
              
            message = {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{
                      title: "Do you want to look for ATMs near you?",
                      subtitle: "",
                      buttons: [{
                        type: "postback",
                        title: "Yes",
                        payload: "ATM"
                      }, {
                        type: "postback",
                        title: "No",
                        payload: "Incorrect"
                      }]
                    }]
                  }
                }
              };
              sendMessage(senderId,message);
              break; 

             case "debug":
             message = {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{
                      title: "Do you want to look for ATMs near you?",
                      subtitle: "",
                      buttons: [{
                        type: "postback",
                        title: "Yes",
                        payload: "ATM"
                      }, {
                        type: "postback",
                        title: "No",
                        payload: "Incorrect"
                      }]
                    }]
                  }
                }
              };
              sendMessage(senderId,message);
              break; 


              default:
             processMessage_2(event);
             break;

                
            }
          } else if (message.attachments) {
            sendMessage(senderId, {text: "Sorry, I don't understand your request."});
          }
        }
      }


      function processMessage_2(event) {
        if (!event.message.is_echo) {
          var message = event.message;
          var senderId = event.sender.id;
      
          console.log("Received message from : " + senderId);
          console.log("Message : " + JSON.stringify(message));
          if (message.text) {
            var fMsg = message.text.toLowerCase().trim();
            console.log(fMsg);
            switch (fMsg) {
             
              default:
             findWeather(fMsg,senderId);
                
            }
          } else if (message.attachments) {
            sendMessage(senderId, {text: "Sorry, I don't understand your request."});
          }
        }
      }
      
      

     function setDonate(ID){
         sendMessage(ID,{text:"You can donate to the American Red Cross @ http://www.redcross.org/donate/drtv"});
         
     }

     function findWeather(fMsg,ID)
     {
        var city=fMsg;
        const key="2e9575cfb013aac06605e69d9a75d378";
        var url_owm = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;
        var json_owm;
        request(url_owm,(error,response,body)=>{
            json_owm=JSON.parse(body);
            var string="It is "+json_owm.main.temp+" F with "+json_owm.weather[0].main+"("+json_owm.weather[0].description+"). Humidity: "+json_owm.main.humidity+"% and Pressure: "+json_owm.main.pressure+" Pa."+"\n Coordinates: "+json_owm.coord.lat+" "+json_owm.coord.lon;
            sendMessage(ID,{text:string});
           
       });
       
       
       function findATM(){

           
       }

     }     
     
     function cityMessage(ID)
     {
         sendMessage(ID,{text:"Enter Location"});
     }

     function atmMessage(ID)
     {
         sendMessage(ID,{text:"Enter Latitude and Longitude"});
     }


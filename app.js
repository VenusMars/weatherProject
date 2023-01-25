const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");  // this is tap into body of html page
const app = express();

var PORT = process.env.port || 3000

app.use(express.static("public"));
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res){

  const cityname = req.body.city;
  const unit = "metric";
  const apiKey = "86317a6288c54fcd4074592b6d6c0643";
  const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + cityname + "&unit=" + unit; 
  
  https.get(url,function(response){
          statusCode = response.statusCode;
  
          response.on("data",function(data){
              const weatherData = JSON.parse(data);
              console.log(weatherData);
              const temp = Math.round(weatherData.main.temp - 273.15);
              const weatherDescription = weatherData.weather[0].description;
              const feelslike = Math.round(weatherData.main.feels_like - 273.15);
              const mintemp = Math.round(weatherData.main.temp_min - 273.15);
              const maxtemp = Math.round(weatherData.main.temp_max - 273.15);
              const pressure = weatherData.main.pressure;
              const humidity = weatherData.main.humidity;
              const icon = weatherData.weather[0].icon;
              const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
              
              res.write("<p>The weather is currently " + weatherDescription + " </p>");
              res.write("<h1>The temperature in " + cityname  +" is " + temp + " degree. But it feels like: " + feelslike + " deg.</h1>");
              res.write("<h2>The minimum temp: + " + mintemp + " and maximum temp goes upto " + maxtemp + " deg.</h2>")
              res.write("<h2> Pressure : " + pressure + " Humidity : " + humidity + "</h2>");
              res.write("<img src='" + imageURL +"' height=200 width=200>");
              res.send();
            })
      })
});

app.listen(PORT,function(){
    console.log("Server running on port 3000");
});

// Following API gives 5 days weather forecast free
// https://api.openweathermap.org/data/2.5/forecast?&appid=86317a6288c54fcd4074592b6d6c0643&q=bangalore

// https://api.openweathermap.org/data/2.5/forecast?&appid=86317a6288c54fcd4074592b6d6c0643&q=bangalore&cnt=16
// cnt parameter => list no days
//bacically we see how to use api in node js
//1
const http=require('http');
const port=process.env.PORT || 8000;
const fs=require('fs');
//requests is npm module .first we make package.json file and then install requests module
var requests=require('requests');
const homeFile=fs.readFileSync('server/index.html','utf-8');
const replaceVal=(tempVal,orgVal)=>{
        let temperature=tempVal.replace('{%tempval%}' , (orgVal.main.temp-273).toFixed(2));
         temperature=temperature.replace('{%tempmin%}' , (orgVal.main.temp_min-273).toFixed(2));
         temperature=temperature.replace('{%tempmax%}' , (orgVal.main.temp_max-273).toFixed(2));
         temperature=temperature.replace('{%location%}' , orgVal.name);
         temperature=temperature.replace('{%country%}' , orgVal.sys.country);
         temperature=temperature.replace('{%tempstatus%}' , orgVal.weather[0].main);
        return temperature;
       
};
//2
//create server then pass callback function of routing
const server=http.createServer((req,res)=>{
    if(req.url=="/")
        {
        requests(
                  "http://api.openweathermap.org/data/2.5/weather?q=varanasi%20&appid=159fe93c64cddddaea83344a068995f0"
                )
                //data is a event data come chunk by chunk
                .on('data',(chunk)=>{ 
                    const objdata=JSON.parse(chunk);
                    const arrData=[objdata];
                    //change into objectdata into array data for accessing data
                    // console.log(arrData);
                    const realTimeData=arrData
                      .map((val)=>replaceVal(homeFile,val))
                      .join("");//data founded in string manner so use join for change in array manner
                        
                   res.write(realTimeData);
                 })
                .on('end',(err)=>{
                   if(err)
                      return console.log("connection closed due to error",err);
                      res.end();
                });
            }  
        
} );
server.listen(port,()=>{
  console.log(`server port is ${port}`);
});


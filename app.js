//jshint esversion:6
const mailchimp=require("@mailchimp/mailchimp_marketing");
const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const app=express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("Public"));
app.get("/",function(req,res)
{
   res.sendFile(__dirname + "/signup.html");
});
mailchimp.setConfig(
{
    apikey:"673b7806a1b6cb918198eda30c17872c-us21",
    server: "us21"
});
app.post("/",function(req,res)
{
    const firstname=req.body.fname;
    const lastname=req.body.lname;
    const Email=req.body.email;
    const data=
    {
        members:
        [{
            email_address: Email,
            status: "subscribed",
            merge_fields: 
            {
                FNAME: firstname,
                LNAME: lastname
            }
        }]
    };
    const JSONData=JSON.stringify(data); 
    const url="https://us21.api.mailchimp.com/3.0/lists/0e2b282455";
    const options=
    {
        method: "post",
        auth: "Udit Gaur:673b7806a1b6cb918198eda30c17872c-us21"
    }
    const request=https.request(url,options,function(response)
    {
        if (response.statusCode===200)
        {
            res.sendFile(__dirname + "/success.html");
        }
        else
        {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",function(data)
        {
            console.log(JSON.parse(data));
        })
    });
    request.write(JSONData);
    request.end();
});
app.post("/failure",function(req,res)
{
    res.redirect("/");
});
app.listen(process.env.PORT || 3000,function(req,res)
{
    console.log("Server started at port 3000.");
});
//list_id : 0e2b282455
//appid : 673b7806a1b6cb918198eda30c17872c-us21
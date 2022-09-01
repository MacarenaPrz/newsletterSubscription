const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
//Ruta home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

//Ruta Post
app.post('/', (req, res)=> {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: nombre,
                    LNAME: apellido
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data);

    //Url Mailchimp
    const url = "https://us12.api.mailchimp.com/3.0/lists/cbb313a243"

    const options = {
        method: "POST",
        auth: "maki:6bef34784e0b5d5342fcb31234f5673a-us12"
    };
    //Request
    const request = https.request(url, options, (response) =>{
        
        if (response.statusCode === 200){
            res.sendFile(__dirname + '/success.html')
        } else {
            res.sendFile(__dirname + '/failures.html')
        }
        
        response.on('data', (data) =>{
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});


//Failures post
app.post('/failures', (req, res) =>{
    res.redirect('/')
});


app.listen(process.env.PORT || 3000, () =>{
    console.log('Server is running on port 3000');
});

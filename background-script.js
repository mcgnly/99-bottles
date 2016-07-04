import relayrSDK, {
    device
}
from './relayr-browser-sdk/dist/relayr-browser-sdk.min.js';


//connect to cloud
const RELAYR = relayrSDK;
let whichBeer;
let weight;
//define beer attributes
let beer1 = {
    brand: "Tannenzapfle",
    grPer: 7
}

let beer2 = {
    brand: "Franziskaner",
    grPer: 12
}


//init gives the api enough information to link this code to a specific project on the relayr cloud
RELAYR.init({
    // this comes from the api key page on the dashboard
    //it is important that these be called exactly  "redirectURI" and "id" 
    id: "1f1c57ee-0b3d-4ecd-9cce-df45ead579f3",
    // this identifies my website as a 'trusted user' basically- it expects me to show up and ask for access to stuff
    redirectURI: "http://localhost:3000/dist/webpage.html"
});

//authorizing redirects you to log in, and returns the current user, whose devices and other things you can then interact with
//TODO login, gets you back currentuser, who has an ajax
RELAYR.authorize().then((currentUser) => {

    //set up the device instance
    let scale = new device({
        id: "2996ef5d-a175-4e35-af6d-ba2adac454d5"
    }, {
        ajax: currentUser.ajax
    });


    //     // figure out which beer to use
    scale.getReadings().then((response) => {
        console.log("units", response.readings[3]);
        console.log("name", response.readings[0]);

        //readings[0] is the rfid, [1] is ths weight
        //figure out which beer we're working with
        if (response.readings[0].value === "Bugs") {
            whichBeer = beer1;
        } else {
            whichBeer = beer2;
        }

        //inserts into html
        $(".beer-type").text(whichBeer.brand);

        // calibrates scale to a beer type
        // let scalingFactor = whichBeer.grPer;
        // let boxTare = 37;

        scale.connect().then((connection) => {            
            connection.on('data', (data) => {
                if (data.readings[0].meaning === "weight") {

                    console.log(data.readings[0].value);
                    let bottleCount = data.readings[0].value;
                    $(".beers-left").text(bottleCount);
                }
            });
        });
        // let bottleCount = response.readings[2].value
        // Math.floor(((response.readings[1].value) - boxTare) / scalingFactor);
        // if (bottleCount < 0) {
        //     bottleCount = 0;
        // }
        //inserts into html

    }).catch((err) => {
        //informs you if something went wrong
        console.log(err);
    });

});
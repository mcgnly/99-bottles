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
    grPer: 2
}

let beer2 = {
    brand: "Franziskaner",
    grPer: 3
}


//init gives the api enough information to link this code to a specific project on the relayr cloud
RELAYR.init({
    // this comes from the api key page on the dashboard
    //it is important that these be called exactly  "redirectURI" and "id" 
    id: "yourIdHere",
    // this identifies my website as a 'trusted user' basically- it expects me to show up and ask for access to stuff
    redirectURI: "http://localhost:3000/dist/webpage.html"
});

//authorizing redirects you to log in, and returns the current user, whose devices and other things you can then interact with
//TODO login, gets you back currentuser, who has an ajax
RELAYR.authorize().then((currentUser) => {

    //set up the device instance
    let scale = new device({
        id: "yourDeviceIdHere"
    }, {
        ajax: currentUser.ajax
    });


    //     // figure out which beer to use
    scale.getReadings().then((response) => {

        //readings[0] is the rfid, [1] is ths weight
        //figure out which beer we're working with
        if (response.readings[1].value === "abcdefg") {
            whichBeer = beer1;
        } else {
            whichBeer = beer2;
        }

        //inserts into html
        $(".beer-type").text(whichBeer.brand);

        // calibrates scale to a beer type
        let scalingFactor = whichBeer.grPer;
        let bottleCount = Math.floor((response.readings[0].value) / scalingFactor);
        //inserts into html
        $(".beers-left").text(bottleCount);

    }).catch((err) => {
        //informs you if something went wrong
        console.log(err);
    });

});
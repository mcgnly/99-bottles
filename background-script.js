import relayrSDK, {
    device
}
from './relayr-browser-sdk/dist/relayr-browser-sdk.min.js';


//connect to cloud
const RELAYR = relayrSDK;

//init gives the api enough information to link this code to a specific project on the relayr cloud
RELAYR.init({
    // this comes from the api key page on the dashboard
    //it is important that these be called exactly  "redirectURI" and "id" 
    //TODO figure out how to get sensitive data back into a seperate file 
    id: "",
    // this identifies my website as a 'trusted user' basically- it expects me to show up and ask for access to stuff
    redirectURI: "http://localhost:3000/dist/webpage.html"
});

//authorizing redirects you to log in, and returns the current user, whose devices and other things you can then interact with
RELAYR.authorize().then((currentUser) => {

    //USER THINGS
    //TODO is it better to use this to keep the promise structure consistent, or just get the email property directly from the currentUser?
    currentUser.getUserInfo().then((response) => {
        //inject this text into the html
        $(".users").text(response.email);
    }).catch((err) => {
        console.log(err);
    });

    //DEVICE THINGS
    currentUser.getMyDevices().then((response) => {
        //inject this text into the html
        let allDevices = response;
        // tack the object[index].name on to the list displayed in the html
        response.forEach((x) => {
            $('<ul>').text(x.name).appendTo('.devices');
        });

        //now that we have the list of devices, we can display the data from the first two
        //set up the device instance

        let deviceInstance1 = new device({
            id: allDevices[0].id
        }, {
            ajax: currentUser.ajax
        });
        // this gets the data from the device
        deviceInstance1.getReadings().then((dev1) => {
            //inserts into html
            $(".reading1").text(dev1.readings[0].value);
        }).catch((err) => {
            //informs you if something went wrong
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });

    currentUser.getMyGroups().then((response) => {
        //inject this text into the html
        // loops through the object holding the devices, x gives you an index
        response.forEach((x) => {
            // tack the object[index].name on to the list displayed in the html
            $('<ul>').text(x.name).appendTo('.groups');
        });
    }).catch((err) => {
        console.log(err)
    });

    //TRANSMITTER THINGS
    currentUser.getMyTransmitters().then((response) => {
        let allTransmitters = response;
        // loops through the object holding the devices, x gives you an index
        response.forEach((x) => {
            // tack the object[index].name on to the list displayed in the html
            $('<ul>').text(x.name + " : " + x.id).appendTo('.transmitterlist');
        });

        //set up the transmitter instance
        let transmitterInstance = new transmitter({
            id: allTransmitters[0].id,
            ajax: currentUser.ajax
        });

        $("#delete").click(function() {
            //delete the first transmitter in the list
            transmitterInstance.deleteTransmitter().then(() => {
                document.location.reload(true);
            }).catch((err) => {
                //informs you if something went wrong
                console.log(err);
            });
        });


        $("#updateName").click(() => {
            // update the first transmitter in the list
            let patchBody = {
                name: $('.status-box').val()
            };
            transmitterInstance.updateTransmitter(patchBody).then((res) => {
                document.location.reload(true);
            }).catch((err) => {
                //informs you if something went wrong
                console.log(err);
            });
        });
    }).catch((err) => {
        console.log(err)
    });




});
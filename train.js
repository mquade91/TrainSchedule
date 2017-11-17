/* global firebase moment */


// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the time until next train arrives. Using difference between start time/how often it runs/current time.
//     (use moment.js formatting).


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCfnWdY4Y_92m_yQXrueD4PZZKIQUIunv0",
    authDomain: "trainschedule-7aca6.firebaseapp.com",
    databaseURL: "https://trainschedule-7aca6.firebaseio.com",
    projectId: "trainschedule-7aca6",
    storageBucket: "trainschedule-7aca6.appspot.com",
    messagingSenderId: "1004553429487"
};
firebase.initializeApp(config);


var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    var trainStart = $("#start-input").val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        newName: trainName,
        newDestination: destination,
        start: trainStart,
        newFrequency: frequency
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);

    // // Logs everything to console
    // console.log(newTrain.newName);
    // console.log(newTrain.newDestination);
    // console.log(newTrain.newFrequency);
    // console.log(newTrain.start);

    // // Alert
    // alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {


    // Store everything into a variable.
    var dbName = childSnapshot.val().newName;
    var trainPlace = childSnapshot.val().newDestination;
    var dbFrequency = childSnapshot.val().newFrequency;
    var dbStart = childSnapshot.val().start;

    // Train Info
    console.log(dbName);
    console.log(trainPlace);
    console.log("dbStart: " + dbStart);
    console.log(dbFrequency);


    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(dbStart, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    //  Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % dbFrequency;
    console.log(tRemainder);

    //  Minutes Until Train
    var tMinutesTillTrain = dbFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    var nextTrainHTML = moment(nextTrain).format("hh:mm");

    // Add each train's data into the table
    $("#employee-table > tbody").append("<tr><td>" + dbName + "</td><td>" + trainPlace + "</td><td>" +
        dbFrequency + "</td><td>" + nextTrainHTML + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});


// // -----------------------------------------------------------------------------
// // Assume Employee start date of January 1, 2015
// // Assume current date is March 1, 2016

// // We know that this is 15 months.
// // Now we will create code in moment.js to confirm that any attempt we use mets this test case

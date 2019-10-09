const five = require("johnny-five");
const board = new five.Board({ repl: false });
const app = require('express')()
const http = require('http').Server(app);
var moment = require('moment')
const io = require('socket.io')(http);
// var PubNub = require('pubnub');

var lights =
    [{
        name: "light",
        id: "l01",
        grade: 12,
        room: 1, roomName: "Kitchen",


        radius: Number,

        data: [{
            date: "10/08/2019",
            energy: Number,
            stroke: [],
            offset: [],
            timeSeries:

                [
                    { hour: "00.00", on: false, bad: false },
                    { hour: "09.00", on: true, bad: false },
                    { hour: "10.00", on: false, bad: false },
                    { hour: "10.45", on: false, bad: true },

                ]
        }
        ]
    },

    {
        name: "light",
        id: "l022",
        room: 2, roomName: "Living Room",

        grade: 60,
        radius: Number,

        data: [{
            date: "10/08/2019",
            energy: Number,
            stroke: [],
            offset: [],
            radius: Number,
            timeSeries:

                [
                    { hour: "00.00", on: false, bad: false },
                    { hour: "06.00", on: false, bad: false },
                    { hour: "07.00", on: false, bad: true },
                    { hour: "08.00", on: false, bad: false },
                    { hour: "10.00", on: false, bad: false },
                    { hour: "10.15", on: false, bad: false },


                ]
        }
        ]
    },
    {
        name: "light",
        id: "l03",
        room: 3, roomName: "Bathroom",

        grade: 20,
        radius: Number,

        data: [{
            date: "10/08/2019",
            energy: Number,
            stroke: [],
            offset: [],
            timeSeries:

                [
                    { hour: "00.00", on: false, bad: false },
                    { hour: "08.00", on: true, bad: true },

                ]
        }
        ]
    },
    {
        name: "light",
        id: "l04",
        room: 4, roomName: "Hall",

        grade: 60,
        radius: Number,

        data: [{
            date: "10/08/2019",
            energy: Number,
            stroke: [],
            offset: [],
            radius: Number,
            timeSeries:

                [
                    { hour: "00.00", on: false, bad: false },
                    { hour: "09.00", on: true, bad: false },



                ]
        }
        ]
    },


    ];
var dish =
    [{
        name: "dish",
        id: "d01",
        grade: 1800,
        water: 20,
        week: Number,
        room: 1, roomName: "Kitchen",

        radius: Number,

        data: [{
            date: "10/08/2019",
            energy: Number,
            freq: Number,
            stroke: [],
            offset: [],
            radius: Number,
            timeSeries:

                [
                    { hour: "00.00", on: false, bad: false },
                    { hour: "08.00", on: false, bad: false },

                    { hour: "09.00", on: false, bad: false },
                    { hour: "10:30", on: true, bad: false },

                    // { hour: "13.00", on: true, bad: false },
                    // { hour: "16.00", on: false, bad: true },
                    // { hour: "18.00", on: false, bad: false },
                ]
        }
        ]
    }];
var wash =
    [{
        name: "washer",
        id: "w01",
        grade: 500,
        water: 20,
        room: 1, roomName: "Kitchen",

        radius: Number,

        data: [{
            date: "10/08/2019",
            energy: Number,
            stroke: [],
            offset: [],
            radius: Number,
            timeSeries:

                [
                    { hour: "00.00", on: false, bad: false },
                    { hour: "06.30", on: false, bad: true },
                    { hour: "06.45", on: true, bad: true },

                    { hour: "08.45", on: false, bad: true },
                    { hour: "09:30", on: false, bad: false },

                    // { hour: "13.00", on: true, bad: false },
                    // { hour: "16.00", on: false, bad: true },
                    // { hour: "18.00", on: false, bad: false },
                ]
        }
        ]
    }];
var blender = [];
// [{
//     name: "blender",
//     id: "b01",
//     grade: 60,
//     room: 1, roomName: "Kitchen",

//     radius: Number,

//     data: [{
//         date: "10/08/2019",
//         energy: Number,
//         stroke: [],
//         offset: [],
//         radius: Number,
//         timeSeries:

//             [
//                 { hour: "00.00", on: false, bad: true },
//                 { hour: "09.00", on: false, bad: true },
//                 //     { hour: "13.00", on: true, bad: false },
//                 //     { hour: "13.05", on: false, bad: false },

//                 //     { hour: "16.00", on: false, bad: true },
//                 //     { hour: "18.00", on: false, bad: false },
//             ]
//     }
//     ]
// }];
var kettle =
    [{
        name: "kettle",
        id: "k01",
        grade: 2200,
        room: 1, roomName: "Kitchen",
        radius: Number,

        data: [{
            date: "10/08/2019",
            energy: Number,
            stroke: [],
            offset: [],
            radius: Number,
            timeSeries:

                [
                    { hour: "00.00", on: false, bad: false },
                    { hour: "09.45", on: true, bad: false },
                    { hour: "10.00", on: false, bad: false },
                    { hour: "10.45", on: false, bad: true },
                    // { hour: "13.00", on: true, bad: false },
                    // { hour: "13.05", on: false, bad: false },
                    // { hour: "16.00", on: false, bad: true },
                    // { hour: "18.00", on: false, bad: false },
                ]
        }
        ]
    }];
var toaster = []
// [{
//     name: "toaster",
//     id: "t1",
//     grade: 1000,
//     room: 1, roomName: "Kitchen",
//     radius: Number,

//     data: [{
//         date: "10/08/2019",
//         energy: Number,
//         stroke: [],
//         offset: [],
//         radius: Number,
//         timeSeries:

//             [
//                 { hour: "00.00", on: false, bad: false },
//                 { hour: "06.00", on: true, bad: false },
//                 { hour: "06.05", on: true, bad: true },
//                 // { hour: "16.00", on: false, bad: true },
//                 // { hour: "18.00", on: false, bad: false },
//             ]
//     }
//     ]
// }];



var tv =
    [{
        name: "tv",
        room: 2, roomName: "Living Room",
        grade: 80,
        id: "tv01",
        radius: Number,

        data: [{
            date: "10/08/2019",
            energy: Number,
            stroke: [],
            offset: [],
            radius: Number,
            timeSeries:

                [
                    { hour: "00.00", on: false, bad: false },
                    { hour: "06.00", on: true, bad: false },
                    { hour: "07.00", on: true, bad: true },
                    { hour: "08.00", on: false, bad: false },
                    { hour: "10.00", on: false, bad: false },
                    { hour: "10.15", on: false, bad: false },
                    // { hour: "13.00", on: true },
                    // { hour: "13.05", on: false },

                    // { hour: "16.00", on: false },
                    // { hour: "18.00", on: false },
                ]
        }
        ]
    }];
var shower =
    [
        // {
        // name: "shower",
        // room: 2, roomName: Living Room, roomName: Living Room, roomName: Living Room,
        // id: "s01",
        // water: 60,
        // radius: Number,

        // data: [{
        //     date: "10/08/2019",
        //     energy: Number,
        //     stroke: [],
        //     offset: [],
        //     radius: Number,
        //     timeSeries:

        //         [
        //             { hour: "00.00", on: false },
        //             { hour: "09.00", on: false },
        //             // { hour: "13.00", on: true },
        //             // { hour: "13.05", on: false },

        //             // { hour: "16.00", on: false },
        //             // { hour: "18.00", on: false },
        //         ]
        // }
        // ]
        // }
    ];
var fridge = [
    {
        name: "fridge",
        id: "f01",
        room: 1, roomName: "Kitchen",

        grade: 35,
        radius: Number,

        data: [{
            date: "10/08/2019",
            energy: Number,
            stroke: [],
            offset: [],
            radius: Number,
            timeSeries:

                [
                    { hour: "00.00", on: true, bad: false },
                    // power instead
                    // { hour: "13.05", on: false },

                    // { hour: "16.00", on: false },
                    // { hour: "18.00", on: false },
                ]
        }
        ]
    },

]

var temps =
    [
        {
            name: "fan",
            id: "t02",
            room: 2, roomName: "Living Room",
            grade: 60,
            water: 20,
            radius: Number,

            data: [{
                date: "10/08/2019",
                energy: Number,
                stroke: [],
                offset: [],
                radius: Number,
                timeSeries:

                    [
                        { hour: "00.00", on: false, bad: false },
                        { hour: "06.00", on: false, bad: false },
                        { hour: "07.00", on: false, bad: true },
                        { hour: "08.00", on: false, bad: false },
                        { hour: "10.00", on: true, bad: false },
                        { hour: "10.15", on: false, bad: false },



                        // { hour: "13.00", on: true },
                        // { hour: "13.05", on: false },

                        // { hour: "16.00", on: false },
                        // { hour: "18.00", on: false },
                    ]
            }
            ]
        },
        {
            name: "temp",
            id: "t03",
            room: 2,
            roomName: "Living Room",
            grade: 600,
            water: 20,
            radius: Number,

            data: [{
                date: "10/08/2019",
                energy: Number,
                stroke: [],
                offset: [],
                radius: Number,
                timeSeries:

                    [

                        { hour: "00.00", on: false, bad: true },
                        { hour: "06.00", on: true, bad: true },
                        { hour: "06.20", on: true, bad: false },
                        { hour: "06.25", on: false, bad: true },



                        // { hour: "13.05", on: false },

                        // { hour: "16.00", on: false },
                        // { hour: "18.00", on: false },
                    ]
            }
            ]
        },
        {
            name: "temp",
            id: "t01",
            room: 1,
            roomName: "Kicthen",
            grade: 300,
            radius: Number,

            data: [{
                date: "10/08/2019",
                energy: Number,
                stroke: [],
                offset: [],
                radius: Number,
                timeSeries:

                    [
                        { hour: "00.00", on: false, bad: false },
                        { hour: "09.00", on: true, bad: false },
                        { hour: "10.00", on: false, bad: false },
                        { hour: "10.45", on: false, bad: true },



                        // { hour: "13.05", on: false },

                        // { hour: "16.00", on: false },
                        // { hour: "18.00", on: false },
                    ]
            }
            ]
        },
        {
            name: "temp",
            id: "t04",
            room: 4,
            roomName: "Hall",
            grade: 600,
            water: 20,
            radius: Number,

            data: [{
                date: "10/08/2019",
                energy: Number,
                stroke: [],
                offset: [],
                radius: Number,
                timeSeries:

                    [

                        { hour: "00.00", on: false, bad: false },
                        { hour: "06.00", on: true, bad: false },
                        { hour: "07.00", on: true, bad: true },
                        { hour: "08.00", on: false, bad: false },



                    ]
            }
            ]
        },

    ];

init();


// board.on("ready", function () {

io.on('connection', (socket) => {
    io.emit('leds', lights)
    io.emit('ket', kettle)
    io.emit('toast', toaster)
    io.emit('dish', dish)
    io.emit('wash', wash)
    io.emit('temp', temps)
    io.emit('blend', blender)
    io.emit('shower', shower)
    io.emit('tv', tv)
    io.emit('fridge', fridge)


    ///////////////////////////////////////////////////////////////////////////////
    //                        For the Hardware:
    ///////////////////////////////////////////////////////////////////////////////

    // const bathroom = new five.Led(3)
    // const kitchen = new five.Led(4)
    // const living1 = new five.Led(5)
    // const living2 = new five.Led(6)
    // const storage = new five.Led(7)
    // const motor = new five.Motor(8);







    socket.on("l01", (data) => {
        //    data ? kitchen.on() : kitchen.off(); (Hardware)

        lights[0].data[0].timeSeries.push({ hour: getTime(), on: data, bad: lights[0].data[0].timeSeries[lights[0].data[0].timeSeries.length - 1].bad })
        io.emit('leds', lights);
    })


    socket.on("l021", (data) => {
        // data ? living1.on() : living1.off()
        lights[1].data[0].timeSeries.push({ hour: getTime(), on: data, bad: lights[1].data[0].timeSeries[lights[1].data[0].timeSeries.length - 1].bad })
        io.emit('leds', lights);
    })

    socket.on("l022", (data) => {
        //data ? living2.on() : living2.off()
        lights[3].data[0].timeSeries.push({ hour: getTime(), on: data, bad: lights[3].data[0].timeSeries[lights[3].data[0].timeSeries.length - 1].bad })
        io.emit('leds', lights);

    })
    socket.on("l03", (data) => {
        //  data ? bathroom.on() : bathroom.off()
        lights[3].data[0].timeSeries.push({ hour: getTime(), on: data, bad: lights[3].data[0].timeSeries[lights[3].data[0].timeSeries.length - 1].bad })
        io.emit('leds', lights);

    })
    socket.on("l04", (data) => {

        // data ? storage.on() : storage.off()
        lights[3].data[0].timeSeries.push({ hour: getTime(), on: data, bad: lights[3].data[0].timeSeries[lights[3].data[0].timeSeries.length - 1].bad })
        io.emit('leds', lights);

    })

    socket.on("t02", (data) => {
        // data ? redLed.on() : redLed.off()
        temps[0].data[0].timeSeries.push({ hour: getTime(), on: data, bad: temps[0].data[0].timeSeries[temps[0].data[0].timeSeries.length - 1].bad })
        io.emit('temp', temps);

    })
    socket.on("t1", (data) => {
        // data ? redLed.on() : redLed.off()
        toaster[0].data[0].timeSeries.push({ hour: getTime(), on: data, bad: toaster[0].data[0].timeSeries[toaster[0].data[0].timeSeries.length - 1].bad })
        io.emit('toast', toaster);

    })
    socket.on("tv01", (data) => {
        // data ? redLed.on() : redLed.off()
        tv[0].data[0].timeSeries.push({ hour: getTime(), on: data, bad: tv[0].data[0].timeSeries[tv[0].data[0].timeSeries.length - 1].bad })
        io.emit('tv', tv);

    })
    socket.on("f01", (data) => {
        // data ? redLed.on() : redLed.off()
        fridge[0].data[0].timeSeries.push({ hour: getTime(), on: data, bad: fridge[0].data[0].timeSeries[fridge[0].data[0].timeSeries.length - 1].bad })
        io.emit('fridge', fridge);

    })
    socket.on("k01", (data) => {
        // data ? redLed.on() : redLed.off()
        kettle[0].data[0].timeSeries.push({ hour: getTime(), on: data, bad: kettle[0].data[0].timeSeries[kettle[0].data[0].timeSeries.length - 1].bad })
        io.emit('ket', kettle);

    })
    socket.on("w01", (data) => {
        //   data ? motor.start() : motor.stop();

        // data ? redLed.on() : redLed.off()
        wash[0].data[0].timeSeries.push({ hour: getTime(), on: data, bad: wash[0].data[0].timeSeries[wash[0].data[0].timeSeries.length - 1].bad })
        io.emit('wash', wash);

    })
    socket.on("d01", (data) => {
        // data ? redLed.on() : redLed.off()
        dish[0].data[0].timeSeries.push({ hour: getTime(), on: data, bad: dish[0].data[0].timeSeries[dish[0].data[0].timeSeries.length - 1].bad })
        io.emit('dish', dish);

    })

})



//});
// lights.data[0][light.data[0].length - 1]


//Began to write a function that resets the data every 12 hours and pushed the old data into the next place in the array
function init() {
    setTimeout(
        atMidnight, moment("12:00:00", "hh:mm:ss").diff(moment(), 'seconds')
    );
    // setTimeout(
    //     atMidnight, moment("12:00:00", "hh:mm:ss").diff(moment(), 'seconds')
    // );

}

function getTime() {
    const today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes()
    if (hours.length == 1) {
        hours = "0" + hours
    }
    if (minutes.length == 1) {
        hours = "0" + hours
    }
    return hours + ":" + minutes;

}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function atMidnight() {

    // lights.forEach(light => {
    //     var newObject = clone(light.data[0][light.data[0].length - 1]);
    //     var endOf = clone(light.data[0].timeSeries[light.data[0].timeSeries.length - 1]);
    //     endOf.hour = "12:00";
    //     light.data[0].push(endOf);

    //     newObject.hour = "00.00"

    //     newArray = [newObject];

    //     var addArray = [newArray].concat(light.data);
    //     light.data = addArray;

    // })


}

// let newDay = [3, 2, 1]
// const newFirstElement = 4




// io.on('connection', function (socket) {
// 	var strData;
//Instantiate a new Pubnub instance along with the subscribeKey 

//adding listener to pubnub
//     pubnub.addListener({
//         message: function(message) {
// /*checking whether the message contains data for the ‘Apple’ category or not.*/
//         	if(message.message.symbol=='Apple'){
//                         /*Creates a new date object from the specified message.timestamp.*/ 
//         		var x = new Date(message.message.timestamp);
// //Converting the timestamp into a desired format. HH:MM:SS:MS
// 		var formatted =  (x.getHours()) + ':' + (x.getMinutes()) + ':' + (x.getSeconds()) + ':' + (x.getMilliseconds());
//                        /*Here we are creating an object which will contain a timestamp as label and the ‘order_quantity’ as value.*/
//         		strData = {"label": formatted,
// 						   "value":message.message.order_quantity
// 						}
//                                                //sending data to the client
// 				socket.emit('news', strData);
//         	};  
//         }
//     })      
//     console.log("Subscribing..");
// //Subscribe the PubNub channel
//     pubnub.subscribe({
//         channels: ['pubnub-market-orders'] 
//     });
// });



http.listen(3001, function () {
    console.log('listening on *:3001');
});


// const mongo = require('mongodb').MongoClient;
// const client = require('socket.io').listen(4000).sockets;

// // Connect to mongo
// mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
//     if(err){
//         throw err;
//     }

//     console.log('MongoDB connected...');

//     // Connect to Socket.io
//     client.on('connection', function(socket){
//         let chat = db.collection('chats');

//         // Create function to send status
//         sendStatus = function(s){
//             socket.emit('status', s);
//         }

//         // Get chats from mongo collection
//         chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
//             if(err){
//                 throw err;
//             }

//             // Emit the messages
//             socket.emit('output', res);
//         });

//         // Handle input events
//         socket.on('input', function(data){
//             let name = data.name;
//             let message = data.message;

//             // Check for name and message
//             if(name == '' || message == ''){
//                 // Send error status
//                 sendStatus('Please enter a name and message');
//             } else {
//                 // Insert message
//                 chat.insert({name: name, message: message}, function(){
//                     client.emit('output', [data]);

//                     // Send status object
//                     sendStatus({
//                         message: 'Message sent',
//                         clear: true
//                     });
//                 });
//             }
//         });

//         // Handle clear
//         socket.on('clear', function(data){
//             // Remove all chats from collection
//             chat.remove({}, function(){
//                 // Emit cleared
//                 socket.emit('cleared');
//             });
//         });
//     });
// });


// https://github.com/mongodb/node-mongodb-native
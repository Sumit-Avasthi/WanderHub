const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initdata = require("./data.js");

main().then(()=>{
    console.log("Database Connect");
}).catch(()=>{
    console.log("Data Base Connection error");
});


async function main(){
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


const intiDB = async ()=>{
    await listing.deleteMany({});
    initdata.data = await initdata.data.map((object)=>({...object,owner : "68f36b18f0232236b8901948"}));
    await listing.insertMany(initdata.data);
    console.log("Data intitialized");
}

intiDB();
var mongoose    = require("mongoose");
var Schema      = mongoose.Schema;
mongoose.connect('mongodb://rajmeena:rajkumar@ds211289.mlab.com:11289/hackathon');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected to database");
});



var UserSchema = new Schema({
    teamName: { type: String, required: true, unique: true },
    teamMember: { type: String, lowercase: true, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    submitted: { type: Number, required: true, default: 0 },
    activate: { type: Number, required: true, default: 0 },
    time : { type : Date, default: Date.now },
    member:[{
	    firstname: { type: String},
	    lastname: { type: String},
	    mobileno: { type: String},
    }],
   password: { type: String},
   form:{
		describe: { type: String},
		databases: { type: String},
		benefits: { type: String},
		application: { type: String},
		challenge: { type: String},
		dapp: { type: String},
		youtubeLink: { type: String}
   }
});


module.exports = mongoose.model('User', UserSchema);

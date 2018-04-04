var express = require("express");
var app = express();
var router = express.Router();
var User = require("../models/user");


var jwt = require('jsonwebtoken');
const secret = 'rajubhai';


var randomize = require('randomatic');
var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Email',
    pass: 'Password'
  }
});


router.post('/register',function(req,res){
	var user = new User();


	user.teamName = req.body.teamName;
	user.teamMember = req.body.teamMember;
	user.email = req.body.email;
	user.submitted = 0;
	user.activate = 0;

	user.member=[]
	
	for(let i=0;i<req.body.teamMember;i++){
		user.member[i]={};
		user.member[i]["firstname"] = req.body.firstname[i]
		user.member[i].lastname =  req.body.lastname[i]
		user.member[i].mobileno =  req.body.mobileno[i]
	}


	var passkey = randomize('Aa0', 10);;
	user.password = passkey;


	var mailOptions = {
	  from: "raj.exploreindia@gmail.com",
	  to: req.body.email,
	  subject: 'ILedger : Registration in hackathon',
	  html: '<p>Hi, </p><br><p>Greetign from Iledger.You have registerd Successfully.<p><br><p>please use this key as password for login : '+passkey
	};

	user.save(function(err){
	    if (err){
		console.log(err);
	    	if(err.code==11000){
	    		if(err.errmsg.includes("hackathon.users.$teamName_1")){
					return res.json({success:false,message:"Team name already exists"});	    			    			
	    		}
	    		else if(err.errmsg.includes("hackathon.users.$email_1")){
					return res.json({success:false,message:"Email id already registered.Check your email"});	    			    			
	    		}else{
					return res.json({success:false,message:err.errmsg});	    			
	    		}
	    	}else{
				return res.json({success:false,message:"Some internal error"});    			    		
	    	}
	    }else{
	    	transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
			  	user.remove({email:req.body.email},function(err){
			  		if(err){
			  			console.log(err);
						return res.json({success:true,message:"Some Error occured"});		    							    	
			  		}else{
						return res.json({success:true,message:"Mail can't be send due to some error.Please register after some time"});		    							    				  			
			  		}
			  	})
			  } else {
				return res.json({success:true,message:"User registered Successfully...Check your registered mail to activate account"});		    							    	
			  }
			});
		}
	});
});

router.post('/authenticate',function(req,res){
	var user = {};
	user.email = req.body.email;
	user.password = req.body.password;

	if(req.body.email==null||req.body.password==null){
		return res.json({success:false,message:"provide email and password"});
	}

	else{
		User.findOne({"email":req.body.email}).select('password submitted').exec(function(err,user){
			if(err){
				res.send("err");
			}
			else if(!user){
				res.json({'success':false,'message':"Couldn't authenticate user"});
			}else if(user){
				if(user.submitted==1){
					return res.json({success:false,message:"You have already submitted the form, Check your mail"});
				}
				if(user.password==req.body.password){
                    var token =	jwt.sign({email:req.body.email}, secret, { expiresIn: '24h' });
					return res.json({success:true,message:"Successfully logging",token:token});		    				    					
				}
				else{
					return res.json({success:false,message:"Wrong password"});    				    		
				}
			}
		});
	}
});

router.post('/profile',function(req,res){

	var token = req.body.token||req.query.token||req.headers['x-access-token'];

	decodedata = jwt.decode(token);

	User.findOne({"email":decodedata.email}).select('teamName teamMember member email submitted').exec(function(err,user){
	    if (err){
			res.json({success:false,message:err});
	    }else{
			return res.json({success:true,message:"usersdata",data:user});    		
	    }
	});
});


router.post('/formdata',function(req,res){
	var usersNumber = 0;
	var token = req.body.token||req.query.token||req.headers['x-access-token'];

	decodedata = jwt.decode(token);

	if(decodedata.email!="yamin@endureair.com"){
		return res.json({success:false,message:"User not allowed"});
	}

	User.find({},{ "password" :false }).exec(function(err, result) {
		if (err){
				res.json({success:false,message:err});
	    }else{
			usersNumber = result.length;
			userSubmitted = 0;
			for(let i=0;i<usersNumber;i++){
				if(result[i].submitted==1){
					userSubmitted=userSubmitted+1
				}
			}
			return res.json({success:false,message:result,usersNumber:usersNumber,userSubmitted:userSubmitted});
	    }
	});
});


//submit form here
router.post('/user',function(req,res){
	var userform={};


	userform.form ={};
	userform.form.describe = req.body.describe
	userform.form.databases = req.body.databases
	userform.form.benefits = req.body.benefits
	userform.form.application = req.body.application
	userform.form.challenge = req.body.challenge
	userform.form.dapp = req.body.dapp
	userform.form.youtubeLink = req.body.youtubeLink
	userform.submitted = 1


	if(req.body.benefits==null||req.body.application==null||req.body.challenge==null||req.body.dapp==null){
        return res.json({success:false,message:'Provide required fields'});
	}

	decodedata = jwt.decode(req.body.token);
    var query  = {email:decodedata.email};


	var mailOptions = {
	  from: "raj.exploreindia@gmail.com",
	  to: decodedata.email,
	  subject: 'ILedger : hackathon form submission',
	  html: '<p>Hi, </p><br><p>Greetign from Iledger.You have submitted your form Successfully and copy of your answers is also show in below table.</p><br><h2></h2><table style="border: 1px solid black;"><tr style="border: 1px solid black;"><th>Problem Statement, please describe what problem are you targeting to solve</th><th>Can we solve it with databases?</th><th>If yes, benefits of using blockchain vs database.</th><th>Does it slows down the application compared to databases?</th><th>How does the DAPP solve this?</th><th>Describe the most challenging part of your project implementation</th><th>ou tube link of the demo of the project</th></tr><tr style="border: 1px solid black;"><td style="border: 1px solid black;" >'+req.body.describe+'</td><td style="border: 1px solid black;" >'+req.body.databases+'</td><td style="border: 1px solid black;" >'+req.body.benefits+'</td><td style="border: 1px solid black;" >'+req.body.application+'</td><td style="border: 1px solid black;" >'+req.body.dapp+'</td><td style="border: 1px solid black;" >'+req.body.challenge+'</td><td style="border: 1px solid black;" >'+req.body.youtubeLink+'</td>'
	};
		

    if(decodedata.email==null){
        return res.json({success:false,message:'You are not authorized to submit form'});    	
    }


	User.findOne({"email":decodedata.email}).select('submitted').exec(function(err,user){
	    if (err){
			res.json({success:false,message:err});
	    }else{
	    	if(user.submitted==1){
				return res.json({success:false,message:"You have already submitted the form"});		    		
	    	}
	    	else{
    		    User.findOneAndUpdate({email:decodedata.email}, { "$set":{form:userform.form,submitted:1}}) .exec(function (err, user) {
				    if (err){
						return res.json({success:false,message:"Some error occured while submitting form"});		    		
				    }else{
				    	transporter.sendMail(mailOptions, function(error, info){
						  if (error) {
							return res.json({success:true,message:"Form submitted Successfully...Mail can't be send due to some error"});		    							    	
						  } else {
							return res.json({success:true,message:"Form submitted Successfully...Mail sent to registered email id"});		    							    	
						  }
						});
				    }
				});

	    	}
		}
	});		    		
});


//middleware for token
router.use(function(req,res,next){
    var token = req.body.token||req.query.token||req.headers['x-access-token'];

    if(token){
        jwt.verify(token,secret,function(err,decoded){
            if(err){
                res.json({success:false,message:'Token Invalid'});
            }else{
                req.decoded = decoded;
                next();
            }
        });
    }else{
        res.json({success:false,message:'No token provided'});
    }
});

//decrypt data from token
router.post('/me',function(req,res){
	res.send(req.decoded);
});


module.exports = router;

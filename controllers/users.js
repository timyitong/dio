module.exports = function(app, models){
	var ObjectId=app.mongoose.Types.ObjectId;
	
	//SIGNUP user:
	app.get('/signup',function(req,res){
		res.render('signup',{message:"Welcome to AliJoJo"})
	})
	app.post('/api/signup', function (req,res){
	  if (req.body.password!=req.body.password2)
	  	return res.render('signup.jade',{message:"Password not the same"})

	  var user
	  var salt = app.bcrypt.genSaltSync(10);
	  var hash = app.bcrypt.hashSync(req.body.password, salt);
	  user= new models.UserModel({
	    email: req.body.email,
	    name: req.body.name,
	    password: hash,
	    avatar:"/images/default_avatar.gif"
	  })
	  user.save(function (err){
	    if (!err){
	      req.session.uid=user._id
	      return res.redirect(app.__SITE__)
		}
	    else
	      return res.render('signup.jade',{message:"An error occurred during signing up."})
	  })
	  
	})

	//LOGIN user:
	app.post('/api/signin',function (req,res){
	  return models.UserModel.findOne({email:req.body.email},function(err,user){
	    if (!err){
	      if (user==undefined)
	      	return console.log("Not found this user")
	      else if (app.bcrypt.compareSync(req.body.password,user.password)==true){
	        req.session.uid=user._id
	        if(req.body.signin_option=="on")
	        {	res.cookie('uid',user._id,{secret:'sec2',maxAge:365*24*60*60*1000})
	    		//req.cookies.uid=user._id
	        }else
	        	req.cookies.uid=undefined
	        return res.redirect(app.__SITE__)
	      }
	      else
	        return console.log('Password Not Matched')
	      return res.send(user)
	    }else
	      return console.log(err)
	  })
	})
	app.get('/signin',function(req,res){
		return res.render('signin')
	})
	//Logout user:
	app.get('/api/signout',function(req,res){
		req.session.uid=undefined
		req.cookies.uid=undefined
		res.cookie('uid',undefined)
		res.redirect(app.__SITE__+'/signin')
	})



	//GET a user_profile:
	app.get('/api/profile',function(req,res){
		models.UserModel.findOne({_id:req.session.uid},function(err,user){
			if(!err){
				models.RatingPairModel.find({user_id:user._id},function(err,pairs){
					var profile={
						_id:user._id,
						avatar:user.avatar,
						name:user.name,
						email:user.email,
						ratings:pairs
					}
					res.send(profile)
				})
			}else{
				res.send("error")
			}
		})
	})
	//GET users
	app.get('/api/users',function(req,res){
	  return models.UserModel.find().exec(function (err, users){
	    if (!err){
	      res.header("Access-Control-Allow-Origin","*")
	      return res.send(users)
	    }else
	      return console.log(err)
	  })
	})
	//SET AVATAR
	app.post('/api/set_avatar',function(req,res){
		var path=req.files.set_avatar.path
		var old_name=req.files.set_avatar.name
		var avatar=rename_image(path,old_name,"avatars",40)
		console.log(req.body.redirect_to)
		models.UserModel.update(
			{_id:req.session.uid},
			{$set:
			  {avatar:avatar}
			},
			{upsert:true},
			function(err,matchNum){
				if (err)
					console.log(err)
				else
					res.redirect(req.body.redirect_to)
			}
		)
	})
}
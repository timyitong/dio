module.exports = function(app, models){
	var ObjectId=app.mongoose.Types.ObjectId;
	//index:
	app.get('/', authenticate, function (req,res){
		models.CategoryModel.find().sort("field").exec(function(err,tags){
			var data={}
			data.tags=tags
			models.FieldModel.find().sort("name").exec(function(err,fields){
				data.fields=fields
				render(req,res,'index.jade',data)
			})
		})
	})

	//users controller:
	require('./controllers/users')(app, models)

	function render(req,res,template,data){
		models.UserModel.findOne({_id:req.session.uid},function(err,user){
			if(data==undefined)
				data={}
			data.user=user
			res.render(template,data)
		})
	}
	//authenticate define:
	function authenticate(req,res,next){
	  var isAuthenticated
	  if (req.cookies.uid!=undefined && req.cookies.uid!="undefined")
	  	req.session.uid=req.cookies.uid

	  if (req.session.uid==undefined)
	  	 isAuthenticated=false
	  else
	  	 isAuthenticated=true

	  if (isAuthenticated){
	    next();
	  }
	  else{
	    res.redirect(app.__SITE__+'/signin')
	  }
	}

	//test GET:
	app.get('/api',function(req,res){
	    res.send('Dio API: '+req.ip)
	})
	//Admin GET:
	app.get('/admin',authenticate,function(req,res){
		render(req,res,'admin.jade')
	})

	app.post('/field',function(req,res){
		var field=new models.FieldModel({
			name: req.body.name
		})
		field.save(function (err){

		})
		res.redirect(app.__SITE__+'/new_category')
	})
	//Category/tag:
	app.get('/new_category',authenticate,function(req,res){
		var data
		models.CategoryModel.find().sort("name").exec(function(err,tags){
			if(!err){
			var data={}
			data.tags=tags
				models.FieldModel.find().sort("name").exec(function(err,fields){
					data.fields=fields
					console.log(fields)
					render(req,res,'new.category.jade',data)
				})
			}else{
				console.log(err)
			}
		})
	})
	app.post('/category',authenticate,function(req,res){
		var cat=new models.CategoryModel({
			name: 		req.body.name,
			nametree: 	req.body.nametree,
			idtree: 	req.body.idtree,
			field: req.body.field
		})
		cat.save( function (err){

		})
		res.redirect(app.__SITE__+'/new_category')
	})
	app.delete('/api/category/:id',authenticate,function(req,res){
		models.CategoryModel.findOne({_id:req.params.id},function(err,tag){
			tag.remove(function(err){
				if (!err){
					res.send("success")
				}else{
					res.send("fail")
				}
			})
		})
	})
	app.get('/api/category/autocomplete',authenticate,function(req,res){
		var query=req.query.query
		query=new RegExp(".*"+query+".*")
		console.log(query)
		models.CategoryModel.find({name:query},function(err,tags){
			var i=0
			var data={}
			data.suggestions=[]
			data.query=req.query.query
			for (i=0;i<tags.length;i++){
				var one={}
				one.value=tags[i].name
				one.data=tags[i].name+"haha"
				data.suggestions[i]=one
			}
			res.send(data)
		})

	})

	//GET items:
	app.get('/api/items',function(req,res){
	    return models.ItemModel.find().sort("-ctime").exec(function (err, items){
	        if (!err){
	        	return res.send(items)
	        } else{
	        	console.log(err)
	            return res.send("error")
	        }
	    })
	})
	//GET an item
	app.get('/items/:id',function(req,res){
		models.ItemModel.findOne({_id:req.params.id},function(err,item){
			if (!err){
				item.rtime=app.moment(item.ctime).fromNow();
				render(req,res,'item.jade',item)
			} else{
				console.log(err)
			}
		})
	})
	//GET an item to edit
	app.get('/items/:id/edit',function(req,res){
		models.ItemModel.findOne({_id:req.params.id}).exec(function(err,item){
			if(!err)
				render(req,res,'item.edit.jade',item)
			else
				return console.log(err)
		})
	})
	//PUT an item edited
	app.post('/items/:id/edit',function(req,res){
		models.ItemModel.findOne({_id:req.params.id},function(err,item){
			if(!err){
				item.brand=req.body.brand,
				item.name=req.body.name,
				item.price=req.body.price
				item.save(function(err){
					if (!err)
						res.redirect(app.__SITE__+'/items/'+item._id)
					else
						console.log(err)
				})
			}else
				return console.log(err)
		})
	})
	//NEW an item
	app.get('/new_item',authenticate,function(req,res){
		render(req,res,'item.new.jade')
	})
	//POST an item
	app.post('/api/items', function (req, res){
	  var items
	  console.log("POST: ")
	  console.log(req.body) 
	  var image=''
	  items= new models.ItemModel({
	  name: req.body.name,
	  brand: req.body.brand,
	  category:req.body.category,
	  description:req.body.description,
	  image: image
	  })
	  if (req.files){
	     console.log(req.files)
	     var tmp=req.files.pic.path
	     var old=req.files.pic.name
	     image=rename_image(tmp,old,"uploads",190)
	     items.set({image:image})
	   }
	  items.save(function (err){
	    if (!err){
	      return console.log("created")
	    } else {
	      return console.log(err)
	    }
	  })
	  return res.redirect(app.__SITE__+"/items/"+items._id)
	})
	function rename_image(tmp_path,old_name,folder,size){
		var new_name=tmp_path.substring(tmp_path.lastIndexOf('/')+1,tmp_path.length)+old_name.substring(old_name.lastIndexOf('.'),old_name.length)
		var new_path="./"+"public/"+folder+"/"+new_name
		var new_url="/"+folder+"/"+new_name
		console.log(new_path)
	    app.fs.rename(tmp_path,new_path,function(err){
		    if (err) throw err 
		    app.fs.unlink(tmp_path)
		    resize_image(new_path,size)
	    })

	 	return new_url
	}
	function resize_image(image,width){
	  var options={
	    srcPath: image,
	    dstPath: image,
	    width:  width,
	    quality: 0.9
	  }
	  app.im.resize(options,function(err){
	    if (!err) return console.log("resized")
	    else console.log(err)
	  })
	}



	app.delete('/api/items/:id', function (req, res){
	  return models.ItemModel.findById(req.params.id, function (err, item){
	   return item.remove(function(err){
	     if (!err){
	       console.log("removed")
	       return res.send('')
	     } else {
	       console.log(err)
	     }
	   })
	  })
	})
	//bulk action:
	app.delete('/api/items',function(req,res){
	  models.ItemModel.remove(function(err){
	    if (!err){
	      console.log("removed");
	      return res.send('')
	     } else {
	       console.log(err)
	     }
	   })
	})


	//GET all comments:
	app.get('/api/comments',function(req,res){
		models.CommentModel.find().exec(function(err,comments){
			if (!err)
				res.send(comments)
			else
				console.log(err)
		})
	})
	//bulk action:
	app.delete('/api/comments',function(req,res){
	  models.CommentModel.remove(function (err){
	    if (!err){
	      console.log("removed");
	      return res.send('')
	     } else {
	       console.log(err)
	     }
	   })
	})
	app.delete('/api/users',function(req,res){
		models.UserModel.remove(function (err){
			if ( !err ){
				console.log("removed")
				return res.send('')
			}else{
				console.log(err)
			}
		})
	})
	//GET comments of an item:
	app.get('/api/items/:id/comments',function(req,res){
		//if not added any comment
		models.CommentModel.findOne({item_id:req.params.id}).exec(function(err,comment){
			if (!err){
				if (comment==null)
					return res.send([{}])
				else
					return res.send(comment.list)
			}else{
				console.log(err)
			}
		})
	})
	//POST a comment of an item:
	app.post('/api/items/:id/comments',function(req,res){
		models.CommentModel.update(
			{item_id:req.params.id},
			{$push:
			  {list:
			  	{user_id:ObjectId(req.body.user_id),
			  	 name:req.body.name,
			  	 avatar:req.body.avatar,
			  	 content:req.body.content
			  	}
			  }
			},
			{upsert:true},
			function(err,matchNum){
				if (err)
					res.send("false")
				else
					res.send("true")
			}
		)
	})

	//New a review of an item:
	app.get('/items/:id/new_review',function(req,res){
		models.ItemModel.findOne({_id:req.params.id},function(err,item){
			render(req,res,'item.review.new.jade',item)
		})
	})
	//POST a review of an item:
	app.post('/items/:id/new_review',authenticate,function(req,res){
		var review=new models.ReviewModel({
			item_id:req.params.id,
			user_id:req.session.uid,
			title:req.body.title,
			content:req.body.content
		})
		review.save(function(err){
			if(err) res.send(err)
			else 	res.redirect(app.__SITE__+'/reviews/'+review._id)
		})
	})
	//GET a review:
	app.get('/reviews/:id',authenticate,function(req,res){
		models.ReviewModel.findOne({_id:req.params.id},function(err,review){
			if(!err){
				render(req,res,'review.jade',review)
			}else
				res.send(err)
		})
	})

	//POST a rating
	app.post('/api/items/:id/add_rating',authenticate,function(req,res){
		var rating=req.body.rating
		var uid=req.session.uid
		var iid=req.params.id
		models.RatingPairModel.update(
			{user_id:uid,item_id:iid},
			{$set:{rating:rating}
			},
			{upsert:true},
			function(err,matchNum){
				if (err)
					res.send("error")
				else{
					updateItemAverage(iid)
					res.send("success")
				}
			}
		)
	})
	function updateItemAverage(id){
		models.ItemModel.findOne({_id:id},function(err,item){
			if(!err){
				models.RatingPairModel.find({item_id:id},function(err,pairs){
					var count=0
					var score=0
					for (var p in pairs){
						count+=1
						score+=pairs[p].rating
					}
					score=score*1.0/count
					item.avg_rating=score
					item.num_rating=count
					item.save()
				})
			}else{
				console.log(err)
			}
		})
	}
	app.get('/api/ratings',function(req,res){
		models.RatingPairModel.find().exec(function(err,rs){
			if(!err) res.send(rs)
			else	res.send(err)
		})
	})
	app.delete('/api/ratings',function(req,res){
		models.RatingPairModel.remove(function (err){
			if ( !err ){
				console.log("removed")
				return res.send('')
			}else{
				console.log(err)
			}
		})
	})
}
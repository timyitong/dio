module.exports = function(app, express,everyauth){
	var config=this

	app.configure(function (){
		app.set('views',__dirname+'/views')
		app.set('view engine','jade')
		app.set('view options', {layout:true})

	    app.use(express.bodyParser())
	    app.use(express.methodOverride())
	    app.use(express.cookieParser("csecstring"))
	    app.use(express.session({secret: 'topsecret',store: new express.session.MemoryStore}))
	    app.use(express.static(app.path.join(app.application_root,"public")))
	    app.use(express.errorHandler({dumpExceptions:true,showStack:true}))
	    app.use(express.bodyParser({keepExtensions: true, uploadDir:"./public/uploads"}))
	    app.use(everyauth.middleware())
	    app.use(app.router)
	})

	/*DB part:*/
	app.mongoose.connect('mongodb://localhost/dio_database')

	return config
}
module.exports = function(mongoose){
	var Schema = mongoose.Schema
	var ObjectId= Schema.ObjectId;
//User:
	var User = new Schema({
		email: String,
	  	name: String,
	  	password: String,
	  	avatar: String
	})
	this.UserModel=mongoose.model('User',User)
//Field: Higher collection than Category
	var Field =new Schema({
		name: String,
		ctime: {type:Date, default:Date.now}
	})
	this.FieldModel=mongoose.model('Field',Field)
//Category:
	var Category = new Schema({
		name: String,
		nametree: String,
		idtree: String,
		field: String,
		ctime: {type:Date, default:Date.now}
	})
	this.CategoryModel=mongoose.model('Category',Category)
//Review:
	var Review = new Schema({
		item_id: ObjectId,
		user_id: ObjectId,
		title: 	 String,
		content: String,
		ctime: {type:Date, default:Date.now}
	})
	this.ReviewModel=mongoose.model('Review',Review)
//Comment:
	var Comment = new Schema({
		item_id: ObjectId,
	  	list:[{
	  		user_id: ObjectId,
	  		name:String,
	  		avatar:String,
	  		content: String
	  	}]

	})
	this.CommentModel=mongoose.model('Comment',Comment)
//Item:
	var Item= new Schema({
	    name: String,
	    brand: String,
	    image: String,
	    color: [{type:String}],
	    price: Number,
	    category: String,
	    description: String,
	    avg_rating: {type:Number,default:0},
	    num_rating: {type:Number,default:0},
	    ctime:{type:Date, default:Date.now}
	})
	this.ItemModel=mongoose.model('Item',Item)
//RatingPair:
	var RatingPair=new Schema({
		item_id: String,
		user_id: String,
		rating: Number
	})
	this.RatingPairModel=mongoose.model('RatingPair',RatingPair)
	return this
}
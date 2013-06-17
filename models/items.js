//currently not in use
module.exports = function(mongoose){
	var collection ='items'
	var Schema = mongoose.Schema
	var ObjectId =Schema.ObjectId

	var schema = new Schema({
	    name: String,
	    brand: String,
	    image: String,
	    color: [{type:String}],
	    ctime:{type:Date, default:Date.now}
	})

	this.model =mongoose.model(collection, schema)

	return this
}
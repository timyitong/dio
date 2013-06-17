/* */
$(function(){
	$(".field-button").tooltip({position:"bottom center",offset:[-40,-100],tipClass:'field-navi',opacity:1})
})


/* Control the Ratings */
function sendRating(item_id,rating){
	var data={
		rating:rating
	}
	$.post(__SITE__+"/items/"+item_id+"/add_rating",data)
}
var profile
function checkRating(obj,id){
	if(profile==undefined){
		$.getJSON(__SITE__+"/profile",function(data){
			profile={}
			for (var i in data.ratings){
				profile[data.ratings[i].item_id]=data.ratings[i].rating
			}
		  	
		  	
			if (profile[id]!=undefined)
				$(obj).find("[rating="+profile[id]+"]").attr("checked","checked")
			$(obj).find("input.star").rating({
				callback: function(value,link){
					var item_id=$(obj).find(".item-feed").attr("item_id")
					sendRating(id,value)
				}
			});
		})
	}else{
		if (profile[id]!=undefined)
			$(obj).find("[rating="+profile[id]+"]").attr("checked","checked")
		$(obj).find("input.star").rating({
			callback: function(value,link){
				sendRating(id,value)
			}
		});
	}
}

/*Backbone MVC*/
$(function(){
	var Item = Backbone.Model.extend({
		defaults:function(){
			return {
				_id:"",
				name:"plz type-in a name",
				brand:"",
				ctime:"",
				image:""
			}
		},
		initialize: function(){
			if (!this.get("name")){
				this.set({"name":this.defaults.name})
			}
		},
		clear: function(){
			this.destroy()
		}
	})

	var ItemList=Backbone.Collection.extend({
		model: Item,
		url: __SITE__+'/items'
	})

	var Items = new ItemList

	var ItemView = Backbone.View.extend({
		tagName:"li",
		template:_.template($('#item-template').html()),
		events:{

		},
		initialize: function(){
		},
		render: function(){
			if(this.model.image==undefined)
				this.model.image=""
			this.$el.html(this.template(this.model.toJSON()))
			return this
		}
	})


	var AppView = Backbone.View.extend({
		el: $("#dio_app"),
		
		statsTemplate:_.template($('#stats-template').html()),
		
		events: {
		},
		
		initialize: function(){
		  Items.bind('all',this.render,this)
		  Items.bind('reset',this.addAll,this)
		  Items.bind('add',this.addOne,this)
		  this.main=$('#dio_app')

		  Items.fetch()
		},
		
		render: function(){
			if (Items.length){
				this.main.show()
			}else{
				this.main.hide()
			}
				
		},
			
		addOne: function(item) {
		  var view = new ItemView({model: item});
		  var el=view.render().el;
		  this.$("#item-list").append(el);

		  this.$('.item-image').mouseenter(function(){
		  	$(this).hide()
		  	$(this).siblings('.item-text').show()
		  });
		  this.$('.item-text').mouseleave(function(){
		  	$(this).hide()
		  	$(this).siblings('.item-image').show()
		  })

		  checkRating($(el),item.attributes._id)
		},

		addAll: function() {
		  Items.each(this.addOne);
		}
	
	})
	
	var App=new AppView


})

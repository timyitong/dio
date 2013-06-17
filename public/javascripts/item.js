$(function(){
 	$('.readonly-rating').rating('readOnly',true) 
	var Comment = Backbone.Model.extend({
		defaults:function(){
			return {
				user_id:"",
				content:"",
				avatar:"",
				name:"",
				_id:""
			}
		},
		initialize: function(){
			if (!this.get("content")){
				this.destroy()
			}
		},
		clear: function(){
			this.destroy()
		}
	})

	var CommentList=Backbone.Collection.extend({
		model: Comment,
		url: __SITE__+'/items/'+__ITEM_ID__+"/comments"
	})

	var Comments = new CommentList

	var CommentView = Backbone.View.extend({
		tagName:"li",
		template:_.template($('#comment-template').html()),
		events:{

		},
		initialize: function(){
		},
		render: function(){
			if (!this.model.get("content")){
			}else{
			this.$el.html(this.template(this.model.toJSON()))
			}
			return this
		}
	})


	var AppView = Backbone.View.extend({
		el: $("#comment_box"),
		
		statsTemplate:_.template($('#stats-template').html()),
		
		events: {
			'click .addButton': 'addNew'
		},
		addNew: function(){
			var data={
				name:$("#new_comment_form > #user_name").val(),
				user_id:$("#new_comment_form > #user_id").val(),
				avatar:$("#new_comment_form > #user_avatar").val(),
				content:$("#new_comment_form > .textarea").val()	
			}
			var item= new Comment(data)

			
			var view= new CommentView({model:item})
			$.ajax({
				url: __ROOT__+$("#new_comment_form").attr('action'),
				type:"POST",
				data:data,
				success: function(result) {
					console.log(result)
				}
			})
			this.$("#comment-list").prepend(view.render().el)
		},
		initialize: function(){
		  Comments.bind('all',this.render,this)
		  Comments.bind('reset',this.addAll,this)
		  Comments.bind('add',this.addOne,this)
		  this.main=$('#main')

		  Comments.fetch()
		},
		
		render: function(){
			if (Comments.length){
				this.main.show()
			}else{
				this.main.hide()
			}				
		},
			
		addOne: function(item) {
		  var view = new CommentView({model: item});
		  this.$("#comment-list").append(view.render().el);
		},

		addAll: function() {
		  Comments.each(this.addOne);
		}
	
	})
	
	var App=new AppView


})
$(function(){
	$("input[name=category]").autocomplete({
		serviceUrl: __SITE__+"/category/autocomplete",
		width:204
	})
})
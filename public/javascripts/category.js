function delete_tag(id){
	console.log(id)
	$.ajax({
	    url: __SITE__+"/category/"+id,
	    type: 'DELETE',
	    success: function(data, textStatus, xhr) {
	    	var text=xhr.responseText
	    	console.log(text)
	    	if (text =="success")
	    		$( "[item_id=" + id+"]").remove()
	    }
	});
}
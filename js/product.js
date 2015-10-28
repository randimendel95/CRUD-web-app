
//initialize application on parse
Parse.initialize("zvjivvaJkAsKdlqXeuuG81uaOMxhqsj61i2JpDum", "XrvD0ospedgpnedUDO3uPcSx95cCgGAyU05Zz11G");

//new sub class of parse 
var PugReview = Parse.Object.extend('PugReview');

var review = new PugReview();
var totalScore = 0;
var numReviews = 0;

//print stars
$('#rating').raty({
	cancel:false
});

//when submitting review
$('form').submit(function() {
	//new instance of pug review 
	var review = new PugReview();
	//for each review, set ID value to the user input.
	$(this).find('input').each(function() {
		review.set($(this).attr('id'), $(this).val());
		
	});
	var rating = $('#rating').raty('score');

	review.set('rating', rating);

	//save instance of pug review (review)
	review.save(null, {
		success: getData,
		error: function(data, error) {
			console.log(data);
			console.log(error);
			console.log(error.message);
		}
	});
	//dont let page refresh
	return false;
});

var getData = function() {

	//new query for PugReview class to get data from user reviews 
	var query = new Parse.Query(PugReview);

	//title must exist in query
	query.exists('reviewTitle');

	//when query is found, call buildList
	query.find({
		success:buildList
	});
}

//to build list of reviews
var buildList = function(data) {
	//create list 
	console.log('buildList',data); 

	//empty out list 
	$('#list').empty();


	data.forEach(function(d) {
		addItem(d)
	});
	
}

// This function takes in an item, adds it to the screen
var addItem = function(item) {
	// Get parameters (title, ) from the data item passed to the function
	var curTitle = item.get('reviewTitle');
	var curReview = item.get('reviewContent');
	var curScore = item.get('rating');

	var curInfo = '<div><p>' + curTitle + '</p></div><div><p>' + curReview + '</p></div><div id="rating'+item.id+'"></div>';
	// Append li that includes text from the data item
	$('#list').append(curInfo);
	$('#rating'+item.id).raty({
		score:curScore,
		readOnly: true
	});
	
}

// Call your getData function when the page loads
getData();
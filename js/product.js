
//initialize application on parse
Parse.initialize("zvjivvaJkAsKdlqXeuuG81uaOMxhqsj61i2JpDum", "XrvD0ospedgpnedUDO3uPcSx95cCgGAyU05Zz11G");

//new sub class of parse 
var PugReview = Parse.Object.extend('PugReview');

$('form').submit(function() {
	//new instance of pug review 
	var review = new PugReview();

	//for each review, set properties of ID to user input
	$(this).find('input').each(function() {
		review.set($(this).attr('id'), $(this).val());
	});

	//save instance of pug review (review)
	review.save(null,funtion() {
		getData();
	});
	//dont let page refresh
	return false;
});

var getData = funtion() {

	//new query for PugReview class to get data from user reviews 
	var query = new Parse.Query(PugReview);

	//website must exist
	query.exists('reviewTitle');

	query.find({
		success:buildList()
	});
}

//to build list of reviews
var buildList = function(data) {
	//create list 
	console.log('buildList()',data); 
	//empty out list 
	$('ol').empty();

	data.forEach(function(d) {
		addItem(d);
	});
}

// This function takes in an item, adds it to the screen
var addItem = function(item) {
	// Get parameters (title, ) from the data item passed to the function
	var curTitle = item.get('reviewTitle');
	var curReview = item.get('reviewContent');
	var curRating = $('rating').raty();

	var curRating = $('<li>' + curTitle + curReview + curRating '</li>');
	// Append li that includes text from the data item
	$('ol').append('curRating');
	//$('ol').append(review);
}

// Call your getData function when the page loads
getData();
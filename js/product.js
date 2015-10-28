
//initialize application on parse
Parse.initialize("zvjivvaJkAsKdlqXeuuG81uaOMxhqsj61i2JpDum", "XrvD0ospedgpnedUDO3uPcSx95cCgGAyU05Zz11G");

//new sub class of parse 
var PugReview = Parse.Object.extend('PugReview');
//counts number of reviews on a product
var numReviews;
//added up score of all reviews (sum)
var totalScore;

//upvotes for review (voted as helpful)
var upVotes;
//downvotes for review (voted not helpful)
var downVotes;

//print stars for user to input rating
$('#rating').raty({
	cancel:false
});


//when submitting review (submit button)
$('form').submit(function() {
	//new instance of pug review 
	var review = new PugReview();
	//for each review, set ID value to the user input.
	$(this).find('input').each(function() {
		review.set($(this).attr('id'), $(this).val());
		
	});
	//set rating to user's score input
	var rating = $('#rating').raty('score');

	review.set('rating', rating);
	
	//initialize upvotes and downvotes for each rating, start at 0 when not voted on yet
	review.set('upVotes',0);
	review.set('downVotes',0);

	//save instance of pug review (review)
	review.save(null, {

		success: getData,
		//tells you what errors you have in code if any
		error: function(data, error) {
			console.log(data);
			console.log(error);
			console.log(error.message);
		}
	});
	//dont let page refresh
	return false;
});

//gets data from user to detail review 
var getData = function() {

	//new query for PugReview class to get data from user reviews 
	var query = new Parse.Query(PugReview);

	//title must exist in query
	query.exists('reviewTitle');

	//when query is found, call buildList, once fully done
	query.find({
		success:buildList
	});

}

//to build list of reviews in an array
var buildList = function(data) {
	//set number of reviews as length of list of reviews
	numReviews = data.length;
	totalScore = 0;

	//empty out list at start, no reviews will be listed yet
	$('#list').empty();

	//add review for every review in the list
	data.forEach(function(d) {
		addItem(d)
	});

	//print average review stars, in readable but not changeable form 
	$('#averageRating').raty({
		score: totalScore / numReviews,
		readOnly: true
	});
}


// This function takes in an parse review (item) and shows data and adds information to HTML document in #list
var addItem = function(item) {
	//creates a div with the class 'well' and adds that to list
	var well = $('<div>').addClass('well');
	$('#list').append(well);
	// Get parameters (score, title, review) from the data item passed to the function
	var curScore = item.get('rating');
	var curTitle = item.get('reviewTitle');
	var curReview = item.get('reviewContent');
	totalScore += curScore;
	
	//adds upvote and downvote buttons, as part of the review well, using thumbs up and down icons 
	well.append('<div class="pull-right">Was this helpful? <button id = "upvote'+item.id+'"><i class="fa fa-thumbs-up"></i></button>' + '<button id = "downvote'+item.id+'""><i class="fa fa-thumbs-down"></i></div>');
	
	//adds rating, title, and review from the user input, assigned paragraphs with an id, but no content 
	var curInfo = '<div><p id="rating'+item.id+'"></p></div>' + '<div><p id="title'+item.id+'"></p></div>' + '<div><p id="review'+item.id+'"></p></div>';
	// Append details to well in list
	well.append(curInfo);
	//sets values to id's in the well above (adding to #list)
	$('#title'+item.id).text(curTitle);
	$('#review'+item.id).text(curReview);
	$('#rating'+item.id).raty({
		score:curScore,
		readOnly: true
	});
	
	//when upvote is clicked, add to count
	$('#upvote'+item.id).click(function() {
		item.increment('upVotes');
		item.save(null, {
			success: getData
		});
	})

	//when downvote is clicked, add to count
	$('#downvote'+item.id).click(function() {
		item.increment('downVotes');
		item.save(null, {
			success: getData
		});
	})

	//data results on count of upvotes and downvotes 
	well.append('<p>' + item.get('upVotes') + ' out of ' + (item.get('upVotes')+ item.get('downVotes')) + ' people found this review helpful</p>');
	
	//ability to delete review (button)
	well.append('<button id="delete'+item.id+'">Delete</button>');
	//makes the review delete
	$('#delete'+item.id).click(function() {
		item.destroy({
			success: getData
		});
	})
}
//when it's done loading the page, get data!
getData();

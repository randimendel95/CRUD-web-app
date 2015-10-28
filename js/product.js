
//initialize application on parse
Parse.initialize("zvjivvaJkAsKdlqXeuuG81uaOMxhqsj61i2JpDum", "XrvD0ospedgpnedUDO3uPcSx95cCgGAyU05Zz11G");

//new sub class of parse 
var PugReview = Parse.Object.extend('PugReview');
var numReviews;
var totalScore;

var upVotes;
var downVotes;

//print stars for user
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

var getData = function() {
	console.log('getData');

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

	numReviews = data.length;
	totalScore = 0;

	//empty out list 
	$('#list').empty();

	data.forEach(function(d) {
		addItem(d)
	});
	//print average review stars 
	$('#averageRating').raty({
		score: totalScore / numReviews,
		readOnly: true
	});


}


// This function takes in an item, adds it to the screen
var addItem = function(item) {
	var well = $('<div>').addClass('well');
	$('#list').append(well);
	// Get parameters (title, ) from the data item passed to the function
	var curScore = item.get('rating');
	var curTitle = item.get('reviewTitle');
	var curReview = item.get('reviewContent');
	totalScore += curScore;
	//upvotes = item.get('upVotes');
	//downvotes = item.get('downVotes');
	well.append('<div class="pull-right">Was this helpful? <button id = "upvote'+item.id+'"><i class="fa fa-thumbs-up"></i></button>' + '<button id = "downvote'+item.id+'""><i class="fa fa-thumbs-down"></i></div>');
	
	var curInfo = '<div><p id="rating'+item.id+'"></p></div>' + '<div><p id="title'+item.id+'"></p></div>' + '<div><p id="review'+item.id+'"></p></div>';
	// Append li that includes text from the data item
	well.append(curInfo);
	$('#title'+item.id).text(curTitle);
	$('#review'+item.id).text(curReview);
	$('#rating'+item.id).raty({
		score:curScore,
		readOnly: true
	});
	
	$('#upvote'+item.id).click(function() {
		item.increment('upVotes');
		item.save(null, {
			success: getData
		});
	})

	$('#downvote'+item.id).click(function() {
		item.increment('downVotes');
		item.save(null, {
			success: getData
		});
	})

	well.append('<p>' + item.get('upVotes') + ' out of ' + (item.get('upVotes')+ item.get('downVotes')) + ' people found this review helpful</p>');
	
	well.append('<button id="delete'+item.id+'">Delete</button>');

	$('#delete'+item.id).click(function() {
		item.destroy({
			success: getData
		});
	})
}
//when it's done loading the page, get data!
getData();

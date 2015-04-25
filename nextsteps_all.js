var getInfo = function() {
    var resolve;
    var reject;
    var p = new Promise(function(res, rej){
        resolve = res;
        reject = rej;
    });

	$.ajax({
	  url: "https://floating-citadel-2192.herokuapp.com/trip/" + window.location.hash.substring(1).split("=")[1]
	})
	  .done(function( data ) {
	  	 	resolve(data);
	});

	return p;
}

var tripID = window.location.hash.substring(1).split("=")[1];

var infoPromise = getInfo();
infoPromise.then(function(info) {
	info.trip.locations =  _.sortBy(info.trip.locations, function(location){ return 0 - location.votes_count; })
	_.each(info.trip.locations, function(location) {
		$(".cities").append($("<h4 class='city-result'> </h4>").text("Airport: " + location.name + "  Votes: " + location.votes_count));
	});
});
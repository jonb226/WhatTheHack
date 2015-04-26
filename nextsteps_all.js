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

var getCityNames = function(cities) {
	  	return Promise.all(_.map(cities, function(location, index) {
	  		return new Promise(function(resolve, reject) {
			    $.get("http://api.sandbox.amadeus.com/v1.2/location/" + location.name + "/?apikey=QW3ItzI2KsWJQ8YHg2ysbapNVMc2bteI", function(data) {
			     	if(data.city) {
			     		cities[index].name = data.city.name 
			     	}
			     	resolve(cities[index]);
			 	});
	  		});
	  	}));
}

var tripID = window.location.hash.substring(1).split("=")[1];

var infoPromise = getInfo();
infoPromise.then(function(info) {
	var cityNamePromise = getCityNames(info.trip.locations);
	cityNamePromise.then(function(locations) {
		locations =  _.sortBy(locations, function(location){ return 0 - location.total; })
		_.each(locations, function(location, index) {

			$(".cities").append($("<h4 class='city-result'> </h4>").html("<b>Airport: </b>" + location.name + " <b> Score: </b>" + location.total));
			if(index == 0) {
				$(".city-result").addClass("top-choice");
			} 
		});
	});
});
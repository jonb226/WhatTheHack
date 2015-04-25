function getflickrimage(cityName){
    
    var resolve;
    var reject;
    var p = new Promise(function(res, rej){
        resolve = res;
        reject = rej;
    });
    
    var placeSrcString = 'https://api.flickr.com/services/rest/?api_key=836e0029ba396aba560ba337f03bd4a0&method=flickr.places.find&query=' + cityName;
    
    fetch(placeSrcString).then(function(res){
        var p = new Promise(function(resolve, reject){
            if(res.status !== 200){
                return false;
            }
            res.text().then(function(txt){
                parser=new DOMParser();
                xmlDoc=parser.parseFromString(txt,"text/xml");
                var place = xmlDoc.getElementsByTagName('place')[0];
                resolve(place.getAttribute('place_id'));
            })
        });
        return p;    
    }).then(function(place_id){
        var srcString = 'https://api.flickr.com/services/rest/?api_key=836e0029ba396aba560ba337f03bd4a0&method=flickr.photos.search&place_id=' + place_id + '&tags=city';
        return fetch(srcString);
    }).then(function(res){
        if(res.status !== 200){
            return false;
        }
        res.text().then(function(txt){
            parser=new DOMParser();
            xmlDoc=parser.parseFromString(txt,"text/xml");
            var photos = Array.prototype.slice.call(
                xmlDoc.getElementsByTagName('photo'),0,3);
            var urls = photos.map(function(e){
                var farm = e.getAttribute('farm');
                var id = e.getAttribute('id');
                var secret = e.getAttribute('secret');
                var server = e.getAttribute('server');
                return 'https://farm' + farm + '.staticflickr.com/' + 
                    server + '/' + id + '_' + secret + '.jpg';
            });
            resolve(urls);
        });
    });
    
    return p;
}

var loadNewCity = function(cityIndex) {
	$(".carousel-image-1").attr("src", cities[cityIndex].imageUrl1);
	$(".carousel-image-2").attr("src", cities[cityIndex].imageUrl2);
	$(".carousel-image-3").attr("src", cities[cityIndex].imageUrl3);
	$(".carousel-city-name").text(cities[cityIndex].name);
	$(".destination-name-current").text(cityIndex + 1);
	$(".ticket-price").text(cities[cityIndex].cost);

	var rating1 = $(".rating-1");
	var rating2 = $(".rating-2");
	var rating3 = $(".rating-3");
	var rating4 = $(".rating-4");
	var rating5 = $(".rating-5");

	$(".rating-1").off();
	$(".rating-2").off();
	$(".rating-3").off();
	$(".rating-4").off();
	$(".rating-5").off();

	rating1.click(function() {
		$.ajax({
	  		url: "https://floating-citadel-2192.herokuapp.com/rating",
	  		data: 	JSON.stringify({
  					rating: {
	  					location_id: cities[cityIndex].id,
	  					vote: 1
	  				}
	  		}),
	  		type: "POST",
	  		contentType: "application/json"
		});
		if(cityIndex < cities.length -1) {
			loadNewCity(cityIndex + 1);
		} else {
			 window.location = '/nextsteps_all.html#id=' + tripID;
		}
	});
	rating2.click(function() {
		$.ajax({
	  		url: "https://floating-citadel-2192.herokuapp.com/rating",
	  		data: 	JSON.stringify({
  					rating: {
	  					location_id: cities[cityIndex].id,
	  					vote: 2
	  				}
	  		}),
	  		type: "POST",
	  		contentType: "application/json"
		});
		if(cityIndex < cities.length -1) {
			loadNewCity(cityIndex + 1);
		} else {
			 window.location = '/nextsteps_all.html#id=' + tripID;
		}
	});
	rating3.click(function() {
		$.ajax({
	  		url: "https://floating-citadel-2192.herokuapp.com/rating",
	  		data: 	JSON.stringify({
  					rating: {
	  					location_id: cities[cityIndex].id,
	  					vote: 3
	  				}
	  		}),
	  		type: "POST",
	  		contentType: "application/json"
		});
		if(cityIndex < cities.length -1) {
			loadNewCity(cityIndex + 1);
		} else {
			 window.location = '/nextsteps_all.html#id=' + tripID;
		}
	});
	rating4.click(function() {
		$.ajax({
	  		url: "https://floating-citadel-2192.herokuapp.com/rating",
	  		data: 	JSON.stringify({
  					rating: {
	  					location_id: cities[cityIndex].id,
	  					vote: 4
	  				}
	  		}),
	  		type: "POST",
	  		contentType: "application/json"
		});
		if(cityIndex < cities.length -1) {
			loadNewCity(cityIndex + 1);
		} else {
			 window.location = '/nextsteps_all.html#id=' + tripID;
		}
	});
	rating5.click(function() {
		$.ajax({
	  		url: "https://floating-citadel-2192.herokuapp.com/rating",
	  		data: 	JSON.stringify({
  					rating: {
	  					location_id: cities[cityIndex].id,
	  					vote: 5
	  				}
	  		}),
	  		type: "POST",
	  		contentType: "application/json"
		});
		if(cityIndex < cities.length -1) {
			loadNewCity(cityIndex + 1);
		} else {
			 window.location = '/nextsteps_all.html#id=' + tripID;
		}
	});
}

var getImages = function() {
	_.each(cities, function(city,index) {
		if(city.name) {
			var promise = getflickrimage(city.name);
			promise.then(function(images) {
				city.imageUrl1 = images[0];
				city.imageUrl2 = images[1];
				city.imageUrl3 = images[2];		
				if(index == 0) {
					start();
				}		
			});
		}
	});
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

var getCities = function() {
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
	  	 getCityNames(data.trip.locations).then(function(cities)  {
	  	 	resolve(cities);
	  	 });
	});

	return p;
}

var start = function() {
	$(".destination-name-total").text(cities.length);
	loadNewCity(0);
}

var tripID = window.location.hash.substring(1).split("=")[1];

var citiesPromise = getCities();
var cities;
citiesPromise.then(function(citiesArray) {
	cities = citiesArray;
	getImages();
});
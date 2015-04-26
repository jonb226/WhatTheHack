module.exports = function (cityName){
    
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
        var srcString = 'https://api.flickr.com/services/rest/?api_key=836e0029ba396aba560ba337f03bd4a0&method=flickr.photos.search&place_id=' + place_id + '&tags=cityscape';
        return fetch(srcString);
    }).then(function(res){
        if(res.status !== 200){
            return false;
        }
        res.text().then(function(txt){
            parser=new DOMParser();
            xmlDoc=parser.parseFromString(txt,"text/xml");
            var photos = Array.prototype.slice.call(
                xmlDoc.getElementsByTagName('photo'),0,5);
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
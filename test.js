var Drawer = (function() {
    //constructor
    function Drawer(_some_array){
        this.MAX_DIST = 150;
        this.list_datapoints = _some_array;
        this.previousDataPoints = [];
        this.previousColor = [];

        this.mymap = L.map('mapid').setView([48.75268, -3.45423], 12);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        }).addTo(this.mymap);

        this.layer_group_real_time = new L.layerGroup([]);
        this.layer_group_real_time.addTo(this.mymap);

        console.log("Start");
        for (var k = 0; k < this.list_datapoints.length; k++) {
            console.log(k);
            this.updateTracageRealTime(this.list_datapoints[k]);
        }
        console.log("End");
    }

    Drawer.prototype.getVehicleLayer = function(_id){
        var layers = this.layer_group_real_time.getLayers();
        for(var k = 0; k < layers.length; k++){
            if(layers[k].options['vehicle_id'] == _id) {
                console.log(layers[k]);
                return layers[k];
            }
        }
        return null;
    };
    Drawer.prototype.newLayer = function (_id, _color) {
        var nl = L.polyline([],
            {
                color: _color,
                opacity: 0.7,
                stroke: true,
                weight: 6,
                vehicle_id: _id
            });
        nl.on('click', this.traceOnClick);
        return nl;
    };
    Drawer.prototype.measure = function (lat1, lon1, lat2, lon2) {
        var R = 6378.137;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d * 1000;
    };

    Drawer.prototype.updateTracageRealTime = function(_data){
        console.log("updateTracageRealTime");
        var id = _data.c2a_id;
        var idAllLayers;
        var vehicleLayer;
        var current_lon;
        var current_lat;
        var currentLayerLatLng;
        var oldDataPoint;
        var delta;

        if (_data != null && _data['data'] != null) {
            current_lon = _data['data']['lon'];
            current_lat = _data['data']['lat'];

            //check existance of a layerGroup for this vehicle
            vehicleLayer = this.getVehicleLayer(id);
            if(vehicleLayer == null){
                vehicleLayer = L.layerGroup([]);
                L.Util.setOptions(vehicleLayer, {vehicle_id: id});
                vehicleLayer.addLayer(this.newLayer(id, _data['color']));
                this.layer_group_real_time.addLayer(vehicleLayer);
            }

            idAllLayers = vehicleLayer.getLayers();
            currentLayerLatLng = idAllLayers[idAllLayers.length-1].getLatLngs();
            if (current_lat != null && current_lon != null) {
                if (this.previousDataPoints[id] != null && this.previousColor[id] != null) {
                    oldDataPoint = this.previousDataPoints[id]['data'];
                    delta = this.measure(current_lat, current_lon, oldDataPoint['lat'], oldDataPoint['lon']);
                    if (delta > this.MAX_DIST || _data['color'] != this.previousColor[id]) { // same thing whatever the color test
                        if (delta < this.MAX_DIST){
                            currentLayerLatLng.push(L.latLng(current_lat, current_lon));
                        }
                        vehicleLayer.addLayer(this.newLayer(id, _data['color']));
                        idAllLayers = vehicleLayer.getLayers();
                        currentLayerLatLng = idAllLayers[idAllLayers.length - 1].getLatLngs();
                    }
                }
                currentLayerLatLng.push(L.latLng(current_lat, current_lon));
                idAllLayers[idAllLayers.length - 1].setLatLngs(currentLayerLatLng);

                this.previousDataPoints[id] = _data; // save the data-point as the new old one
                this.previousColor[id] = _data['color'];
            }
        }
    };

    return Drawer;
})();

var foo = [{c2a_id: 'vehicle_0',color: '#ffff00',data: {lat:48.73575,lon:-3.37481}},{c2a_id: 'vehicle_2',color: '#ccff00',data: {lat:48.73183,lon:-3.46492}},{c2a_id: 'vehicle_1',color: '#ccff00',data: {lat:48.76435,lon:-3.46151}},{c2a_id: 'vehicle_0',color: '#ccff00',data: {lat:48.73592,lon:-3.37306}},{c2a_id: 'vehicle_2',color: '#cccc00',data: {lat:48.73137,lon:-3.46514}},{c2a_id: 'vehicle_1',color: '#ccff00',data: {lat:48.76435,lon:-3.46151}},{c2a_id: 'vehicle_0',color: '#ccff00',data: {lat:48.73598,lon:-3.37137}},{c2a_id: 'vehicle_2',color: '#cccc00',data: {lat:48.7306,lon:-3.4657}},{c2a_id: 'vehicle_1',color: '#ccff00',data: {lat:48.76392,lon:-3.46134}},{c2a_id: 'vehicle_0',color: '#ccff00',data: {lat:48.73488,lon:-3.37233}},{c2a_id: 'vehicle_2',color: '#ccff00',data: {lat:48.73047,lon:-3.46948}},{c2a_id: 'vehicle_1',color: '#ccff00',data: {lat:48.76367,lon:-3.46121}},{c2a_id: 'vehicle_0',color: '#ccff00',data: {lat:48.73377,lon:-3.37084}},{c2a_id: 'vehicle_2',color: '#ccff00',data: {lat:48.73018,lon:-3.47292}},{c2a_id: 'vehicle_1',color: '#ccff00',data: {lat:48.76328,lon:-3.46098}},{c2a_id: 'vehicle_0',color: '#ccff00',data: {lat:48.73343,lon:-3.37022}},{c2a_id: 'vehicle_2',color: '#ccff00',data: {lat:48.73035,lon:-3.47211}},{c2a_id: 'vehicle_1',color: '#cccc00',data: {lat:48.76306,lon:-3.46089}},{c2a_id: 'vehicle_0',color: '#ccff00',data: {lat:48.73421,lon:-3.36821}},{c2a_id: 'vehicle_2',color: '#ccff00',data: {lat:48.73041,lon:-3.47162}},{c2a_id: 'vehicle_1',color: '#ccff00',data: {lat:48.76303,lon:-3.46088}},{c2a_id: 'vehicle_0',color: '#99ff00',data: {lat:48.73373,lon:-3.36897}},{c2a_id: 'vehicle_2',color: '#99ff00',data: {lat:48.73047,lon:-3.47077}},{c2a_id: 'vehicle_1',color: '#99ff00',data: {lat:48.76292,lon:-3.46085}},{c2a_id: 'vehicle_0',color: '#99ff00',data: {lat:48.73335,lon:-3.36993}},{c2a_id: 'vehicle_2',color: '#99ff00',data: {lat:48.73049,lon:-3.46998}},{c2a_id: 'vehicle_1',color: '#99ff00',data: {lat:48.76271,lon:-3.46081}},{c2a_id: 'vehicle_0',color: '#99ff00',data: {lat:48.73343,lon:-3.37022}},{c2a_id: 'vehicle_2',color: '#99ff00',data: {lat:48.73043,lon:-3.4688}},{c2a_id: 'vehicle_1',color: '#99cc00',data: {lat:48.76197,lon:-3.46064}},{c2a_id: 'vehicle_0',color: '#99ff00',data: {lat:48.73389,lon:-3.37101}},{c2a_id: 'vehicle_2',color: '#99ff00',data: {lat:48.73006,lon:-3.46931}},{c2a_id: 'vehicle_1',color: '#99ff00',data: {lat:48.76115,lon:-3.46043}},{c2a_id: 'vehicle_0',color: '#99ff00',data: {lat:48.73503,lon:-3.37211}},{c2a_id: 'vehicle_2',color: '#99ff00',data: {lat:48.72971,lon:-3.46868}},{c2a_id: 'vehicle_1',color: '#99ff00',data: {lat:48.7602,lon:-3.46029}},{c2a_id: 'vehicle_0',color: '#99ff00',data: {lat:48.73607,lon:-3.37134}},{c2a_id: 'vehicle_2',color: '#99ff00',data: {lat:48.72956,lon:-3.46822}},{c2a_id: 'vehicle_1',color: '#99ff00',data: {lat:48.76007,lon:-3.46026}},{c2a_id: 'vehicle_0',color: '#99ff00',data: {lat:48.73591,lon:-3.37331}},{c2a_id: 'vehicle_2',color: '#99ff00',data: {lat:48.72975,lon:-3.46879}},{c2a_id: 'vehicle_1',color: '#66ff00',data: {lat:48.75999,lon:-3.4602}},{c2a_id: 'vehicle_0',color: '#66ff00',data: {lat:48.73568,lon:-3.37494}},{c2a_id: 'vehicle_2',color: '#66ff00',data: {lat:48.7292,lon:-3.46877}},{c2a_id: 'vehicle_1',color: '#66ff00',data: {lat:48.75995,lon:-3.46014}},{c2a_id: 'vehicle_0',color: '#66ff00',data: {lat:48.73505,lon:-3.37555}},{c2a_id: 'vehicle_2',color: '#66ff00',data: {lat:48.72893,lon:-3.46912}},{c2a_id: 'vehicle_1',color: '#66ff00',data: {lat:48.75981,lon:-3.4582}},{c2a_id: 'vehicle_0',color: '#66ff00',data: {lat:48.7347,lon:-3.37686}},{c2a_id: 'vehicle_2',color: '#66ff00',data: {lat:48.72903,lon:-3.4694}},{c2a_id: 'vehicle_1',color: '#66ff00',data: {lat:48.75828,lon:-3.45396}},{c2a_id: 'vehicle_0',color: '#66ff00',data: {lat:48.73437,lon:-3.37784}},{c2a_id: 'vehicle_2',color: '#66ff00',data: {lat:48.72907,lon:-3.47007}},{c2a_id: 'vehicle_1',color: '#66ff00',data: {lat:48.75818,lon:-3.45414}},{c2a_id: 'vehicle_0',color: '#66ff00',data: {lat:48.73333,lon:-3.37903}},{c2a_id: 'vehicle_2',color: '#66ff00',data: {lat:48.72928,lon:-3.47009}},{c2a_id: 'vehicle_1',color: '#66ff00',data: {lat:48.75802,lon:-3.45404}},{c2a_id: 'vehicle_0',color: '#66ff00',data: {lat:48.73258,lon:-3.38011}},{c2a_id: 'vehicle_2',color: '#66ff00',data: {lat:48.72941,lon:-3.47032}},{c2a_id: 'vehicle_1',color: '#66ff00',data: {lat:48.75804,lon:-3.4538}},{c2a_id: 'vehicle_0',color: '#66ff00',data: {lat:48.73131,lon:-3.38175}},{c2a_id: 'vehicle_2',color: '#33ff00',data: {lat:48.72946,lon:-3.47052}},{c2a_id: 'vehicle_1',color: '#33ff00',data: {lat:48.75878,lon:-3.45338}},{c2a_id: 'vehicle_0',color: '#33ff00',data: {lat:48.73077,lon:-3.38264}},{c2a_id: 'vehicle_2',color: '#33ff00',data: {lat:48.72935,lon:-3.47014}},{c2a_id: 'vehicle_1',color: '#33ff00',data: {lat:48.7622,lon:-3.45195}},{c2a_id: 'vehicle_0',color: '#33ff00',data: {lat:48.72991,lon:-3.38414}},{c2a_id: 'vehicle_2',color: '#33ff00',data: {lat:48.72924,lon:-3.4701}},{c2a_id: 'vehicle_1',color: '#33ff00',data: {lat:48.76228,lon:-3.45182}},{c2a_id: 'vehicle_0',color: '#33ff00',data: {lat:48.7294,lon:-3.38459}},{c2a_id: 'vehicle_2',color: '#33ff00',data: {lat:48.72923,lon:-3.47066}},{c2a_id: 'vehicle_1',color: '#33ff00',data: {lat:48.76272,lon:-3.45174}},{c2a_id: 'vehicle_0',color: '#33ff00',data: {lat:48.72918,lon:-3.38512}},{c2a_id: 'vehicle_2',color: '#33ff00',data: {lat:48.7294,lon:-3.47171}},{c2a_id: 'vehicle_1',color: '#33ff00',data: {lat:48.76583,lon:-3.44913}},{c2a_id: 'vehicle_0',color: '#33ff00',data: {lat:48.72887,lon:-3.38568}},{c2a_id: 'vehicle_2',color: '#33ff00',data: {lat:48.72964,lon:-3.47225}},{c2a_id: 'vehicle_1',color: '#33ff00',data: {lat:48.76597,lon:-3.44864}},{c2a_id: 'vehicle_0',color: '#33ff00',data: {lat:48.7281,lon:-3.38589}},{c2a_id: 'vehicle_2',color: '#33ff00',data: {lat:48.72968,lon:-3.47146}},{c2a_id: 'vehicle_1',color: '#00ff00',data: {lat:48.76631,lon:-3.44872}},{c2a_id: 'vehicle_0',color: '#00ff00',data: {lat:48.72788,lon:-3.38559}},{c2a_id: 'vehicle_2',color: '#00ff00',data: {lat:48.72971,lon:-3.47091}},{c2a_id: 'vehicle_1',color: '#00ff00',data: {lat:48.76621,lon:-3.44944}},{c2a_id: 'vehicle_0',color: '#00ff00',data: {lat:48.72731,lon:-3.38488}},{c2a_id: 'vehicle_2',color: '#00ff00',data: {lat:48.72968,lon:-3.47146}},{c2a_id: 'vehicle_1',color: '#00ff00',data: {lat:48.76424,lon:-3.45073}},{c2a_id: 'vehicle_0',color: '#00ff00',data: {lat:48.72656,lon:-3.38403}},{c2a_id: 'vehicle_2',color: '#00ff00',data: {lat:48.72966,lon:-3.47221}},{c2a_id: 'vehicle_1',color: '#00ff00',data: {lat:48.76241,lon:-3.45204}},{c2a_id: 'vehicle_0',color: '#00ff00',data: {lat:48.72576,lon:-3.38337}},{c2a_id: 'vehicle_2',color: '#00ff00',data: {lat:48.72946,lon:-3.4723}},{c2a_id: 'vehicle_1',color: '#00ff00',data: {lat:48.76229,lon:-3.45214}},{c2a_id: 'vehicle_0',color: '#00ff00',data: {lat:48.72494,lon:-3.38271}},{c2a_id: 'vehicle_2',color: '#00ff00',data: {lat:48.72953,lon:-3.47271}},{c2a_id: 'vehicle_1',color: '#00ff00',data: {lat:48.76221,lon:-3.45203}},{c2a_id: 'vehicle_0',color: '#00ff00',data: {lat:48.72468,lon:-3.38227}},{c2a_id: 'vehicle_2',color: '#00ff00',data: {lat:48.72969,lon:-3.47303}},{c2a_id: 'vehicle_1',color: '#00ff00',data: {lat:48.76223,lon:-3.45187}},{c2a_id: 'vehicle_0',color: '#00ff00',data: {lat:48.72429,lon:-3.38214}},{c2a_id: 'vehicle_2',color: '#00fcfc',data: {lat:48.7298,lon:-3.47323}},{c2a_id: 'vehicle_1',color: '#00f0fc',data: {lat:48.76235,lon:-3.45183}},{c2a_id: 'vehicle_0',color: '#00f0fc',data: {lat:48.72337,lon:-3.38156}},{c2a_id: 'vehicle_2',color: '#00e4fc',data: {lat:48.72969,lon:-3.47365}},{c2a_id: 'vehicle_1',color: '#00e4fc',data: {lat:48.76392,lon:-3.45094}},{c2a_id: 'vehicle_0',color: '#00d8fc',data: {lat:48.72201,lon:-3.38091}},{c2a_id: 'vehicle_2',color: '#00d8fc',data: {lat:48.72957,lon:-3.47391}},{c2a_id: 'vehicle_1',color: '#00ccfc',data: {lat:48.76582,lon:-3.44908}},{c2a_id: 'vehicle_0',color: '#00ccfc',data: {lat:48.72103,lon:-3.38038}},{c2a_id: 'vehicle_2',color: '#00c0fc',data: {lat:48.72946,lon:-3.47391}},{c2a_id: 'vehicle_1',color: '#00b4fc',data: {lat:48.76599,lon:-3.44863}},{c2a_id: 'vehicle_0',color: '#00b4fc',data: {lat:48.71992,lon:-3.37963}},{c2a_id: 'vehicle_2',color: '#00a8fc',data: {lat:48.7293,lon:-3.4736}},{c2a_id: 'vehicle_1',color: '#00a8fc',data: {lat:48.76629,lon:-3.4487}},{c2a_id: 'vehicle_0',color: '#009cfc',data: {lat:48.71917,lon:-3.37941}},{c2a_id: 'vehicle_2',color: '#009cfc',data: {lat:48.72905,lon:-3.47319}},{c2a_id: 'vehicle_1',color: '#0090fc',data: {lat:48.77068,lon:-3.4462}},{c2a_id: 'vehicle_0',color: '#0090fc',data: {lat:48.71997,lon:-3.37894}},{c2a_id: 'vehicle_2',color: '#0084fc',data: {lat:48.72895,lon:-3.47286}},{c2a_id: 'vehicle_1',color: '#0084fc',data: {lat:48.77322,lon:-3.44555}},{c2a_id: 'vehicle_0',color: '#000000',data: {lat:48.71933,lon:-3.37869}},{c2a_id: 'vehicle_2',color: '#0078fc',data: {lat:48.72888,lon:-3.47207}},{c2a_id: 'vehicle_1',color: '#006cfc',data: {lat:48.77333,lon:-3.44549}},{c2a_id: 'vehicle_0',color: '#006cfc',data: {lat:48.71917,lon:-3.37941}},{c2a_id: 'vehicle_2',color: '#0060fc',data: {lat:48.72892,lon:-3.47183}},{c2a_id: 'vehicle_1',color: '#0054fc',data: {lat:48.77365,lon:-3.44558}},{c2a_id: 'vehicle_0',color: '#0054fc',data: {lat:48.71909,lon:-3.38036}},{c2a_id: 'vehicle_2',color: '#0048fc',data: {lat:48.72903,lon:-3.47178}},{c2a_id: 'vehicle_1',color: '#0048fc',data: {lat:48.77599,lon:-3.44661}},{c2a_id: 'vehicle_0',color: '#003cfc',data: {lat:48.71914,lon:-3.38112}},{c2a_id: 'vehicle_2',color: '#003cfc',data: {lat:48.72911,lon:-3.47196}},{c2a_id: 'vehicle_1',color: '#0030fc',data: {lat:48.7783,lon:-3.44836}},{c2a_id: 'vehicle_0',color: '#0030fc',data: {lat:48.7193,lon:-3.38294}},{c2a_id: 'vehicle_2',color: '#0024fc',data: {lat:48.72903,lon:-3.47178}},{c2a_id: 'vehicle_1',color: '#0024fc',data: {lat:48.77937,lon:-3.44885}},{c2a_id: 'vehicle_0',color: '#0018fc',data: {lat:48.7197,lon:-3.38335}},{c2a_id: 'vehicle_2',color: '#0018fc',data: {lat:48.729,lon:-3.47166}},{c2a_id: 'vehicle_1',color: '#000cfc',data: {lat:48.78073,lon:-3.44906}},{c2a_id: 'vehicle_0',color: '#000cfc',data: {lat:48.72046,lon:-3.3842}},{c2a_id: 'vehicle_2',color: '#0000fc',data: {lat:48.72887,lon:-3.471}},{c2a_id: 'vehicle_1',color: '#0000fc',data: {lat:48.78212,lon:-3.44914}},{c2a_id: 'vehicle_0',color: '#ff00cc',data: {lat:48.72114,lon:-3.38561}},{c2a_id: 'vehicle_2',color: '#ff00cc',data: {lat:48.7288,lon:-3.47099}},{c2a_id: 'vehicle_1',color: '#ff00cc',data: {lat:48.78381,lon:-3.4489}},{c2a_id: 'vehicle_0',color: '#cc00cc',data: {lat:48.72168,lon:-3.38681}},{c2a_id: 'vehicle_2',color: '#ff00cc',data: {lat:48.72863,lon:-3.47114}},{c2a_id: 'vehicle_1',color: '#ff00cc',data: {lat:48.78568,lon:-3.44809}},{c2a_id: 'vehicle_0',color: '#cc00cc',data: {lat:48.72174,lon:-3.38746}},{c2a_id: 'vehicle_2',color: '#ff00cc',data: {lat:48.72859,lon:-3.47106}},{c2a_id: 'vehicle_1',color: '#ff00cc',data: {lat:48.78627,lon:-3.44765}},{c2a_id: 'vehicle_0',color: '#ff00cc',data: {lat:48.72155,lon:-3.38915}},{c2a_id: 'vehicle_2',color: '#ff00cc',data: {lat:48.72859,lon:-3.47106}},{c2a_id: 'vehicle_1',color: '#ff00cc',data: {lat:48.78628,lon:-3.44752}},{c2a_id: 'vehicle_0',color: '#ff00cc',data: {lat:48.72151,lon:-3.39002}},{c2a_id: 'vehicle_2',color: '#ff00cc',data: {lat:48.72823,lon:-3.4704}},{c2a_id: 'vehicle_1',color: '#ff00cc',data: {lat:48.78633,lon:-3.44735}},{c2a_id: 'vehicle_0',color: '#ff00cc',data: {lat:48.72169,lon:-3.39113}},{c2a_id: 'vehicle_2',color: '#cc00cc',data: {lat:48.72815,lon:-3.4703}},{c2a_id: 'vehicle_1',color: '#ff00cc',data: {lat:48.78651,lon:-3.44723}},{c2a_id: 'vehicle_0',color: '#ff00cc',data: {lat:48.72204,lon:-3.39266}},{c2a_id: 'vehicle_2',color: '#ff00cc',data: {lat:48.72784,lon:-3.47042}},{c2a_id: 'vehicle_1',color: '#ff0099',data: {lat:48.78851,lon:-3.44445}},{c2a_id: 'vehicle_0',color: '#ff0099',data: {lat:48.72202,lon:-3.39315}},{c2a_id: 'vehicle_2',color: '#ff0099',data: {lat:48.72735,lon:-3.47068}},{c2a_id: 'vehicle_1',color: '#ff0099',data: {lat:48.79036,lon:-3.44242}},{c2a_id: 'vehicle_0',color: '#ff0099',data: {lat:48.72195,lon:-3.39371}},{c2a_id: 'vehicle_2',color: '#ff0099',data: {lat:48.7272,lon:-3.47062}},{c2a_id: 'vehicle_1',color: '#ff0099',data: {lat:48.79127,lon:-3.44205}},{c2a_id: 'vehicle_0',color: '#ff0099',data: {lat:48.72206,lon:-3.39403}},{c2a_id: 'vehicle_2',color: '#cc0099',data: {lat:48.72715,lon:-3.47067}},{c2a_id: 'vehicle_1',color: '#ff0099',data: {lat:48.79493,lon:-3.44166}},{c2a_id: 'vehicle_0',color: '#ff0099',data: {lat:48.72276,lon:-3.39477}},{c2a_id: 'vehicle_2',color: '#ff0099',data: {lat:48.72721,lon:-3.47075}},{c2a_id: 'vehicle_1',color: '#ff0099',data: {lat:48.79677,lon:-3.44099}},{c2a_id: 'vehicle_0',color: '#ff0099',data: {lat:48.72305,lon:-3.39545}},{c2a_id: 'vehicle_2',color: '#ff0099',data: {lat:48.72723,lon:-3.47077}},{c2a_id: 'vehicle_1',color: '#ff0099',data: {lat:48.79736,lon:-3.44089}},{c2a_id: 'vehicle_0',color: '#ff0099',data: {lat:48.72285,lon:-3.39589}},{c2a_id: 'vehicle_2',color: '#ff0099',data: {lat:48.72717,lon:-3.47063}},{c2a_id: 'vehicle_1',color: '#ff0099',data: {lat:48.79761,lon:-3.44074}},{c2a_id: 'vehicle_0',color: '#ff0099',data: {lat:48.72307,lon:-3.39677}},{c2a_id: 'vehicle_2',color: '#ff0066',data: {lat:48.72748,lon:-3.47064}},{c2a_id: 'vehicle_1',color: '#ff0066',data: {lat:48.79781,lon:-3.44063}},{c2a_id: 'vehicle_0',color: '#ff0066',data: {lat:48.72346,lon:-3.39866}},{c2a_id: 'vehicle_2',color: '#ff0066',data: {lat:48.72823,lon:-3.4704}},{c2a_id: 'vehicle_1',color: '#ff0066',data: {lat:48.7979,lon:-3.44037}},{c2a_id: 'vehicle_0',color: '#ff0066',data: {lat:48.72379,lon:-3.40043}},{c2a_id: 'vehicle_2',color: '#ff0066',data: {lat:48.72846,lon:-3.46969}},{c2a_id: 'vehicle_1',color: '#ff0066',data: {lat:48.79789,lon:-3.43886}},{c2a_id: 'vehicle_0',color: '#ff0066',data: {lat:48.72425,lon:-3.40144}},{c2a_id: 'vehicle_2',color: '#ff0066',data: {lat:48.72794,lon:-3.46921}},{c2a_id: 'vehicle_1',color: '#ff0066',data: {lat:48.79788,lon:-3.43741}},{c2a_id: 'vehicle_0',color: '#ff0066',data: {lat:48.72471,lon:-3.40239}},{c2a_id: 'vehicle_2',color: '#ff0066',data: {lat:48.72704,lon:-3.46938}},{c2a_id: 'vehicle_1',color: '#ff0066',data: {lat:48.79739,lon:-3.43535}},{c2a_id: 'vehicle_0',color: '#ff0066',data: {lat:48.72492,lon:-3.40337}},{c2a_id: 'vehicle_2',color: '#ff0066',data: {lat:48.72721,lon:-3.4683}},{c2a_id: 'vehicle_1',color: '#ff0066',data: {lat:48.79724,lon:-3.43385}},{c2a_id: 'vehicle_0',color: '#ff0066',data: {lat:48.72538,lon:-3.40564}},{c2a_id: 'vehicle_2',color: '#ff0066',data: {lat:48.72769,lon:-3.46761}},{c2a_id: 'vehicle_1',color: '#ff0066',data: {lat:48.79723,lon:-3.43156}}];
var foo = new Drawer(foo);

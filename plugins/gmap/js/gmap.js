/**
 * System.Map
 * Cette classe gère la localisation d'un lieu dans google map.
 **/
System.Map = {
/**
 * System.Map.USER_LOCATION -> String
 *
 * Constante à passer à la méthode [[System.Map.open]] pour positionner la carte sur la position de l'utilisateur au lancement.
 **/
	USER_LOCATION:	$MUI('Ma position'),
/**
 * System.Map.SEARCH -> String
 *
 * Constante à passer à la méthode [[System.Map.open]] pour assigner le mode de recherche souhaité.
 **/
	SEARCH:			'search',
/**
 * System.Map.ITINERARY -> String
 *
 * Constante à passer à la méthode [[System.Map.open]] pour assigner le mode de recherche souhaité.
 **/
	ITINERARY: 		'itinerary',
	
	API_KEY:		'AIzaSyAXcBGFr8eC2EWYKbuP8ycLZICtMVzm7Eg',
/**
 * System.Map.initialize() -> void
 *
 **/	
	initialize:function(){
		var key = System.Meta('GMAP_API_KEY') || this.API_KEY;
		document.write('<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key='+ key +'&sensor=false&language=fr"></script>');
		
		
		System.Opener.add('map', {
			text: 	'GoogleMap',
			icon:	'gmap-32',
			click:	function(obj){
				
				var options = {
					title:		'',
					width:		210,
					height:		100,
					content:	'',
					location:	''
				};
				
				Object.extend(options, obj || {});
												
				var winMap = System.Map.open({
					auto:		false
				}).setMode(System.Map.SEARCH).search({
					location:	System.Map.makeLocation(options.location),
					onComplete:	function(marker){
						
						var str = '<div style="width:'+options.width+'px;height:'+options.height+'px">';
						
						if(options.title != ''){
							str +=	'<h4>' + options.title + '</h4>';
						}
						
						if(typeof options.location == 'object'){
							str +=	'<p><strong>' + options.location.Address + '</strong><br />' + options.location.CP + ' ' + options.location.City + '<br />' + options.location.Country + '</p>';
						}
						
						if(options.content != ''){
							str += options.content;	
						}
						
						str+= '</div>';
						
						winMap.InfoWindow.setContent(str);
						
						winMap.InfoWindow.open(winMap.Map, marker);
	
					}
				});
				
			},
			
			onList:	function(){
				return false;
			}
		});
		
		System.Opener.add('itinerary', {
			text: 	'GoogleMap',
			icon:	'gmap-32',
			click:	function(obj){
				
				var options = {
					origin:		'',
					location:	''
				};
				
				Object.extend(options, obj || {});
				
				if(options.origin == ''){
					options.origin = System.Map.USER_LOCATION;
				}
											
				var winMap = System.Map.open({
					auto:		false
				}).setMode(System.Map.ITINERARY).search({
					origin:			System.Map.makeLocation(options.origin),
					destination:	System.Map.makeLocation(options.destination)
				});
				
			},
			
			onList:	function(){
				return false;
			}
		});
				
	},
	
	makeLocation:function(location){
		
		switch(typeof location){
			default: location = '';
			case 'string':break;
			
			case 'object':
				var array = [];
				for(var key in location){
					array.push(location[key]);
				}
				
				location = array;
				
			case 'array':
				location = location.without('', ' ').join(', ').trim();
				break;
		}
		
		return location;
	},
/**
 * System.Map.open([options]) -> Window
 *
 * Cette méthode ouvre la carte Google Map dans une instance Window.
 *
 * #### Attributs du paramètre options
 *
 * * `mode` (System.Map.SEARCH | System.Map.ITINERARY) : Change le mode de la carte.
 * * `travelMode` (google.maps.DirectionsTravelMode.DRIVING | google.maps.DirectionsTravelMode.TRANSIT | google.maps.DirectionsTravelMode.WALKING): Mode de transport par défaut.
 * * `location` (String | System.Map.USER_LOCATION) : Si mode vaut System.Map.SEARCH, vous pouvez assigner la position de recherché.
 * * `origin` (String | System.Map.USER_LOCATION) : Si mode vaut System.Map.ITINERARY,  vous pouvez assigner la position de départ de l'itinéraire.
 * * `destination` (String | System.Map.USER_LOCATION) : Si mode vaut System.Map.ITINERARY,  vous pouvez assigner la position d'arrivée de l'itinéraire.
 *
 **/	
	open:function(obj){
		
		//creation de l'instance unique
		var win = $WR.unique('map', {
			autoclose:	false
		});
		
		//on regarde si l'instance a été créée
		if(!win) {
			win = $WR.getByName('map');
			return win;
		}
		
		document.body.appendChild(win);
		
		var options = {
			auto:				true,
			mode:				'search',
			location:			System.Map.USER_LOCATION,
			origin:				false,
			destination:		'',
			travelMode:			google.maps.DirectionsTravelMode.DRIVING
		};
		
		Object.extend(options, obj || {});
		
		win.travelMode = options.travelMode;
				
		win.setIcon('gmap');
		win.addClassName('google-map');
		win.Title('Map');
		win.removeClassName('radius');
		win.Hidden(false);
		win.createFlag();
		win.Resizable(false);
		//win.createHandler($MUI('Chargement en cours')+ '...', true);
		
		
		win.appendChild(this.createPanel(win, options));
		win.resizeTo(850, 600);
		
		return win;
	},
/**
 *
 **/	
	createPanel:function(win, options){
		
		var panel = new System.jPanel({
			title:			'Map',
			style:			'width:650px',
			menu:			false
		});
		
		win.PanelMap = panel;
		var self =	this;
		panel.addClassName('google-map');	
			
		panel.InputCompleter.parentNode.removeChild(panel.InputCompleter);
		
		win.InfoWindow = new google.maps.InfoWindow();
		
		win.PanelMap.PanelSwip.Footer(false);
		
		win.loaded = false;
		//
		//
		//
		win.mode =		'search';
		win.Map = 		this.createMap(win);
		win.Markers = 	[];
		
		win.Observer = new Observer();
		win.Observer.bind(win);
		//
		//
		//
		var group = new GroupButton();
				
		win.BtnSearch = 	new SimpleButton({text:$MUI('Rechercher')});
		win.BtnItinerary = 	new SimpleButton({text:$MUI('Itinéraire')});
		group.Selectable(true);
		group.appendChild(win.BtnSearch);
		group.appendChild(win.BtnItinerary);
				
		panel.Header().appendChild(group);
		//
		//
		//
		var group = 		new GroupButton();
		win.GroupTravel = 	group;	
		win.BtnCar = 		new SimpleButton({icon:'car'});
		win.BtnBus = 		new SimpleButton({icon:'bus'});
		win.BtnMan = 		new SimpleButton({icon:'man'});
		
		group.Selectable(true);
		group.appendChild(win.BtnCar);
		group.appendChild(win.BtnBus);
		group.appendChild(win.BtnMan);
				
		panel.Header().appendChild(group);
		//
		// Search
		//
		win.BtnExchange =	new SimpleButton({icon:'map-exchange'});
		//
		//
		//
		win.InputStart = 	new Input({type:'text', value:options.origin || options.location, placeholder:$MUI('Rechercher')});
		win.InputStart.Large(true);
		//
		//
		//
		win.InputEnd = 		new Input({type:'text', value:options.destination, placeholder:$MUI('Arrivée')});
		win.InputEnd.Large(true);
		//
		//
		//
		win.BtnSubmit =		new SimpleButton({icon:'search'});
		//
		//
		//
		win.BtnCurrentLocation = new SimpleButton({icon:'current-location'});
		
		group =				new Node('div', {className:'wrap-search'}, [
								win.BtnCurrentLocation,
								win.InputStart,
								win.BtnExchange,
								win.InputEnd,	
								win.BtnSubmit
							]);
							
		panel.Header().appendChild(group);
		//
		// Methods
		// 	
		win.search = function(obj){
			return System.Map.search(this, obj);
		};
		
		win.searchItinerary = function(options){
			return System.Map.searchItinerary(this, options);
		};
		
		win.setMode = function(mode){
			return System.Map.setMode(this, mode);
		};
		
		win.setTravelMode = function(mode){
			return System.Map.setTravelMode(this, mode);
		};
		
		win.addMarker = function(o){
			return System.Map.addMarker(this, o);
		};
		//
		// Event
		//
		win.BtnItinerary.on('click', function(){
			System.Map.setMode(win, System.Map.ITINERARY).search();
			win.Flag.hide();
		});
		
		win.BtnSearch.on('click', function(){
			System.Map.setMode(win, System.Map.SEARCH).search();
		});
		
		win.BtnSubmit.on('click', function(){
			win.search();
		});
		
		win.BtnCurrentLocation.on('click', function(){
			System.Map.moveToUserLocation(win);
		});
		
		win.BtnExchange.on('click', function(){
			
			var o = win.InputStart.Value();
			win.InputStart.Value(win.InputEnd.Value());
			win.InputEnd.Value(o);
			
			System.Map.searchItinerary(win, {
				origin:				win.InputStart.Value(),
				destination:		win.InputEnd.Value()	
			});
			
		});
				
		win.BtnCar.on('click', function(){
			System.Map.setTravelMode(win, google.maps.DirectionsTravelMode.DRIVING).search();
			win.Flag.hide();
		});
		
		win.BtnBus.on('click', function(){
			System.Map.setTravelMode(win, google.maps.DirectionsTravelMode.TRANSIT).search();
			win.Flag.hide();
		});
		
		win.BtnMan.on('click', function(){
			System.Map.setTravelMode(win, google.maps.DirectionsTravelMode.WALKING).search();
			win.Flag.hide();
		});
				
		win.observe_ = win.observe;
		
		win.observe = function(eventName, callback){
			switch(eventName){
				case 'complete:itinerary':
				case 'complete':
					this.Observer.observe(eventName, callback);
					break;	
				default:this.observe_(eventName, callback);
			}
			return this;
		};
		
		win.stopObserving_ = win.stopObserving;
		
		win.stopObserving = function(eventName, callback){
			switch(eventName){
				case 'complete:itinerary':
				case 'complete':
					this.Observer.stopObserving(eventName, callback);
					break;	
				default:this.stopObserving_(eventName, callback);
			}
			return this;
		};
				
		//Assignation du mode
		this.setTravelMode(win, options.travelMode).setMode(options.mode)
		
		if(options.auto){
			win.search();
		}
		
		win.Flag.hide();
		
		return panel;
	},
/**
 * System.Map.createMap(win) -> google.maps.Map
 *
 * Cette méthode les widgets du gestionnaire Map.
 **/	
	createMap:function(win){
						
		var options = {
			center: 	new google.maps.LatLng(48.84521, 2.46877),
			zoom: 		8,
			mapTypeId: 	google.maps.MapTypeId.ROADMAP
		};
				
		return new google.maps.Map(win.PanelMap.PanelBody, options);
	},
/**
 * System.Map.startLocation(type) -> void
 *
 * Cette méthode trace la position de l'utilisateur.
 **/	
	moveToUserLocation: function(win, callback){
		
		if(System.Map.userLocation) {
			win.Map.setZoom(15);
			win.Map.setCenter(System.Map.userLocation);		
			return;
		}
		
		function onComplete(position){
				
			try{
				System.Map.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					
				win.userMarker = System.Map.addMarker(win, {position:System.Map.userLocation});
				if(win.mode == System.Map.SEARCH){
					win.InputStart.Value(System.Map.USER_LOCATION);
				}else{
					if(win.InputStart.Value() != System.Map.USER_LOCATION){
						if(win.InputEnd.Value() == '' ){
							win.InputEnd.Value(System.Map.USER_LOCATION);
						}else{
							win.InputStart.Value(System.Map.USER_LOCATION);	
						}
					}
				}
				// Set the center of the map to the user's position and zomm into a more detailed level
				win.Map.setZoom(15);
				win.Map.setCenter(System.Map.userLocation);
				
				if(Object.isFunction(callback)){
					callback.call(win);	
				}
				
			}catch(er){alert(er)}
		};
		
		// Try W3C Geolocation (Preferred)
		if(navigator.geolocation) {
			browserSupportFlag = true;
			
			navigator.geolocation.getCurrentPosition(onComplete);
			
		// Try Google Gears Geolocation
		} else if (google.gears) {
			browserSupportFlag = true;
			
			var geo = google.gears.factory.create('beta.geolocation');
			
			geo.getCurrentPosition(onComplete);
			
		} else {
			win.Map.BtnCurrentLocation.hide();
		}	
		
		return win;
	},
/**
 * System.Map.addMarker(win, options) -> google.maps.Marker
 *
 * Cette méthode change la position du 
 **/	
	addMarker:function(win, obj){
		
		var options = {
			map: 		win.Map
		};
		
		Object.extend(options, obj || {});
		
		// Add a marker using the user_lat_long position
		var marker = new google.maps.Marker(options);
		win.Markers.push(marker);
		
		return marker;
	},
/**
 * System.Map.search(win, obj) -> Window
 *
 * Cette méthode recherche une localisation ou un itineraire en fonction du mode.
 **/	
	search:function(win, obj){
		
		if(!win.loaded){
			win.PanelMap.Progress.addClassName('splashscreen');
			win.loaded = true;
		}
		
		win.PanelMap.Open(false);
		
		if(this.lastDirectionsRenderer){
			this.lastDirectionsRenderer.setMap(null);
			this.lastDirectionsRenderer = null;
		}
		
		if(win.mode == System.Map.SEARCH){
			
			if(!Object.isUndefined(obj)){
				if(Object.isString(obj)){
					win.InputStart.Value(obj);
				}else{
					if(!Object.isUndefined(obj.location)){
						win.InputStart.Value(obj.location);
					}
				}
			}
						
			if(win.InputStart.Value() == ''){
				win.Flag.setText($MUI('Veuillez d\'abord saisir une lieu à rechercher')).setType(Flag.BOTTOM).show(win.InputStart, true);
				return;	
			}
			
			if(win.InputStart.Value() == System.Map.USER_LOCATION){
				this.moveToUserLocation(win);
				return;	
			}
			
			if(Object.isUndefined(this.geocoder)){
				this.geocoder = new google.maps.Geocoder();
			}
			
			win.Markers.each(function(marker){
				marker.setMap(null);
			});
			
			win.PanelMap.Progress.show();
			
			this.geocoder.geocode({ 
				'address': win.InputStart.Value(),
			}, function(results, status) {
				
				win.PanelMap.Progress.hide();
				win.PanelMap.removeClassName('splashscreen');
				
				if (status == google.maps.GeocoderStatus.OK) {
					
					win.Map.setZoom(15);
					win.Map.setCenter(results[0].geometry.location);
					
					var marker = System.Map.addMarker(win, {position:results[0].geometry.location});
					
					win.Observer.fire('complete', marker);
					
					if(Object.isFunction(obj.onComplete)){
						obj.onComplete.call(win, marker);
					}
					
				} else {
					//win.AlertBox.("Geocode was not successful for the following reason: " + status);
				}
			});
		}else{
			
			var options = {
				origin: 		win.InputStart.Value(),
				destination: 	win.InputEnd.Value(),
				travelMode: 	win.travelMode, // Type de transport
				unitSystem:		google.maps.UnitSystem.METRIC
			};
						
			Object.extend(options, obj || {});
			
			win.InputStart.Value(options.origin);
			win.InputEnd.Value(options.destination);
			
			if(win.InputStart.Value() == ''){
				win.Flag.setText($MUI('Veuillez d\'abord saisir le lieu de départ')).setType(Flag.BOTTOM).show(win.InputStart, true);
				return;
			}
			
			if(win.InputEnd.Value() == ''){
				win.Flag.setText($MUI('Veuillez d\'abord saisir le lieu de destination')).setType(Flag.BOTTOM).show(win.InputEnd, true);
				return;
			}
			
			if(win.InputStart.Value() == win.InputEnd.Value()){
				win.Flag.setText($MUI('Veuillez saisir un lieu départ différent du lieu de destination')).setType(Flag.BOTTOM).show(win.InputStart, true);
				return;
			}
			
			if(win.InputStart.Value() == System.Map.USER_LOCATION){
				
				if(Object.isUndefined(System.Map.userLocation)){
					System.Map.moveToUserLocation(win, function(){
						win.search(options);
					});
					return;	
				}
				
				options.origin = System.Map.userLocation;
			}
			
			if(win.InputEnd.Value() == System.Map.USER_LOCATION){
				
				if(Object.isUndefined(System.Map.userLocation)){
					System.Map.moveToUserLocation(win, function(){
						win.search(options);
					});
					return;	
				}
				
				options.destination = System.Map.userLocation;
			}
			
			this.setTravelMode(win, options.travelMode);
			
			win.Markers.each(function(marker){
				marker.setMap(null);
			});
			
			if(options.origin && options.destination){
													
				var direction = this.lastDirectionsRenderer = new google.maps.DirectionsRenderer({
					map: 	win.Map,
					panel: 	win.PanelMap.PanelSwip.Body()
				});
				
				win.PanelMap.Progress.show();
				
				var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
				directionsService.route(options, function(response, status){ // Envoie de la requête pour calculer le parcours
					
					win.PanelMap.Progress.hide();
					win.PanelMap.removeClassName('splashscreen');
					
					if(status == google.maps.DirectionsStatus.OK){
						direction.setDirections(response);
						
						win.PanelMap.Open(true, 250);
						win.PanelMap.PanelSwip.refresh();
						//win.NodeItinerary.show();
						
						win.Observer.fire('complete:itinerary');
					}else{
						var splite = new SpliteIcon($MUI('Aucun itineraire n\'a pu être trouvé en fonction de vos paramètres de recherche') + ' !');	
						splite.setIcon('alert-48');
						
						win.AlertBox.a(splite).setType('CLOSE').Timer(5).show();
					}
				});
			}
		
		}
		
		return win;
	},
/**
 * System.Map.setMode(win) -> Window
 *
 * Cette méthode change le mode de recherche de la carte.
 **/
 	setMode:function(win, mode){
		
		switch(mode){
			case System.Map.ITINERARY:
				win.InputStart.placeholder = $MUI('Début');
				win.BtnExchange.show();
				win.InputEnd.show();
				win.GroupTravel.show();
				
				win.BtnItinerary.Selected(true);
				win.mode = mode;
				
				win.PanelMap.Open(false);
				//win.resizeTo(650, 500);
				//win.NodeItinerary.hide();
				
				break;
				
			default:
			case System.Map.SEARCH:
				win.InputStart.placeholder = $MUI('Rechercher');
				win.BtnExchange.hide();
				win.InputEnd.hide();
				win.GroupTravel.hide();
				
				win.BtnSearch.Selected(true);
				win.mode = System.Map.SEARCH;			
				break;
		}
		
		return win;
	},
/**
 * System.Map.setTravelMode(win) -> Window
 *
 * Cette méthode change le mode de transport utilisé pour l'itineraire.
 **/
 	setTravelMode:function(win, mode){
		
		switch(mode){
			default:
			case google.maps.DirectionsTravelMode.DRIVING:
				win.BtnCar.Selected(true);
				win.travelMode = google.maps.DirectionsTravelMode.DRIVING;
				break;
			case google.maps.DirectionsTravelMode.TRANSIT:
				win.BtnBus.Selected(true);
				win.travelMode = mode;
				break;
			case google.maps.DirectionsTravelMode.WALKING:
				win.BtnMan.Selected(true);
				win.travelMode = mode;
				break;
		}
		
		return win;
	}
};

System.Map.initialize();
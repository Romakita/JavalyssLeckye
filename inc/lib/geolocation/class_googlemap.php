<?php
/** section: Library
 * class GoogleMapAPI
 *
 * Cette classe gère l'affichage des cartes Google Map.
 *
 * * Auteur : CERDAN Yohann
 * * Correction : Lenzotti Romain
 * * Fichier : class_googlemap.php
 * * Version : 1.0
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
if(!class_exists('GoogleMapAPI')):
class GoogleMapAPI{
	private static $AUTO_INCREMENT = 	1;
/**
 * GoogleMapAPI#id -> String
 * GoogleMap ID for the HTML DIV
 **/
	public $id = 			'googlemapapi';
/**
 * GoogleMapAPI#directionId -> String
 * GoogleMap  Direction ID for the HTML DIV
 **/
	protected $directionId = 'route';
/**
 * GoogleMapAPI#width -> String
 * Width of the gmap
 **/
	protected $width = '';
/**
 * GoogleMapAPI#width -> String
 * height of the gmap
 **/
	protected $height = '';
/**
 * GoogleMapAPI#iconWidth -> Number
 * Icon width of the gmarker
 **/
	public $iconWidth = 57;
/**
 * GoogleMapAPI#iconHeight -> Number
 * Icon height of the gmarker
 **/
	public $iconHeight = 34;
/**
 * GoogleMapAPI#infoWindowWidth -> Number
 * Infowindow width of the gmarker
 **/
	public $infoWindowWidth = 250;
/**
 * GoogleMapAPI#zoom -> Number
 * Default zoom of the gmap
 **/
	public $zoom = 9;
/**
 * GoogleMapAPI#enableWindowZoom -> Boolean
 * Enable the zoom of the Infowindow
 **/
	public $enableWindowZoom = false;
/**
 * GoogleMapAPI#infoWindowZoom -> Boolean
 * Default zoom of the Infowindow
 **/
	public $infoWindowZoom = 10;
/**
 * GoogleMapAPI.Lang -> String
 * Lang of the gmap (default : fr)
 **/
	static $Lang = 'fr';
/**
 * GoogleMapAPI#center -> String
 * Center of the gmap
 **/
	public $center = 'Paris France';
/**
 * GoogleMapAPI#content -> Boolean
 * Content of the HTML generated
 **/
	protected $content = '';
/**
 * GoogleMapAPI#displayDirectionFields -> Boolean
 * Add the direction button to the infowindow
 **/
	public $displayDirectionFields = false;
/**
 * GoogleMapAPI#defaultHideMarker -> Boolean
 * Hide the marker by default
 **/
	public $defaultHideMarker = false;
/**
 * GoogleMapAPI#contentMarker -> String
 * Extra content (marker, etc...)
 **/
	protected $contentMarker = '';
/**
 * GoogleMapAPI#contentMarker -> Boolean
 * Use clusterer to display a lot of markers on the gmap
 **/
	public $useClusterer = false;
/**
 * GoogleMapAPI#gridSize -> Number
 **/
	public $gridSize = 100;
/**
 * GoogleMapAPI#maxZoom -> Number
 **/
	public $maxZoom = 9;
/**
 * GoogleMapAPI#clustererLibrarypath -> String
 **/
	protected static $clustererLibrarypath = 'http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerclusterer/1.0/src/markerclusterer_packed.js';
/**
 * GoogleMapAPI#enableAutomaticCenterZoom -> Boolean
 * Enable automatic center/zoom
 **/
	public $enableAutomaticCenterZoom = false;
/**
 * GoogleMapAPI#maxLng -> Number
 * maximum longitude of all markers
 **/
	protected $maxLng = -1000000;
/**
 * GoogleMapAPI#minLng -> Number
 * minimum longitude of all markers
 **/
	protected $minLng = 1000000;
/**
 * GoogleMapAPI#maxLat -> Number
 * max latitude of all markers
 **/
	protected $maxLat = -1000000;
/**
 * GoogleMapAPI#minLat -> Number
 * min latitude of all markers
 **/
	protected $minLat = 1000000;
/**
 * GoogleMapAPI#centerLat -> Number
 * map center latitude (horizontal), calculated automatically as markers are added to the map
 **/
	protected $centerLat = NULL;
/**
 * GoogleMapAPI#centerLng -> Number
 * map center longitude (vertical),  calculated automatically as markers are added to the map
 **/
	protected $centerLng = NULL;
/**
 * GoogleMapAPI#coordCoef -> Number
 * factor by which to fudge the boundaries so that when we zoom encompass, the markers aren't too close to the edge
 **/
	protected $coordCoef = 0.01;
/**
 * GoogleMapAPI#mapType -> Number
 * Type of map to display
 **/
	protected $mapType = 'ROADMAP';
/**
 * new GoogleMapAPI()
 *
 * Create a new instance of [[GoogleMapAPI]].
 **/
	public function __construct(){
		$this->id .= self::$AUTO_INCREMENT;
		self::$AUTO_INCREMENT++;	
	}
	
	public function setID($id){
		$this->id = $id;	
	}
	
	public function setDirectionID($id){
		$this->directionId = $id;	
	}
/**
 * GoogleMapAPI#getAPIPath() -> String
 *
 * Return the url google map api script.
 **/
	public function getAPIPath($sensor = false){
		return 'http://maps.google.com/maps/api/js?sensor='. ($sensor ? 'true' : 'false') .'&language='.self::$Lang;
	}
/**
 * GoogleMapAPI#getClustererPath() -> String
 *
 * Return the url google map api script.
 **/
	public function getClustererPath(){
		return self::$clustererLibrarypath;
	}
/**
 * GoogleMapAPI#setClusterer(userClusterer [, gridSize [, maxZom [, clustererLibrary]]]) -> void
 * Set the useClusterer parameter (optimization to display a lot of marker)
 * - useClusterer (Boolean): use cluster or not
 * - gridSize (Number): grid size (The grid size of a cluster in pixel. Each cluster will be a square. If you want the algorithm to run faster, you can set this value larger. The default value is 100.)
 * - maxZoom (Number): maxZoom (The max zoom level monitored by a marker cluster. If not given, the marker cluster assumes the maximum map zoom level. When maxZoom is reached or exceeded all markers will be shown without cluster.)
 * - clustererLibraryPath (String): clustererLibraryPath
 *
 * Set a new clusterer.
 **/
	public function setClusterer($useClusterer, $gridSize = 100, $maxZoom = 9, $clustererLibraryPath = ''){
		$this->useClusterer = $useClusterer;
		$this->gridSize = $gridSize;
		$this->maxZoom = $maxZoom;
		($clustererLibraryPath == '') ? $this->clustererLibraryPath = 'http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerclusterer/1.0/src/markerclusterer_packed.js' : $clustererLibraryPath;
	}
/**
 * GoogleMapAPI#setMapType(type) -> void
 * - type (String): type of gmap.
 *
 * Set the type of map, can be :
 * 
 * * HYBRID,
 * * TERRAIN, 
 * * ROADMAP,
 * * SATELLITE
 *
 **/
	public function setMapType($type){
		$mapsType = array('ROADMAP', 'HYBRID', 'TERRAIN', 'SATELLITE');
		
		if (!in_array(strtoupper($type), $mapsType)) {
			$this->mapType = $mapsType[0];
		} else {
			$this->mapType = strtoupper($type);
		}
	}
/**
 * GoogleMapAPI#setSize(width, height) -> void
 * - width (Number): GoogleMap  width
 * - height (Number): GoogleMap  height
 *
 * Set the size of the gmap
 *
 **/
	public function setSize($width, $height){
		$this->width = $width;
		$this->height = $height;
	}
/**
 * GoogleMapAPI#setIconSize(width, height) -> void
 * - width (Number): marker icon width
 * - height (Number): marker icon height
 *
 * Set the size of the icon markers
 *
 **/
	public function setIconSize($iconWidth, $iconHeight){
		$this->iconWidth = $iconWidth;
		$this->iconHeight = $iconHeight;
	}
/**
 * GoogleMapAPI#setLang(lang) -> void
 * - lang (String): GoogleMap  lang : fr, en, ...
 *
 * Set the lang of the gmap
 *
 **/
	public function setLang($lang){
		$this->lang = $lang;
	}
/**
 * GoogleMapAPI#setZoom(zoom) -> void
 * - zoom (Number): GoogleMap zoom
 *
 * Set the zoom of the gmap
 *
 **/
	public function setZoom($zoom){
		$this->zoom = $zoom;
	}
/**
 * GoogleMapAPI#setInfoWindowZoom(zoom) -> void
 * - zoom (Number): GoogleMap zoom
 *
 * Set the zoom of the infowindow
 *
 **/
	public function setInfoWindowZoom($infoWindowZoom){
		$this->infoWindowZoom = $infoWindowZoom;
	}
/**
 * GoogleMapAPI#setCenter(address) -> void
 * - zoom (Number): An address
 *
 * Set the address location of the gmap.
 *
 **/
	public function setCenter($center){
		$this->center = $center;
	}
/**
 * GoogleMapAPI#getContent() -> String
 * GoogleMapAPI#getContent(url) -> String
 * - url (String): the url
 * 
 * return the google map html code.
 * 
 * if the paramerter `url` isset, the method get URL content using cURL.
 **/
	public function getContent($url = ''){
		if($url == '')	return $this->content;
		
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_TIMEOUT, 10);
		curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 5);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($curl, CURLOPT_URL, $url);
		$data = curl_exec($curl);
		curl_close($curl);
		
		return $data;
	}
/**
 * GoogleMapAPI.Sanitize(text [, replaceBy]) -> String
 * - text (String): The string to treat
 * - replaceBy (String): The replacement character
 * 
 * Remove accentued characters.
 **/
	public static function Sanitize($text, $replaceBy = '_'){
		$accents = "ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ";
		$sansAccents = "AAAAAACEEEEIIIIOOOOOUUUUYaaaaaaceeeeiiiioooooouuuuyy";
		$text = strtr($text, $accents, $sansAccents);
		$text = preg_replace('/([^.a-z0-9]+)/i', $replaceBy, $text);
		return $text;
	}
/**
 * GoogleMapAPI#geocoding(address) -> Array
 * - address (String): An address
 * - replaceBy (String): The replacement character
 * 
 * Geocoding an address (address -> lat,lng) and return array with precision, lat & lng
 **/
	public function geocoding($address){
		$encodeAddress = urlencode(self::Sanitize($address));
		$url = "http://maps.google.com/maps/geo?q=".$encodeAddress."&output=csv";

		if (function_exists('curl_init')) {
			$data = $this->getContent($url);
		} else {
			$data = file_get_contents($url);
		}

		$csvSplit = preg_split("/,/", $data);
		$status = $csvSplit[0];

		if (strcmp($status, "200") == 0) {
			$return = $csvSplit; // successful geocode, $precision = $csvSplit[1],$lat = $csvSplit[2],$lng = $csvSplit[3];
		} else {
			echo "<!-- geocoding : failure to geocode : " . $status . " -->\n";
			$return = null; // failure to geocode
		}

		return $return;
	}
/**
 * GoogleMapAPI#addMarkerByCoords(lat, lng, title [, html = null [, category = null [, icon = null]]]) -> void
 * - lat (String): marker's lattitude
 * - lgn (String): marker's longitude
 * - title (String): Title info
 * - html (String): code display in the info window
 * - category (String): marker category
 * - icon (String): an icon url
 * 
 * Add marker by his coord
 **/
	public function addMarkerByCoords($lat, $lng, $title, $html = '', $category = '', $icon = ''){
		if ($icon == '') {
			$icon = 'http://maps.gstatic.com/intl/fr_ALL/mapfiles/markers/marker_sprite.png';
		}

		// Save the lat/lon to enable the automatic center/zoom
		$this->maxLng = (float)max((float)$lng, $this->maxLng);
		$this->minLng = (float)min((float)$lng, $this->minLng);
		$this->maxLat = (float)max((float)$lat, $this->maxLat);
		$this->minLat = (float)min((float)$lat, $this->minLat);
		$this->centerLng = (float)($this->minLng + $this->maxLng) / 2;
		$this->centerLat = (float)($this->minLat + $this->maxLat) / 2;

		$this->contentMarker .= "\t" . 'gmap.addMarker(new google.maps.LatLng("' . $lat . '","' . $lng . '"),"' .  utf8_decode($title) . '","' . utf8_decode($html) . '","' . $category . '","' . $icon . '");' . "\n";
	}
/**
 * GoogleMapAPI#addMarkerByAddress(address [, title = null [, html = null [, category = null [, icon = null ]]]]) -> void
 * - address (String): An address
 * - title (String): Title info
 * - html (String): code display in the info window
 * - category (String): marker category
 * - icon (String): an icon url
 * 
 * Add marker by his address
 **/
	public function addMarkerByAddress($address, $title = '', $content = '', $category = '', $icon = ''){
		$point = $this->geocoding($address);
		
		if ($point !== null) {
			$this->addMarkerByCoords($point[2], $point[3], $title, $content, $category, $icon);
		} else {
			echo "<!-- addMarkerByAddress : ADDRESS NOT FOUND " . strip_tags($address) . " -->\n";
			// throw new Exception('Adress not found : '.$address);
		}
	}
/**
 * GoogleMapAPI#addArrayMarkerByCoords(coordtab [, category = null [, icon = null ]]) -> void
 * - coordtab (Array): An array of coord
 * - category (String): marker category
 * - icon (String): an icon url
 * 
 * Add marker by an array of coord
 **/
	public function addArrayMarkerByCoords($coordtab, $category = '', $icon = ''){
		foreach ($coordtab as $coord) {
			$this->addMarkerByCoords($coord[0], $coord[1], $coord[2], $coord[3], $category, $icon);
		}
	}
/**
 * GoogleMapAPI#addArrayMarkerByAddress(coordtab [, category = null [, icon = null ]]) -> void
 * - coordtab (Array): an array of address
 * - category (String): marker category
 * - icon (String): an icon url
 * 
 * Add marker by an array of address
 **/
	public function addArrayMarkerByAddress($coordtab, $category = '', $icon = ''){
		foreach ($coordtab as $coord) {
			$this->addMarkerByAddress($coord[0], $coord[1], $coord[2], $category, $icon);
		}
	}
/**
 * GoogleMapAPI#addDirection(from, to) -> void
 * - from (String): An address
 * - to (String): An address
 * 
 * Set a direction between 2 addresss and set a text panel
 **/
	public function addDirection($from, $to){
		$this->contentMarker .= 'gmap.addDirection("' . $from . '","' . $to . '");';
	}
/**
 * GoogleMapAPI#addDirection(url [, category = null [, icon = null ]]) -> void
 * - url (String):  url of the kml file compatible with gmap and gearth
 * - category (String): marker category
 * - icon (String): an icon url
 *
 * Parse a KML file and add markers to a category
 **/
	public function addKML($url, $category = '', $icon = ''){
		$xml = new SimpleXMLElement($url, null, true);
		foreach ($xml->Document->Folder->Placemark as $item) {
			$coordinates = explode(',', (string)$item->Point->coordinates);
			$name = (string)$item->name;
			$this->addMarkerByCoords($coordinates[1], $coordinates[0], $name, $name, $category, $icon);
		}
	}
/*
 *
 **/	
	public static function DrawClassJS(){
		
		?>
        
        <script>
			
			var GoogleMapAPI = Class.create();
			
			GoogleMapAPI.prototype = {
				zoom:					11,
				center:					false,
				
				defaultHideMarker:		true,
				displayDirectionFields: false,
				
				mapTypeId:				google.maps.MapTypeId.ROADMAP,
				geocoder:				null,
				map:					null,
				gmarkers:				null,
				infowindow:				null,
				directions:				null,
				directionsService:		null,
				current_lat:			0,
				current_lng:			0,
					
				iconWidth:				0,
				iconHeight:				0,
				
				infoWindowWidth:		0,
				infoWindowHeight:		0,
								
				initialize: function(id, obj){
					this.geocoder = 			new google.maps.Geocoder();
					this.gmarkers =				[];
					this.directions = 			new google.maps.DirectionsRenderer();
					this.directionsService =	new google.maps.DirectionsService();
						
					var options = {};
														
					if(!Object.isUndefined(obj)){
												
						for(var key in obj){
							options[key] = 	obj[key];
							this[key] =  	obj[key];
						}
					}
					
					this.map = new google.maps.Map(document.getElementById(id), options);
				},
								
				addDirection: function(from, to) {
					
					var request = {
						origin:			from, 
						destination:	to,
						travelMode: 	google.maps.DirectionsTravelMode.DRIVING
					};
					
					var self = this;
					
					this.directionsService.route(request, function(response, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							self.directions.setDirections(response);
						}
					});
					
					if(this.infowindow) { this.infowindow.close(); }
				},
				
				addMarker: function(latlng, title, content, category, icon) {
					
					var self = this;
					
					var marker = new google.maps.Marker({
						map: 		this.map,
						title : 	title,
						icon:  		new google.maps.MarkerImage(icon, new google.maps.Size(this.iconWidth, this.iconHeight)),
						position: 	latlng
					});
					
					if(self.displayDirectionFields){
						var id_name = 	'marker_'+ self.gmarkers.length;
						content += 		'<div style="clear:both;height:20px;"></div>';
						content += 		'<input type="text" id="'+id_name+'"/>';
						
						var from = 		latlng.lat() + "," + latlng.lng();
						
						content += 		'<br /><input type="button" onClick="addDirection(to.value, document.getElementById(\''+id_name+'\').value);" value="Arrivée"/>';
						content += 		'<input type="button" onClick="addDirection(document.getElementById(\''+id_name+'\').value,to.value);" value="Départ"/>';				
					}
					
					var html = '<div style="float:left;text-align:left;width:' + self.infoWindowWidth + 'px;">'+content+'</div>';
					
					google.maps.event.addListener(marker, "click", function() {
						if (self.infowindow) self.infowindow.close();
						
						self.infowindow = new google.maps.InfoWindow({content: html});
						self.infowindow.open(self.map, marker);
						
						if(self.enableWindowZoom){
							self.map.setCenter(new google.maps.LatLng(latlng.lat(), latlng.lng()), self.infoWindowZoom);
						}
					});
					
					marker.mycategory = category;
					self.gmarkers.push(marker);
					
					if (self.defaultHideMarker) {
						marker.setVisible(false);
					}
				},
				
				geocodeMarker: function(address, title, content, category, icon) {
					if (this.geocoder) {
						this.geocoder.geocode( { "address" : address}, function(results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
								var latlng = 	results[0].geometry.location;
								addMarker(results[0].geometry.location, title, content, category, icon);
							}
						});
					}
				},
				
				geocodeCenter: function(address) {
					var self = this;
					
					if (this.geocoder) {
						this.geocoder.geocode( { "address": address}, function(results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
								self.map.setCenter(results[0].geometry.location);
							} else {
								alert("Geocode was not successful for the following reason: " + status);
							}
						});
					}
				},
				
				getCurrentLat: function() {
					return this.current_lat;
				},
				
				getCurrentLng:function() {
					return this.current_lng;
				},
				
				hideCategory: function(category) {
					for (var i = 0; i < gmarkers.length; i++) {
						if (this.gmarkers[i].mycategory == category) {
							this.gmarkers[i].setVisible(false);
						}
					}
					if(this.infowindow) { this.infowindow.close(); }
				},
				
				hideAll: function() {
					for (var i = 0; i < this.gmarkers.length; i++) {
						this.gmarkers[i].setVisible(false);
					}
					if(this.infowindow) { this.infowindow.close(); }
				},
				
				showCategory: function(category) {
					for (var i = 0; i < this.gmarkers.length; i++) {
						if (this.gmarkers[i].mycategory == category) {
							this.gmarkers[i].setVisible(true);
						}
					}
				},
				
				showAll: function() {
					for (var i = 0; i < this.gmarkers.length; i++) {
						this.gmarkers[i].setVisible(true);
					}
					
					if(this.infowindow) {this.infowindow.close();}
				},
				
				toggleHideShow: function(category) {
					for (var i = 0; i < this.gmarkers.length; i++) {
						if (this.gmarkers[i].mycategory === category) {
							if (this.gmarkers[i].getVisible() === true) { this.gmarkers[i].setVisible(false); }
							else this.gmarkers[i].setVisible(true);
						}
					}
					if(this.infowindow) {this.infowindow.close();}
				},
				
				addKML: function(file) {
					var ctaLayer = new google.maps.KmlLayer(file);
					ctaLayer.setMap(this.map);
				}
			};
		</script>
		<?php
	}
/**
 * GoogleMapAPI#init() -> void
 *
 * Initialize the javascript code
 **/
	public function init(){
		// Google map DIV
		if (($this->width != '') && ($this->height != '')) {
			$this->content .= "\t" . '<div id="' . $this->id . '" style="width:' . $this->width . ';height:' . $this->height . '"></div>' . "\n";
		} else {
			$this->content .= "\t" . '<div id="' . $this->id . '"></div>' . "\n";
		}
		
		// Google map JS
		$this->content .= '<script type="text/javascript" src="'.self::getAPIPath().'"></script>' . "\n";
		// Clusterer JS
		if ($this->useClusterer == true) {
			$this->content .= '<script src="' . self::getClustererPath() . '" type="text/javascript"></script>' . "\n";
		}

		$this->content .= '<script type="text/javascript">' . "\n";

		//global variables
		$this->content .= 'var geocoder = new google.maps.Geocoder();' . "\n";
		$this->content .= 'var map;' . "\n";
		$this->content .= 'var gmarkers = [];' . "\n";
		$this->content .= 'var infowindow;' . "\n";
		$this->content .= 'var directions = new google.maps.DirectionsRenderer();' . "\n";
		$this->content .= 'var directionsService = new google.maps.DirectionsService();' . "\n";
		$this->content .= 'var current_lat = 0;' . "\n";
		$this->content .= 'var current_lng = 0;' . "\n";

		// JS public function to get current Lat & Lng
		$this->content .= "\t" . 'function getCurrentLat() {' . "\n";
		$this->content .= "\t\t" . 'return current_lat;' . "\n";
		$this->content .= "\t" . '}' . "\n";
		$this->content .= "\t" . 'function getCurrentLng() {' . "\n";
		$this->content .= "\t\t" . 'return current_lng;' . "\n";
		$this->content .= "\t" . '}' . "\n";

		// JS public function to add a  marker 
		$this->content .= "\t" . 'function addMarker(latlng,title,content,category,icon) {' . "\n";
		$this->content .= "\t\t" . 'var marker = new google.maps.Marker({' . "\n";
		$this->content .= "\t\t\t" . 'map: map,' . "\n";
		$this->content .= "\t\t\t" . 'title : title,' . "\n";
		$this->content .= "\t\t\t" . 'icon:  new google.maps.MarkerImage(icon, new google.maps.Size(' . $this->iconWidth . ',' . $this->iconHeight . ')),' . "\n";
		$this->content .= "\t\t\t" . 'position: latlng' . "\n";
		$this->content .= "\t\t" . '});' . "\n";

		// Display direction inputs in the info window
		if ($this->displayDirectionFields == true) {
			$this->content .= "\t\t" . 'content += \'<div style="clear:both;height:20px;"></div>\';' . "\n";
			$this->content .= "\t\t" . 'id_name = \'marker_\'+gmarkers.length;' . "\n";
			$this->content .= "\t\t" . 'content += \'<input type="text" id="\'+id_name+\'"/>\';' . "\n";
			$this->content .= "\t\t" . 'var from = ""+latlng.lat()+","+latlng.lng();' . "\n";
			$this->content .= "\t\t" . 'content += \'<br /><input type="button" onClick="addDirection(to.value,document.getElementById(\\\'\'+id_name+\'\\\').value);" value="Arrivée"/>\';' . "\n";
            $this->content .= "\t\t" . 'content += \'<input type="button" onClick="addDirection(document.getElementById(\\\'\'+id_name+\'\\\').value,to.value);" value="Départ"/>\';' . "\n";
		}

		$this->content .= "\t\t" . 'var html = \'<div style="float:left;text-align:left;width:' . $this->infoWindowWidth . ';">\'+content+\'</div>\'' . "\n";
		$this->content .= "\t\t" . 'google.maps.event.addListener(marker, "click", function() {' . "\n";
		$this->content .= "\t\t\t" . 'if (infowindow) infowindow.close();' . "\n";
		$this->content .= "\t\t\t" . 'infowindow = new google.maps.InfoWindow({content: html});' . "\n";
		$this->content .= "\t\t\t" . 'infowindow.open(map,marker);' . "\n";

		// Enable the zoom when you click on a marker
		if ($this->enableWindowZoom == true) {
			$this->content .= "\t\t" . 'map.setCenter(new google.maps.LatLng(latlng.lat(),latlng.lng()),' . $this->infoWindowZoom . ');' . "\n";
		}

		$this->content .= "\t\t" . '});' . "\n";
		$this->content .= "\t\t" . 'marker.mycategory = category;' . "\n";
		$this->content .= "\t\t" . 'gmarkers.push(marker);' . "\n";

		// Hide marker by default
		if ($this->defaultHideMarker == true) {
			$this->content .= "\t\t" . 'marker.setVisible(false);' . "\n";
		}
		$this->content .= "\t" . '}' . "\n";

		// JS public function to add a geocode marker 
		$this->content .= "\t" . 'function geocodeMarker(address,title,content,category,icon) {' . "\n";
		$this->content .= "\t\t" . 'if (geocoder) {' . "\n";
		$this->content .= "\t\t\t" . 'geocoder.geocode( { "address" : address}, function(results, status) {' . "\n";
		$this->content .= "\t\t\t\t" . 'if (status == google.maps.GeocoderStatus.OK) {' . "\n";
		$this->content .= "\t\t\t\t\t" . 'var latlng = 	results[0].geometry.location;' . "\n";
		$this->content .= "\t\t\t\t\t" . 'addMarker(results[0].geometry.location,title,content,category,icon)' . "\n";
		$this->content .= "\t\t\t\t" . '}' . "\n";
		$this->content .= "\t\t\t" . '});' . "\n";
		$this->content .= "\t\t" . '}' . "\n";
		$this->content .= "\t" . '}' . "\n";

		// JS public function to center the gmaps dynamically
		$this->content .= "\t" . 'function geocodeCenter(address) {' . "\n";
		$this->content .= "\t\t" . 'if (geocoder) {' . "\n";
		$this->content .= "\t\t\t" . 'geocoder.geocode( { "address": address}, function(results, status) {' . "\n";
		$this->content .= "\t\t\t\t" . 'if (status == google.maps.GeocoderStatus.OK) {' . "\n";
		$this->content .= "\t\t\t\t" . 'map.setCenter(results[0].geometry.location);' . "\n";
		$this->content .= "\t\t\t\t" . '} else {' . "\n";
		$this->content .= "\t\t\t\t" . 'alert("Geocode was not successful for the following reason: " + status);' . "\n";
		$this->content .= "\t\t\t\t" . '}' . "\n";
		$this->content .= "\t\t\t" . '});' . "\n";
		$this->content .= "\t\t" . '}' . "\n";
		$this->content .= "\t" . '}' . "\n";

		// JS public function to set direction
		$this->content .= "\t" . 'function addDirection(from,to) {' . "\n";
		$this->content .= "\t\t" . 'var request = {' . "\n";
		$this->content .= "\t\t" . 'origin:from, ' . "\n";
		$this->content .= "\t\t" . 'destination:to,' . "\n";
		$this->content .= "\t\t" . 'travelMode: google.maps.DirectionsTravelMode.DRIVING' . "\n";
		$this->content .= "\t\t" . '};' . "\n";
		$this->content .= "\t\t" . 'directionsService.route(request, function(response, status) {' . "\n";
		$this->content .= "\t\t" . 'if (status == google.maps.DirectionsStatus.OK) {' . "\n";
		$this->content .= "\t\t" . 'directions.setDirections(response);' . "\n";
		$this->content .= "\t\t" . '}' . "\n";
		$this->content .= "\t\t" . '});' . "\n";

		$this->content .= "\t\t" . 'if(infowindow) { infowindow.close(); }' . "\n";
		$this->content .= "\t" . '}' . "\n";

		// JS public function to show a category of marker
		$this->content .= "\t" . 'function showCategory(category) {' . "\n";
		$this->content .= "\t\t" . 'for (var i=0; i<gmarkers.length; i++) {' . "\n";
		$this->content .= "\t\t\t" . 'if (gmarkers[i].mycategory == category) {' . "\n";
		$this->content .= "\t\t\t\t" . 'gmarkers[i].setVisible(true);' . "\n";
		$this->content .= "\t\t\t" . '}' . "\n";
		$this->content .= "\t\t" . '}' . "\n";
		$this->content .= "\t" . '}' . "\n";

		// JS public function to hide a category of marker
		$this->content .= "\t" . 'function hideCategory(category) {' . "\n";
		$this->content .= "\t\t" . 'for (var i=0; i<gmarkers.length; i++) {' . "\n";
		$this->content .= "\t\t\t" . 'if (gmarkers[i].mycategory == category) {' . "\n";
		$this->content .= "\t\t\t\t" . 'gmarkers[i].setVisible(false);' . "\n";
		$this->content .= "\t\t\t" . '}' . "\n";
		$this->content .= "\t\t" . '}' . "\n";
		$this->content .= "\t\t" . 'if(infowindow) { infowindow.close(); }' . "\n";
		$this->content .= "\t" . '}' . "\n";

		// JS public function to hide all the markers
		$this->content .= "\t" . 'function hideAll() {' . "\n";
		$this->content .= "\t\t" . 'for (var i=0; i<gmarkers.length; i++) {' . "\n";
		$this->content .= "\t\t\t" . 'gmarkers[i].setVisible(false);' . "\n";
		$this->content .= "\t\t" . '}' . "\n";
		$this->content .= "\t\t" . 'if(infowindow) { infowindow.close(); }' . "\n";
		$this->content .= "\t" . '}' . "\n";

		// JS public function to show all the markers
		$this->content .= "\t" . 'function showAll() {' . "\n";
		$this->content .= "\t\t" . 'for (var i=0; i<gmarkers.length; i++) {' . "\n";
		$this->content .= "\t\t\t" . 'gmarkers[i].setVisible(true);' . "\n";
		$this->content .= "\t\t" . '}' . "\n";
		$this->content .= "\t\t" . 'if(infowindow) { infowindow.close(); }' . "\n";
		$this->content .= "\t" . '}' . "\n";

		// JS public function to hide/show a category of marker - TODO BUG
		$this->content .= "\t" . 'function toggleHideShow(category) {' . "\n";
		$this->content .= "\t\t" . 'for (var i=0; i<gmarkers.length; i++) {' . "\n";
		$this->content .= "\t\t\t" . 'if (gmarkers[i].mycategory === category) {' . "\n";
		$this->content .= "\t\t\t\t" . 'if (gmarkers[i].getVisible()===true) { gmarkers[i].setVisible(false); }' . "\n";
		$this->content .= "\t\t\t\t" . 'else gmarkers[i].setVisible(true);' . "\n";
		$this->content .= "\t\t\t" . '}' . "\n";
		$this->content .= "\t\t" . '}' . "\n";
		$this->content .= "\t\t" . 'if(infowindow) { infowindow.close(); }' . "\n";
		$this->content .= "\t" . '}' . "\n";

		// JS public function add a KML
		$this->content .= "\t" . 'function addKML(file) {' . "\n";
		$this->content .= "\t\t" . 'var ctaLayer = new google.maps.KmlLayer(file);' . "\n";
		$this->content .= "\t\t" . 'ctaLayer.setMap(map);' . "\n";
		$this->content .= "\t" . '}' . "\n";
	}
/**
 * GoogleMapAPI#generate() -> void
 *
 * Initialize the javascript code
 **/
	public function generate(){
		$this->init();

		//Fonction init()
		$this->content .= "\t" . 'function initialize() {' . "\n";
		$this->content .= "\t" . 'var myLatlng = new google.maps.LatLng(48.8792,2.34778);' . "\n";
		$this->content .= "\t" . 'var myOptions = {' . "\n";
		$this->content .= "\t\t" . 'zoom: ' . $this->zoom . ',' . "\n";
		$this->content .= "\t\t" . 'center: myLatlng,' . "\n";
		$this->content .= "\t\t" . 'mapTypeId: google.maps.MapTypeId.' . $this->mapType . "\n";
		$this->content .= "\t" . '}' . "\n";

		//Goole map Div Id
		$this->content .= "\t" . 'map = new google.maps.Map(document.getElementById("' . $this->id . '"), myOptions);' . "\n";

		// Center
		if ($this->enableAutomaticCenterZoom == true) {
			$lenLng = $this->maxLng - $this->minLng;
			$lenLat = $this->maxLat - $this->minLat;
			$this->minLng -= $lenLng * $this->coordCoef;
			$this->maxLng += $lenLng * $this->coordCoef;
			$this->minLat -= $lenLat * $this->coordCoef;
			$this->maxLat += $lenLat * $this->coordCoef;

			$minLat = number_format(floatval($this->minLat), 12, '.', '');
			$minLng = number_format(floatval($this->minLng), 12, '.', '');
			$maxLat = number_format(floatval($this->maxLat), 12, '.', '');
			$maxLng = number_format(floatval($this->maxLng), 12, '.', '');
			$this->content .= "\t\t\t" . 'var bds = new google.maps.LatLngBounds(new google.maps.LatLng(' . $minLat . ',' . $minLng . '),new google.maps.LatLng(' . $maxLat . ',' . $maxLng . '));' . "\n";
			$this->content .= "\t\t\t" . 'map.fitBounds(bds);' . "\n";
		} else {
			$this->content .= "\t" . 'geocodeCenter("' . $this->center . '");' . "\n";
		}

		$this->content .= "\t" . 'google.maps.event.addListener(map,"click",function(event) { if (event) { current_lat=event.latLng.lat();current_lng=event.latLng.lng(); }}) ;' . "\n";

		$this->content .= "\t" . 'directions.setMap(map);' . "\n";
		$this->content .= "\t" . 'directions.setPanel(document.getElementById("' . $this->directionId . '"))' . "\n";

		// add all the markers
		$this->content .= str_replace('gmap.', '', $this->contentMarker);

		// Clusterer JS
		if ($this->useClusterer == true) {
			$this->content .= "\t" . 'var markerCluster = new MarkerClusterer(map, gmarkers,{gridSize: ' . $this->gridSize . ', maxZoom: ' . $this->maxZoom . '});' . "\n";
		}

		$this->content .= '}' . "\n";

		// Chargement de la map a la fin du HTML
		$this->content .= "\t" . 'window.onload=initialize;' . "\n";

		//Fermeture du javascript
		$this->content .= '</script>' . "\n";
		return $this->content;
	}

	public function __toString(){
		
		if (($this->width != '') && ($this->height != '')) {
			$string = '<div id="' . $this->id . '" style="width:' . $this->width . ';height:' . $this->height . '"></div>';
		} else {
			$string = '<div id="' . $this->id . '" class="gmap"></div>';
		}
		
		$string .= '
		<script>
		
		var fn = function(){
			try{			
			var gmap = new GoogleMapAPI("'. $this->id .'", {
				
				zoom: 				' . $this->zoom . ',
				center: 			new google.maps.LatLng(48.8792, 2.34778),
				mapTypeId: 			google.maps.MapTypeId.' . $this->mapType . ',
				iconWidth:			'.$this->iconWidth.',
				iconHeight:			'.$this->iconHeight.',
				infoWindowWidth:	'.$this->infoWindowWidth.',
				infoWindowZoom:		'.$this->infoWindowZoom.',
				
				enableWindowZoom: 			'.json_encode($this->enableWindowZoom).',
				enableAutomaticCenterZoom:	'.json_encode($this->enableAutomaticCenterZoom).',
				
				displayDirectionFields :	'.json_encode($this->displayDirectionFields).',
				defaultHideMarker:			'.json_encode($this->defaultHideMarker).'
				
			});
		';
		
		// Center
		if ($this->enableAutomaticCenterZoom == true) {
			$lenLng = 			$this->maxLng - $this->minLng;
			$lenLat = 			$this->maxLat - $this->minLat;
			$this->minLng -= 	$lenLng * $this->coordCoef;
			$this->maxLng += 	$lenLng * $this->coordCoef;
			$this->minLat -= 	$lenLat * $this->coordCoef;
			$this->maxLat += 	$lenLat * $this->coordCoef;

			$minLat = number_format(floatval($this->minLat), 12, '.', '');
			$minLng = number_format(floatval($this->minLng), 12, '.', '');
			$maxLat = number_format(floatval($this->maxLat), 12, '.', '');
			$maxLng = number_format(floatval($this->maxLng), 12, '.', '');
			
			$string .= '
			var bds = new google.maps.LatLngBounds(
						new google.maps.LatLng(' . $minLat . ',' . $minLng . '), 
						new google.maps.LatLng(' . $maxLat . ',' . $maxLng . ')
					);
			gmap.map.fitBounds(bds);
			
			';
			
		} else {
			$string .='
				gmap.geocodeCenter("' . $this->center . '");
			';
		}
		
		$string .= '
			google.maps.event.addListener(gmap.map, "click", function(event) { 
				if (event) { 
					gmap.current_lat = event.latLng.lat();
					gmap.current_lng = event.latLng.lng(); 
				}
			});
			gmap.directions.setMap(gmap.map);
			gmap.directions.setPanel(document.getElementById("' . $this->directionId . '"))
			
		';

		// add all the markers
		$string .= $this->contentMarker;

		// Clusterer JS
		if ($this->useClusterer == true) {
			$string = '
				var markerCluster = new MarkerClusterer(map, gmarkers,{gridSize: ' . $this->gridSize . ', maxZoom: ' . $this->maxZoom . '});
			';
		}
		
		$string .= '
			$("'. $this->id .'").load = fn;
			}catch(er){console.log(er)}
		};
		
		Extends.ready(fn);
		
		</script>
		';
				
		return $string;
	}
}        
endif;
?>
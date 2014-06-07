/** section: DOM
 * document
 * L'objet document est probablement l'un des objets les plus importants du modèle objet javascript.
 * Il permet d'accéder à tous les éléments affichés sur la page, de contrôler les saisies, de modifier l'apparence et le contenu.
 **/
Object.extend(document, {
/**
 * document.navigator
 * Cette namespace permet de controler le type et la version du navigateur pour vos applications.
 **/
	navigator:{
		init:			false,
/**
 * document.navigator.client -> String
 * Contient le nom du navigateur en cours.
 **/
		client: 		'undefined',
/**
 * document.navigator.version -> String
 * Contient la version du navigateur en cours.
 **/
		version:		'undefined',
/**
 * document.navigator.vendor -> String
 **/
		vendor:			'',
/**
 * document.navigator.touchevent -> Boolean
 * Indique si le client supporte les evenements touchevent.
 **/	
		touchevent: 	false,
/**
 * document.navigator.css3Engine -> false | String
 **/
		css3Engine:		false,
/**
 * document.navigator.webkitEngine -> Boolean
 **/	
		webkitEngine:	false,
/**
 * document.navigator.mobile -> Boolean
 *
 * Indique que le navigateur est de type mobile (Smartphone ou Tablette).
 **/	
		mobile:			false,
/**
 * document.navigator.deviceMode -> String
 *
 * Cette attribut indique le mode de rendu de l'interface utilisé. Ci-après la liste des valeurs de l'attribut :
 *
 * * `auto`: La dectection du support se fera à partir du User Agent.
 * * `pc`: La constante document.navigator.mobile sera fixée à false donc en rendu PC.
 * * `mobile`: La constante document.navigator.mobile sera fixée à true donc en rendu Mobile et Tablette.
 * 
 **/		
		deviceMode:	'auto',
/**
 * document.navigator.css3
 * Liste des propriétées CSS supportées par le navigateur. 
 *
 * <p class="note">Cette liste de propriété est ajoutée en classe CSS sur la balise BODY.</p>
 **/	
		css3: 			{
/**
 * document.navigator.css3.animation -> Boolean
 **/
			animation:	 		false,
/**
 * document.navigator.css3.appareance -> Boolean
 **/
			appareance:	 		false,
/**
 * document.navigator.css3.backgroundOrigin -> Boolean
 **/
			backgroundOrigin: 	false,
/**
 * document.navigator.css3.backgroundSize -> Boolean
 **/
			backgroundSize: 	false,
/**
 * document.navigator.css3.boxShadow -> Boolean
 **/
			boxShadow: 			false,
/**
 * document.navigator.css3.boxSizing -> Boolean
 **/
			boxSizing:			false,
/**
 * document.navigator.css3.columns -> Boolean
 **/
			columns:			false,
/**
 * document.navigator.css3.outlineOffset -> Boolean
 **/
			outlineOffset:		false,
/**
 * document.navigator.css3.overflowScrolling -> Boolean
 **/
			overflowScrolling: 	false,
/**
 * document.navigator.css3.perspective -> Boolean
 **/
			perspective:		false,
/**
 * document.navigator.css3.resize -> Boolean
 **/
			resize:				false,
/**
 * document.navigator.css3.transform -> Boolean
 **/
			transform: 			false,
/**
 * document.navigator.css3.transition -> Boolean
 **/
			transition: 		false,
/**
 * document.navigator.css3.textShadow -> Boolean
 **/
			textShadow:			false,
/**
 * document.navigator.css3.userSelect -> Boolean
 **/
			userSelect:			false,
/**
 * document.navigator.css3.wordWrap -> Boolean
 **/
			wordWrap:			false
/**
 * document.navigator.css3.nextFrame() -> ?
 *
 * 
 **/
 
/**
 * document.navigator.css3.cancelFrame() -> ?
 *
 * 
 **/	
		},
/**
 * document.navigator.html5
 * Liste des API HTML5 supportées par le navigateur.
 *
 * <p class="note">La liste des api supportées sont ajoutées à la balise BODY en tant que classe CSS</p>
 **/		
		html5:	{
/**
 * document.navigator.html5.localStorage -> Boolean
 **/			
			localStorage:		false,
/**
 * document.navigator.html5.FileAPI -> Boolean
 **/
			FileAPI:			false,
/**
 * document.navigator.html5.FullScreen -> Boolean
 **/
			FullScreen:			false,
/**
 * document.navigator.html5.WebSocket -> Boolean
 **/
			WebSocket:			false
		},
/**
 * document.navigator.events -> Object
 * Nom des événements mappés.
 **/	
		events: 		null,
/**
 * document.navigator.initialize() -> void
 *
 * Initialise les paramètres de document.navigator.
 **/
		initialize:function(){
			if(this.init) return;
			this.init = true;
			
			//detection du navigateur.
			this._detectsBrowser();
			//detectection du périphérique
			switch(document.navigator.deviceMode){
				default:	
					this.mobile = navigator.userAgent.match(/Mobile/i);
					break;
				case 'pc':
					this.mobile = false;
					break;
				case 'mobile':
					this.mobile = true;
			}
			//detection des propriétés CSS3 supportées
			this._detectsCSS3();
			//detection des événements
			this._detectsEvent();
			//detection des API HTML5
			this._detectsHTML5Api();
		},
/*
 *
 **/
		_detectsBrowser:function(){
			var obj = Prototype.Browser;
			
			if(obj.IE){//override des méthodes du navigateur IE8 et moins
				/MSIE (\d+\.\d+);/.test(navigator.userAgent);
				this.client = 	'IE';
				this.version =	new Number(RegExp.$1);
				this.vendor =	'ms';
				
				if(this.version < 8){//rewrite basic js methode
					document.getElementById_back = 			document.getElementById;
					document.getElementsByClassName_back = 	document.getElementsByClassName;
					document.getElementsByName_back = 		document.getElementsByName;
					document.getElementsByTagName_back = 	document.getElementsByTagName;
					document.createElement_back = 			document.createElement;
						
					document.getElementById = 			function(){return $(document.getElementById_back.apply(document, $A(arguments)));};
					document.getElementsByClassName = 	function(){return $(document.getElementsByClassName_back.apply(document, $A(arguments)));};
					document.getElementsByName = 		function(){return $(document.getElementsByName_back.apply(document, $A(arguments)));};
					document.getElementsByTagName = 	function(){return $(document.getElementsByTagName_back.apply(document, $A(arguments)));};
					document.createElement = 			function(){return $(document.createElement_back.apply(document, $A(arguments)));};
				}
				return;
			}
			
			if(obj.Gecko){
				/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
				this.client = 		'Firefox';
				this.version = 		new Number(RegExp.$1);
				this.vendor =		'Moz';
				return;
			}
			
			if(obj.Opera){
				/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent);//test for Opera/x.x or Opera x.x (ignoring remaining decimal places);
				this.version = 		new Number(RegExp.$1); // capture x.x portion and store as a number
				this.client = 		'Opera';
				this.vendor =		'O';
				return;
			}
			
			if(obj.WebKit){
				
				this.webkitEngine = true;
				
				if(/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)){//chrome 
					this.version = new Number(RegExp.$1); // capture x.x portion and store as a number
					this.client = 'Chrome';
					
				}else if(/Android[\ \s](\d+\.\d+)/.test(navigator.userAgent)){
					this.version = new Number(RegExp.$1); // capture x.x portion and store as a number
					this.client = 'Android';
					
				}else{
					//safari ou autre navigateur
					if(/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
						this.client = 'Safari';
						this.version = new Number(RegExp.$1);
							
					}
				}
				this.vendor =		'webkit';
			}
		},
/* 
 *
 **/
 		_detectsCSS3:function(){
			for(var key in this.css3){
				document[key] = this.css3[key] = this.supportsCSSProperty(key);
			}
						
			document.nextFrame = this.css3.nextFrame =	(function() {
				return window.requestAnimationFrame
					|| window.webkitRequestAnimationFrame
					|| window.mozRequestAnimationFrame
					|| window.oRequestAnimationFrame
					|| window.msRequestAnimationFrame
					|| function(callback) { return setTimeout(callback, 1); }
			})();
			
			document.cancelFrame = this.css3.cancelFrame = (function () {
				return window.cancelRequestAnimationFrame
					|| window.webkitCancelRequestAnimationFrame
					|| window.mozCancelRequestAnimationFrame
					|| window.oCancelRequestAnimationFrame
					|| window.msCancelRequestAnimationFrame
					|| clearTimeout
			})();
		},
/* 
 *
 **/
 		_detectsEvent:function(){
			this.touchevent = 'ontouchstart' in document.documentElement;
			
			//Event Map
			this.events = {
				resize: 	'onorientationchange' in window ? 'orientationchange' : 'resize',
				wheel:		this.vendor == 'Moz' ? 'DOMMouseScroll' : 'mousewheel'
			};
			
			document.events = this.events;
			//
			// Surcharge des méthodes Event.pointerX et Event.pointerY
			//
			if(this.touchevent){
				Event.pointerY_ = Event.pointerY;
				Event.pointerX_ = Event.pointerX;
				
				Event.pointerX = function(event){
					
					if(event.touches && event.touches.length != 0){
						return event.touches[0].pageX;
					}
					
					if(event.changedTouches && event.changedTouches.length != 0){
						return event.changedTouches[0].pageX;				
					}
					
					return Event.pointerX_(event);
				};
				
				Event.pointerY = function(event){
					if(event.touches && event.touches.length != 0){
						return event.touches[0].pageY;
					}
					
					if(event.changedTouches && event.changedTouches.length != 0){
						return event.changedTouches[0].pageY;				
					}
					
					return Event.pointerY_(event);
				};
			}
			
		},
/*
 *
 **/
 		_detectsHTML5Api:function(){
			
			//FullScreen API
			if(document.documentElement.requestFullScreen){
				this.html5.FullScreen = true;
				
				Element.addMethods({
					onFullScreenChange:function(element, callback){
						element.onfullscreenchange = callback;
					}
				});
				
			}else if(document.documentElement.webkitRequestFullScreen){
				this.html5.FullScreen = true;
				Element.addMethods({
					requestFullScreen:function(element){
						return element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
					},
					
					cancelFullScreen:function(element){
						return document.webkitCancelFullScreen();	
					},
					
					onFullScreenChange:function(element, callback){
						element.onwebkitfullscreenchange  = callback;
					}
				});
			}else if(document.documentElement.mozRequestFullScreen){
				this.html5.FullScreen = true;
				Element.addMethods({
					requestFullScreen:function(element){
						return element.mozRequestFullScreen();
					},
					
					cancelFullScreen:function(element){
						return document.mozCancelFullScreen();	
					},
					
					onFullScreenChange:function(element, callback){
						element.onmozfullscreenchange  = callback;
					}
				});
			}
			
			document.isFullScreenMode = function() {
			  // Note that the browser fullscreen (triggered by short keys) might
			  // be considered different from content fullscreen when expecting a boolean
			  return ((document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard methods
				  (!document.mozFullScreen && !document.webkitIsFullScreen));                   // current working methods
			};
			
			//FileAPI
			this.html5.FileAPI = !Object.isUndefined(window['FileReader']);
			
			//WebSocket
			if(window.WebSocket){
				this.html5.WebSocket = true;
			}else if(window.MozWebSocket) {
				this.html5.WebSocket = true;
				window.WebSocket = window.MozWebSocket;
			}
			
			//localstorage
			this.html5.localStorage = !Object.isUndefined(window['localStorage']);
		},
/**
 * document.navigator.supportsCSSProperty(property) -> void
 *
 * Cette méthode détermine si le navigateur supporte une propriété CSS.
 **/		
		supportsCSSProperty: function(key) {
			var vendor = this.vendor + key.slice(0,1).toUpperCase() + key.slice(1, key.length);
			return vendor in document.documentElement.style || key in document.documentElement.style;
		},
/**
 * document.navigator.writeClass() -> void
 *
 * Cette méthode écrit les classes CSS de détection des technologies disponibles sur le support.
 **/		
		writeClass: function(){
						
			switch(this.vendor){
				case 'ms':
					if(this.mobile){
						$Body.className = 'mobile wp wp7';
					}else{
						if(this.client == 'IE'){
							if(this.version < 8){
								$Body = $($Body);						
							}
							
							$Body.addClassName('ie ie-' + this.version);
							
							if(this.version < 8){
								$Body.addClassName('ie-lt-8');
							}
							
							if(this.version < 9){
								$Body.addClassName('ie-lt-9');
							}
							
							if(this.version < 10){//support des dégradés
								$Body.addClassName('ie-lt-10');
							}
						}
						
						$Body.addClassName('pc device-pc');
					}
					break;
				case 'Moz':
					$Body.addClassName('gecko');
					
					if(this.mobile){
						$Body.addClassName('mobile');
					}else{
						$Body.addClassName('pc device-pc');
					}
					
					break;
				case 'webkit':
					$Body.addClassName('webkit');
					
					if(this.mobile){
						$Body.addClassName('mobile');
						
						if(window.navigator.userAgent.match(/Android/)){
							 $Body.addClassName('android');
						}
						
						if(window.navigator.userAgent.match(/iPad/)){
							$Body.addClassName('ios ipad');
						}
						
						if(window.navigator.userAgent.match(/iPhone/)){
							$Body.addClassName('ios iphone');
						}
						
						if(window.navigator.userAgent.match(/iPod/)){
							$Body.addClassName('ios iphone ipod');
						}	
					}else{
						$Body.addClassName('pc device-pc');
					}
					
					break;
				
			}
						
			for(var key in this.css3){
				if(key == 'perspective'){
					$Body.addClassName(this.css3[key] ? '3d' : 'no-3d');
				}
				
				$Body.addClassName(this.css3[key] ? key.toLowerCase() : 'no-' + key.toLowerCase());
			}
			
			for(var key in this.html5){		
				$Body.addClassName(this.html5[key] ? key.toLowerCase() : 'no-' + key.toLowerCase());
			}
			
			$Body.addClassName(this.touchevent ? 'touchevent' : 'no-touchevent');
			
		},
/**
 * document.navigator.parseGet() -> Array
 *
 * Parse le champs GET de l'URL qui execute le script et retourne le tableau associatif des paramètres.
 **/
		parseGet:function(){
			var string = window.location.search;
			string = string.substr(1, string.length-1);
			var tab = string.split('&');
			$_GET = {};
			for(var i = 0; i < tab.length; i++){
				var tmp = tab[i].split('=');
				$_GET[tmp[0]] = tmp[1];
			}
			return $_GET;
		},
/**
 * document.navigator.S_GET(key) -> String
 * - key(String): La clef recherchée.
 *
 * Retourne la valeur de la clef contenu dans le tableau $_GET.
 *
 * <p class="note">Le nom de la méhode est document.navigator.$_GET(key). Le parser PDOC pose problème avec le caractère $.</p>
 *
 **/
		$_GET: function(key){
			return $_GET[key];
		}
	},
/**
 * document.stage
 * Donne les informations sur la stage comme la hauteur et la largeur
 * de la scène, c'est-à-dire la partie visible de la page HTML.
 **/
	stage: {
/**
 * document.stage.stageHeight -> Number
 * Donne la hauteur du corps visible de la page HTML.
 **/
		stageHeight:0,
/**
 * document.stage.stageWidth -> Number
 * Donne la largeur du corps visible de la page HTML.
 **/
		stageWidth:0,
/**
 * document.stage.getDimensions() -> Object
 * 
 * Donne la dimensions de la scène Body.
 * 
 * ##### Composition de l'objet de retour 
 *	
 *     {
 *          0: {@link Number} largeur,
 *          1: {@link Number} hauteur,
 *          'height' : {@link Number} height,
 *          'width' : {@link Number} largeur
 *     }
 *
 **/
		getDimensions:function(){
			
			var div = new Node('div');
			
			div.css('position', 'fixed');
			div.css('bottom', '0px');
			div.css('right', '0px');
			div.css('height', '1px');
			div.css('width', '1px');
						
			document.body.appendChild(div);
						
			this.stageWidth = 	Element.cumulativeOffset(div).left+1;
			this.stageHeight = 	Element.cumulativeOffset(div).top+1;
			
			document.body.removeChild(div);
			
			return {
				'0': 	this.stageWidth,
				'1': 	this.stageHeight, 
				height:	this.stageHeight, 
				width:	this.stageWidth
			};
		},
/**
 * document.stage.resize(callback) -> void
 * - callback (Function): Fonction.
 *
 * Cette méthode enregistre une fonction sur l'événement `window.onresize`. Cette fonction sera appelée dès que l'utilisateur redimensionnera la fenêtre
 * du navigateur.
 **/	
		resize: function(callback){
			Extends.observe('resize', callback);
		}
	},
/**
 * document.get_html_translation_table(table, quotestyle) -> Object
 * - table (Array): table de conversion.
 * - quotestyle (String): Type de conversion.
 *
 * Table de translation HTML.
 *
 * Développé par Philip Peterson.
 **/
	get_html_translation_table: function(table, quote_style) {
		// http://kevin.vanzonneveld.net
		// +   original by: Philip Peterson
		// +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   bugfixed by: noname
		// +   bugfixed by: Alex
		// +   bugfixed by: Marco
		// +   bugfixed by: madipta
		// +   improved by: KELAN
		// +   improved by: Brett Zamir (http://brett-zamir.me)
		// +   bugfixed by: Brett Zamir (http://brett-zamir.me)
		// +      input by: Frank Forte
		// +   bugfixed by: T.Wild
		// +      input by: Ratheous
		// %          note: It has been decided that we're not going to add global
		// %          note: dependencies to php.js, meaning the constants are not
		// %          note: real constants, but strings instead. Integers are also supported if someone
		// %          note: chooses to create the constants themselves.
		// *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
		// *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
		
		var entities = {}, hash_map = {}, decimal = 0, symbol = '';
		var constMappingTable = {}, constMappingQuoteStyle = {};
		var useTable = {}, useQuoteStyle = {};
		
		// Translate arguments
		constMappingTable[0]      = 'HTML_SPECIALCHARS';
		constMappingTable[1]      = 'HTML_ENTITIES';
		constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
		constMappingQuoteStyle[2] = 'ENT_COMPAT';
		constMappingQuoteStyle[3] = 'ENT_QUOTES';
	 
		useTable       = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
		useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';
	 
		if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
			throw new Error("Table: "+useTable+' not supported');
			// return false;
		}
	 
		entities['38'] = '&amp;';
		if (useTable === 'HTML_ENTITIES') {
			entities['160'] = '&nbsp;';
			entities['161'] = '&iexcl;';
			entities['162'] = '&cent;';
			entities['163'] = '&pound;';
			entities['164'] = '&curren;';
			entities['165'] = '&yen;';
			entities['166'] = '&brvbar;';
			entities['167'] = '&sect;';
			entities['168'] = '&uml;';
			entities['169'] = '&copy;';
			entities['170'] = '&ordf;';
			entities['171'] = '&laquo;';
			entities['172'] = '&not;';
			entities['173'] = '&shy;';
			entities['174'] = '&reg;';
			entities['175'] = '&macr;';
			entities['176'] = '&deg;';
			entities['177'] = '&plusmn;';
			entities['178'] = '&sup2;';
			entities['179'] = '&sup3;';
			entities['180'] = '&acute;';
			entities['181'] = '&micro;';
			entities['182'] = '&para;';
			entities['183'] = '&middot;';
			entities['184'] = '&cedil;';
			entities['185'] = '&sup1;';
			entities['186'] = '&ordm;';
			entities['187'] = '&raquo;';
			entities['188'] = '&frac14;';
			entities['189'] = '&frac12;';
			entities['190'] = '&frac34;';
			entities['191'] = '&iquest;';
			entities['192'] = '&Agrave;';
			entities['193'] = '&Aacute;';
			entities['194'] = '&Acirc;';
			entities['195'] = '&Atilde;';
			entities['196'] = '&Auml;';
			entities['197'] = '&Aring;';
			entities['198'] = '&AElig;';
			entities['199'] = '&Ccedil;';
			entities['200'] = '&Egrave;';
			entities['201'] = '&Eacute;';
			entities['202'] = '&Ecirc;';
			entities['203'] = '&Euml;';
			entities['204'] = '&Igrave;';
			entities['205'] = '&Iacute;';
			entities['206'] = '&Icirc;';
			entities['207'] = '&Iuml;';
			entities['208'] = '&ETH;';
			entities['209'] = '&Ntilde;';
			entities['210'] = '&Ograve;';
			entities['211'] = '&Oacute;';
			entities['212'] = '&Ocirc;';
			entities['213'] = '&Otilde;';
			entities['214'] = '&Ouml;';
			entities['215'] = '&times;';
			entities['216'] = '&Oslash;';
			entities['217'] = '&Ugrave;';
			entities['218'] = '&Uacute;';
			entities['219'] = '&Ucirc;';
			entities['220'] = '&Uuml;';
			entities['221'] = '&Yacute;';
			entities['222'] = '&THORN;';
			entities['223'] = '&szlig;';
			entities['224'] = '&agrave;';
			entities['225'] = '&aacute;';
			entities['226'] = '&acirc;';
			entities['227'] = '&atilde;';
			entities['228'] = '&auml;';
			entities['229'] = '&aring;';
			entities['230'] = '&aelig;';
			entities['231'] = '&ccedil;';
			entities['232'] = '&egrave;';
			entities['233'] = '&eacute;';
			entities['234'] = '&ecirc;';
			entities['235'] = '&euml;';
			entities['236'] = '&igrave;';
			entities['237'] = '&iacute;';
			entities['238'] = '&icirc;';
			entities['239'] = '&iuml;';
			entities['240'] = '&eth;';
			entities['241'] = '&ntilde;';
			entities['242'] = '&ograve;';
			entities['243'] = '&oacute;';
			entities['244'] = '&ocirc;';
			entities['245'] = '&otilde;';
			entities['246'] = '&ouml;';
			entities['247'] = '&divide;';
			entities['248'] = '&oslash;';
			entities['249'] = '&ugrave;';
			entities['250'] = '&uacute;';
			entities['251'] = '&ucirc;';
			entities['252'] = '&uuml;';
			entities['253'] = '&yacute;';
			entities['254'] = '&thorn;';
			entities['255'] = '&yuml;';
		}
	 
		if (useQuoteStyle !== 'ENT_NOQUOTES') {
			entities['34'] = '&quot;';
		}
		if (useQuoteStyle === 'ENT_QUOTES') {
			entities['39'] = '&#39;';
		}
		entities['60'] = '&lt;';
		entities['62'] = '&gt;';
	 
	 
		// ascii decimals to real symbols
		for (decimal in entities) {
			symbol = String.fromCharCode(decimal);
			hash_map[symbol] = entities[decimal];
		}
		
		return hash_map;
	}
});

function $CSS3(key){
	return document.navigator.css3[key] || key;
};

function $EV(key){return document.navigator.events[key] || key};
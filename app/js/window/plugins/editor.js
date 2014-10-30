/** section: UI
 * class Editor < TabControl
 *
 * Cette classe gère l'intégration de l'editeur TinyMce dans la bibliothèque Window.
 * Elle permet de créer des éditeurs de texte et ajoute des fonctionnalités supplémentaire 
 * à l'editeur TinyMce.
 *
 * <p class="note">version 0.1 - Window 2.2</p>
 * <p class="note">Cette classe est définie dans le fichier window.editor.js</p>
 **/
include(Extends.Path('external') + 'tiny_mce/tiny_mce.js');

var Editor = function(){
	
	if(Object.isUndefined($WR.Editors)){
		$WR.Editors = 0;
	}else $WR.Editors++;
	
	var tab = new TabControl();
	tab.EDITOR_ID = $WR.Editors;
	
	Object.extend(tab, this);
	tab.initialize.apply(tab, $A(arguments));

	return tab;
};

Object.extend(Editor, {
/**
 * Editor.HTMLToStr(String) -> String
 **/
	HTMLToStr: function(content) {
		return content;
		
		var blocklist1, blocklist2, preserve_linebreaks = false, preserve_br = false;

		// Protect pre|script tags
		if ( content.indexOf('<pre') != -1 || content.indexOf('<script') != -1 ) {
			preserve_linebreaks = true;
			content = content.replace(/<(pre|script)[^>]*>[\s\S]+?<\/\1>/g, function(a) {
				a = a.replace(/<br ?\/?>(\r\n|\n)?/g, '<wp-temp-lb>');
				return a.replace(/<\/?p( [^>]*)?>(\r\n|\n)?/g, '<wp-temp-lb>');
			});
		}

		// keep <br> tags inside captions and remove line breaks
		if ( content.indexOf('[caption') != -1 ) {
			preserve_br = true;
			content = content.replace(/\[caption[\s\S]+?\[\/caption\]/g, function(a) {
				return a.replace(/<br([^>]*)>/g, '<wp-temp-br$1>').replace(/[\r\n\t]+/, '');
			});
		}

		// Pretty it up for the source editor
		blocklist1 = 'blockquote|ul|ol|li|table|thead|tbody|tfoot|tr|th|td|div|h[1-6]|p|fieldset';
		content = content.replace(new RegExp('\\s*</('+blocklist1+')>\\s*', 'g'), '</$1>\n');
		content = content.replace(new RegExp('\\s*<((?:'+blocklist1+')(?: [^>]*)?)>', 'g'), '\n<$1>');

		// Mark </p> if it has any attributes.
		content = content.replace(/(<p [^>]+>.*?)<\/p>/g, '$1</p#>');

		// Sepatate <div> containing <p>
		content = content.replace(/<div( [^>]*)?>\s*<p>/gi, '<div$1>\n\n');

		// Remove <p> and <br />
		content = content.replace(/\s*<p>/gi, '');
		content = content.replace(/\s*<\/p>\s*/gi, '\n\n');
		content = content.replace(/\n[\s\u00a0]+\n/g, '\n\n');
		content = content.replace(/\s*<br ?\/?>\s*/gi, '\n');

		// Fix some block element newline issues
		content = content.replace(/\s*<div/g, '\n<div');
		content = content.replace(/<\/div>\s*/g, '</div>\n');
		content = content.replace(/\s*\[caption([^\[]+)\[\/caption\]\s*/gi, '\n\n[caption$1[/caption]\n\n');
		content = content.replace(/caption\]\n\n+\[caption/g, 'caption]\n\n[caption');

		blocklist2 = 'blockquote|ul|ol|li|table|thead|tbody|tfoot|tr|th|td|h[1-6]|pre|fieldset';
		content = content.replace(new RegExp('\\s*<((?:'+blocklist2+')(?: [^>]*)?)\\s*>', 'g'), '\n<$1>');
		content = content.replace(new RegExp('\\s*</('+blocklist2+')>\\s*', 'g'), '</$1>\n');
		content = content.replace(/<li([^>]*)>/g, '\t<li$1>');

		if ( content.indexOf('<hr') != -1 ) {
			content = content.replace(/\s*<hr( [^>]*)?>\s*/g, '\n\n<hr$1>\n\n');
		}

		if ( content.indexOf('<object') != -1 ) {
			content = content.replace(/<object[\s\S]+?<\/object>/g, function(a){
				return a.replace(/[\r\n]+/g, '');
			});
		}

		// Unmark special paragraph closing tags
		content = content.replace(/<\/p#>/g, '</p>\n');
		content = content.replace(/\s*(<p [^>]+>[\s\S]*?<\/p>)/g, '\n$1');

		// Trim whitespace
		content = content.replace(/^\s+/, '');
		content = content.replace(/[\s\u00a0]+$/, '');

		// put back the line breaks in pre|script
		if ( preserve_linebreaks )
			content = content.replace(/<wp-temp-lb>/g, '\n');

		// and the <br> tags in captions
		if ( preserve_br )
			content = content.replace(/<wp-temp-br([^>]*)>/g, '<br$1>');

		return content;
	},
/**
 * Editor.strToHTML(String) -> String
 **/	
	strToHTML: function(pee) {
		var preserve_linebreaks = false, preserve_br = false,
			blocklist = 'table|thead|tfoot|tbody|tr|td|th|caption|col|colgroup|div|dl|dd|dt|ul|ol|li|pre|select|form|blockquote|address|math|p|h[1-6]|fieldset|legend|hr|noscript|menu|samp|header|footer|article|section|hgroup|nav|aside|details|summary';

		if ( pee.indexOf('<object') != -1 ) {
			pee = pee.replace(/<object[\s\S]+?<\/object>/g, function(a){
				return a.replace(/[\r\n]+/g, '');
			});
		}

		pee = pee.replace(/<[^<>]+>/g, function(a){
			return a.replace(/[\r\n]+/g, ' ');
		});

		// Protect pre|script tags
		if ( pee.indexOf('<pre') != -1 || pee.indexOf('<script') != -1 ) {
			preserve_linebreaks = true;
			pee = pee.replace(/<(pre|script)[^>]*>[\s\S]+?<\/\1>/g, function(a) {
				return a.replace(/(\r\n|\n)/g, '<wp-temp-lb>');
			});
		}

		// keep <br> tags inside captions and convert line breaks
		if ( pee.indexOf('[caption') != -1 ) {
			preserve_br = true;
			pee = pee.replace(/\[caption[\s\S]+?\[\/caption\]/g, function(a) {
				// keep existing <br>
				a = a.replace(/<br([^>]*)>/g, '<wp-temp-br$1>');
				// no line breaks inside HTML tags
				a = a.replace(/<[a-zA-Z0-9]+( [^<>]+)?>/g, function(b){
					return b.replace(/[\r\n\t]+/, ' ');
				});
				// convert remaining line breaks to <br>
				return a.replace(/\s*\n\s*/g, '<wp-temp-br />');
			});
		}

		pee = pee + '\n\n';
		pee = pee.replace(/<br \/>\s*<br \/>/gi, '\n\n');
		pee = pee.replace(new RegExp('(<(?:'+blocklist+')(?: [^>]*)?>)', 'gi'), '\n$1');
		pee = pee.replace(new RegExp('(</(?:'+blocklist+')>)', 'gi'), '$1\n\n');
		pee = pee.replace(/<hr( [^>]*)?>/gi, '<hr$1>\n\n'); // hr is self closing block element
		pee = pee.replace(/\r\n|\r/g, '\n');
		pee = pee.replace(/\n\s*\n+/g, '\n\n');
		pee = pee.replace(/([\s\S]+?)\n\n/g, '<p>$1</p>\n');
		pee = pee.replace(/<p>\s*?<\/p>/gi, '');
		pee = pee.replace(new RegExp('<p>\\s*(</?(?:'+blocklist+')(?: [^>]*)?>)\\s*</p>', 'gi'), "$1");
		pee = pee.replace(/<p>(<li.+?)<\/p>/gi, '$1');
		pee = pee.replace(/<p>\s*<blockquote([^>]*)>/gi, '<blockquote$1><p>');
		pee = pee.replace(/<\/blockquote>\s*<\/p>/gi, '</p></blockquote>');
		pee = pee.replace(new RegExp('<p>\\s*(</?(?:'+blocklist+')(?: [^>]*)?>)', 'gi'), "$1");
		pee = pee.replace(new RegExp('(</?(?:'+blocklist+')(?: [^>]*)?>)\\s*</p>', 'gi'), "$1");
		pee = pee.replace(/\s*\n/gi, '<br />\n');
		pee = pee.replace(new RegExp('(</?(?:'+blocklist+')[^>]*>)\\s*<br />', 'gi'), "$1");
		pee = pee.replace(/<br \/>(\s*<\/?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)>)/gi, '$1');
		pee = pee.replace(/(?:<p>|<br ?\/?>)*\s*\[caption([^\[]+)\[\/caption\]\s*(?:<\/p>|<br ?\/?>)*/gi, '[caption$1[/caption]');

		pee = pee.replace(/(<(?:div|th|td|form|fieldset|dd)[^>]*>)(.*?)<\/p>/g, function(a, b, c) {
			if ( c.match(/<p( [^>]*)?>/) )
				return a;

			return b + '<p>' + c + '</p>';
		});

		// put back the line breaks in pre|script
		if ( preserve_linebreaks )
			pee = pee.replace(/<wp-temp-lb>/g, '\n');

		if ( preserve_br )
			pee = pee.replace(/<wp-temp-br([^>]*)>/g, '<br$1>');
			
		if(pee.trim() == '<br />'){
			return '';	
		}
		
		return pee;
	}
});

Editor.prototype = {
/**
 * Editor#TinyMce -> TinyMce
 * Instance de TinyMce une fois l'éditeur chargé.
 **/
	TinyMce: 		null,
/**
 * Editor#TinyMceOptions -> Object
 * Options de configuration de l'éditeur TinyMCE
 **/
	TinyMceOptions: null,
/**
 * Editor#TinyMceInit -> Boolean
 **/
	TinyMceInit: 	false,
/**
 * new Editor([options])
 * - options (Object): Options de configuration de l'éditeur.
 *
 * Cette méthode Cette méthode créée une nouvelle instance de l'editeur de texte.
 *
 * #### Le paramètre options
 *
 * Ce paramètre vous permet de configurer l'instance [[Editor]]. Ci-dessous, la liste des attributs de l'objet `options` :
 * 
 * * `options.media`: Active la prise en charge des médias avec FileManager. Désactivée par défaut.
 * * `options.source`: Active la l'affichage du code source. Activée par défaut.
 * * `options.height`: Hauteur de l'éditeur (ex : height: 500px).
 * * `options.width`: Largeur de l'éditeur (ex : height: 300px).
 * 
 * Le paramètre `options` prend en charge tous les attributs de l'editeur TinyMCE. Pour plus d'information rendez-vous sur le site officiel de TinyMCE.
 **/
	initialize: function(obj){
		
		this.Observer = new Observer();
		this.Observer.bind(this);
				
		var options = {
			//plugins: 							"autolink,lists,spellchecker,style,layer,table,advimage,advlink,emotions,iespell,directionality,noneditable,visualchars",
			plugins:							"autolink,lists,spellchecker,pagebreak,style,layer,table,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,searchreplace,print,contextmenu,paste,directionality,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
			convert_urls:						false,
			source:								true,
			media:								false,
			language:							'fr',
			width:								'500px',
			height:								'300px',
			mode : 								"exact",
			elements : 							'editor' + this.EDITOR_ID,
			theme : 							"advanced",
			skin : 								"window",
			//skin_variant:						"silver",
			theme_advanced_toolbar_location:	'top',
			theme_advanced_toolbar_align: 		'left',
			theme_advanced_statusbar_location: 	'bottom',
			theme_advanced_resizing : 			false,
			
			extended_valid_elements:'article[*],aside[*],audio[*],canvas[*],command[*],datalist[*],details[*],embed[*],figcaption[*],figure[*],footer[*],header[*],hgroup[*],keygen[*],mark[*],meter[*],nav[*],output[*],progress[*],section[*],source[*],summary,time[*],video[*],wbr',
			//skin_variant : 						"black",*/
				
			// Theme options
			theme_advanced_buttons1 : 			"formatselect,bold,italic,underline,strikethrough,|,bullist,numlist,blockquote,|,justifyleft,justifycenter,justifyright,justifyfull,|,link,unlink,",
			theme_advanced_buttons2 : 			"fontselect,fontsizeselect,|,forecolor,backcolor,pastetext,pasteword,removeformat,|,outdent,indent,|,charmap",
			theme_advanced_buttons3 : 			"",
			
			formats: {
				alignleft : [
					{selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles : {textAlign : 'left'}},
					{selector : 'img,table', classes : 'alignleft'}
				],
				aligncenter : [
					{selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles : {textAlign : 'center'}},
					{selector : 'img,table', classes : 'aligncenter'}
				],
				alignright : [
					{selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles : {textAlign : 'right'}},
					{selector : 'img,table', classes : 'alignright'}
				],
				strikethrough : {inline : 'del'}
			},
						
			setup: this.setup.bind(this)
		};
				
		if(!Object.isUndefined(obj)) Object.extend(options, obj);
		
		if(options.width == '100%') this.setStyle('width:100%');
		else this.setStyle('width:'+ options.width);
		
		this.addClassName('editor');
		//
		// Panel
		// 
		this.BtnEditor = 	this.addPanel($MUI('Visuel'), this.createPanelEditor(options)).on('click', this.onClickEditor.bind(this));
		this.ButtonHTML = 	this.addPanel($MUI('HTML'), this.createPanelSource(options)).on('click', this.onClickSource.bind(this));
				
		this.TinyMceOptions = 	options;
		this.TinyMceInit =		false;
		
		if(!options.source){
			this.ButtonHTML.hide();
		}
		
		if(Object.isFunction(options.media)){
			this.ButtonMedia(options.media);
		}
	},
/**
 * Editor#ButtonMedia(fn) -> SimpleMenu
 **/	
	ButtonMedia: function(obj){
		
		if(this.BtnMedia) return this.BtnMedia;
		
		if(!this.TinyMceOptions.theme_advanced_buttons2.match(/media/) && !this.TinyMceOptions.theme_advanced_buttons1.match(/media/)){
			this.TinyMceOptions.theme_advanced_buttons2 += 	',media';
		}
		
		this.on('setup', function(){
			
			this.TinyMce.addButton('media', {
				title: 'FileManager',
				onclick: function(){
					this.Observer.fire('click.media', this.onJoin.bind(this));	
				}.bind(this)
			});
			
		}.bind(this));
		
		this.BtnMedia = new SimpleButton({text:$MUI('Médias')});
		this.BtnMedia.setIcon('multimedia');
				
		this.BtnMedia.on('click',function(){
			this.Observer.fire('click.media', this.onJoin.bind(this));
		}.bind(this));
		
		this.Header().appendChild(this.BtnMedia);
				
		this.on('click.media', obj);
		
		return this.BtnMedia;
	},
/**
 * Editor#createPanelEditor(options) -> Node
 *
 * Cette méthode créée le panneau contenant l'éditeur TinyMCE.
 **/
	createPanelEditor: function(options){
		//
		// Panel
		//
		var panel = 			new Panel({style:'min-height:' + options.height +';padding:0px;min-width:' + options.width + ';'});
		panel.addClassName('panel-editor');
		//
		// TextAreaEditor
		//
		this.TextAreaEditor = 	new Node('textarea', {style:'width:'+options.width+'px;height:' +options.height +'px', id:'editor' + this.EDITOR_ID});
		panel.appendChild(this.TextAreaEditor);
		
		return panel;
	},
/**
 * Editor#createPanelSource(options) -> Node
 *
 * Cette méthode créée le panneau contenant l'éditeur de code source.
 **/	
	createPanelSource: function(options){
		//
		// Panel
		//
		var panel = 			new Panel({style:'height:' + options.height +';padding:5px;width:' + options.width + ';'});
		panel.addClassName('panel-source');
		//
		// TextAreaEditor
		//
		this.TextAreaSource = 	new Node('textarea', {style:'width:calc(100% - 10px); height:calc(100% - 10px);resize:none'});
		panel.appendChild(this.TextAreaSource);
		
		this.TextAreaSource.observe('keyup', this.onKeyUpSource.bind(this));
		
		return panel;
	},
/**
 * Editor#observe(eventName, callback) -> Window
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `setup` : Est déclenché lorsque l'éditeur TinyMCE s'installe.
 * * `click.media` : Est déclenché lorsque le bouton FileManager est cliqué par l'utilisateur.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	observe: function(eventName, callback){
		switch(eventName){
			case 'click.media': 
			case 'setup': 		
			case 'join':	
								this.Observer.observe(eventName, callback);break;
			default:
				Event.observe(this, eventName, callback);
				break;	
		}
		return this;
	},
/**
 * Editor#load() -> void
 *
 * Cette méthode initialise l'éditeur TinyMCE.
 *
 * <p class="note">Cette méthode est à utiliser après avoir ajouter l'instance [[Editor]] au DOM avec la méthode Element.appendChild</p>
 **/
	load: function(){
		tinyMCE.init(this.TinyMceOptions);
		this.TinyMceInit = true;
	},
		
	focus:function(){
		this.getTinyMce().focus();
	},
/**
 * Editor#setup(ed) -> void
 **/	
	setup: function(ed){
		this.TinyMce = ed;
		this.TinyMce.parent = this;
		this.Observer.fire('setup', this);
	},
/**
 * Editor#stopObserving(eventName, callback) -> Window
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` associé à un nom d'événement `eventName`.
 **/
	stopObserving: function(eventName, callback){
		switch(eventName){
			case 'click.media': 
			case 'setup': 		
			case 'join':		this.Observer.stopObserving(eventName, callback);break;
			default:
				Event.stopObserving(this, eventName, callback);
				break;	
		}
		return this;
	},
/**
 * Editor#getTinyMce() -> TinyMCE
 *
 * Cette méthode retourne l'objet TinyMce associé à cette instance.
 **/
	getTinyMce: function(){
		return this.TinyMce;
	},
/**
 * Editor#onClickSource() -> void
 * 
 * Cette méthode intervient lorsque l'utilisateur clique sur l'onglet Mode code visualisation.
 **/	
	onClickEditor: function(){
		if(this.BtnMedia) this.BtnMedia.setStyle('display:inline-block');
		this.getTinyMce().setContent(Editor.HTMLToStr(this.TextAreaSource.value), {format:'raw'});
	},
/**
 * Editor#onClickSource() -> void
 * 
 * Cette méthode intervient lorsque l'utilisateur clique sur l'onglet Mode code source.
 **/	
	onClickSource: function(){
		this.TextAreaSource.value = Editor.strToHTML(this.getTinyMce().getContent());
		if(this.BtnMedia) this.BtnMedia.setStyle('display:none');
	},
/*
 * Editor#onKeyUpSource() -> void
 * 
 * Cette méthode intervient .
 **/
	onKeyUpSource: function(){
		this.getTinyMce().setContent(this.TextAreaSource.value);
	},

/**
 * Editor#onJoin(file) -> void
 **/	
	onJoin: function(file){
		
		var evt = new StopEvent(this);
		this.Observer.fire('join', evt, file);
		
		if(evt.stopped) return;
		
		switch(file.extension){
			case 'jpg':
			case 'gif':
			case 'bmp':
			case 'png':
				this.insert('<img src="' + file.uri + '" />');
				break;
			default:this.insert('<a href="'+file.uri+'">' + file.uri + '</a>');
		}
		
	},
/**
 * Editor#Value([value]) -> String
 * - value (`String`): Code couleur.
 *
 * Assigne ou/et retourne la valeur de l'instance.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new InputColor();
 *     c.Value('mavaleur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new InputColor();
 *     c.Value('mavaleur');
 *     alert(c.Value());//mavaleur
 *
 **/	
	Value:function(value){
		
		if(!Object.isUndefined(value)){
			if(this.TinyMceInit){
				this.getTinyMce().setContent(value);
			}else{
				this.TextAreaEditor.innerHTML = value;
			}
			
			this.TextAreaSource.innerHTML = value;
		}
		
		return this.TinyMceInit ? this.getTinyMce().getContent() : this.TextAreaEditor.value;
	},
/**
 * Editor#insert(html) -> void
 * Cette méthode insert du texte à l'endroit où est positionné le curseur.
 **/
	insert: function(html){
		this.getTinyMce().execCommand('mceInsertContent', false, html);
	}
};
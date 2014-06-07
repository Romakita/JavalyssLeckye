/** alias of: WindowRegister.getWindow
 * WindowRegister.getForm(id) -> Window
 * - id (Number): Identifiant du formulaire de chargement de fichier.
 * 
 * Retourne l'instance du formulaire de chargement de fichier.
 **/
function WinForm(id){
	return $WR.getWindow(id);
}
/** section: UI
 * class wLoader < Window
 * Fenêtre spécialisée pour le chargement de fichier depuis le poste client vers le serveur.
 **/
var WindowFormLoader = Class.from(Window);
var wLoader =	WindowFormLoader;
wLoader.prototype = {
	
/**
 * wLoader#AlertBox -> AlertBox
 * Instance de l'AlertBox relative à la fenêtre.
 **/
	Alert: 			null,
/**
 * wLoader#Select -> Select
 * Instance du champs d'option.
 **/	
	Select:				null,
/**
 * wLoader#Input -> Node
 * Instance du champs du champs.
 **/
	Input:				null,
/**
 * wLoader#Table -> TableData
 * Instance de gestionnaire de mise en forme des formulaires.
 **/
 	Table:				null,
/**
 * wLoader#Form -> FrameWorker
 * Instance FrameWorker
 **/
 	Form:				null,
/**
 * wLoader#link -> String
 * Lien de la passerelle PHP.
 **/
	link:				'',
	cmd:				'',
	parameters:			'',
/**
 * new wLoader([options])
 * - options (Object): Object de configuration.
 *
 * Cette méthode créée une nouvelle instance de wLoader.
 * 
 * #### Attributs du paramètre options
 * 
 * Le constructeur prend en charge un paramètre `options` permettant de configurer l'instance rapidement. En plus des options
 * supporté par la classe [[Window]] sont ajoutés les options suivantes :
 *
 * * `title` (`String`): Titre à afficher dans le splite.
 * * `subtitle` (`String`): Sous-titre à afficher dans le splite.
 * * `select` (`Boolan`): Affiche une liste pour les options de chargement.
 * * `options` (`Array`): Liste des options à afficher dans le champs select.
 * * `link` (`String`): Lien de la passerelle PHP pour récupérer la liste.
 * * `onComplete` (`Function`): Fonction appelée après chargement des données.
 * * `debug` (`boolean`): Active l'affichage de l'iframe pour le debug.
 *
 **/
	initialize: function(obj){
		this.addClassName('wloader');
		
		var options = {
			options:	[],
			title: 		$MUI('Importation de fichier depuis votre ordinateur') ,
			text:		$MUI('Choisissez un fichier à importer')+ ' : ',
			subtitle:	'',
			select:		false,
			link:		'',
			debug: 		false,
			cmd:		'cmd',
			//flash:		false,
			maxSize:	2097152,
			parameters:	{}
		};
			
		if(!Object.isUndefined(obj)) Object.extend(options, obj);
		
		this.maxSize =	options.maxSize;
		//#pragma region Instance	
		
		this.setTitle($MUI('Importation de fichier')).setIcon('fileimport');
		
		this.Alert = 			this.createBox();
		this.Flag = 			this.createFlag().setType(FLAG.RIGHT);
		this.createProgressBar().hide();
		
		this.Resizable(false);
		//
		// Title
		//
		this.Splite =			new SpliteIcon(options.title, options.subtitle + '(' + $MUI('Taille max') + ' : ' + (options.maxSize / 1024 / 1024) + ' Mo)');
		this.Splite.setIcon('fileimport-48');
		//
		// Form
		//
		this.Form =				new FrameWorker(options);
		
		this.Form.printMSG =	this.printMSG.bind(this);
		this.FrameWorker = 		this.Form.FrameWorker;	
		this.Observer =			this.Form.Observer;
		this.Table =			this.Form.TableData;	
		this.Section =			this.Form.Section;
		this.Input =			this.Form.Input;
		this.InputInstance =	this.Form.InputInstance;
		this.InputCmd =			this.Form.InputCmd;
		this.InputMaxSize =		this.Form.InputMaxSize;
		
		this.Form.on('complete', this.onComplete.bind(this));
		
		this.Table.setStyle('width:100%');
		//
		// Widget
		//
		this.Widget =			new Widget();
		this.Widget.appendChild(this.Form);
		//
		// Select
		//
		this.Select = 			new Select();
		this.Select.setStyle('width:230px');
		this.Select.setData(options.options);
		this.Select.selectedIndex(0);
		//
		// Table
		//
		if(options.select) this.Table.addHead($MUI('Option d\'importation') + ' : ').addField(this.Select).addRow();
		
		//
		// Submit
		//
		this.submit =			new SimpleButton({icon:'valid', text:$MUI('Importer le fichier')});
		this.submit.setStyle('margin:5px');
		
		//#pragma endregion Instance
		
		this.appendChilds([
			this.Splite,
			this.Widget
		]);
		
		this.footer.appendChild(this.submit);
				
		this.Form.on('complete', this.onComplete.bind(this));
						
		this.submit.on('click',function(evt){
			
			if(this.Input.value == ''){
				this.Flag.setText($MUI('Choisissez un fichier'));
				this.Flag.show(this.Input);
				return;
			}
			
			this.Observer.fire('submit', this);			
			
			this.AlertBox.wait();
			this.Form.submit();
			
		}.bind(this));
		
		
		this.Input.on('mouseover', function(){
			this.Flag.setText('<p class="icon-documentinfo">' + $MUI('Choisissez un fichier à charger sur le serveur') + '.</p>');
			this.Flag.setType(FLAG.RIGHT).color('grey').show(this.Input, true);
		}.bind(this));
		
		this.Select.on('mouseover', function(){
			this.Flag.setText('<p class="icon-documentinfo">' + $MUI('Choisissez une option de chargement') + '.</p>');
			this.Flag.setType(FLAG.RIGHT).color('grey').show(this.Select, true);
		}.bind(this));
			
			
		this.observe_ = this.observe;
		
		this.observe = function(eventName, callback){

			switch(eventName){
				case 'load':
				case 'error':
				case 'complete':
				case 'submit':
					this.Observer.observe(eventName, callback);
					break;
				default:this.observe_(eventName, callback);
			}
			return this;
		};
		
		this.stopObserving_ = this.stopObserving;
		
		this.stopObserving = function(eventName, callback){
			
			switch(eventName){
				case 'load':
				case 'error':
				case 'complete':
				case 'submit':
					this.Observer.stopObserving(eventName, callback);
					break;
				default:this.stopObserving_(eventName, callback);
			}
			return this;
		};
			
	},
/*
 * wLoader#onComplete() -> void
 *
 * Execute les actions après chargement du fichier.
 **/	
	onComplete:function(obj){
		this.AlertBox.hide();
	},
/**
 * wLoader#printMSG(msg, icon) -> void
 * - msg (String): Message à afficher.
 * - icon (String): Icone de la boite.
 *
 * Affiche un message dans la boite de dialogue de la fenêtre.
 **/
	printMSG: function(msg, type){
		
		var splite = new SpliteIcon(msg);
		
		if(type){
			splite.setIcon(type);
		}

		this.AlertBox.setTitle($MUI('Message')).setContent(splite).setType('CLOSE').show();
		
	},
	/**
	 * Stop la soumission du formulaire.
	 */
	stop: function(){
		this.issubmit = true;
	},
	
	addCel: function(){return this.Table.addCel.apply(this.Table, $A(arguments));},
	addCels:function(){return this.Table.addCels.apply(this.Table, $A(arguments));},
	addField:function(){return this.Table.addField.apply(this.Table, $A(arguments));},
	addHead:function(elem, obj){return this.Table.addHead.apply(this.Table, $A(arguments));},
	addRow: function(){return this.Table.addRow.apply(this.Table, $A(arguments));},
	addRows: function(){return this.Table.addRows.apply(this.Table, $A(arguments));},
	getCel: function(){return this.Table.getCel.apply(this.Table, $A(arguments));},
	getRow: function(){return this.Table.getRow.apply(this.Table, $A(arguments));},
	removeCel: function(){return this.Table.removeCel.apply(this.Table, $A(arguments));},
	removeRow: function(row){return this.Table.removeRow.apply(this.Table, $A(arguments));},
	removeCol:function(col){return this.Table.removeCol.apply(this.Table, $A(arguments));},
	size: function(){return this.Table.size.apply(this.Table, $A(arguments));},
/**
 * wLoader#setLink(link) -> wDownload
 * - link (String): Lien vers la passerelle PHP.
 *
 * Cette méthode assigne le lien de connexion au serveur d'application.
 **/
	setLink: function(link){
		this.Form.Link(link);
		return this;
	},
/*
 * wLoader#setCommand(cmd, parameters) -> wLoader
 * - cmd (String): La commande telle qu'elle est defini par le script PHP.
 * - parameters (String): Paramètre supplémentaire lors de l'envoi de données.
 *
 * Assigne la commande et les paramètres à l'instance. Ces informations seront 
 * envoyées à PHP.
 **/
	setCommand: function(cmd, parameters){
		this.cmd = cmd;
		this.InputCmd.value = cmd;

		if(!Object.isUndefined(parameters)){
			var parameters = parameters.split('&');
			
			for(var i = 0; i < parameters.length; i += 1){
				var  xvar = parameters[i].split('=');
				this.Form.appendChild(new Node('input', {type:'hidden', name:xvar[0], value:xvar[1]}));
			}
		}
		return this;
	},
/**
 * wLoader#setParameters(parameters) -> wLoader
 * - parameters (String): Paramètre supplémentaire lors de l'envoi de données.
 *
 * Cette méthode ajoute un paramètre à envoyer vers le script PHP.
 **/	
	setParameters: function(parameters){
		var parameters = parameters.split('&');
			
		for(var i = 0; i < parameters.length; i += 1){
			var  xvar = parameters[i].split('=');
			this.Form.addInput({type:'hidden', name:xvar[0], value:parameters[i].replace(xvar[0] + '=', '')});
		}	
	}
};
/** section: UI
 * class wDownload < Window
 * Fenêtre spécialisée pour le téléchargement de fichier depuis le serveur vers le poste client.
 **/
var WindowFormDownload = Class.from(Window);
var wDownload = WindowFormDownload;
wDownload.prototype = {
/**
 * wDownload.Select -> Select
 * Instance du champs d'option.
 **/	
	Select:				null,
/**
 * wDownload.link -> String
 * Lien de la passerelle PHP.
 **/
	link:				'',
/**
 * wDownload.Table -> TableData
 * Instance de gestionnaire de mise en forme des formulaires.
 **/
 	Table:				null,
	cmd:				'',
	parameters:			'',
/**
 * wDownload#Form -> FrameWorker
 * Instance FrameWorker
 **/
 	Form:				null,
/**
 * new wDownload([options])
 * - options (Object): Object de configuration.
 *
 * Cette méthode créée une nouvelle instance de [[wDownload]].
 * 
 * #### Attributs du paramètre options
 * 
 * Le constructeur prend en charge un paramètre `options` permettant de configurer l'instance rapidement. En plus des options
 * supporté par la classe [[Window]] sont ajoutés les options suivantes :
 *
 * * `title` (`String`): Titre à afficher dans le splite.
 * * `subtitle` (`String`): Sous-titre à afficher dans le splite.
 * * `select` (`Boolan`): Affiche une liste pour les options de chargement.
 * * `options` (`Array`): Liste des options à afficher dans le champs select.
 * * `link` (`String`): Lien de la passerelle PHP pour récupérer la liste.
 * * `onComplete` (`Function`): Fonction appelée après chargement des données.
 * * `debug` (`boolean`): Active l'affichage de l'iframe pour le debug.
 *
 **/
	initialize: function(obj){
		this.addClassName('wdownload');
		
		var options = {
			options:	[],
			title: 		$MUI('Télécharger un fichier'),
			subtitle:	'',
			select:		false,
			link:		'',
			debug:		false,
			cmd:		'cmd',
			parameters: {}
		};
		
		if(!Object.isUndefined(obj)) Object.extend(options, obj);
		
		//#pragma region Instance	
		
		this.setTitle($MUI('Télécharger un fichier')).setIcon('fileexport');
		
		this.Alert =	this.createBox();
		this.createFlag().setType(FLAG.RIGHT);
		this.createProgressBar();
		this.ProgressBar.hide();
		this.Resizable(false);
		
		//
		// Form
		//
		options.upload =		false;
		this.Form =				new FrameWorker(options);
		this.FrameWorker = 		this.Form.FrameWorker;
				
		this.Observer =			this.Form.Observer;
		this.Table =			this.Form.TableData;	
		this.Section =			this.Form.Section;
		this.Input =			this.Form.Input;
		
		this.Form.on('complete', this.onComplete.bind(this));
		
		this.Form.appendChild(this.Input);
		
		this.InputInstance =	this.Form.InputInstance;
		this.InputCmd =			this.Form.InputCmd;
		this.Table =			new TableData();
		this.Table.setStyle('width:100%');
		//
		// Select
		//
		this.Select = 			new Select();
		this.Select.setStyle('width:230px');
		this.Select.setData(options.options);
		this.Select.selectedIndex(0);
		//
		// Title
		//
		this.Splite =			new SpliteIcon(options.title, options.subtitle);
		this.Splite.setIcon('fileexport-48');
		//
		// Table
		//
		var widget = 			new Widget();
		widget.appendChild(this.Table);
		
		if(options.select){
			this.Table.hide();
			this.Table.addHead($MUI('Option de téléchargement') + ' : ').addField(this.Select).addRow();
			this.Form.appendChild(widget);
		}
		//
		// Submit
		//
		this.submit =			new SimpleButton({icon:'valid', text:'Télécharger'});
		this.submit.setStyle('margin:5px');	
		
		//#pragma endregion Instance
		
		
		this.appendChilds([
			this.Splite,
			this.Form
		]);

		this.footer.appendChild(this.submit);
				
		this.observe_ = this.observe;
		
		this.observe = function(eventName, callback){
			switch(eventName){
				case 'load':
				case 'error':
				case 'complete':
				case 'submit':
					this.Observer.observe(eventName, callback);
					break;
				default:this.observe_(eventName, callback);
			}
			return this;
		};
		
		this.stopObserving_ = this.stopObserving;
		
		this.stopObserving = function(eventName, callback){
			switch(eventName){
				case 'load':
				case 'error':
				case 'complete':
				case 'submit':
					this.Observer.stopObserving(eventName, callback);
					break;
				default:this.stopObserving_(eventName, callback);
			}
			return this;
		};
						
		this.submit.on('click',function(evt){
		
			this.Observer.fire('submit', this);			
			
			if(this.issubmit) {
				this.issubmit = false;
			}else{
				this.AlertBox.wait();
				this.Form.submit();
			}
			
		}.bind(this));
				
		this.Select.on('mouseover', function(){
			this.Flag.setText('<p class="icon-documentinfo">' + $MUI('Choisissez une option de téléchargement') + '.</p>');
			this.Flag.setType(FLAG.RIGHT).color('grey').show(this.Select, true);
		}.bind(this));
		
		this.Form.addClassName('download');
	},
	
	Download:function(value){
		this.Input.value = value;
	},
	/**
	 * Stop la soumission du formulaire.
	 */
	stop: function(){
		this.issubmit = true;
	},
/*
 * wDownload.completed() -> void
 *
 * Execute les actions après chargement du fichier.
 **/	
	onComplete:function(obj){
		///$S.trace('you');
		try{this.AlertBox.hide();}catch(er){}
		this.close();
	},

	addCel: function(){return this.Table.addCel.apply(this.Table, $A(arguments));},
	addCels:function(){return this.Table.addCels.apply(this.Table, $A(arguments));},
	addField:function(){return this.Table.addField.apply(this.Table, $A(arguments));},
	addHead:function(elem, obj){return this.Table.addHead.apply(this.Table, $A(arguments));},
	addRow: function(){return this.Table.addRow.apply(this.Table, $A(arguments));},
	addRows: function(){return this.Table.addRows.apply(this.Table, $A(arguments));},
	getCel: function(){return this.Table.getCel.apply(this.Table, $A(arguments));},
	getRow: function(){return this.Table.getRow.apply(this.Table, $A(arguments));},
	removeCel: function(){return this.Table.removeCel.apply(this.Table, $A(arguments));},
	removeRow: function(row){return this.Table.removeRow.apply(this.Table, $A(arguments));},
	removeCol:function(col){return this.Table.removeCol.apply(this.Table, $A(arguments));},
	size: function(){return this.Table.size.apply(this.Table, $A(arguments));},
/**
 * wDownload#setLink(link) -> wDownload
 * - link (String): Lien vers la passerelle PHP.
 *
 * Cette méthode assigne le lien de connexion au serveur d'application.
 **/
	setLink: function(link){
		this.Link(link);
		return this;
	},
	/**
	 * Assigne la commande pour interroger le serveur.
	 * @param {String} cmd La commande telle qu'elle est defini par le script PHP.
	 * @param {String} parameters Paramètre supplémentaire lors de l'envoi de données.
	 */
	setCommand: function(cmd, parameters){
		this.cmd = cmd;
		this.InputCmd.value = cmd;
		
		if(!Object.isUndefined(parameters)){
			var parameters = parameters.split('&');
			
			for(var i = 0; i < parameters.length; i += 1){
				var  xvar = parameters[i].split('=');
				this.Form.appendChild(new Node('input', {type:'hidden', name:xvar[0], value:xvar[1]}));
			}
		}
		return this;
	},
/**
 * wDownload#setParameters(parameters) -> wDownload
 * - parameters (String): Paramètre supplémentaire lors de l'envoi de données.
 *
 * Cette méthode ajoute un paramètre à envoyer vers le script PHP.
 **/	
	setParameters: function(parameters){
		
		parameters = parameters.match(/&/) ? parameters.split('&') : [parameters];
		
		for(var i = 0; i < parameters.length; i += 1){
			var  xvar = parameters[i].split('=');
			this.Form.addInput({type:'hidden', name:xvar[0], value:parameters[i].replace(xvar[0] + '=', '')});
		}
		
		return this;
	}
};
/** section: UI
 * class FlashComponent
 *
 * Cette classe permet d'importer un composant Flash.
 **/
var FlashComponent = Class.createSprite('object');

FlashComponent.prototype = {
	options:	null,
/**
 * new FlashComponent([options])
 * - options (Object): Option de configuration de l'instance.
 *
 * Cette méthode créée une nouvelle instance de FlashComponent
 *
 * #### Attribut du paramètre options
 *
 * Le constructeur prend en charge un paramètre `options` permettant de configurer l'instance rapidement :
 *
 * * `movie`
 * * `bgcolor`
 * * `play`
 * * `loop`
 * * `wmode`
 * * `scale`
 * * `menu`
 * * `devicefont`
 * * `salign`
 * * `allowScriptAccess`
 *
 **/
	initialize: function(options){//application/x-shockwave-flash
		this.options = {
			movie: 				'',
			quality:			"high",
			bgcolor:			'',
			play:				"true",
			loop:				"true",
			wmode:				"window",
			scale: 				"showall",
			menu:				true,
			devicefont:			false,
			salign:				"",
			allowScriptAccess: 	'sameDomain',
			parameters:			''
		};
		
		
		if(!Object.isUndefined(options)){
			Object.extend(this.options, options);
		}

		this.writeAttribute({classid:"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"});
		this.align =	"middle";
		
		this.options.movie = this.toURL();
		//
		// Object
		//
		this.object = new Node('object');
		this.object.type = 'application/x-shockwave-flash';
		this.object.data = this.toURL();
		
		if(!Object.isUndefined(this.options.height)){
			this.setHeight(this.options.height);
		}
		
		if(!Object.isUndefined(this.options.width)){
			this.setHeight(this.options.width);
		}
		
		//creation des parametres
		for(var key in this.options){
			if(key == 'link' || key == 'parameters' || key == 'width' || key == 'height') continue;
			
			var obj = [
				new Node('param', {name: key, value:this.options[key]}),
				new Node('param', {name: key, value:this.options[key]})
			];
			
			this.appendChild(obj[0]);
			this.object.appendChild(obj[1]);
			
			this.options[key] = obj;
		};
		
		this.appendChild(this.object);
	},
/*
 * 
 **/	
	toURL: function(){
		var link = 'js/window/loader/window.loader.swf';
		
		if(this.options.parameters != ''){
			var params = '?';
			if(Object.isString(this.options.parameters)){
				params += this.options.parameters;
			}else{
				var first = false;
				for(var key in this.options.parameters){
					
					if(!first){
						first = true;
					}else{
						params += '&';
					}
					
					params += key + '=' + this.options.parameters[key];
				}
			}
			
			link += params;
		}
		
		return link;
	},
/**
 * FlashComponent#setLink(link) -> FlashComponent
 * - link (String): Lien vers le document flash
 *
 * Cette méthode assigne le lien du document flash à charger.
 **/	
	setLink: function(link){
		this.options.parameters.link = link;
		this.object.data = this.options.movie[0].value = this.options.movie[1].value = this.toURL();
		return this;
	},
/**
 * FlashComponent#setParameters(parameters) -> FlashComponent
 * - parameters (String): Paramètre de l'objet FlashComponent.
 *
 * Cette méthode ajoute un paramètre à envoyer vers le script PHP.
 **/	
	setParameters: function(parameters){
		this.options.parameters = parameters;
		this.object.data = this.options.movie = this.toURL();
		return this;
	},
/**
 * FlashComponent#setHeight(height) -> FlashComponent
 * - height (Number): Hauteur de l'objet FlashComponent.
 *
 * Cette méthode assigne la hauteur de l'objet FlashComponent.
 **/
	setHeight: function(h){
		this.height = h;
		this.writeAttribute({height:h});
		this.object.writeAttribute({height:h});
	},
/**
 * FlashComponent#setWidth(width) -> FlashComponent
 * - width (Number): Largeur de l'objet FlashComponent.
 *
 * Cette méthode assigne la largeur de l'objet FlashComponent.
 **/
	setWidth: function(w){
		this.writeAttribute({width:w});
		this.object.writeAttribute({width:w});
	}
};
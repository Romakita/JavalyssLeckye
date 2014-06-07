/** section: Form
 * class FrameWorker
 *
 * Cette classe permet de gérer le chargement de fichier vers le serveur via Ajax ou via iFrame si le navigateur n'est pas compatible.
 **/
var FrameWorker = Class.createSprite('form');
FrameWorker.AUTO_INCREMENT = 0;
/**
 * FrameWorker.getID() -> Number
 **/
FrameWorker.getID = function(){
	this.AUTO_INCREMENT++;
	return this.AUTO_INCREMENT;
};
/**
 * FrameWorker.get() -> FrameWorker
 **/
FrameWorker.get = function(id){
	return document.getElementsByClassName('form-frameworker-' + id)[0];
};

function getFrameWorker(id){
	return FrameWorker.get(id);
};

FrameWorker.prototype = {
	ID:			0,
	className: 	'wobject frameworker form-frameworker',
/**
 * FrameWorker#target -> String
 **/
	target:		'frameworker',
/**
 * FrameWorker#link -> String
 **/
	link: 		'',
/**
 * FrameWorker#method -> POST
 **/
	method:		'POST',
/**
 * FrameWorker#enctype -> String
 **/
	enctype:	'multipart/form-data',
/*
 * FrameWorker#multiple -> Boolean
 **/
	multiple:	false,
	upload:		true,
	debug:		false,
	value:		'',
/**
 * FrameWorker#text -> String
 * Texte affiché en label ou sur le bouton de chargement de fichier selon les technologies présentes.
 **/
	text:		'',
	cmd:		'',
	parameters:	'',
/**
 * FrameWorker#maxSize -> Number
 * Taille maximal du fichier pouvant être téléchargé.
 **/
	maxSize:	2097152,
/**
 * new FrameWorker([options])
 *
 * Créée une nouvelle instance [[FrameWorker]].
 **/
	initialize: function(options){
		
		this.link = $WR().getGlobals('link');
		this.text = $MUI('Upload your file');
		
		if(!Object.isUndefined(options)){
			for(var key in options){
				if(!Object.isFunction(options[key])){
					this[key] = options[key];	
				}
			}
		}else{
			options = {}
		}
		
		if(options.mini){
			this.addClassName('mini');	
		}
		//
		//
		//
		this.body = 	new Node('div', {className:'wrap-body'});
		//
		//
		//
		this.label = 	new Node('label', {className:'wrap-label'}, this.text);
		//
		// TableData
		//		
		this.TableData = new TableData();
		
		this.ID = 		FrameWorker.getID();
		this.target += 	'-' + this.ID;
		this.addClassName('form-frameworker-' + this.ID);
		
		this.Link(this.link);
		//
		//
		//
		this.Observer = new Observer();
		this.Observer.bind(this);
		//
		// Input
		//
		this.Input =			new Node('input', {type:'file', name:'FrameWorker', multiple:this.multiple});
		this.SimpleButton =		new SimpleButton({text:$MUI('Browse')+'...'});
		//
		// Instance
		//
		this.InputInstance =	this.addInput({type:'hidden', name:'INSTANCE_ID', value:this.ID});
		//
		//
		//
		this.InputMaxSize =		this.addInput({type:'hidden', name:'UPLOAD_MAX_FILESIZE', value:this.maxSize});	
		//
		// Constante
		//
		var parameters = $WR().getGlobals('parameters', true);
		
		for(var key in parameters){
			this.addInput({value:parameters[key], name:key});	
		}
		
		//
		// Parameters
		//
		if(Object.isString(this.parameters)){
			var parameters = this.parameters.split('&');
			
			for(var i = 0; i < parameters.length; i++){
				var param = parameters[i].split('=');
				if(param[0] == 'cmd'){
					this.InputCmd =			this.addInput({type:'hidden', name:param[0], value: param[1]});
				}else{
					this.addInput({type:'hidden', name:param[0], value:param[1]});
				}
			}
		}
		//
		// InputCmd
		//
		if(Object.isString(options.cmd)){
			if(options.cmd.split('=').length == 2){
				var obj = options.cmd.split('=');
				
				if(this.InputCmd){
					this.InputCmd.name = obj[0];
					this.InputCmd.value = obj[1];
				}else{
					this.InputCmd =			this.addInput({type:'hidden', name:obj[0], value: obj[1]});
				}
			}else{
				if(this.InputCmd){
					this.InputCmd.name = param[0];
					this.InputCmd.value = param[1];
				}else{
					this.InputCmd =			this.addInput({type:'hidden', name:'cmd', value: options.cmd});
				}
			}
		}
		//
		// Test de fonctionnalité
		//
		this.hasClick = 	Object.isFunction(this.Input.click);
		this.hasSubmit =	Object.isFunction(this.submit);
		this.hasFileAPI =	!Object.isUndefined(window['FileReader']);
		
		this.addClassName(this.hasClick ? 'click' : 'noclick');
		this.addClassName(this.hasSubmit ? 'submit' : 'nosubmit');
		this.addClassName(this.hasFileAPI ? 'api' : 'noapi');
		//
		// FrameWorker
		//
		this.FrameWorker = 		new Node('iframe', {className:'frameworker', name:'frameworker-'+this.ID});
		this.appendChild(this.FrameWorker);
				
		this.body.appendChild(this.label);
		this.body.appendChild(this.Input);
		this.body.appendChild(this.SimpleButton);
				
		if(this.upload){
			this.FrameWorker.hide();
			
			this.appendChild(this.body);
			
			if(this.hasClick){
				if(this.hasFileAPI){
					
					this.Multiple(this.mutiple);
					
					options.multiple = 	this.multiple;
					options.text = 		this.text;
					
					this.DropFile = new DropFile(options);
					this.DropFile.addDragArea(this);
					this.DropFile.appendChild(this.SimpleButton);
					this.appendChild(this.DropFile);
					
					this.DropFile.on('dropfile', function(){
						this.DropFile.setParameters(this.serialize());
					}.bind(this));
					
					this.DropFile.on('complete', this.onComplete.bind(this));
					this.DropFile.on('cancel', this.onCancel.bind(this));
					this.DropFile.on('error', this.onError.bind(this));
								
				}else{
					this.multiple = false;
				}			
			}else{
				this.hasFileAPI = false;
				this.ProgressBar = new ProgressBar();
				this.body.appendChild(this.ProgressBar);
				this.ProgressBar.hide();
				
				this.multiple = false;	
			}
		}else{
			this.Input.type = 'hidden';
			this.Input.name = 'FrameWorkerDownload';
			this.Input.value = 'true';	
			
			this.appendChild(this.Input);
			
			if(!this.debug){
				this.FrameWorker.hide();
			}
		}
				
		this.appendChild(this.TableData);
				
		this.SimpleButton.on('mouseup', function(){			
			this.Input.click();
		}.bind(this));
		
		this.on('submit', function(evt){
			this.Observer.fire('load', evt);
		}.bind(this));
		
		this.Input.on('change', function(evt){
			
			if(this.hasFileAPI){
				
				if(!this.Multiple()){
					this.DropFile.clear();
				}
				
				this.DropFile.setParameters(this.serialize());
				
				for(var i = 0; i < this.Input.files.length; i++){
					this.DropFile.enqueueFile(this.Input.files[i]);
				}
				
			}else{
				
				this.ProgressBar.setProgress(0,0, '');
				this.ProgressBar.it = 0;
				this.ProgressBar.timer = new Timer(function(){
					this.ProgressBar.it++;
					this.ProgressBar.setProgress(this.ProgressBar.it % 100, 100, '');
				}.bind(this), 1);
				
				this.ProgressBar.show();
				this.ProgressBar.timer.start();
				
				this.submit();
			}
			
		}.bind(this));
				
	},
	
	Body:function(){
		return this.body;	
	},
/**
 * FrameWorker#addInput(label, options) -> Input
 * FrameWorker#addInput(options) -> Input
 * - label (String): Label à afficher devant le champ input.
 * - options (Object): Options de configuration du champ input.
 *
 * Cette méthode ajoute un champ [[Input]] à l'instance.
 **/
	addInput: function(label, obj){
		
		if(!Object.isString(label)){
			obj = label;
		}		
		
		var options = {
			type:	'hidden',
			name:	'',
			value:	''
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
				
		var input = new Input(options);
		
		if(!Object.isString(label)){
			this.appendChild(input);	
		}else{
			this.TableData.addRow().addHead(label).addField(input);
		}
				
		return input;
	},
/** 
 * FrameWorker#Multiple([bool]) -> Boolean
 * - bool (Boolean): Active ou désactive le chargement multiple.
 *
 * Cette méthode active le chargement multiplede fichier.
 **/	
	Multiple:function(bool){
		if(Object.isUndefined(bool)){
			return this.multiple;
		}
		
		this.removeClassName('multiple');
		
		if(bool){
			this.multiple = true;
			this.addClassName('multiple');
		}else{
			this.multiple = false;	
		}
		return bool;
	},
/**
 * FrameWorker#observe(eventName, callback) -> Window
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `error` : Appelle la fonction lorsque l'instance rencontre une erreur lors de l'envoi de données vers le serveur.
 * * `complete` : Appelle la fonction lorsque l'envoi de données vers le serveur est terminé.
 * * `load` : Appelle la fonction lorsque l'envoi de données vers le serveur commence.
 *
 * Et tous les autres événements propoposés par le DOM sur l'élément `form`.
 **/	
	observe: function(eventName, callback){
		switch(eventName){
			
			case 'change':
				this.Input.on('change', callback);
				break;
			case 'error':
			case 'complete':
			case 'load':
			case 'cancel':
				this.Observer.observe(eventName, callback);
				break;
			default:
				Event.observe(this, eventName, callback);
		}
		return this;
	},
/**
 * FrameWorker#stopObserving(eventName, callback) -> Window
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` associé à un nom d'événement `eventName`.
 **/
	stopObserving: function(eventName, callback){
		switch(eventName){
			case 'error':
			case 'complete':
			case 'load':
				this.Observer.stopObserving(eventName, callback);
				break;
			default:
				Event.stopObserving(this, eventName, callback);
		}
		return this;
	},
/*
 *
 **/	
	onComplete:function(result){
		
		if(!this.hasClick){
			this.ProgressBar.timer.stop();
			this.ProgressBar.setProgress(100, 100, '');
				
			new Timer(function(){
				this.ProgressBar.hide();
			}.bind(this), 1, 1).start();
		}
		
		//this.Value(result);
		this.Observer.fire('complete', result);
	},
	
	onCancel:function(node){
		this.Observer.fire('cancel', node);
	},
/*
 *
 **/	
	onError: function(error){
		
		if(!this.hasClick){
			this.ProgressBar.setProgress(100, 0, '');
			this.ProgressBar.hide();
			
			new Timer(function(){
				this.ProgressBar.hide();
			}.bind(this), 1, 1).start();
			
		}
		
		try{
			error = error.evalJSON();
		}catch(er){}
		
		this.Observer.fire('error', error);
	},
/**
 * FrameWorker#Link([link]) -> String
 * - link (String): Lien du serveur de données.
 *
 * Cette méthode change le lien du serveur de données.
 **/
	Link: function(link){
		if(Object.isUndefined(link)) return this.link;
		return this.action = this.link = link;	
	},
/**
 * FrameWorker#setLink(link) -> FrameWorker
 * - link (String): Lien du serveur de données.
 *
 * Cette méthode change le lien du serveur de données.
 **/
	setLink: function(link){
		this.link = link;
		return this;
	},
/**
 * FrameWorker#setParameters(parameters) -> ListBox
 * - parameters (String): paramètres.
 * 
 * Cette méthode assigne des paramètres à envoyer vers le script PHP lors de la récupération de données depuis ce dernier.
 **/	
	setParameters: function(parameters){
		var parameters = parameters.split('&');
			
		for(var i = 0; i < parameters.length; i += 1){
			var  xvar = parameters[i].split('=');
			this.addInput({type:'hidden', name:xvar[0], value:parameters[i].replace(xvar[0] + '=', '')});
		}
	},
	
	trace: function(str){
		if($WT != null){
			$WT.trace(str);
		}else{
			console.log(str);
		}
	},
/*
 * FrameWorker#printMSG(msg, icon) -> void
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
 * FrameWorker#Value(value) -> Mixed
 * - value (String): Valeur à assigner.
 * 
 * Assigne ou/et retourne la valeur de l'instance.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new FrameWorker();
 *     c.Value('mavaleur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new FrameWorker();
 *     c.Value('mavaleur');
 *     alert(c.Value()); //mavaleur
 *
 **/
	Value:function(value){
		
		if(Object.isUndefined(value)){
			
			if(this.hasFileAPI){
				return this.DropFile.Value();	
			}
			
			return this.value;	
		}
		
		if(value == ''){
			if(this.hasFileAPI){
				this.DropFile.body.removeChilds();
			}
			return '';	
		}
		
		this.value = value;
		
		if(this.hasClick){
			if(this.hasFileAPI){
				if(!this.Multiple()){
					this.DropFile.Value(value);
				}
			}else{
				this.label.innerHTML = value.slice(value.lastIndexOf('/'), value.length).replace('/', '');	
			}
		}else{
			this.label.innerHTML = value.slice(value.lastIndexOf('/'), value.length).replace('/', '');
		}
		
		return this.value;
	}
};
/** section: Form
 * class DropFile
 * Cette classe gère le chargement de fichier multiple par glissé / dépossé (drag'n'drop).
 **/
var DropFile = Class.createSprite('div');

DropFile.prototype = {
	className: 		'wobject area-input dropfile',
/**
 * DropFile#maxSize -> Number
 **/
	maxSize:		2097152,
/**
 * DropFile#nbPerUpload -> Number
 **/
	nbPerUpload:	2,
/**
 * DropFile#multiple -> Boolean
 **/
	multiple:		true,
	stack:			0,
	parameters:		'',
	link:			'',
/**
 * new DropFile([options])
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance de [[DropFile]].
 *
 * #### Paramètres options
 * 
 * Le paramètre options permet de configurer l'instance. Les attributs pris en charge sont :
 *
 * * `maxSize` (`Number`): Taille maximal du fichier pouvant être téléchargé.
 * * `nbPerUpload` (`String`): Nombre de fichier pouvant être télécharger simultanément (par défaut 2).
 * * `multiple` (`Boolean`) : Active le chargement multiple de fichier (activé par défaut).
 * * `link` (`String`) : Valeur du champs.
 * * `parameters` (`String`) : Nom du champs.
 *
 **/
	initialize: function(options){
		this.link = 		$WR().getGlobals('link');
		this.text =			$MUI('Drop your file');
		
		if(!Object.isUndefined(options)){
			for(var key in options){
				if(!Object.isFunction(options[key])){
					this[key] = options[key];	
				}
			}
		}
		
		this.setParameters(this.parameters);
		//
		//
		//
		this.header = 	new Node('span', {className:'wrap-title'}, this.text);
		//
		//
		//
		this.body = 	new Node('ul', {className:'wrap-body'});
		
		this.appendChild(this.header);
		this.appendChild(this.body);		
		
		this.addDragArea(this);
	 	this.addDropArea(this);
		
		this.Flag = new Flag();
		this.appendChild(this.Flag);
		
		this.Observer = new Observer();
		this.Observer.bind(this);
		
		this.Multiple(this.multiple);
		
	},
/** 
 * DropFile#addDragArea() -> DropFile
 *
 * Cette méthode permet d'ajouter un node permettant d'activer la zone DropFile.
 **/	
	addDragArea: function(node){
		node.on('dragover', function(evt){
			node.addClassName('dragover');
			this.onDragOver(evt)
		}.bind(this));
		
		node.on('dragleave',function(evt){
			node.removeClassName('dragover');
			this.onDragLeave(evt)
		}.bind(this));
		
		node.on('dragend', function(evt){
			node.removeClassName('dragover');
			this.onDragEnd(evt)
		}.bind(this));
	},
/** 
 * DropFile#addDropArea() -> DropFile
 *
 * Cette méthode permet d'ajouter un node permettant de déposer un fichier à la zone DropFile.
 **/	
	addDropArea: function(node){
		node.on('drop', function(evt){
			node.removeClassName('dragover');	
			this.onDrop(evt)
		}.bind(this));
	},
/** 
 * DropFile#clear() -> DropFile
 *
 * Cette méthode réinitialise l'instance.
 **/	
	clear:function(){
		this.body.removeChilds();
		this.removeClassName('upload');
		return this;
	},
/** 
 * DropFile#clearLoaded() -> DropFile
 *
 * Cette méthode réinitialise l'instance.
 **/	
	clearLoaded:function(){
		var childs = this.body.select('.clear');
		
		for(var i = 0; i < childs.length; i++){
			this.body.removeChild(childs[i]);	
		}
		
		if(this.body.childElements().length == 0){
			this.removeClassName('upload');
		}
		return this;
	},
/** 
 * DropFile#Header() -> Node
 **/	
	Header:function(){
		return this.header;
	},
/** 
 * DropFile#Body() -> Node
 **/	
	Body:function(){
		return this.body;
	},
/** 
 * DropFile#Multiple([bool]) -> Boolean
 * - bool (Boolean): Active ou désactive le chargement multiple.
 *
 * Cette méthode active le chargement multiplede fichier.
 **/	
	Multiple:function(bool){
		if(Object.isUndefined(bool)){
			return this.multiple;
		}
		
		this.removeClassName('multiple');
		this.removeClassName('nomultiple');
		
		if(bool){
			this.multiple = true;
			this.addClassName('multiple');
		}else{
			this.multiple = false;	
			this.addClassName('nomultiple');
		}
		return bool;
	},
/**
 * DropFile#observe(eventName, callback) -> Window
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `error` : Appelle la fonction lorsque l'instance rencontre une erreur lors de l'envoi de données vers le serveur.
 * * `complete` : Appelle la fonction lorsque l'envoi de données vers le serveur est terminé.
 * * `load` : Appelle la fonction lorsque l'envoi de données vers le serveur commence.
 *
 * Et tous les autres événements propoposés par le DOM sur l'élément `form`.
 **/	
	observe:function(eventName, callback){
		switch(eventName){
			case 'loaded':
			case 'progress':
			case 'dragout':
			case 'dragin':
			case 'dropfile':
			case 'error':
			case 'complete':
			case 'cancel':
				this.Observer.observe(eventName, callback);
				break;
			default:
				Event.observe(this, eventName, callback);
				break;
		}
	},
	
	stopObserving:function(eventName, callback){
		switch(eventName){
			case 'loaded':
			case 'progress':
			case 'dragout':
			case 'dragin':
			case 'dropfile':
			case 'error':
			case 'complete':
			case 'cancel':
				this.Observer.stopObserving(eventName, callback);
				break;
			default:
				Event.stopObserving(this, eventName, callback);
				break;
		}
	},
/** 
 * DropFile#pending() -> Boolean
 *
 * Cette méthode indique si des fichiers sont en attente de chargement.
 **/	
	pending:function(){
		return !(this.body.select('.waiting').length == 0 && this.body.select('.process').length == 0);
	},
/** 
 * DropFile#enqueueFile(file) -> DropFile
 * - file (File): Données du fichier à charger.
 *
 * Cette méthode ajoute un fichier à ajouter à la file d'attente pour le chargement de fichier vers le serveur.
 **/	
 	enqueueFile: function(file){
		if(!this.multiple && this.body.childElements().length >= 1) return this;
		
		var node =			new LineElement();
		node.createProgressBar();
		
		node.SimpleButton = new SimpleButton({type:'mini', icon:'cancel-14'});
		
		node.Header().appendChild(node.SimpleButton);
			
		node.reader = 		new FileReader();
		node.data =			file;		
		node.setText(node.data.name);
		
		node.getData = function(){return this.data};
		
		if(node.data.size > this.maxSize){
			node.setIcon('cancel');
			node.addClassName('error');
			
			var self = this;
			
			node.on('mouseover', function(){
				self.Flag.setText($MUI('The uploaded file is too large')).color('red').setType(Flag.RIGHT).show(this, true);
			});
			
		}else{
		
			node.data.extension = node.data.name.slice(node.data.name.lastIndexOf('.'), node.data.name.length).replace('.', '').toLowerCase();
			
					
			if($WR().FileIcons[node.data.extension]){
				if($WR().FileIcons[node.data.extension] == 'preview'){
					node.setIcon('photo');					
				}else{
					node.setIcon($WR().FileIcons[node.data.extension].replace('-48', ''));
				}
			}else{
				node.setIcon('filenew');
			}
			
			node.reader.onload = function(evt){
				node.data.data64 = evt.target.result;
				node.addClassName('waiting');
				this.upload();
			}.bind(this);
			
			try{
				node.reader.readAsDataURL(file);
			}catch(er){
				return this;
			}
		}
		
		this.removeClassName('upload');
		this.addClassName('upload');	
		
		this.body.appendChild(node);
		
		this.Observer.fire('dropfile', node);
				
		node.SimpleButton.on('click', function(){
			this.body.removeChild(node);
			
			if(node.ajax && Object.isFunction(node.ajax.transport.abort)){
				node.ajax.transport.abort();
			}
			
			if(this.body.childElements().length == 0){
				this.removeClassName('upload');		
				this.value = '';
			}
			
			this.Flag.hide();
			
			this.Observer.fire('cancel', node);
			
		}.bind(this));
		
		return this;
	},
/** 
 * DropFile#upload() -> DropFile
 *
 * Cette méthode lance le chargement des fichiers.
 **/	
	upload: function(){
		if(this.stack >= this.nbPerUpload) return this;
		
		var options = this.body.select('.waiting');
		
		if(options.length == 0) {
			return this;
		}
		if(Object.isString(this.parameters)){
			var hash = 			this.parameters.split('&');
			this.parameters = 	{};
			
			for(var i = 0; i < hash.length; i++){
				var key = hash[i].split('=');
				this.parameters[key[0]] = key[1];
			} 
		}
		
		var self = this;
		
		for(var i = 0; i < options.length && this.stack < this.nbPerUpload; i++, this.stack++){
			var node = options[i];
			node.removeClassName('waiting');
			//node.addClassName('process');
			node.ProgressBar.show();
			
			if(window.FormData){
				var data = new FormData();
				//ajout des paramètres
				
				for(var key in this.parameters){
					if(!Object.isFunction(this.parameters[key])){
						data.append(key, this.parameters[key]);	
					}
				}
				
				node.data.data64 = null;
				data.append('AjaxFile', node.data);
				
				new Ajax.Request(this.link, {
					contentType:  	false,
					postBody: 		data,
					onCreate: function(e){						
						e.transport.overrideMimeType('text/plain; charset=x-user-defined-binary');
						
						e.transport.upload.addEventListener('progress', function(e){
									
							if (e.lengthComputable) {  
								var percentage = Math.round((e.loaded * 100) / e.total);
								node.ProgressBar.setProgress(percentage, 100, percentage+'%');
								node.total = e.total;
								try{
									self.Observer.fire('progress', {target:node, loaded:e.loaded, total:e.total, percentage:percentage}); 
								}catch(er){if(window['console']){console.log(er)}}
							} 
						});
					},
					
					onComplete:	function(result){				
						node.ProgressBar.setProgress(100, 100, '100%');
						
						try{
							self.Observer.fire('progress', {target:node, loaded:node.total, total:node.total, percentage:100});
						}catch(er){if(window['console']){console.log(er)}}
						
						this.onComplete(result, node);
					}.bind(this)
				});
				
				
			}else{//non support de l'objet FormData, on tentera une approche différente
				this.parameters.AjaxFile = escape(encodeURIComponent(Object.toJSON(node.data)));
				node.data.data64 = null;
				
				node.ajax = new Ajax.Request(this.link, {
					parameters: this.parameters,
					onCreate: function(e){
						
						e.transport.overrideMimeType('text/plain; charset=x-user-defined-binary');
						
						e.transport.upload.addEventListener('progress', function(e){		
							if (e.lengthComputable) {  
								var percentage = Math.round((e.loaded * 100) / e.total);
								node.ProgressBar.setProgress(percentage, 100, percentage+'%');
								node.total = e.total;
								
								self.Observer.fire('progress', {target:node, loaded:node.total, total:node.total, percentage:100});
							} 
						});
					},
					
					onComplete:	function(result){
						node.ProgressBar.setProgress(100, 100, '100%');
						
						self.Observer.fire('progress', {target:node, loaded:node.total, total:node.total, percentage:100});
						
						this.onComplete(result, node);
												
					}.bind(this)
				});
			}
			
		}
		
		return this;
	},
/** 
 * DropFile#Title([title]) -> String
 **/
 	Title:function(title){
		if(Object.isUndefined(title)) return this.header.innerHTML;
		this.header.innerHTML = title;
		return title;
	},
/* 
 * DropFile#onDragOver(evt) -> void
 **/
	onDragOver: function(evt){
		evt.stop();
		this.removeClassName('hover');
		this.addClassName('hover');
		
		this.Observer.fire('dragin', evt);
	},
/* 
 * DropFile#onDragLeave(evt) -> void
 **/
	onDragLeave: function(evt){
		evt.stop();
		this.removeClassName('hover');
		
		this.Observer.fire('dragout', evt);
	},
/* 
 * DropFile#onDragEnd(evt) -> void
 **/
	onDragEnd: function(evt){
		evt.stop();
		this.removeClassName('hover');
		
		this.Observer.fire('dragout', evt);
	},
/* 
 * DropFile#onDrop(evt) -> void
 **/
	onDrop: function(evt){
		
		this.removeClassName('hover');
		
		if(!this.Multiple()){
			this.clear();
		}
				
		for(var i = 0; i < evt.dataTransfer.files.length; i++){
			evt.stop();
			this.enqueueFile(evt.dataTransfer.files[i]);
		}
				
		return false;
	},
/*
 * DropFile#onComplete(result, node) -> void
 **/	
	onComplete: function(result, node){
		//node.removeClassName('process');
		node.ProgressBar.hide();
				
		new Timer(function(){
			node.addClassName('loaded');
		},1,1).start();
		
		var self = this;
		this.stack--;
				
		if(result.responseText.match(/frameworker\.upload\.extension\.err/) ||
			result.responseText.match(/frameworker\.upload\.err/) ||
			result.responseText.match(/frameworker\.upload\.move\.err/)){
			
			try{
				var error = result.responseText.evalJSON();
				node.setIcon('cancel');
				
				node.on('mouseover', function(){
					self.Flag.setText($MUI(error.description)).color('red').setType(Flag.RIGHT).show(this, true);
				});
				
			}catch(er){}
			
			this.Observer.fire('error', result, node);
			
			return;
		}
		
		
		node.addClassName('clear');
		
		try{
			var obj = 		result.responseText.evalJSON();
			
			node.Value(node.uri = obj.uri);
			
			result = 		obj.data;
			
			if(this.body.childElements().length == 1){
				this.value = node.Value();
			}
		}catch(er){
			
			this.Observer.fire('error', result, node);
			
			return;
		}
				
		this.upload();
		
		var options = this.body.select('.waiting');
		
		this.Observer.fire('loaded', result, node);
		
		if(options.length == 0) {
			this.Observer.fire('complete', result, node);
		}
	},
/**
 * DropFile#Value(value) -> Array | String
 * - value (String): Valeur à assigner.
 * 
 * Assigne ou/et retourne la valeur de l'instance. La valeur de l'instance peut etre un tableau de lien si `DropFile#multiple` est vrai.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new DropFile();
 *     c.Value('mavaleur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new DropFile();
 *     c.Value('mavaleur');
 *     alert(c.Value()); //mavaleur
 *
 **/
 	Value:function(value){
		
		if(!Object.isUndefined(value)){
			
			if(!this.multiple){
				this.body.removeChilds();
			}
			
			if(!Object.isArray(value)){
				value = [value];
			}
			
			value.each(function(value){
				if(value == '') return;
				
				var node = 			new LineElement();
				node.Value(value);
				
				node.addClassName('loaded');
				node.SimpleButton = new SimpleButton({type:'mini', icon:'cancel-14'});
				
				node.Header().appendChild(node.SimpleButton);
								
				node.setText(value.slice(value.lastIndexOf('/'), value.length).replace('/', ''));
				node.extension = 	value.slice(value.lastIndexOf('.'), value.length).replace('.', '').toLowerCase();
							
									
				if($WR().FileIcons[node.extension]){
					if($WR().FileIcons[node.extension] == 'preview'){
						node.setIcon('photo');					
					}else{
						node.setIcon($WR().FileIcons[node.extension].replace('-48', ''));
					}
				}else{
					node.setIcon('filenew');
				}
								
				this.addClassName('upload');
				this.Body().appendChild(node);
								
				node.SimpleButton.on('click', function(){
					this.body.removeChild(node);
												
					if(this.body.childElements().length == 0){
						this.removeClassName('upload');	
						this.value = '';
					}
					
					this.Flag.hide();
					
					this.Observer.fire('cancel', node);
					
				}.bind(this));
				
			}.bind(this));
		}
		
		var array = [];
		
		this.Body().select('.line-element').each(function(e){
			
			if(e.Value()){
				array.push(e.Value());
			}
		});
		
		switch(array.length){
			default:
				this.value = array;
				break;
			case 1:
				this.value = array[0];
				break;
			case 0:
				this.value = '';	
		}
		
		return this.value;
	},
/**
 * DropFile#getLoadedData() -> Array<File>
 * 
 * Cette méthode retourne une collection d'instance File chargé sur le serveur.
 *
 * #### Attributs
 *
 * * `name`
 * * `size`
 * * `url`
 **/	
	getLoadedData:function(){
		var child = this.body.select('.loaded');
		var array = [];
		
		child.each(function(e){
			array.push(e.data);
		});
		
		return array;
	},
	
	getData: function(){
		this.body.child
	},
/**
 * DropFile#setLink(link) -> DropFile
 * - link (String): Lien du serveur de données.
 *
 * Cette méthode change le lien du serveur de données.
 **/
	setLink: function(link){
		this.link = link;
		return this;
	},
/**
 * DropFile#setParameters(parameters) -> DropFile
 * - parameters (String): paramètres.
 * 
 * Cette méthode assigne des paramètres à envoyer vers le script PHP lors de la récupération de données depuis ce dernier.
 **/
	setParameters: function(param){
		this.parameters = param + (param == '' ? '' : '&') + $WR().getGlobals('parameters');
		return this;
	}
};

//patch de prototype pour permettre le chargement de fichier
Ajax.Request.prototype.setRequestHeaders = function() {
	var headers = {
	  'X-Requested-With': 'XMLHttpRequest',
	  'X-Prototype-Version': Prototype.Version,
	  'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
	};
	
	if (this.method == 'post') {
		if(this.options.contentType){
	  		headers['Content-type'] = this.options.contentType +
				(this.options.encoding ? '; charset=' + this.options.encoding : '');
		}
	
	  /* Force "Connection: close" for older Mozilla browsers to work
	   * around a bug where XMLHttpRequest sends an incorrect
	   * Content-length header. See Mozilla Bugzilla #246651.
	   */
	  if (this.transport.overrideMimeType &&
		  (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
			headers['Connection'] = 'close';
	}
	
	if (typeof this.options.requestHeaders == 'object') {
	  var extras = this.options.requestHeaders;
	
	  if (Object.isFunction(extras.push))
		for (var i = 0, length = extras.length; i < length; i += 2)
		  headers[extras[i]] = extras[i+1];
	  else
		$H(extras).each(function(pair) { headers[pair.key] = pair.value });
	}
	
	for (var name in headers)
	  this.transport.setRequestHeader(name, headers[name]);
};

MUI.addWords({
	'Browse':'Parcourir',
	'Drop your file': 'Glissez vos fichiers ici',
	'Upload your file': 'Chargez votre fichier'
}, 'fr');
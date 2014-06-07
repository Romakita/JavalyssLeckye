/** section: Table
 * class wTable < Window
 * La classe wTable est une fenêtre avec liste intégrée. Elle gère la pagination et le champs de recherche rapide 
 * dans un tableau de données.
 **/
var WindowList = wTable = function(options){
	
	if(!Object.isNumber(options)){
		options.navbar = true;
	}
	
	var win = new Window(Object.isNumber(options) ? {navbar:true} : (options || {navbar:true}));
	Object.extend(win, this);
		
	win.setMinHeight(130);
	win.Resizable(true);
	win.initialize.apply(win, $A(arguments));
	return win;
};

wTable.prototype = {
/**
 * wTable#AlertBox -> AlertBox
 * Instance de l'AlertBox relative à la fenêtre.
 **/
	Alert: 				null,
/**
 * wTable#InputCompleter -> InputCompleter
 * Instance du champs de recherche Rapide.
 **/
	InputCompleter: 	null,
/*
 * wTable#Select -> Select
 * Instance du filtre de recherche avancée.
 **/
	select_:				null,
/**
 * wTable#SimpleTable -> SimpleTable
 * Instance de la table.
 **/
	SimpleTable:		null,
/**
 * wTable#BtnViewBy5 -> SimpleButton
 * Bouton d'affichage par 5 (ou valeur personnalisée).
 **/
	BtnViewBy5:			null,
/**
 * wTable#BtnViewBy10 -> SimpleButton
 * Bouton d'affichage par 10 (ou valeur personnalisée).
 **/
	BtnViewBy10:		null,
/**
 * wTable#BtnViewBy20 -> SimpleButton
 * Bouton d'affichage par 20 (ou valeur personnalisée).
 **/
	BtnViewBy20:		null,
/**
 * wTable#RANGE_1 -> Number
 * Valeur d'affichage du premier bouton.
 **/
	RANGE_1:			10,
/**
 * wTable#RANGE_2 -> Number
 * Valeur d'affichage du second bouton.
 **/
	RANGE_2:			20,
/**
 * wTable#RANGE_3 -> Number
 * Valeur d'affichage du troisième bouton.
 **/
	RANGE_3:			30,
/**
 * wTable#clauses -> Clauses
 * Clauses d'affichage de la liste.
 **/
	clauses: 			null,
/**
 * wTable#link -> String
 * Lien de la passerelle PHP.
 **/
	link:				'',
	/** @type String */
	cmd:				'',
	NAME_CMD:			'cmd',
	/** @type String */
	parameters:			'',
/**
 * new wTable(options)
 * - options (Object): Object de configuration.
 *
 * Cette méthode créée une nouvelle instance de wTable#
 * 
 * #### Attributs du paramètre options
 * 
 * Le constructeur prend en charge un paramètre `options` permettant de configurer l'instance rapidement. En plus des options
 * supporté par la classe [[Window]] sont ajoutés les options suivantes :
 *
 * * `range1` (`Number`): Nombre de ligne affichée par page pour le premier bouton.
 * * `range2` (`Number`): Nombre de ligne affichée par page pour le second bouton.
 * * `range3` (`Number`): Nombre de ligne affichée par page pour le troisième bouton.
 * * `complex` (`Boolean`): Si la valeur est vrai, le listing utilisera la classe ComplexTable en lieu et place de SimpleTable.
 * * `completer` (`Boolean`): Indique si le champs de recherche rapide est à afficher. (par defaut affiché).
 * * `select` (`Boolan`): Indique si le champs de recherche avancée est à afficher. (par defaut non affiché).
 * * `readOnly` (`Boolean`): Indique si la table est en lecture seule (sans les checkbox). (par defaut lecture et écriture).
 * * `link` (`String`): Lien de la passerelle PHP pour récupérer la liste.
 * * `parameters` (`String`): Paramètre à passer au script PHP.
 * * `onComplete` (`Function`): Fonction appelée après chargement des données.
 *
 **/
	initialize: function(obj){
		
		this.addClassName('wtable');
		var args = $A(arguments);

		var options = {
			range1:		10,
			range2:		20,
			range3:		30,
			completer:	true,
			select:		false,
			link:		$WR().getGlobals('link'),
			readOnly: 	false,
			progress:	true,
			parameters:	'',
			onComplete:	null,
			complex:	false,
			field:		'',
			delay:		0.3
		};
		
		if(!Object.isUndefined(obj)){
			if(Object.isNumber(obj)){
				switch(args.length){
					case 3:	options.range3 = args[2];
					case 2:	options.range2 = args[1];
					case 1:	options.range1 = args[0];
				}	
			}
			else{
				Object.extend(options, obj);	
			}
		}
		
		this.RANGE_1 = 		options.range1;
		this.RANGE_2 = 		options.range2;
		this.RANGE_3 = 		options.range3;
		this.link = 		options.link;
		this.parameters = 	options.parameters;
		this.count =		options.count;
		this.progress =		options.progress;
		this.delay =		options.delay;
		this.scrollbar =	options.scrollbar;
		
		if(Object.isFunction(options.complete)) this.observe('complete', options.complete);
		//#pragma region Instance
		
		//
		//Clauses
		//
		this.timer =			new Timer(this.onTick.bind(this), this.delay);
		//
		// Observer
		//
		this.Observer = new Observer();
		this.Observer.bind(this);
		//
		//AlertBox
		//
		this.Alert = 			this.createBox();
		//
		//Flag
		//
		this.Flag =				this.createFlag();
		//
		//Bubble
		//
		this.Bubble =			this.createBubble();			
		//
		//SimpleTable
		//
		this.ComplexTable = this.SimpleTable = 	this.Table =	new SimpleTable(options);
		this.Table.setStyle('width:100%');
		this.Table.ReadOnly(options.readOnly);
		this.Table.link = '';
		this.Table.title = '';
		
		this.ScrollBar = 	this.Table.ScrollBar;
		this.ProgressBar = 	this.Table.ProgressBar;
		
		this.Table.load = this.load.bind(this);
		
		this.clauses = 				this.Table.clauses;
		this.clauses.pagination =	options.range1;
		//
		//InputCompleter
		//		
		this.InputCompleter =  	new InputButton({icon:'search'});
		this.InputCompleter.setStyle({float:'right', top:'1px', right:'1px', width:'130px'});
		this.InputCompleter.setLink = function(){};
		this.Completer(options.completer);
		//
		//Select
		//
		this.select_ =			new Select();
		this.select_.setStyle({float:'right', top:'1px', right:'5px', width:'130px'});
		
		this.Select(options.select);
		
		this.Select.setData = 		function(e){return this.Select().setData(e);}.bind(this);
		this.Select.selectedIndex = function(e){return this.Select().selectedIndex(e);}.bind(this);
		this.Select.on = 			function(){return this.Select().on.apply(this.select_, $A(arguments));}.bind(this);
		this.Select.Value = 		function(){return this.Select().Value.apply(this.select_, $A(arguments));}.bind(this);
		this.Select.Text = 			function(){return this.Select().Text.apply(this.select_, $A(arguments));}.bind(this);
		//
		//Btn
		//
		this.DropMenu.setRanges(options.range1, options.range2, options.range3);
			
		this.BtnPrev =			this.DropMenu.BtnPrev;
		this.BtnNext =			this.DropMenu.BtnNext;
		this.Paging =			this.DropMenu.Paging;
		this.BtnViewBy10 =		this.DropMenu.BtnViewBy10;
		this.BtnViewBy20 =		this.DropMenu.BtnViewBy20;
		this.BtnViewBy30 =		this.DropMenu.BtnViewBy30;
		
		this.clauses = this.DropMenu.clauses = 	this.Table.clauses;
		this.DropMenu.clauses.pagination =	options.range1;
		
		this.DropMenu.on('change', function(){
			this.load();
		}.bind(this));
				
		//#pragma endregion Instance
		
		this.DropMenu.appendChild(this.InputCompleter);
		this.DropMenu.appendChild(this.select_);
		
		this.appendChild(this.SimpleTable);
		
		//#pragma region Event
		this.InputCompleter.observe('keyup', this.onKeyUp.bind(this));
							
		this.InputCompleter.observe('draw', function(line, data){
			//line.parentNode.hide();
		}.bind(this));
				
		var self = this;
		
		this.BtnPrev.observe('mouseover', function(evt){
			self.Flag.setText('<p class="icon-documentinfo">' + $MUI('Change de page') + '</p>').setType(FLAG.RB);
			self.Flag.color('grey').show(this, true);
		});
				
		this.BtnNext.observe('mouseover', function(evt){			
			self.Flag.setText('<p class="icon-documentinfo">' + $MUI('Change de page') + '</p>').setType(FLAG.RB);
			self.Flag.color('grey').show(this, true);
		});
		
		this.BtnViewBy10.observe('mouseover', function(evt){
			self.Flag.setText('<p class="icon-documentinfo">' + $MUI('Affiche la liste par') + ' ' + self.DropMenu.RANGE_1 + '</p>');
			self.Flag.setType(FLAG.BOTTOM).color('grey').show(this, true);
		});
		
		this.BtnViewBy20.observe('mouseover', function(evt){
			self.Flag.setText('<p class="icon-documentinfo">' + $MUI('Affiche la liste par') + ' ' + self.DropMenu.RANGE_2 + '</p>');
			self.Flag.setType(FLAG.BOTTOM).color('grey').show(this, true);
		});

		this.BtnViewBy30.observe('mouseover', function(evt){
			self.Flag.setText('<p class="icon-documentinfo">' + $MUI('Affiche la liste par') + ' ' + self.DropMenu.RANGE_3 + '</p>');
			self.Flag.setType(FLAG.BOTTOM).color('grey').show(this, true);
		});
		
		this.Paging.observe('mouseover', function(evt){
			self.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisisez le numéro de page et appuyer sur <b>entrée</b>') + '.</p>');
			self.Flag.setType(FLAG.RIGHT).color('grey').show(this, true);
		});
		
		Event.observe(this.select_, 'mouseover', function(evt){
			self.Flag.setText('<p class="icon-documentinfo">' + $MUI('Selectionnez un filtre pour effectuer une recherche avancée')+ '.</p>');
			self.Flag.setType(FLAG.LEFT).color('grey').show(this, true);	
		});
		
		Event.observe(this.InputCompleter, 'mouseover', function(evt){
			self.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez un mot pour une recherche rapide') + '.</p>');
			self.Flag.setType(FLAG.LEFT).color('grey').show(this, true);	
		});
		
		//this.Table.observe('clickheader', this.onClickHeader.bind(this));
		
		this.observe_ = this.observe;
		
		this.observe = function(eventName, callback){
			switch(eventName){
				case 'click':
				case 'click.header':
				case 'remove':
				case 'open':
					this.Table.observe(eventName, callback);
					break;
				case 'load':
				case 'error':
					this.Observer.observe(eventName, callback);
					break;
				case 'complete':
					this.Observer.observe('windowlist:complete', callback);
					break;	
				default:this.observe_(eventName, callback);
			}
			return this;
		};
		
		this.stopObserving_ = this.stopObserving;
		
		this.stopObserving = function(eventName, callback){
			switch(eventName){
				case 'click':
				case 'click.header':
				case 'remove':
				case 'open':
					this.Table.stopObserving(eventName, callback);
					break;
				case 'load':
				case 'error':
					this.Observer.stopObserving(eventName, callback);
					break;
				case 'complete':
					this.Observer.stopObserving('windowlist:complete', callback);
					break;	
				default:this.stopObserving_(eventName, callback);
			}
			return this;
		};
		
		this.title_back = this.getTitle();
		
		this.Title_ = this.Title;
		this.Title = function(ti, save){
			if(!Object.isUndefined(ti) && this.title_back == '') this.title_back = ti;
			return this.Title_(ti);
		}
	},
	
	destroy: function(){
		
		this.destroy = 		null;
		this.className = 	'';
		
		if(Object.isElement(this.parentNode)){
			this.parentNode.removeChild(this);
		}
		
		if(Object.isElement(this.MinWin.parentNode)){
			this.MinWin.parentNode.removeChild(this.MinWin);
		}
		
		this.removeChild = 	this.removeChild_back;
		this.removeChilds = this.removeChilds_back;	
		
		$WR.reject(this);
	},
/**
 * wTable#addHeader(options) -> wTable
 * - options (Object): Objet de déscription de l'entête de la table.
 *
 * Cette méthode permet de configurer la table. Chaque champs de `options` 
 * représente une colonne de la table. La présence d'un champs dans le paramètre `options` doit correspondre
 * si possible à la structure de l'objet passé à la méthode [[wTable#addRows]].
 *
 * Chaque champs définit dans le paramètre `options` pourra par la suite être intercepté par la 
 * méthode [[wTable#addFilter]] pour en modifié la présentation.
 *
 * ##### Exemple d'une entete
 *
 *     var win = new wTable();
 *     var data = [
 *         {Nom: 'Lenzotti', Prenom:'Romain'},
 *         {Nom: 'Lenzotti', Prenom:'Aurelie'}
 *     ];
 *     win.addHeader({
 *         Nom:{title:'Nom', width:200},
 *         Prenom:{title:'Prénom'}
 *     });
 *     win.addRows(data);
 *
 **/
	addHeader: function(obj){
		if(!Object.isUndefined(obj.__class__) && obj.__class__ == 'headerlist'){
			obj = obj.getObject();
		}
		this.Table.addHeader(obj);
		return this;
	},
/**
 * wTable#addFilters(key, fn) -> wTable
 * - key (String): Clef du la colonne à filtrer lors de l'affichage du champs.
 * - fn (Function): Fonction associée au filtre.
 *
 * Cette méthode vous permet de modifier l'affichage d'une colonne ou d'un champ du tableau.
 * Un filtre `filter` est associé à une colonne `key` ou un regroupement de clef `key` (`Array`).
 *
 * #### Prototype d'un filtre
 * 
 * Le filtre prend toujours trois paramètres et en retourne un :
 *
 * * `e` (`Mixed`): Valeur courrante du tableau de données.
 * * `cel` (`Element`): Cellule du tableau.
 * * `data` (`Object`): Données de la ligne complète.
 *
 * Paramètre de retour (`String`, `Number` ou `Element`).
 *
 * ##### Exemple de filtre
 *
 * Dans cet exemple, je souhaite créer un filtre pour la colonne date afin d'afficher cette dernière 
 * dans la langue de Molière.
 *
 *     var win = new wTable();
 *     var data = [
 *         {Nom: 'Lenzotti', Prenom:'Romain', date:'1987-07-24'}, 
 *         {Nom: 'Lenzotti', Prenom:'Aurelie', date:'1982-10-05'}
 *     ];
 *     win.addHeader({
 *         Nom:{title:'Nom', width:200},
 *         Prenom:{title:'Prénom'},
 *         date:{title:'Date de naissance', width:200}
 *     });
 *     win.addFilters('date', function(e, cel, data){
 *         return e.toDate().toString_('date', 'fr');
 *     });
 *     win.addRows(data);
 *
 **/
	addFilters: function(){
		this.Table.addFilters.apply(this.Table, $A(arguments));
		return this;
	},
/**
 * wTable#addRows(array) -> wTable
 * - array (Array): Tableau de données.
 * 
 * Tableau de données à ajouter à la table.
 **/
	addRows: function(){
		this.Table.addRows.apply(this.Table, $A(arguments));
		this.ScrollBar.update();
	
		return this;
	},	
/**
 * wTable#Select(bool) -> Select
 * 
 * Active ou Désactive le champs de recherche avancées.
 **/
 	Select:function(bool){
		if(!Object.isUndefined(bool)) {
			if(bool){
				this.select_.setStyle('display:block');
			}else{
				this.select_.setStyle('display:none');
			}
		}
		return this.select_;
	},
/**
 * wTable#Completer(bool) -> InputCompleter
 * 
 * Active ou Désactive le champs de recherche rapide.
 **/
 	Completer:function(bool){
		if(!Object.isUndefined(bool)) {
			if(bool){
				this.InputCompleter.setStyle('display:block');
			}else{
				this.InputCompleter.setStyle('display:none');
			}
		}
		return this.InputCompleter;
	},
/**
 * wTable#load() -> WinList
 *
 * Charge les données de la liste en fonction des paramètres de restriction enregistrés dans wTable#clauses.
 **/
 	loadData: function(){return this.load()},
	load: function(){
		if(this.link != ''){

			var globals = 		$WR().getGlobals('parameters');		
			var parameters = 	this.parameters
							+ '&clauses=' + this.clauses.toJSON()
							+ (globals == '' ? '' : '&' + globals);
			
			if(Object.isUndefined(this.backupIcon_) || this.backupIcon_ == '') this.backupIcon_ = this.getIcon();
			
			this.ProgressBar.setProgress(0, 4, '');
			if(this.progress) {
				this.ProgressBar.show();
			}
			
			this.Observer.fire('load');
			
			new Ajax.Request(this.link, {
				parameters: parameters,
				method:		'post',
				
				onCreate:function(result){				
					if(this.progress) this.setIcon('loading-gif');
					this.ProgressBar.setProgress(1, 4, $MUI('Chargement de la liste. Patientez svp...'));
					
				}.bind(this),
				
				onLoading:function(){
					this.ProgressBar.setProgress(2, 4, $MUI('Chargement de la liste. Patientez svp...'));
				}.bind(this),
				
				onLoaded:function(){
					this.ProgressBar.setProgress(3, 4, $MUI('Chargement de la liste. Patientez svp...'));
				}.bind(this),
				
				onInteractive:function(){
					this.ProgressBar.setProgress(4, 4, $MUI('Chargement de la liste. Patientez svp...'));
				}.bind(this),
				
				onSuccess:function(){
					this.ProgressBar.setProgress(4, 4, $MUI('Chargement de la liste. Patientez svp...'));
				}.bind(this),
				
				onComplete: function(result){
					
					this.ProgressBar.setProgress(4, 4, $MUI('Chargement de la liste. Patientez svp...'));

					this.setIcon(this.backupIcon_);
					this.ProgressBar.hide();
					this.onComplete(result)
					
				}.bind(this)
			});
		}
		return this;
	},	
	
	search:function(word){
		this.Completer().setText(word);
		this.clauses.page = 	0;
		this.clauses.where = 	this.Completer().getText();			
		this.load();
	},
/*
 * wTable#onComplete(result) -> void
 **/
	onComplete:function(result){
		
		var obj = result.responseText.evalJSON();
		
		this.Table.clear();
		this.maxLength = 	1 * obj.maxLength;

		this.setTitle(this.title_back + ' (' + this.maxLength + ' '+ $MUI('enregistrement' + (this.maxLength >1 ? 's':'')) + ' ' + $MUI('retourné' + (this.maxLength >1 ? 's':'')) + ')', false);
		
		this.Table.addRows($A(obj));
		
		this.Observer.fire('windowlist:complete', obj);
				
		this.DropMenu.setMaxLength(obj.length == 0 ? 0 : this.maxLength);
		
		this.Table.refresh();
		
	},
/*
 * wTable#onClickHeader(evt, field, order) -> void
 **/
	onClickHeader: function(evt, field, order){
		//this.clauses.order = field + ' ' +order;
		//this.load();
	},
/*
 * wTable#onKeyUp(evt, value) -> void
 **/
	onKeyUp: function(evt){
		
		this.timer.stop();
		
		if(this.Completer().getText() == '' && this.clauses.where != '') {
			this.clauses.where = 	'';
			this.load();
		}
		
		switch(evt.keyCode){
			case 13:
				if(this.Completer().getText().length >= 2){
					this.clauses.page = 	0;
					this.clauses.where = 	this.Completer().getText();			
					this.load();
					break;
				}
			default:
				this.timer.start();		
		}
	},
/*
 * wTable#onTick() -> void
 **/
	onTick: function(){
		this.timer.stop();
		
		if(this.Completer().getText().length >= 2){
			this.clauses.page = 	0;
			this.clauses.where = 	this.Completer().getText();			
			this.load();
		}
	},
/**
 * wTable#setLink(link) -> wTable
 * - link (String): Lien vers la passerelle PHP.
 *
 * Cette méthode assigne le lien de connexion au serveur d'application.
 **/
	setLink: function(link){
		this.link = link;
		return this;
	},
/*
 * wTable#setCommand(cmd, parameters) -> wTable
 * - cmd (String): La commande telle qu'elle est defini par le script PHP.
 * - parameters (String): Paramètre supplémentaire lors de l'envoi de données.
 *
 * Assigne la commande et les paramètres à l'instance. Ces informations seront 
 * envoyées à PHP à chaque fois que la liste sera rechargé.
 **/
	setCommand: function(cmd, parameters){

		var name = cmd.split('=');
		
		if(name.length == 1){
			this.parameters = this.NAME_CMD + '=' + name[0];	
		}else{
			this.parameters = cmd;	
		}
		
		if(!Object.isUndefined(parameters)){
			this.parameters += "&" + parameters;
		}
				
		return this;
	},
/**
 * wTable#setParameters(parameters) -> wTable
 * - parameters (String): Paramètres à envoyer.
 *
 * Assigne les paramètres à l'instance. Ces informations seront 
 * envoyées à PHP à chaque fois que la liste sera rechargé.
 **/
	setParameters: function(parameters){
		this.parameters = parameters;
		return this;
	},
/**
 * wTable#setRanges(range, rangeTwo, rangeThree) -> wTable
 *
 * Cette méthode permet d'assigner le nombre de ligne affichée pour chaque boutton de l'instance.
 **/
	setRanges: function(r1, r2, r3){
		this.DropMenu.setRange(r1, r2, r3);
		return this; 		
	},
/**
 * wTable#scrollToLastInsert() -> void
 *
 * Cette méthode permet de déplacer la barre de scroll au dernier élément inseré dans le tableau.
 **/
	scrollToLastInsert: function(){
		this.ScrollBar.scrollTo(this.Table.lastrow);
	}
};

var HeaderList = Class.create();
HeaderList.prototype = {
	/** @ignore */
	__class__:'headerlist',
	/** @type Object */
	options: null,
	/** 
	 * Cette méthode créée une nouvelle entete pour la fenêtrelisté.
	 * @class Cette méthode créée une nouvelle entete pour la fenêtrelisté.
	 * @constructs
	 */
	initialize:function(obj){
		this.options = Object.isUndefined(obj) ? {} : obj;
	},
	/**
	 * Cette méthode ajoute une clef avec sa valeur pour l'entete.
	 * @param {String} key Clef.
	 * @param {Object} obj Objet de configuration de la colonne.
	 */
	add: function(key, obj, it){
		if(Object.isUndefined(it)){
			this.options[key] = obj;
		}
		else{
			this.addAt(key, obj, it);
		}
		return this;
	},
	/**
	 * Cette méthode ajoute une clef avec sa valeur pour l'entete à la position demandé.
	 * @param {String} key Clef.
	 * @param {Object} obj Objet de configuration de la colonne.
	 * @param {Number} it Indice d'insertion.
	 */
	addAt: function(key, obj, it){
					
		var obj_ = {};
		var i = 0;
		for(var key_ in this.options){
			if(i == it){
				obj_[key] = obj;
			}
			obj_[key_] = this.options[key_];
			i++;
		}

		this.options = obj_;
		return this;
	},
	/**
	 * Retourne un object equivalent de l'entete.
	 */
	getObject: function(){
		return Object.toJSON(this.options).evalJSON();
	},
	/** 
	 * Cette méthode ajoute une entete complete.
	 */
	setObject: function(obj){
		this.options = obj;
	}
};

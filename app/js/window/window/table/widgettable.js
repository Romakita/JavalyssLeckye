/** section: Table
 * class WidgetTable < Widget
 * 
 * Cette classe permet de créer un conteneur de type Widget avec une instance SimpleTable ou ComplexTable.
 *
 * <p class="note">version 0.1 - Window 2.5</p>
 * <p class="note">Cette classe est définie dans le fichier window.widgettable.js</p>
 **/
var WidgetTable = Class.from(Widget);

WidgetTable.prototype = {
	className:			'wobject border widget table',
/**
 * WidgetTable#InputCompleter -> InputCompleter
 * Instance du champs de recherche Rapide.
 **/
	InputCompleter: 	null,
/**
 * WidgetTable#Select -> Select
 * Instance du filtre de recherche avancée.
 **/
	Select:				null,
/**
 * WidgetTable#Table -> SimpleTable | ComplexTable
 * Instance de la table.
 **/
	Table:		null,
/**
 * WidgetTable#BtnViewBy5 -> SimpleButton
 * Bouton d'affichage par 5 (ou valeur personnalisée).
 **/
	//BtnViewBy5:			null,
/**
 * WidgetTable#BtnViewBy10 -> SimpleButton
 * Bouton d'affichage par 10 (ou valeur personnalisée).
 **/
	//BtnViewBy10:		null,
/**
 * WidgetTable#BtnViewBy20 -> SimpleButton
 * Bouton d'affichage par 20 (ou valeur personnalisée).
 **/
	//BtnViewBy20:		null,
/*
 * WidgetTable#RANGE_1 -> Number
 * Valeur d'affichage du premier bouton.
 **/
	//RANGE_1:			10,
/*
 * WidgetTable#RANGE_2 -> Number
 * Valeur d'affichage du second bouton.
 **/
	//RANGE_2:			20,
/*
 * WidgetTable#RANGE_3 -> Number
 * Valeur d'affichage du troisième bouton.
 **/
	//RANGE_3:			30,
/**
 * WidgetTable#clauses -> Clauses
 * Clauses d'affichage de la liste.
 **/
	//clauses: 			null,
/**
 * WidgetTable#link -> String
 * Lien de la passerelle PHP.
 **/
	link:				'',
	/** @type String */
	cmd:				'',
	NAME_CMD:			'cmd',
	/** @type String */
	parameters:			'',
/**
 * new WidgetTable(options)
 * - options (Object): Object de configuration.
 *
 * Cette méthode créée une nouvelle instance de WidgetTable.
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
		
		var options = {
			range1:		10,
			range2:		20,
			range3:		30,
			completer:	true,
			select:		false,
			link:		$WR().getGlobals('link'),
			readOnly: 	false,
			parameters:	'',
			onComplete:	null,
			complex:	false,
			field:		'',
			count:		true,
			progress:	true,
			scrollbar:	true,
			delay:		0.4,
			menu:		true
		};
		
		Object.extend(options, obj || {});
		
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
		//Flag
		//
		this.Flag =				this.createFlag();
		//
		// DropMenu
		//
		this.DropMenu =			new NavBar({
			range1:	options.range1,
			range2:	options.range2,
			range3:	options.range3,
			type:	DropMenu.TOP	
		});
		
		this.DropMenu.Chrome(true);
		
		
		this.DropMenu.hide_ = this.DropMenu.hide;
		this.DropMenu.hide = function(){
			this.Menu(false);
			this.DropMenu.hide_();
		}.bind(this);
		
		//this.DropMenu.show = function(){
			//this.Menu(true);
		//}.bind(this);
		this.DropMenu.show_ = this.DropMenu.show;
		this.DropMenu.show = function(){
			this.Menu(true);
			this.DropMenu.show_();
		}.bind(this);
		//
		//Table
		//
		this.Table =	new SimpleTable(options);
		this.Table.setStyle('width:100%');
		this.Table.ReadOnly(options.readOnly);
		this.Table.link = '';
		
		this.Table.load = this.load.bind(this);
		
		this.ProgressBar = 	this.Table.ProgressBar;
		this.ScrollBar =	this.Table.ScrollBar;
		//
		//InputCompleter
		//		
		this.InputCompleter =  	new InputButton({icon:'search'});
		this.InputCompleter.setStyle({float:'right', top:'1px', right:'1px', width:'130px'});
		
		this.Completer(options.completer);
		//
		//Select
		//
		this.select =			new Select();
		this.select.setStyle({float:'right', top:'1px', right:'5px', width:'130px'});
		this.Select(options.select);
		
		//this.GroupNavigation = 	new GroupButton();
		//this.GroupNavigation.hide();
		//
		//Btn
		//	
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
		
		this.DropMenu.appendChild(this.Completer());
		this.DropMenu.appendChild(this.Select());
		
		this.Header().appendChild(this.DropMenu);	
		this.Body().appendChild(this.Table);
		this.Chrome(true);
		//#pragma region Event
		
		this.Completer().observe('keyup', this.onKeyUp.bind(this));
		
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
		
		this.Select().observe('mouseover', function(evt){
			self.Flag.setText('<p class="icon-documentinfo">' + $MUI('Selectionnez un filtre pour effectuer une recherche avancée')+ '.</p>');
			self.Flag.setType(FLAG.LEFT).color('grey').show(this, true);	
		});
		
		this.Completer().observe('mouseover', function(evt){
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
				case 'complete':
					this.Observer.observe(eventName, callback);
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
			
				case 'complete':
					this.Observer.stopObserving(eventName, callback);
					break;	
				default:this.stopObserving_(eventName, callback);
			}
			return this;
		};
		
		this.title_back = this.getTitle();
		
		this.setTitle_ = this.setTitle;
		this.setTitle = function(ti, save){
			if(!Object.isUndefined(ti) && this.title_back == '') this.title_back = ti;
			
			if(Object.isUndefined(save)){
				this.title_back = ti;	
			}
			
			return this.setTitle_(ti);
		};
		
				
		this.Menu(options.menu);
		
		this.body.setStyle = function(obj){
			var r = Element.setStyle(this.body, obj);
			
			if(Object.toJSON(obj).match(/max-height|height/) && !Object.toJSON(obj).match(/min-height/)){
				this.Table.addClassName('absolute');
			}
			
			return r;
		}.bind(this);
		
		this.Body().appendChild(this.ProgressBar);
	},
/*
 * WidgetTable.Chrome() -> WidgetTable
 **/
	Chrome:function(bool){
		this.Table.Chrome(bool);
		
		this.removeClassName('chrome');
		
		if(bool){
			this.addClassName('chrome');	
		}
		
		return this;
	},
/**
 * WidgetTable#addHeader(options) -> WidgetTable
 * - options (Object): Objet de déscription de l'entête de la table.
 *
 * Cette méthode permet de configurer la table. Chaque champs de `options` 
 * représente une colonne de la table. La présence d'un champs dans le paramètre `options` doit correspondre
 * si possible à la structure de l'objet passé à la méthode [[WidgetTable#addRows]].
 *
 * Chaque champs définit dans le paramètre `options` pourra par la suite être intercepté par la 
 * méthode [[WidgetTable#addFilter]] pour en modifié la présentation.
 *
 * ##### Exemple d'une entete
 *
 *     var winList = new WidgetTable();
 *     var data = [
 *         {Nom: 'Lenzotti', Prenom:'Romain'},
 *         {Nom: 'Lenzotti', Prenom:'Aurelie'}
 *     ];
 *     //j'ai défini un tableau de données
 *     //maintenant je définit une entete pour l'afficher
 *     winList.addHeader({
 *         Nom:{title:'Nom', width:200},
 *         Prenom:{title:'Prénom'}
 *     });
 *     //j'ajoute le tableau de données et WidgetTable s'occupe du reste.
 *     winList.addRows(data);
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
 * WidgetTable#addFilters(key, fn) -> WidgetTable
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
 *     var widget = new WidgetTable();
 *     var data = [
 *         {Nom: 'Lenzotti', Prenom:'Romain', date:'1987-07-24'}, 
 *         {Nom: 'Lenzotti', Prenom:'Aurelie', date:'1982-10-05'}
 *     ];
 *     widget.addHeader({
 *         Nom:{title:'Nom', width:200},
 *         Prenom:{title:'Prénom'},
 *         date:{title:'Date de naissance', width:200}
 *     });
 *     widget.addFilters('date', function(e, cel, data){
 *         return e.toDate().toString_('date', 'fr');
 *     });
 *     widget.addRows(data);
 *
 **/
	addFilters: function(){
		this.Table.addFilters.apply(this.Table, $A(arguments));
		return this;
	},
/**
 * WidgetTable#addRows(array) -> WidgetTable
 * - array (Array): Tableau de données.
 * 
 * Cette méthode ajoute les données `array` à la suite des données affichées dans le tableau.
 **/
	addRows: function(array){
		
		this.Table.addRows(array);
		
		if(this.title_back && this.count){
			var len = array.length;
			this.setTitle(this.title_back + ' (' + len + ' '+ $MUI('enregistrement' + (len > 1 ? 's':'')) + ' ' + $MUI('retourné' + (len>1 ? 's':'')) + ')', false);
		}
		
		return this;
	},
/**
 * WidgetTable#setData(array) -> WidgetTable
 * - array (Array): Tableau de données.
 * 
 * Cette méthode remplace les données par celles du tableau de données passé en paramètre.
 **/
 	setData:function(array){
		this.Table.clear();
		this.addRows(array);
		return this;
	},
/**
 * WidgetTable#getData() -> Array
 * 
 * Cette méthode retourne l'ensemble de données contenu dans le tableau.
 **/
 	setData:function(array){
		this.Table.clear();
		this.addRows(array);
		return this;
	},
/**
 * WidgetTable#Completer(bool) -> InputCompleter
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
 * WidgetTable#Menu(bool) -> DropMenu
 * 
 * Active ou Désactive le menu.
 **/
 	Menu:function(bool){
		if(!Object.isUndefined(bool)) {
			
			this.removeClassName('menu');
			
			if(bool){
				this.addClassName('menu');
			}
			
		}
		return this.DropMenu;
	},
/**
 * WidgetTable#Select(bool) -> Select
 * 
 * Active ou Désactive le champs de recherche avancées.
 **/
 	Select:function(bool){
		if(!Object.isUndefined(bool)) {
			if(bool){
				this.select.setStyle('display:block');
			}else{
				this.select.setStyle('display:none');
			}
		}
		return this.select;
	},

/**
 * WidgetTable#load() -> WinList
 *
 * Charge les données de la liste en fonction des paramètres de restriction enregistrés dans WidgetTable#clauses.
 **/
	load: function(){
		
		if(this.link != ''){
			var globals = 		$WR().getGlobals('parameters');		
			var parameters = 	this.parameters
							+ '&clauses=' + this.clauses.toJSON()
							+ (globals == '' ? '' : '&' + globals);
			
			if(Object.isUndefined(this.backupIcon_) || this.backupIcon_ == '') this.backupIcon_ = this.getIcon();
			
			this.ProgressBar.setProgress(0, 4, '');
			if(this.progress) this.ProgressBar.show();
			
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
					
					if(this.progress){
						this.setIcon('');
						this.setIcon(this.backupIcon_);
						this.ProgressBar.hide();
					}
					
					this.onComplete(result);
					
				}.bind(this)
			});
		}
		return this;
	},	
/*
 * WidgetTable#onComplete(result) -> void
 **/
	onComplete:function(result){
		
		var obj = result.responseText.evalJSON();
			
		this.Table.clear();
		this.maxLength = 	1 * obj.maxLength;
		
		this.addRows($A(obj));
				
		this.Observer.fire('complete', obj);
		
		this.DropMenu.setMaxLength(obj.length == 0 ? 0 : this.maxLength);
				
	},
/*
 * WidgetTable#onClickHeader(evt, field, order) -> void
 **/
	onClickHeader: function(evt, field, order){
		//this.clauses.order = field + ' ' +order;
		//this.load();
	},
	
	search:function(word){
		this.Completer().setText(word);
		this.clauses.page = 	0;
		this.clauses.where = 	this.Completer().getText();			
		this.load();
	},
/*
 * WidgetTable#onKeyUp(evt, value) -> void
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
 * WidgetTable#onTick() -> void
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
 * WidgetTable#setLink(link) -> WidgetTable
 * - link (String): Lien vers la passerelle PHP.
 *
 * Cette méthode assigne le lien de connexion au serveur d'application.
 **/
	setLink: function(link){
		this.link = link;
		return this;
	},
/*
 * WidgetTable#setCommand(cmd, parameters) -> WidgetTable
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
 * WidgetTable#setParameters(parameters) -> WidgetTable
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
 * WidgetTable#setRanges(range, rangeTwo, rangeThree) -> WidgetTable
 *
 * Cette méthode permet d'assigner le nombre de ligne affichée pour chaque boutton de l'instance.
 **/
	setRanges: function(r1, r2, r3){
		this.DropMenu.setRanges(r1,r2,r3);
		return this;
	},
/**
 * WidgetTable#scrollToLastInsert() -> void
 *
 * Cette méthode permet de déplacer la barre de scroll au dernier élément inseré dans le tableau.
 **/
	scrollToLastInsert: function(){
		this.ScrollBar.scrollTo(this.Table.lastrow);
	}
};
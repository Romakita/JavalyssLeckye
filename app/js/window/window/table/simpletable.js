/** section: Table
 * class SimpleTable < Element
 * Classe de gestion des tableaux de données. SimpleTable prend n'importe quel tableau 
 * de données est l'affiche à l'écran comme représenté ci-dessous :
 *
 * <img src="http://www.javalyss.fr/sources/window-simple-table.png" style="width:100%" />
 *
 * La seule condition pour afficher un tableau de donnée est de configurer l'entête avec la méthode [[SimpleTable#addHeader]].
 * L'entête correspond aux champs du tableau de données.
 *
 * #### Exemple d'entête
 * 
 *      var st = new SimpleTable();
 *      st.addHeader({
 *           'Name': {title:'Nom', width:300},
 *           'Date': {title:'Date naissance', width:90, style:'text-align:center'}
 *      });
 *      
 *      st.addRows([{Name:'Rom', Date:'1987'}, {Name:'Rom2', Date:'1982'}]);
 *      document.body.appendChild(st);
 *
 **/
var SimpleTable = ComplexTable = Class.createSprite('div');
SimpleTable.prototype = {
	/** @ignore */
	__class__:	'simpletable',
	/** @ignore */
	className:	'wobject simpletable',
	link:		'',
/**
 * SimpleTable#link -> String
 * Lien PHP pour récupérer les données.
 **/
	parameters:	'',
/*
 * SimpleTable#readOnly -> Boolean
 * Indique si la table est en lecture seule.
 **/
	readOnly:	false,
/*
 * SimpleTable#empty -> Boolean
 * Cette méthode ajoute une bandeau indiquant que la liste est vide.
 **/
	empty:		false,
	
	isEmpty:	true,
/**
 * SimpleTable#sort -> Boolean
 * Active le tri dans le tableau lorsque `link` existe.
 **/
	sort:		true,
/**
 * SimpleTable#field -> String
 * Champs de regroupement des données.
 **/	
	groupBy:	false,
/**
 * SimpleTable#text -> String
 **/	
	text:		'',
/**
 * SimpleTable#text -> String
 **/
 	selectable:	false,
/**
 * SimpleTable#sum -> Boolean
 **/
	sum:		false,
/*
 * SimpleTable#overable -> Boolean
 * Indique que les lignes du tableau change d'état au survol de la souris.
 **/
 	overable:	true,
/**
 * SimpleTable#onWriteName -> Function
 * Assigne une fonction dans cette attribut pour modifier l'affichage du nom de la valeur de la clef.
 **/
	onWriteName:	null,
/**
 * SimpleTable#overflow -> Function
 * Assigne une fonction dans cette attribut pour modifier l'affichage du nom de la valeur de la clef.
 **/
	overflow:		false,
	
	progress:	true,
	
	scrollbar:	true,
	
	length:		0,
/**
 * new SimpleTable([options])
 * - options (Object): Objet de configuration.
 *
 * Créée un nouvelle instance du gestionnaire de tableau de données.
 *
 * #### Attributs du paramètre options
 * 
 * Le constructeur prend en charge un paramètre `options` permettant de configurer l'instance rapidement :
 *
 * * `empty` (`String`): Affiche le message stocké dans le paramètre `empty` lorsque le tableau est vide.
 * * `link` (`String`): Lien de la passerelle PHP pour récupérer la liste.
 * * `overable` (`Boolean`): Indique si la ligne doit changer d'état au survol de la souris.
 * * `parameters` (`String`): Paramètre à passer au script PHP.
 * * `readOnly` (`Boolean`): Indique si la table est en lecture seule (sans les checkbox). (par defaut lecture et écriture).
 * * `selectable` (`Boolean`): Indique si l'utilisateur peut selectionner une ligne du tableau.
 * * `sort` (`Boolean`): Indique le tableau peut etre trié.
 *
 **/
	initialize: function(options){
		
		this.link = $WR().getGlobals('link');
		this.setTheme();
		
		if(!Object.isUndefined(options)){
			
			for(var key in options){
				if(Object.isFunction(this[key])) continue;
				if(key == 'title') continue;
				this[key] = options[key];
			}
		}
		
		if(this.field){
			this.groupBy = this.field;	
		}
		
		this.Observer =		new Observer();
		this.Observer.bind(this);
		this.config = 		{};
		this.filters_ = 	{};
		this.clauses =		new Clauses({pagination:500});
		
		this.TABLE_HEAD = new Node('table', {className:'wobject simple-table table-header'}, [
			this.THEAD = 	new Node('thead',[
								this.TR_HEAD = new Node('tr', {className:'st-tr-h'},[
									//new Node('td', {width:12, }),
									new Node('td',{className:"col-checkbox"}, [
										this.checkbox = new Checkbox({type:'checkbox'})
									])
								])
							])
		]);
		
		this.TABLE_BODY = new Node('table', {className:'wobject simple-table table-body'},
			new Node('thead', [
				new Node('tr', {className:'st-tr-h'},[
					
					new Node('td',{className:"col-checkbox"}, [
						
					])
				])
			])
		);
				
		this.appendChilds([
			this.header = 	new Node('div', {className:'wrap-header'}, this.TABLE_HEAD),
			this.body = 	new Node('div', {className:'wrap-body'}, this.TABLE_BODY)
		]);
		//
		//
		//		
		if(this.empty){
			this.empty = new Node('div', {className:"wrap-empty"}, Object.isString(this.empty) ? this.empty : '- '+ $MUI('Aucun résultat rétourné') + '- ');
			this.body.appendChild(this.empty);
			this.empty.hide();
		}	
		//
		//ProgressBar
		//
		this.ProgressBar =		this.createProgressBar({
									min:		0,
									max:		4,
									text:		$MUI('Chargement de la liste. Patientez svp...')
								});	
		//
		// ScrollBar
		//
		if(this.scrollbar === false){
			this.addClassName('scrollbar-classic');
			
			Event.observe(this.body, "DOMMouseScroll", function(event){
				if(event.stopPropagation){
					event.stopPropagation();
				}
				event.cancelBubble = true;
				
				this.header.scrollLeft = this.body.scrollLeft;			
			}.bind(this), false); // Firefox*/
			
			Event.observe(this.body, "scroll", function(event){
				if(event.stopPropagation){
					event.stopPropagation();
				}
				event.cancelBubble = true;
				
				this.header.scrollLeft = this.body.scrollLeft;			
			}.bind(this), false);
			
		}else if(this.scrollbar === true) {
			this.createScrollBar();
		}else{
			this.ScrollBar = this.scrollbar;
		}
		
		if(this.overflow){
			this.addClassName('overflow');
		}
		
		
		var sender = this;
		this.checkbox.observe('click', function(){
			sender.setChecked(this.Checked());
		});
		
		this.ReadOnly(this.readOnly);
		this.Overable(this.overable);
		this.Sortable(this.sort);
	},
	
	destroy: function(){
		this.className = '';
		this.stopObserving();
		this.destroy = null;
		
		this.clear();
		
		this.Observer.destroy();
		
		this.Observer = 	null;
		this.config = 		null;
		this.filters_ = 	null;
		this.empty =		null;
		this.clauses =		null;
		
		this.THEAD = 		null;
		this.TR_HEAD =		null;
		this.checkbox =		null;	
		this.parameters = 	null;
						
		this.TBODY = 		null;
		this.TR_BODY = 		null;
		
		this.select('.wobject').each(function(e){
			if(Object.isFunction(e.destroy)) e.destroy();
		});
	},
/**
 * SimpleTable#Header() -> Element
 * 
 * Cette méthode retourne l'élément d'entete de l'instance [[SimpleTable]].
 **/	
	Header: function(){
		return this.THEAD;
	},
	
	Body: function(){
		return this.body;
	},
/**
 * SimpleTable#createScrollBar() -> ScrollBar
 *
 * Cette méthode créée une [[ScrollBar]] permettant le déplacement du contenu du [[Widget]].
 **/
 	createScrollBar: function(){
		//
		// wrapper
		//
		this.wrapper = 	new Node('div', {className:'wrapper'});
		
		var childs = this.body.childElements();
		if(childs.length){
			this.wrapper.appendChilds(childs);
		}
		
		this.body.appendChild(this.wrapper);	
				
		this.ScrollBar = new ScrollBar({
			node:			this.body, 
			wrapper:		this.wrapper, 
			type:			this.overflow ?  'all' : 'vertical', 
			useTransform:	false
		});
				
		this.body.appendChild = function(e){
			this.wrapper.appendChild(e);
			return this;
		}.bind(this);
		
		this.body.removeChild = function(e){
			this.wrapper.removeChild(e);
			return this;
		}.bind(this);
		
		if(this.overflow){
			this.ScrollBar.observe('scroll', function(){
				this.header.scrollLeft = this.ScrollBar.getScrollLeft();
			}.bind(this));
			
			this.ScrollBar.observe('scrollend', function(){
				this.header.scrollLeft = this.ScrollBar.getScrollLeft();
			}.bind(this));
		}
				
		return this.ScrollBar;
	},
	
	createProgressBar: function(obj){
		if(!Object.isUndefined(this.ProgressBar)) return;
		
		var options = {
			text:		$MUI('Chargement en cours. Patientez svp') + '...',
			fullscreen: true
		};
		
		Object.extend(options, obj || {});
		
		this.ProgressBar = new ProgressBar(options);
		this.ProgressBar.hide();
		
		this.appendChild(this.ProgressBar);
		
		return this.ProgressBar;
	},
/**
 * SimpleTable#addHeader(options) -> SimpleTable
 * - options (Object): Objet de configuration.
 *
 * Cette méthode vous permet de configurer une entête pour l'affichage du tableau de données.
 *
 * #### Exemple d'entête
 * 
 *      var st = new SimpleTable();
 *      st.addHeader({
 *           'Name': {title:'Nom', width:300},
 *           'Date': {title:'Date naissance', width:90, style:'text-align:center'},
 *           'Actif': {title:'Activer compte', width:30, style:'text-align:center', type:'checkbox'}
 *      });
 *      
 *      st.addRows([{Name:'Rom', Date:'1987'}, {Name:'Rom2', Date:'1982'}]);
 *      document.body.appendChild(st);
 *
 * #### Attribut de l'objet options
 *
 * * `sort` : Si ça valeur est `false` alors l'utilisateur ne pourra pas trier le tableau sur cette colonne.
 * * `type` : Peut prendre les valeurs suivantes radio, checkbox et date. 
 * * `title` : Titre de la colonne.
 * * `style` : Style CSS à appliquer sur la colonne.
 * * `name` : Nom de la colonne lorsque vous utilisez le type checkbox ou radio.
 * * `format`: Format de la date à afficher lorsque vous utilisez le type date. Le format peut être `date`, `datetime` ou personnalisé.
 * * `order`: Assigner le tri par défaut de la colonne avec les valeurs ASC ou DESC.
 *
 * #### Champs type
 *
 * Depuis la version 2.2, l'entête supporte les champs typés. C'est-à-dire que des filtres seront automatiquement généré pour l'affichage du tableau.
 * 
 * Les types suivants sont supportés :
 *
 * * `checbox` : Ajoute à chaque cellule de la colonne une case à cocher.
 * * `radio` : Ajoute à chaque cellule de la colonne une case à cocher.
 * * `date` : Les cellules seront formatés pour afficher une date. Le champs `format` peut être rajouté afin spécifié le format de la date.
 * * `action` : Deux boutons seront créer pour ouvrir ou supprimer la ligne.
 * * `color` : Ajoute un ColoredBox à la place du code couleur de la cellule.
 *
 **/
 	setHeader:function(obj){
		return this.addHeader(obj);
	},
	
	addHeader:function(obj){
		this.config = 	{};
		var sender = 	this;
		this.arraySort = [];
		
		for(var key in obj){
			this.addCol(key, obj[key]);
		}
		
		if(this.arraySort.length > 0){
			this.clauses.order = this.arraySort.join(', '); 
		}
				
		return this;
	},
/**
 * SimpleTable#addCol(obj) -> SimpleTable
 * - obj (Object): Objet de données.
 * 
 * Cette méthode ajoute une colonne au tableau.
 **/	
	addCol:function(key, obj, filter){
		
		this.length++;
		var sender = this;
		var options = {
			title: 		key,
			type: 		'',
			style:		'',
			sort:		true,
			name:		null,
			format:		null,
			type:		null,
			order:	false,
			attributes:	{}
		};
		
		Object.extend(options, obj || {});
		
		if(!Object.isUndefined(options.sortable)){
			options.sort = options.sortable;
		}
		
		if(!Object.isUndefined(obj.type)){//support du champ typé
			switch(options.type){
				case "radio":
				case "checkbox":
					options.name = obj.name || key;
					break;
				case "date":
					options.format = obj.format || '';
					break;
			}
		}
		
		Object.extend(options.attributes, options);
		
		this._cleanAttributs(options);
		//
		// Création de l'entete
		// 					
		var td = 	new Node('th', options.attributes);
		
		td.addClassName(options.sort ? 'sort' : '');
		var className = key.toLowerCase().sanitize('-');
		td.addClassName('cel-' + className + ' col-' + className);
		
		if(options.attributes.applyWidth){
			td.css('width', options.attributes.applyWidth);
		}
		//
		//
		//
		
		
		if(options.type != 'action' || (options.type == 'action' && options.title != '')){
			td.key = 		key;
			td.order =		'';
			td.cursor = 	new Node('div', {className:'wrap-cursor'});
			var title = 	new Node('div', {className:'wrap-title'});
			
			if(Object.isString(options.title) || Object.isNumber(options.title)){
				title.appendChild(document.createTextNode(options.title));
			}
			
			if(Object.isElement(options.title)){
				title.appendChild(options.title);
			}
			title.appendChild(td.cursor);
			
			td.appendChild(title);		
			if(options.sort) td.observe('click', function(evt){sender.onClickHeader(evt, this);});
			
			if(options.order){
				this.arraySort.push(key + ' ' + (Object.isString(options.order) ? options.order : ''));
				
				
					switch(options.order.toLowerCase()){
						default:
						
						case 'asc':
							if(td.cursor){
								td.cursor.addClassName('sort-desc');
							}
							td.order = 'desc';
							break;
						
						case 'desc':
							if(td.cursor){
								td.cursor.addClassName('sort-asc');
							}
							td.order = 'asc';
							break;
					}
			}
		
		}
		
		var td2 = td.cloneNode(true);
		//td2.appendChild(new Node('div', {className:'wrap-title', style:'padding-top:0px; padding-bottom:0'}));
		td2.parent = td;
						
		this.body.select('thead > tr')[0].appendChild(td2);
		
		this.TR_HEAD.appendChild(td);
		this.config[key] = options;
		
		if(Object.isFunction(filter)){
			this.addFilters(key, filter);
		}
		
		this.getRows().each(function(line){
			if(!Object.isFunction(line.data) && !Object.isUndefined(line.data)){
				this.addCel(line, key);
			}
		}.bind(this));
				
				//e.colSpan = this.length + (this.readOnly ? 0 : 1);
			
		//}.bind(this));
		
		return this;
	},
	
	_cleanAttributs: function(options){
		
		options.attributes.title = null;
		delete options.attributes.title;
		
		var style = options.attributes.style.replace(' ', '');
		var match = options.attributes.style.match(/width:([0-9].*)(px|%|em|pt)/);
		
		if(match){
			options.attributes.applyWidth = match[1] + match[2];	
			options.attributes.style = style.replace(match[0], '');
		}else{
			if(!options.attributes.width){
				options.attributes.applyWidth = false;
			}else{
				options.attributes.applyWidth = options.attributes.width;
			}
		}
		
		delete options.attributes.width;
	},
/**
 * SimpleTable#addRow(obj) -> SimpleTable
 * - obj (Object): Objet de données.
 * 
 * Cette méthode ajoute une ligne de données au tableau.
 **/
	addRow:function(obj, bool){
		if(Object.isUndefined(obj)) obj = {};
		
		var tr = 		new Node('tr', {className:'row-data'});
		var checkbox = 	new Checkbox({type:'checkbox'});
		var sender = 	this;
				
		if(bool && this.selectable){
			tr.addClassName('selected');
		}
		
		this.lastrow = tr;
		
		var td = new Node('td',{className:"col-checkbox"}, checkbox);
		tr.appendChild(td);
		
		Object.extend(tr, {data:obj, checkbox:checkbox});
		
		//recherche de regroupement
		
		var keyGroup = this.groupBy ? obj[this.groupBy] : 'default';
		
		if(!this.getGroup(keyGroup)){
			this.addGroup(keyGroup);
		}
		
		this.appendChildGroup(keyGroup, tr);
		
		tr.addClassName('line-altern-' + ((this.getGroupRows(keyGroup).length-1) % 2));
		
		tr.Checked =  function(bool){
			if(!Object.isUndefined(bool)){
				this.CheckBox().Checked(bool);	
			}
			return this.CheckBox().Checked();
		};
		
		tr.CheckBox =  function(){
			return this.checkbox;
		};
		
		tr.Selected = function(bool){
			if(bool){
				sender.selectRow(this);
			}
			return this.className.match(/selected/);
		};
		
		if(!Object.isUndefined(this.filters_['checkbox'])) {
			this.filters_['checkbox'].call(this, tr.CheckBox(), td, tr.data);
		}
				
		for(var key in this.config){
			this.addCel(tr, key);
		}
		
		return this;
	},
/**
 * SimpleTable#addCel(obj) -> Element
 * - obj (Object): Objet de données.
 * 
 * Cette méthode ajoute une cellule au tableau.
 **/	
	addCel:function(tr, key){
		var options = 	this.config[key];		
		var td = 		new Node('td', options.attributes);
		var current = 	tr.data[key];
		var sender =	this;
			
		tr.appendChild(td);
		td.addClassName('cel-' + key.sanitize().toLowerCase());
		td.observe('click', function (evt){sender.onClickLine(evt, this.parentNode);});
		
		td.Checked = function(bool){
			return this.Row().Checked(bool);
		};
		
		td.Row = function(){
			return this.parentNode;	
		};		
		
		//supplément 2.2 ajout des types
		switch(this.config[key].type){
			case "checkbox":
				current = tr.data[key] = new Checkbox({type:'checkbox', name:options.name, checked:tr.data[key] * 1}); //new Node('input', {type: 'checkbox', name:options.name, checked:obj[key]});
				break;
			case "radio":
				current = tr.data[key] = new Checkbox({type:'radio', name:options.name, checked:tr.data[key] * 1});//new Node('input', {type: 'radio', name:options.name, checked:obj[key]});
				break;
			case "color":
				current = new ColoredBox();
				current.setColor(tr.data[key]);
				break;
			case "date":
				if(options.format != ''){
					if(options.format == 'date'){
						current = tr.data[key].toDate().toString_('date', MUI.lang);
						break;	
					}
					if(options.format == 'datetime'){
						current = tr.data[key].toDate().toString_('datetime', MUI.lang);
						break;	
					}
					
					current = tr.data[key].toDate().format(options.format);
					
				}else{
					current = tr.data[key].toDate().toString_('date', MUI.lang);
				}
				break;
			case "action":
				var current = 		new Node('p', {style:'line-height:0px'});
				var open =			function (evt){sender.Observer.fire('open', evt, tr.data, tr)};
				var remove =		function (evt){sender.Observer.fire('remove', evt, tr.data, tr)};
				
				current.open = 		new SimpleButton({icon:'search-14', type:'mini'});
				current.open.setStyle('margin:1px;');
				
				current.remove = 	new SimpleButton({icon:'cancel-14', type:'mini'});
				current.remove.setStyle('margin:1px');
				
				current.appendChilds([current.open, current.remove]);
				
				current.open.observe('click', open);
				current.remove.observe('click', remove);
				
				current.data = tr.data;
				td.setStyle('padding:0px');
				
				break;
		}
		
		
		if(Object.isUndefined(current)) current = '';
		if(Object.isElement(current)) 	td.appendChild(current);
		else td.appendChild(document.createTextNode(current));
		
		
		if(!Object.isUndefined(this.filters_[key])) {
			current = this.filters_[key].call(this, current, td, tr.data);
			
			if(key != 'Action'){
				
				if(Object.isUndefined(current)) current = '';
				if(Object.isElement(current)) {
					td.innerHTML = '';
					td.appendChild(current);
				}
				else td.innerHTML = current;
			}
		}
		
		return td;
	},
/**
 * SimpleTable#selectRow(it) -> SimpleTable
 **/	
	selectRow: function(o) {
				
		var i = 0;
		
		if(Object.isNumber(o)){
			var tbodys = this.childElements();
			
			this.getRows().each(function(e){
				
				if(!Object.isFunction(e.data) && !Object.isUndefined(e.data)){
					if(i == o){
						e.addClassName('selected');	
					}else{
						e.removeClassName('selected');	
					}
					i++;
				}
				
			});
			
		}else{
			
			if(Object.isElement(o)){
				
				this.getRows().each(function(e){
					if(!Object.isFunction(e.data) && !Object.isUndefined(e.data)){
						e.removeClassName('selected');	
					}
				});
				
				o.addClassName('selected');
			}
		}
		
		return this;
	},
/**
 * SimpleTable#addEmptyRow() -> SimpleTable
 *
 * Cette méthode ajoute une ligne de données vide au tableau.
 **/
	addEmptyRow: function(){
		return this.addRow({});
	},
/**
 * SimpleTable#addRows(array) -> SimpleTable
 * - array (array): tableau de données.
 *
 * Cette méthode vous permet de convertir un tableau de données en objet `SimpleTable` et donc d'afficher ces données dans un tableau HTML
 * pour l'utilisateur.
 *
 * #### Exemple d'utilisation
 * 
 *      var st = new SimpleTable();
 *      st.addHeader({
 *           'Name': {title:'Nom', width:300},
 *           'Date': {title:'Date naissance', width:90, style:'text-align:center'}
 *      });
 *      
 *      st.addRows([{Name:'Rom', Date:'1987'}, {Name:'Rom2', Date:'1982'}]);
 *      document.body.appendChild(st);
 *
 **/
	addRows:function(array){

		if(!Object.isUndefined(array.length)){
			for(var i = 0; i < array.length; i += 1){
				this.addRow(array[i], i == 0);
			}
			
			this.isEmpty = array.length=== 0;
			
		}else if(typeof array == 'object'){
			var i = 0;
			for(var key in array){
				this.addRow(array[key]);
				i++;
			}
			
			this.isEmpty = i == 0;
		}
		
		if(Object.isElement(this.empty)){
			this.body.appendChild(this.empty);
			
			if(this.getRows().length > 0){
				this.empty.hide();
			}else{
				this.empty.show();
			}
		}
				
		this.refresh();
		
		return this;
	},	
/**
 * SimpleTable#addGroup(key) -> SimpleTable
 * - key (key): tableau de données.
 *
 * Cette méthode permet de créer un nouveau groupe de données dans le tableau.
 *
 **/	
 	addGroup: function(key){
								
		var group = 	new SimpleTable.Group({
			groupName:	key, 
			groupBy:	this.groupBy,
			countField:	this.sum,
			groupText:	this.text
		});
		
		group.setColSpan(this.length + (this.readOnly ? 0 : 1));
		
		if(this.TABLE_BODY.select(' > .wrap-group').length == 0){
			group.addClassName('first');
		}
		
		this.TABLE_BODY.appendChild(group);	
		
		return group;
	},
/**
 * SimpleTable#appendChildGroup(key) -> SimpleTable
 * - key (key): tableau de données.
 *
 * Cette méthode permet de créer un nouveau groupe de données dans le tableau.
 *
 **/
 	appendChildGroup: function(key, row){		
		var group = this.getGroup(key);
		group.addRow(row);
		
		if(this.groupBy && !group.textDefined){
			var text = key;
			
			if(Object.isFunction(this.onWriteName)){
				text = this.onWriteName.call(this, key, group.Header());	
			}
			
			this.Observer.fire('group.draw', key, group.Header()); 
			
			group.setText(text);
		}
		
		return this;
	},
/**
 * SimpleTable#addFilters(key, filter) -> SimpleTable
 * - key (String | Array): Clef de la colonne ou regroupement de clef.
 * - filter (Function): Fonction de filtrage.
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
 * #### Exemple d'utilisation
 * 
 *      var st = new SimpleTable();
 *      st.addHeader({
 *           'Name': {title:'Nom', width:300},
 *           'Date': {title:'Date naissance', width:90, style:'text-align:center'},
 *           'Save': {title:'Enregistré', width:40, style:'text-align:center'}
 *      });
 *      
 *      st.addFilter('Save', function(e, cel, data){
 *           var node = new Node('input', {type:'checkbox', checked: e});
 *           return node;
 *      });
 *      
 *      st.addFilter('Name', function(e, cel, data){
 *           cel.setStyle('font-weight:bold');
 *           return e;
 *      });
 *
 *      st.addRows([{Name:'Rom', Date:'1987', Save:true}, {Name:'Rom2', Date:'1982', Save:false}]);
 *      document.body.appendChild(st);
 *
 **/
	addFilters: function(key, filter){
		if(Object.isUndefined(key)) 	throw('Erreur SimpleTable::addFilters() : args[0] est attendu. "undefined"');
		if(!Object.isFunction(filter))	throw('Erreur SimpleTable::addFilters() : args[1] doit être de type "Function"');
				
		if(Object.isString(key)){
			this.filters_[key] = filter;
			return this;
		}
		if(Object.isArray(key)){
			for(var i = 0; i < key.length; i+=1){
				this.filters_[key[i]] = filter;	
			}
		}
		return this;
	},
/**
 * SimpleTable#clear() -> SimpleTable
 *
 * Cette méthode vide le tableau de données.
 **/
	clear: function(){
		this.keyList = {};
		
		this.TABLE_BODY.select(' > tbody > tr').each(function(e){
			e.data = null;
			e.parentNode.removeChild(e);
		});
		
		this.TABLE_BODY.select(' > tbody').each(function(e){
			e.parentNode.removeChild(e);
		});
				
		return this;
	},
/**
 * SimpleTable#Chrome(bool) -> SimpleTable
 *
 * Cette méthode applique le style Chrome à l'instance.
 **/	
	Chrome:function(bool){
		this.removeClassName('chrome');
		this.TABLE_HEAD.removeClassName('chrome');
		this.TABLE_BODY.removeClassName('chrome');
		if(bool){
			this.addClassName('chrome');
			this.TABLE_HEAD.addClassName('chrome');
			this.TABLE_BODY.addClassName('chrome');	
		}
		return this;
	},
/**
 * SimpleTable#observe(eventName, callback) -> SimpleTable
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `complete` : Intervient lorsque le chargement de la liste via PHP est terminé.
 * * `clickheader` : Intervient lorsque l'une des cellules de l'entête est cliqué.
 * * `click` : Intervient lorsque l'une des lignes du tableau est cliqué.
 * * `check` : Intervient lorsque l'un des contrôles est coché.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	observe: function(eventName, handler){
		switch(eventName){
			case 'click.header':
			case 'clickheader':
				this.Observer.observe('click.header', handler);
				break;
			case 'load':
			case 'open':
			case 'remove':
			case "complete":						
			case 'click': 	
			case 'check':
			case 'group.draw':
				this.Observer.observe(eventName, handler);
				break;
			default:
						Event.observe(this, eventName, handler);
		}
		return this;
	},
/**
 * SimpleTable#ReadOnly(bool) -> Boolean
 * - bool (Boolean): Valeur permettant de changer le comportement du tableau.
 *
 * Cette méthode change le comportement du tableau. Si la valeur `bool` est vrai
 * les case à cocher seront supprimer de l'affichage.
 **/
	ReadOnly: function(bool){
		this.removeClassName('readonly');
		this.TABLE_HEAD.removeClassName('readonly');
		this.TABLE_BODY.removeClassName('readonly');	
			
		if(bool){
			this.addClassName('readonly');
			this.TABLE_HEAD.addClassName('readonly');
			this.TABLE_BODY.addClassName('readonly');
			this.readOnly = true;
		}else this.readOnly = false;
		
		return this.hasClassName('readOnly');
	},
/**
 * SimpleTable#Overable(bool) -> Boolean
 * - bool (Boolean): Valeur permettant de changer le comportement du tableau.
 *
 * Cette méthode indique si la ligne doit changer d'état au survol de la souris.
 **/
	Overable: function(bool){
		this.removeClassName('overable');
		this.TABLE_HEAD.removeClassName('overable');
		this.TABLE_BODY.removeClassName('overable');
		if(bool){
			this.addClassName('overable');
			this.TABLE_HEAD.addClassName('overable');
			this.TABLE_BODY.addClassName('overable');
			this.overable = true;
		}else this.overable = false;
		
		return this.hasClassName('overable');
	},
/**
 * SimpleTable#Selectable(bool) -> Boolean
 * - bool (Boolean): Valeur permettant de changer le comportement du tableau.
 *
 * Cette méthode indique si la ligne doit changer d'état au clique de la souris.
 **/
	Selectable: function(bool){
		return this.Selectable = bool;
	},
/**
 * SimpleTable#Sortable(bool) -> Boolean
 * - bool (Boolean): Valeur permettant de changer le comportement du tableau.
 *
 * Cette méthode indique si le tableau peut être trié.
 **/
	Sortable: function(bool){
		this.removeClassName('sortable');
		this.TABLE_HEAD.removeClassName('sortable');
		this.TABLE_BODY.removeClassName('sortable');
		if(bool){
			this.addClassName('sortable');
			this.TABLE_HEAD.addClassName('sortable');
			this.TABLE_BODY.addClassName('sortable');
			this.sort = true;
		}else this.sort = false;
		
		return this.hasClassName('sortable');
	}, 
/**
 * SimpleTable#Order(str) -> String
 * - str (String): Valeur permettant de changer l'ordre de tri.
 *
 * Cette méthode permet de changer l'ordre de tri de la table.
 **/
	Order: function(query){
		
		//réinitialisation des champs
		this.header.select('.sort').each(function(e){
			if(e.cursor){
				e.cursor.removeClassName('sort-desc');
				e.cursor.removeClassName('sort-asc');
			}
			e.order = '';
		});
		
		if(query){
			this.clauses.order = 	'';
			var array = 			[];
			
			query.split(',').each(function(field){
				
				field = 	field.trim().split(' ').without('');	
				
				if(Object.isUndefined(field[1])){
					field[1] = 'asc';
				}
				
				this.header.select('.col-' + field[0].toLowerCase().sanitize('-')).each(function(td){
										
					switch((field[1] || '').toLowerCase()){
						default:
						case 'asc':
							td.cursor.addClassName('sort-asc');
							td.order = 'asc';
							
							
							break;
						case 'desc':
							td.cursor.addClassName('sort-desc');
							td.order = 'desc';
							break;
					}
				});
				
				array.push(field[0] + ' ' + field[1]);
				
			}.bind(this));
			
			this.clauses.order = array.join(', ');
			
			this.load();
		}
		
		return this.clauses.order;
	}, 
/**
 * SimpleTable#removeRows(array [, callback]) -> SimpleTable
 * SimpleTable#removeRows(obj [, callback]) -> SimpleTable
 * - array (Array): Tableau d'objet à supprimer de l'instance.
 * - obj (Object): Objet à supprimer du tableau.
 * - callback (Function): Fonction appelée lors de la comparaison entre deux données.
 *
 * Cette méthode supprime une ou plusieurs données affichées dans l'instance [[SimpleTable]].
 **/
	removeRows: function(obj, callback){
		
		if(!Object.isArray(obj)) obj = [obj];
		
		var options = this.getData();
		
		obj.each(function(data){
			var array = [];
			
			options.each(function(data2){
				
				if(Object.isFunction(callback)){
					if(callback.call(this, data, data2)) return;
				}else{
					if(data === data2) return;
				}
				
				array.push(data2);
			});
			
			options = array;
		});
		
		this.clear();
		this.addRows(options);
		
		return this;
	},
/**
 * SimpleTable#removeRowsChecked() -> SimpleTable
 *
 * Cette méthode supprime les lignes cochés du tableau.
 **/
	removeRowsChecked: function(){
		return this.removeRows(this.getDataChecked());
	},
/**
 * SimpleTable#stopObserving(eventName, callback) -> SimpleTable
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode supprime un écouteur `callback` associer à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `complete` : Intervient lorsque le chargement de la liste via PHP est terminé.
 * * `clickheader` : Intervient lorsque l'une des cellules de l'entête est cliqué.
 * * `click` : Intervient lorsque l'une des lignes du tableau est cliqué.
 * * `check` : Intervient lorsque l'un des contrôles est coché.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	stopObserving: function(eventName, handler){
		switch(eventName){
			case 'click.header':
			case 'clickheader':
				this.Observer.stopObserving('click.header', handler);
				break;
			case 'open':
			case 'remove':
			case "complete":						
			case 'click': 	
			case 'check':
			case 'group.draw':
					this.Observer.stopObserving(eventName, handler);
					break;
			default:
						Event.stopObserving(this, eventName, handler);
		}
		return this;
	},
/**
 *
 **/	
	refresh:function(){
		
		if(this.header.getHeight() == 0 && this.getHeight() == 0){//tracé non possible
			new fThread(function(){
				this.refresh();
			}.bind(this), 0.1);
			return this;
		}
		
		var allready = false;//permet d'appliquer une largeur à la seconde colonne n'ayant de largeur prédéfini par le développeur.
		
		//gestion des colonnes
		if(!this.isEmpty){
			this.body.select('thead > tr > th').each(function(node){
				var head = node.parent;
				
				if(!this.overflow){
					
					if(head.applyWidth || allready){
						
						if(!isNaN(1 * head.colSpan) && head.colSpan > 1){
							var length = 	head.colSpan;
							head.colSpan = 	1;
							node.colSpan = 	1;
							
							var current = 	node;
							var w =			0;
							
							for(var i = 0; i < length; i++){
								current.show();
								w += current.getWidth() + current.css('border-spacing');
								
								current = current.next();
								
								if(!Object.isElement(node)){
									break;
								}
							}
							
							head.css('width', w  - current.css('border-spacing'));
							
						}else{
							
							var width = Math.max(head.getWidth(), node.getWidth());
							
							if(head.getWidth() < node.getWidth()){
								head.css('width', width);
							}
							
							if(!head.applyWidth && allready){
								head.css('width', width);
								node.css('width', width);
							}
							//head.css('width', width);
							//node.css('width', width);
						}
					}else{
						allready = true;	
					}
				}
			}.bind(this));
		}
		
		if(this.body.css('position') == 'absolute'){
			this.body.css('top', this.header.getHeight());
		}
		
		if(this.scrollbar){
			
			var w = this.ScrollBar.Vertical.body.getWidth();
			
			this.header.css('margin-rigth', 0);
			
			if(this.overflow){
				this.TABLE_HEAD.css('width', 'auto');
				this.wrapper.css('width', this.TABLE_HEAD.getWidth());
				this.TABLE_BODY.css('width', this.TABLE_HEAD.getWidth()-w);
				this.header.css('margin-right', w);				
			}else{
				this.TABLE_HEAD.css('width', '100%');	
			}
			
			this.ScrollBar.refresh();
			this.ScrollBar.scrollToStart();
			
			if(this.body.hasClassName('vertical') || this.body.hasClassName('all')){
				if(w){
										
					if(this.overflow){
						this.header.css('margin-right', w);
						this.TABLE_HEAD.css('width', this.TABLE_HEAD.getWidth()-(w+1));
					}else{
						this.TABLE_HEAD.css('width', 'calc(100% - '+(w+1)+'px)');
					}				
					
				}else{
					new fThread(function(){
						this.refresh();
					}.bind(this), 0.1);
							
				}
			}
			
		}else{
			
			if(this.overflow && !this.fixedOverflow){
				this.fixedOverflow = true;
				
				//this.body.css('width', this.TABLE_HEAD.getWidth());
				
				this.TABLE_BODY.css('width', this.TABLE_HEAD.getWidth());
			}
			
		}
		
		//if(this.parentNode))
		
	},
/**
 * SimpleTable#load() -> SimpleTable
 *
 * Charge les données du tableau.
 **/
 	load: function(){return this.loadData()},
	loadData: function(){

		if(this.link != ''){
			
			var globals = 		$WR().getGlobals('parameters');
			var parameters = 	this.parameters
								+ '&clauses=' + this.clauses.toJSON()  
								+ (globals == '' ? '' : '&' + globals);
			
						
			this.ProgressBar.setProgress(0, 4, '');
			
			if(this.progress){
				this.ProgressBar.show();
			}
			
			this.Observer.fire('load');
			
			
			new Ajax.Request(this.link, {
				parameters: parameters,
				method:		'post',
				
				onCreate:function(result){
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
						this.ProgressBar.hide();
					}
					
					var obj = result.responseText.evalJSON();
															
					this.clear();
										
					this.addRows($A(obj));
					
					this.Observer.fire('complete', obj);
										
				}.bind(this)
			});
		}

		return this;
	},
/*
 * SimpleTable#onClickHeader(evt, td) -> void
 **/
	onClickHeader: function(evt, td){
		if(!this.sort) return;
			
		switch(td.order){
			default:
			case 'asc': 
				this.Order(td.key + ' ' + 'desc');
				break;
			
			case 'desc': 
				this.Order(td.key + ' ' + 'asc');
				break;
		}
						
	},
/*
 * SimpleTable#onClickLine(evt, line) -> void
 *
 * Evènement lié au clique d'une ligne.
 **/
	onClickLine: function(evt, line){
		
		if(!Object.isUndefined(this.lastrow)) this.lastrow.removeClassName('selected');
		if(this.selectable){
			this.selectRow(line);
		}
				
		this.Observer.fire('click', evt, line.data);
	},
	/**
	 * Gestion de l'événement check. Il intervient lors de la séléction du checkbox d'une ligne du tableau.
	 * @event
	 * @param {Event} evt
	 * @param {Node} line Ligne séléctionné.
	 */
	onClickCheck: function(evt, line){
		this.Observer.fire('check', evt, line.data, line.checkbox);
	},
/**
 * SimpleTable#getChecked() -> Array
 *
 * Cette méthode retourne la liste des données cochées par l'utilisateur.
 **/
	getChecked: function(){
		var array = [];
		
		this.getRows().each(function(e){
					
			if(!Object.isFunction(e.data) && !Object.isUndefined(e.data)){
				if(e.checkbox.Checked()) array.push(e.data);
			}
			
		});
		
		return array;
	},
/*
 * SimpleTable#setChecked(bool) -> Array
 *
 * Cette méthode coche ou décoche les cases à cocher en fonction de la valeur `bool`.
 **/	
	setChecked: function(bool){
		
		this.checkbox.Checked(bool);
			
		this.getRows().each(function(e){
			if(!Object.isFunction(e.data) && !Object.isUndefined(e.data)){
				if(!e.checkbox.disabled){
					e.checkbox.Checked(bool);
				}
			}
		});
				
		
		return this;
	},
/**
 * SimpleTable#setData(array) -> SimpleTable
 * - array (Array): Tableau de données.
 * 
 * Cette méthode remplace les données par celles du tableau de données passé en paramètre.
 **/
 	setData:function(array){
		this.clear();
		this.addRows(array);
		return this;
	},
/**
 * SimpleTable#Data(array) -> Array
 *
 * Cette méthode assigne et retourne la liste des données contenu dans la tableau.
 **/
 	Data:function(array){
		if(!Object.isUndefined(array)){
			this.setData(array);	
			return array;
		}else{
			return this.getData();
		}
	},
	
	
	getOptions: function(){
		return this.getData();
	},
/**
 * SimpleTable#getData(array) -> Array
 *
 * Cette méthode retourne la liste des données contenu dans la tableau.
 **/
	getData: function(){
		var array = [];
		
		this.getRows().each(function(line){
			
			if(!Object.isFunction(line.data) && !Object.isUndefined(line.data)){
				var row = 	{};
				var data = 	line.data;
				
				for(var key in data){
					
					if(Object.isUndefined(this.config[key])){
						row[key] = data[key];	
						continue;
					}
					
					switch(this.config[key].type){
						default: 		
							row[key] = data[key];
							break;	
						case 'radio':		
						case 'checkbox': 	
							row[key] = data[key].Checked() ? true : false;
							break;	
					}
				}
				
				array.push(row);
			}
		}.bind(this));
				
		return array;
	},
/**
 * SimpleTable#getDataChecked() -> Array
 *
 * Cette méthode retourne la liste des données cochées par l'utilisateur.
 **/
	getDataChecked: function(){return this.getChecked();},
/**
 * SimpleTable#Value() -> Array
 * SimpleTable#Value(array) -> Array
 *
 * Cette méthode permet de récupérer l'ensemble des données cochés si l'option `readOnly`  est à `false`. Dans le cas contraite se sont toutes les données stockées qui seront retournées.
 **/	
	Value:function(obj){
		if(Object.isUndefined(obj)){
			return this.readOnly ? this.getData() : this.getDataChecked();
		}
		
		this.setData(obj);
		
		return obj;
	},
/**
 * SimpleTable#getRow(it) -> Node | false
 * SimpleTable#getRow(fnCompare) -> Node | false
 * 
 * Cette méthode retourne une ligne `tr` du tableau.
 **/
 	getRow:function(it){
		
		var options = this.getRows();
		
		if(Object.isFunction(it)){
			for(var i = 0; i < options.length; i++){
				
				var row = options[i];
				
				if(!Object.isFunction(row.data) && !Object.isUndefined(row.data)){
					if(it.call(this, row.data)){
						return row;	
					}
				}
			}
			
		}else{
			if(it < options.length){
				return options[it];
			}
		}
		
		return false;
	},
/**
 * SimpleTable#getRows() -> HTMLRowElement
 * 
 * Cette méthode retourne la liste des elements TR ayant des données à afficher.
 **/	
	getRows: function(){
		return this.TABLE_BODY.select(' > tbody > tr.row-data');
	},
	
/**
 * SimpleTable#getGroup(key) -> SimpleTable.Group
 * 
 * Cette méthode l'élement principal du groupe.
 **/	
	getGroup:function(key){
		var o = this.TABLE_BODY.select(' > tbody.wrap-group.group-' + key.toLowerCase().sanitize('-'));
		return o.length ? o[0] : false;
	},
/**
 * SimpleTable#getGroupRows(groupName) -> HTMLRowElement
 * 
 * Cette méthode retourne la liste des elements TR d'un même groupe de données.
 **/	
	getGroupRows:function(key){
		return this.TABLE_BODY.select(' > tbody.group-' + key.toLowerCase().sanitize('-') + ' > tr.row-data');
	},
/**
 * SimpleTable#setParameters(parameters) -> SimpleTable
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
 * SimpleTable#setLink(link) -> SimpleTable
 * - link (String): Lien vers la passerelle PHP.
 *
 * Cette méthode assigne le lien de connexion au serveur d'application.
 **/
	setLink: function(link){
		this.link = link;
		return this;
	},
/**
 * SimpleTable#scrollToLastInsert() -> void
 *
 * Cette méthode permet de déplacer la barre de scroll au dernier élément inseré dans le tableau.
 **/
	scrollToLastInsert: function(){
		this.ScrollBar.scrollTo(this.Table.lastrow);
	},
/**
 *
 **/	
	setHeight:function(h){
		this.body.css('height',h);
		return this;
	}
};

SimpleTable.Group = Class.createSprite('tbody');
SimpleTable.Group.prototype = {
	groupName: 	'default',
	groupBy:	false,
	countField:	false,
	groupText:	'',
	textDefined: false,
	className: 	'wobject wrap-group',
/**
 *
 **/	
	initialize:function(obj){
		
		Object.extend(this, obj || {});
		
		this.addClassName('group-' + this.groupName.toLowerCase().sanitize('-'));
		
		if(this.groupBy){
			this.rowHeader = 	new Node('tr', {className:'row-group-header wrap-header line-tr-head'});
			
			this.header = 		new Node('th', {className:'wrap-title wrap-group-title line-th-head'});
			this.header.text = 	new Node('span', {className:'wrap-group-text'});
				
			this.header.btn =			new SimpleButton({icon:'1down-mini', type:'mini'});
			this.header.btn.hidden  = 	false;
				
			this.header.appendChild(this.header.btn);
			this.header.appendChild(this.header.text);
			this.rowHeader.appendChild(this.header);
			this.appendChild(this.rowHeader);
			this.header.btn.on('click', this.onClickBtn.bind(this));			
		}
		
	},
/*
 *
 **/	
	Header:function(){
		return this.header;
	},
/*
 *
 **/	
	addRow:function(row){
		var r = this.appendChild(row);
		
		if(this.textDefined){
			this.setText(this.textDefined);
		}
		
		return r;
	},
/*
 *
 **/	
	setColSpan:function(col){
		if(this.groupBy){
			this.header.colSpan = col;
		}
	},
/*
 *
 **/	
	getRows: function(){
		return this.select(' > tr.row-data');
	},
/*
 *
 **/	
	setText:function(text){
		
		var sum = 0;
		
		if(this.countField){
			
			this.getRows().each(function(row){
				
				if(!Object.isFunction(row.data) && !Object.isUndefined(row.data)){
					var num = parseInt(Object.isElement(row.data[this.countField]) ? row.data[this.countField].value : row.data[this.countField]);
					sum += isNaN(num) ? 0 : num;
				}
			}.bind(this));
				
		}else{
			sum = this.getRows().length-1;
		}
		
		this.textDefined = text;
			
		this.header.text.innerHTML = text + (this.groupText == '' ? '' : (' (' + this.groupText + ' : ' + (sum) + ')'));
	},
/*
 *
 **/	
	onClickBtn:function(evt){
		var childs = this.getRows();
		
		if(this.hidden){
			childs.invoke('show');
			this.setIcon('1down-mini');	
		}else{
			childs.invoke('hide');
			this.setIcon('1right-mini');
		}
		
		this.hidden = !this.hidden;
	}
	
};

/** section: Table, deprecated
 * class ScrollTable
 * Cette classe est un conteneur pour l'élément [[SimpleTable]] ou tous autres éléments ayant besoins
 * d'une zone avec scrollbar.
 *
 * <p class="note">version 0.1 - Window 2.1RTM</p>
 * <p class="note">Cette classe est définie dans le fichier window.simpletable.js</p>
 **/
var ScrollTable = Class.createSprite('div');
ScrollTable.prototype = {
	__class__:'scrolltable',
	className:'wobject scrolltable',
	initialize:function(st, obj){
		if(!Object.isUndefined(st)) this.appendChild(st);
		if(!Object.isUndefined(obj)) this.writeAttribute(obj);
	}	
};
/** section: UI
 * class TableData
 * 
 * Cette classe permet de créer tableau HTML rapidement. Au sein de [[Window]], [[TableData]] permet de mettre en forme
 * des formulaires. 
 *
 * <p class="note">version 0.2 - Window 2.1RTM</p>
 * <p class="note">Cette classe est définie dans le fichier window.tabledata.js</p>
 **/

var TableData = Class.createSprite('table');

TableData.prototype = {
	__class__:'tabledata',
	className:'table-data',
	/** @ignore */
	length:0,
/**
 * new TableData()
 *
 * Cette méthode créée une nouvelle instance de [[TableData]].
 **/
	initialize:	function(){
		this.tbody = new Node('tbody');
		//this.options = [];
		this.appendChild(this.tbody);
		this.addRow();
	},
/**
 * TableData#addCel(node [, attributs]) -> TableData
 * - node (Element | String | Number): Element ou chaine de caractère à ajouter.
 * - attributs (Object): Attributs à assigner à la cellule.
 *
 * Cette méthode crée une cellule `TD` dans le tableau et ajoute le contenu de `node` à cette dernière.
 **/
	addCel: function(elem, options){
		
		if(!Object.isUndefined(options)) {
			
			if(!Object.isUndefined(options.isHead)) var td = new Node('th');
			else var td = new Node('td');
			
			if(!Object.isUndefined(options.style)){
				td.setStyle(options.style);
				options.style = null;
			}
			
			for(var key in options){
				if(key =="style") continue;
				try{td[key] = options[key];}catch(er){}
			}
			
			if(!Object.isUndefined(options.isField)) td.className += " champ ";
			
			
		}else{
			var td = 	new Node('td');
			options = 	{};
		}
		
		if(Object.isElement(elem)) {
			td.appendChild(elem);
		} else {
			if(Object.isArray(elem)){
				td.appendChilds(elem);
			} else {
				td.innerHTML = elem;
			}
		}
		
		this.current.appendChild(td);
		//this.options[this.options.length -1].push(td);
		
		if(Object.isUndefined(options.returnElement)){
			return this;	
		}else{
			return td;
		}	
	},
/**
 * TableData#addCels(cels) -> TableData
 * - cels (Array): Liste des contenues à ajouter.
 *  
 * Cette méthode convertit une collection de données `cels` en ligne du tableau [[TableData]].
 **/
	addCels:function(array){
		$A(array).each(function(e){
			if(Object.isUndefined(e.type)) this.addCel(e.element, e.attributes);
			else{
				if(e.type == "head") this.addHead(e.element, e.attributes);
				else if(array[i].type == "field"){
					this.addField(e.element, e.attributes);
				}else this.addCel(e.element, e.attributes);
			}
		}, this);
		
		return this.addRow();
	},
/** related to: TableData#addCel
 * TableData#addField(node [, attributs]) -> TableData
 * - node (Element | String | Number): Element ou chaine de caractère à ajouter.
 * - attributs (Object): Attributs à assigner à la cellule.
 *
 * Cette méthode crée une cellule `TD` formaté dans le tableau et ajoute le contenu de `node` à cette dernière.
 * 
 * <p class="note">La cellule créée est à utiliser de préférence lors de l'ajout de champs de saisie.</p>
 **/
	addField:function(elem, obj){
		if(Object.isUndefined(obj)) obj = {};
		obj.isField = true;
		
		if(!Object.isElement(elem)) elem = new Node('p',elem);
		
		return this.addCel(elem, obj);
	},
/** related to: TableData#addCel
 * TableData#addHead(node [, attributs]) -> TableData
 * - node (Element | String | Number): Element ou chaine de caractère à ajouter.
 * - attributs (Object): Attributs à assigner à la cellule.
 *
 * Cette méthode crée une cellule `TH` dans le tableau et ajoute le contenu de `node` à cette dernière.
 **/
	addHead:function(elem, obj){

		if(Object.isUndefined(obj)) obj = {};
		obj.isHead = true;
		return this.addCel(elem, obj);
	},
/**
 * TableData#addRow() -> TableData
 *
 * Cette méthode créée une nouvelle ligne dans le tableau. Les méthodes [[TableData#addCel]], [[TableData#addHead]] et [[TableData#addField]] 
 * ajouterons leurs contenu dans la nouvelle ligne.
 **/
	addRow: function(){
		this.current = new Node('tr');
		this.tbody.appendChild(this.current);
		
		return this;
	},
/**
 * TableData#addRowBefore(row) -> TableData
 * TableData#addRowBefore(it) -> TableData
 * - row (Node): Ligne tr du tableau.
 * - it (Number): Numéro de ligne.
 *
 * Cette méthode créée une nouvelle ligne dans le tableau et l'insert avant une ligne existante.
 **/
	addRowBefore: function(o){
		
		if(Object.isNumber(o)){
			var row = this.getRow(o);	
		}else{
			var row = o;	
		}
		
		if(!row){
			this.addRow();		
		}else{
			this.current = new Node('tr');
			this.tbody.insertBefore(this.current, row);
		}
		
		return this;
	},
/**
 * TableData#addRows(array) -> TableData
 * - array (Array): Tableau de données à 2 dimensions.
 *
 * Cette méthode méthode convertie un tableau à 2 dimensions 
 **/
	addRows: function(array){
		$A(array).each(function(e){
			this.addCels(e);
		}, this);
		return this;
	},
/**
 * TableData#clear() -> TableData
 *
 * Cette méthode réinitialise l'instance. Toutes les données seront effacés du tableau.
 **/
	clear: function(){
		this.removeChilds();
		this.tbody = new Node('tbody');
		this.appendChild(this.tbody);
		this.addRow();
		
		this.length = 0;
		return this;
	},
/**
 * TableData#getCel(row, col) -> Element
 * - row (Number): Numéro de la ligne.
 * - col (Number): Numéro de la colonne.
 *
 * Cette méthode récupère une cellule du tableau en fonction des coordonnées `row` et `col`.
 **/
	getCel:function (row, col){
		
		var tr = this.tbody.childElements();
		
		if(row >= tr.length) return false;
		
		var td = tr[row].childElements();
		
		if(col < td.length){
			return td[col];
		}
		
		return false;
	},
/**
 * TableData#getRow(row) -> Element
 * TableData#getRow(row, bool) -> Element | Array
 * - row (Number): Numéro de la ligne.
 * - bool (Boolean): Si ce paramètre est vrai la méthode retournera un tableau d'[[Element]] contenant les cellules.
 * 
 * Cette méthode retourne l'élément `TR` du tableau en fonction du numéro `row` passé en paramètre.
 **/
	getRow: function(row, bool){
		var tr = this.tbody.childElements();
		
		if(row >= tr.length) return false;
		return (Object.isUndefined(bool) || !bool) ? tr[row] : tr[row].childElements();
	},
/**
 * TableData#removeCel(row, col) -> TableData
 * - row (Number): Numéro de la ligne.
 * - col (Number): Numéro de la colonne.
 *
 * Cette méthode supprime une cellule du tableau en fonction des coordonnées `row` et `col`.
 **/
	removeCel: function(row, col){
		
		var node = this.getCel(row, col);
		
		if(Object.isElement(node)){
			node.parentNode.removeChild(node);
		}
		
		return this;
	},
	/**
	 * @ignore
	 */
	removeEndCelAt: function(row){
		return this.removeCel(row, this.getRow(row).length - 1);		
	},
/**
 * TableData#removeRow(row) -> TableData
 * - row (Number): Numéro de la ligne.
 * 
 * Cette méthode supprime une ligne `TR` du tableau en fonction du numéro `row` passé en paramètre.
 **/
	removeRow: function(row){
		row = this.getRow(row);
		
		if(Object.isElement(row)){
			row.parentNode.removeChild(row);			
		}
		
		return this;
	},
/**
 * TableData#removeCol(col) -> TableData
 * - col (Number): Numéro de la colonne.
 * 
 * Cette méthode supprime une colonne du tableau en fonction du numéro `col` passé en paramètre.
 **/
	removeCol:function(col){
		this.tbody.childElements().each(function(tr){
			var td = tr.childElements();
			if(col < td.length){
				tr.removeChild(td[col]);
			}
		}, this);		
		return this;
	},
/**
 * TableData#size() -> Number
 *
 * Cette méthode retourne le nombre de ligne enregistré dans le tableau.
 **/
	size: function(){
		return this.tbody.childElements().length;
	}
};
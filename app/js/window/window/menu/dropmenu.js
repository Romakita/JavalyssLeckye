/** section: Menu
 * class DropMenu < Element
 * Cette classe permet de créer une collection de [[SimpleMenu]] afin de créer un menu complexe.
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 *
 * <p>Cette exemple montre comment créer une instance DropMenu :</p>
 * 
 *     var dropmenu = new DropMenu(DropMenu.TOP);
 *     dropmenu.addMenu('Menu 1',{icon:'date'});
 *     dropmenu.addLine('Menu 1', 'Ligne 1', {border:true, bold:true});
 *     dropmenu.addLine('Menu 1', 'Ligne 2', {icon:'date'});
 *     dropmenu.addLine('Menu 1', 'Ligne 3');
 *     dropmenu.addMenu('Menu 2');
 *     dropmenu.addLine('Menu 2', 'Ligne 1');
 *     dropmenu.addLine('Menu 2', 'Ligne 2');
 *     dropmenu.addLine('Menu 2', 'Ligne 3');
 *     document.body.appendChild(dropmenu);
 *
 * <p>Cette exemple montre comment créer une instance DropMenu multi-niveau :</p>
 *
 *     var dropmenu = new DropMenu(DropMenu.TOP);
 *     dropmenu.addMenu('Menu 1',{icon:'date'});
 *     dropmenu.addLine('Menu 1', 'Niveau 1.1', {border:true, bold:true});
 *     dropmenu.addLine('Menu 1', 'Niveau 1.2', {icon:'date'});
 *     var line = dropmenu.addLine('Menu 1', 'Niveau 1.3');
 *     line.appendChild(new LineElement({text:'Niveau 2.1'}));
 *     line.appendChild(new LineElement({text:'Niveau 2.2'}));
 *     line.appendChild(new LineElement({text:'Niveau 2.3'}));
 *     dropmenu.addMenu('Menu 2');
 *     dropmenu.addLine('Menu 2', 'Niveau 1.1');
 *     dropmenu.addLine('Menu 2', 'Niveau 1.2');
 *     dropmenu.addLine('Menu 2', 'Niveau 1.3');
 *     document.body.appendChild(dropmenu);
 *
 * </div>
 *
 * <div>
 * 
 * <p>Cette exemple montre comment créer une instance DropMenu :</p>
 * 
 *     <ul class="box-drop-menu type-top">
 *          <li><a href="" class="date">Menu 1</a>
 *               <ul>
 *                    <li><a href="" class="border bold">Ligne 1</a></li>
 *                    <li><a href="" class="date">Ligne 2</a></li>
 *                    <li><a href="">Ligne 3</a></li>
 *               </ul>
 *          </li>
 *          <li><a href="">Menu 2</a>
 *               <ul>
 *                    <li><a href="">Ligne 1</a></li>
 *                    <li><a href="">Ligne 2</a></li>
 *                    <li><a href="">Ligne 3</a></li>
 *               </ul>
 *          </li>
 *     </ul>
 *     
 *     
 * <p>Cette exemple montre comment créer une instance multi-niveau :</p>
 * 
 *     <ul class="box-drop-menu type-top">
 *          <li><a href="" class="date">Menu 1</a>
 *               <ul>
 *                    <li><a href="" class="border bold">Niveau 1.1</a></li>
 *                    <li><a href="" class="date">Niveau 1.2</a></li>
 *                    <li><a href="">Niveau 1.3</a>
 *                        <ul>
 *                            <li><a href="" class="border bold">Niveau 2.1</a></li>
 *                            <li><a href="" class="date">Niveau 2.2</a></li>
 *                            <li><a href="">Niveau 2.3</a></li>
 *                        </ul>
 *                    </li>
 *               </ul>
 *          </li>
 *          <li><a href="">Menu 2</a>
 *               <ul>
 *                    <li><a href="">Ligne 1</a></li>
 *                    <li><a href="">Ligne 2</a></li>
 *                    <li><a href="">Ligne 3</a></li>
 *               </ul>
 *          </li>
 *     </ul>
 *
 * </div>
 * </div>
 *
 * <span class="box-simple-button exemple-dropmenu"><a href="">Cliquez moi</a></span>
 * 
 **/
var DropMenu = Class.createSprite('div');
/**
 * DropMenu.TOP -> String
 **/
DropMenu.TOP = 		'top';
/**
 * DropMenu.BOTTOM -> String
 **/
DropMenu.BOTTOM =	'bottom';
/**
 * DropMenu.LEFT -> String
 **/
DropMenu.LEFT =		'left';
/**
 * DropMenu.RIGHT -> String
 **/
DropMenu.RIGHT =	'right';
/**
 * DropMenu.ACCORDION -> String
 **/
DropMenu.ACCORDION = 'accordion';

var DROP = DropMenu;

DropMenu.prototype = {
	__class__:	'dropmenu',
	className:	'wobject drop-menu',
	overable:	true,
/**
 * new DropMenu()
 * 
 * Cette méthode créée une nouvelle instance du gestionnaire de menu.
 **/
	initialize:function(obj){
		var options = {
			overable:	true,
			type:		DropMenu.TOP
		};
		
		if(Object.isString(obj)){
			options.type = obj;
		}else{
			if(!Object.isUndefined(obj)){
				Object.extend(options, obj);
			}
		}		
		
		this.options = 			{};
		this.className_ = 		'';
		this.length = 0;
		
		this.hide();
		
		this.setType(options.type);	
		this.Overable(options.overable);
		
		this.appendChild_ = this.appendChild;
		
		this.appendChild = function(e){
			this.show();
			this.appendChild_(e);
			return this;
		}.bind(this);
		
		this.removeChild_ = this.removeChild;
		
		this.removeChild = function(e){
			this.removeChild_(e);
			
			if(this.childElements().length == 0){
				this.hide();
			}
			
			return this;
		}.bind(this);
	},
/**
 * DropMenu#Overable(bool) -> Boolean
 * - bool (Boolean): Valeur changeant le mode fonctionnement du menu.
 *
 * Si la valeur `bool` est vrai, le menu apparaitra au survol de la souris, dans le cas contraire il apparaitra au clique du bouton.
 **/	
	Overable: function(bool){
		
		if(Object.isUndefined(bool)) return this.overable;
		this.overable = bool;
		
		this.select('.overable').each(function(e){
			e.removeClassName('overable');
			if(bool){
				e.addClassName('overable');
			}
		});
		
		return bool;
	},
	
	destroy: function(){
		this.stopObserving();
		this.destroy = 		null;
		this.className = 	'';
	},
/**
 * DropMenu#Chrome(bool) -> DropMenu
 **/
	Chrome: function(bool){
		this.removeClassName('chrome');
		if(bool){
			this.addClassName('chrome');
		}
		return this;
	},
/**
 * DropMenu#addMenu(menu, options [, it ]) -> SimpleButton
 * - menu (String): Nom du nouveau menu.
 * - options (Object): Objet de configuration du menu.
 * - it (Number): Indice d'insertion  du menu.
 *
 * Cette méthode ajoute un menu `menu` au gestionnaire de menu.
 *
 * <img src="http://www.javalyss.fr/sources/window-drop-menu-add-menu.png" style="width:100%" />
 *
 * #### Attributs du paramètre options
 *
 * Le paramètre options permet de configurer l'instance. Il support les attributs suivants :
 *
 * * `icon` (`String`): Nom de l'icon à afficher.
 *
 * #### Exemple 1 : Création de menu.
 *
 *     var win = new Window();
 *     win.DropMenu.addMenu('Menu 1', {icon:'file-new'});
 *     win.DropMenu.addMenu('Menu 2', {icon:'file-new'});
 *     document.body.appendChild(win);
 * 
 * #### Exemple 2 : Création de ligne dans les menus.
 *
 *     var win = new Window();
 *     win.DropMenu.addMenu('Menu 1', {icon:'file-new'});
 *     win.DropMenu.addLine('Menu 1', 'Ligne 1', {icon:'add', bold:true, border:true}).on('click',function(){alert('Ligne1')});
 *     win.DropMenu.addLine('Menu 1', 'Ligne 2', {icon:'cancel'});
 *     win.DropMenu.addMenu('Menu 2', {icon:'file-new'});
 *     document.body.appendChild(win);
 *
 **/
	addMenu: function(menu, obj, i){
		
		if(Object.isUndefined(obj)){
			obj = {text:menu};
		}else{
			obj.text = menu;
		}
		
		if(Object.isUndefined(obj.overable)){
			obj.overable =	this.overable;
		}
		
		this.options[menu] = new SimpleMenu(obj);
			
		this.addChildAt(this.options[menu], i);
		this.options[menu].hide();
								
		return this.options[menu].SimpleButton;
	},
/**
 * DropMenu#getChild(key) -> SimpleMenu
 * - key (String): Nom du menu à récuperer
 * 
 * Cette méthode permet de récupérer un menu dans le gestionnaire des menus à partir de son nom.
 **/
	getChild: function(key){
		var childs = this.childElements();
	
		for(var i = 0; i < childs.length; i++){
			if(Object.isUndefined(childs[i].__class__)) continue;
			
			switch(childs[i].__class__){
				case 'simplemenu':
				
					if(childs[i].getText() == key){
						return childs[i];	
					}
					
					break;
				
				default:continue;
			}
		}
				
		return false;
	},
/**
 * DropMenu#addLine(menu, line [, options]) -> LineElement
 * - menu (String): Nom du menu où il faut ajouter la ligne.
 * - line (String): Nom de la nouvelle ligne.
 * - options (Object): Objet de configuration de la ligne.
 *
 * Cette méthode ajoute une ligne au menu `menu` avec le texte `line` dans le gestionnaire de menu.
 *
 * #### Attributs du paramètre options
 *
 * Le paramètre options permet de configurer l'instance. Il support les attributs suivants :
 *
 * * `icon` (`String`): Nom de l'icon à afficher.
 * * `border` (`Boolean`): Si la valeur est vrai, une bordure sera tracé en bas de la ligne.
 * * `bold` (`Boolean`): Si la valeur est vrai, le texte sera affiché en gras.
 *
 * <img src="http://www.javalyss.fr/sources/window-drop-menu-add-line.png" />
 *
 * #### Exemple 1 : Création de menu.
 *
 *     var win = new Window();
 *     win.DropMenu.addMenu('Menu 1', {icon:'file-new'});
 *     win.DropMenu.addMenu('Menu 2', {icon:'file-new'});
 *     document.body.appendChild(win);
 * 
 * #### Exemple 2 : Création de ligne dans les menus.
 *
 *     var win = new Window();
 *     win.DropMenu.addMenu('Menu 1', {icon:'file-new'});
 *     win.DropMenu.addLine('Menu 1', 'Ligne 1', {icon:'add', bold:true, border:true}).on('click',function(){alert('Ligne1')});
 *     win.DropMenu.addLine('Menu 1', 'Ligne 2', {icon:'cancel'});
 *     win.DropMenu.addMenu('Menu 2', {icon:'file-new'});
 *     document.body.appendChild(win);
 *
 **/
	addLine: function(menu, line, options){

		if(Object.isUndefined(this.options[menu])) this.addMenu(menu);
		if(Object.isUndefined(options)){
			options = {};	
		}
		//verification du type pour le paramètre line
		var le = new LineElement(options);	
		le.setText(line);
		
		if(Object.isUndefined(options.position)){
			this.options[menu].appendChild(le);
		}else{
			if(arg3.position == 0 || arg3.position == 'top') arg3.position =  0;
			this.options[menu].addChildAt(le, arg3.position);
		}
		
		return le;
	},
/**
 * DropMenu#addPaging() -> Paging
 *
 * Cette méthode ajoute l'élément de pagination [[Paging]] dans l'instance. 
 **/
	addPaging: function(){
		var page = new Paging();
		this.appendChild(page);
		page.setStyle('padding-right:5px');
		return page;
	},
/**
 * DropMenu#clear() -> void
 * 
 * Cette méthode vide le gestionnaire de ses menus.
 **/
	clear:function(){
		this.removeChilds();
		this.options = {}; 
		this.length = 0;
		this.style.display = 'none';
	},
/**
 * DropMenu#clearMenu(key) -> void
 * - key (String): Nom du menu à réinitialiser.
 *
 * Cette méthode vide l'un des menu du gestionnaire en fonction du paramètre `key`.
 **/
	clearMenu: function(menu){
		this.options[menu].clear();
		return this;
	},
/**
 * DropMenu#removeLine(keyMenu, keyLine) -> void
 * - keyMenu (String): Nom du menu contenant la ligne.
 * - keyLine (String): Nom de la ligne.
 *
 * Cette méthode supprime une ligne du menu.
 **/
	removeLine: function(menu, line){
		var le = this.options[menu].getChild(line);
		this.options[menu].removeChild(le);
		return le;
	},
/**
 * DropMenu#removeMenu(key) -> void
 * - key (String): Nom du menu.
 *
 * Cette méthode supprime un menu du gestionnaire.
 **/
	removeMenu: function(menu){
		this.removeChild(this.options[menu]);
		this.options[menu] = null;
		return this;
	},
/**
 * DropMenu#getKeys() -> Array
 *
 * Cette méthode retourne la liste des noms de menu enregistrés dans le gestionnaire.
 **/
	getKeys: function(){
		var array = [];
		for(var key in this.options) array.push(key);
		return array;
	},
/**
 * DropMenu#getMenu(key) -> SimpleMenu
 * - key (String): Nom du menu à rechercher.
 *
 * Cette méthode retourne un menu du gestionnaire. 
 * 
 * Cette méthode est efficace si le menu n'est pas dans une instance `BlockMenu`. Il est préférable d'utiliser
 * la méthode [[DropMenu#getChild]] si le menu recherché est enregistré dans une instance `BlockMenu`.
 *
 **/
	getMenu: function(menu){
		return this.options[menu];
	},
/**
 * DropMenu#getLine(keyMenu, keyLine) -> LineElement
 * - keyMenu (String): Nom du menu de ligne recherché.
 * - keyLine (String): Nom de ligne recherché.
 *
 * Cette méthode retourne une ligne d'un menu du gestionnaire.
 **/
	getLine: function(menu, line){
		return this.options[menu].getChild(line);
	},
/**
 * DropMenu#setType(type) -> DropMenu
 * - type (String): Nom du type de menu.
 *
 * Cette méthode change le type d'affichage du menu.
 *
 * Les types supportés sont les suivants :
 * 
 * * DROP.BOTTOM : Affiche le menu horizontallement (en bas de l'écran). Les lignes apparaitrons en haut du menu.
 * * DROP.LEFT : Affiche le menu verticalement (à gauche de l'écran). Les lignes apparaitrons à droite du menu.
 * * DROP.RIGHT : Affiche le menu verticalement (à droite de l'écran). Les lignes apparaitrons à gauche du menu.
 * * DROP.TOP :	Affiche le menu horizontallement (en haut de l'écran). Les lignes apparaitrons en bas du menu.
 *
 **/
	setType: function(type){

		switch(type){
			default:
				this.className = 'drop-menu';
				this.addClassName(DropMenu.TOP);
				this.addClassName(this.className_);
				break;
			
			case DropMenu.TOP:
			case DropMenu.BOTTOM:
			case DropMenu.RIGHT:
			case DropMenu.LEFT:
			case DropMenu.ACCORDION:
				this.className = 'drop-menu';
				this.addClassName(type);
				this.addClassName(this.className_);
				break;
		}
		return this;
	},
/**
 * DropMenu#size() -> Number
 * 
 * Cette méthode le nombre d'élément contenu dans l'instance.
 **/
	size: function(){
		return this.childElements().length;
	},
/*
 * DropMenu#getLength() -> Number
 * 
 * Retourne le nombre de menu enregistré.
 **/
	getLength: function(){
		return this.childElements().length;
	},
/*
 * DropMenu#__destruct() -> void
 * 
 * Destruction complète de l'instance.
 **/
	__destruct: function(){
		//$WR.destructObject(this);
	}
};
/**
 * DropMenu.Transform(node) -> DropMenu
 * DropMenu.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance DropMenu.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[DropMenu]].
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * <li><span>HTML 5</span></li>
 * </ul>
 * <div>
 *
 * <p>Cette exemple montre comment créer une instance DropMenu :</p>
 * 
 *     var dropmenu = new DropMenu(DropMenu.TOP);
 *     dropmenu.addMenu('Menu 1',{icon:'date'});
 *     dropmenu.addLine('Menu 1', 'Ligne 1', {border:true, bold:true});
 *     dropmenu.addLine('Menu 1', 'Ligne 2', {icon:'date'});
 *     dropmenu.addLine('Menu 1', 'Ligne 3');
 *     dropmenu.addMenu('Menu 2');
 *     dropmenu.addLine('Menu 2', 'Ligne 1');
 *     dropmenu.addLine('Menu 2', 'Ligne 2');
 *     dropmenu.addLine('Menu 2', 'Ligne 3');
 *     document.body.appendChild(dropmenu);
 *
 * <p>Cette exemple montre comment créer une instance DropMenu multi-niveau :</p>
 *
 *     var dropmenu = new DropMenu(DropMenu.TOP);
 *     dropmenu.addMenu('Menu 1',{icon:'date'});
 *     dropmenu.addLine('Menu 1', 'Niveau 1.1', {border:true, bold:true});
 *     dropmenu.addLine('Menu 1', 'Niveau 1.2', {icon:'date'});
 *     var line = dropmenu.addLine('Menu 1', 'Niveau 1.3');
 *     line.appendChild(new LineElement({text:'Niveau 2.1'}));
 *     line.appendChild(new LineElement({text:'Niveau 2.2'}));
 *     line.appendChild(new LineElement({text:'Niveau 2.3'}));
 *     dropmenu.addMenu('Menu 2');
 *     dropmenu.addLine('Menu 2', 'Niveau 1.1');
 *     dropmenu.addLine('Menu 2', 'Niveau 1.2');
 *     dropmenu.addLine('Menu 2', 'Niveau 1.3');
 *     document.body.appendChild(dropmenu);
 *
 * </div>
 *
 * <div>
 * 
 * <p>Cette exemple montre comment créer une instance DropMenu :</p>
 * 
 *     <ul class="box-drop-menu type-top">
 *          <li><a href="" class="date">Menu 1</a>
 *               <ul>
 *                    <li><a href="" class="border bold">Ligne 1</a></li>
 *                    <li><a href="" class="date">Ligne 2</a></li>
 *                    <li><a href="">Ligne 3</a></li>
 *               </ul>
 *          </li>
 *          <li><a href="">Menu 2</a>
 *               <ul>
 *                    <li><a href="">Ligne 1</a></li>
 *                    <li><a href="">Ligne 2</a></li>
 *                    <li><a href="">Ligne 3</a></li>
 *               </ul>
 *          </li>
 *     </ul>
 *          
 * <p>Cette exemple montre comment créer une instance multi-niveau :</p>
 * 
 *     <ul class="box-drop-menu type-top">
 *          <li><a href="" class="date">Menu 1</a>
 *               <ul>
 *                    <li><a href="" class="border bold">Niveau 1.1</a></li>
 *                    <li><a href="" class="date">Niveau 1.2</a></li>
 *                    <li><a href="">Niveau 1.3</a>
 *                        <ul>
 *                            <li><a href="" class="border bold">Niveau 2.1</a></li>
 *                            <li><a href="" class="date">Niveau 2.2</a></li>
 *                            <li><a href="">Niveau 2.3</a></li>
 *                        </ul>
 *                    </li>
 *               </ul>
 *          </li>
 *          <li><a href="">Menu 2</a>
 *               <ul>
 *                    <li><a href="">Ligne 1</a></li>
 *                    <li><a href="">Ligne 2</a></li>
 *                    <li><a href="">Ligne 3</a></li>
 *               </ul>
 *          </li>
 *     </ul>
 *
 * </div>
 * <div>
 * 
 * <p>Cette exemple montre comment créer une instance DropMenu en HTML 5 :</p>
 * 
 *     <ul class="box-drop-menu" data-type="top">
 *          <li><a href="" data-icon="date">Menu 1</a>
 *               <ul>
 *                    <li><a href="" data-border="true" data-bold="true">Ligne 1</a></li>
 *                    <li><a href="" data-icon="date">Ligne 2</a></li>
 *                    <li><a href="">Ligne 3</a></li>
 *               </ul>
 *          </li>
 *          <li><a href="">Menu 2</a>
 *               <ul>
 *                    <li><a href="">Ligne 1</a></li>
 *                    <li><a href="">Ligne 2</a></li>
 *                    <li><a href="">Ligne 3</a></li>
 *               </ul>
 *          </li>
 *     </ul>
 *     
 * <p>Cette exemple montre comment créer une instance multi-niveau en HTML 5:</p>
 * 
 *     <ul class="box-drop-menu" data-type="top">
 *          <li><a href="" class="date">Menu 1</a>
 *               <ul>
 *                    <li><a href="" data-border="true" data-bold="true">Niveau 1.1</a></li>
 *                    <li><a href="" class="date">Niveau 1.2</a></li>
 *                    <li><a href="">Niveau 1.3</a>
 *                        <ul>
 *                            <li><a href="" data-border="true" data-bold="true">Niveau 2.1</a></li>
 *                            <li><a href="" data-icon="date">Niveau 2.2</a></li>
 *                            <li><a href="">Niveau 2.3</a></li>
 *                        </ul>
 *                    </li>
 *               </ul>
 *          </li>
 *          <li><a href="">Menu 2</a>
 *               <ul>
 *                    <li><a href="">Ligne 1</a></li>
 *                    <li><a href="">Ligne 2</a></li>
 *                    <li><a href="">Ligne 3</a></li>
 *               </ul>
 *          </li>
 *     </ul>
 *
 * </div>
 * </div>
 *
 * <span class="box-simple-button exemple-dropmenu"><a href="">Cliquez moi</a></span>
 * 
 **/
DropMenu.Transform = function(e){
	
	if(Object.isElement(e)){
		
		var drop = new DropMenu({
			type:		childs[0].data('type') != null ? childs[0].data('type') : e.className.match(/type/) ? e.className.substring(e.className.lastIndexOf('type-')).split(' ')[0].replace('type-','') : DropMenu.TOP,
			overable:	!e.className.match(/click/)
		});
		
		if(e.id){
			drop.id = 	e.id;
			e.id = 		'';
		}
		
		drop.addClassName(e.className.replace('box-drop-menu', '').replace('overable'));
		
		DropMenu.TransformMenu(e, drop);
		
		e.replaceBy(drop);
		return drop;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(DropMenu.Transform(e));
	});
	
	return options;
};

DropMenu.TransformMenu = function(node, drop){
	
	node.childElements().each(function(node){
		
		switch(node.tagName.toLowerCase()){
			case 'li': 	//menu
				//récupération des options
				var childs = node.childElements();
				
				if(childs.length <= 0) break;
				
				switch(childs[0].tagName.toLowerCase()){
					case 'a':
						var options = {
							text:	childs[0].innerHTML,
							link:	childs[0].href,
							target:	childs[0].target,
							icon:	childs[0].data('icon') != null ? childs[0].data('icon') : (childs[0].className ? childs[0].className : ''),
							overable:drop.Overable()
						};
						
						var menu =		new SimpleMenu(options);
														
						menu.SimpleButton.on('click', function(){
							$WR.evalLink(options.link, options.target);
						});
						
						drop.appendChild(menu);
						
						if(childs.length > 1) {
							DropMenu.TransformLine(childs[1], menu);
						}
						
						break;
					case 'ul':
						var block = 	new BlockMenu({
							left:	childs[0].className.match(/left|border-left/), 
							right:	childs[0].className.match(/right|border-right/)
						});
						
						block.addClassName(childs[0].className.replace(/left|right|border-left|border-right/, ''));
						
						drop.addBlockMenu(block);
						DropMenu.TransformMenu(childs[0], block);
						
						break;
					default:
						drop.appendChild(node);
														
				}
				
				break;
			default:
				drop.appendChild(node);
				break;
		}
	});
};

DropMenu.TransformLine = function(node, current){
	node.childElements().each(function(node){
		
		switch(node.tagName.toLowerCase()){
			case 'li'://ligne
				var childs = node.childElements();
				
				if(childs.length <= 0) break;
				
				switch(childs[0].tagName.toLowerCase()){
					case 'a':
						
						var options = {
							text:	childs[0].innerHTML,
							link:	childs[0].href,
							target:	childs[0].target,
							border:	childs[0].data('border') != null ? childs[0].data('border') : childs[0].className.match(/border/),
							bold:	childs[0].data('bold') != null ? childs[0].data('bold') : childs[0].className.match(/bold/),
							icon:	childs[0].data('icon') != null ? childs[0].data('icon') : childs[0].className.replace('icon-', '').replace('border', '').replace('bold', '')
						};
						
						var line = new LineElement(options);
						line.setText(options.text);
						
						current.appendChild(line);
						
						line.on('click', function(){
							$WR.evalLink(options.link, options.target);
						});
						
						if(childs.length > 1) {
							DropMenu.TransformLine(childs[1], line);
						}
					
						break;
						
					case 'span':
					
						var options = {
							text:	childs[0].innerHTML,
							border:	childs[0].data('border') != null ? childs[0].data('border') : childs[0].className.match(/border/),
							bold:	childs[0].data('bold') != null ? childs[0].data('bold') : childs[0].className.match(/bold/),
							icon:	childs[0].data('icon') != null ? childs[0].data('icon') : childs[0].className.replace('icon-', '').replace('border', '').replace('bold', '')
						};
						
						var line = new LineElement(options);
						line.setText(options.text);
						
						current.appendChild(line);
						
						if(childs.length > 1) {
							DropMenu.TransformLine(childs[1], line);
						}
						
						break;
					
					default:
						current.appendChild(node);
						break;
				}
				
				break;
			default:
				current.appendChild(node);
				break;	
		}
		
	});
};
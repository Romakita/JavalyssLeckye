/** section: UI
 * class Panel < Element
 *
 * Cette classe créée un conteneur d'élément. Ce conteneur est à utiliser conjointement avec [[TabControl]].
 *
 * <p class="note">Cette classe est définie dans le fichier tabcontrol.js</p>
 **/
var Panel = Class.createSprite('div');
Panel.prototype = {
	/** @ignore */
	__class__:'panel',
	/** @ignore */
	className:'wobject panel',
/**
 * new Panel()
 *
 * Cette méthode Cette méthode créée une nouvelle instance de [[Panel]].
 **/
	initialize: function(obj){
		var options = {
			style: 		'',
			background:	'',
			maximize:	true,
			compact:	false
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		if(document.navigator.mobile){
			this.addClassName('iscroll');	
		}
		
		if(options.style.match(/padding: 0/) || options.style.match(/padding:0/) || options.compact){
			this.Compact(true);
		}
		
		this.Maximize(options.maximize);
		
		this.setStyle(options.style);
		this.setBackground(options.background);
	},
/**
 * Panel#setBackground(bg) -> Panel
 *
 * Cette méthode assigne un fond à partir d'un nom de thème
 **/	
	setBackground: function(bg){
		if(!Object.isUndefined(bg)){
			this.addClassName('my-'+bg+'-panel');
		}
		return this;	
	},
/**
 * Panel#createWidgets() -> WidgetContainer
 *
 * Cette méthode créée une nouvelle instance de WidgetContainer qui sera automatiquement ajouté à l'instance [[Panel]].
 **/
	createWidgets:function(options){
		if(this.Widgets) return this.Widgets;
		
		this.Widgets = new WidgetContainer(options);
		this.appendChild(this.Widgets);
		this.addClassName('widgets');
		
		this.Widgets[0].Maximize(true);
		this.Widgets[1].Maximize(true);
		this.Widgets[2].Maximize(true);
		this.Widgets[3].Maximize(true);
		
		return this.Widgets;
	},
/**
 * Panel#Compact(bool) -> Panel
 *
 * Cette méthode supprime les marges du panel.
 **/
	Compact:function(bool){
			
		this.removeClassName('compact');
		
		if(bool){
			this.addClassName('compact');	
		}
		
		if(this.Widgets){
			this.Widgets.Compact(bool);
		}
		
		return this;
	},
/**
 * Panel#Maximize(bool) -> Panel
 *
 * Cette méthode affiche le panel sur toute la hauteur disponible.
 **/
	Maximize:function(bool){
			
		this.removeClassName('maximize');
		
		if(bool){
			this.addClassName('maximize');	
		}
		
		return this;
	}
};
/** section: UI
 * class TabControl < Element
 *
 * Cette classe est un gestionnaire d'onglet et de panneau.
 *
 * #### Exemple
 * 
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance TabControl en Javascript :</p>
 *
 *     var tab = new TabControl();
 *     var panel1 = new Panel();
 *     var panel2 = new Panel();
 *     panel1.innerHTML = 'Panneau 1';
 *     panel1.innerHTML = 'Panneau 2';
 *     tab.addPanel('onglet1', panel1).setIcon('date');
 *     tab.addPanel('onglet2', panel2);
 *     document.body.appendChild(tab);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance TabControl en HTML :</p>
 * 
 *     <div class="box-tab-control">
 *          <ul>
 *          <li><span class="date">onglet 1</span></li>
 *          <li><span class="date">onglet 2</span></li>
 *          </ul>
 *          <div>Panneau 1</div>
 *          <div>Panneau 2</div>
 *     </div>
 *
 * </div>
 * </div>
 *
 * #### Résultat
 * 
 * <div class="box-tab-control"><ul><li><span class="date">onglet 1</span></li><li><span class="date">onglet 2</span></li></ul><div>Panneau 1</div><div>Panneau 2</div></div>
 *
 **/
var TabControl = Class.createSprite('div');
TabControl.prototype = {
	/** @ignore */
	__class__:	'tablecontrol',
	/** @ignore */
	className:	'wobject tab-control',
	auto:		false,
/**
 * new TabControl()
 *
 * Cette méthode Cette méthode créée une nouvelle instance de [[TabControl]].
 **/
	initialize: function(obj){
		
		var options = {
			type:	'top',
			auto:	false,
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);	
		}
		
		this.header =			new Node('div', {className:'wrap-header tc-head'});
		
		this.body =				new Node('div', {className:'background wrap-body tc-body'});
		this.superBody =		new Node('div', {className:'border wrap-super-body tc-super-body td-body'}, this.body);
		
		this.appendChild(this.header);
		this.appendChild(this.superBody);
		
		this.current =			-1;
		this.auto =				options.auto;
		
		this.setType(options.type);
	},
/**
 * TabControl#Length() -> Number
 * 
 * Cette méthode retourne le nombre d'élément contenu dans l'entete de [[TabControl]].
 **/	
	Length: function(){
		return this.Header().childElements().length;
	},
/**
 * TabControl#Header() -> Element
 * 
 * Cette méthode retourne l'élément d'entete du [[TabControl]].
 **/
	Header: function(){
		return this.header;
	},
/**
 * TabControl#Body() -> Element
 * 
 * Cette méthode retourne l'élément principal du [[TabControl]].
 **/	
	Body: function(){
		return this.body;
	},
/**
 * TabControl#SuperBody() -> Element
 * 
 * Cette méthode retourne l'élément contenant le Body du [[TabControl]].
 **/	
	SuperBody: function(){
		return this.superBody;
	},
/**
 * TabControl#addPanel(title, panel) -> SimpleButton
 * - title (String): Titre du panneau
 * - panel (Element | Panel): Element contenant votre panneau.
 *
 * Cette méthode ajoute un panneau aux gestionnaires d'onglet et retourne l'instance [[SimpleButton]] générée par la méthode.
 **/
	addPanel: function(title, elem, obj){
		var sender = 	this;
		//
		// Btn
		//
		var btn = 		new SimpleButton({text:title});
		btn.friend = 	elem;
		btn.Panel_ID = 	this.Length();
		
		btn.getID = function(){
			return this.Panel_ID;	
		};
		
		btn.getFriend = function(){
			return this.friend;
		};
				
		btn.on('click', function(){
			sender.select(this.getID());
		});
		
		btn.on('change:text', function(){
			sender.update();
		});
		
		//this.draw();
		this.Header().appendChild(btn);
		if(Object.isElement(elem)){			
			this.Body().appendChild(elem);
			elem.hide();
			
			if(this.current == -1){
				this.select(this.Length()-1);
			}
		}
		
		this.update();
				
		return btn;
	},
	
	update:function(){
		var sender = this;
		
		if(this.auto && this.hasClassName('top')){//gestion du dépassement d'onglet par rapport à l'affichage
			
			var width = 	this.header.css('width');
			var widths = 	0;
			
			this.header.childElements().each(function(node){
				widths += node.getWidth();
				if(widths >= width){
					sender.setType('left');
					sender.fire('change:orientation');
				}
			});
			
		}
	},
/**
 * TabControl#addSection(title) -> SimpleSection
 * 
 * Cette ajoute une section avec un titre. La section est apparante uniquement pour une instance [[TabControl]] de type `left`.
 **/	
	addSection: function(title){
		var s = new SimpleSection(title);
		this.header.appendChild(s);
		return s;
	},
/**
 * TabControl#addSimpleMenu(menu [, panel]) -> TabControl
 * - menu (SimpleMenu | PanelMenu): Menu à ajouter.
 * 
 * Cette méthode permet d'ajouter un menu associé à un panneau dans le gestionnaire d'onglet.
 **/
	addSimpleMenu: function(sm, elem){
		if(sm.__class__ =='simplemenu' || sm.__class__ =='panelmenu'){
			sm.SimpleButton.Panel_ID = this.Length();
			sm.SimpleButton.parent = sm;
			
			sm.getID = function(){
				return this.SimpleButton.Panel_ID;	
			};
			
			this.SMtoPanel(sm, elem);
			
			this.Header().appendChild(sm);
			
			if(Object.isElement(elem)){
				this.Body().appendChild(elem);
				elem.hide();
				
				if(this.current == -1){
					this.select(this.Length()-1);
				}
			}
		}
		return this;
	},
/**
 * TabControl#clear() -> TabControl
 *
 * Cette méthode réinitialise le gestionnaire d'onglet.
 **/
	clear:function(){
		for(var i = 0; i < this.Length(); i += 1){
			this.removePanel(i);
		}
		return this;
	},
/**
 * TabControl#removePanel(index) -> TabControl
 * TabControl#removePanel(str) -> TabControl
 * - num (Number): Numéro du panneau.
 *
 * Cette méthode supprime un panneau en fonction du paramètre `num`.
 **/
	removePanel: function(obj){
		
		var button = this.get(obj);
		
		
		if(button){
			if(button.parent){
				this.Header().removeChild(button.parent);
				this.Body().removeChild(button.parent.getFriend());
				
				if(this.current == button.parent.getID()){
					this.select(0);
				}
				
			}else{
				this.Header().removeChild(button);
				this.Body().removeChild(button.getFriend());
				
				if(this.current == button.getID()){
					this.select(0);
				}
			}
		}
		
		var y = 0;
		$A(this.Header().childElements()).each(function(node){
			node.Panel_ID = y;
			y++;
		});
		
		
			
		return this;
	},
/**
 * TabControl#select(num) -> TabControl
 * - num (Number): Numéro du panneau.
 *
 * Cette méthode affiche le panneau correspondant au numéro `num` du panneau passé en paramètre.
 **/
	select:function(num){
		if(Object.isString(num)) return this.Body().select(num);
		if(Object.isUndefined(num)) num = 1;
		
		var options = 	this.Header().childElements();
		
		if(!(0 <= num && num < options.length)) return;
		
		if(options[this.current]){	
			if(Object.isFunction(options[this.current].getFriend)){
				options[this.current].Selected(false);
				options[this.current].getFriend().hide();	
			}
		}
		
		if(Object.isFunction(options[num].getFriend)){
			options[num].Selected(true);
			options[num].getFriend().show();
			this.current = num;
		}
		
		return this;
	},
/**
 * TabControl#get(index) -> SimpleButton
 * TabControl#get(text) -> SimpleButton
 * - index (Number): Index de l'onglet à récupérer.
 *
 * Cette méthode vous retourne l'onglet en fonction du paramètre passé.
 **/	
	get:function(obj){
	
		var options = this.Header().select('.simple-button');
		
		if(Object.isNumber(obj)){
			if(options[obj]){
				return options[obj];	
			}
		}else{
			if(Object.isString(obj)){
				for(var i = 0; i < options.length; i++){
					if(options[i].getText().toLowerCase() == obj.toLowerCase()){
						return options[i];
					}
				}
			}
		}
		
		return false;
	},
/**
 * TabControl#selectedIndex(index) -> Number
 * - index (Number): Index de l'onglet.
 * 
 * Cette méthode fait apparaitre le panneau correspondant à l'index.
 **/	
	selectedIndex:function(num){
		if(!Object.isUndefined(num)){
			this.select(num);	
		}
		return this.current;
	},
	
	/** @ignore */
	focus:function(num){
		if(Object.isUndefined(num)) num = 1;
		this.select(num);
	},
	/**
	 * Maximise la hauteur du gestionnaire d'onglet.
	 * @type TabControl
	 */
	stageHeightMaximise: function(){
		this.body.setStyle({height:(this.SuperBody().getHeight() - 28)+'px'});
		return this;
	},
	/**
	 * La gestion de la hauteur est automatique.
	 * @type TabControl
	 */
	stageHeightAuto: function() {
		this.body.setStyle({height:'auto'});
		return this;
	},
	/**
	 * transforme le boutton du SimpleMenu en Onglet du TabControl.
	 */
	SMtoPanel:function(sm, elem){
		
		if(Object.isElement(elem)){
			var sender = this;
			
			sm.friend = elem;
			sm.SimpleButton.friend = elem;
			
			sm.SimpleButton.observe('click', function(evt){
				sender.onClickPanel(evt, this);
			});
			
			sm.getFriend = function(){
				return this.friend;
			};
			sm.select =  function(){
				this.SimpleButton.addClassName('panel-selected');
				this.getFriend().show();
				return this;
			};
			sm.unselect =  function(){
				this.SimpleButton.removeClassName('panel-selected');
				this.getFriend().hide();
				return this;
			};	
			sm.SimpleButton.getFriend = function(){
				return this.friend;
			};
			sm.SimpleButton.select =  function(){
				this.addClassName('panel-selected');
				this.getFriend().show();
				return this;
			};
			sm.SimpleButton.unselect =  function(){
				this.removeClassName('panel-selected');
				this.getFriend().hide();
				return this;
			};
		}
		
		return this;
	},
/**
 * TabControl#setType(type) -> TabControl
 * - type (String): Type du TabControl (`top` ou `left`)
 *
 * Cette méthode change le comportement et le rendu de l'instance [[TabControl]].
 **/	
	setType:function(type){
		
		this.removeClassName('top');
		this.removeClassName('left');
		
		switch(type){
			case 'top':
				this.addClassName('top');
				break;
			case 'left':
				this.addClassName('left');
				break;
		}
		return this;
	},
/**
 * TabControl#getPanel(num) -> Element
 * - num (Number): Numéro du panneau.
 *
 * Cette méthode retourne un panneau du gestionnaire d'onglet.
 **/
	getPanel: function(num){
		var btn = this.get(num);		
		return btn ? btn.getFriend() : false;
	},
/** alias of: TabControl#get
 * TabControl#getChild(num) -> Element
 * - num (Number): Numéro du panneau.
 *
 * Cette méthode retourne un onglet du gestionnaire d'onglet.
 **/
	getChild: function(num){
		var btn = this.get(num);
		return btn ? btn : false;
	},
/**
 * TabControl#setWidth(w) -> TabControl
 * - w (Number): Largeur en pixel.
 *
 * Cette méthode assigne une largeur en pixel au gestionnaire d'onglet.
 **/
	setWidth: function(w){
		this.setStyle({width:w+'px'});
		return this;
	},
/**
 * TabControl#setHeight(h) -> TabControl
 * - h (Number): Hauteur en pixel.
 *
 * Cette méthode assigne une hauteur en pixel au gestionnaire d'onglet.
 **/
	setHeight: function(h){
		this.body.setStyle({height:h - this.header.getHeight() - 12 +'px'});		
		return this;
	},
	//
	getDimensionsContent:function(){
		return this.body.getDimensions();	
	},
/**
 * TabControl#getStageDimensions() -> Object
 * 
 * Cette méthode retourne les dimensions du corps du gestionnaire.
 **/
	getStageDimensions: function(){return this.SuperBody().getDimensions();},
/**
 * TabControl#getStageHeight() -> Number
 * 
 * Cette méthode retourne la hauteur du corps du gestionnaire.
 **/
	getStageHeight: function(){return  this.SuperBody().getHeight() - 6;},
/**
 * TabControl#getStageWidth() -> Number
 * 
 * Cette méthode retourne la largeur du corps du gestionnaire.
 **/
	getStageWidth:	function(){return this.SuperBody().getWidth();}
};
/**
 * TabControl.Transform(node) -> TabControl
 * TabControl.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance TabControl.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[TabControl]].
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
 * <p>Cette exemple montre comment créer une instance TabControl en Javascript :</p>
 *
 *     var tab = new TabControl();
 *     var panel1 = new Panel();
 *     var panel2 = new Panel();
 *     panel1.innerHTML = 'Panneau 1';
 *     panel1.innerHTML = 'Panneau 2';
 *     tab.addPanel('onglet1', panel1).setIcon('date');
 *     tab.addPanel('onglet2', panel2);
 *     document.body.appendChild(tab);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance TabControl en HTML :</p>
 * 
 *     <div class="box-tab-control">
 *          <ul>
 *          <li><span class="date">onglet 1</span></li>
 *          <li><span class="date">onglet 2</span></li>
 *          </ul>
 *          <div>Panneau 1</div>
 *          <div>Panneau 2</div>
 *     </div>
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance TabControl en HTML 5 :</p>
 * 
 *     <div class="box-tab-control">
 *          <ul>
 *          <li><span data-icon="date">onglet 1</span></li>
 *          <li><span data-icon="date">onglet 2</span></li>
 *          </ul>
 *          <div>Panneau 1</div>
 *          <div>Panneau 2</div>
 *     </div>
 *
 * </div>
 * </div>
 *
 * #### Résultat
 * 
 * <div class="box-tab-control"><ul><li><span class="date">onglet 1</span></li><li><span class="date">onglet 2</span></li></ul><div>Panneau 1</div><div>Panneau 2</div></div>
 *
 **/
TabControl.Transform = function(e){
	
	if(Object.isElement(e)){
						
		var node = 		new TabControl();
		var onglets =	e.childElements()[0].childElements();
		var panels =	e.childElements();
		
		for(var y = 0, z = 1; y < onglets.length; y++){
			var tag = onglets[y].childElements()[0];
			
			switch(tag.tagName.toLowerCase()){
				case 'span':
					var btn = node.addPanel(tag.innerHTML, panels[z]).setIcon(tag.data('icon') != null ? tag.data('icon') : tag.className.replace('icon-', ''));
					
					if(tag.data('js')){
						btn.js = tag.data('js');
						
						btn.on('click', function(evt){
							
							var js = this.js.split('.');
							var fn = window[js[0]];
							
							for(var i = 1; i < js.length; i++){
								fn = fn[js[i]];
							}
												
							fn.call(this, evt);
								
						});
					}
					
					if(tag.data('href')){
						btn.link = 		tag.data('href');
						btn.target = 	tag.data('href');
						
						btn.on('click', function(evt){
							$WR.evalLink(this.link, this.target);
						});
					}
										
					z++;
					break;
				case 'a':
					node.appendChild = function(elem){this.addSimpleMenu(elem)};
					$WR.toSimpleMenu({options:[onglets[y]], Node:node});
					break;	
			}
		}
		
		e.replaceBy(node);	
		
		return node;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(TabControl.Transform(e));
	});
	return options;
};
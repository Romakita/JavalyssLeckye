/** section: Core
 * class System.jPanel
 * 
 * Cette classe permet de créer les nouvelles interfaces telles que l'annuaire [[System.Directory]]. 
 * Cette classe gère les transitions entres panneaux et la mise en forme des données de façon à exploiter au mieux l'espace disponible. 
 *
 *
 **/
System.jPanel = Class.from(Panel);

System.jPanel.prototype = {
	className:	'wobject panel jpanel menu search theme-black',
/**
 * System.jPanel.DropMenu -> DropMenu
 **/
 	DropMenu:	null,
/**
 * System.jPanel.InputSearch -> InputCompleter
 **/	
	InputSearch:null,
	
	theme:		'black',
/**
 * new System.jPanel()
 *
 * Cette méthode Cette méthode créée une nouvelle instance de [[System.jPanel]].
 **/
	initialize: function(obj){
		var options = {
			title:			'',
			icon:			'',
			style: 			'',
			background:		'',
			compact:		false,
			menu:			true,
			progress:		true,
			parameters:		'',
			theme:			'black',
			search:			true,
			placeholder:	$MUI('Search') + '...'
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		//
		// DropMenu
		//
		this.DropMenu = new DropMenu({
			type: DropMenu.LEFT
		});
		
		this.BtnSearch = this.DropMenu.addMenu($MUI('Search'));
		this.BtnSearch.hide();
		//
		//
		//
		if(options.search){
			this.InputCompleter = 	new InputCompleter({
				parameters: options.parameters,
				button:		false
			});
			
			this.InputCompleter.Input.placeholder = options.placeholder;
			this.InputCompleter.addClassName('panel-completer');
		}
		//
		//
		//
		this.h1 =			new Node('h1', {className:'wrap-title'}, options.title);
		
		if(options.search){
			this.header = 		new Node('div', {className:'wrap-header'}, [
								this.h1, 
								this.InputCompleter
							]);
		}else{
			this.header = 		new Node('div', {className:'wrap-header'}, this.h1);
		}
		//		
		//
		//
		this.PanelBody =	new System.jPanel.Panel({type:'body'});
		//
		//
		//
		this.PanelSwip =	new System.jPanel.Panel({type:'swip', footer:true});
		
		this.BtnReturn =	new Node('span', {className:'btn-return'}, $MUI('Back'));
				
		this.BtnReturn.on('click', function(){
			this.Open(false);
		}.bind(this));
		
		this.PanelSwip.header.appendChild(this.BtnReturn);
		//
		//
		//
		this.body = 		new Node('div', {className:'wrap-body'},[
								this.PanelBody,
								this.PanelSwip
							]);
		
		this.appendChild(this.header);
		this.appendChild(this.DropMenu);
		this.appendChild(this.body);
		
		if(document.navigator.mobile){
			this.addClassName('iscroll');	
		}
		//
		//
		//
		this.setStyle(options.style);
		this.setBackground(options.background);
		this.Compact(true);
		this.Menu(options.menu);
		this.setIcon(options.icon);
		
		if(options.progress){
			this.createProgressBar();	
		}
		
		
		this.setTheme(options.theme);
	},
/**
 * System.Header() -> Node
 **/
 	Header:function(){
		return this.header;
	},
/**
 * System.jPanel.Menu([bool]) -> DropMenu
 **/	
	Menu:function(bool){
		if(!Object.isUndefined(bool)){
			this.removeClassName('menu');
			
			if(bool){
				this.addClassName('menu');
			}
		}
		return this.DropMenu	
	},
/**
 * System.jPanel.setCurrentMenu([bool]) -> setCurrentMenu
 **/	
	setCurrentMenu:function(name){
		this.Menu().select('.selected').invoke('Selected', false);
		this.Menu().getMenu(name).SimpleButton.Selected(true);
		return this;
	},
/**
 * System.jPanel.Open([bool]) -> Boolean
 **/	
	Open:function(bool, width){
		
		if(!Object.isUndefined(bool)){
			
			if(this.hasClassName('open') && !bool){
				this.removeClassName('open');
				this.PanelBody.css('right', 0);
				this.PanelSwip.css('right', '-600px').css('width', '600px');
				
				new fThread(function(){
					this.PanelBody.refresh();
					this.PanelSwip.refresh();
				}.bind(this), 0.4);
			}
			
			if(!this.hasClassName('open') && bool){
				this.addClassName('open');
				
				this.PanelBody.css('right', width || '600px');
				this.PanelSwip.css('right', 0).css('width', width || '600px');
				
				new fThread(function(){
					this.PanelBody.refresh();
					this.PanelSwip.refresh();
				}.bind(this), 0.4);
			}
			
			if(this.hasClassName('open') && bool){
				
				this.PanelBody.css('right', width || '600px');
				this.PanelSwip.css('right', 0).css('width', width || '600px');
				
				new fThread(function(){
					this.PanelBody.refresh();
					this.PanelSwip.refresh();
				}.bind(this), 0.4);
			}
		}
		
		return this.hasClassName('open');
	},
/**
 * System.jPanel.OpenDropPanel([bool]) -> Boolean
 **/
	OpenDropPanel:function(bool){
		if(!Object.isUndefined(bool)){
			this.removeClassName('dragin');
			
			if(bool){
				this.addClassName('dragin');
			}
		}
		return this.hasClassName('dragin');
	},
/**
 * System.jPanel.Current([bool]) -> Boolean
 **/	
	clear:function(){
		this.BtnSearch.hide();
		this.Open(false);
		
		this.PanelBody.clear();
		this.PanelSwip.clear();	
	},
/**
 * System.jPanel.clearAll([bool]) -> Boolean
 **/	
	clearAll:function(){
		this.clearBodyAll();	
		this.clearSwipAll();
	},
	
	clearSwipAll:function(){
		this.clearSwip();
		this.PanelSwip.Header().removeChilds();
		this.PanelSwip.Footer().removeChilds();
		this.PanelSwip.Header().appendChild(this.BtnReturn);
		this.PanelSwip.refresh();
	},
	
	clearBodyAll:function(){
		this.clearBody();
		this.PanelBody.Header().removeChilds();
		this.PanelBody.Footer().removeChilds();
		this.PanelBody.refresh();
	},
	
	clearSwip:function(){
		this.PanelSwip.Body().removeChilds();
		this.PanelSwip.refresh();
	},
	
	clearBody:function(){
		this.PanelBody.select('.jp-removable').each(function(n){
			n.parentNode.removeChild(n);
		});
		this.PanelBody.Body().removeChilds();
		this.PanelBody.refresh();
	},
/**
 * System.jPanel.createDropFile(options) -> DropFile
 **/	
	createDropFile:function(options){
		if(this.DropFile) return this.DropFile;
		
		this.DropFile = new DropFile(options);
		
		this.DropFile.Close = new SimpleButton({text:$MUI('Close')});
		this.DropFile.Close.addClassName('close');
		this.DropFile.appendChild(this.DropFile.Close);
		
		this.body.appendChild(this.DropFile);
		
		this.DropFile.addDragArea(this);
		this.DropFile.addDropArea(this);
		
		var self = this;
		var panel = this;
		
		this.DropFile.on('dragin', function(){
			self.OpenDropPanel(true);
		});
		
		this.DropFile.on('dragout', function(){
			self.OpenDropPanel(false);
		});
		
		this.DropFile.on('dropfile', function(node){
			node.orientation = Flag.LEFT;
		});
				
		this.DropFile.Close.on('click', function(){
			self.OpenDropPanel(false);
		});
				
		return this.DropFile;
	},
/**
 * System.jPanel.createProgressBar() -> Progress
 **/		
	createProgressBar:function(title){
		if(this.ProgressBar) return this.ProgressBar;
		
		this.Progress = this.ProgressBar =	new ProgressBar({
			infinite:	true,
			fullscreen:	true,
			theme:		'white',
			text:		title || $MUI('Loading in process')
		});
		this.appendChild(this.ProgressBar);
		this.ProgressBar.hide();
		
		return this.ProgressBar;
	},
	
	setIcon:function(icon){
		this.h1.removeClassName('icon-' + this.icon);
		
		if(icon){
			this.icon = icon;
			this.h1.addClassName('icon-' + this.icon);	
		}
		
		return this;
	},
/**
 * System.jPanel#setTheme(theme) -> ProgressBar
 * - theme (String): Thème a appliquer.
 * 
 * Cette méthode permet de changer le thème de l'instance.
 **/
	setTheme: function(theme){
		
		this.removeClassName('theme-' + this.theme);
		
		if(theme){
			this.theme = theme;
			this.addClassName('theme-' + this.theme);
		}else{
			this.theme = 'black';
			this.addClassName('theme-' + this.theme);
		}
				
		return this;
	}

};
/** section: Core
 * class System.jPanel.Panel
 * 
 **/
System.jPanel.Panel = new Class.createElement('div');
System.jPanel.Panel.prototype = {
	className:'wobject panel',
/**
 * new System.jPanel.Panel()
 **/
	initialize: function(obj){
		var options = {
			type:	'body',
			footer:	false
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		//
		//
		//
		this.header = new Node('div', {className:'wrap-header'});
		//
		//
		//
		this.body = 			new Node('div', {className:'wrap-body'});
		this.body.wrapper = 	new Node('div', {className:'wrapper'});
		this.body.appendChild(this.body.wrapper);
		//
		//
		//
		this.ScrollBar = 		new ScrollBar({node:this.body, wrapper: this.body.wrapper, type:'vertical'});
		//
		//
		//
		this.footer = 			new Node('div', {className:'wrap-footer'});
		
		this.appendChilds([
			this.header,
			this.body,
			this.footer
		]);
		
		this.setType(options.type);
		this.Footer(options.footer);
	},
/**
 * System.jPanel.Panel.Header() -> Node
 **/
 	Header:function(){
		return this.header;
	},
	
	addTable:function(o){
		return this.Body(o);
	},
/**
 * System.jPanel.Panel.Body() -> Node
 **/
 	Body:function(o){
		
		if(Object.isElement(o)){
			o.addClassName('jp-removable');
			this.body.appendChild(o);
		}
		
		return this.body.wrapper;
	},
/**
 * System.jPanel.Panel.Footer([bool]) -> Node
 **/
 	Footer:function(bool){
		
		if(!Object.isUndefined(bool)){
			this.removeClassName('with-footer');
			
			if(bool){
				this.addClassName('with-footer');
			}
		}
		
		return this.footer;
	},
	
	clear:function(){
		this.body.wrapper.removeChilds();
		this.select('.jp-removable').each(function(n){
			n.parentNode.removeChild(n);
		});
		return this;
	},
	
	clearHeader:function(){
		//this.body.wrapper.removeChilds();
		return this;
	},
/**
 *
 **/	
	addPanel:function(name, node){
		var self =	this;
		var tab = 	new Node('span', {className:'tab'}, name);
		tab.panel = node;
		node.addClassName('html-node');
		
		this.Header().appendChild(tab);
		this.Body().appendChild(node);
		
		this.Header().select('span.tab').each(function(e){
			
			e.on('click', function(){
				
				self.Header().select('span.tab').each(function(e){
					e.removeClassName('selected');
					e.panel.hide();	
				});
				
				this.addClassName('selected');
				this.panel.show();
				
				self.refresh();
				
			});
			
		});
		
		try{
			this.Header().select('span.tab')[0].click();
		}catch(er){}
		
		return tab;
	},
/**
 * System.jPanel.Panel.setType(type) -> System.jPanel.Panel
 **/	
	setType:function(type){
		
		this.removeClassName('pan-swip');
		this.removeClassName('pan-body');
		
		if(type == 'body'){
			this.addClassName('pan-body');			
		}else{
			this.addClassName('pan-swip');			
		}
		
		return this;
	},
/**
 * System.jPanel.Panel.refresh() -> System.jPanel.Panel
 *
 * Cette méthode rafraichi l'affichage du panel.
 **/	
	refresh:function(){
		this.ScrollBar.refresh();
		return this;
	}
};
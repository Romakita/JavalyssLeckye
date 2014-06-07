/** section: Core
 * System.Notify
 * Cette class gère l'affichage d'une sidebar unique.
 * 
 *
 **/
System.Sidebar = {
	
	theme: 'black',
/**
 * 
 **/	
	initialize:function(){
		//
		//
		//
		this.SidebarTitle = new Node('h1');
		//
		//
		//
		this.SidebarCount =	new Node('div', {className:'counter'}, '0');
		this.SidebarCount.hide();
		//
		//
		//
		this.Sidebar = 		new Node('div', {className:'system-sidebar theme-dark'});
		//
		//
		//
		this.header = 		new Node('div', {className:'wrap-header'}, [
										this.SidebarTitle,
										this.SidebarCount
									]);
		//
		//
		//							
		this.body = 		new Node('div', {className:'wrap-body'});
		this.body.wrapper =	new Node('div');
		
		this.body.appendChild(this.body.wrapper);
		//
		//
		//
		this.body.ScrollBar = new ScrollBar({
								node:this.body, 
								wrapper: this.body.wrapper, 
								type:'vertical'
							});
		
		this.Sidebar.appendChilds([
			this.header, 
			this.body
		]);
		
		this.body.appendChild_ = this.body.appendChild;
		
		this.body.appendChild = function(e){
			
			this.wrapper.appendChild(e);
			this.ScrollBar.refresh();
			
			return this;
		};
		
		document.body.appendChild(this.Sidebar);
	},
	
	appendChild:function(a){
		this.Body().appendChild(a);
		return this;
	},
	
	removeChild:function(a){
		this.Body().removeChild(a);
		return this;
	},
/**
 * System.Sidebar.Title(t) -> System.Sidebar
 **/
	Title:function(t){
		if(Object.isUndefined(t)) return this.SidebarTitle.innerHTML;
		
		this.SidebarTitle.innerHTML = t;
		
		return this;
	},
/**
 * System.Sidebar.Counter(number) -> System.Sidebar
 **/	
	Counter:function(count){
		if(count == 0){
			this.SidebarCount.hide();	
		}else{
			this.SidebarCount.show();	
		}
		this.SidebarCount.innerHTML = count;
		return this;
	},
/**
 * System.Sidebar.Header() -> Node
 **/
 	Header:function(){
		return this.header;
	},
/**
 * System.Sidebar.Body() -> Node
 **/	
	Body:function(){
		return this.body.wrapper;
	},
/**
 * System.Sidebar.refresh() -> System.Sidebar
 *
 * Cette méthode rafraichie l'affichage de la sidebar.
 **/	
	refresh:function(){
		this.body.ScrollBar.refresh();
		return this;
	},
/**
 * System.Sidebar.clear() -> System.Sidebar
 *
 * Cette méthode réinitialise le contenu de la sidebar.
 **/	
	clear:function(){
		this.SidebarTitle.innerHTML = '';
		this.Body().removeChilds();
		
		this.body.ScrollBar.refresh();
		this.setTheme('black');
		this.Open(false);
		return this;
	},
/**
 * System.Sidebar.Open(bool [, width]) -> Boolean
 * - bool (Boolean): true pour ouvrir et false pour fermer la sidebar.
 *
 * Cette méthode ouvre ou ferme la sidebar si le paramètre `bool` est passé en paramètre. Si aucun paramètres n'est passé à la méthode, elle retournera l'état de la sidebar.
 **/	
	Open:function(bool, width){
		
		if(!Object.isUndefined(bool)){
			
			if(this.Sidebar.hasClassName('open') && !bool){
				this.Sidebar.removeClassName('open');
				this.Sidebar.css('right', -this.Sidebar.getWidth());
			}
			
			if(!this.Sidebar.hasClassName('open') && bool){
				this.Sidebar.addClassName('open');
				
				this.Sidebar.css('right', 0).css('width', (width+'px') || '300px');
			}
		}
		
		return this.Sidebar.hasClassName('open');
	},
/**
 * System.Sidebar#select(query) -> Array
 **/
	select:function(data){
		return this.Body().select(data);
	},
/**
 * System.Sidebar#setTheme(theme) -> System.Sidebar
 * - theme (String): Thème a appliquer.
 * 
 * Cette méthode permet de changer le thème de l'instance.
 **/
	setTheme: function(theme){
		
		this.Sidebar.removeClassName('theme-' + this.theme);
		
		if(theme){
			this.theme = theme;
			this.Sidebar.addClassName('theme-' + this.theme);
		}else{
			this.theme = 'black';
			this.Sidebar.addClassName('theme-' + this.theme);
		}
				
		return this;
	}
};

System.observe('system:startinterface', function(){
	System.Sidebar.initialize();
});

/** section: Core
 * System.Notify
 * Cette class gère l'affichage des notification.
 *
 * Voici ci-contre la zone de notification dans le logiciel :
 *
 * <img src="http://www.javalyss.fr/sources/panel-notify.pgn" />
 **/
System.Notify = System.notify = {
	options: 	null,
	length:	 	0,
	hidden: 	false,
/**
 * System.Notify.initialize() -> void
 *
 * Cette méthode gère l'interface pour le centre de notification.
 **/
	initialize: function(){
		
		this.options = [];
		
		this.SimpleButton = new SimpleButton({icon:'system-notify-24', text:$MUI('Notifications')});
		this.SimpleButton.hide();
		
		System.TaskBar.Systray.appendChild(this.SimpleButton);
						
		this.SimpleButton.on('click', function(){
						
			System.Notify.show();
			
		}.bind(this));
		
		return;
	},
/**
 *
 **/	
	show:function(){
		
		if(System.Sidebar.Open() && System.Sidebar.Title() == $MUI('Notification')){
			System.Sidebar.Open(false);
			return;	
		}
		
		if(	System.Sidebar.Open() ){
			System.Sidebar.Open(false);
			
			new fThread(function(){
				System.Sidebar.clear();
				System.Sidebar.Title($MUI('Notification'));
				System.Sidebar.Body().appendChilds(System.Notify.options);
				System.Sidebar.Open(true);
				System.Notify.refresh();
				
			}, 0.3);
			
			return;
		}
		
		System.Sidebar.clear();
		System.Sidebar.Title($MUI('Notification'));
		System.Sidebar.Body().appendChilds(this.options);
		System.Sidebar.Open(true);
		System.Notify.refresh();
				
		return this;
	},
/**
 * System.Notify.add([options]) -> LineElement
 * - obj (Object): Objet de configuration.
 *
 * Cette méthode ajoute une notification dans le listing des notifications.
 * 
 * <p class="note">Cette méthode n'ajoute pas la notification en base de données.</p>
 *
 * #### Paramètre options
 *
 * Le paramètre `options` prend plusieurs attributs comme suivants :
 *
 * * `title` (`String`) : Titre de la notification.
 * * `icon` (`String`) : Icône de la notification.
 * * `date` (`Date`) : Date de la notification.
 * * `button` (`Boolean`) : Si la valeur est vrai un bouton de suppression sera affiché.  
 * * `progress` (`Boolean`) : Si la valeur est vrai une barre de progression sera affichée.  
 * * `appName` (`String`) : Nom de l'application ayant emit la notification.
 * * `appIcon` (`String`) : Icône de l'application ayant emit la notification.
 *
 **/
 	addNotify:function(obj){
		return this.add(obj);
	},
	
 	add: function(obj){
			
		var options = {
			title:		'',
			icon:		'',
			button: 	false,
			progress:	false,
			date:		null,
			appName:	$MUI('Autres'),
			groupName:	false,
			appIcon:	''
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		var groupName = 	options.groupName !== false ? options.groupName : options.appName;
		var group =			this.getGroup(groupName, options.appIcon, options.appName);
				
		var theClass = groupName + ' ' + options.title + (options.date != null ? options.date.format('Ymd') : '');
		theClass = 'line-' + theClass.replace(/\(\)/gi, '').sanitize('-').toLowerCase().md5(20);
		
		if(System.Sidebar.select('.' + theClass).length == 0){
			var line = new LineElement(options);
			
			line.addClassName('line-altern-' + (group.list.childElements().length % 2 == 0 ? '0' : '1'));
			line.addClassName(theClass);
			
			if(options.date){
				line.date = new Node('div', {className:'.wrap-date'}, options.date.format('l d F Y ' + $MUI('à') + ' h\\h i'));
				line.Header().appendChild(line.date);
			}
			
			group.appendChild(line);
			
			if(options.button){
				line.SimpleButton = new SimpleButton({type:'mini', icon:'cancel-14'});
				line.Header().appendChild(line.SimpleButton);
				line.addClassName('have-button');
				
				line.SimpleButton.on('click', function(){
					group.removeChild(line);
				});
				
			}
			
			if(options.progress){
				line.createProgressBar();	
			}
			
		}else{
			var line = System.Sidebar.select('.' + theClass)[0];
		}
		
		line.on('click', function(){
			System.Sidebar.Open(false);
		});
				
		return line;
	},
/*
 *
 **/	
	getGroup: function(title, icon, appName){
		var self = 			this;
		var groupClass = 	'group-' + title.sanitize('-').replace(/\(\)/gi, '').toLowerCase();
		
		//vérification de l'existance du groupe
		for(var i = 0; i < this.options.length && !this.options[i].hasClassName(groupClass); i++) continue;
		
		if(i < this.options.length){
			return this.options[i];
		}
		
		//création du groupe
		var group = new Section(title);
		group.addClassName(groupClass);
			
		if(icon){
			group.label.addClassName('icon icon-' + icon);
		}
		
		group.list = new Node('ul');
		group.Body().appendChild(group.list);
		
		group.appendChild__ = group.appendChild;
		
		group.removeChild__ = group.removeChild__;
		
		group.appendChild = function(e){
			
			this.list.appendChild(e);
						
			self.refresh();
			
			return this;
		};
		
		group.removeChild = function(e){
						
			this.list.removeChild(e);
			
			if(this.list.childElements().length == 0){
				this.parentNode.removeChild(this);
				System.Notify.options = [];
				
				System.Sidebar.select('.section > .wrap-body > ul > li').each(function(node){
					System.Notify.options.push(node);
				});
			}
			
			self.refresh();
			
			return this;
		};
		
		if(System.Sidebar.Open() && System.Sidebar.Title() == $MUI('Notification')){
			System.Sidebar.appendChild(group);
		}
		
		this.options.push(group);
		
		if(!System.plugins.haveAccess(appName)){
			group.css('display', 'none');
		}
		
		return group;		
	},
/**
 *
 **/	
	refresh:function(){
		var length = 	0;
		
		this.options.each(function(group){
			length += group.list.childElements().length;
		});
				
		if(System.Sidebar.Open() && System.Sidebar.Title() == $MUI('Notification')){
			System.Sidebar.Counter(length).refresh();
		}
		
		this.SimpleButton.setTag(length);
		
		if(length == 0){
			this.SimpleButton.hide();	
		}else{
			this.SimpleButton.show();
		}
	}
};
/*
 * $NM() -> System.Notify
 * 
 * Raccourcie vers le gestion de notification.
 **/
function $NM(){
	return System.Notify;	
};

System.observe('system:startinterface', function(){
	System.Notify.initialize();
});

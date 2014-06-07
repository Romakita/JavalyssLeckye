/** section: Plugins
 * class System.MyStore.Menu
 *
 * Gestion du menu de Store.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : mystore_menu.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.MyStore.Menu = Class.createAjax({
/**
 * System.MyStore.Menu#Post_ID -> Number
 * Numéro d'identification du post.
 **/
	Post_ID: 			0,
/**
 * System.MyStore.Menu#Parent_ID -> Number
 * Numéro d'identification du post parent.
 **/
	Parent_ID:			0,
	Revision_ID:		0,
/**
 * System.MyStore.Menu#User_ID -> Number
 * Numéro d'identification de l'auteur du post.
 **/
	User_ID:			0,
/**
 * System.MyStore.Menu#Category -> String
 * Categorie du poste.
 **/
	Category:			'Non classé;',
/**
 * System.MyStore.Menu#Title -> String
 * Titre du post.
 **/
	Title:				'',
/**
 * System.MyStore.Menu#Title -> String
 * Titre du post pour le référencement.
 **/
	Title_Header:		'',
/**
 * System.MyStore.Menu#Content -> String
 * Contenu du post.
 **/
	Content:			'',
/**
 * System.MyStore.Menu#Summary -> String
 * Résumé du post.
 **/
	Summary:			'',
/**
 * System.MyStore.Menu#Keyword -> String
 * Contenu du post.
 **/
	Keyword:			'',
/**
 * System.MyStore.Menu#Date_Create -> DateTime
 * Date de création du post.
 **/
	Date_Create: 		'',
/**
 * System.MyStore.Menu#Date_Update -> DateTime
 * Date de modification du post.
 **/
	Date_Update:		'',
/**
 * System.MyStore.Menu#Name -> String
 * Nom didentification du post pour les liens méta (Utilisation des méthodes URL REWRITING)
 **/
	Name:				'',
/**
 * System.MyStore.Menu#Picture -> String
 **/
	Picture:				'',
/**
 * System.MyStore.Menu#Type -> String
 * Type du post. Page ou Post.
 **/
	Type:				'post',
/**
 * System.MyStore.Menu#Statut -> String
 * Etat de l'article.
 **/
	Statut:				'publish',
/**
 * System.MyStore.Menu#Comment_Statut -> String
 **/
	Comment_Statut: 	'open',
/**
 * System.MyStore.Menu#Template -> String
 **/
 	Template:			'',
/**
 * System.MyStore.Menu#Menu_Order -> Number
 **/
 	Menu_Order:			0,
/**
 * System.MyStore.Menu#Meta -> String
 **/
 	Meta:			'',
/**
 * new Post([obj])
 * - obj (Object): Objet anonyme équivalent à `Post`.
 *
 * Instancie un nouvelle objet de type `Post`.
 **/
	initialize: function(obj){
		if(!Object.isUndefined(obj)){
			this.setObject(obj);
		}
		
		if(this.Meta == ''){
			this.Meta = {};	
		}
		
		if(!this.oMeta){
			this.oMeta = Object.toJSON(this.Meta);
		}
	},
/**
 * System.MyStore.Menu#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		$S.exec('mystore.menu.commit', {
			
			parameters: 'MyStoreMenu=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					if(Object.isFunction(error)) error.call(this, result.responseText);
					return;	
				}
				
				this.oMeta = Object.toJSON(this.Meta);
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});
	
	},	
/**
 * System.MyStore.Menu#delete(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback, error){
		$S.exec('blogpress.post.delete',{
			parameters: 'Post=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){
					if(Object.isFunction(error)) error.call(this, result.responseText);
					return;
				}
				
				if(Object.isFunction(callback)) {
					callback.call(this, this);
				}
			}.bind(this)
		});
	}
});

Object.extend(System.MyStore.Menu, {
/** 
 * System.MyStore.Menu.open() -> void
 * Cette méthode ouvre le panneau de gestion des menus.
 **/	
	open:function(win, menu){
						
		try{
		
		var panel = win.MyStore;
		
		win.setData(menu = new System.MyStore.Menu(menu));
		var forms = win.createForm();
		//
		// Réinitialisation du contenu
		//
		panel.clearSwipAll();
		panel.Open(true, 650);
		//
		//
		//
				
		panel.PanelSwip.Body().appendChild(new Node('h1', $MUI('Gestion du menu')));
		
		//var html = 	new HtmlNode();
		//panel.PanelSwip.Body().appendChild(html);
		
		panel.PanelSwip.addPanel($MUI('Informations'), this.createPanelInfos(win));
		panel.PanelSwip.addPanel($MUI('Critères'), this.createPanelCritere(win));
		
		var submit = new SimpleButton({text:$MUI('Enregistrer')});
		
		submit.on('click', function(){
			
			System.MyStore.Menu.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('mystore.menu:open', win);
		
		return;
		
		}catch(er){$S.trace(er)}
		
	},
/**
 * System.MyStore.Menu.submit(win) -> void
 **/	
	submit:function(win){
		var forms = win.createForm();
				
		win.Flag.hide();
			
		if(forms.Title.value == '') {
			win.Flag.setText($MUI('Le titre est obligatoire'));
			win.Flag.show(forms.Title);
			return true;
		}
		
		if(forms.Name.Value() == ''){
			forms.Name.Value(forms.Title.Value().sanitize('-').toLowerCase());	
		}
		
		var menu = win.forms.save(win.getData());
		menu.Type = 			'page-mystore menu';
		menu.Template = 		'page-mystore-menu.php';
		menu.Comment_Statut = 	'close';
		
		$S.fire('mystore.menu:open.submit', win);
		
		win.MyStore.Progress.show();
		
		menu.commit(function(){
			var array = [];
			
			win.forms.Criteres.each(function(e){
				if(e.Text().trim() == ''){
					return;
				}
				
				array.push({Name:e.Text().trim(), Post_ID: menu.Post_ID, Order:array.length});
			});
			
			$S.exec('mystore.menu.critere.set', {
				
				parameters:'Criteres=' + Object.EncodeJSON(array),
				onComplete:function(){
					
					$S.fire('mystore.menu:open.submit.complete', win);
					
					System.MyStore.Menu.listing(win);
					System.MyStore.Menu.open(win, menu);
				}
				
			});
			
			
		});
	},
/**
 *
 **/	
	createPanelInfos:function(win){
		//var panel = win.MyStore;	
		var menu = 	win.getData();
		var forms = win.createForm();
		
		var panel = 		new Panel();
		//
		// Titre
		//
		forms.Title = 		new Input({type:'text', value:menu.Title});
		//
		// Titre
		//
		forms.Menu_Order = 	new Input({type:'number', value:menu.Menu_Order, decimal:0, empty:false});
		forms.Menu_Order.css('width', 50).css('text-align', 'right');
		//
		//
		//
		forms.Title_Header = new Input({type:'text', value:menu.Title_Header, maxLength:180});
		//
		//
		//
		forms.Keyword = 	new Input({type:'text', value:menu.Keyword});
		//
		//
		//
		forms.Summary = 	new TextArea({type:'text', value:menu.Summary, maxLength:500});
		//
		//
		//
		forms.Name =		new Input({type:'text', value:menu.Name});
		forms.Name.on('keyup', function(evt){this.value = this.value.sanitize('-').toLowerCase();});
		//
		//
		//
		forms.Picture = new FrameWorker({
			multiple:	false,
			parameters:	'cmd=mystore.menu.import'
		});
				
		forms.Picture.Value(menu.Picture);
		//
		//
		//
		forms.Statut =		new ToggleButton();
		forms.Statut.Value(menu.Statut.match(/publish/));
		//
		//
		//
		forms.Private =		new ToggleButton();
		forms.Private.Value(menu.Statut.match(/private/));
		
		forms.addFilters('Statut', function(){
			return ((this.Statut.Value() ? 'publish' : '') + (!this.Private.Value() ? '' : ' private')).trim();
		});
		//
		//
		//
		forms.Parent_ID = 		new ListBox({
			link:		$S.link,
			type:		'radio',
			parameters:	'cmd=mystore.menu.select.list&options=' + Object.EncodeJSON({exclude:menu.Post_ID, default:' - Pas de parent -'})
		});
		
		forms.Parent_ID.Value(menu.Parent_ID);
		forms.Parent_ID.css('height', '250px');
		
		forms.Parent_ID.on('draw', function(line){
			if(line.data.level){
				var e = line.getText();
				for(var i = 0; i < line.data.level; i++){
					e  = ' - ' + e;	
				}
				line.setText(e);
			}else{
				line.Bold(true);	
			}
		});
		
		forms.Parent_ID.load();
		//
		//
		//		
		
		panel.appendChild(new Node('h4', $MUI('Informations')));
		
		var table = 		new TableData();
		
		table.addHead($MUI('Titre du menu')).addCel(win.forms.Title).addRow();
		table.addHead($MUI('Photo')).addCel(win.forms.Picture).addRow();
		table.addHead($MUI('Ordre')).addCel(win.forms.Menu_Order).addRow();
		table.addHead($MUI('Menu parent')).addCel(win.forms.Parent_ID).addRow();
		table.addHead($MUI('Menu ouvert') + ' ?').addCel(win.forms.Statut).addRow();
		table.addHead($MUI('Menu privé') + ' ?').addCel(win.forms.Private).addRow();
		
		panel.appendChild(table);
		
		panel.appendChild(new Node('h4', $MUI('Référencement')));
		
		var table = 		new TableData();
		
		table.addHead($MUI('Titre de référencement')).addCel(win.forms.Title_Header).addRow();
		table.addHead($MUI('Lien de référencement') + ' : ').addCel(' ', {style:'font-size: 10px; font-weight: bold;'}).addRow();
		table.addHead(' ').addCel(forms.Name).addRow();
		
		table.addHead($MUI('Mot clef')).addCel(win.forms.Keyword).addRow();
		table.addHead($MUI('Description')).addCel(win.forms.Summary).addRow();
		
		forms.Host = table.getCel(1, 1);
				
		panel.appendChild(table);
		
		System.BlogPress.Page.createPermalien(win, menu);
		
		return panel;
	},
/**
 *
 **/	
	createPanelCritere: function(win){
		var panel = 	new Panel();
		
		var menu = 		win.getData();
		
		var table = 		new TableData();
		panel.appendChild(table);
				
		win.forms.Criteres =	[];
		//
		// Récupération des segments
		//
		$S.exec('mystore.menu.critere.list', {
			parameters:'options={"Post_ID":' +menu.Post_ID+'}',
			onComplete:function(result){
				try{
					var array = result.responseText.evalJSON();
				}catch(er){return;}
				$S.trace(array);
				for(var i = 0; i < array.length; i++){
					
					if(array[i] == '') continue;
						
					var input = new InputCompleter({
						maxLength:	255,
						sync:		true,
						parameters:	'cmd=mystore.menu.critere.distinct&field=Name'
					});
					
					input.Text(array[i].Name);
					input.Value(array[i].Name);
					
					var button = new SimpleButton({icon:'remove-element', nofill:true});
					button.Input = array[i];
					
					table.addHead($MUI('Critère') +' '+ (i+1)).addCel(input).addCel(button).addRow();
					
					button.on('click', function(){
						this.Input.Text('');
						this.Input.Value('');
						this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
					});
					
					win.forms.Criteres.push(input);
				}
				
				win.MyStore.PanelSwip.ScrollBar.refresh();
				win.MyStore.PanelSwip.ScrollBar.scrollTo(table);
			}
		});
		
		//
		// Ajout du contact
		//
		var add = new SimpleButton({icon:'add-element', text:$MUI('Ajouter un critère'), nofill:true});
		add.addClassName('menu-mystore');
		panel.appendChild(add);
		
		
		add.on('click', function(){
			var input = new InputCompleter({
				maxLength:	255,
				parameters:	'cmd=mystore.menu.critere.distinct&field=Name'
			});
			
			win.forms.Criteres.push(input);
						
			var button = new SimpleButton({icon:'remove-element', nofill:true});
			button.Input = input;
			
			table.addHead($MUI('Critère') +' '+ (win.forms.Criteres.length)).addCel(input).addCel(button).addRow();
			
			button.on('click', function(){
				this.Input.Text('');
				this.Input.Value('');
				this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
			});
			
			win.MyStore.PanelSwip.ScrollBar.refresh();
			win.MyStore.PanelSwip.ScrollBar.scrollTo(table);
		});
		
		return panel;
	},
/**
 *
 **/	
	createMultipleOtherField:function(win, options){
		
		var html = 		options.node;
				
		html.appendChild(new Node('h4', options.label));
		
		
	},
/**
 *
 **/
	listing:function(win){
		
		var panel = win.MyStore;
		
		System.MyStore.setCurrent('menu');
		panel.Progress.show();
		//
		//
		//
		var add = new Node('span', {className:'add icon icon-add-element', value:'Add'}, $MUI('Ajouter'));
		add.on('click', function(){
			System.MyStore.Menu.open(win);
		});
		
		panel.PanelBody.Header().appendChilds([
			add
		]);
		
				
		$S.exec('mystore.menu.list', {
			parameters:'options=' + escape(Object.toJSON({op:'-tree', draft:true})),
			onComplete:function(result){
				
				try{
					var array = $A(result.responseText.evalJSON());
				}catch(er){
					alert(er);
					return;	
				}
				
				if(array.length == 0){
					System.MyStore.Menu.open(win);	
				}
				
				try{		
					var height = 0;
					
					for(var i = 0; i < array.length; i++){
						var menu = new System.MyStore.Menu.Item({
							data:	array[i],
							click:	function(evt){
								evt.stop();								
								System.MyStore.Menu.open(win, this.data);
								return false;
							},
							
							remove:function(evt){
								evt.stop();								
								System.MyStore.Menu.remove(win, this.data);
								return false;
							}
						});
												
						panel.PanelBody.Body().appendChild(menu);
						
						menu.addClassName('top-menu');
						
						height = Math.max(height, menu.css('height'));
					}
					
					panel.PanelBody.select('.top-menu').invoke('css', 'height', height);
					
					panel.PanelBody.refresh();
					panel.ProgressBar.hide();
						
				}catch(er){alert(er)}
			}.bind(this)
		});
	},
	
	
/**
 * System.MyStore.Menu.remove(menu) -> void
 * - menu (Post): Menu.
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(win, menu){
		var post = new System.MyStore.Menu(menu);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer le menu') + ' ' + post.Title + ' ? ', $MUI('Les menus enfants seront réattribués au menu parent le plus proche') + ' !');
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = win.createBox();
		
		box.setTheme('flat liquid black');
		box.a(splite).setIcon('delete').setType().show();
		
		$S.fire('mystore.menu:remove.open', box);
		
		box.reset({icon:'cancel'});
						
		box.submit({
			text:$MUI('Supprimer le menu'),
			icon:'delete',
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('mystore.menu:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				post.remove(function(){
					box.hide();
						
					System.MyStore.Menu.listing(win);
					
					$S.fire('mystore.menu:remove.submit.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('Le menu a bien été supprimé'), $MUI('Menu') + ' : ' + post.Title);
					splite.setIcon('valid-48');
					
					box.setTheme('flat liquid white');
					box.a(splite).setType('CLOSE').Timer(5).show();
										
				}.bind(this));
				
			}.bind(this)
		});
	}
});

System.MyStore.Menu.Item = Class.createElement('ul');

System.MyStore.Menu.Item.prototype = {
/**
 *
 **/	
	initialize:function(options){
		
		var data = options.data;
				
		this.addClassName('wobject menu-item');
		
		this.btnRemove = new SimpleButton({nofill:true, icon:'remove-element-2'});
		
		this.header = 	new Node('li', {className:'wrap-header'}, [new Node('span', data.Title), this.btnRemove]);
		this.body =		new Node('li', {className:'wrap-body'});
		
		this.data = 	data;
		
		this.appendChild(this.header);
		
		this.on('click', options.click);
		
		this.btnRemove.on('click', options.remove.bind(this));
		
		if(data.Children.length){
			this.appendChild(this.body);
			this.addClassName('have-children');
			
			for(var i = 0; i < data.Children.length; i++){
				
				this.body.appendChild(new System.MyStore.Menu.Item({
					data:	data.Children[i],
					click:	options.click,
					remove:	options.remove
				}));
			}
		}
	}
};

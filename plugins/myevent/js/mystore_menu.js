/** section: MyEvent
 * class MyEvent.Product
 *
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : myevent_menu.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.MyEvent.Menu = {
/** 
 * System.MyEvent.Menu.open() -> void
 * Cette méthode ouvre le panneau de gestion des menus.
 **/	
	open:function(win, menu){
						
		try{
		
		var panel = win.MyEvent;
		
		win.setData(menu = new Post(menu));
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
			
			System.MyEvent.Menu.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('myevent.menu:open', win);
		
		return;
		
		}catch(er){$S.trace(er)}
		
	},
/**
 * System.MyEvent.Menu.submit(win) -> void
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
		menu.Type = 			'page-myevent menu';
		menu.Template = 		'page-myevent-menu.php';
		menu.Comment_Statut = 	'close';
		
		$S.fire('myevent.menu:open.submit', win);
		
		win.MyEvent.Progress.show();
		
		menu.commitWithoutRevision(function(){
			var array = [];
			
			win.forms.Criteres.each(function(e){
				if(e.Text().trim() == ''){
					return;
				}
				
				array.push({Name:e.Text().trim(), Post_ID: menu.Post_ID, Order:array.length});
			});
			
			$S.exec('myevent.menu.critere.set', {
				
				parameters:'Criteres=' + Object.EncodeJSON(array),
				onComplete:function(){
					
					$S.fire('myevent.menu:open.submit.complete', win);
					
					System.MyEvent.Menu.listing(win);
					System.MyEvent.Menu.open(win, menu);
				}
				
			});
			
			
		});
	},
/**
 *
 **/	
	createPanelInfos:function(win){
		//var panel = win.MyEvent;	
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
			parameters:	'cmd=myevent.menu.import'
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
			parameters:	'cmd=myevent.menu.select.list&options=' + Object.EncodeJSON({exclude:menu.Post_ID})
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
		$S.exec('myevent.menu.critere.list', {
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
						parameters:	'cmd=myevent.menu.critere.distinct&field=Name'
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
				
				win.MyEvent.PanelSwip.ScrollBar.refresh();
				win.MyEvent.PanelSwip.ScrollBar.scrollTo(table);
			}
		});
		
		//
		// Ajout du contact
		//
		var add = new SimpleButton({icon:'add-element', text:$MUI('Ajouter un critère'), nofill:true});
		add.addClassName('menu-myevent');
		panel.appendChild(add);
		
		
		add.on('click', function(){
			var input = new InputCompleter({
				maxLength:	255,
				parameters:	'cmd=myevent.menu.critere.distinct&field=Name'
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
			
			win.MyEvent.PanelSwip.ScrollBar.refresh();
			win.MyEvent.PanelSwip.ScrollBar.scrollTo(table);
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
		
		var panel = win.MyEvent;
		
		System.MyEvent.setCurrent('menu');
		panel.Progress.show();
		//
		//
		//
		var add = new Node('span', {className:'add icon icon-add-element', value:'Add'}, $MUI('Ajouter'));
		add.on('click', function(){
			System.MyEvent.Menu.open(win);
		});
		
		panel.PanelBody.Header().appendChilds([
			add,
			//new Node('span', {className:'tool-contact export', value:'Export'}, $MUI('Exporter')),
			//new Node('span', {className:'tool-appsme name', value:'Name'}, $MUI('Name')),
			//new Node('span', {className:'tool-appsme note', value:'Note'}, $MUI('Note')),
			//new Node('span', {className:'tool-appsme popularity', value:'Popularity'}, $MUI('Popularity'))
		]);
		
				
		$S.exec('myevent.menu.list', {
			parameters:'options=' + escape(Object.toJSON({op:'-tree', draft:true})),
			onComplete:function(result){
				
				try{
					var array = $A(result.responseText.evalJSON());
				}catch(er){
					alert(er);
					return;	
				}
				
				if(array.length == 0){
					System.MyEvent.Menu.open(win);	
				}
				
				try{		
					var height = 0;
					
					for(var i = 0; i < array.length; i++){
						var menu = new System.MyEvent.Menu.Item({
							data:	array[i],
							click:	function(evt){
								evt.stop();								
								System.MyEvent.Menu.open(win, this.data);
								return false;
							},
							
							remove:function(evt){
								evt.stop();								
								System.MyEvent.Menu.remove(win, this.data);
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
 * System.MyEvent.Menu.remove(menu) -> void
 * - menu (Post): Menu.
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(win, menu){
		post = new System.BlogPress.Post(menu);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer le menu') + ' ' + post.Title + ' ? ', $MUI('Les menus enfants seront réattribués au menu parent le plus proche') + ' !');
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = win.createBox();
		
		box.setTitle($MUI('Suppression du menu')).a(splite).setIcon('delete').setType().show();
		
		$S.fire('myevent.menu:remove.open', box);
		
		box.reset({icon:'cancel'});
						
		box.submit({
			text:$MUI('Supprimer le menu'),
			icon:'delete',
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('myevent.menu:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				post.remove(function(){
					box.hide();
						
					$S.fire('myevent.menu:remove.submit.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('Le menu a bien été supprimé'), $MUI('Menu') + ' : ' + post.Title);
					splite.setIcon('valid-48');
					
					
					box.setTitle($MUI('Confirmation')).setContent(splite).setType('CLOSE').Timer(5).show();
					box.setIcon('documentinfo');
					
				}.bind(this));
				
			}.bind(this)
		});
	}
};

System.MyEvent.Menu.Item = Class.createElement('ul');

System.MyEvent.Menu.Item.prototype = {
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
				
				this.body.appendChild(new System.MyEvent.Menu.Item({
					data:	data.Children[i],
					click:	options.click,
					remove:	options.remove
				}));
			}
		}
	}
};

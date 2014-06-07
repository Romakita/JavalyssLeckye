/** section: plugin
 * class InteractiveCatalogUI
 *
 * Cet espace de nom gère l'extension InteractiveCatalogUI.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
var InteractiveCatalogUI = Class.create();
InteractiveCatalogUI.prototype = {
/**
 * new InteractiveCatalogUI()
 **/
	initialize: function(){
		
		$S.interactivecatalogue = this;
		
		$S.observe('blogpress:open', this.onOpenBlogPress.bind(this));
		
		$S.observe('system:startinterface', this.startInterface.bind(this));
				
		$S.observe('icui:remove.complete', function(){
			var win = $WR.getByName('blogpress.form');		
			//on regarde si l'instance a été créée
			if(!win) return;
			win.loadICatalog();
		});
				
	},
/**
 * InteractiveCatalogUI.startInterface() -> void
 *
 * Cette méthode est appellé lors du chargement de l'interface du logiciel.
 **/	
	startInterface:function(){
		
		if($U().getRight() == 1){
						
			$S.addWidget('icatalogstat', this.createWidgetStats());
						
		}
			
	},
/**
 * InteractiveCatalogUI.getCurrent() ->  jCarousel
 **/
	getCurrent: function(){
		var win = $WR.getByName('blogpress.form');		
		//on regarde si l'instance a été créée
		if(!win) return;
			
		return win.carousel;
	},
/**
 * InteractiveCatalogUI.startInterface() -> void
 **/	
	onOpenBlogPress: function(win){
		if($U().getRight() != 3){
			var button = win.TabControl.addPanel($MUI('Catalogues'), this.createPanel(win));
			button.setIcon('icatalog');
			
			button.on('click', function(){
				win.loadICatalog();
			});
			
			add = new SimpleButton({type:'mini', icon:'add-14', nofill:true});
			add.setStyle('position:absolute; right:5px;top:6px');
			button.appendChild(add);
			
			add.on('click', function(){
				button.click();
				this.open();
			}.bind(this));
			
			add.on('mouseover', function(){
				win.Flag.setText('<p class="icon-documentinfo">' +$MUI('Cliquez ici pour créer un catalogue')+ '</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
			});
		}
	},
/**
 * InteractiveCatalogUI.open([catalog]) -> Window
 * - catalog (Post): Le catalogue à gérer
 *
 * Cette méthode permet d'ouvrir le formulaire de gestion d'un catalogue.
 **/	
	open: function(post, obj){
		
		var options = {
			instance:	'page.form',
			type:		'page',
			template:	'page.php',
			icon:		'easymoblog'
		};
		
		Object.extend(options, obj || {});
		
		var win = $WR.unique('icui.form', {
			autoclose:	true,
			action: function(){
				this.open(picture);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return;
		
		win.options = options;
		
		win.post = new Post(post);
		win.post.Type = 'page icatalog';
				
		if(win.post.Post_ID == 0){
			
			var options = $S.Meta('iCatalogOptions') || {
				Private: 	0,
				Template:	options.template
			};
			
			win.post.Template = options.Template;
			
			if(options.Private){
				win.post.Statut += ' private';
			}
		}
		
		win.overideClose({
			submit:this.submit.bind(this), 
			change:this.checkChange.bind(this),
			close: function(){}.bind(this)
		});
		
		//Vérification régulière de l'état de la fiche lorsqu'un click est intercepté
		win.body.on('click', function(){
			try{
				if(this.checkChange(win)){
					win.forms.active();	
				}
			}catch(er){$S.trace(er)}
		}.bind(this));
		
		var self = this;
		//création de l'objet forms
		var forms = win.forms = 	{
			update:	false,
			
			active:	function(){
				if(this.update) return;                                                                                                                                                                                         
				this.update = true;
				//desactivation de la synchro avec la bdd
				win.forms.submit.setTag("<b>!</b>");
				win.forms.submit.setText((win.post.Statut == "publish" ? $MUI('Mettre à jour') : $MUI('Publier')) + '<span style="padding-right:10px"></span>');
				win.forms.submit.Tag.on('mouseover', function(){
					$S.Flag.setText('<p class="icon-documentinfo">' + $MUI('La page a subi une ou plusieurs modification(s)') + '.</p>').setType(FLAG.RT).color('grey').show(this, true);
				});
			},
			
			deactive: function(){
				this.update = false;
							
				$S.blogpress.pages.createPermalien(win, win.post);
				
				win.forms.submit.setTag("");
				win.forms.submit.Tag.stopObserving('mouseover');
				
				win.forms.Template.load();
				win.forms.Parent_ID.load();
				
				$WR.getByName('blogpress.form').loadICatalog();
			}	
		};
		
		var flag = 	win.createFlag().setType(FLAG.RIGHT);
		win.setTitle(win.post.Post_ID == 0 ? $MUI('Créer un catalogue') : $MUI('Modifier le catalogue')).setIcon('icatalog');
		win.Resizable(false);
		win.createBox();
		win.createTabControl({type:'top'});
		win.createHandler($MUI('Chargement en cours'), true);
		
		win.TabControl.addPanel($MUI('Page'), $S.blogpress.pages.createPanelGeneral(win));
		win.TabControl.addPanel($MUI('Catalogue'), this.createPanelAttach(win)).setIcon('attach');
		win.TabControl.addPanel($MUI('Paramètres'), $S.blogpress.pages.createPanelParameters(win)).setIcon('advanced');
		
		$Body.appendChild(win);
		
		win.forms.Parent_ID.setParameters('cmd=post.parent.list&Post_ID=' + win.post.Post_ID + '&options=' + escape(Object.toJSON({type:'%icatalog%'})))
		win.forms.Template.load();
		win.forms.Parent_ID.load();	
		win.forms.Content.load();
		
		win.centralize();
		
		win.forms.Parent_ID.load();
		
		forms.Title.placeholder = $MUI('Saisissez ici le titre du catalogue') + '...';
		
		forms.submit = new SimpleButton({icon:'filesave', text:$MUI('Publier'), type:'submit'});
		forms.submit.on('click', function(){this.submit(win)}.bind(this));
		//
		// 
		//
		forms.close = new SimpleButton({icon:'exit', text:$MUI('Fermer')});
		forms.close.on('click', function(){win.close()});
		
		win.Footer().appendChilds([forms.submit, forms.close]);
	},
/**
 * InteractiveCatalogUI.checkChange(win) -> void
 * - win (Window): Fenêtre du formulaire.
 * 
 * Cette méthode vérifie si le formulaire a été modifié par l'utilisateur.
 **/
	checkChange: function(win){
		return $S.blogpress.pages.checkChange(win);
	},
/**
 * InteractiveCatalogUI#submit(win) -> Boolean
 **/
	submit:function(win){
		win.forms.Statut = 'publish';
		
		if(Object.isUndefined(win.post.Meta.SWF)){
			win.post.Meta.SWF = '';
		}
		
		if(Object.isUndefined(win.post.Meta.PDF)){
			win.post.Meta.PDF = '';
		}
								
		return $S.blogpress.pages.submit(win, true);
	},
/**
 * InteractiveCatalogUI#createPanel(win) -> Panel
 **/
	createPanel: function(win){
		var panel = new Panel({background:'icatalog', style:'width:700px;min-height:500px;'});
		
		var splite = new SpliteIcon($MUI('Gestionnaire des catalogues'), $MUI('Choississez le catalogue à éditer en cliquant dessus. Vous pouvez à tout moment changer l\'ordre de tri des catalogues en faisant glisser un catalogue dans la liste ci-contre') + ' : ');
		splite.css('width', '550px');
		splite.setIcon('icatalog-48'),
		panel.appendChild(splite);
		//
		// Bouton d'ajout
		//
		var add = new SimpleButton({text:$MUI('Créer un catalogue'), icon:'add'});
		add.on('click', function(){
			this.open();
		}.bind(this));	
		//
		// Bouton d'ajout
		//
		var config = new SimpleButton({icon:'advanced', text:$MUI('Paramètres')});
		config.on('click', function(){
			this.openConfig();
		}.bind(this));
		
		
		panel.appendChilds([add, config]);
		add.css('position', 'absolute').css('top', '10px').css('right', '10px');
		config.css('position', 'absolute').css('top', '50px').css('right', '10px').css('width', '133px');
		
		//
		// Conteneur de catalogue
		//
		this.body = new Node('div', {className:'wrap-icui-body'});
		panel.appendChild(this.body);
		
		win.loadICatalog = this.load.bind(this);
				
		return panel;
	},	
/**
 * jCarousel.createPanel(win) -> Panel
 **/
	createPanelAttach: function(win){
		var panel = new Panel({background:'icatalog', style:'width:600px;min-height:500px;'});
		
		var splite = new SpliteIcon($MUI('Gestion du catalogue'), $MUI('Cette section vous permet d\'ajouter des éléments au catalogue. Ces éléments pourront être téléchargés par le visiteur de la page') + ' : ');
		
		splite.css('max-width', '550px');
		splite.setIcon('attach-48'),
		panel.appendChild(splite);
		//
		// 
		//
		win.forms.SWF = new FrameWorker({
			link:		$S.link,
			parameters:	'cmd=icatalog.swf.import',
			multiple:	false
		});
		win.forms.SWF.css('width', '100%');
		win.forms.SWF.Value(win.post.Meta.SWF);
		
		if(win.forms.SWF.hasFileAPI){
			win.forms.SWF.DropFile.Title($MUI('Glissez ici votre SWF'));
		}
		
		win.forms.SWF.on('complete', function(link){
			win.forms.active();
			win.post.Meta.SWF = link;
		});
		//
		// 
		//
		win.forms.PDF = new FrameWorker({
			link:		$S.link,
			parameters:	'cmd=icatalog.pdf.import',
			multiple:	false
		});
		win.forms.PDF.css('width', '100%');
		
		try{
			win.forms.PDF.Value(win.post.Meta.PDF);
		}catch(er){}
		
		if(win.forms.PDF.hasFileAPI){
			win.forms.PDF.DropFile.Title($MUI('Glissez ici votre pièce jointe'));
		}	
		
		win.forms.PDF.on('complete', function(link){
			win.forms.active();
			win.post.Meta.PDF = link;
		});
		
		panel.appendChild(splite);
		panel.appendChild(new Node('H3', $MUI('Votre catalogue au format SWF')));
		panel.appendChild(win.forms.SWF);
		panel.appendChild(new Node('H3', $MUI('Votre catalogue au format PDF')));
		panel.appendChild(win.forms.PDF);
				
		return panel;
	},
/**
 * jCarousel.createPanel(win) -> Panel
 **/	
	load:function(){
		var self = this;
		
		var win = $WR.getByName('blogpress.form');
		
		win.ActiveProgress();
		
		this.body.removeChilds();
		
		$S.exec('icatalog.list', function(result){
			
			try{
				var array = $A(result.responseText.evalJSON());
			}catch(er){return;}
			
			for(var i = 0; i < array.length; i++){
			
				var hp = new HeadPiece({src:'icatalog-32', title:array[i].Title + (array[i].Statut.match(/private/) ? ' ('+ $MUI('Privé') + ')' : '')});
				
				hp.appendChild(new Node('div', {className:'icon-move'}));
				hp.remove = new Node('div', {className:'icon-cancel-14 remove'});
				hp.appendChild(hp.remove);
				
				hp.data = array[i];
				
				hp.UID = this.body.childElements().length + 1;
				
				hp.createDrag({absolute:false});
				
				hp.on('dragstart', function(){
					this.ismove = false;
					self.body.addClassName('drag');
					this.addClassName('thedrag');
				});
				
				hp.on('drag', function(){
					this.ismove =	true;
				});
				
				hp.on('dragend', function(){
					self.body.removeClassName('drag');
					this.removeClassName('thedrag');
					
					var list = [];
					
					self.body.select('.hp-button').each(function(e){
						list.push(e.data.Post_ID);
					});
					
					$S.Meta('iCatalogList', list);	
				});
				
				hp.on('click', function(){
					
					if(!this.ismove){
						self.open(this.data);
					}
					
					this.ismove = false;
				});
				
				hp.remove.on('click', function(evt){
					evt.stop();
					self.remove(this.data);
				}.bind(hp));
						
				this.body.appendChild(hp);	
			}
			
		}.bind(this));
	},
/**
 * InteractiveCatalogUI.remove() -> void
 **/
 	remove: function(post){
		var win = $WR.getByName('blogpress.form');		
		//on regarde si l'instance a été créée
		if(!win) return;
		
		var box = 		win.AlertBox;
		var flag = 		box.box.createFlag().setType(FLAG.RIGHT);
		
		post = new Post(post);
		//---------------------
		//Splite---------------
		//---------------------		
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer le catalogue') +  ' "' + post.Title + '" ? ');
		splite.setIcon('trash-48');
		splite.setStyle('max-width:500px');
		
		box.as([splite]).ty()
		
		$S.fire('icui:remove.open', box);
		
		box.show();
		
		box.submit({
			text: $MUI('Supprimer'),
			icon: 'delete',
			click: function(){
						
				var evt = new StopEvent(box);
				$S.fire('icui:remove.submit', evt);
				
				if(evt.stopped)	return true;
							
				box.wait();
				
				win.carousel = false;
				
				post.remove(function(){
					box.hide();
					$S.fire('icui:remove.complete', win.carousel);	
					
					var splite = new SpliteIcon($MUI('Catalogue correctement supprimé'), carousel.Name);
					splite.setIcon('valid-48');
									
					box.setTitle($MUI('Confirmation')).a(splite).setType('CLOSE').Timer(3).show();
					box.getBtnReset().setIcon('cancel');
					box.setIcon('documentinfo');
					
				});
				
				return true;
			}
		});
		
		box.reset({icon:'cancel'});
	},
/**
 * InteractiveCatalogUI.remove() -> void
 **/	
	openConfig:function(){
		var win = $WR.getByName('blogpress.form');		
		//on regarde si l'instance a été créée
		if(!win) return;
		
		var forms = {};
		var options = $S.Meta('iCatalogOptions') || {
			Private: 	0,
			Template:	'page.php',
			Roles:		[]
		};
		//
		//
		//
		forms.Private = new ToggleButton();
		forms.Private.Value(options.Private);
		//
		//
		//
		forms.Template = 		new Select({
			link:			$S.link,
			parameters:		'cmd=post.template.list'
		});
		forms.Template.css('width', '200px');
		forms.Template.Value(options.Template);
		forms.Template.load();
				
		forms.Template.on('complete', function(){
			if(this.Value() == ''){
				this.selectedIndex(0);
			}
		});
		
		var table = new TableData();
		
		table.addHead($MUI('Les catalogues sont privés par défaut ?'), {style:'width:240px'}).addCel(forms.Private).addRow();
		table.addHead($MUI('Modèle de page par défaut')).addField(forms.Template).addRow();
		
		var table2 = new TableData();
		table2.css('margin-top', '20px');
		table2.addHead($MUI('Choississez les groupes pouvant télécharger les catalogues') + ' :', {colSpan:2, style:'padding-bottom:5px;'}).addRow();
		
		var roles = 	$S.getRolesAcces();
		options.Roles = options.Roles || [];
		roles[0] = 		{text:$MUI('Anonyme'), value:0};
		forms.Roles = 	[];
		
		for(var i = 0; i < roles.length; i++){
			if(roles[i].value == 1) continue;
			
			var node = new ToggleButton();
			node.Value(options.Roles[roles[i].value] == 1);
					
			table2.addHead(roles[i].text, {style:'width:240px'}).addCel(node, {height:30}).addRow();
			
			forms.Roles[roles[i].value] = node;
		}
			
		var splite = new SpliteIcon($MUI('Gestion des paramètres'), $MUI('Cette section vous permet de configurer les options par défaut d\'un nouveau catalogue') + ' : ');
		splite.setIcon('advanced-48');
		splite.css('margin-bottom', '20px');
		
		var box = win.createBox();
		
		box.as([splite, table, table2]).setType().show();
		
		box.submit({
			icon:	'filesave',
			text: 	$MUI('Enregistrer'),
			click: 	function(){
				
				var roles = 	$S.getRolesAcces();
				roles[0] = 		{text:$MUI('Anonyme'), value:0};
				var access = 	[];
				
				for(var i = 0; i < roles.length; i++){
					if(roles[i].value == 1) continue;
					
					access[roles[i].value] = forms.Roles[roles[i].value].Value() ? 1 : 0;
				}
				
				$S.Meta('iCatalogOptions', {
					Private: 	forms.Private.Value(),
					Template:	forms.Template.Value(),
					Roles:		access
				});
			}
		});
	},
	
	createWidgetStats: function(){
		
		var widget = $S.users.createWidgetUsers({}, {
			lastConnexion:	false,
			parameters:		'cmd=icstat.list',
			empty:			'- ' + $MUI('Aucune statistique d\'enregistrée') + ' -',
			complex:		false,
			field:			false,
			readOnly:		true,
			completer:		false
		});
		
		widget.setTitle($MUI('Statistique des téléchargements'));
		widget.setIcon('statistics');
		widget.Table.Header().show();
		widget.Table.Header().select('tr')[0].removeChilds();
		widget.addHeader({
			Avatar:			{title:$MUI(' '), style:'width:30px'},
			Name:			{title:$MUI('Nom')},
			SevenDays:		{title:$MUI('7 derniers jours'), style:'width:120px; text-align:center;', sort:false},
			Total:			{title:$MUI('Total'), style:'width:120px; text-align:center;'}
		});
		
		widget.Table.Header().top(new Node('tr', [
			new Node('th'),
			new Node('th'),
			new Node('th', {colSpan:2}, new Node('div', {style:'text-align:center; padding:5px;background:#BFBFBF;'}, $MUI('Téléchargement')))
		]));
		
		widget.Body().css('height', '300px');
		widget.DropMenu.hide();
		var button = new SimpleButton({text:$MUI('Recharger'), icon:'reload'}).on('click', function(){
			widget.load();
		});
		
		widget.addGroupButton([button]);
				
		widget.Table.observe('click', function(evt, u){
			$S.users.open(u);
		}.bind(this));
			
		widget.load();
		
		return widget;
	}
};

new InteractiveCatalogUI();
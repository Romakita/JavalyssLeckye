/** section: BlogPress
 * class System.BlogPress.Post
 *
 * Cette classe gère l'édition des articles.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : blogpress_post.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
var Post = System.BlogPress.Post = System.BlogPress.posts = Class.createAjax({
/**
 * System.BlogPress.Post#Post_ID -> Number
 * Numéro d'identification du post.
 **/
	Post_ID: 			0,
/**
 * System.BlogPress.Post#Parent_ID -> Number
 * Numéro d'identification du post parent.
 **/
	Parent_ID:			0,
	Revision_ID:		0,
/**
 * System.BlogPress.Post#User_ID -> Number
 * Numéro d'identification de l'auteur du post.
 **/
	User_ID:			0,
/**
 * System.BlogPress.Post#Category -> String
 * Categorie du poste.
 **/
	Category:			'Non classé;',
/**
 * System.BlogPress.Post#Title -> String
 * Titre du post.
 **/
	Title:				'',
/**
 * System.BlogPress.Post#Title -> String
 * Titre du post pour le référencement.
 **/
	Title_Header:		'',
/**
 * System.BlogPress.Post#Content -> String
 * Contenu du post.
 **/
	Content:			'',
/**
 * System.BlogPress.Post#Summary -> String
 * Résumé du post.
 **/
	Summary:			'',
/**
 * System.BlogPress.Post#Keyword -> String
 * Contenu du post.
 **/
	Keyword:			'',
/**
 * System.BlogPress.Post#Date_Create -> DateTime
 * Date de création du post.
 **/
	Date_Create: 		'',
/**
 * System.BlogPress.Post#Date_Update -> DateTime
 * Date de modification du post.
 **/
	Date_Update:		'',
/**
 * System.BlogPress.Post#Name -> String
 * Nom didentification du post pour les liens méta (Utilisation des méthodes URL REWRITING)
 **/
	Name:				'',
/**
 * System.BlogPress.Post#Picture -> String
 **/
	Picture:				'',
/**
 * System.BlogPress.Post#Type -> String
 * Type du post. Page ou Post.
 **/
	Type:				'post',
/**
 * System.BlogPress.Post#Statut -> String
 * Etat de l'article.
 **/
	Statut:				'publish',
/**
 * System.BlogPress.Post#Comment_Statut -> String
 **/
	Comment_Statut: 	'open',
/**
 * System.BlogPress.Post#Template -> String
 **/
 	Template:			'',
/**
 * System.BlogPress.Post#Menu_Order -> Number
 **/
 	Menu_Order:			0,
/**
 * System.BlogPress.Post#Meta -> String
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
 * System.BlogPress.Post#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		$S.exec('blogpress.post.commit', {
			
			parameters: 'Post=' + this.toJSON(),
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
 * System.BlogPress.Post#commitWithoutRevision(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données sans créer de révision.
 **/	
	commitWithoutRevision: function(callback, error){
		
		$S.exec('blogpress.post.commit', {
			
			parameters: 'Post=' + this.toJSON() + '&revision=0',
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
	
	publish:function(callback, error){
		this.Statut = this.Statut.replace(/draft|archive/, '').trim();
		this.Statut = 'publish ' + this.Statut;
		
		$S.exec('blogpress.post.publish', {
			
			parameters: 'Post=' + this.toJSON(),
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
	
	archive:function(callback, error){
		this.Statut = this.Statut.replace(/publish|draft/, '').trim();
		this.Statut = 'archive ' + this.Statut;
		
		$S.exec('blogpress.post.archive', {
			
			parameters: 'Post=' + this.toJSON(),
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
 * System.BlogPress.Post#delete(callback) -> void
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

Object.extend(System.BlogPress.Post, {
/**
 * System.BlogPress.Page.initialize()
 **/
	initialize: function(){
				
		$S.observe('blogpress:post.submit.complete', function(){
			var win = $WR.getByName('blogpress');
			if(win){
				System.BlogPress.Post.load();
			}
		}.bind(this));
			
		$S.observe('blogpress:post.remove.complete', function(){//lorsque l'on supprime une entrée.
			var win = $WR.getByName('blogpress');
			if(win){
				System.BlogPress.Post.load();
			}
		}.bind(this));
	},
/**
 *
 **/	
	Get: function(id, callback){
		$S.exec('post.get', {
			
			parameters: 'Post_ID=' + id,
			onComplete: function(result){
				
				try{
					var obj = new Post(result.responseText.evalJSON());
				}catch(er){
					return;	
				}
				
				if(Object.isFunction(callback)) callback.call(obj, obj);
			}.bind(this)
			
		});
	},
/**
 * System.BlogPress.Post.open([post]) -> void
 *
 * Cette méthode ouvre le formulaire permettant d'éditer un article.
 **/
 	open: function(post){
				
		var win = $WR.unique('post.form', {
			autoclose:	true,
			action: function(){
				this.open(post);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return;
		//overide
		win.overideClose({
			submit:this.submit.bind(this), 
			change:this.checkChange.bind(this),
			close: function(){this.win = null}.bind(this)
		});
		
		//Vérification régulière de l'état de la fiche lorsqu'un click est intercepté
		win.body.on('click', function(){
			this.checkChange(win);
		}.bind(this));
		
		var self = this;
		//création de l'objet forms
		var forms = win.forms = win.createForm({
			update:	false,
			
			active:	function(){
				if(this.update) return;                                                                                                                                                                                         
				this.update = true;
				//desactivation de la synchro avec la bdd
				forms.submit.setTag("<b>!</b>");
				forms.submit.setText($MUI('Enregistrer') + '<span style="padding-right:10px"></span>');
				forms.submit.Tag.on('mouseover', function(){
					$S.Flag.setText('<p class="icon-documentinfo">' + $MUI('L\'article a subi une ou plusieurs modification(s)') + '.</p>').setType(FLAG.RT).color('grey').show(this, true);
				});
			},
			
			deactive: function(){
				this.update = false;
				
				win.loadRevisions();
				
				self.createPermalien(win);
				
				//forms.submit2.hide();
				forms.submit.setTag("");
				forms.submit.setText($MUI('Enregistrer'));
				forms.submit.Tag.stopObserving('mouseover');
			},
			
			onChange:function(key, o, n){
				$S.trace(key + ' => Avant : ' + o + ', Après : ' + n);
				this.active();
			}
		});
		
		//Filtre de sauvegarde
		
		forms.addFilters('Keyword', function(){
			return this.Keyword;
		});
		
		forms.addFilters('Statut', function(){
			return (this.Publish.Value() ? 'publish' : (win.getData().Statut.match(/publish|archive/) ? 'archive':'draft')) + (this.Private.Value() ? '' : ' private');
		});
		
		forms.addFilters('Comment_Statut', function(){
			var statut = '';
			statut += this.CommentOpen.Value() ? 'open' : 'close';
			statut += this.CommentTracking.Value() ? ' track' : '';
			statut += this.CommentNotable.Value() ? ' note' : '';
			
			return statut;
		});
		
		
		
		forms.addFilters('Category', function(){
			var options = this.Category.Table.getChecked();
			var category = '';
			
			if(this.Category.length == 0){
				category = 'Non classé;'
			}
		
			options.each(function(data){
				category +=  data.Name + ';'; 
			});
			
			return category;
		});
		//
		//
		//
		win.setData(win.post = post = new Post(post));
		
		var flag = 	win.createFlag().setType(FLAG.RIGHT);
		
		win.Resizable(false);
		win.ChromeSetting(true);
		win.createBox();
		
		try{
			win.setTheme('flat white');
			win.NoChrome(true);
		}catch(er){}
		
		win.setIcon('newsticker');
		win.createHandler($MUI('Chargement en cours'), true);
				
		if(post.Post_ID == 0){
			 post.Statut = 'draft';
		}
		
		forms.Statut = post.Statut;
		
		
		win.createTabControl({offset:22});
		
		win.TabControl.addPanel($MUI('Article'), System.BlogPress.posts.createPanelGeneral(win));
		win.TabControl.addPanel($MUI('Paramètres'), System.BlogPress.posts.createPanelParameters(win)).setIcon('advanced');
		forms.BtnRevisions = win.TabControl.addPanel($MUI('Historique'), this.createPanelRevisions(win)).setIcon('clock');
		//
		// 
		//
		forms.submit = new SimpleButton({text:$MUI('Enregistrer'), type:'submit'});
		forms.submit.on('click', function(){
			this.submit(win, true);
		}.bind(this));
		//
		// 
		//
		forms.close = new SimpleButton({ text:$MUI('Fermer')});
		forms.close.on('click', function(){win.close()});
		//
		//
		//
		forms.Publish = new ToggleButton({type:'mini'});
		forms.Publish.Value(post.Statut.match(/publish/));
		
		var publish = new Node('div', {className:'wrap-publish'}, [
						new Node('span', {className:'wrap-text'}, $MUI('Article publié')), 
						forms.Publish
					]);
				
		win.footer.appendChilds([publish, forms.submit, forms.close]);
		
		document.body.appendChild(win);	
		
		forms.Content.load();
		win.centralize();
		
		$S.fire('blogpress:post.open', win);
		
		var preview = new SimpleButton({text:$MUI('Prévisualiser'), icon:'page-preview'})
		
		preview.on('click', function(){
			var box = 	win.createBox();
			var o =		win.getData().clone();
			
			win.forms.save(o);
			
			box.wait();
			
			new Ajax.Request(System.URI_PATH + 'blogpress/preview', {
				type:'post',
				parameters:'Post=' + o.toJSON(),
				onComplete: function(result){
					
					try{
						box.hide();
						
						var win = new Window();
			
						win.IFrame = new Node('iframe', {style:'height:100%; width:100%; position:absolute'});
												
						win.setTitle(o.Title).setIcon('page-preview').appendChild(win.IFrame);
						document.body.appendChild(win);
						
						win.IFrame.contentWindow.document.open();
						win.IFrame.contentWindow.document.write(result.responseText);
						win.IFrame.contentWindow.document.close();
												
						win.Fullscreen(true);
						
					}catch(er){alert(er)}
				}
			});
			
		});
		
		win.TabControl.Header().appendChild(preview);
		
		return win;
	},
/**
 * PagesManager.createPanelGeneral(win) -> Panel
 **/	
	createPanelGeneral:function(win){
		var forms = win.createForm();
		var post = 	win.getData();
		
		var panel = new Panel({style:'padding:0'});
		panel.removeClassName('compact');
		
		panel.appendChilds([
			post.Type.match(/page/) ? System.BlogPress.Page.createWidgetInfo(win) : this.createWidgetInfo(win),
			this.createWidgetEditor(win),
		]);
				
		forms.Title.on('keyup', function(){
			if(post.Name == ''){
				forms.Name.value = this.value.sanitize('-').toLowerCase();
			}
		});
				
		return panel;
	},
/**
 * PagesManager.createWidgetEditor(win) -> Panel
 **/	
	createWidgetEditor:function(win, obj){
		var forms = 	win.createForm();
		var post = 		win.getData();
		
		var options = {
			width:			'700px', 
			height:			'600px', 
			media:			$FM().createHandler(),
			title:			post.Type.match(/page/) ? $MUI('Votre page') : $MUI('Votre article'),
			content_css: 	System.BlogPress.Template.GetCssEditor(),
						
			style_formats : [
				{title : 'Note', block : 'p', classes : 'note', exact : true},
				{title : 'Package', block : 'p', classes : 'download-file', exact : true}
			]
		};
		
		Object.extend(options, obj || {});
		
		var widget = 	new Widget();
		
		widget.Title(options.title);
		try{
			options.title = null;
			delete options.title;
		}catch(er){}
		
		widget.css('margin', '0').css('border', '0');
		widget.BorderRadius(false);
		
		widget.editor = forms.Content =		new Editor(options);
		
		forms.Content.on('join', function(evt, file){
			
			switch(file.extension){
				case 'jpg':
				case 'gif':
				case 'bmp':
				case 'png':
					evt.stop();
					
					this.openPictureBox(win, file);
			}
		}.bind(this));
		
		forms.Content.Value(post.Content);
		
		widget.appendChild(widget.editor);
		widget.editor.Header().addClassName('group-button');
		widget.Header(widget.editor.Header());
		
		System.fire('blogpress:create.editor', win, widget);
		
		return widget;
	},
/**
 * PagesManager.createWidgetInfo(win) -> Widget
 **/	
	createWidgetInfo: function(win){
		var forms = win.createForm();
		var post = 	win.getData();
		
		var widget = new Widget();
		widget.BorderRadius(false);
		widget.css('margin', '0').css('border', '0px').css('background', 'transparent');
		widget.Body().css('background', '#EFEFEF');
		//
		// Title
		//
		forms.Title = 	new Input({type:'text', className:"input-post", style:'width:500px;margin:5px;', value:post.Title});
		//
		// Name
		//
		forms.Name = 	new InputMagic({type:'text', value: this.sanitize(win)});
		forms.Name.css('width', '300px');
		forms.Name.on('keyup', function(evt){this.value = this.value.sanitize('-').toLowerCase();});
		forms.SpanCat = new Node('span');
		//
		//
		//
		forms.Picture = new FrameWorker({multiple:false, text:$MUI('Photo principale')});
		forms.Picture.addClassName('blogpress');
		forms.Picture.SimpleButton.setText('');
		forms.Picture.SimpleButton.setIcon('fileimport');
		
		forms.Picture.on('mouseover', function(){
			if(this.Value()){
				win.Flag.setText('<img src="' + this.Value() + '" style="max-width:200px" />').color('grey').setType(Flag.BOTTOM).show(this, true);
			}
		});
		
		forms.Picture.on('change', function(){
			forms.active();
		});
		
		forms.Picture.Value(post.Picture);
		
		this.createPermalien(win);
		//
		//
		//
		var table = new TableData();
		table.addHead($MUI('Permalien') + ' : ', {style:'color:#666; font-weight:bold;font-style:italic;'}).addCel(forms.SpanCat, {style:'color:#666;font-style:italic;'});
		table.addCel(forms.Name).addCel('/');
		
		widget.appendChild(forms.Title);
		widget.appendChild(forms.Picture);
		widget.appendChild(table);
		
		return widget;
	},
/**
 * System.BlogPress.Post.createPanelParameters(win) -> Panel
 **/
	createPanelParameters:function(win){
		var forms = win.createForm();
		var post = 	win.getData();
		
		var panel = new Panel({background:'advanced', style:'width:600px; height:600px'});
		
		var splite = new SpliteIcon($MUI('Paramètres de l\'article'));
		splite.setIcon('advanced-48');
		//
		//
		//
		forms.Private = new ToggleButton();
		forms.Private.Value(!post.Statut.match(/private/));
		//
		//
		//
		forms.Title_Header = new Input({type:'text', maxLength:180, value:post.Title_Header});
		forms.CommentOpen = 	new ToggleButton();
		forms.CommentOpen.Value(post.Comment_Statut.match(/open/));
		//
		//
		//
		forms.CommentTracking = new ToggleButton();
		forms.CommentTracking.Value(post.Comment_Statut.match(/track/));
		//
		//
		//
		forms.CommentNotable = 	new ToggleButton();
		forms.CommentNotable.Value(post.Comment_Statut.match(/note/));
		//
		//
		//
		forms.Menu_Order = new Input({type:'number', decimal:0, value:post.Menu_Order, empty:false});
		//
		//
		//
		forms.Category = new Select({
			parameters:'cmd=blogpress.category.list',
			multiple:true
		});
		//
		// Ajout de catégorie
		//
		var buttonAddCat = 			new SimpleButton({icon:'add-element', nofill:true});
		buttonAddCat.on('click', function(evt){
			System.BlogPress.Post.openAddCategory(evt, win);
		});
		
		forms.addFilters('Category', function(){
			return forms.Category.Text().replace(/ /g, '');	
		});
		
		forms.Category.load();
		forms.Category.on('complete', function(){
			forms.Category.Value(post.Category.split(';'));
		});		
		
		var table1 = new TableData();
		table1.addHead($MUI('Titre référencement'), {style:'width:180px'}).addField(forms.Title_Header).addRow();
		table1.addHead($MUI('Ordre de tri'), {style:'width:180px'}).addField(forms.Menu_Order).addRow();
		table1.addHead($MUI('Catégories')).addField(forms.Category).addCel(buttonAddCat).addRow();
		
		var table = new TableData();
		table.addHead($MUI('Les visiteurs peuvent poster des commentaires ?'), {style:'width:350px'}).addCel(forms.CommentOpen, {style:'height:30px'}).addRow();
		table.addHead($MUI('Les visiteurs peuvent suivre la discussion par e-mail ?')).addCel(forms.CommentTracking, {style:'height:30px'}).addRow();
		table.addHead($MUI('Les visiteurs peuvent noter l\'article ?')).addCel(forms.CommentNotable, {style:'height:30px'}).addRow();
		table.addHead($MUI('Les visiteurs anonyme peuvent visualiser l\'article ?')).addCel(forms.Private, {style:'height:30px'}).addRow();
				
		var widgetSummary = this.createWidgetSummary(win);
		widgetSummary.css('margin', '5px 0px');
		widgetSummary.Body().css('height', '100px');
				
		panel.appendChilds([
			splite,
			table1,
			table,
			this.createWidgetKeyword(win),
			widgetSummary
		]);
		
		forms.CommentOpen.on('change', function(){
			if(this.Value()){
				table.getRow(1).show();
				table.getRow(2).show();
			}else{
				table.getRow(1).hide();
				table.getRow(2).hide();
			}
		});
		
		if(!forms.CommentOpen.Value()){
			table.getRow(1).hide();
			table.getRow(2).hide();
		}
				
		return panel;
	},
/**
 * System.BlogPress.Post.createWidgetSummary(win) -> Widget
 **/	
	createWidgetSummary: function(win){
		var forms = win.createForm();
		var post = 	win.getData();
		
		var widget = new WidgetTextArea();
		widget.setTitle('Résumé / Description de la page');
		
		widget.Value(post.Summary);
		forms.Summary = widget;
		
		return widget;
	},
/**
 * System.BlogPress.openAddCategory() -> void
 **/	
	openAddCategory:function(evt, win){
		try{
			
		var bubble = win.createBubble();
		//
		//
		//
		var buttonAdd = 	new SimpleButton({type:'submit', text:$MUI('Ajouter')});
		buttonAdd.css('margin-right', '10px');
		//
		//
		//
		var buttonClose =	new SimpleButton({icon:'close-element', noFill:true, nofill:true});
		buttonClose.setStyle('position:absolute;top:5px; right:5px; margin:0; color:#333');
		
		buttonClose.on('click', function(){
			bubble.hide();
		});
		//
		//
		//
		var input =			new Input({type:'text'});
		input.Large(true);
		input.css('width', '99%').css('margin-bottom', '15px');
		
		var html = new HtmlNode();
		
		html.appendChilds([
			new Node('h4', {style:'margin-top:0;margin-bottom:20px'}, $MUI('Saisissez une nouvelle catégorie')), 
			input,
			buttonAdd,
			buttonClose
		]);
		
		buttonAdd.on('click', function(){
			
			if(input.Value() == ''){
				bubble.hide();
				return;	
			}
			
			var cat = new System.BlogPress.Category();
			cat.Name = input.Value();
			cat.commit();
			
			bubble.hide();
			
			win.forms.Category.load();
		});
		
		bubble.show(evt, html);
		input.focus();
		
		}catch(er){$S.trace(er)}
	},
/**
 * PagesManager.createWidgetKeyword(win) -> Widget
 **/
	createWidgetKeyword:function(win){
		var forms = win.createForm();
		var post = 	win.getData();
		
		var self =	this;		
		
		var widget = new Widget();
		widget.Title($MUI('Mots clefs'));
		widget.Body().setStyle('height:100px');
		widget.css('margin', '0');
		//
		forms.Keyword = post.Keyword;
		//
		// Table
		//
		var div = new Node('div');
		div.setStyle('margin:auto');
		widget.appendChild(div);
		
		forms.Keywords = div;
		
		this.createKeywords(win, post);
		
		function submit(){
			if(InputAdd.Text() == '') return;
			
			var array = forms.Keyword.split(';');
			
			if(array.indexOf(InputAdd.Text()) != -1){
				InputAdd.Text('');
				return; 
			}
			
			if(InputAdd.Text().match(/,/gi)){
				var text = InputAdd.Text().split(',');
				
				for(var i= 0; i < text.length; i++){
					
					var node = self.createNodeKeyword(text[i].trim());
					node.value = text[i].trim();
					
					forms.Keyword += text[i].trim() + ';';
					
					div.appendChild(node);
				}
				
			}else{
				var node = self.createNodeKeyword(InputAdd.Text());
				node.value = InputAdd.value;
				div.appendChild(node);
				
				forms.Keyword += InputAdd.Text().trim() + ';';
			}
			
			node.on('click', function(){
				var keys = forms.Keyword.split(';');
				var newKeys = [];
				
				for(var i = 0; i < keys.length; i++){
					if(keys[i] == this.value) continue;
					newKeys.push(keys[i]);
				}
				
				forms.Keyword = newKeys.join(';');
				
				this.parentNode.removeChild(this);
			});
			
			InputAdd.Text('');
		};
		//
		//
		//
		var InputAdd = new InputButton({icon:'add'});
		InputAdd.Input.keyupenter(submit);
		InputAdd.SimpleButton.on('click', submit);
		widget.addGroupButton([InputAdd]);				
				
		InputAdd.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici un mot clef à ajouter à votre article') + '</p>').color('grey').setType(FLAG.LEFT).show(this, true);
		});
		
		return widget;
	},
/**
 * PagesManager.createKeywords(win, post) -> void
 **/
	createKeywords: function(win, post){
		var forms = win.createForm();
		
		var options = post.Keyword.split(';');
		
		forms.Keywords.removeChilds();
		
		for(var i = 0; i < options.length; i++){
			if(options[i] == '') continue;
			
			var node = this.createNodeKeyword(options[i]);
			node.value = options[i];
			
			forms.Keywords.appendChild(node);
			
			node.on('click', function(){
				var keys = 		forms.Keyword.split(';');
				var newKeys = 	[];
				
				for(var i = 0; i < keys.length; i++){
					if(keys[i] == this.value) continue;
					newKeys.push(keys[i]);
				}
				
				forms.Keyword = newKeys.join(';');
				this.parentNode.removeChild(this);
			});
		};
	},
/**
 * System.BlogPress.Post.createPermalien(win, bool) -> void
 **/
	createPermalien: function(win, bool){
		var forms = win.createForm();
		var post = 	win.getData();
		
		if(post.Category == '') return;
		
		if(bool){
			var cat = [];
			for(var i = 0; i < forms.Category.length; i++){
				if(forms.Category[i].checked){
					cat.push(forms.Category[i].value);
				}
			}	
		}else{
		 	var cat = post.Category.split(';');
		}
				
		if(cat.length != 0){
			if(cat[0] != ''){
				cat = cat[0].sanitize('-').toLowerCase() + '/';	
			}else{
				cat = cat[1].sanitize('-').toLowerCase() + '/';	
			}
		}else{
			cat = ''	
		}
		
		if($S.Meta('BP_REDIR_INDEX') == 1){
			forms.SpanCat.innerHTML = $S.URI_PATH + ( cat ).replace('//', '/');
		}else{
			forms.SpanCat.innerHTML = 'http://host.fr' + ('/' + cat ).replace('//', '/');
		}
	},
/**
 * System.BlogPress.Post.createNodeKeyword(name) -> Element
 **/	
	createNodeKeyword: function(name){
		
		var node = 				new Node('div', {className:'ticket-blogpress'});
		node.SimpleButton =		new SimpleButton({type:'mini', icon:'cancel-14'});
		node.body =				new Node('span', name);
		
		node.appendChild(node.body);
		node.appendChild(node.SimpleButton);
		
		return node;
	},
/**
 * System.BlogPress.Post.createPanelRevisions(win) -> Element
 **/
 	createPanelRevisions: function(win){
		var forms = win.createForm();
		var post = 	win.getData();
		
		//
		//
		//
		var panel = new Panel({style:'height:450px;padding:0;width:600px'});
		//
		// ComplexTable
		//
		
		var widget = new WidgetTable({
			link: 		$S.link,
			parameters: 'cmd=blogpress.post.list&options='+ Object.EncodeJSON({Parent_ID: post.Parent_ID == 0 ? post.Post_ID : post.Parent_ID, Type:'revision'}),
			readOnly:	true,
			count:		false,
			completer:	false,
			range1:		10,
			range2:		20,
			range3:		30
		});
		
		widget.setTitle($MUI('Historique des modifications'));
		widget.setIcon('clock');
		
		//widget.addGroupButton([widget.BtnPrev,widget.BtnNext]);
		//widget.Body().setStyle('height:300px');
		
		widget.addHeader({
			Action: 		{title:' ', type:'action', width:30},
			Avatar:			{title:$MUI(' '), style:'width:30px'},
			Author: 		{title:$MUI('Utilisateur')},
			Date_Update:	{title:$MUI('Date modification'), width:230, type:'date', format:$MUI('\\le') + ' l d F Y ' + $MUI('à') + ' h\\hi'}
		});
		
		widget.addFilters('Action', function(e, cel, data){
			
			e.remove.hide();
			
			if(data.Post_ID == post.Revision_ID){
				e.open.hide();
			}
			
			return e;
		});
		
		widget.addFilters(['Avatar'], function(e, cel, data){
			
			var deficon = 	data.Avatar == "" ? ((data.Civility == 'Mme.' || data.Civility == 'Mlle.') ? 'woman-48' : 'men-48') : data.Avatar.replace('127.0.0.1', window.location.host);
			var button = 	new AppButton({icon: deficon, type:'mini'});
			button.addClassName('user');
							
			return button;
		}.bind(this));
		
		widget.addFilters('Author', function(e, cel, data){
			
			//
			// HTML
			//
			var html = new HtmlNode();
			html.addClassName('html-node user-list-node');
			html.setStyle('padding:4px');
			
			html.append('<h1><span class="user-lastname">' + data.FirstName + '</span> <span class="user-name">' + data.AuthorName + '</span><p style="font-size:11px">Alias ' + data.Login + '</p></h1>');
						
			return html;
			
		//	return new Node('p',{style:'line-height:20px'}, $MUI('Par') + ' ' + e);
		});
						
		widget.on('open', function(evt, data){
			//win.forceClose();
			//
			post.Revision_ID = 	data.Post_ID;
			forms.Title.Value(data.Title);
			forms.Content.Value(data.Content);
			
			this.createPermalien(win, data);
			this.createKeywords(win, data);
			
			forms.active();
			
			widget.load();
					
		}.bind(this));
				
		widget.on('complete', function(obj){
			if(obj.length > 0) forms.BtnRevisions.setText($MUI('Révisions') + ' (' + obj.length + ')' );
		});
				
		//panel.appendChild(splite);
		panel.appendChild(widget);
		
		widget.load();
				
		win.loadRevisions = function(){
			widget.setParameters('cmd=blogpress.post.list&options='+ Object.EncodeJSON({
				Parent_ID: post.Parent_ID == 0 ? post.Post_ID : post.Parent_ID, 
				Type:'revision'
			}));
			widget.load()
		};
		
		return panel;
	},
/**
 * System.BlogPress.Post.openPictureBox(win) -> void
 **/
	openPictureBox: function(win, file){
		var forms =		win.createForm();
		var editor = 	forms.Content;
		//
		// 
		//
		var forms = {};
		
		forms.HTML = new HtmlNode();
		forms.HTML.addClassName('html-node');
		
		forms.HTML.append('');
		forms.HTML.append('<table><tr><td><img src="' + file.uri + '" width=100 /></td>' + 
			'<td><h1 style="margin-top:0px">Ajout d\'une image</h1>'+
			'<p><strong>Nom du fichier : </strong>' + file.name + '</p>' +
			'<p><strong>Type de fichier : </strong> image/' + file.extension + '</p>' +
			'</td></tr></table>'
		);
		
		//
		//
		//
		forms.Titre = 			new Node('input', {type:'text', style:'width:360px'});
		//
		//
		//
		forms.Description = 	new Node('textarea', {style:'width:354px; height:100px'});
		//
		//
		//
		forms.Cible = 			new Node('input', {type:'text', style:'width:360px;', value:file.uri});
		//
		//
		//
		var radio = [
			new Node('input', {type:'radio', name:'Align', value:'none', checked:true}),
			new Node('input', {type:'radio', name:'Align', value:'left'}),
			new Node('input', {type:'radio', name:'Align', value:'center'}),
			new Node('input', {type:'radio', name:'Align', value:'right'})
		];
		
		var tableAlign = new TableData();
		
		tableAlign.addCel(radio[0]).addCel($MUI('Aucun '), {className:'icon-align-none align-picture'});
		tableAlign.addCel(radio[1]).addCel($MUI('Gauche'), {className:'icon-align-left align-picture'});
		tableAlign.addCel(radio[2]).addCel($MUI('Centre'), {className:'icon-align-center align-picture'});
		tableAlign.addCel(radio[3]).addCel($MUI('Droite'), {className:'icon-align-right align-picture'});
		
		//
		//
		//
		
		var table = new TableData();
		
		table.addHead('<strong>' + $MUI('Titre') + ' : </strong>', {width:100}).addField(forms.Titre).addRow();
		table.addHead('<strong>' +$MUI('Description ') + ' : </strong>', {width:100, style:'vertical-align:top'}).addField(forms.Description).addRow();
		table.addHead('<strong>' +$MUI('Cible du lien') + ' : </strong>', {width:100}).addField(forms.Cible).addRow();
		table.addHead('<strong>' +$MUI('Alignement') + ' : </strong>', {width:100}).addField(tableAlign);
		
		var box = win.createBox();
		box.setTitle($MUI('Gestion des images')).setIcon('picture');
		box.a(forms.HTML).a(table).setType().show();
		box.getBtnSubmit().setText('Ajouter dans l\'article');
		
		box.submit(function(){
			
			var content = 	new Node('div');
			
			if(forms.Description.value != ''){
				var myElement = 		new Node('div', {className:'picture-element' + (forms.Titre.value == '' ? '' : ' box-flag type-top'), title:forms.Titre.value, style:'display:inline-block'});
				
				myElement.a =	 		new Node('a', {href:forms.Cible.value});
				myElement.Picture =	 	new Node('img', {src:file.uri, alt:forms.Titre.value});
				myElement.Text =		new Node('div', {className:'picture-text'}, forms.Description.value);
				
				myElement.a.appendChild(myElement.Picture);
				myElement.appendChild(myElement.a);
				myElement.appendChild(myElement.Text);
				
			}else{
				if(forms.Cible.value != ''){
					var myElement = 		new Node('a', {href:forms.Cible.value, className: (forms.Titre.value == '' ? '' : ' box-flag type-top'), title:forms.Titre.value});
					myElement.Picture =	 	new Node('img', {src:file.uri, alt:forms.Titre.value});
					myElement.appendChild(myElement.Picture);
				}else{
					var myElement = 	new Node('img', {href:forms.Cible.value, className: (forms.Titre.value == '' ? '' : ' box-flag type-top'), title:forms.Titre.value, alt:forms.Titre.value});
				}
			}
			
			//alert(document.getElementsByName('Align').value);
			
			content.appendChild(myElement);
			
			var options = document.getElementsByName('Align');
			
			if(!options[0].checked){
				for(var i = 1; i < options.length; i++){
					if(options[i].checked) myElement.addClassName('align' + options[i].value);
				}
			}
			
			win.createForm().Content.insert(content.innerHTML);

		});
	},
/**
 * System.BlogPress.Post.checkChange(win) -> void
 * - win (Window): Fenêtre du formulaire.
 * 
 * Cette méthode vérifie si le formulaire a été modifié par l'utilisateur.
 **/
	checkChange: function(win){
		if(win.readOnly) return false;
		if(win.forms.update) return true;
		
		return win.forms.checkChange(win.getData());
	},
/**
 * System.BlogPress.Post.sanitize() -> String
 **/
	sanitize: function(win){
		var post = win.getData();
		var forms = win.createForm();
		
		if(post.Name == ''){
			return forms.Title.value.sanitize('-');
		}
		
		return post.Name;
	},
/**
 * System.BlogPress.Post.submit(win [, noclose]) -> void
 * - win (Window): Fenêtre du formulaire.
 * - noclose (Boolean): Si la valeur est vrai la fermeture sera interompue.
 *
 * Enregistre les modifications du formulaire.
 **/
 	submit:function(win){
		
		var forms = win.createForm();
		
		try{
		
			win.Flag.hide();
			
			if(forms.Title.value == '') {
				win.Flag.setText($MUI('Le titre est obligatoire'));
				win.Flag.show(forms.Title);
				return true;
			}
			
			if(forms.Name.Value() == ''){
				forms.Name.Value(forms.Title.Value().sanitize('-').toLowerCase());	
			}
			
		}catch(er){$S.trace(er)}
		
		var evt = new StopEvent(win);
		$S.fire('blogpress:post.submit', evt);
		if(evt.stopped) return;
		
		//var newObj =		post.Post_ID == 0;
		
		var post = forms.save(win.getData());
		
		if(post.Type == ''){
			post.Type =			'post';
		}
		
		//if(!this.checkChange(win)) return;
		
		win.ActiveProgress();
		post.commit(function(responseText){
									
			$S.fire('blogpress:post.submit.complete', post);
			
			forms.deactive();
			
			//Confirmation d'enregistrement
			var splite = new SpliteIcon($MUI('L\'article a été correctement sauvegardé'), $MUI('Article') + ' : ' + post.Title);
			splite.setIcon('filesave-ok-48');
				
			win.AlertBox.ti($MUI('Confirmation') + '...').a(splite).ty('NONE').Timer(3).show();
						
		}.bind(this));
	},
/**
 * 
 **/	
	formToObject:function(form){
		var object = {};
		
		object.Title = 			form.Title.value;
		object.Title_Header = 	form.Title_Header.Value();
		object.Picture =  		form.Picture.Value();
		object.Name =  			form.Name.Value();
		object.Content = 		form.Content.Value();
		object.Summary = 		form.Summary.Value();
		object.Menu_Order = 	form.Menu_Order.Value();
		object.Keyword =		form.Keyword;
		object.Statut =			form.Statut + (form.Private.Value() ? '' : ' private');
		
		if(object.Type == ''){
			object.Type =			'post';
		}
		
		object.Category = 		'';
		
		var options = form.Category.Table.getChecked();
		
		if(form.Category.length == 0){
			object.Category = 'Non classé;'
		}
		
		options.each(function(data){
			object.Category +=  data.Name + ';'; 
		});
		
		object.Comment_Statut = '';
		//gestion des statuts des commentaires
		object.Comment_Statut += form.CommentOpen.Value() ? 'open' : 'close';
		object.Comment_Statut += form.CommentTracking.Value() ? ' track' : '';
		object.Comment_Statut += form.CommentNotable.Value() ? ' note' : '';
		
		return object;
	},
/**
 * System.BlogPress.Post.listing(win) -> void
 **/	
	listing:function(){
		
		var win =	$WR.getByName('blogpress');
		var panel = win.BlogPress;
		
		System.BlogPress.setCurrent('post');
		
		if(!this.NavBar){
			
			this.NavBar = new NavBar( {
				range1:50,
				range2:100,
				range3:300
			});
			
			this.NavBar.on('change', function(){
				this.load()
			}.bind(this));
						
			this.NavBar.PrintAll = 		new Node('span', {className:'action view all', value:'all'}, $MUI('Tout'));
			this.NavBar.PrintDraft = 	new Node('span', {className:'action view draft', value:'draft'}, $MUI('Brouillon')),	
			this.NavBar.PrintPublish = 	new Node('span', {className:'action view publish selected', value:'publish'}, $MUI('Publié'));
			this.NavBar.PrintArchive = 	new Node('span', {className:'action view archive', value:'archive'}, $MUI('Archive'));
			
			this.NavBar.SortByName = 		new Node('span', {className:'action sort icon asc name selected', value:'Title'}, $MUI('Titre'));
						
			this.NavBar.appendChilds([
				this.NavBar.PrintPublish,
				this.NavBar.PrintDraft,
				this.NavBar.PrintArchive,
				//this.NavBar.PrintAll,
				this.NavBar.SortByName
			]);
			
			this.NavBar.PrintAll.on('click', function(){
				this.NavBar.select('span.view.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintAll.addClassName('selected');
				
				this.load();
			}.bind(this));
			
			this.NavBar.PrintDraft.on('click', function(){
				this.NavBar.select('span.view.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintDraft.addClassName('selected');
				
				this.load();
			}.bind(this));
			
			this.NavBar.PrintArchive.on('click', function(){
				this.NavBar.select('span.view.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintArchive.addClassName('selected');
				
				this.load();
			}.bind(this));
			
			
			this.NavBar.PrintPublish.on('click', function(){
				this.NavBar.select('span.view.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintPublish.addClassName('selected');
				
				this.load();
			}.bind(this));
			
			
			this.NavBar.SortByName.on('click', function(){
				this.NavBar.select('span.sort.selected').invoke('removeClassName', 'selected');
				this.NavBar.SortByName.addClassName('selected');
				
				if(this.NavBar.SortByName.hasClassName('desc')){
					this.NavBar.SortByName.removeClassName('desc');
					this.NavBar.SortByName.addClassName('asc');
				}else{
					this.NavBar.SortByName.removeClassName('asc');
					this.NavBar.SortByName.addClassName('desc');	
				}
				
				this.load();
			}.bind(this));
		}
				
		panel.PanelBody.Header().appendChilds([
			this.NavBar
		]);
		
		this.load();
		
	},
/**
 * System.BlogPress.Post.listing(win) -> void
 **/	
	load:function(win){
		var win =	$WR.getByName('blogpress');
		var panel = win.BlogPress;
		panel.Progress.show();
					
		$S.exec('blogpress.post.list', {
			parameters: this.getParameters(),
			
			onComplete:function(result){
				
				try{
					var obj;
					var array = $A(obj = result.responseText.evalJSON());
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				panel.clearBody();
								
				//this.NavBar.PrintAll.innerHTML = 		$MUI('Tout') + '(' + obj.NbAll + ')';
				this.NavBar.PrintPublish.innerHTML = 	$MUI('Publié') + '(' + obj.NbPublish + ')';
				this.NavBar.PrintDraft.innerHTML = 		$MUI('Brouillon') + '(' + obj.NbDraft + ')';
				this.NavBar.PrintArchive.innerHTML = 	$MUI('Archive') + '(' + obj.NbArchive + ')';
				
				this.NavBar.setMaxLength(obj.maxLength);
				try{
					if(array.length == 0){
						panel.PanelBody.Body().appendChild(new Node('h2', {className:'notfound'}, $MUI('Aucun article n\'est enregistré en base de données ou ne correspond à votre recherche')));
					}else{
						
						var letter = '';
						
						for(var i = 0; i < array.length;  i++){
							if(array[i].Title.slice(0,1).toUpperCase() != letter){
								letter = array[i].Title.slice(0,1).toUpperCase() ;
								panel.PanelBody.Body().appendChild(new Node('h2', {className:'letter-group'}, letter)); 
							}
							
							var button =	new System.BlogPress.Post.Button({
								icon:		array[i].Picture,
								comment:	array[i].NbComment,
								text:		array[i].Title,
								subTitle:	$MUI('Publié par') + ' ' + array[i].Author
							});
							//
							//
							//
							button.Actions = new SimpleMenu({nofill:true, icon:'1down-mini'});
							button.Actions.addClassName('btn-remove');
							button.appendChild(button.Actions);
								
							button.Actions.BtnPublish = new LineElement({text:$MUI('Publier')});
							button.Actions.BtnArchive = new LineElement({text:$MUI('Archiver')});
							button.Actions.BtnRemove = new LineElement({text:$MUI('Supprimer')});
							button.BtnRemove.hide();
														
							if(array[i].Statut.match('publish')){
								button.Actions.BtnPublish.hide();
							}
							
							if(array[i].Statut.match('archive')){
								button.Actions.BtnArchive.hide();								
							}
							
							button.Actions.appendChild(button.Actions.BtnPublish);
							button.Actions.appendChild(button.Actions.BtnArchive);
							button.Actions.appendChild(button.Actions.BtnRemove);
							
							
							if(array[i].Comment_Statut.match(/open/)){
								button.setComments(array[i].NbComments);
								
								if(array[i].Comment_Statut.match(/note/)){	
									button.addClassName('note');
									button.setRating(array[i].Note);
								}
							}else{
								button.commentClose(true);
							}
							
							if(array[i].Statut.match('draft')){
								button.setTag($MUI('Brouillon'));
							}
							
							button.addClassName('hide');
							button.data = array[i];
							panel.PanelBody.Body().appendChild(button);
							
							button.Actions.BtnPublish.on('click', function(evt){
								evt.stop();
								
								panel.Progress.show();
								
								new System.BlogPress.Post(this.data).publish(function(){
									System.BlogPress.Post.listing();
								});
								
							}.bind(button));
							
							button.Actions.BtnArchive.on('click', function(evt){
								evt.stop();
								
								panel.Progress.show();
								
								new System.BlogPress.Post(this.data).archive(function(){
									System.BlogPress.Post.listing();
								});
								
							}.bind(button));
							
							button.Actions.BtnRemove.on('click', function(evt){
								evt.stop();
								System.BlogPress.Post.remove(win, this.data);
							}.bind(button));
							
							button.on('click', function(){
								System.BlogPress.Post.open(this.data);	
							});
						}	
						
						new Timer(function(){
							var b = panel.PanelBody.select('.market-button.hide')[0];
							if(b){
							
								b.removeClassName('hide');
								b.addClassName('show');
							}
						}, 0.1, array.length).start();
					}
					
					panel.PanelBody.refresh();
								
				}catch(er){$S.trace(er)}
				
				if(panel.ProgressBar.hasClassName('splashscreen')){
					new Timer(function(){
						panel.ProgressBar.hide();
						panel.ProgressBar.removeClassName('splashscreen');
					}, 0.5, 1).start();
				}else{
					panel.ProgressBar.hide();
				}
			}.bind(this)
		});
	},
/**
 *
 **/	
	getParameters:function(){
		
		var clauses = 	this.NavBar.getClauses();
		var sort = 		this.NavBar.select('span.sort.selected')[0];
		var field = 	sort.value;
				
		if(sort.hasClassName('desc')){	
			sort = 'desc';
		}else{
			sort = 'asc';
		}
		
		clauses.order = field + ' ' + sort;
		
		//clauses.where = $WR.getByName('crm').Panel.InputCompleter.Text();
		
		var options = {
			draft:		true, 
			Type:		'post', 
			statistics:	true
		};
		
		if(this.NavBar.select('span.view.selected')[0].value != 'all'){
			options.Statut = this.NavBar.select('span.view.selected')[0].value;
		}
			
		return 'options=' + Object.EncodeJSON(options) + '&clauses=' + clauses.toJSON();
	},
/**
 * System.BlogPress.Post.remove(post) -> void
 * - evenement (Post): Instance d'un événement.
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(win, post){
		post = new System.BlogPress.Post(post);
		//
		// Splite
		//
		var splite = 			new SpliteIcon($MUI('Voulez-vous vraiment supprimer cet article') + ' ? ', $MUI('Article') + ' : ' + post.Title);
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = win.createBox();
		
		box.setTitle($MUI('Suppression de l\'article')).a(splite).setIcon('delete').setType().show();
				
		$S.fire('blogpress:post.remove.open', box);
				
		box.submit({
			text:	$MUI('Supprimer l\'article'),
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('blogpress:post.remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				post.remove(function(){
					box.hide();
						
					$S.fire('blogpress:post.remove.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('L\'article a bien été supprimé'), $MUI('Article') + ' : ' + post.Title);
					splite.getChildLeft().setStyle('background-position:center');
					splite.setIcon('valid-48');
					
					
					box.setTitle($MUI('Confirmation')).setContent(splite).setType('CLOSE').Timer(5).show();
					box.getBtnReset().setIcon('cancel');
					box.setIcon('documentinfo');
					
				}.bind(this));
				
			}.bind(this)
		});
	}
});

System.BlogPress.Post.initialize();

/** section: Core
 * class System.MyStore.Product.Button
 **/
System.BlogPress.Post.Button = Class.from(AppButton);
System.BlogPress.Post.Button.prototype = {
	
	className:'wobject market-button post-button overable',
/**
 * new System.MyStore.Product.Button([options])
 **/	
	initialize:function(obj){
		
		var options = {
			comment: 	0,
			note:		0,
			nbNote:		0,
			subTitle:	'',
			overable:	true,
			tag:		false
		};
		
		Object.extend(options, obj || {});
		
		//
		//
		//
		this.SubTitle = new Node('span', {className:'wrap-subtitle'});
		this.SubTitle.innerHTML = options.subTitle;
		//
		//
		//
		this.Message = 	new Node('span', {className:'wrap-message'});
		this.Message.innerHTML = options.comment;	
		//
		//
		//
		this.Note = 	new StarsRating();
		//
		//
		//
		this.BtnRemove = new SimpleButton({nofill:true, icon:'remove-element-2'});
		this.BtnRemove.addClassName('btn-remove');
				
		this.appendChild(this.SubTitle);
		this.appendChild(this.Note);
		this.appendChild(this.Message);
		this.appendChild(this.BtnRemove);
		
		if(options.tag){
			this.setTag(options.tag);
		}
		
		this.setRating(options.note, options.nbNote);
		this.Overable(options.overable);
		
		if(options.icon == ''){
			this.addClassName('no-icon');	
		}
	},
/**
 * System.MyStore.Product.Button#setRating(note, nbNote) -> System.MyStore.Product.Button
 **/	
	setRating:function(note, nbNote){
		this.Note.setRating(note, nbNote);
	},
/**
 * System.MyStore.Product.Button#setNbComment(price) -> System.MyStore.Product.Button
 **/	
	setComments:function(text){
		this.Message.innerHTML = text;
		return this;
	},
	
	commentClose:function(bool){
		if(bool){
			this.Message.hide();
			this.Note.hide();	
		}else{
			this.Message.show();
			this.Note.show();
		}
	},
/**
 * System.MyStore.Product.Button#setSubTitle(price) -> System.MyStore.Product.Button
 **/	
	setSubTitle:function(title){
		this.SubTitle.innerHTML = $MUI(title);
		return this;
	},
	
	Overable:function(bool){
		this.removeClassName('overable');
		
		if(bool){
			this.addClassName('overable');	
		}
	}
};



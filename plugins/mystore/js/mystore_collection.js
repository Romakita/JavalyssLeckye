/** section: MyStore
 * class System.MyStore.Collection
 *
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : mystore_collection.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.MyStore.Collection = {
/** 
 * System.MyStore.Collection.open() -> void
 * Cette méthode ouvre le panneau de gestion des produits.
 **/	
	open:function(win, collection){
						
		try{
		
		var panel = win.MyStore;
		
		win.setData(collection = new System.BlogPress.Post(collection));
		var forms = win.createForm();
		//
		// Réinitialisation du contenu
		//
		panel.clearSwipAll();
		panel.Open(true, 650);
		//
		//
		//	
		panel.PanelSwip.Body().appendChild(new Node('h1', $MUI('Gestion de la collection')));
			
		panel.PanelSwip.addPanel($MUI('Info'), this.createPanelInfos(win));
		panel.PanelSwip.addPanel($MUI('Référencement'), this.createPanelReferencement(win));
		
		var submit = new SimpleButton({text:$MUI('Enregistrer')});
		
		submit.on('click', function(){
			
			System.MyStore.Collection.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('mystore.collection:open', win);
		
		win.forms.Content.load();
		
		return;
		
		}catch(er){$S.trace(er)}
		
	},
/**
 *
 **/	
	createPanelInfos:function(win){
		//var panel = win.MyStore;	
		var collection = 	win.getData();
		var forms = 		win.createForm();
		var self =			this;
		var panel = 		new Panel();
		//panel.createWidgets({number:2});
		//
		// Titre
		//
		var button = new System.MyStore.Collection.Picture({
			icon:	collection.Picture,
			text:	collection.Title	
		});
		
		button.css('width', '98%');
		forms.Picture = button.Picture2;
		forms.Title =	button.Title;
				
		panel.appendChild(button);
		
		var widget = System.BlogPress.Post.createWidgetEditor(win, {width:'613px', height:'460px', title:$MUI('Description')})
		panel.appendChild(widget);
		
		widget.style.margin = null;
		widget.style.border = null;
		
		return panel;
	},
/**
 *
 **/	
	createPanelReferencement:function(win){
		var collection = 	win.getData();
		var forms = 		win.createForm();
		var self =			this;
		var panel = 		new Panel();
		//
		// Titre de référencement
		//
		forms.Title_Header = new Input({type:'text', value:collection.Title_Header, maxLength:180});
		//
		// Keyword
		//
		forms.Keyword = 	new Input({type:'text', value:collection.Keyword});
		//
		// Résumé pour le référencement / réseaux sociaux
		//
		forms.Summary = 	new TextArea({type:'text', value:collection.Summary, maxLength:500});
		//
		// Nom du lien de la page produit
		//
		forms.Name =		new Input({type:'text', value:collection.Name});
		forms.Name.on('keyup', function(evt){this.value = this.value.sanitize('-').toLowerCase();});
		//
		//
		//
		panel.appendChild(new Node('h4', $MUI('Référencement')));
		
		var table = 		new TableData();
		
		table.addHead($MUI('Titre de référencement')).addCel(win.forms.Title_Header).addRow();
		table.addHead($MUI('Lien de référencement') + ' : ').addCel(' ', {style:'font-size: 10px; font-weight: bold;'}).addRow();
		table.addHead(' ').addCel(forms.Name).addRow();
		
		table.addHead($MUI('Mot clef')).addCel(win.forms.Keyword).addRow();
		table.addHead($MUI('Description')).addCel(win.forms.Summary).addRow();
		
		forms.Host = table.getCel(1, 1);
				
		panel.appendChild(table);
		
		System.BlogPress.Page.createPermalien(win, collection);
		
		return panel;
	},
/**
 * System.MyStore.Collection.submit(win) -> void
 **/	
	submit:function(win){
		var forms = win.createForm();
				
		win.Flag.hide();
			
		if(forms.Title.Value() == '') {
			win.Flag.setText($MUI('Veuillez saisir un titre pour votre produit'));
			win.Flag.show(forms.Title);
			return true;
		}
		
		if(forms.Name.Value() == ''){
			forms.Name.Value(forms.Title.Value().sanitize('-').toLowerCase());	
		}
		
		var collection =				win.forms.save(win.getData());
		collection.Type = 				'page-mystore collection';
		collection.Template = 			'page-mystore-collection.php';
		collection.Comment_Statut = 	'close';
				
		$S.fire('mystore.collection:open.submit', win);
		
		win.MyStore.Progress.show();
		
		collection.commitWithoutRevision(function(){
			win.setData(this);
			System.MyStore.Collection.load(win);
		});
		
		return this;
	},
/**
 *
 **/	
	listing:function(){
		
		var win = $WR.getByName('mystore');
		var panel = win.MyStore;
		
		System.MyStore.setCurrent('collection');
		
		this.load();
		
	},
/**
 *
 **/	
	load:function(op){
		
		var win = $WR.getByName('mystore');
		var panel = win.MyStore;
		panel.Progress.show();
					
		$S.exec('mystore.collection.list', {
			onComplete:function(result){
				
				try{
					var obj;
					var array = $A(obj = result.responseText.evalJSON());
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				panel.clearBody();
								
				try{		
				
					var letter = '';
					
					for(var i = 0; i < array.length;  i++){
						if(array[i].Title.slice(0,1).toUpperCase() != letter){
							letter = array[i].Title.slice(0,1).toUpperCase() ;
							panel.PanelBody.Body().appendChild(new Node('h2', {className:'letter-group'}, letter)); 
						}
						
						
						var button =	new System.MyStore.Collection.Button({
							icon:		array[i].Picture,
							text:		array[i].Title,
							subTitle: 	$MUI('Nombre de produit') + ' : ' + array[i].NbProduct 
						});
												
						button.data = array[i];
						panel.PanelBody.Body().appendChild(button);
						
						button.addClassName('hide');
						
						button.on('click', function(){
							System.MyStore.Collection.open(win, this.data);	
						});
						
						button.BtnRemove.on('click', function(evt){
							evt.stop();
							System.MyStore.Collection.remove(win, this.data);
						}.bind(button));
					}	
					
					panel.PanelBody.refresh();
					
					new Timer(function(){
						var b = panel.PanelBody.select('.market-button.hide')[0];
						if(b){
							
							b.removeClassName('hide');
							b.addClassName('show');
						}
					}, 0.1, array.length).start();
					
										
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
 * System.MyStore.Collection.remove(win, collection) -> void
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(win, collection){
		collection = new System.MyStore.Collection(collection);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer cette collection') + ' "' + collection.Title + '" ? ', $MUI('Collection') + ' : ' +  collection.Title);
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = win.createBox();
		
		box.setTheme('flat liquid black');
		box.a(splite).setIcon('delete').setType().show();
		
		$S.fire('mystore.collection:remove.open', box);
		
		box.reset({icon:'cancel'});
						
		box.submit({
			text:$MUI('Supprimer le produit'),
			icon:'delete',
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('mystore.collection:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				contact.remove(function(){
					box.hide();
					System.MyStore.Collection.listing();
						
					$S.fire('mystore.collection:remove.submit.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('La collection a bien été supprimé'));
					splite.setIcon('valid-48');
					
					box.setTheme('flat liquid white');
					box.a(splite).setType('CLOSE').Timer(5).show();
									
				}.bind(this));
				
			}.bind(this)
		});
	}
};
/** section: Core
 * class System.MyStore.Product.Button
 **/
System.MyStore.Collection.Button = Class.from(AppButton);
System.MyStore.Collection.Button.prototype = {
	
	className:'wobject market-button store-button overable',
/**
 * new System.MyStore.Product.Button([options])
 **/	
	initialize:function(obj){
		
		var options = {
			price: 		0,
			note:		0,
			nbNote:		0,
			subTitle:	' ',
			overable:	true,
			checkbox:	false,
			tag:		false,
			version:	''
		};
		
		Object.extend(options, obj || {});
		//
		//
		//
		this.SubTitle = new Node('span', {className:'wrap-subtitle'}, $MUI(options.subTitle));
		//
		//
		//
		//this.Price = 	new Node('span', {className:'wrap-price wrap-version'}, options.price + ' €');	
		//
		//
		//
		this.Note = 	new StarsRating();
		//
		//
		//
		this.BtnRemove = new SimpleButton({nofill:true, icon:'remove-element-2'});
		this.BtnRemove.addClassName('btn-remove');
				
		this.setRating(options.note, options.nbNote);
		
		this.appendChild(this.SubTitle);
		//this.appendChild(this.Price);
		this.appendChild(this.BtnRemove);
				
		this.Overable(options.overable);
	},
/**
 * System.MyStore.Product.Button#setRating(note, nbNote) -> System.MyStore.Product.Button
 **/	
	setRating:function(note, nbNote){
		this.Note.setRating(note, nbNote);
		
		if(!nbNote){
			this.Note.hide();
		}
	},
	
	Overable:function(bool){
		this.removeClassName('overable');
		
		if(bool){
			this.addClassName('overable');	
		}
	}
};

System.MyStore.Collection.Picture =  Class.from(AppButton);
	
System.MyStore.Collection.Picture.prototype = {
	className:'wobject market-button mystore-picture show',
	
	initialize:function(obj){
		var self = this;
		//
		//
		//
		this.Title = new InputMagic({type:'text', maxLength:100, value:obj.text});
		this.Title.addClassName('icon-edit-element');
		this.Title.Large(true);
		//
		//
		//
		this.Picture2 = new FrameWorker({
			multiple:	false,
			parameters:	'cmd=mystore.collection.import'
		});
		
		this.Picture2.on('complete', function(file){
			self.setIcon(this.Value());
		});
		
		if(obj.icon){
			this.Picture2.Value(obj.icon);
			//this.setIcon(obj.icon);
		}
		
		this.Picture2.DropFile.addDropArea(this);
		this.Picture2.DropFile.addDragArea(this);
		
		this.Picture2.SimpleButton.setText('');
		this.Picture2.SimpleButton.setIcon('import-element');
		this.Picture2.SimpleButton.css('width', 'auto');
		this.Picture2.SimpleButton.css('right', '33px');
		
		this.BtnFileManager = new SimpleButton({icon:'browse-element'});
		this.BtnFileManager.css('right', '3px');
		this.BtnFileManager.css('width', 'auto');
		this.Picture2.DropFile.appendChild(this.BtnFileManager);
		
		this.BtnFileManager.on('click', function(){
			System.FileManager.join(null, function(file){
				self.Picture2.Value(file.uri);
				self.setIcon(file.uri);
			});
		});
				
		this.SpanText.innerHTML = '';
		this.SpanText.appendChild(this.Title);
		this.appendChild(this.Picture2);
				
	}
};

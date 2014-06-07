/** section: MyEvent
 * class System.MyEvent.Collection
 *
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : myevent_collection.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.MyEvent.Collection = {
/** 
 * System.MyEvent.Collection.open() -> void
 * Cette méthode ouvre le panneau de gestion des produits.
 **/	
	open:function(win, collection){
						
		try{
		
		var panel = win.MyEvent;
		
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
			
			System.MyEvent.Collection.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('myevent.collection:open', win);
		
		win.forms.Content.load();
		
		return;
		
		}catch(er){$S.trace(er)}
		
	},
/**
 *
 **/	
	createPanelInfos:function(win){
		//var panel = win.MyEvent;	
		var collection = 	win.getData();
		var forms = 		win.createForm();
		var self =			this;
		var panel = 		new Panel();
		//panel.createWidgets({number:2});
		//
		// Titre
		//
		var button = new System.MyEvent.Collection.Picture({
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
 * System.MyEvent.Collection.submit(win) -> void
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
		collection.Type = 				'page-myevent collection';
		collection.Template = 			'page-myevent-collection.php';
		collection.Comment_Statut = 	'close';
				
		$S.fire('myevent.collection:open.submit', win);
		
		win.MyEvent.Progress.show();
		
		collection.commitWithoutRevision(function(){
			win.setData(this);
			System.MyEvent.Collection.load(win);
		});
		
		return this;
	},
/**
 *
 **/	
	listing:function(win){
		
		var panel = win.MyEvent;
		
		System.MyEvent.setCurrent('collection');
		
		/*if(!this.NavBar){
			
			this.NavBar = new NavBar();
			this.NavBar.on('change', this.load.bind(this));
			
			this.NavBar.Collection = new Select({
				link:		$S.link,
				parameters:	'cmd=myevent.collection.distinct&field=Collection&default=' + encodeURIComponent('Toutes les collections')
			});
			
			this.NavBar.Collection.setStyle('float:right;width:200px');
			this.NavBar.Collection.on('change', function(){
				this.load(win);
			}.bind(this));
						
			this.NavBar.PrintAll = 			new Node('span', {className:'action all selected'}, $MUI('Afficher tout'));
			this.NavBar.PrintNotExpired = 	new Node('span', {className:'action not-expired'}, $MUI('Offres en cours')),	
			this.NavBar.PrintExpired = 		new Node('span', {className:'action expired'}, $MUI('Offres expirées'));
						
			this.NavBar.appendChilds([
				this.NavBar.PrintAll,
				this.NavBar.PrintNotExpired,
				this.NavBar.PrintExpired,
				this.NavBar.Collection
			]);
			
			this.NavBar.PrintAll.on('click', function(){
				this.load();
				
				this.NavBar.select('span.action.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintAll.addClassName('selected');
			}.bind(this));
			
			this.NavBar.PrintExpired.on('click', function(){
				this.load('-expired');
				
				this.NavBar.select('span.action.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintExpired.addClassName('selected');
			}.bind(this));
			
			
			this.NavBar.PrintNotExpired.on('click', function(){
				this.load('-not-expired');
				
				this.NavBar.select('span.action.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintNotExpired.addClassName('selected');
			}.bind(this));
		}
		
		this.NavBar.Collection.load();
		
		panel.PanelBody.Header().appendChilds([
			this.NavBar
		]);*/
		
		this.load();
		
	},
/**
 *
 **/	
	load:function(op){
		
		var win = $WR.getByName('myevent');
		var panel = win.MyEvent;
		panel.Progress.show();
		
		//this.NavBar.setMaxLength(0);
			
		$S.exec('myevent.collection.list', {
			//parameters:'options=' + Object.EncodeJSON({draft:true, Collection:this.NavBar.Collection.Value(), op:op, statistics:true}) + '&clauses=' + this.NavBar.getClauses().toJSON(),
			onComplete:function(result){
				
				try{
					var obj;
					var array = $A(obj = result.responseText.evalJSON());
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				panel.clearBody();
				
				//if(array.length == 0){
					//System.MyEvent.Collection.open(win);	
				//}
				
				//this.NavBar.PrintAll.innerHTML = 			$MUI('Afficher tout') + '(' + obj.NbAll + ')';
				//this.NavBar.PrintNotExpired.innerHTML = 	$MUI('Offres en cours') + '(' + obj.NbNotExpired + ')';
				//this.NavBar.PrintExpired.innerHTML = 		$MUI('Offres expirées') + '(' + obj.NbExpired + ')';
				
				//this.NavBar.setMaxLength(obj.maxLength);
				
				try{		
				
					var letter = '';
					
					for(var i = 0; i < array.length;  i++){
						if(array[i].Title.slice(0,1).toUpperCase() != letter){
							letter = array[i].Title.slice(0,1).toUpperCase() ;
							panel.PanelBody.Body().appendChild(new Node('h2', {className:'letter-group'}, letter)); 
						}
						
						
						var button =	new System.MyEvent.Collection.Button({
							icon:		array[i].Picture,
							text:		array[i].Title,
							subTitle: 	$MUI('Nombre de produit') + ' : ' + array[i].NbProduct 
						});
												
						button.data = array[i];
						panel.PanelBody.Body().appendChild(button);
						
						button.addClassName('hide');
						
						button.on('click', function(){
							System.MyEvent.Collection.open(win, this.data);	
						});
						
						button.BtnRemove.on('click', function(evt){
							evt.stop();
							System.MyEvent.Collection.remove(win, this.data);
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
 * System.MyEvent.Collection.remove(win collection) -> void
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(win, collection){
		collection = new System.MyEvent.Collection(collection);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer le produit') + ' ' + collection.Title + ' ? ', $MUI('Collection') + ' : ' +  collection.Collection);
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = win.createBox();
		
		box.setTitle($MUI('Suppression du produit')).a(splite).setIcon('delete').setType().show();
		
		$S.fire('myevent.collection:remove.open', box);
		
		box.reset({icon:'cancel'});
						
		box.submit({
			text:$MUI('Supprimer le produit'),
			icon:'delete',
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('myevent.collection:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				contact.remove(function(){
					box.hide();
						
					$S.fire('myevent.collection:remove.submit.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('Le produit a bien été supprimé'));
					splite.setIcon('valid-48');
					
					
					box.setTitle($MUI('Confirmation')).setContent(splite).setType('CLOSE').Timer(5).show();
					box.setIcon('documentinfo');
					
					System.MyEvent.setCurrent('collection');
				}.bind(this));
				
			}.bind(this)
		});
	}
};
/** section: Core
 * class System.MyEvent.Product.Button
 **/
System.MyEvent.Collection.Button = Class.from(AppButton);
System.MyEvent.Collection.Button.prototype = {
	
	className:'wobject market-button store-button overable',
/**
 * new System.MyEvent.Product.Button([options])
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
 * System.MyEvent.Product.Button#setRating(note, nbNote) -> System.MyEvent.Product.Button
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

System.MyEvent.Collection.Picture =  Class.from(AppButton);
	
System.MyEvent.Collection.Picture.prototype = {
	className:'wobject market-button myevent-picture show',
	
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
			parameters:	'cmd=myevent.collection.import'
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

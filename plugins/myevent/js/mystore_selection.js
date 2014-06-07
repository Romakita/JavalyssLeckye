/** section: MyEvent
 * class System.MyEvent.Selection
 *
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : myevent.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.MyEvent.Selection = Class.createAjax({
/**
 * System.MyEvent.Selection#Selection_ID -> Number
 **/
	Selection_ID: 0,
/**
 * System.MyEvent.Selection#Post_ID -> Number
 **/
	Post_ID: 0,
	
	Title:	'',
	
	Price:	'0,00',
	
	Collection:'',
/**
 * System.MyEvent.Selection#Picture -> String
 * Varchar
 **/
	Picture: "",
/**
 * System.MyEvent.Selection#Content -> String
 * Text
 **/
	Content: "",
/**
 * System.MyEvent.Selection#Order -> Number
 **/
	Order: 0,
/**
 * System.MyEvent.Selection#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		$S.exec('myevent.selection.commit', {
			
			parameters: 'MyEventSelection=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					$S.trace(result.responseText);
					if(Object.isFunction(error)) callback.call(this, result.responseText);
					return;	
				}
				
				this.oMeta = Object.toJSON(this.Meta);
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});
	},
/**
 * System.MyEvent.Selection#delete(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback){
		$S.exec('myevent.selection.delete',{
			parameters: 'MyEventSelection=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	}
});

Object.extend(System.MyEvent.Selection , {
/** 
 * System.MyEvent.Selection.open() -> void
 * Cette méthode ouvre le panneau de gestion des produits.
 **/	
	open:function(win, selection){
						
		try{
		
		var panel = win.MyEvent;
		
		win.setData(selection = new System.MyEvent.Selection(selection));
		var forms = win.createForm();
		//
		// Réinitialisation du contenu
		//
		panel.clearSwipAll();
		panel.Open(true, 650);
		//
		//
		//
				
		var button = new System.MyEvent.Product.Button({
			icon:		selection.Picture, 
			text:		selection.Title,
			subTitle:	$MUI('Collection') + ' : ' + selection.Collection,
			price:		selection.Price
		});
		
		button.BtnRemove.hide();
		
		panel.PanelSwip.Body().appendChild(button);
			
		panel.PanelSwip.addPanel($MUI('Info'), this.createPanelInfos(win));
		
		forms.Picture.on('complete', function(){
			button.setIcon(this.Value());
		});
		
		forms.Post_ID.on('change', function(){
			button.setText(this.Current().data.Title);
			button.setSubTitle($MUI('Collection') + ' : ' + this.Current().data.Collection);
			button.setPrice(this.Current().data.Price);
		});
		
		forms.Title.on('keyup', function(){
			button.setText(this.Value());
		});
		
		forms.Price.on('change', function(){
			button.setPrice(this.Value());
		});
		
		var submit = new SimpleButton({text:$MUI('Enregistrer')});
		
		submit.on('click', function(){
			
			System.MyEvent.Selection.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('myevent.selection:open', win);
		
		return;
		
		}catch(er){$S.trace(er)}
		
	},
/**
 *
 **/	
	createPanelInfos:function(win){
		//var panel = win.MyEvent;	
		var selection = 	win.getData();
		var forms = 	win.createForm();
		var self =		this;
		var panel = 	new Panel();
		//panel.createWidgets({number:2});
		//
		// Titre
		//
		forms.Post_ID = 		new Select({
			parameters:'cmd=myevent.product.list'
		});
		if(selection.Post_ID != 0){
			forms.Post_ID.Value(selection.Post_ID);
		}
		forms.Post_ID.load();
		
		forms.Post_ID.on('change', function(){
			forms.Title.Value(this.Current().data.Collection + ', ' + this.Current().data.Title);
			forms.Price.Value(this.Current().data.Price);
		});
		
		//
		//
		//
		forms.Title = 	new Input({type:'text', value:selection.Title});
		//
		//
		//
		forms.Picture =	new FrameWorker({
			multiple:	false,
			parameters:	'cmd=myevent.selection.import'
		})
		
		forms.Picture.Value(selection.Picture);
		//
		// Prix
		//
		forms.Price = 			new Input({type:'number', value:selection.Price, decimal:2, empty:false});
		
		forms.Price.css('width', 80).css('text-align', 'right');
		
		//
		// Titre
		//
		forms.Order = 	new Input({type:'number', value:selection.Order, decimal:0, empty:false});
		forms.Order.css('width', 50).css('text-align', 'right');
		//
		// Résumé pour le référencement / réseaux sociaux
		//
		forms.Content = 	new TextArea({type:'text', value:selection.Content, maxLength:500});
		
		//
		//
		//
		//panel.appendChild(new Node('h4', $MUI('Informations')));
		
		var table = 		new TableData();
		
		table.addHead($MUI('Produit de référence')).addCel(win.forms.Post_ID).addRow();
		table.addHead($MUI('Titre')).addCel(win.forms.Title).addRow(); 
		table.addHead($MUI('Prix')).addCel(win.forms.Price).addRow(); 
		table.addHead($MUI('Photo')).addCel(win.forms.Picture).addRow();
		table.addHead($MUI('Ordre')).addCel(win.forms.Order).addRow();
		table.addHead($MUI('Description')).addCel(win.forms.Content);
		
		panel.appendChild(table);
				
		return panel;
	},
/**
 * System.MyEvent.Selection.submit(win) -> void
 **/	
	submit:function(win){
		var forms = win.createForm();
				
		win.Flag.hide();
			
		if(forms.Post_ID.Value() == '') {
			win.Flag.setText($MUI('Veuillez choisir un produit pour votre selection'));
			win.Flag.show(forms.Post_ID);
			return true;
		}
		
		$S.fire('myevent.selection:open.submit', win);
		
		var selection = win.forms.save(win.getData());
		
		win.MyEvent.Progress.show();
		
		selection.commit(function(){
			//System.MyEvent.Selection.open(win, selection);
			win.setData(this);
			System.MyEvent.Selection.load(win);
		});
		
		return this;
	},
/**
 *
 **/	
	listing:function(win){
		
		var panel = win.MyEvent;
		
		System.MyEvent.setCurrent('selection');
		
		var add = new Node('span', {className:'add icon icon-add-element', value:'Add'}, $MUI('Ajouter'));
		
		add.on('click', function(){
			System.MyEvent.Selection.open(win);
		});
		
		panel.PanelBody.Header().appendChilds([
			add
		]);
		
		this.load();
		
	},
/**
 *
 **/	
	load:function(op){
		
		var win = $WR.getByName('myevent');
		var panel = win.MyEvent;
		panel.Progress.show();
					
		$S.exec('myevent.selection.list', {
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
					//System.MyEvent.Selection.open(win);	
				//}
				
				try{		
					
					for(var i = 0; i < array.length;  i++){
						
						var button =	new System.MyEvent.Product.Button({
							icon:		array[i].Picture,
							price:		array[i].Price,
							text:		array[i].Title,
							subTitle:	array[i].Collection == '' ? $MUI('Pas de collection') :  ($MUI('Collection') + ' ' + array[i].Collection)
						});
						
						button.data = array[i];
						panel.PanelBody.Body().appendChild(button);
						
						button.addClassName('hide');
						
						button.on('click', function(){
							System.MyEvent.Selection.open(win, this.data);	
						});
						
						button.BtnRemove.on('click', function(evt){
							evt.stop();
							System.MyEvent.Selection.remove(win, this.data);
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
 * System.MyEvent.Selection.remove(win selection) -> void
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(win, selection){
		selection = new System.MyEvent.Selection(selection);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer cette selection') + ' ' + selection.Title + ' ? ', $MUI('Collection') + ' : ' +  selection.Collection);
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = win.createBox();
		
		box.setTitle($MUI('Suppression d\'une selection')).a(splite).setIcon('delete').setType().show();
		
		$S.fire('myevent.selection:remove.open', box);
		
		box.reset({icon:'cancel'});
						
		box.submit({
			text:$MUI('Supprimer la selection'),
			icon:'delete',
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('myevent.selection:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				contact.remove(function(){
					box.hide();
						
					$S.fire('myevent.selection:remove.submit.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('La selection a bien été supprimé'));
					splite.setIcon('valid-48');
					
					
					box.setTitle($MUI('Confirmation')).setContent(splite).setType('CLOSE').Timer(5).show();
					box.setIcon('documentinfo');
					
					System.MyEvent.setCurrent('selection');
				}.bind(this));
				
			}.bind(this)
		});
	}
});
/** section: Core
 * class MarketButton
 **/
System.MyEvent.Selection.Button = Class.from(AppButton);
System.MyEvent.Selection.Button.prototype = {
	
	className:'wobject market-button store-button overable',
/**
 * new MarketButton([options])
 **/	
	initialize:function(obj){
		
		var options = {
			price: 		0,
			note:		0,
			nbNote:		0,
			subTitle:	$MUI('All'),
			overable:	false,
			checkbox:	false,
			update:		false,
			version:	''
		};
		
		Object.extend(options, obj || {});
		
		if(options.category == 'All'){
			options.category = 'Uncategorized';
		}
		//
		//
		//
		this.SubTitle = new Node('span', {className:'wrap-subtitle'}, $MUI(options.subTitle));
		//
		//
		//
		this.Price = 	new Node('span', {className:'wrap-price wrap-version'}, options.price + ' €');	
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
		
		if(options.update){
			this.addClassName('update');
			this.setTag($MUI('Update'));
		}
		
		this.appendChild(this.SubTitle);
		this.appendChild(this.Price);
		this.appendChild(this.BtnRemove);
		
		/*if(options.checkbox){
			this.Checkbox = new Checkbox();
			this.appendChild(this.Checkbox);
			
			this.Checkbox.on('change', function(){
				this.removeClassName('checked');
				if(this.Checkbox.Checked()){
					this.addClassName('checked');	
				}
				
			}.bind(this));
		}*/
				
		//this.Overable(options.overable);
		
	},
/**
 * MarketButton#setRating(note, nbNote) -> MarketButton
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

System.MyEvent.Selection.Picture =  Class.from(AppButton);
	
System.MyEvent.Selection.Picture.prototype = {
	className:'wobject market-button myevent-picture show',
	
	initialize:function(obj){
		var self = this;
		//
		//
		//
		this.Name = new InputMagic({type:'text', maxLength:100, value:obj.text});
		this.Name.addClassName('icon-edit-element');
		this.Name.Large(true);
		//
		//
		//
		this.Value = new FrameWorker({
			multiple:	false,
			parameters:	'cmd=myevent.selection.import'
		});
		
		this.Value.on('complete', function(file){
			self.Value.Value(file);
			self.setIcon(file);
		});
		
		if(obj.icon){
			this.Value.Value(obj.icon);
		}
		
		this.Value.DropFile.addDropArea(this);
		this.Value.DropFile.addDragArea(this);
		
		this.Value.SimpleButton.setText('');
		this.Value.SimpleButton.setIcon('import-element');
		this.Value.SimpleButton.css('width', 'auto');
		this.Value.SimpleButton.css('right', '63px');
		
		this.BtnFileManager = new SimpleButton({icon:'browse-element'});
		this.BtnFileManager.css('right', '33px');
		this.BtnFileManager.css('width', 'auto');
		this.Value.DropFile.appendChild(this.BtnFileManager);
		
		this.BtnFileManager.on('click', function(){
			System.FileManager.join(null, function(file){
				self.Value.Value(file.uri);
				self.setIcon(file.uri);
			});
		});
		//
		//
		//
		this.BtnRemove = new SimpleButton({icon:'remove-element'});
		this.BtnRemove.addClassName('remove');
		this.BtnRemove.css('right', '3px');
		this.BtnRemove.css('width', 'auto');
		this.Value.DropFile.appendChild(this.BtnRemove);
		
		this.SpanText.innerHTML = '';
		this.SpanText.appendChild(this.Name);
		this.appendChild(this.Value);
		//
		//
		//
		if(!Object.isUndefined(obj.subText)){
			this.addClassName('have-textarea');
			this.Content = new TextArea({value:obj.subText});
			this.Content.placeholder = $MUI('Saisissez votre texte') + '...';
			this.appendChild(this.Content);
		}
		
	}
};

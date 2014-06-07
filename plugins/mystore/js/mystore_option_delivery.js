/** section: Plugins
 * class MyStore.Product
 *
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : mystore.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.MyStore.OptionDelivery = Class.createAjax({
/**
 * System.MyStore.OptionDelivery#Option_ID -> Number
 **/
	Option_ID: 0,
/**
 * System.MyStore.OptionDelivery#Name -> String
 * Varchar
 **/
	Name: "",
/**
 * System.MyStore.OptionDelivery#Picture -> String
 * Varchar
 **/
	Picture: "",
/**
 * System.MyStore.OptionDelivery#Cost_Delivery -> Float
 * Decimal
 **/
	Cost_Delivery: 0.00,
/**
 * System.MyStore.OptionDelivery#Cost_Delivery -> String
 * Decimal
 **/
	Time_Delivery: '',
/**
 * System.MyStore.OptionDelivery#Amount_Min -> Float
 * Decimal
 **/
	Amount_Min: 0.00,
/**
 * System.MyStore.OptionDelivery#Amount_Max -> Float
 * Decimal
 **/
	Amount_Max: 0.00,
/**
 * System.MyStore.OptionDelivery#Type -> String
 * Decimal
 **/	
	Type: 'professional private',
/**
 * System.MyStore.OptionDelivery#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		$S.exec('mystore.option.delivery.commit', {
			
			parameters: 'MyStoreOptionDelivery=' + this.toJSON(),
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
 * Post.delete(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback){
		$S.exec('mystore.option.delivery.delete',{
			parameters: 'MyStoreProduct=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	}
});

Object.extend(System.MyStore.OptionDelivery, {
/** 
 * System.MyStore.OptionDelivery.open() -> void
 * Cette méthode ouvre le panneau de gestion des options de livraison.
 **/	
	open:function(win, optionDelivery){
						
		try{
		
		var panel = win.MyStore;
		
		win.setData(optionDelivery = new System.MyStore.OptionDelivery(optionDelivery));
		var forms = win.createForm();
		//
		// Réinitialisation du contenu
		//
		panel.clearSwipAll();
		panel.Open(true, 650);
		
		forms.Criteres = {};
		//
		//
		//
				
		panel.PanelSwip.Body().appendChild(new Node('h1', $MUI('Gestion de l\'option de livraison')));
			
		panel.PanelSwip.addPanel($MUI('Info'), this.createPanelInfos(win));
		//
		
		//panel.PanelSwip.addPanel($MUI('Showcase'), this.createPanelInfos(win));
		
		var submit = new SimpleButton({text:$MUI('Enregistrer')});
		
		submit.on('click', function(){
			
			System.MyStore.OptionDelivery.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('mystore.option.delivery:open', win);
		
		return;
		
		}catch(er){$S.trace(er)}
		
	},
/**
 *
 **/	
	createPanelInfos:function(win){
		//var panel = win.MyStore;	
		var optionDelivery = 	win.getData();
		var forms = 			win.createForm();
		var self =				this;
		var panel = 			new Panel();
		//panel.createWidgets({number:2});
		//
		// Titre
		//
		forms.Name = 			new Input({type:'text', value:optionDelivery.Name, maxLength:255});
		//
		//
		//
		forms.Picture = new FrameWorker({
			multiple:	false,
			parameters:	'cmd=mystore.menu.import'
		});
				
		forms.Picture.Value(optionDelivery.Picture);
		//
		// Prix
		//
		forms.Cost_Delivery = 	new Input({type:'number', value:optionDelivery.Cost_Delivery, decimal:2, empty:false});
		forms.Cost_Delivery.css('width', 80).css('text-align', 'right');
		//
		// Prix
		//
		forms.Time_Delivery = 	new Select({
			link:		$S.link,
			parameters:'cmd=mystore.option.delivery.distinct&field=Time_Delivery&default=true'	
		});
		forms.Time_Delivery.Value(optionDelivery.Time_Delivery);
		forms.Time_Delivery.Input.readOnly = false;
		forms.Time_Delivery.load();
		
		forms.addFilters('Time_Delivery', function(){
			return this.Time_Delivery.Text() == $MUI('Choisissez') ? '' : this.Time_Delivery.Text();	
		});
		//
		// Prix concurrent/fournisseur/constaté
		//
		forms.Amount_Min = 	new Input({type:'number', value:optionDelivery.Amount_Min, decimal:2, empty:false});
		forms.Amount_Min.css('width', 80).css('text-align', 'right');
		//
		// Prix concurrent/fournisseur/constaté
		//
		forms.Amount_Max = 	new Input({type:'number', value:optionDelivery.Amount_Max, decimal:2, empty:false});
		forms.Amount_Max.css('width', 80).css('text-align', 'right');
		//
		// Particulier
		//
		forms.Private = new ToggleButton();
		forms.Private.Value(optionDelivery.Type.match(/private/));
		//
		// Professionel
		//
		forms.Professional = new ToggleButton();
		forms.Professional.Value(optionDelivery.Type.match(/professional/));
		//
		// Mode de Livraison affiché sur le site
		//
		forms.Public = new ToggleButton();
		forms.Public.Value(optionDelivery.Type.match(/public/));
		//
		//
		//
		forms.Add = new ToggleButton();
		forms.Add.Value(optionDelivery.Type.match(/add/));
		//
		//
		//
		forms.In_Store = new ToggleButton();
		forms.In_Store.Value(optionDelivery.Type.match(/in-store/));
		
		forms.In_Store.on('change', function(){
			if(win.forms.In_Store.Value()){
				forms.RowTimeDelivery.hide();
			}else{
				forms.RowTimeDelivery.show();	
			}
		});
		
		forms.addFilters('Type', function(){
			var type = (this.Professional.Value() ? 'professional' : '');
			type +=		' ' + (this.Private.Value() ? 'private' : '');
			type +=		' ' + (this.Public.Value() ? 'public' : 'internal');
			type +=		' ' + (this.Add.Value() ? 'add' : '');
			type +=		' ' + (this.In_Store.Value() ? 'in-store' : '');
			
			return type.trim();
		});
		//
		//
		//
		panel.appendChild(new Node('h4', $MUI('Informations')));
		
		var table = 		new TableData();
		
		table.addHead($MUI('Titre')).addCel(win.forms.Name).addRow();
		table.addHead($MUI('Photo')).addCel(win.forms.Picture).addRow();
		table.addHead($MUI('Prix')).addCel(win.forms.Cost_Delivery).addRow();
		table.addHead($MUI('Récupèration sur place') + ' ? ').addCel(win.forms.In_Store).addRow();
		table.addHead($MUI('Temps de livraison')).addCel(win.forms.Time_Delivery).addRow();
		
		forms.RowTimeDelivery = table.getRow(4);
				
		panel.appendChild(table);
		
					
		panel.appendChild(new Node('h4', $MUI('Montant de la commande')));
		
		panel.appendChild(new Node('p', {className:'note'}, $MUI('Choisissez sur quel montant d\'une commande peut s\'appliquer ce mode de livraison (Laissez les champs à 0 si vous ne voulez pas appliquer de restriction).')));
		
		var table = 		new TableData();
		table.addClassName('liquid');
		table.addHead($MUI('Montant minimum de la commande'), {style:'width:230px'}).addCel(win.forms.Amount_Min).addRow();
		table.addHead($MUI('Montant maximal de la commande')).addCel(win.forms.Amount_Max).addRow();
		
		panel.appendChild(table);
		
		panel.appendChild(new Node('h4', $MUI('Options d\'affichage & de calcul')));
		
		var table = 		new TableData();
		table.addHead($MUI('Afficher ce mode livraison sur le site') + ' ? ', {style:'width:300px'}).addCel(win.forms.Public).addRow();
		table.addHead($MUI('Afficher pour les clients Particulier')).addCel(win.forms.Private).addRow();
		table.addHead($MUI('Afficher pour les clients Professionnel')).addCel(win.forms.Professional).addRow();
		table.addHead($MUI('Ajouter ce prix en plus du coût total de livraison') + '?').addCel(win.forms.Add).addRow();
						
		panel.appendChild(table);
		
		
		if(win.forms.In_Store.Value()){
			forms.RowTimeDelivery.hide();
		}
				
		return panel;
	},
/**
 * System.MyStore.OptionDelivery.submit(win) -> void
 **/	
	submit:function(win){
		var forms = win.createForm();
				
		win.Flag.hide();
			
		if(forms.Name.Value() == '') {
			win.Flag.setText($MUI('Veuillez saisir un titre pour votre option'));
			win.Flag.show(forms.Title);
			return true;
		}
		
		var optionDelivery =				win.forms.save(win.getData());
		
		$S.fire('mystore.option.delivery:open.submit', win);
		
		win.MyStore.Progress.show();
		
		optionDelivery.commit(function(){
			win.setData(this);
			System.MyStore.OptionDelivery.load(win);
		});
		
		return this;
	},
/**
 *
 **/	
	listing:function(){
		
		var win =	$WR.getByName('mystore');
		var panel = win.MyStore;
		
		System.MyStore.setCurrent('delivery');
		
		var add = new Node('span', {className:'add icon icon-add-element', value:'Add'}, $MUI('Ajouter'));
		add.on('click', function(){
			System.MyStore.OptionDelivery.open(win);
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
		
		var win = $WR.getByName('mystore');
		var panel = win.MyStore;
		panel.Progress.show();
					
		$S.exec('mystore.option.delivery.list', {
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
				
				try{		
					
					for(var i = 0; i < array.length;  i++){
						
						var data =		new System.MyStore.OptionDelivery(array[i]);
						var button =	new System.MyStore.OptionDelivery.Button({
							icon:		array[i].Picture,
							price:		(array[i].Type.match(/add/) ? ' ' + $MUI('Coût de livraison calculé') + ' + ' : '') + array[i].Cost_Delivery,
							text:		array[i].Name,
							subTitle:	array[i].Type.match(/in-store/) ? $MUI('Récupération au magasin') : array[i].Time_Delivery,
							tag:		array[i].Type.match(/internal/) ? $MUI('Interne') : $MUI('Affiché sur site')
						});
												
						button.data = array[i];
						panel.PanelBody.Body().appendChild(button);
						
						button.addClassName('hide');
						
						button.on('click', function(){
							System.MyStore.OptionDelivery.open(win, this.data);	
						});
						
						button.BtnRemove.on('click', function(evt){
							evt.stop();
							System.MyStore.OptionDelivery.remove(win, this.data);
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
 * System.MyStore.OptionDelivery.remove(win optionDelivery) -> void
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(win, optionDelivery){
		optionDelivery = new System.MyStore.OptionDelivery(optionDelivery);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer cette option ') + ' "' + optionDelivery.Title + '" ? ', $MUI('Collection') + ' : ' +  optionDelivery.Name);
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = win.createBox();
		
		box.setTheme('flat liquid black');
		box.a(splite).setIcon('delete').setType().show();
		
		$S.fire('mystore.option.delivery:remove.open', box);
		
		box.reset({icon:'cancel'});
						
		box.submit({
			text:$MUI('Supprimer le produit'),
			icon:'delete',
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('mystore.option.delivery:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				optionDelivery.remove(function(){
					box.hide();
					System.MyStore.OptionDelivery.listing();
					
					$S.fire('mystore.option.delivery:remove.submit.complete', evt);
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('L\'option de livraison a bien été supprimé'));
					splite.setIcon('valid-48');
					
					box.setTheme('flat liquid white');
					box.a(splite).setType('CLOSE').Timer(5).show();
					
					
				}.bind(this));
				
			}.bind(this)
		});
	}
});
/** section: Core
 * class System.MyStore.OptionDelivery.Button
 **/
System.MyStore.OptionDelivery.Button = Class.from(AppButton);
System.MyStore.OptionDelivery.Button.prototype = {
	
	className:'wobject market-button store-button delivery-button overable',
/**
 * new System.MyStore.OptionDelivery.Button([options])
 **/	
	initialize:function(obj){
		
		var options = {
			price: 		0,
			subTitle:	'',
			overable:	true,
			checkbox:	false,
			tag:		false,
			version:	''
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
		this.Price = 	new Node('span', {className:'wrap-price wrap-version'}, options.price + ' €');
		//
		//
		//
		this.BtnRemove = new SimpleButton({nofill:true, icon:'remove-element-2'});
		this.BtnRemove.addClassName('btn-remove');
		
		this.appendChild(this.SubTitle);
		this.appendChild(this.Price);
		this.appendChild(this.BtnRemove);
		
		if(options.tag){
			//this.addClassName('update');
			this.setTag(options.tag);
		}
		
		this.Overable(options.overable);
	},
/**
 * System.MyStore.OptionDelivery.Button#setPrice(price) -> System.MyStore.OptionDelivery.Button
 **/	
	setPrice:function(price){
		this.Price.innerHTML = price + ' €';
		return this;
	},
/**
 * System.MyStore.OptionDelivery.Button#setSubTitle(price) -> System.MyStore.OptionDelivery.Button
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

System.MyStore.OptionDelivery.Picture =  Class.from(AppButton);
	
System.MyStore.OptionDelivery.Picture.prototype = {
	className:'wobject market-button mystore-picture show',
	
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
			parameters:	'cmd=mystore.option.delivery.import'
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

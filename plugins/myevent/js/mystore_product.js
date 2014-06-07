/** section: MyEvent
 * class MyEvent.Product
 *
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : myevent.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.MyEvent.Product = Class.createAjax({
/**
 * Post.Post_ID -> Number
 * Numéro d'identification du post.
 **/
	Post_ID: 			0,
/**
 * Post.Parent_ID -> Number
 * Numéro d'identification du post parent.
 **/
	Parent_ID:			0,
	Revision_ID:		0,
/**
 * Post.User_ID -> Number
 * Numéro d'identification de l'auteur du post.
 **/
	User_ID:			0,
/**
 * Post.Category -> String
 * Categorie du poste.
 **/
	Category:			'Non classé;',
/**
 * Post.Title -> String
 * Titre du post.
 **/
	Title:				'',
/**
 * Post.Title -> String
 * Titre du post pour le référencement.
 **/
	Title_Header:		'',
/**
 * Post.Content -> String
 * Contenu du post.
 **/
	Content:			'',
/**
 * Post.Summary -> String
 * Résumé du post.
 **/
	Summary:			'',
/**
 * Post.Keyword -> String
 * Contenu du post.
 **/
	Keyword:			'',
/**
 * Post.Date_Create -> DateTime
 * Date de création du post.
 **/
	Date_Create: 		'',
/**
 * Post.Date_Update -> DateTime
 * Date de modification du post.
 **/
	Date_Update:		'',
/**
 * Post.Name -> String
 * Nom didentification du post pour les liens méta (Utilisation des méthodes URL REWRITING)
 **/
	Name:				'',
/**
 * Post.Picture -> String
 **/
	Picture:				'',
/**
 * Post.Type -> String
 * Type du post. Page ou Post.
 **/
	Type:				'post',
/**
 * Post.Statut -> String
 * Etat de l'article.
 **/
	Statut:				'publish',
/**
 * Post.Comment_Statut -> String
 **/
	Comment_Statut: 	'close',
/**
 * Post.Template -> String
 **/
 	Template:			'myevent-product.php',
/**
 * Post.Meta -> String
 **/
 	Meta:				'',
/**
 * MyEventProduct#Provider_ID -> Number
 **/
	Provider_ID: 		0,
/**
 * MyEventProduct#Galery_ID -> Number
 **/
	Galery_ID: 			0,
/**
 * MyEventProduct#Product_Code -> String
 * Varchar
 **/
	Product_Code: 		"",
/**
 * MyEventProduct#Collection -> Number
 **/
	Collection: 		"",
/**
 * MyEventProduct#Related_Collection -> Number
 **/
	Related_Collection: "",
/**
 * MyEventProduct#Expiry_Date -> Datetime
 **/
	Expiry_Date: 		'0000-00-00 00:00:00',
/**
 * MyEventProduct#Price -> Float
 * Decimal
 **/
	Price: 				0.00,
/**
 * MyEventProduct#Standard_Price -> Float
 * Decimal
 **/
	Standard_Price: 	0.00,
/**
 * MyEventProduct#Discount -> Float
 * Decimal
 **/
	Discount: 			0.0,
/**
 * MyEventProduct#Eco_Tax -> Float
 * Decimal
 **/
	Eco_Tax: 			0.0,
/**
 * MyEventProduct#Stock -> Number
 **/
	Stock: 				0,
/**
 * MyEventProduct#Cost_Delivery -> Float
 * Decimal
 **/
	Cost_Delivery: 		0.00,
/**
 * MyEventProduct#Time_Delivery -> String
 * Varchar
 **/
	Time_Delivery: 		"",
/**
 * MyEventProduct#Origin -> String
 * Varchar
 **/
	Origin: 			"",
/**
 * MyEventProduct#Designer -> String
 * Varchar
 **/
	Designer: 			"",
/**
 * MyEventProduct#Criteres -> String
 * Text
 **/
	Criteres: 			"",
/**
 * new System.MyEvent.Product([obj])
 * - obj (Object): Objet anonyme équivalent à `System.MyEvent.Product`.
 *
 * Instancie un nouvelle objet de type `System.MyEvent.Product`.
 **/
	initialize: function(obj){
		if(!Object.isUndefined(obj)){
			this.setObject(obj);
		}
		
		if(this.Meta == ''){
			this.Meta = {};	
		}
		
		if(this.Criteres == ''){
			this.Criteres = {};	
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
		
		$S.exec('myevent.product.commit', {
			
			parameters: 'MyEventProduct=' + this.toJSON(),
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
		$S.exec('myevent.product.delete',{
			parameters: 'MyEventProduct=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	},
	
	getPictures:function(it){
		if(Object.isUndefined(it)){
			
			if(Object.isUndefined(this.Criteres.Pictures)){
				return [];	
			}
			
			return this.Criteres.Pictures;	
		}
		
		var pictures = this.getPictures();
		
		return Object.isUndefined(pictures[it]) ? '' : pictures[it].Value;
	}
});

Object.extend(System.MyEvent.Product, {
	
	LabelsDimensions: {
		overall: 	'Hors tout',
		parcel:		'Dimension du colis',
		other:		'Personnalisée'
	},
/** 
 * System.MyEvent.Product.open() -> void
 * Cette méthode ouvre le panneau de gestion des produits.
 **/	
	open:function(win, product){
						
		try{
		
		var panel = win.MyEvent;
		
		win.setData(product = new System.MyEvent.Product(product));
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
				
		panel.PanelSwip.Body().appendChild(new Node('h1', $MUI('Gestion du produit')));
			
		panel.PanelSwip.addPanel($MUI('Info'), this.createPanelInfos(win));
		panel.PanelSwip.addPanel($MUI('Description'), this.createPanelDescription(win));
		panel.PanelSwip.addPanel($MUI('Critères'), this.createPanelCriteres(win));
		panel.PanelSwip.addPanel($MUI('Photos'), this.createPanelPhotos(win));
		//
		
		//panel.PanelSwip.addPanel($MUI('Showcase'), this.createPanelInfos(win));
		
		var submit = new SimpleButton({text:$MUI('Enregistrer')});
		
		submit.on('click', function(){
			
			System.MyEvent.Product.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('myevent.product:open', win);
		
		win.forms.Content.load();
		
		return;
		
		}catch(er){$S.trace(er)}
		
	},
/**
 *
 **/	
	createPanelInfos:function(win){
		//var panel = win.MyEvent;	
		var product = 	win.getData();
		var forms = 	win.createForm();
		var self =		this;
		var panel = 	new Panel();
		//panel.createWidgets({number:2});
		//
		// Titre
		//
		forms.Title = 			new Input({type:'text', value:product.Title});
		//
		// Code produit
		//
		forms.Product_Code = 	new Input({type:'text', value:product.Product_Code});
		//
		// Prix
		//
		forms.Price = 			new Input({type:'number', value:product.Price, decimal:2, empty:false});
		forms.Price.css('width', 80).css('text-align', 'right');
		//
		// Prix concurrent/fournisseur/constaté
		//
		forms.Standard_Price = 	new Input({type:'number', value:product.Standard_Price, decimal:2, empty:false});
		forms.Standard_Price.css('width', 80).css('text-align', 'right');
		//
		// Eco Taxe
		//
		forms.Eco_Tax = 			new Input({type:'number', value:product.Eco_Tax, decimal:2, empty:false});
		forms.Eco_Tax.css('width', 80).css('text-align', 'right');
		//
		// Remise
		//
		forms.Discount = 		new Input({type:'number', value:product.Discount, decimal:1, empty:false});
		forms.Discount.css('width', 80).css('text-align', 'right');
		//
		// Prix
		//
		forms.Cost_Delivery = 	new Input({type:'number', value:product.Cost_Delivery, decimal:2, empty:false});
		forms.Cost_Delivery.css('width', 80).css('text-align', 'right');
		//
		// Prix
		//
		forms.Stock = 	new Input({type:'number', value:product.Stock, decimal:0, empty:false});
		forms.Stock.css('width', 80).css('text-align', 'right');
		//
		// Prix
		//
		forms.Time_Delivery = 	new Select({
			link:		$S.link,
			parameters:'cmd=myevent.product.distinct&field=Time_Delivery&default=true'	
		});
		forms.Time_Delivery.Value(product.Time_Delivery);
		forms.Time_Delivery.Input.readOnly = false;
		forms.Time_Delivery.load();
		
		forms.addFilters('Time_Delivery', function(){
			return this.Time_Delivery.Text() == $MUI('Choisissez') ? '' : this.Text();	
		});
		//
		//
		//
		forms.Provider_ID = 		new Select({
			link:		$S.link,
			parameters:	'cmd=contact.list&options=' + Object.EncodeJSON({category:'provider', default:$MUI('Pas de fournisseur')})
		});
		
		forms.Provider_ID.Value(product.Provider_ID);
		forms.Provider_ID.load();
		
		forms.BtnAddProvider = new SimpleButton({icon:'add-element', nofill:true});
		//
		//
		//
		forms.Designer = 		new Select({
			link:		$S.link,
			parameters:	'cmd=contact.list&options=' + Object.EncodeJSON({category:'designer', default:$MUI('Pas de designer')})
		});
		forms.Designer.Value(product.Designer);
		forms.Designer.load();
		//
		//
		//
		forms.Collection = 		new Select({
			link:		$S.link,
			parameters:	'cmd=myevent.product.distinct&field=Collection&default=' + encodeURIComponent('Pas de collection')
		});
		forms.Collection.Value(product.Collection);
		forms.Collection.Input.readOnly = false;
		forms.Collection.load();
		
		forms.addFilters('Collection', function(){
			return this.Collection.Text() == $MUI('Pas de collection') ? '' : this.Collection.Text();	
		});
		//
		//
		//
		forms.Related_Collection = 		new Select({
			link:		$S.link,
			parameters:	'cmd=myevent.product.distinct&field=Collection&default=' + encodeURIComponent('Pas de collection')
		});
		
		forms.Related_Collection.Value(product.Related_Collection);
		forms.Related_Collection.load();
		
		forms.addFilters('Related_Collection', function(){
			return this.Related_Collection.Text() == $MUI('Pas de collection') ? '' : this.Related_Collection.Text();	
		});
		//
		//
		//
		forms.Parent_ID = 		new Select({
			link:		$S.link,
			parameters:	'cmd=myevent.menu.select.list&options=' + Object.EncodeJSON({exclude:product.Post_ID, default: false, draft:true})
		});
		
		forms.Parent_ID.Value(product.Parent_ID);
		
		if(product.Parent_ID == 0){
			forms.Parent_ID.on('complete', function(){
				forms.Parent_ID.selectedIndex(0);
			});
		}
		
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
		
		forms.Parent_ID.on('change', function(){
			forms.Parent_ID_2.setParameters('cmd=myevent.menu.select.list&options=' + Object.EncodeJSON({exclude:forms.Parent_ID.Value(), draft:true}));
			forms.Parent_ID_2.load();
			
			//ajout des critères de base de cette catégorie de produit
			
			self.loadSpecificities(win);
			
		});
		//
		//
		//
		forms.Parent_ID_2 = 		new ListBox({
			link:		$S.link,
			type:		'checkbox',
			parameters:	'cmd=myevent.menu.select.list&options=' + Object.EncodeJSON({exclude:forms.Parent_ID.Value(), draft:true})
		});
		
		forms.Parent_ID_2.Value(product.Parent_ID_2);
		forms.Parent_ID_2.css('height', '200px');
		
		forms.Parent_ID_2.on('draw', function(line){
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
		
		forms.Parent_ID_2.load();
		
		forms.addFilters('Parent_ID_2', function(){
			var a = [];
			
			this.Parent_ID_2.Value().each(function(data){
				a.push(data.value);
			});
			
			return a;
		});
		//
		//
		//
		
		forms.Expiry_Date = new InputCalendar({type:'datetime'});
		forms.Expiry_Date.Value(product.Expiry_Date != '0000-00-00 00:00:00' ? product.Expiry_Date : new Date());
		
		forms.Enable_Expiry_Date = new ToggleButton();
		forms.Enable_Expiry_Date.Value(product.Expiry_Date != '0000-00-00 00:00:00');
		
		forms.Enable_Expiry_Date.on('change', function(){
			if(this.Value()){
				forms.Expiry_Date.parentNode.parentNode.show();
			}else{
				forms.Expiry_Date.parentNode.parentNode.hide();
			}
		});	
		
		forms.addFilters('Expiry_Date', function(){
			
			return this.Enable_Expiry_Date.Value() ? this.Expiry_Date.Value() : '0000-00-00 00:00:00';
		});
				
		//Référencement
		
		//
		// Titre de référencement
		//
		forms.Title_Header = new Input({type:'text', value:product.Title_Header, maxLength:180});
		//
		// Keyword
		//
		forms.Keyword = 	new Input({type:'text', value:product.Keyword});
		//
		// Résumé pour le référencement / réseaux sociaux
		//
		forms.Summary = 	new TextArea({type:'text', value:product.Summary, maxLength:500});
		//
		// Nom du lien de la page produit
		//
		forms.Name =		new Input({type:'text', value:product.Name});
		forms.Name.on('keyup', function(evt){this.value = this.value.sanitize('-').toLowerCase();});
		//
		//
		//
		forms.Statut =		new ToggleButton();
		forms.Statut.Value(product.Statut.match(/publish/));
		//
		//
		//
		forms.Private =		new ToggleButton();
		forms.Private.Value(product.Statut.match(/private/));
		
		forms.addFilters('Statut', function(){
			return ((this.Statut.Value() ? 'publish' : '') + (!this.Private.Value() ? '' : ' private')).trim();
		});
		//
		//
		//
		panel.appendChild(new Node('h4', $MUI('Informations')));
		
		var table = 		new TableData();
		
		table.addHead($MUI('Titre du produit')).addCel(win.forms.Title).addRow();
		table.addHead($MUI('Code produit')).addCel(win.forms.Product_Code).addRow();
		table.addHead($MUI('Fournisseur')).addCel(win.forms.Provider_ID).addRow();
		table.addHead($MUI('Collection')).addCel(win.forms.Collection).addRow();
		table.addHead($MUI('Collection annexe')).addCel(win.forms.Related_Collection).addRow();
		table.addHead($MUI('Designer')).addCel(win.forms.Designer).addRow();
		table.addHead($MUI('Catégorie principale')).addCel(win.forms.Parent_ID).addRow();
		table.addHead($MUI('Autres catégories')).addCel(win.forms.Parent_ID_2);
		
		panel.appendChild(table);
		
		panel.appendChild(new Node('h4', $MUI('Prix & Logistique')));
		
		var table = 		new TableData();
		table.addClassName('liquid');
		table.addHead($MUI('Prix de vente'), {style:'width:180px'}).addCel(win.forms.Price);
		table.addHead($MUI('dont Eco taxe')).addCel(win.forms.Eco_Tax).addRow();
		table.addHead($MUI('Prix constaté')).addCel(win.forms.Standard_Price);
		table.addHead($MUI('Remise')).addCel(win.forms.Discount).addRow();
		table.addHead($MUI('Coût de livraison')).addCel(win.forms.Cost_Delivery);
		table.addHead($MUI('Stock')).addCel(win.forms.Stock).addRow();
		table.addHead($MUI('Temps de livraison')).addCel(win.forms.Time_Delivery, {colSpan:3}).addRow();
		table.addHead($MUI('Date de fin') + '?').addCel(win.forms.Enable_Expiry_Date, {colSpan:3}).addRow();
		table.addHead(' ').addCel(win.forms.Expiry_Date, {colSpan:3});
				
		panel.appendChild(table);
			
		if(forms.Enable_Expiry_Date.Value()){
			forms.Expiry_Date.parentNode.parentNode.show();
		}else{
			forms.Expiry_Date.parentNode.parentNode.hide();
		}	
		
		//
		// 
		//
		panel.appendChild(new Node('h4', $MUI('Publication')));
		
		var table = 		new TableData();
		
		table.addHead($MUI('Fiche publiée') + ' ?').addCel(win.forms.Statut).addRow();
		table.addHead($MUI('Fiche privée') + ' ?').addCel(win.forms.Private);
		
		panel.appendChild(table);
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
		
		System.BlogPress.Page.createPermalien(win, product);
		
		return panel;
	},
	
	createPanelDescription:function(win){
		var panel = new Panel({style:'padding:0px;height:500px;margin-left:-5px;margin-top:25px;'});
		
		panel.appendChild(System.BlogPress.Post.createWidgetEditor(win, {width:'650px', height:'460px', title:$MUI('Description')}));
		return panel;
	},
/**
 *
 **/	
	createPanelCriteres:function(win){
		var panel = new Panel();
		//
		// Gestion des dimensions
		//		
		this.createMultipleDimensionField(win, {
			node:	panel,
			field:	'Dimensions',
			label:	$MUI('Dimensions'),
		});
		//
		// Gestion des matières
		// 		
		this.createMultipleMatterField(win, {
			node:	panel,
			field:	'Matters',
			label:	$MUI('Matières'),
		});
		//
		// Gestion des couleurs
		//
		this.createMultipleColorField(win, {
			node:	panel,
			field:	'Colors',
			label:	$MUI('Couleurs'),
		});
		//
		// Gestion des Spécifités
		//	
		this.createMultipleSpecificityField(win, {
			node:	panel,
			field:	'Specificities',
			label:	$MUI('Spécificités'),
		});
		
		win.forms.addFilters('Criteres', function(){
			var a  = {};
			Object.setObject(a, this.Criteres);
			return a;			
		});
		
		return panel;
	},
/**
 *
 **/	
	createPanelPhotos:function(win){
		var panel = new Panel();
		this.createMultiplePictureField(win, {
			node:	panel,
			field:	'Pictures',
			label:	$MUI('Photos principales')
		});
		//
		// Gestion des dimensions
		//		
		this.createMultiplePictureField(win, {
			node:	panel,
			field:	'Galery',
			label:	$MUI('Galerie photos')
		});
		//
		// Gestion des matières
		// 		
		this.createMultipleShowcaseField(win, {
			node:	panel,
			field:	'Showcases',
			label:	$MUI('Showcase'),
		});
		
		return panel;
	},
/**
 *
 **/
	createMultipleDimensionField:function(win, options){
		var product = 	win.getData();
		var html = 		options.node;
				
		html.appendChild(new Node('h4', options.label));
		//
		//
		//
		var section =	new Node('div');
		html.appendChild(section);
		
		
		var array = 	win.forms.Criteres[options.field] =	[];
		var oArray =	product.Criteres[options.field] ? product.Criteres[options.field] : [];
		
		for(var i = 0; i < oArray.length; i++){
						
			var data = oArray[i];
			
			var current = {
				Critere_ID: win.getData().Post_ID == 0 ? 0 : data.Critere_ID,
				Name:		new InputMagic({type:'text', maxLength:100, value:data.name || '', style:'width:170px', value:data.Name}),
				Type:		'Dimension',
				
				Value:		{
					width: 	new Input({type:'number', decimal:2, style:'width:80px; text-align:right', value:data.Value.width}),
					depth:	new Input({type:'number', decimal:2, style:'width:80px; text-align:right', value:data.Value.depth}),
					height: new Input({type:'number', decimal:2, style:'width:80px; text-align:right', value:data.Value.height}),
					unit:	new Select()
				}
			};
			
			current.Name.addClassName('icon-edit-element');
			current.Name.Large(true);
			
			current.Value.unit.css('width', 110);
			current.Value.unit.setData([
				{text:$MUI('Millimètre (mm)'), value:'mm'},
				{text:$MUI('Centimètre (cm)'), value:'cm'},
				{text:$MUI('Mètre (cm)'), value:'m'}
			]);
			
			current.Value.unit.Value(data.Value.unit);
			
			var table = 		new TableData();
			table.addClassName('liquid');
			//
			//
			//
			var remove =		new SimpleButton({icon:'remove-element', nofill:true});
			remove.it = array.length;
			
			remove.on('click', function(){
				section.removeChild(this.parentNode.parentNode.parentNode.parentNode);
				array[this.it] = null;
			});
								
			table.addHead(current.Name);
			
			table.addCel($MUI('Largeur') + ' :', {style:'font-size:10px'}).addCel(current.Value.width);
			table.addCel($MUI('Profondeur') + ' :' , {style:'font-size:10px'}).addCel(current.Value.depth).addCel(remove).addRow();
			table.addHead(' ').addCel($MUI('Hauteur') + ' :' , {style:'font-size:10px'}).addCel(current.Value.height);
			table.addCel($MUI('Unité') + ' :' , {style:'font-size:10px'}).addCel(current.Value.unit).addRow();
			
			section.appendChild(table);
			
			array.push(current);
			
		}
			
		//
		// Ajout du product
		//
		var add = new SimpleMenu({icon:'add-element', text:options.label, nofill:true});
		add.addClassName('top');
		
		var labels = System.MyEvent.Product.LabelsDimensions;
		
		for(var key in labels){
						
			var le = new LineElement({text:$MUI(labels[key])});
			add.appendChild(le);
			le.name = key;
			
			le.on('click', function(){
								
				var current = {
					Critere_ID: 0,
					Name:		new InputMagic({type:'text', maxLength:100, value:$MUI(labels[this.name]), style:'width:170px'}),
					Type:		'Dimension',					
					Value:		{
						width: 	new Input({type:'number', decimal:2, style:'width:80px; text-align:right', value:0}),
						depth:	new Input({type:'number', decimal:2, style:'width:80px; text-align:right', value:0}),
						height: new Input({type:'number', decimal:2, style:'width:80px; text-align:right', value:0}),
						unit:	new Select()
					}
				};
				
				current.Name.addClassName('icon-edit-element');
				current.Name.Large(true);
				
				current.Value.unit.css('width', 110);
				current.Value.unit.setData([
					{text:$MUI('Millimètre (mm)'), value:'mm'},
					{text:$MUI('Centimètre (cm)'), value:'cm'},
					{text:$MUI('Mètre (cm)'), value:'m'}
				]);
				
				current.Value.unit.Value('cm');
				
				var table = 		new TableData();
				table.addClassName('liquid');
				
				var remove =		new SimpleButton({icon:'remove-element', nofill:true});
				remove.it = array.length;
			
				remove.on('click', function(){
					section.removeChild(this.parentNode.parentNode.parentNode.parentNode);
					array[this.it] = null;
				});
				
				table.addHead(current.Name);
										
				table.addCel($MUI('Largeur') + ' :', {style:'font-size:10px'}).addCel(current.Value.width);
				table.addCel($MUI('Profondeur') + ' :' , {style:'font-size:10px'}).addCel(current.Value.depth).addCel(remove).addRow();
				table.addHead(' ').addCel($MUI('Hauteur') + ' :' , {style:'font-size:10px'}).addCel(current.Value.height);
				table.addCel($MUI('Unité') + ' :' , {style:'font-size:10px'}).addCel(current.Value.unit).addRow();
				
				array.push(current);
								
				section.appendChild(table);
				
				win.MyEvent.PanelSwip.ScrollBar.refresh();
				win.MyEvent.PanelSwip.ScrollBar.scrollTo(table);
			});
		}
				
		html.appendChild(add);
	},
/**
 *
 **/
	createMultipleMatterField:function(win, options){
		var product = 	win.getData();
		var html = 		options.node;
				
		html.appendChild(new Node('h4', options.label));
		//
		//
		//
		var table = 		new TableData();
		html.appendChild(table);
		
		
		var array = 	win.forms.Criteres[options.field] =	[];
		var oArray =	product.Criteres[options.field] ? product.Criteres[options.field] : [];
		
		for(var i = 0; i < oArray.length; i++){
						
			var data = oArray[i];
			
			var current = {
				Critere_ID: win.getData().Post_ID == 0 ? 0 : data.Critere_ID,
				Name: 		new InputMagic({type:'text', maxLength:100, value:data.Name ||'N°' + (i+1), style:'width:150px'}),
				Type:		'Matter',
				
				Value:		new InputCompleter({
								button:		false,
								sync:		true,
								parameters:	'cmd=myevent.product.critere.distinct&field=Matter'
							})
			};
			
			current.Name.addClassName('icon-edit-element');
			current.Name.Large(true);
			current.Value.Text(data.Value);
			current.Value.css('width', 345);
			//
			//
			//
			var remove =		new SimpleButton({icon:'remove-element', nofill:true});
			remove.it = array.length;
			
			remove.on('click', function(){
				this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
				array[this.it] = null;
			});
									
			table.addHead(current.Name).addCel(current.Value).addCel(remove, {style:'width:auto !important'}).addRow();
					
			array.push(current);
			
		}
			
		//
		// Ajout du product
		//
		var add = new SimpleButton({icon:'add-element', text:options.label.replace(/s$/, ''), nofill:true});		
		var labels = System.MyEvent.Product.LabelsDimensions;
		
		add.on('click', function(){
				
			var current = {
				Critere_ID: 0,
				Name: 		new InputMagic({type:'text', maxLength:100, value:'N°' + (i+1), style:'width:150px'}),
				Type:		'Matter',
				
				Value:		new InputCompleter({
								button:		false,
								sync:		true,
								parameters:	'cmd=myevent.product.critere.distinct&field=Matter'
							})
			};
			
			current.Value.css('width', 345);
			current.Name.addClassName('icon-edit-element');
			current.Name.Large(true);
			//
			//
			//
			var remove =		new SimpleButton({icon:'remove-element', nofill:true});
			remove.it = array.length;
			remove.on('click', function(){
				this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
				array[this.it] = null;
			});	
								
			table.addHead(current.Name).addCel(current.Value).addCel(remove, {style:'width:auto !important'}).addRow();
					
			array.push(current);
			
			win.MyEvent.PanelSwip.ScrollBar.refresh();
			win.MyEvent.PanelSwip.ScrollBar.scrollTo(table);
		});
		
				
		html.appendChild(add);
	},
/**
 *
 **/
	createMultipleColorField:function(win, options){
		var product = 	win.getData();
		var html = 		options.node;
				
		html.appendChild(new Node('h4', options.label));
		//
		//
		//
		var table = 		new TableData();
		table.addClassName('liquid');
		html.appendChild(table);
		
		
		var array = 	win.forms.Criteres[options.field] =	[];
		var oArray =	product.Criteres[options.field] ? product.Criteres[options.field] : [];
		
		for(var i = 0; i < oArray.length; i++){
						
			var data = oArray[i];
			
			var current = {
				Critere_ID: win.getData().Post_ID == 0 ? 0 : data.Critere_ID,
				Name: 		data.Name ||'N°' + (i+1),
				Type:		'Color',
				
				Value:		{
					name:	new InputCompleter({
								button:		false,
								sync:		true,
								parameters:	'cmd=myevent.product.critere.distinct&field=Color'
							}),
					color:	new InputColor()
				}
			};
			
			current.Value.name.Text(data.Value.name);
			current.Value.name.css('width', 203);
			current.Value.color.css('width', 130);
			current.Value.color.Value(data.Value.color);
			
			current.Value.name.on('change', function(){
				current.Value.color.Value(this.Current().data.color);
			});
			//
			//
			//
			var remove =		new SimpleButton({icon:'remove-element', nofill:true});
			remove.it = array.length;
		
			remove.on('click', function(){
				section.removeChild(this.parentNode.parentNode.parentNode.parentNode);
				array[this.it] = null;
			});
									
			table.addHead(current.Name, {style:'width:180px'}).addCel(current.Value.name).addCel(current.Value.color).addCel(remove, {style:'width:auto !important'}).addRow();
					
			array.push(current);
			
		}
			
		//
		// Ajout du product
		//
		var add = new SimpleButton({icon:'add-element', text:options.label.replace(/s$/, ''), nofill:true});		
		var labels = System.MyEvent.Product.LabelsDimensions;
		
		add.on('click', function(){
				
			var current = {
				Critere_ID: 0,
				Name: 		'N°' + (array.length + 1),
				Type:		'Color',
				
				Value:		{
					name:	new InputCompleter({
								button:		false,
								sync:		true,
								parameters:	'cmd=myevent.product.critere.distinct&field=Color'
							}),
					color:	new InputColor()
				}
			};
						
			//current.Value.name.Text(data.Value.name);
			current.Value.name.css('width', 203);
			current.Value.color.css('width', 130);
			
			current.Value.name.on('change', function(){
				current.Value.color.Value(this.Current().data.color);
			});
			//current.Value.color.Value(data.Value.color);
			//
			//
			//
			var remove =		new SimpleButton({icon:'remove-element', nofill:true});
			remove.it = array.length;
			
			remove.on('click', function(){
				section.removeChild(this.parentNode.parentNode.parentNode.parentNode);
				array[this.it] = null;
			});
									
			table.addHead(current.Name, {style:'width:180px'}).addCel(current.Value.name).addCel(current.Value.color).addCel(remove, {style:'width:auto !important'}).addRow();
					
			array.push(current);
			
			win.MyEvent.PanelSwip.ScrollBar.refresh();
			win.MyEvent.PanelSwip.ScrollBar.scrollTo(table);
		});
		
				
		html.appendChild(add);
	},
/**
 *
 **/
	createMultipleSpecificityField:function(win, options){
		var product = 	win.getData();
		var html = 		options.node;
				
		html.appendChild(new Node('h4', options.label));
		//
		//
		//
		var table = 		new TableData();
		html.appendChild(table);
		
		
		var array = 	win.forms.Criteres[options.field] =	[];
		var oArray =	product.Criteres[options.field] ? product.Criteres[options.field] : [];
		
		for(var i = 0; i < oArray.length; i++){
						
			var data = oArray[i];
			
			var current = {
				Critere_ID: win.getData().Post_ID == 0 ? 0 : data.Critere_ID,
				Name:		new InputMagic({type:'text', maxLength:100, value:data.name || '', style:'width:151px', value:data.Name}),
				Type:		'Specificity',
				Value:		new Input({type:'text', value:data.Value, style:'width:342px'})
			};
			
			current.Name.addClassName('icon-edit-element');
			current.Name.Large(true);
			//
			//
			//
			var remove =		new SimpleButton({icon:'remove-element', nofill:true});
			remove.it = array.length;
			
			remove.on('click', function(){
				this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
				array[this.it] = null;
			});
								
			table.addHead(current.Name).addCel(current.Value).addCel(remove).addRow();
						
			array.push(current);
			
		}
			
		//
		// Ajout du product
		//
		var add = win.MenuSpecifities = new SimpleMenu({icon:'add-element', text:options.label.replace(/s$/, ''), nofill:true});
		add.addClassName('bottom');
				
		html.appendChild(add);
		
		add.setLabels = function(labels){
			
			add.clear();
			
			for(var i = 0; i < labels.length; i++){
							
				var le = new LineElement({text:$MUI(labels[i].text || labels[i])});
				add.appendChild(le);
				le.name = labels[i].text || labels[i];
				
				le.on('click', function(){
									
					var current = {
						Critere_ID: 0,
						Name:		new InputMagic({type:'text', maxLength:100, value:$MUI(this.name), style:'width:152px'}),
						Type:		'Specificity',					
						Value:		new Input({type:'text', value:'', style:'width:342px'})
					};
					
					current.Name.addClassName('icon-edit-element');
					current.Name.Large(true);
										
					var remove =		new SimpleButton({icon:'remove-element', nofill:true});
					remove.it = array.length;
				
					remove.on('click', function(){
						section.removeChild(this.parentNode.parentNode.parentNode.parentNode);
						array[this.it] = null;
					});
					
					remove.on('click', function(){
						this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
						array[this.it] = null;
					});
										
					table.addHead(current.Name).addCel(current.Value).addCel(remove).addRow();
					
					array.push(current);
					
					win.MyEvent.PanelSwip.ScrollBar.refresh();
					win.MyEvent.PanelSwip.ScrollBar.scrollTo(table);
				});
			}
			
		};
		
		this.loadSpecificities(win);
		
		add.setLabels([{text:'Autre'}]);
	},
/**
 *
 **/
	createMultiplePictureField:function(win, options){
		var product = 	win.getData();
		var html = 		options.node;
				
		html.appendChild(new Node('h4', options.label));
		//
		//
		//
		var section =	new Node('div');
		html.appendChild(section);
		
		
		var array = 	win.forms.Criteres[options.field] =	[];
		var oArray =	product.Criteres[options.field] ? product.Criteres[options.field] : [];
		
		for(var i = 0; i < oArray.length; i++){
						
			var data = oArray[i];
			
			var current = {
				Critere_ID: win.getData().Post_ID == 0 ? 0 : data.Critere_ID,
				Type:		options.field == 'Pictures' ? 'Picture' : 'Galery',
			};
			
			var button = new System.MyEvent.Product.Picture({
				icon:	data.Value || '',
				text:	data.Name || $MUI('Photo') + ' ' + 'N°' + (array.length+1)
			});
			
			button.it = array.length;
									
			current.Name = 	button.Name;
			current.Value = button.Value;
			
			button.BtnRemove.on('click', function(){
				section.removeChild(this);
				array[this.it] = null;
			}.bind(button));
			
			section.appendChild(button);
			array.push(current);
			
			//button.
		}
			
		//
		// Ajout du product
		//
		var add = new SimpleButton({icon:'add-element', text:$MUI('Photo'), nofill:true});
		add.addClassName('top');
		
		add.on('click', function(){
								
			var data = oArray[i];
			
			var current = {
				Critere_ID: 0,
				Type:		options.field == 'Pictures' ? 'Picture' : 'Galery'
			};
			
			var button = new System.MyEvent.Product.Picture({
				icon:	'',
				text:	$MUI('Photo') + ' ' + 'N°' + (array.length+1)
			});
			
			button.it = array.length;
									
			current.Name = 	button.Name;
			current.Value = button.Value;
			
			button.BtnRemove.on('click', function(){
				section.removeChild(this);
				array[this.it] = null;
			}.bind(button));
			
			section.appendChild(button);
			array.push(current);
				
			win.MyEvent.PanelSwip.ScrollBar.refresh();
			win.MyEvent.PanelSwip.ScrollBar.scrollTo(button);
			
		});
				
		html.appendChild(add);
	},

/**
 *
 **/
	createMultipleShowcaseField:function(win, options){
		var product = 	win.getData();
		var html = 		options.node;
				
		html.appendChild(new Node('h4', options.label));
		//
		//
		//
		var section =	new Node('div');
		html.appendChild(section);
		
		
		var array = 	win.forms.Criteres[options.field] =	[];
		var oArray =	product.Criteres[options.field] ? product.Criteres[options.field] : [];
		
		for(var i = 0; i < oArray.length; i++){
						
			var data = oArray[i];
			
			var current = {
				Critere_ID: win.getData().Post_ID == 0 ? 0 : data.Critere_ID,
				Type:		'Showcase'
			};
			
			var button = new System.MyEvent.Product.Picture({
				icon:		data.Value.src || '',
				text:		data.Name || $MUI('Photo') + ' ' + 'N°' + (array.length+1),
				subText:	data.Value.content || ''
			});
			
			button.it = array.length;
									
			current.Name = 	button.Name;
			current.Value = {
				src:		button.Value,
				content:	button.Content	
			};
			
			button.BtnRemove.on('click', function(){
				section.removeChild(this);
				array[this.it] = null;
			}.bind(button));
			
			section.appendChild(button);
			array.push(current);
			
			//button.
		}
			
		//
		// Ajout du product
		//
		var add = new SimpleButton({icon:'add-element', text:$MUI('Photo'), nofill:true});
		add.addClassName('top');
		
		add.on('click', function(){
								
			var data = oArray[i];
			
			var current = {
				Critere_ID: 0,
				Type:		'Showcase'
			};
			
			var button = new System.MyEvent.Product.Picture({
				icon:		'',
				text:		$MUI('Photo') + ' ' + 'N°' + (array.length+1),
				subText:	''
			});
			
			button.it = array.length;
									
			current.Name = 	button.Name;
			current.Value = {
				src:		button.Value,
				content:	button.Content	
			};
			
			button.BtnRemove.on('click', function(){
				section.removeChild(this);
				array[this.it] = null;
			}.bind(button));
			
			section.appendChild(button);
			array.push(current);
				
			win.MyEvent.PanelSwip.ScrollBar.refresh();
			win.MyEvent.PanelSwip.ScrollBar.scrollTo(button);
			
		});
				
		html.appendChild(add);
	},
/**
 * System.MyEvent.Product.submit(win) -> void
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
		
		var product =				win.forms.save(win.getData());
		product.Type = 				'page-myevent product';
		product.Template = 			'page-myevent-product.php';
		product.Comment_Statut = 	'close';
				
		$S.fire('myevent.product:open.submit', win);
		
		win.MyEvent.Progress.show();
		
		product.commit(function(){
			$S.trace(this);
			//System.MyEvent.Product.open(win, product);
			win.setData(this);
			System.MyEvent.Product.load(win);
		});
		
		return this;
	},
/**
 *
 **/	
	listing:function(win){
		
		var panel = win.MyEvent;
		
		System.MyEvent.setCurrent('product');
		
		if(!this.NavBar){
			
			this.NavBar = new NavBar( {
				range1:50,
				range2:100,
				range3:300
			});
			this.NavBar.on('change', this.load.bind(this));
			
			this.NavBar.Collection = new Select({
				link:		$S.link,
				parameters:	'cmd=myevent.product.distinct&field=Collection&default=' + encodeURIComponent('Toutes les collections')
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
		
		this.NavBar.setMaxLength(0);
			
		$S.exec('myevent.product.list', {
			parameters:'options=' + Object.EncodeJSON({draft:true, Collection:this.NavBar.Collection.Value(), op:op, statistics:true}) + '&clauses=' + this.NavBar.getClauses().toJSON(),
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
					//System.MyEvent.Product.open(win);	
				//}
				
				this.NavBar.PrintAll.innerHTML = 			$MUI('Afficher tout') + '(' + obj.NbAll + ')';
				this.NavBar.PrintNotExpired.innerHTML = 	$MUI('Offres en cours') + '(' + obj.NbNotExpired + ')';
				this.NavBar.PrintExpired.innerHTML = 		$MUI('Offres expirées') + '(' + obj.NbExpired + ')';
				
				this.NavBar.setMaxLength(obj.maxLength);
				
				try{		
				
					var letter = '';
					
					for(var i = 0; i < array.length;  i++){
						if(array[i].Title.slice(0,1).toUpperCase() != letter){
							letter = array[i].Title.slice(0,1).toUpperCase() ;
							panel.PanelBody.Body().appendChild(new Node('h2', {className:'letter-group'}, letter)); 
						}
						
						var data =		new System.MyEvent.Product(array[i]);
						var button =	new System.MyEvent.Product.Button({
							icon:		data.getPictures(0),
							price:		array[i].Price,
							text:		array[i].Title,
							subTitle:	array[i].Collection == '' ? $MUI('Pas de collection') :  ($MUI('Collection') + ' ' + array[i].Collection),
						});
						
						if(array[i].Expiry_Date != '0000-00-00 00:00:00'){
							if(array[i].Expiry_Date < new Date().format('Y-m-d H:i:s')){
								button.setTag($MUI('Expiré'));
							}
						}
						
						button.data = array[i];
						panel.PanelBody.Body().appendChild(button);
						
						button.addClassName('hide');
						
						button.on('click', function(){
							System.MyEvent.Product.open(win, this.data);	
						});
						
						button.BtnRemove.on('click', function(evt){
							evt.stop();
							System.MyEvent.Product.remove(win, this.data);
						}.bind(button));
						
						button.BtnDuplicate.on('click', function(evt){
							evt.stop();
							
							var product = new System.MyEvent.Product(this.data);
							product.Post_ID = 0;
							product.Criteres.Pictures = [];
							product.Criteres.Showcases = [];
							product.Criteres.Galery = [];
														
							System.MyEvent.Product.open(win, product);
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
	
	loadSpecificities:function(win){
		$S.exec('myevent.menu.critere.distinct',{
			parameters:'field=Name&Post_ID=' + win.forms.Parent_ID.Value(),
			onComplete:function(result){
				try{
					var obj = $A(result.responseText.evalJSON());
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				obj.push({text:'Autre'});
				
				win.MenuSpecifities.setLabels(obj);
			}.bind(this)
		});
	},
/**
 * System.MyEvent.Product.remove(win product) -> void
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(win, product){
		product = new System.MyEvent.Product(product);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer le produit') + ' ' + product.Title + ' ? ', $MUI('Collection') + ' : ' +  product.Collection);
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = win.createBox();
		
		box.setTitle($MUI('Suppression du produit')).a(splite).setIcon('delete').setType().show();
		
		$S.fire('myevent.product:remove.open', box);
		
		box.reset({icon:'cancel'});
						
		box.submit({
			text:$MUI('Supprimer le produit'),
			icon:'delete',
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('myevent.product:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				product.remove(function(){
					box.hide();
						
					$S.fire('myevent.product:remove.submit.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('Le produit a bien été supprimé'));
					splite.setIcon('valid-48');
					
					
					box.setTitle($MUI('Confirmation')).setContent(splite).setType('CLOSE').Timer(5).show();
					box.setIcon('documentinfo');
					
					System.MyEvent.setCurrent('product');
				}.bind(this));
				
			}.bind(this)
		});
	}
});
/** section: Core
 * class System.MyEvent.Product.Button
 **/
System.MyEvent.Product.Button = Class.from(AppButton);
System.MyEvent.Product.Button.prototype = {
	
	className:'wobject market-button store-button overable',
/**
 * new System.MyEvent.Product.Button([options])
 **/	
	initialize:function(obj){
		
		var options = {
			price: 		0,
			note:		0,
			nbNote:		0,
			subTitle:	$MUI('All'),
			overable:	true,
			checkbox:	false,
			tag:		false,
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
		//
		//
		//
		this.BtnDuplicate = new SimpleButton({nofill:true, icon:'duplicate-element'});
		this.BtnDuplicate.addClassName('btn-duplicate');
				
		this.setRating(options.note, options.nbNote);
		
		this.appendChild(this.SubTitle);
		this.appendChild(this.Price);
		this.appendChild(this.BtnRemove);
		this.appendChild(this.BtnDuplicate);
		
		if(options.tag){
			//this.addClassName('update');
			this.setTag(Object.iString(options.tag) ? options.tag : $MUI('Expiré'));
		}
		
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
/**
 * System.MyEvent.Product.Button#setPrice(price) -> System.MyEvent.Product.Button
 **/	
	setPrice:function(price){
		this.Price.innerHTML = price + ' €';
		return this;
	},
/**
 * System.MyEvent.Product.Button#setSubTitle(price) -> System.MyEvent.Product.Button
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

System.MyEvent.Product.Picture =  Class.from(AppButton);
	
System.MyEvent.Product.Picture.prototype = {
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
			parameters:	'cmd=myevent.product.import'
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

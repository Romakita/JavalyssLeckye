/** section: MyStore
 * class System.BlogPress.Link
 *
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : blogpress_link.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.BlogPress.Link = Class.createAjax({
/**
 * System.BlogPress.Link#Link_ID -> Number
 * Numéro d'identification du lien.
 **/
	Link_ID: 			0,
/**
 * System.BlogPress.Link#Title -> String
 * Titre du lien.
 **/
	Title:				'',
/**
 * System.BlogPress.Link#Category -> String
 * Categorie du poste.
 **/
	Category:			'Liens;',
/**
 * System.BlogPress.Link#Uri -> String
 * Adresse du lien.
 **/
	Uri:				'',
/**
 *System.BlogPress.Link#Statut -> String
 * Etat de l'article.
 **/
	Statut:				1,
/**
 * System.BlogPress.Link#Relation -> String
 * Relation du lien par rapport au site.
 **/
	Relation:			'',
/**
 * System.BlogPress.Link#Description -> String
 * Description du lien.
 **/
	Description:		'',
/**
 * System.BlogPress.Link#Target -> String
 * Cible du lien.
 **/
	Target:				'_none',
/**
 * System.BlogPress.Link#Order -> Number
 * Ordonnancement de la liste.
 **/
	Order:				0,
/**
 * System.BlogPress.Link#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		$S.exec('blogpress.link.commit', {
			
			parameters: 'BlogPressLink=' + this.toJSON(),
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
 * System.BlogPress.Link#delete(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback){
		$S.exec('blogpress.link.delete',{
			parameters: 'BlogPressLink=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	}
});

Object.extend(System.BlogPress.Link, {
/** 
 * System.BlogPress.Link.open() -> void
 * Cette méthode ouvre le panneau de gestion des produits.
 **/	
	open:function(win, link){
						
		try{
		
		var panel = win.BlogPress;
		
		win.setData(link = new System.BlogPress.Link(link));
		var forms = win.createForm();
		//
		// Réinitialisation du contenu
		//		
		panel.clearSwipAll();
		panel.Open(true, 650);
		//
		//
		//
		panel.PanelSwip.addPanel($MUI('Informations'), this.createPanel(win));
				
		var submit = new SimpleButton({text:$MUI('Enregistrer')});
		
		submit.on('click', function(){
			
			System.BlogPress.Link.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('blogpress.link:open', win);
				
		return;
		
		}catch(er){$S.trace(er)}
		
	},
/**
 *
 **/	
	createPanel:function(win){
		//var panel = win.MyStore;	
		var link = 		win.getData();
		var forms = 	win.createForm();
		var self =		this;
		var panel = 	new Panel();
		// 
		//
		forms.Title = 		new Input({value:link.Title, type:'text', maxLength:255, style:'width:98%'});
		forms.Title.placeholder = $MUI('Saisissez ici le nom de votre lien');
		//
		// 
		//
		//forms.Uri = 		new Input({value:link.Uri, type:'text', maxLength:255, style:'width:300px'});
		forms.Uri =			new InputCompleter({
			link:			$S.link,
			parameters:		'op=blogpress.post.list&options=' + Object.EncodeJSON({op:'-completer', draft:true, Type:'like page'})
		});
		
		forms.Uri.Input.placeholder = $MUI('Saisissez ici l\'adresse de votre lien');
		forms.Uri.Value(link.Uri);
		forms.Uri.on('keyup', function(evt){
			if(Event.getKeyCode(evt) != 13) this.value = '';
		});
		//
		// 
		//
		forms.Description = new Input({value:link.Description, type:'text', maxLength:255});
		forms.Description.placeholder = $MUI('Saisissez ici une description pour votre lien');
		//
		//
		//
		forms.Order = new Input({type:'number', decimal: 0, value:link.Order, style:'width:40px; text-align:right', maxLength:2});
		forms.Order.on('change', function(){
			if(this.Value() == ''){
				this.Value(0);
			}
		});
		//
		//
		//
		forms.Category =		new Select({
			parameters:			'cmd=blogpress.category.list&options=' + Object.EncodeJSON({Type:'link'}),
			multiple:			true
		});
		
		forms.Category.on('complete', function(){
			forms.Category.Value(link.Category.split(';'));
		});
		
		forms.Category.load();
				
		forms.addFilters('Category', function(){
			var a = [];
			
			this.Category.Value().each(function(e){
				a.push(e.text);
			});
			
			return a.join(';');
		});
		//
		// 
		//
		forms.Target = 		new ToggleButton({yes:'I', no:'O'});
		forms.Target.Value(link.Target == '_blank');
		
		forms.addFilters('Target', function(){
			return this.Target.Value() ? '_blank' : '_none';
		});
		
		panel.appendChild(forms.Title);
		//
		//
		//
		var buttonAddCat = 			new SimpleButton({icon:'add-element', nofill:true});
		buttonAddCat.on('click', function(evt){
			System.BlogPress.Link.openAddCategory(evt, win);
		});
		
		var table = new TableData();
				
		table.addHead($MUI('Adresse du lien') + ' : ', {width:190}).addCel(forms.Uri).addRow();
		table.addHead($MUI('Catégorie') + ' : ').addCel(forms.Category).addCel(buttonAddCat, {style:'width:20px'}).addRow();
		table.addHead($MUI('Description') + ' : ').addCel(forms.Description).addRow();
		table.addHead($MUI('Ordre') + ' : ').addCel(forms.Order).addRow();
		
		table.addHead($MUI('Nouvelle page') + ' ?').addCel(forms.Target);
		
		panel.appendChild(table);
		
		//
		//
		//
		forms.Relation = new Input({type:'text', maxlength:'255', value:link.Relation});
		//
		//
		//
		forms.Identity = new ToggleButton();
		forms.Identity.Value(link.Relation.match(/me/));
		//
		//
		//
		forms.Friend =	new Select();
		forms.Friend.setData([
			{value:'', text:$MUI('Aucune')},
			{value:'friend', text:$MUI('Amie')},
			{value:'contact', text:$MUI('Contact')},
			{value:'acquaintance', text:$MUI('Connaissance')}
		]);
		
		forms.Friend.Value('');
		
		if(link.Relation.match(/friend/)){
			forms.Friend.Value('friend');	
		}
		if(link.Relation.match(/contact/)){
			forms.Friend.Value('contact');	
		}
		if(link.Relation.match(/acquaintance/)){
			forms.Friend.Value('acquaintance');	
		}
		//
		//
		//
		forms.Met = 		new ToggleButton();
		forms.Met.Value(link.Relation.match(/met /));
		//
		//
		//
		forms.CoWorker = 	new ToggleButton();
		forms.CoWorker.Value(link.Relation.match(/co-worker/));
		//
		//
		//
		forms.Colleague = 	new ToggleButton();
		forms.Colleague.Value(link.Relation.match(/colleague/));
		//
		//
		//
		forms.Location = new Select();
		forms.Location.setData([
			{value:'', text:$MUI('Aucune')},
			{value:'co-resident', text:$MUI('Collocataire')},
			{value:'neighbor', text:$MUI('Voisin')}
		]);
		
		forms.Location.Value('');
		
		if(link.Relation.match(/co-resident/)){
			forms.Location.Value('co-resident');	
		}
		if(link.Relation.match(/neighbor/)){
			forms.Location.Value('neighbor');	
		}
		//
		//
		//
		forms.Family = new Select();
		forms.Family.setData([
			{value:'', text:$MUI('Aucune')},
			{value:'child', text:$MUI('Enfant')},
			{value:'kin', text:$MUI('Apparenté')},
			{value:'parent', text:$MUI('Parent')},
			{value:'sibling', text:$MUI('Frère/soeur')},
			{value:'spouse', text:$MUI('Conjoint')}
		]);
		
		forms.Family.Value('');
		
		if(link.Relation.match(/child/)){
			forms.Family.Value('child');	
		}
		if(link.Relation.match(/kin/)){
			forms.Family.Value('kin');	
		}
		if(link.Relation.match(/parent/)){
			forms.Friend.Value('parent');	
		}
		if(link.Relation.match(/spouse/)){
			forms.Friend.Value('spouse');
		}
		
		forms.Custom = new Input({type:'text', value:link.Relation.replace(/child|kin|parent|spouse|co-resident|neighbor|colleague|co-worker|met|acquaintance|contact|friend|me/gi, '').trim()});
		
		panel.appendChild(new Node('h4', $MUI('Relation')));
		
		var table = new TableData();
		
		table.addHead($MUI('Adresse interne') + " :", {width:130}).addCel(forms.Identity, {style:'height:30px'}).addRow();
		table.addHead($MUI('Amitié') + " :").addCel(forms.Friend).addRow();
		table.addHead($MUI('Rencontré') + " :").addCel(forms.Met, {style:'height:30px'}).addRow();
		table.addHead($MUI('Collègue de travail') + " :").addCel(forms.CoWorker, {style:'height:30px'}).addRow();
		table.addHead($MUI('Confrère') + " :").addCel(forms.Colleague, {style:'height:30px'}).addRow();
		table.addHead($MUI('Géographique') + " :").addCel(forms.Location).addRow();
		table.addHead($MUI('Famille') + " :").addCel(forms.Family).addRow();
		table.addHead($MUI('Personnalisé') + " :").addCel(forms.Custom).addRow();
		
		table.addHead($MUI('Résultat') + " :").addCel(forms.Relation).addRow();
		
		if(forms.Identity.Value()){
			forms.Friend.parentNode.parentNode.hide();
			forms.Met.parentNode.parentNode.hide();
			forms.CoWorker.parentNode.parentNode.hide();
			forms.Colleague.parentNode.parentNode.hide();
			forms.Location.parentNode.parentNode.hide();
			forms.Family.parentNode.parentNode.hide();	
		}
		
		forms.Relation.on('change', function(){this.onChangeRelation(win)}.bind(this));
		forms.Identity.on('change', function(){this.onChangeRelation(win)}.bind(this));
		forms.Friend.on('change', function(){this.onChangeRelation(win)}.bind(this));
		forms.Met.on('change', function(){this.onChangeRelation(win)}.bind(this));
		forms.CoWorker.on('change', function(){this.onChangeRelation(win)}.bind(this));
		forms.Colleague.on('change', function(){this.onChangeRelation(win)}.bind(this));
		forms.Location.on('change', function(){this.onChangeRelation(win)}.bind(this));
		forms.Family.on('change', function(){this.onChangeRelation(win)}.bind(this));
		forms.Custom.on('change', function(){this.onChangeRelation(win)}.bind(this));
		
		panel.appendChild(table);
		
		return panel;
	},
	
	onChangeRelation: function(win){
		try{
			
		var link = 		win.getData();
		var forms = 	win.createForm();
		var self =		this;
		
		var str = 	'';
		
		if(forms.Identity.Value()){
			forms.Friend.parentNode.parentNode.hide();
			forms.Met.parentNode.parentNode.hide();
			forms.CoWorker.parentNode.parentNode.hide();
			forms.Colleague.parentNode.parentNode.hide();
			forms.Location.parentNode.parentNode.hide();
			forms.Family.parentNode.parentNode.hide();
			
			str = 'me ';
			if(forms.Custom.Value() != ''){
				str += forms.Custom.Value() + ' ';
			}
			
			forms.Relation.Value(str.trim());
			return;
		}
		
		forms.Friend.parentNode.parentNode.show();
		forms.Met.parentNode.parentNode.show();
		forms.CoWorker.parentNode.parentNode.show();
		forms.Colleague.parentNode.parentNode.show();
		forms.Location.parentNode.parentNode.show();
		forms.Family.parentNode.parentNode.show();
		
		if(forms.Friend.Value() != ''){
			str += forms.Friend.Value() + ' ';
		}
		
		if(forms.Met.Value()){
			str += 'met ';
		}
		
		if(forms.CoWorker.Value()){
			str += 'co-worker ';
		}
		
		if(forms.Colleague.Value()){
			str += 'colleague ';
		}
		
		if(forms.Location.Value() != ''){
			str += forms.Location.Value() + ' ';
		}
		
		if(forms.Family.Value() != ''){
			str += forms.Family.Value() + ' ';
		}
		
		
		
		forms.Relation.Value(str.trim());
		
		}catch(er){$S.trace(er)}
	},
/**
 * System.BlogPress.Link.submit(win) -> void
 **/	
	submit:function(win){
		var forms = win.createForm();
				
		win.Flag.hide();
			
		if(forms.Title.Value() == '') {
			win.Flag.setText($MUI('Veuillez saisir un nom pour votre lien'));
			win.Flag.show(forms.Title);
			return true;
		}
		
		var link =				win.forms.save(win.getData());
				
		$S.fire('blogpress.link:open.submit', win);
		
		win.BlogPress.Progress.show();
		
		link.commit(function(){
			
			$S.fire('blogpress.link:open.submit.complete', win);
			
			System.BlogPress.Link.listing(win);
			System.BlogPress.Link.open(win, link);
		});
		
		return this;
	},
/**
 *
 **/	
	listing:function(win){
		
		var panel = win.BlogPress;
		
		System.BlogPress.setCurrent('link');
				
		var add = new Node('span', {className:'add icon icon-add-element', value:'Add'}, $MUI('Ajouter'));
		add.on('click', function(){
			System.BlogPress.Link.open(win);
		});
		
		panel.PanelBody.Header().appendChilds([
			add
		]);
		
		//panel.PanelBody.Body().appendChild(this.Table);
		
		//this.NavBar.getClauses().page = 0;
		
		this.load();
		
	},
	
	load:function(){
		var win =	$WR.getByName('blogpress');
		var panel = win.BlogPress;
		
		$S.exec('blogpress.link.group.list', {
			
			onComplete:function(result){
				
				try{
					var array = result.responseText.evalJSON();
				}catch(er){
					alert(er);
					return;	
				}
				
				if(array.length == 0){
					System.MyStore.Menu.open(win);	
				}
				
				try{		
					var height = 0;
					
					for(var key in array){
						var menu = new System.BlogPress.Link.Item({
							title:	key,
							data:	array[key],
							
							click:	function(evt){
								evt.stop();								
								System.BlogPress.Link.open(win, this.data);
								return false;
							},
							
							remove:function(evt){
								evt.stop();								
								System.BlogPress.Link.remove(win, this.data);
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
	
	openAddCategory:function(evt, win){
		try{
			
		var bubble = win.createBubble();
		//
		//
		//
		var submit = 	new SimpleButton({type:'submit', text:$MUI('Ajouter')});
		submit.css('margin-right', '10px');
		//
		//
		//
		var close =	new SimpleButton({ text:$MUI('Annuler')});
				
		close.on('click', function(){
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
			submit,
			close
		]);
		
		submit.on('click', function(){
			
			if(input.Value() == ''){
				bubble.hide();
				return;	
			}
			
			var category = new System.BlogPress.Category();
			category.Name = input.Value();
			category.Type =	'link';
			
			bubble.hide();
			
			category.commit(function(){
				win.createForm().Category.load();
			});
			
		});
		
		bubble.show(evt, html);
		input.focus();
		
		}catch(er){$S.trace(er)}
	},
/**
 * System.BlogPress.Link.remove(win link) -> void
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(win, link){
		link = new System.BlogPress.Link(link);
		//
		// Splite
		//
		var splite = 			new SpliteIcon($MUI('Voulez-vous vraiment supprimer le lien') + ' ? ', $MUI('Lien') + ' : ' + link.Title);
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = win.AlertBox;
		
		box.setTitle($MUI('Suppression du lien')).a(splite).setIcon('delete').setType().show();
		
		
		box.getBtnReset().setIcon('cancel');
		box.getBtnSubmit().setIcon('delete').setText('Supprimer le lien');
		
		$S.fire('link:remove.open', box);
				
		box.submit(function(){
			
			var evt = new StopEvent(box);
			$S.fire('link:remove.submit', evt);
			
			if(evt.stopped)	return true;
			
			link.remove(function(){
				box.hide();
					
				$S.fire('link:remove.complete', evt);
				
				//
				// Splite
				//
				var splite = new SpliteIcon($MUI('Le lien a bien été supprimé'), $MUI('Lien') + ' : ' + link.Title);
				splite.getChildLeft().setStyle('background-position:center');
				splite.setIcon('valid-48');
				
				
				box.setTitle($MUI('Confirmation')).setContent(splite).setType('CLOSE').Timer(5).show();
				box.getBtnReset().setIcon('cancel');
				box.setIcon('documentinfo');
				
				this.listing(win);
				
			}.bind(this));
			
		}.bind(this));
	}
});

System.BlogPress.Link.Item = Class.createElement('ul');

System.BlogPress.Link.Item.prototype = {
/**
 *
 **/	
	initialize:function(options){
		
		var data = options.data;
				
		this.addClassName('wobject menu-item');
		
		this.btnRemove = new SimpleButton({nofill:true, icon:'remove-element-2'});
		
		this.header = 	new Node('li', {className:'wrap-header'}, [new Node('span', options.title || data.Title), this.btnRemove]);
		this.body =		new Node('li', {className:'wrap-body'});
		
		this.data = 	data;
		
		this.appendChild(this.header);
		
		this.on('click', options.click);
		
		if(Object.isUndefined(options.title)){
			this.btnRemove.on('click', options.remove.bind(this));
		}else{
			this.btnRemove.hide();
		}
		
		if(data.length){
			this.appendChild(this.body);
			this.addClassName('have-children');
			
			for(var i = 0; i < data.length; i++){
				
				this.body.appendChild(new System.BlogPress.Link.Item({
					data:	data[i],
					click:	options.click,
					remove:	options.remove
				}));
			}
		}
	}
};
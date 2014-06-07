/** section: Newsletter
 * class NewsletterModel
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : newsletter_model.php.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.Newsletter.Model = Class.createAjax({
/**
 * System.Newsletter.Model#Model_ID -> Number
 **/
	Model_ID: 	0,
/**
 * System.Newsletter.Model#Title -> String
 * Varchar
 **/
	Title: 		"",
/**
 * System.Newsletter.Model#Content -> String
 * Longtext
 **/
	Content: 	"",
	
	Preview:	'',
/**
 * System.Newsletter.Model#commit(callback [, error]) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		System.exec('newsletter.model.commit', {
			
			parameters: 'NewsletterModel=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					
					System.trace(result.responseText);
					
					if(Object.isFunction(error)){
						error.call(this, result.responseText);
					}
					return;	
				}
				
				if(Object.isFunction(callback)){
					callback.call(this, this);
				}
				
			}.bind(this)
			
		});
	},
/**
 * System.Newsletter.Model#delete(callback[, error]) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback, error){
		System.exec('newsletter.model.delete',{
			parameters: 'NewsletterModel=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){
					
					System.trace(result.responseText);
					
					if(Object.isFunction(error)){
						error.call(this, result.responseText);
					}
					return;	
				}
				
				if(Object.isFunction(callback)){
					callback.call(this, this);
				}
			}.bind(this)
		});
	}
});

Object.extend(System.Newsletter.Model, {
/**
 * System.Newsletter.Model.initialize() -> void
 *
 * Cette méthode initialise les écouteurs de la classe. 
 **/	
	initialize:function(){
		
		
		//
		// Action à effectuer lorsqu'une instance est correctement enregistrée
		//
		System.observe('newsletter.model:open.submit.complete', function(){
						
			var win = $WR.getByName('newsletter');
			
			if(win){
				System.Newsletter.Model.listing(win);	
			}
		});
		//
		// Action à effectuer lorsqu'une instance est correctement supprimée
		//
		System.observe('newsletter.model:remove.submit.complete', function(){
						
			var win = $WR.getByName('newsletter');
			
			if(win){
				System.Newsletter.Model.listing(win);	
			}
		});
		
	},
/**
 * System.Newsletter.Model.open([o]) -> Window
 * - o (System.Newsletter.Model): Instance.
 *
 * Cette méthode ouvre une nouvelle fenêtre permettant de modifier les données d'une instance [[System.Newsletter.Model]].
 **/	
	open:function(data){
		
		//Tentative de création d'une instance Unique	
		var win = $WR.unique('newsletter.model', {
			autoclose:	true,
			action: function(){
				this.open(data);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return $WR.getByName('newsletter.model');
		
		//configuration l'instance Window
		var self = this;
		var flag = 	win.createFlag().setType(FLAG.RIGHT);
		
		win.setData(new System.Newsletter.Model(data));
		
		win.setIcon('newsletter-model');
		win.Resizable(false);
		win.ChromeSetting(true);
		win.createBox();
		win.createHandler($MUI('Chargement en cours'), true);
		win.createTabControl({type:'top'});
		
		try{//si la gestion des themes est supportés on applique
			win.setTheme('flat white');
			win.NoChrome(true);
		}catch(er){}
		
		//overide
		win.overideClose({
			submit:this.submit.bind(this), 
			change:this.checkChange.bind(this),
			close: function(){this.win = null}.bind(this)
		});
		
		var forms = win.createForm({
			
			update:	false,
			
			active:	function(){
				if(this.update) return;                                                                                                                                                                                         
				this.update = true;
				//desactivation de la synchro avec la bdd
				forms.submit.setTag("<b>!</b>");
				
				if(forms.submit.css('padding-right') <= 10 ){				
					forms.submit.css('padding-right', 10);
				}
				
				forms.submit.Tag.on('mouseover', function(){
					$S.Flag.setText('<p class="icon-documentinfo">' + $MUI('La page a subi une ou plusieurs modification(s)') + '.</p>').setType(FLAG.RT).color('grey').show(this, true);
				});
			},
			
			deactive: function(){
				this.update = false;
								
				forms.submit.setTag("");
				forms.submit.css('padding-right', '');
				forms.submit.Tag.stopObserving('mouseover');
				
			},
			
			onChange:function(key, o, n){
				$S.trace(key + ' => Avant : ' + o + ', Après : ' + n);
				this.active();
			}
		});
			
		
		//Vérification régulière de l'état du formulaire lorsqu'un click est intercepté
		win.body.on('click', function(){
			this.checkChange(win);
		}.bind(this));
		
		//
		// Ajoutez ici les filtres de sauvegarde des vos données via la méthode win.forms.addFilters(key, fn).
		//
		// ex : win.forms.addFilters('Mon_Champ', function(){return this.Mon_Champ.Text()} ou  win.forms.addFilters('Mon_Champ', 'Text');
		//
		
		//
		// Ajoutez ici les différents onglets/panneaux de la fenêtre
		// ex : win.BtnModel = win.TabControl.addPanel($MUI('Modèle'), this.createPanel(win));
		//
		win.BtnModel = win.TabControl.addPanel($MUI('Modèle'), this.createPanel(win));
		//
		// Submit
		//
		forms.submit = new SimpleButton({text:$MUI('Enregistrer'), type:'submit'});
		forms.submit.on('click', function(){
			this.submit(win, true);
		}.bind(this));
		//
		// Close/Reset
		//
		forms.close = new SimpleButton({text:$MUI('Fermer')});
		forms.close.on('click', function(){win.close()});
		
		win.Footer().appendChilds([
			forms.submit, 
			forms.close
		]);
		
		document.body.appendChild(win);	
		
		//
		// Ajoutez ici les traitements nécéssitant que la fenêtre soit ajouté au DOM.
		// 
		win.centralize();
		
		win.forms.Content.load();
		
		$S.fire('newsletter.model:open');
				
		return win;
	},
/**
 * System.Newsletter.Model.checkChange(win) -> void
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
 * System.Newsletter.Model.submit(win) -> void
 * - win (Window): Fenêtre du formulaire.
 * 
 * Cette méthode enregistre les données du formulaire en vue d'être envoyé vers le serveur de données.
 **/	
	submit:function(win){
				
		var box =	win.createBox();
		var flag = 	win.createFlag();
		var forms = win.createForm();
		flag.hide();
		
		//
		// Ajoutez ici les conditions empechant l'enregistrement des données, tels que des champs n'ayant de données valides.
		//
		
		if(forms.Title.Value() == ''){
			flag.setText($MUI('Veuillez saisir une titre pour votre modèle de newsletter')).color('red').setType(Flag.RIGHT).show(forms.Title, true);
		}
		//
		// Déclenchement de l'événement d'enregistrement
		// 
		var evt = new StopEvent(win);
		$S.fire('newsletter.model:open.submit', evt);
		if(evt.stopped) return;
		
		if(!this.checkChange(win)){//pas de changement donc on ne sauvegarde pas
			return;
		}
		
		var node = new Node('div', {className:'newsletter-frame-preview'});
		node.innerHTML = forms.Content.Value();
		
		document.body.appendChild(node);
		
		win.ActiveProgress(); //ou box.wait() si vous préférer utiliser une AlertBox
		
		html2canvas(node, {			
			onrendered: function(canvas) {
				
				node.parentNode.removeChild(node);
				
				//récupération des données du formulaire vers l'objet data.
				win.forms.save(win.getData());
				win.getData().Preview = canvas.toDataURL("image/png");
								
				win.getData().commit(function(){//succès
					
					$S.fire('newsletter.model:open.submit.complete', win);
					
					forms.deactive();
								
					//Confirmation d'enregistrement
					var splite = new SpliteIcon($MUI('Le modèle à correctement été sauvegardé'), $MUI('Modèle') + ' : ' + win.getData().Title);
					splite.setIcon('filesave-ok-48');
						
					win.AlertBox.ti($MUI('Confirmation') + '...').a(splite).ty('NONE').Timer(5).show();
					
				}, function(responseText){//erreur
					
						
						
				});
			}
		});
		
		
	},
/**
 * System.Newsletter.Model.createPanel(win) -> Panel
 * - win (Window): Fenêtre du formulaire.
 * 
 * Cette méthode créée un panneau contenant le formulaire principale de la fenêtre.
 **/	
	createPanel:function(win){
		var data = 	win.getData();
		var forms = win.createForm();
		//
		//
		//
		var panel = new Panel({style:'padding:0'});
		panel.removeClassName('compact');
		//
		// Title
		//
		forms.Title = 	new Input({type:'text', className:'input-newsletter', value:data.Title, placeholder:$MUI('Saisissez le titre de votre modèle')});
		forms.Title.Large(true);
				
		panel.appendChilds([
			new Node('div', {className:'wrap-input-newsletter'}, forms.Title),
			this.createWidgetEditor(win),
		]);
						
		return panel;
	},
/**
 * System.Newsletter.Model.createWidgetEditor(win) -> Panel
 **/	
	createWidgetEditor:function(win, obj){
		var forms = 	win.createForm();
		var data = 		win.getData();
		
		var options = {
			width:			'850px', 
			height:			'600px', 
			media:			$FM().createHandler()
			//content_css: 	''
		};
		
		Object.extend(options, obj || {});
		
		var widget = 	new Widget();
		
		widget.addClassName('widget-editor');
		
		widget.Title($MUI('Edition du modèle'));		
		widget.css('margin', '0').css('border', '0');
		widget.BorderRadius(false);
		
		widget.editor = forms.Content =	new Editor(options);
		
		
		if(data.Model_ID == 0){//création d'un cadre par défaut
			var str = '<div style="text-align:center; background:rgb(255,255,255);min-width:800px">'
			str += '<br>';
			str += '<br>';
			
			str += '<table cellspacing="0" cellpadding="0" border="0" align="center" style="width:650px;color:rgb(122,118,111);line-height:23px;font-family:arial,helvetica,sans-serif;font-size:15px; border:1px solid #DFDFDF">';
			
			str += '<thead>'
			str += '<tr>'
			str += '<td style="color:rgb(255,255,255);background:#999;line-height:25px;font-family:arial,helvetica,sans-serif;font-size:25px;text-align:left;padding:10px;">'
			str += '<span><strong>Titre</strong></span>';
    		str += '</td>';
			str += '</tr>';
			str += '</thead>';
			
			str += '<tbody>';
			str += '<tr>';
			str += '<td style="background:rgb(255,255,255)">';
			
			//Body
			str += '<table cellspacing="0" cellpadding="0" border="0" align="center" style="width:600px">';
			str += '<tbody>';
			str += '<tr>';
			str += '<td style="text-align:left;color:rgb(67,71,76);font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px">';
			
			
			str += '<br>';
			str += '<p>Corps du message</p>';
			str += '<br>';
			
			str += '</td>';
			str += '</tr>';
			str += '</tbody>';
			str += '</table>';
			//Body
			
			str += '</td>';
			str += '</tr>';
			str += '</tbody>';
			
			str += '<foot>'
			str += '<tr>'
			str += '<td style="color:#999;font-family:arial,helvetica,sans-serif;font-size:9px;text-align:center;padding:10px;">'
			str += '<span>Vous n\'arrivez pas à lire l\'e-mail ? cliquez <a href="[[link.view.mail]]">ici</a><br>Si vous ne souhaitez plus recevoir d\'e-mails promotionnels de notre part cliquez ici <a href="[[link.unregister]]">Me désabonner</a></span>';
    		str += '</td>';
			str += '</tr>';
			str += '</tfoot>';
			str += '</table>';
			
			
			
			str += '</div>';
			
			data.Content = str;
			
		}
		
		widget.editor.Value(data.Content);
		
		widget.appendChild(widget.editor);
		widget.editor.Header().addClassName('group-button');
		widget.Header(widget.editor.Header());
		
		System.fire('newsletter:create.editor', win, widget);
				
		return widget;
	},
/**
 *
 **/	
	listing:function(win){
		
		var panel = win.Panel;
		
		System.Newsletter.setCurrent('model');
		
		if(!this.NavBar){
			
			this.NavBar = new NavBar( {
				range1:50,
				range2:100,
				range3:300
			});
			this.NavBar.on('change', this.load.bind(this));			
		}
		
		panel.PanelBody.Header().appendChilds([
			this.NavBar
		]);
		
		this.load();
		
	},
	
	getParameters:function(){
		
		var clauses = this.NavBar.getClauses();
		
		//var sort = this.NavBar.select('span.sort.selected')[0];
		//var field = sort.value;
				
		//if(sort.hasClassName('desc')){	
		//	sort = 'desc';
		//}else{
		//	sort = 'asc';
		//}
		
		//clauses.order = field + ' ' + sort;
		//clauses.where = $WR.getByName('mystore').Panel.InputCompleter.Text();
		
		var options = {};
		
		return 'options=' + Object.EncodeJSON(options) + '&clauses=' + clauses.toJSON();
	},
/**
 *
 **/	
	load:function(op){
		
		var win = $WR.getByName('newsletter');
		var panel = win.Panel;
		panel.Progress.show();
		
		this.NavBar.setMaxLength(0);
		
		$S.exec('newsletter.model.list', {
			parameters:this.getParameters(),
			onComplete:function(result){
				
				try{
					var obj;
					var array = $A(obj = result.responseText.evalJSON());
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				panel.clearBody();
				
				if(array.length == 0){
					panel.PanelBody.Body().appendChild(new Node('h2', {className:'notfound'}, $MUI('Désolé. Aucun modèle ne correspond à votre recherche') + '.'));	
				}else{
					
					this.NavBar.setMaxLength(obj.maxLength);
					
					try{		
						
						for(var i = 0; i < array.length;  i++){
							
							var button =	new System.Newsletter.Model.Button({
								text:			array[i].Title,
								icon:			array[i].Preview,
								overable:		false
							});
							
							button.addClassName('hide');
							button.data = array[i];
							panel.PanelBody.Body().appendChild(button);
							
							button.BtnCreate.on('click', function(){
								System.Newsletter.Email.open({Content:this.data.Content});
							}.bind(button));
							
							button.BtnDuplicate.on('click', function(){
								System.Newsletter.Model.open({Content:this.data.Content});
							}.bind(button));
							
							button.BtnOpen.on('click', function(){
								System.Newsletter.Model.open(this.data);
							}.bind(button));
							
							button.BtnRemove.on('click', function(){
								System.Newsletter.Model.remove(this.data, win.createBox());
							}.bind(button));
														
							/*bubble.add(button.BtnDetail,{
								duration:0,
								text: html
							});*/
							
							//button.BtnRemove.hide();
							
							/*button.BtnRemove.on('click', function(evt){
								evt.stop();
								System.BlogPress.Page.remove(win, this.data);
							}.bind(button));
							*/
							i++;
						}	
						
						panel.PanelBody.refresh();
						
						new Timer(function(){
							var b = panel.PanelBody.select('.newsletter-model-button.hide')[0];
							if(b){
								
								b.removeClassName('hide');
								b.addClassName('show');
							}
						}, 0.1, array.length).start();
						
					
					
					}catch(er){$S.trace(er)}
				}
				
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
 * System.Newsletter.Model.remove(o [, box]) -> void
 * - o (System.Newsletter.Model): Instance.
 *
 * Cette méthode ouvre une boite de dialogue demandant une confirmation de suppression à l'utilisateur. 
 **/
	remove:function(o, box){
		
		o = new System.Newsletter.Model(o);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer ce modèle') + ' ? ', $MUI('Modèle') + ' : ' +  o.Title);
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = win.createBox();
		box.setData(o);
		
		box.setTitle($MUI('Suppression du modèle')).a(splite).setIcon('delete').setType().show();
		
		$S.fire('newsletter.model:remove.open', box);
		
		box.reset({icon:'cancel'});
						
		box.submit({
			text:$MUI('Supprimer le modèle'),
			icon:'delete',
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('newsletter.model:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				o.remove(function(){
					box.hide();
						
					$S.fire('newsletter.model:remove.submit.complete', o);
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('Le modèle a bien été supprimé'));
					splite.setIcon('valid-48');
					
					box.setTitle($MUI('Confirmation')).setContent(splite).setType('CLOSE').Timer(5).show();
					box.setIcon('documentinfo');
					
				}.bind(this));
				
			}.bind(this)
		});
		
	}
	
});

/** section: Core
 * class System.BlogPress.Template.Button
 **/
System.Newsletter.Model.Button = Class.from(AppButton);
System.Newsletter.Model.Button.prototype = {
	
	className:'wobject newsletter-model-button overable',
/**
 * new System.Newsletter.Model.Button([options])
 **/	
	initialize:function(obj){
		
		var options = {
			comment: 		0,
			note:			0,
			nbNote:			0,
			subTitle:		'',
			description:	'',
			overable:		true,
			tag:			false
		};
		
		Object.extend(options, obj || {});
		//
		//
		//
		this.BtnCreate = new SimpleButton({nofill:true, text:$MUI('Créer une newsletter')});
		this.BtnCreate.addClassName('btn-create-mail');
		//
		//
		//
		this.BtnRemove = new SimpleButton({icon:'remove-element-2'});
		this.BtnRemove.addClassName('btn-remove');
		//
		//
		//
		this.BtnDuplicate = new SimpleButton({ icon:'duplicate-element'});
		this.BtnDuplicate.addClassName('btn-duplicate');
		//
		//
		//
		this.BtnOpen = new SimpleButton({nofill:true, text:$MUI('Editer le modèle')});
		this.BtnOpen.addClassName('btn-edit');
		
		var node = new Node('div', {className:'wrap-button'}, [this.BtnCreate, this.BtnOpen]);
		
		this.appendChild(node);
		this.appendChild(this.BtnDuplicate)
		this.appendChild(this.BtnRemove);
		
		this.Overable(options.overable);
	},
/**
 * System.Newsletter.Model.Button#setSubTitle(price) -> System.MyStore.Product.Button
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

System.Newsletter.Model.initialize();
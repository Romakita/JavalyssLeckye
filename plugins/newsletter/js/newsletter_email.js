/** section: Newsletter
 * class System.Newsletter.Email
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : newsletter_mail.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.Newsletter.Email = Class.createAjax({

/**
 * System.Newsletter.Email#Email_ID -> Number
 **/
	Email_ID: 0,
/**
 * System.Newsletter.Email#Model_ID -> Number
 **/
	Model_ID: 0,
/**
 * System.Newsletter.Email#Subject -> String
 * Varchar
 **/
	Subject: "",
/**
 * System.Newsletter.Email#Content -> String
 * Longtext
 **/
	Content: "",
/**
 * System.Newsletter.Email#Attachments -> String
 * Longtext
 **/
	Attachments: null,
/**
 * System.Newsletter.Email#Recipients -> Array
 * Longtext
 **/	
	Recipients: 'subscribers@newsletter.fr',
/**
 * System.Newsletter.Email#Date_Start_Sending -> Datetime
 **/
	Date_Start_Sending: '0000-00-00 00:00:00',
/**
 * System.Newsletter.Email#Date_End_Sending -> Datetime
 **/
	Date_End_Sending: '0000-00-00 00:00:00',
/**
 * System.Newsletter.Email#Nb_Email_Sent -> Number
 **/
	Nb_Email_Sent: 0,
/**
 * System.Newsletter.Email#Total_Emails -> Number
 **/
	Total_Emails: 0,
/**
 * System.Newsletter.Email#Statut -> Number
 **/
	Statut: "draft",
/**
 * System.Newsletter.Email#commit(callback [, error]) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		System.exec('newsletter.email.commit', {
			
			parameters: 'NewsletterEmail=' + this.toJSON(),
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
 * System.Newsletter.Email#delete(callback[, error]) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback, error){
		System.exec('newsletter.email.delete',{
			parameters: 'NewsletterEmail=' + this.toJSON(),
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
	},
/**
 * System.Mail#send(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	send: function(callback, error){
		this.Statut = 'process';
		
		var obj = {
			onComplete: function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					if(Object.isFunction(error)) error.call(this, result.responseText);
					return;	
				}
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this),
			
			parameters: 'NewsletterEmail=' + this.toJSON()
		};
		
		var ajax = $S.exec('newsletter.email.send', obj);
		
		new Timer(function(){
			ajax.transport.abort();
		}, 2, 1).start();
	},
/**
 * System.Newsletter.Email#createQueue(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 **/
	createQueue: function(callback, error){
		
		var obj = {
			onComplete: function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					$S.trace(result.responseText);
					if(Object.isFunction(error)) error.call(this, result.responseText);
					return;	
				}
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this),
			
			parameters: 'NewsletterEmail=' + this.toJSON()
		};
		
		var ajax = $S.exec('newsletter.email.create.queue', obj);
		
	},
/**
 * System.Newsletter.Email#check(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 **/
	check: function(callback, error){
		
		var obj = {
			onComplete: function(result){
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					$S.trace(result.responseText);
					if(Object.isFunction(error)) error.call(this, result.responseText);
					return;	
				}
				
				if(Object.isFunction(callback)) callback.call(this, this);
				
			}.bind(this),
			
			parameters: 'NewsletterEmail=' + this.toJSON()
		};
		
		var ajax = $S.exec('newsletter.email.check', obj);
		
	}	
});

Object.extend(System.Newsletter.Email, {
	
	initialize:function(){
		//
		// Action à effectuer lorsqu'une instance est correctement enregistrée
		//
		System.observe('newsletter.email:open.submit.complete', function(){
						
			var win = $WR.getByName('newsletter');
			
			if(win){
				System.Newsletter.Email.listing(win);	
			}
		});
		//
		// Action à effectuer lorsqu'une instance est correctement supprimée
		//
		System.observe('newsletter.email:remove.submit.complete', function(){
						
			var win = $WR.getByName('newsletter');
			
			if(win){
				System.Newsletter.Email.listing(win);	
			}
		});
	},
/**
 * System.Newsletter.Email.open([o]) -> Window
 * - o (System.Newsletter.Email): Instance.
 *
 * Cette méthode ouvre une nouvelle fenêtre permettant de modifier les données d'une instance [[System.Newsletter.Email]].
 **/	
	open:function(data){
		
		//Tentative de création d'une instance Unique	
		var win = $WR.unique('newsletter.email', {
			autoclose:	true,
			action: function(){
				this.open(data);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return $WR.getByName('newsletter.email');
		
		//configuration l'instance Window
		var self = this;
		var flag = 	win.createFlag().setType(FLAG.RIGHT);
		
		win.setData(new System.Newsletter.Email(data));
		
		win.setIcon('newsletter-mail');
		win.Resizable(false);
		win.ChromeSetting(true);
		win.createBox();
		win.createHandler($MUI('Chargement en cours'), true);
		win.createTabControl({type:'top'});
		
		try{//si la gestion des themes est supportés on applique
			win.setTheme('flat white');
			win.NoChrome(true);
		}catch(er){}
		
		var forms = win.createForm();
		//
		// Ajoutez ici les différents onglets/panneaux de la fenêtre
		// ex : win.BtnModel = win.TabControl.addPanel($MUI('Modèle'), this.createPanel(win));
		//
		win.TabControl.addPanel($MUI('Newsletter'), this.createPanel(win));
		//
		//
		//
		var preview = new SimpleButton({text:$MUI('Prévisualiser'), icon:'newsletter-preview'})
		
		preview.on('click', function(){
			var o = new System.Newsletter.Email(win.forms.save());
			
			new Ajax.Request(System.URI_PATH + 'newsletter/preview', {
				type:'post',
				parameters:'NewsletterEmail=' + o.toJSON(),
				onComplete: function(result){
					try{
						var win = new Window();
			
						win.IFrame = new Node('iframe', {style:'height:100%; width:100%; position:absolute'});
												
						win.setTitle(o.Subject).setIcon('newsletter-preview').appendChild(win.IFrame);
						document.body.appendChild(win);
						
						win.IFrame.contentWindow.document.open();
						win.IFrame.contentWindow.document.write(result.responseText);
						win.IFrame.contentWindow.document.close();
												
						win.resizeTo(850, 600);
						win.centralize(true);
						
					}catch(er){alert(er)}
				}
			});
			
		});
		
		win.TabControl.Header().appendChild(preview);
		
		
		//win.TabControl.Header().appendChild(new SimpleButton({text:$MUI('Envoyer e-mail test'), icon:'newsletter-send'}));
		//
		// Submit
		//
		forms.BtnSend = new SimpleButton({text:$MUI('Envoyer la newsletter'), type:'submit'});
		forms.BtnSend.on('click', function(){
			
			if(win.getData().Statut != 'draft'){//Duplication automatique de la news.
				win.getData().Statut = 'draft';
				win.getData().Email_ID = 0;
			}
			
			this.send(win);
		}.bind(this));
		//
		// Submit
		//
		forms.submit = new SimpleButton({text:$MUI('Enregistrer')});
		forms.submit.on('click', function(){
			
			if(win.getData().Statut != 'draft'){//Duplication automatique de la news.
				win.getData().Statut = 'draft';
				win.getData().Email_ID = 0;
			}
			
			this.submit(win);
		}.bind(this));
		//
		// Close/Reset
		//
		forms.close = new SimpleButton({text:$MUI('Fermer')});
		forms.close.on('click', function(){win.close()});
		
		win.Footer().appendChilds([
			forms.BtnSend, 
			forms.submit, 
			forms.close
		]);
		
		document.body.appendChild(win);	
		
		//
		// Ajoutez ici les traitements nécéssitant que la fenêtre soit ajouté au DOM.
		// 
		win.centralize();
		win.forms.Content.load();
		
		$S.fire('newsletter.email:open');
				
		return win;
	},
/**
 * System.Newsletter.Email.checkChange(win) -> void
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
 * System.Newsletter.Email.submit(win) -> void
 * - win (Window): Fenêtre du formulaire.
 * 
 * Cette méthode enregistre et envoi la newsletter aux contacts.
 **/	
	send:function(win){
		//message d'avertissement
		
		var box = win.createBox();
		var flag = win.createFlag();
		var forms = win.createForm();
		
		if(forms.Subject.Value() == ''){
			flag.setText($MUI('Veuillez saisir un sujet pour votre e-mail')).color('red').setType(Flag.RIGHT).show(forms.Subject, true);
			return;
		}
		
		box.setTheme('flat liquid black');
		
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment envoyer la newsletter aux abonnées') + ' ?', $MUI('Prenez le temps de tout vérifier ! La procédure est irréversible.'));
		splite.setIcon('question-48');
		
		box.a(splite).setType('Y/N').show();
		
		win.forms.save(win.getData());
		
		var data = win.getData();
		
		if(Object.isString(data.Attachments)){
			data.Attachments = [data.Attachments];
		}
		
		box.submit({
			click:function(){
				box.setTheme();
				box.hide();
				
				var data = win.getData();
												
				var splite = new SpliteIcon($MUI('Envoi de votre newsletter en cours'));
				splite.setIcon('newsletter-send-48');
				
				box.a(splite);
				
				box.setType('CLOSE').Timer(5).show();
				box.reset({click:function(){
					win.close();
				}});
				
				var line = System.Notify.add({
					appName:	'Newsletter',
					appIcon:	'newsletter',
					title:		$MUI('Envoi de la news en cours') + ' "' + win.getData().Subject + '"'
				});
				
				line.createProgressBar();
				line.ProgressBar.show();
				line.i = 0;
				
				line.data = win.getData();
				
				line.timer = new Timer(function(){
			
					line.data.check(function(){
						line.ProgressBar.setProgress(this.Nb_Email_Sent, this.Total_Emails);
						line.setText($MUI('Envoi de la news') + ' "' + this.Subject + '" [' + this.Nb_Email_Sent + '/' + this.Total_Emails +']');
						
						
						if(this.Nb_Email_Sent == this.Total_Emails){
							line.setText($MUI('Newsletter envoyée') + ' : "' + this.Subject + '"');
							line.ProgressBar.hide();
							line.timer.stop();
						}
					});
					
				}, 1);
									
				line.data.createQueue(function(){
					
					$S.fire('newsletter.email:open.submit.complete', win);
					
					try{
						line.ProgressBar.setProgress(this.Nb_Email_Sent, this.Total_Emails);
					}catch(er){}
										
					this.send();
					
					line.timer.start();
					
				});
					
				
				
				return true;
			}
		});
		
		box.reset({
			click:function(){
				box.setTheme();
				
			}
		});
		
	},
/**
 * System.Newsletter.Email.submit(win) -> void
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
		if(forms.Subject.Value() == ''){
			flag.setText($MUI('Veuillez saisir un sujet pour votre e-mail')).color('red').setType(Flag.RIGHT).show(forms.Subject, true);
			return;
		}
		//
		// Déclenchement de l'événement d'enregistrement
		// 
		var evt = new StopEvent(win);
		$S.fire('newsletter.email:open.submit', evt);
		if(evt.stopped) return;
		
		if(!this.checkChange(win)){//pas de changement donc on ne sauvegarde pas
			return;
		}
		
		//récupération des données du formulaire vers l'objet data.
		win.forms.save(win.getData());
		
		var data = win.getData();
		
		if(Object.isString(data.Attachments) && data.Attachments != ''){
			data.Attachments = [data.Attachments];
		}
		
		win.ActiveProgress();
			
		win.getData().commit(function(){
			
			$S.fire('newsletter.email:open.submit.complete', win);
			
			var box = win.createBox();
					
			box.setTheme('flat liquid white');
		
			var splite = new SpliteIcon($MUI('Votre newsletter a bien été enregistré'));
			splite.setIcon('filesave-ok-48');
			
			box.a(splite).setType('CLOSE').show();
			
		});		
	},
/**
 * System.Newsletter.Email.createPanel(win) -> Panel
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
		forms.Subject = 	new Input({type:'text', className:'input-plugin-mail', value:data.Subject, placeholder:$MUI('Objet de votre newsletter')});
		forms.Subject.Large(true);
		//
		//
		//
		forms.Recipients = 	new InputRecipient({
			//button:		false,
			parameters:	'cmd=system.search.mail'	
		});
		
		if(data.Recipients != null){
			forms.Recipients.Value(	data.Recipients);
		}
		
		forms.Recipients.SimpleButton.on('click', function(){
			this.openIncludeMail(win, win.createForm());
		}.bind(this));//*/
		//
		//
		//
		forms.Attachments = 	new FrameWorker({
			text:$MUI('Pièces jointes'), 
			multiple:true
		});
		
		if(data.Attachments != null){
			forms.Attachments.DropFile.Value(data.Attachments);
		}
		
				
		panel.appendChilds([
			new Node('div', {className:'wrap-input-plugin-mail'}, [forms.Subject, forms.Recipients, forms.Attachments]),
			this.createWidgetEditor(win)
		]);
						
		return panel;
	},
/**
 * System.Newsletter.Email.createWidgetEditor(win) -> Panel
 **/	
	createWidgetEditor:function(win, obj){
		var forms = 	win.createForm();
		var data = 		win.getData();
		
		var options = {
			width:			'850px', 
			height:			'600px', 
			theme_advanced_statusbar_location:false
			//content_css: 	''
		};
		
		Object.extend(options, obj || {});
		
		var widget = 	new Widget();
		
		widget.addClassName('widget-editor');
		
		widget.Title($MUI(' '));		
		widget.css('margin', '0').css('border', '0');
		widget.BorderRadius(false);
		
		widget.editor = forms.Content =	new Editor(options);		
		widget.editor.Value(data.Content);
		
		widget.appendChild(widget.editor);
		widget.editor.Header().addClassName('group-button');
		//widget.editor.Header().hide();
		widget.Header(widget.editor.Header());
		
		System.fire('newsletter.mail:create.editor', win, widget);
				
		return widget;
	},

	listing:function(win){
		
		var panel = win.Panel;
		
		System.Newsletter.setCurrent('emails');
		
		if(!this.NavBar){
			var options = {
				range1:			50,
				range2:			100,
				range3:			300,
				field:			'Statut',
				progress:		false,
				readOnly:		true
			};
			
			this.NavBar = new NavBar(options);
			
			this.NavBar.on('change', this.load.bind(this));
					
			this.NavBar.appendChilds([
				//this.NavBar.PrintNew,
				//this.NavBar.PrintCurrent,
				//this.NavBar.PrintExpired
			]);
			
			this.Table = new ComplexTable(options);
			this.Table.clauses = this.NavBar.getClauses();
			
			this.Table.addHeader({
				Action:					{title:' ', type:'action', style:'text-align:center; width:50px;', sort:false},
				Email_ID: 				{title:$MUI('N°'), style:'width:60px; text-align:right'},
				Subject: 				{title:$MUI('Sujet'),  style:'text-align:left;'},
				Date_Start_Sending:		{title:$MUI('Début d\'envoi le'), style:'text-align:center;width:130px', order:'desc'},
				Date_End_Sending:		{title:$MUI('Fin d\'envoi le'), style:'text-align:center;width:130px'},
				Total_Emails:			{title:$MUI('Nb. contact'), style:'text-align:center;width:80px'}
			});
			
			this.Table.onWriteName = function(key){
				
				switch(key){
					
					case 'draft':
						return $MUI('Brouillon');
						
					case 'process':
						return $MUI('En cours');
					default:
					case 'sent':
						return $MUI('Envoyée');
				}
			};
									
			this.Table.addFilters(['Date_Start_Sending', 'Date_End_Sending' ], function(e, cel, data){
				if(e == '0000-00-00 00:00:00'){
					return '';	
				}
				
				return e.toDate().format('d/m/Y à h\\hi');
			});
			
			this.Table.on('complete', function(obj){
				
				System.Newsletter.Email.NavBar.setMaxLength(obj.maxLength);			
				
				panel.PanelBody.refresh();
				
				if(panel.ProgressBar.hasClassName('splashscreen')){
					new Timer(function(){
						panel.ProgressBar.hide();
						panel.ProgressBar.removeClassName('splashscreen');
					}, 0.5, 1).start();
				}else{
					panel.ProgressBar.hide();
				}
			});
			
			this.Table.on('open', function(evt, data){
				System.Newsletter.Email.open(data);
			});
			
			this.Table.on('remove', function(evt, data){				
				System.Newsletter.Email.remove(data, win.boxCreate());
			});
		}
		
		panel.PanelBody.Header().appendChilds([
			this.NavBar
		]);
		
		panel.PanelBody.addTable(this.Table);
		
		this.NavBar.getClauses().page = 0;
		
		this.load();
		
	},
	
	load:function(){
		
		var win = $WR.getByName('newsletter');
		
		win.Panel.ProgressBar.show();
		win.createBubble().hide();
		
		this.Table.setParameters('cmd=newsletter.email.list');
		
		this.NavBar.setMaxLength(0);
		this.Table.load();
		
	},
	
	openIncludeMail:function(win, form1){
		var box = System.AlertBox;
		var forms = box.createForm();
		
		//
		//
		//
		var splite = new SpliteIcon($MUI('Ajout des groupes de diffusion'), $MUI('Cette utilitaire vous permet d\'ajouter des groupes de diffusion pour votre newsletter') + ' :' );
				
		splite.setIcon('newsletter-group-48');
		
		forms.Recipients = new ListBox();
		forms.Recipients.setData(System.Newsletter.getBroadcastGroups());
				
		forms.Recipients.addClassName('system-wrap-opener');
		
		box.setTheme('flat white liquid');
		
		box.a(splite).a(forms.Recipients).setType().show();
				
		box.reset({
			click:function(){
				box.setTheme();
			}
		});
		
		box.submit({
			text:$MUI('Ajouter'),
			click:function(){
				box.setTheme();
				
				var array = forms.Recipients.getChecked();
			
				if(array.length == 0){
					box.createFlag().setText($MUI('Veuillez choisir au moins un groupe à ajouter')).setType(FLAG.TOP).show(forms.Recipients, true);
					return;	
				}
				
				var list = [];
				
				array.each(function(data){
					form1.Recipients.push(data);
				});
			}
		});
		
	},

/**
 * System.Newsletter.Email.remove(o [, box]) -> void
 * - o (System.Newsletter.Model): Instance.
 *
 * Cette méthode ouvre une boite de dialogue demandant une confirmation de suppression à l'utilisateur. 
 **/
	remove:function(o, box){
		
		o = new System.Newsletter.Email(o);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer cette newsletter') + ' ? ', $MUI('Newsletter') + ' : ' +  o.Subject);
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = win.createBox();
		box.setData(o);
		
		box.setTitle($MUI('Suppression de la newsletter')).a(splite).setIcon('delete').setType().show();
		
		$S.fire('newsletter.email:remove.open', box);
		
		box.reset({icon:'cancel'});
						
		box.submit({
			text:$MUI('Supprimer le modèle'),
			icon:'delete',
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('newsletter.email:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				o.remove(function(){
					box.hide();
						
					$S.fire('newsletter.email:remove.submit.complete', o);
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('La newsletter a bien été supprimé'));
					splite.setIcon('valid-48');
					
					box.setTitle($MUI('Confirmation')).setContent(splite).setType('CLOSE').Timer(5).show();
					box.setIcon('documentinfo');
					
				}.bind(this));
				
			}.bind(this)
		});
		
	}
});

System.Newsletter.Email.initialize();
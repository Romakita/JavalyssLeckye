/** section: plugin
 * class jCarouselManager
 *
 * Cet espace de nom gère l'extension jCarouselManager.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_jcarousel.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.jGalery.jPicture = Class.createAjax({
/**
 * System.jGalery.jPicture#Picture_ID -> Number
 **/
	Picture_ID: 0,
/**
 * System.jGalery.jPicture#Galery_ID -> Number
 **/
	Galery_ID: 0,
/**
 * System.jGalery.jPicture#Title -> String
 * Varchar
 **/
	Title: "",
/**
 * System.jGalery.jPicture#Src -> String
 * Text
 **/
	Src: "",
/**
 * System.jGalery.jPicture#Content -> String
 * Text
 **/
	Content: "",
/**
 * System.jGalery.jPicture#Link -> String
 * Text
 **/
	Link: "",
/**
 * System.jGalery.jPicture#ClassName -> String
 * Varchar
 **/
	ClassName: "",
/**
 * System.jGalery.jPicture#Button -> Number
 **/
	Button: 1,
/**
 * System.jGalery.System.jGalery.jPicture#commit([callback [, error]]) -> void
 **/	
	commit:function(callback, error){
		$S.exec('jgalery.jpicture.commit',{
			parameters:'jPicture=' + this.toJSON(),
			onComplete:function(result){
				try{
					this.evalJSON(result.responseText);
				}catch(er){
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
		
		return this;
	},
/**
 * System.Contact#exists([callback [, error]]) -> void
 **/	
	exists:function(callback, error){
		$S.exec('jgalery.jpicture.exists',{
			parameters:'jPicture=' + this.toJSON(),
			onComplete:function(result){
				try{
					var bool = result.responseText.evalJSON();
				}catch(er){
					if(Object.isFunction(error)){
						error.call(this, result.responseText);	
					}
					return;	
				}
				
				if(Object.isFunction(callback)){
					callback.call(this, bool);	
				}
			}.bind(this)
		});
		
		return this;
	},
/**
 * System.jGalery.System.jGalery.jPicture#remove([callback [, error]]) -> void
 **/	
	remove:function(callback, error){
		$S.exec('jgalery.jpicture.delete',{
			parameters:'jPicture=' + this.toJSON(),
			onComplete:function(result){
				try{
					this.evalJSON(result.responseText);
				}catch(er){
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
		
		return this;
	}
});

Object.extend(System.jGalery.jPicture, {
	
	open:function(picture){
		
		var win = $WR.unique('jpicture.form', {
			autoclose:	true,
			action: function(){
				this.open(picture);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return;
				
		//création de l'objet forms
		var forms = win.forms = 	{};
		
		win.setIcon('paint-2');
		win.createFlag();
		win.createTabControl({type:'top'});
		win.Resizable(false);
		win.createBox();
		win.createHandler($MUI('Loading in process. Please wait') +'...', true);
		
		$Body.appendChild(win);
		
		picture = win.picture = 	new System.jGalery.jPicture(picture);
				
		win.forms.submit = 	new SimpleButton({text:$MUI('Enregistrer'), type:'submit'});
		win.forms.close = 	new SimpleButton({text:$MUI('Fermer'), type:'close'});
		
		win.Footer().appendChild(win.forms.submit);
		win.Footer().appendChild(win.forms.close);
		
		win.TabControl.addPanel($MUI('Général'), this.createPanelInfo(win));
		win.TabControl.addPanel($MUI('Description'), this.createPanelDescription(win));
		
		$S.fire('jpicture:open', win, picture);
		
		win.forms.Content.load();	
		win.centralize();
		
		win.forms.close.on('click', function(){
			win.close();
		});
		
		win.forms.submit.on('click', function(){
			
			if(forms.Src.Value() == ''){
				win.Flag.setText($MUI('Veuillez choisir une photo à charger')).setType(FLAG.RIGHT).show(forms.Src, true);
				return true;	
			}
			
			if(forms.Title.Value() == ''){
				win.Flag.setText($MUI('Veuillez choisir un nom pour votre photo')).setType(FLAG.RIGHT).show(forms.Title, true);
				return true;	
			}
						
			var evt = new StopEvent(win);
			$S.fire('jcarousel:submit', evt, picture);
			if(evt.stopped) return true;
			
			picture.Src = 		forms.Src.Value();
			picture.Title = 	forms.Title.Value();
			picture.Content =	forms.Content.Value();
			picture.Link =		forms.Link.Value() == '' ? forms.Link.Text() : forms.Link.Value();
			picture.Button =	forms.Button.Value() ? (forms.LinkButton.Value() == '' ? forms.LinkButton.Text() : forms.LinkButton.Value()) : 0;
			picture.Button = 	picture.Button  == '' ?  forms.Button.Value() : 0;
					
			//console.log(win.carousel.Pictures);
			
			win.AlertBox.wait();
			
			picture.commit(function(){
				win.AlertBox.hide();
				
				$S.fire('jpicture:submit.complete', picture);
				
				var splite = new SpliteIcon($MUI('Les informations ont correctement été sauvegardé'));
				splite.setIcon('filesave-ok-48');
				
				win.AlertBox.a(splite).ty('NONE').Timer(5).show();
				
			});
			
			return true;
		});	
	},
/**
 * System.jGalery.jPicture.createPanelInfo(win) -> Panel
 **/
	createPanelInfo:function(win){
		
		var panel = 	new Panel({background:'multimedia', style:'min-height:500px; width:500px'});
		var forms = 	win.forms;
		var picture = 	win.picture;
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Gestionnaire des photos'));
		splite.setIcon('thumbnail-48');
		//
		// 
		//
		forms.Title = 		new Input({value:picture.Title, type:'text', maxLength:100, className:'icon-cell-edit'});
		forms.Title.placeholder = $MUI('Saisissez ici le titre de la photo');
		//
		// 
		//
		forms.Link = 		new InputCompleter({
			link:			$S.link,
			parameters:		'op=post.completer'
		});
		
		forms.Link.on('keyup', function(evt){
			if(Event.getKeyCode(evt) != 13) this.value = '';
		});
		
		forms.Link.Value(picture.Link);
		forms.Link.css('width', '99%');
		forms.Link.Input.placeholder = $MUI('Saisissez ici le lien de la page cible au clic de l\'image');
		//
		// 
		//
		forms.LinkButton = 	new InputCompleter({
			link:			$S.Link,
			parameters:		'op=post.completer'
		});
		
		forms.LinkButton.on('keyup', function(evt){
			if(Event.getKeyCode(evt) != 13) this.value = '';
		});
		
		forms.LinkButton.css('width', '99%');
		forms.LinkButton.Value(picture.Button == 1 || picture.Button == 0 ? '' : picture.Button);
		forms.LinkButton.Input.placeholder = $MUI('Saisissez ici le lien de la page cible au clic de l\'onglet');
		//
		// 
		//
		forms.SrcPreview = 			new HeadPiece({icon:picture.Src});
		forms.SrcPreview.value = 	picture.src;
		forms.SrcPreview.addClassName('hp-picture');
		//
		// 
		//
		forms.Button = 		new ToggleButton();
		forms.Button.Value(picture.Button != 0);
		//
		//
		//
		forms.Src = new FrameWorker({
			link:		$S.link,
			parameters:	'cmd=jgalery.jpicture.import&Galery_ID=' + picture.Galery_ID,
			multiple:	false
		});
		
		forms.Src.css('width', '100%');
		forms.Src.Value(picture.Src);
		
		if(forms.Src.hasFileAPI){
			forms.Src.DropFile.addDragArea(forms.SrcPreview);
			forms.Src.DropFile.addDropArea(forms.SrcPreview);
		}	
		
		//
		//
		//
		var table = new TableData();
		
		table.addHead($MUI('Titre de la photo') + ' : ', {style:'width:160px'}).addField(forms.Title).addRow();
		table.addHead($MUI('Lien de la page cible') + ' : ').addField(forms.Link).addRow();
		table.addHead($MUI('Activer l\'onglet') + ' : ').addCel(forms.Button, {style:'height:30px'}).addRow();
		table.addHead($MUI('Lien au clic de l\'onglet') + ' : ').addField(forms.LinkButton);
		
		forms.TableData = table;
		
		panel.appendChild(splite);
		panel.appendChild(new Node('div', {style:'text-align:center'}, forms.SrcPreview));
		
		panel.appendChild(forms.Src);
		panel.appendChild(table);
		
		
		forms.Src.on('change', function(){
			forms.SrcPreview.Picture.src = '';
			win.forms.submit.hide();
		});
		
		forms.Src.on('complete', function(link){
			forms.SrcPreview.Src(link);
			win.forms.submit.show();
			
		});
		
		forms.Button.on('change', function(){
			if(this.Value()){
				forms.LinkButton.parentNode.parentNode.show();
			}else{
				forms.LinkButton.parentNode.parentNode.hide();
			}
		});
		
		if(forms.Button.Value()){
			forms.LinkButton.parentNode.parentNode.show();
		}else{
			forms.LinkButton.parentNode.parentNode.hide();
		}
		
		if(forms.Src.Value() ==''){
			win.forms.submit.hide();	
		}
		
		return panel;
	},
/**
 * jCarouselManager.createPanelPictureDescription(win) -> Panel
 **/	
	createPanelDescription:function(win){
		var panel = 	new Panel({style:'min-height:344px; width:500px; padding:0'});		
		var self =		this;
		var widget = 	new Widget();
		
		widget.Title($MUI('Description de la photo'));
		widget.css('height', '380px');
		
		widget.editor = win.forms.Content = new Editor({
			theme_advanced_buttons1 : 			"formatselect,|forecolor,|,bold,italic,underline,strikethrough,|,bullist,numlist,|,link,unlink,|,charmap",
			theme_advanced_buttons2 : 			"",
			width:								'100%',
			height:								'344px',
			source:								true,
			theme_advanced_statusbar_location: 	false
		});
		
		widget.appendChild(widget.editor);
		widget.editor.Header().addClassName('group-button');
		widget.Header(widget.editor.Header());
					
		win.forms.Content.Value(win.picture.Content);
		
		panel.appendChild(widget);
		
		return panel;
	},
/**
 * jCarouselManager.removePicture(picture) -> void
 **/
 	remove: function(picture){
		var win = $WR.getByName('jgalery');		
		//on regarde si l'instance a été créée
		if(!win) return;
		
		var box = 		win.AlertBox;
		var flag = 		box.box.createFlag().setType(FLAG.RIGHT);
		
		picture =		new System.jGalery.jPicture(picture);
		//
		//
		//
		//	
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer la photo de la galerie') + ' "' + win.jGalery.Current.Name + '" ? ', $MUI('Photo') + ' : ' + picture.Title);
		splite.setIcon('trash-48');
		splite.setStyle('max-width:500px');
		
		box.as([splite]).ty()
		
		$S.fire('jpicture:remove.open', box);
		
		box.show();
		
		box.submit({
			text: $MUI('Supprimer'),
			icon: 'delete',
			click: function(){
						
				var evt = new StopEvent(box);
				$S.fire('jpicture:remove.submit', evt);
				
				if(evt.stopped)	return true;
								
				box.wait();
				
				picture.remove(function(){
					box.hide();
					
					$S.fire('jpicture:remove.complete', picture);	
					
					var splite = new SpliteIcon($MUI('Photo correctement supprimée'), picture);
					splite.setIcon('valid-48');
									
					box.setTitle($MUI('Confirmation')).a(splite).setType('CLOSE').Timer(5).show();
					box.getBtnReset().setIcon('cancel');
					box.setIcon('documentinfo');
										
				});
				
				return true;
			}
		});
		
	}
});
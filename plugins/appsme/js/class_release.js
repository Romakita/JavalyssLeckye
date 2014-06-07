/** section: AppsMe
 * class ReleasesUI
 * Gère les interfaces des releases.
 **/
var Release = System.AppsMe.Release = Class.createAjax({
/**
 * Release.Release_ID -> Number
 **/
	Release_ID:				0, 	 	 	 	 	 	 	 
/**
 * Release.Application_ID -> Number
 **/
	Application_ID:			0,
/**
 * Release.Title -> String
 **/
	Title:				'',
/**
 * Release.Description -> String
 **/	
	Description:		'',
/**
 * Release.Version -> String
 **/
	Version:			'',
	Required_Version:	'',
/**
 * Release.Link_Release -> String
 **/
 	Link_Release:		'',
/**
 * Release.Statut -> Number
 **/
	Statut:				'draft',
/**
 * Release.Beta -> Number
 **/
	Beta:				0,
/**
 * Release.commit(callback) -> void
 **/
	commit: function(callback){
		
		$S.exec('application.release.commit', {
			
			parameters: "Release=" + this.toJSON(),
			onComplete: function(result){
				this.evalJSON(result.responseText);
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});	
		
	},
/**
 * Release.remove(callback) -> void
 **/
	remove: function(callback){
		$S.exec('application.release.delete',{
			parameters: 'Release=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	}
});


Object.extend(System.AppsMe.Release, {
/**
 * new AppsUI()
 * Cette méthode créée une nouvelle instance du gestionnaire des applications.
 **/
	initialize: function(){
		
	},
	
	open:function(release){
		//ouverture de la fenêtre
		var win = $WR.unique('release.form', {
			autoclose:	true,
			action: function(){
				this.open(release);
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
			try{
				if(this.checkChange(win)){
					win.forms.active();	
				}
			}catch(er){$S.trace(er)}
		}.bind(this));
		
		//création de l'objet forms
		var forms = win.forms = 	win.createForm({
			update:	false,
			
			active:	function(){
				if(this.update) return;                                                                                                                                                                                         
				this.update = true;
				//desactivation de la synchro avec la bdd
				win.forms.submit.setTag("<b>!</b>");
				win.forms.submit.Tag.on('mouseover', function(){
					try{
						$S.Flag.setText('<p class="icon-documentinfo">' + $MUI('The form have been modified') + '.</p>').setType(FLAG.RT).color('grey').show(this, true);
					}catch(er){console.log(er)}
				});
			},
			
			deactive: function(){
				this.update = false;
				this.submit.setTag("");
				this.submit.Tag.stopObserving('mouseover');			
			},
			
			onChange:function(key, o, n){
				$S.trace(key + ' => Avant : ' + o + ', Après : ' + n);
				this.active();
			}
		});
		
		win.Resizable(false);
		win.NoChrome(true);
		
		win.createTabControl({type:'top'}).addClassName('jpanel');
		win.ChromeSetting(false);
		win.createBox();
		
		win.overideClose({
			submit:this.submit.bind(this), 
			change:this.checkChange.bind(this),
			close: function(){}
		});
		
		win.createFlag().setType(FLAG.TYPE);
		
		win.setIcon('package');
		win.createHandler($MUI('Loading'), true);
		
		win.forms = 		forms;
		win.setData(release = win.release = 	new Release(release));
				
		forms.submit = 	new SimpleButton({text:$MUI('Save'), type:'submit'}).on('click', function(){this.submit(win)}.bind(this));
		forms.close = 	new SimpleButton({text:$MUI('Close')}).on('click', function(){win.close()}.bind(this));
		
		forms.BtnInfo = 		win.TabControl.addPanel($MUI('Info'), this.createPanelGeneral(win));
		forms.BtnDescription = 	win.TabControl.addPanel($MUI('Description'), this.createPanelDescription(win));
		
		document.body.appendChild(win);
		
		forms.Description.load();
		
		win.Footer().appendChilds([forms.submit, forms.close]);
		
		$S.fire('release:open', win);
		
		return win;
	},
/**
 * ReleasesUI.checkChange(win) -> Boolean
 * - win (Window): Instance du formulaire.
 * 
 * Cette méthode vérifie l'état du formulaire et retourne vrai si le formulaire a été modifié, faux dans le cas de contraire.
 **/	
	checkChange:function(win){
		if(win.forms.update) return true;
		return win.forms.checkChange(win.getData());
	},
/**
 * ReleasesUI.submit(win [, noclose]) -> void
 * - win (Window): Instance du formulaire.
 *
 * Cette méthode valide le formulaire de l'application.
 **/
	submit: function(win, noclose){
		
		win.Flag.hide();
		win.AlertBox.hide();
		
		if(win.forms.Title.Text() == ''){
			win.Flag.setText($MUI('The release should have a title')).setType(FLAG.RIGHT).show(win.forms.Title, true);
			return true;
		}
		
		if(win.forms.Version.value == ''){
			win.Flag.setText($MUI('The release must have a version number')).setType(FLAG.RIGHT).show(win.forms.Version, true);
			return true;
		}
					
		var evt = new StopEvent(win);
		$S.fire('release:submit', evt);
		
		if(evt.stopped){
			return true;	
		}
		
		win.createForm().save(win.getData());
		
		win.ActiveProgress();
		
		win.getData().commit(function(responseText){
							
			$S.fire('release:submit.complete', win);
			win.forms.deactive();
						
			//Confirmation d'enregistrement
			var splite = new SpliteIcon($MUI('The form has been successfully saved'), $MUI('Release N°') +' ' + win.release.Release_ID);
			splite.setIcon('filesave-ok-48');
			
			win.AlertBox.setTitle($MUI('Confirmation'));
			win.AlertBox.a(splite).ty('NONE').Timer(3).show();
						
		}.bind(this))
	},
/**
 *
 **/	
	createPanelGeneral:function(win){
		
		var forms = win.forms;
		var release = win.release;
		
		var panel = new Panel({style:'min-height:400px; width:500px;', background:'application'});
		
		var splite = new SpliteIcon($MUI('General information of your release'), $MUI('Modify the fields for customise your release') +' :');
		splite.setIcon('package-48');
		splite.setStyle('width:500px');
		
		panel.appendChild(splite);
		
		forms.Title = new Select({
			link: 			$S.link,
			parameters: 	'cmd=application.release.title.list',
			button:			false
		});
		forms.Title.Value(release.Title);
		forms.Title.Input.readOnly = false;
		forms.Title.load();
		
		forms.addFilters('Title', "Text");
		//
		//
		//
		forms.Version = 			new Input({type: 'text', value: release.Version});
		//
		//
		//
		forms.Required_Version = 	new Select({
			link: 		$S.link,
			parameters:	'cmd=application.release.list&options=' + escape(Object.toJSON({op:'-version', Application_ID:release.Parent_ID}))
		});
		
		if(win.release.Parent_ID != 0){
			forms.Required_Version.Value(release.Required_Version);
			forms.Required_Version.load();	
		}
		//
		// Statut
		//
		forms.Statut = new ToggleButton();
		forms.Statut.Value(release.Statut.match(/publish/));
		
		forms.Statut.on('change', function(){
			
			if(!forms.FrameWorker.Value().match(/\.zip/)){
				if(forms.Statut.Value() || forms.Beta.Value()){
					forms.submit.hide();
				}else{
					forms.submit.show();
				}
			}else{
				forms.submit.show();
			}
						
		});
		
		forms.addFilters('Statut', function(){
			return this.Statut.Value() ? 'publish' : 'draft';
		});
		//
		// Beta
		//
		forms.Beta = new ToggleButton();
		forms.Beta.Value(release.Beta * 1 == 1);
		
		forms.addFilters('Beta', function(){
			
			if(this.Statut.Value()){
				this.Beta.Value(false);
				return 0;
			}
			
			return this.Beta.Value() ? 1 : 0;
		});
		
		forms.Beta.on('change', function(){
			
			if(!forms.FrameWorker.Value().match(/\.zip/)){
				if(forms.Statut.Value() || forms.Beta.Value()){
					forms.submit.hide();
				}else{
					forms.submit.show();
				}
			}else{
				forms.submit.show();
			}
						
		});
		//
		// Widget File
		//	
		forms.FrameWorker = new FrameWorker({
			link:		$S.link,
			parameters:	'cmd=application.release.import&Application_ID=' + win.release.Application_ID,
			multiple:	false,
			maxSize:	$S.UPLOAD_MAX_FILESIZE
		});
		
		forms.FrameWorker.setStyle('width:100%');
		forms.FrameWorker.Value(release.Link_Release);
				
		forms.FrameWorker.on('complete', function(link){
			forms.submit.show();
		});
		
		forms.FrameWorker.on('cancel', function(node){
			if(forms.Statut.Value() || forms.Beta.Value()){
				forms.submit.hide();
			}
		});
		
		forms.FrameWorker.on('error', function(node){
			if(forms.Statut.Value() || forms.Beta.Value()){
				forms.submit.hide();
			}
		});
		
		forms.addFilters('Link_Release', function(){
			return this.FrameWorker.Value();
		});
		//
		//
		forms.BtnImportFromMedia = new SimpleButton({text:$MUI('Import from repository')});
		
		forms.BtnImportFromMedia.on('click', function(){
			var win = $WR.getByName('application.form');
			System.AppsMe.App.fopen(win.application, function(file){
				forms.FrameWorker.Value(file.uri);
				forms.submit.show();
			});
		});
		//
		// Table
		//
		var table = new TableData();
		
		table.addHead(win.release.Type == 'app' ? $MUI('App') : $MUI('Plugin'), {width:160}).addCel(win.release.Name, {style:'font-weight:bold'}).addRow();
		table.addHead($MUI('Title'), {width:160}).addCel(forms.Title).addRow();
		table.addHead($MUI('Version')).addCel(forms.Version).addRow();
		table.addHead($MUI('Required version')).addCel(forms.Required_Version).addRow();		
		table.addHead($MUI('Publish')).addCel(forms.Statut).addRow();
		table.addHead($MUI('Beta Channel')).addCel(forms.Beta).addRow();
		table.addHead('Archive (zip)').addCel(forms.FrameWorker).addRow();
		table.addHead($MUI('Or')).addCel(forms.BtnImportFromMedia).addRow();
		
		panel.appendChild(table);
		
		if(!forms.FrameWorker.Value().match(/\.zip/)) {
			if(forms.Statut.Value() || forms.Beta.Value()){
				forms.submit.hide();
			}
		}
		
		if(forms.Statut.Value()){
			table.getRow(5).hide();	
		}
		
		if(win.release.Type == 'app' || win.release.Parent_ID == 0){
			table.getRow(3).hide();	
		}
		
		forms.Statut.on('change', function(){
			if($S.AppsMe.getMeta('Beta') == 1){
				if(this.Value()){
					table.getRow(5).hide();
				}else{
					table.getRow(5).show();
				}
			}
		});
		
		if($S.AppsMe.getMeta('Beta') == 0){
			table.getRow(5).hide();
		}
		
		forms.Title.on('mouseover', function(){
			win.Flag.setType(FLAG.RIGHT).setText('<p class="icon-documentinfo">' + $MUI('Choose the title of your release') + '.</p><p>' + $MUI('If the title doesn\'t exists in the list enter it and it will be available for next time') + '.</p>').color('grey').show(this, true);
		});
		
		forms.Version.on('mouseover', function(){
			win.Flag.setType(FLAG.RIGHT).setText('<p class="icon-documentinfo">' + $MUI('Enter here the version of your app') + '.</p>').color('grey').show(this, true);
		});
		
		forms.Statut.on('mouseover', function(){
			win.Flag.setType(FLAG.RIGHT).setText('<p class="icon-documentinfo">' + $MUI('Publish your archive for release on the Javalyss update channel') + '.</p>').color('grey').show(this, true);
		});
		
		forms.Beta.on('mouseover', function(){
			win.Flag.setType(FLAG.RIGHT).setText('<p class="icon-documentinfo">' + $MUI('Choose this options if you want release this archive on the Beta channel') + '.</p>').color('grey').show(this, true);
		});
				
		return panel;
	},
/**
 * ReleasesUI.createPanelDescription(win) -> Node
 * - win (Window): Instance de Window.
 *
 * Cette méthode crée le panneau de gestion de la description de l'application.
 **/
 	createPanelDescription: function(win){
		//
		//
		//
		var panel = 	new Panel({background:"file", style:'min-height:500px;width:690px;padding:0px'});
		//
		// Description
		//
		var widget = new Widget();
		
		widget.Title($MUI('Description'));
		widget.css('height', '600px').css('margin', '0');
		widget.BorderRadius(false);
		
		widget.editor = win.forms.Description = new Editor({
			width:						'100%', 
			height:						'560px', 
			media:						function(callback){$S.AppsMe.App.fopen(win.release, callback)}.bind(this),
			content_css: 				$S.plugins.get('AppsMe').PathURI + 'css/editor.css'
			//theme_advanced_buttons1 : 	"formatselect,styleselect,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,link,unlink,|,charmap",
			
		});
		win.forms.Description.setStyle('margin:0');
		win.forms.Description.Value(win.release.Description);
		
		widget.appendChild(widget.editor);
		widget.editor.Header().addClassName('group-button');
		widget.Header(widget.editor.Header());
		
		panel.appendChild(widget);
		
		this.onCreateEditor(win);
		
		return panel;
	},
/**
 *
 **/	
	onCreateEditor:function(win){
		
		var box =		System.AlertBox;
		var flag = 		box.box.createFlag();
		
		var button = 	new SimpleButton({icon:'appsme-galery'});
		
		flag.add(button, {
			orientation:	Flag.TOP,
			text:			$MUI('Ajouter une galerie')
		});
		
		win.forms.Description.Header().appendChild(button);
				
		button.on('click', function(){
			box.hide();
			
			var splite = new SpliteIcon($MUI('Création d\'une galerie LightBox'), '');
			splite.setIcon('appsme-galery-48');
			
			var forms = {};		
			//
			//
			//	
			forms.toggle = new ToggleButton();
			forms.toggle.Value(false);
						
			box.a(splite);
			//
			//
			//
			forms.Src = new FrameWorker({
				multiple:	true,
				parameters:	'cmd=application.picture.import&Application_ID=' + win.getData().Application_ID + '&Version=' + win.forms.Version.Value()
			});
			forms.Src.css('width', '100%');
			
			box.a(forms.Src);
			
			try{
				box.setTheme('flat liquid white');
			}catch(er){
				box.setTitle($MUI('Galerie photo'));
			}
			
			box.setType().show();
			box.setIcon('jgalery');
			
			box.submit({
				text:$MUI('Ajouter'),
				click:function(){
					
					try{
						box.setTheme();
					}catch(er){}
					
					var str = '<div class="galery">';
						
					var list = forms.Src.Value();
					
					if(Object.isString(list)){
						list = [list];
					}
					
					list.each(function(file){
						str += '<a href="'+ file +'" rel="lightbox['+ win.release.Name.replace(/ /gi, '').toLowerCase() +']" title="' + win.release.Name +' v'+win.forms.Version.Value() + '"><img src="'+file+'"></a>';	
					});
					
					str += '</div>';
					
					win.forms.Description.Value(win.forms.Description.Value() + str);
					
				}
			});
			
			box.reset({
				click:function(){
					try{
						box.setTheme();
					}catch(er){}
				}
			});
			
		});
	}
});

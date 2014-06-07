/** section: AppsMe
 * class AppsUI
 * Gestion des applications et des distributions du logiciel Javalyss Client.
 **/
var App = System.AppsMe.App = Class.createAjax({
/**
 * App.Application_ID -> Number
 **/
	Application_ID:		0, 	 	 	 	 	 	 	 
/**
 * App.User_ID -> Number
 **/
	User_ID:			1,
/**
 * App.Post_ID -> Number
 **/
	Post_ID:			0,
/**
 * App.Parent_ID -> Number
 **/
	Parent_ID:			0,
/**
 * App.Name -> Date
 **/
	Name:				'',
/**
 * App.Icon -> Date
 **/
	Icon:				'',
/**
 * App.Author -> Date
 **/
	Author:				'',
/**
 * App.Author_URI -> Number
 **/
	Author_URI:			'',
/**
 * App.Application_URI -> Number
 **/
	Application_URI:	'',
/**
 * App.Market -> String
 **/
	Statut:				'publish',
/**
 * App.Price -> String
 **/
	Price:				0,
/**
 * App.Description -> String
 **/	
	Description:		'',
/**
 * App.Type -> String
 **/	
	Type:				'app',
/**
 * App.Date_Publication -> Date
 **/	
	Date_Publication:	null,
/**
 * App.commit(callback) -> void
 **/
	commit: function(callback, options){

		$S.exec('application.commit', {
			
			parameters: "App=" + this.toJSON() + "&options=" + escape(Object.toJSON(options)),
			onComplete: function(result){
				
				this.evalJSON(result.responseText);
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});	
		
	},
/**
 * App.remove(callback) -> void
 **/
	remove: function(callback){
		$S.exec('application.delete',{
			parameters: 'Application=' + this.toJSON(),
			onComplete: function(result){
				
				var obj = result.responseText.evalJSON();
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	}
});

Object.extend(System.AppsMe.App, {
/**
 * new AppsUI()
 * Cette méthode créée une nouvelle instance du gestionnaire des applications.
 **/
	initialize: function(){
		$S.observe('application:submit.complete', function(){
			var win = $WR.getByName('application.listing');
			if(win){
				win.load();
			}
		}.bind(this));
		
		$S.observe('application:remove.complete', function(){
			var win = $WR.getByName('application.listing');
			if(win){
				win.load();
			}
		}.bind(this));
		
		$S.observe('release:submit.complete', function(){
			var win = $WR.getByName('application.form');
			
			if(win){
				win.loadRelease();
			}
		}.bind(this));
		
		$S.observe('release:remove.complete', function(){
			var win = $WR.getByName('application.form');
			if(win){
				win.loadRelease();
			}
		}.bind(this));
		
		/*$S.observe('crash:submit.complete', function(){
			var win = $WR.getByName('application.form');
			if(win){
				win.loadCrash();
			}
		}.bind(this));
		
		$S.observe('crash:remove.complete', function(){
			var win = $WR.getByName('application.form');
			if(win){
				win.loadCrash();
			}
		}.bind(this));*/
		
		//$S.observe('notify:draw', this.listNotify.bind(this));
		
		/*$S.observe('manuel:submit.complete', function(){
			var win = $WR.getByName('application.form');
			if(win){
				win.loadManuel();
			}
		}.bind(this));
		
		$S.observe('manuel:remove.complete', function(){
			var win = $WR.getByName('application.form');
			if(win){
				win.loadManuel();
			}
		}.bind(this));*/
		
		$S.observe('team:remove.complete', function(){
			var win = $WR.getByName('application.form');
			if(win){
				win.loadUsers();
			}
		}.bind(this));
		
	},
/**
 * AppsUI.open([application]) -> void
 * - application (Object): Instance d'application
 **/	
	open: function(application){
		//ouverture de la fenêtre
		var win = $WR.unique('application.form', {
			autoclose:	true,
			action: function(){
				this.open(application);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return;
		//overide
		win.overideClose({
			submit:this.submit.bind(this), 
			change:this.checkChange.bind(this),
			close: function(){}.bind(this)
		});
				
		//Vérification régulière de l'état de la fiche lorsqu'un click est intercepté
		win.body.on('click', function(){
			this.checkChange(win);
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
				
				this.fopen.show();
				this.BtnDescriptions.show();
				this.BtnUsers.show();
				this.BtnReleases.show();
				this.Icon.parentNode.parentNode.show();
			},
			
			onChange:function(key, o, n){
				$S.trace(key + ' => Avant : ' + o + ', Après : ' + n);
				this.active();
			}
		});
				
		win.Resizable(false);
		win.ChromeSetting(true);
		win.createTabControl({type:'left', maximize:true})
		win.NoChrome(true);
		
		document.body.appendChild(win);
				
		win.overideClose({
			submit:this.submit.bind(this), 
			change:this.checkChange.bind(this)
		});
		
		win.createFlag().setType(FLAG.TYPE);
		
		if(application.Type.match(/app/)){
			win.setTitle($MUI('Application manager')).setIcon('application');
		}else{
			win.setTitle($MUI('Plugin manager')).setIcon('plugin');
		}
		
		win.createHandler($MUI('Loading'), true);
		win.setData(application = win.application = 	new System.AppsMe.App(application));
				
		forms.submit = 	new SimpleButton({text:$MUI('Save'), icon:'filesave'}).on('click', function(){this.submit(win)}.bind(this));		
		forms.fopen = 	new SimpleButton({text:$MUI('Explorer'), icon:'folder'});
		forms.fopen.on('click', function(){this.fopen(application);}.bind(this))		
		//
		// TabControl
		//
		if(application.Type.match(/app/)){
			win.TabControl.addPanel($MUI('My app'), this.createPanelGeneral(win)).setIcon('application');
		}else{
			win.TabControl.addPanel($MUI('My plugin'), this.createPanelGeneral(win)).setIcon('plugin');
		}
				
		forms.BtnDescriptions = win.TabControl.addPanel($MUI('Description'), this.createPanelDescription(win)).setIcon('file-edit');
		win.TabControl.Header().appendChild(forms.fopen);
		
		forms.BtnReleases = 	win.TabControl.addPanel($MUI('Releases'), this.createPanelReleases(win)).setIcon('package');
		
		var button =			new SimpleButton({type:'mini', icon:'add-14', nofill:true});
		button.setStyle('position:absolute; right:40px;top:6px');
		
		forms.BtnReleases.appendChild(button);
		button.on('click', function(){
			this.openRelease(win);
		}.bind(this));	
		
		button.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Click here to create a release') + '</p>');
			win.Flag.color('grey').setType(FLAG.RT).show(this, true);
		});
		//
		//
		//
		//forms.BtnIncidents = 	win.TabControl.addPanel($MUI('Incidents'), this.createPanelCrashs(win)).setIcon('alert');
		forms.BtnUsers = 		win.TabControl.addPanel($MUI('Team'), this.createPanelUsers(win)).setIcon('group-edit');
		
		if(application.Application_ID == 0){
			forms.fopen.hide();
			forms.BtnDescriptions.hide();
			forms.BtnReleases.hide();
			forms.BtnUsers.hide();
		}
				
		win.TabControl.addSection($MUI('Action'));
		win.TabControl.Header().appendChild(forms.submit);
				
		switch(application.Right){
			case '0':
			case '1':break;
			case '3':
				forms.BtnRelease.hide();
			case '2':
				forms.submit.hide();
				break;
			
		}
		
		win.appendChild(win.TabControl);
		
		$S.fire('application:open', win);		
		
		win.resizeTo('auto', 600);  
		win.centralize(true);
		
		forms.Description.load();
				
	},
/**
 * AppsUI.checkChange(win) -> Boolean
 * - win (Window): Instance du formulaire.
 * 
 * Cette méthode vérifie l'état du formulaire et retourne vrai si le formulaire a été modifié, faux dans le cas de contraire.
 **/	
	checkChange:function(win){
		if(win.readOnly) return false;
		if(win.forms.update) return true;
		return win.forms.checkChange(win.getData());
	},
/**
 * AppsUI.submit(win [, noclose]) -> void
 * - win (Window): Instance du formulaire.
 *
 * Cette méthode valide le formulaire de l'application.
 **/
	submit: function(win, noclose){
		
		win.Flag.hide();
		win.AlertBox.hide();
		
		if(win.forms.Name.value == '') {
			win.Flag.setText($MUI('The application name is mandatory')).setType(FLAG.RIGHT);
			win.Flag.show(win.forms.Name);
			return true;
		}
		
		if(win.forms.Author.Text() == '') {
			win.Flag.setText($MUI('The author name is mandatory')).setType(FLAG.RIGHT);
			win.Flag.show(win.forms.Author);
			return true;
		}
		
		var evt = new StopEvent(win);
		$S.fire('application:submit', evt, win);
		
		if(evt.stopped) return true;
		
		win.forms.save(win.getData());
		
		win.ActiveProgress();
		
		win.application.commit(function(responseText){
							
			switch(responseText){
				case 'application.name.exist':
					win.Flag.setText($MUI('The application name already exists') + ' !</p>');
					win.Flag.show(win.forms.Name);
					return;
			}
			
			$S.fire('application:submit.complete', win);
						
			//Confirmation d'enregistrement
			var splite = new SpliteIcon($MUI('The form has been successfully saved'), $MUI('App N°') +' ' + win.application.Application_ID);
			splite.setIcon('filesave-ok-48');
				
			win.AlertBox.a(splite).ty('NONE').Timer(3).show();
			win.forms.deactive();
			
		}.bind(this))
	},
/**
 * AppsUI.join() -> void
 *
 * Cette méthode ouvre le gestionnaire de fichier pour joindre un fichier.
 **/
	fopen: function(application, callback){
		
		var win = $FM().open({
			quota:		100,
			prefixe:	'application',
			instanceid: 'appsme.file',
			join:		callback,
			title:		$MUI('AppsMe - ' + application.Name),
			icon:		'folder',
			parameters: 'Application_ID=' + application.Application_ID,
			home:		{text:application.Name, icon:'device-harddrive'}
		});
		
		if(!win) return;
		
		win.MinWin.setIcon('folder-24');
	},
/**
 * AppsUI.createPanelGeneral(win) -> Node
 * - win (Window): Instance de Window.
 *
 * Cette méthode créée le panneau de gestion de l'application
 **/
 	createPanelGeneral: function(win){
		var panel = new Panel({style:'min-height:400px; width:500px;', background:'application'});
		var forms = win.forms;
		var application = win.application;
		//
		// Name
		//
		forms.Name = new Input({type:'text', value:application.Name, className:'icon-cell-edit'});
		//
		//
		//
		forms.Parent_ID = new Select({
			link:		$S.link,
			parameters:	'cmd=application.list&options=' + Object.toJSON({op:'-select', default:true})
		});
		
		forms.Parent_ID.Value(application.Parent_ID);
		
		win.forms.addFilters('Parent_ID', function(){
			return this.Parent_ID.Value() == '' ? 0 : this.Parent_ID.Value();
		});
		//
		//
		//
		forms.Category_ID = new Select({
			link:		$S.link,
			parameters:	'cmd=appcategory.list&options=' + Object.toJSON({op:'-select'})
		});
		
		forms.Category_ID.Value(application.Category_ID);
		forms.Category_ID.load();
		
		win.forms.addFilters('Category_ID', function(){
			return this.Category_ID.Value() == '' ? 0 : this.Category_ID.Value();
		});
		
		//
		// Author
		//
		forms.Author = new Select({
			link: $S.link,
			parameters: 'cmd=application.author.list'	
		});
		forms.Author.Input.readOnly = false;
		forms.Author.Value(application.Author);
		forms.Author.load();
		//
		// Author_URI
		//
		forms.Author_URI = new Select({
			link: $S.link,
			parameters: 'cmd=application.author.uri.list'	
		});
		forms.Author_URI.Input.readOnly = false;
		forms.Author_URI.Value(application.Author_URI);
		forms.Author_URI.load();
		//
		// Author
		//
		forms.Application_URI = new Select({
			link: $S.link,
			parameters: 'cmd=application.uri.list'	
		});
		forms.Application_URI.Input.readOnly = false;
		forms.Application_URI.Value(application.Application_URI);
		forms.Application_URI.load();
		//
		// Icon
		//
		win.forms.Icon = new InputButton({icon:'attach', sync:true});
		win.forms.Icon.Text(application.Icon);
		
		win.forms.Icon.SimpleButton.on('click', function(){
			this.fopen(win.application, function(file){
				win.forms.Icon.Text(file.uri);
				win.forms.Icon.Value(file.uri);
				//win.forms.logoNode.picture.src = file.uri;
			});
		}.bind(this));
		//
		// Market
		//
		win.forms.Statut = new ToggleButton();
		win.forms.Statut.Value(application.Statut.match(/publish/));
		
		win.forms.addFilters('Statut', function(){
			return this.Statut.Value() ? 'publish' : 'draft';
		});
		//
		//
		//
		win.forms.Price = new Input({type:'number', decimal:2, value:application.Price});
		//
		//
		//
		if(win.application.Type == 'app'){
			var splite = 	new SpliteIcon($MUI('General information of your app'), $MUI('Modify the fields for customise your app') + ' :');
			splite.setIcon('application-48');
		}else{
			var splite = 	new SpliteIcon($MUI('General information of your plugin'), $MUI('Modify the fields for customise your plugin') + ' :');
			splite.setIcon('plugin-48');
		}
		
		if(win.forms.Icon.Value()){
			splite.select('.left-content')[0].css('background-image','url('+win.forms.Icon.Value()+')').css('background-size','contain');
		}
		
		win.forms.Icon.on('change', function(){
			splite.select('.left-content')[0].css('background-image','url('+win.forms.Icon.Value()+')').css('background-size','contain');
		});
		//
		//Table1
		//
		forms.Table1 = new TableData();
		forms.Table1.addHead($MUI('Name'), {style:'width:140px !important'}).addField(forms.Name).addRow();
		//forms.Table1.addHead($MUI('Type')).addField(forms.Type).addRow();		
		forms.Table1.addHead($MUI('Dependance')).addField(forms.Parent_ID).addRow();
		forms.Table1.addHead($MUI('Category')).addField(forms.Category_ID).addRow();
		forms.Parent_ID.load();
		
		//forms.Table1.addHead($MUI('Modèle clef API') + ' :').addField(' ').addRow();
		forms.Table1.addHead(' ', {height:8}).addRow();
		forms.Table1.addHead($MUI('Author')).addField(forms.Author).addRow();
		forms.Table1.addHead($MUI('Website')).addField(forms.Author_URI).addRow();
		forms.Table1.addHead($MUI('Website app')).addField(forms.Application_URI).addRow();
		forms.Table1.addHead($MUI('Publish')).addCel(forms.Statut, {height:30}).addRow();
		forms.Table1.addHead($MUI('Icon')).addField(forms.Icon).addRow();
		
		if(win.application.Type == 'app'){
			//forms.Table1.getRow(1).hide();
			forms.Table1.getRow(1).hide();
		}
		
		if(application.Application_ID == 0){
			forms.Icon.parentNode.parentNode.hide();
		}
		
		forms.Table1.addHead($MUI('Price')).addField(forms.Price).addRow();
		forms.Table1.addHead(' ', {height:8}).addRow();
		forms.Table1.addHead($MUI('Nb download')).addField(win.application.Nb_Downloads).addRow();
				
		panel.appendChild(splite);
		panel.appendChild(forms.Table1);
		
		forms.Name.on('mouseover', function(){
			win.Flag.setType(FLAG.RIGHT).setText('<p class="icon-documentinfo">' + $MUI('Enter here the name of your app') + '.</p>').color('grey').show(this, true);
		});
		
		forms.Author.on('mouseover', function(){
			win.Flag.setType(FLAG.RIGHT).setText('<p class="icon-documentinfo">' + $MUI('Choose the author\'s name of app') + '.</p><p>' + $MUI('If the name doesn\'t exists in the list enter it and it will be available for next time') + '.</p>').color('grey').show(this, true);
		});
		
		forms.Author_URI.on('mouseover', function(){
			win.Flag.setType(FLAG.RIGHT).setText('<p class="icon-documentinfo">' + $MUI('Choose the website link of author')
			+ '.</p><p>' + $MUI('If link doesn\'t exists in the list enter it and it will be available for next time') + '.</p>').color('grey').show(this, true);
		});
		
		forms.Application_URI.on('mouseover', function(){
			win.Flag.setType(FLAG.RIGHT).setText('<p class="icon-documentinfo">' + $MUI('Choose the website link of this app') + '.</p><p>' + $MUI('If link doesn\'t exists in the list enter it and it will be available for next time') + '.</p>').color('grey').show(this, true);
		});
		
		return panel;
	},
/**
 * AppsUI.createPanelDescription(win) -> Node
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
			media:						function(callback){this.fopen(win.application, callback)}.bind(this),
			content_css: 				$S.plugins.get('AppsMe').PathURI + 'css/editor.css',
			//theme_advanced_buttons1 : 	"formatselect,styleselect,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,link,unlink,|,charmap",
			/*style_formats : [
				{title : 'Note', block : 'p', classes : 'note', exact : true},
				{title : 'Package', block : 'p', classes : 'download-file', exact : true}
			]*/
		});
		
		win.forms.Description.Value(win.application.Description);
				
		widget.appendChild(widget.editor);
		widget.editor.Header().addClassName('group-button');
		widget.Header(widget.editor.Header());
		
		panel.appendChild(widget);
		
		this.onCreateEditor(win);
		
		return panel;
	},
	
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
			
			var splite = new SpliteIcon($MUI('Création d\'une galierie LightBox'), '');
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
				multiple:	true
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
						str += '<a href="'+ file +'" rel="lightbox['+ win.forms.Name.Value().replace(/ /gi, '').toLowerCase() +']" title="' + win.forms.Name.Value() + '"><img src="'+file+'"></a>';	
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
	},
/**
 * AppsUI.createPanelReleases(win) -> Node
 * - win (Window): Instance de Window.
 *
 * Cette méthode créée le panneau de gestion des releases.
 **/
 	createPanelReleases: function(win){
		//
		//
		//
		var panel = 	new Panel({backgorund:"application", style:'width:600px;'});
		panel.Compact(true);
		//
		// ComplexTable
		//
		var st = new WidgetTable({
			link: 		$S.link,
			parameters: 'cmd=application.release.list&options='+ Object.EncodeJSON({Application_ID:win.application.Application_ID}),
			field: 		'Statut',
			complex:	true,
			readOnly: 	true,
			empty:		'- ' + $MUI('No releases recorded') + ' -'
		});
		
		st.setTitle($MUI('List of releases'));
		st.setIcon('package');
		//st.htitle.hide();
		
		st.Table.onWriteName = function(key){
			return key == 'publish' ? $MUI("Published") : $MUI('Awaiting publication');	
		};
		
		st.addHeader({
			Statut: 				{title:" ", type:'action', width:80},
			Title:					{title:$MUI('Title')},
			Version: 				{title:$MUI('Version'), width:80, style:'text-align:center'},
			Date_Publication:		{title:$MUI('Posted on'), width:100, style:'text-align:center',  type:'date', format:'date'},
			Note:					{title:$MUI('Note'), width:45, style:'text-align:center'},
			Release_Nb_Download:	{title:$MUI('Nb download'), width:80, style:'text-align:center'}
		});
		
		st.addFilters('Statut', function(e, cel, data){
								
			if(win.application.Right == '3') {
				e.remove.hide();
			}
			
			var btn = new SimpleButton({icon:'system-attach'});
			btn.Mini(true);
			
			btn.on('click', function(){
				var win = $S.open(data.Link_Release, 'Exportation');
				win.resizeTo(0,0);
				new Timer(function(){win.close()}, 2).start();
			});
			
			btn.on('mouseover',function(){
				win.Flag.setText('<p class="icon-attach" style="text-align:left">' + $MUI('Download the archive') + ' : ' + data.Link_Release + '</p>').color('grey').setType(FLAG.TOP).show(this, true);
			});
			
			e.appendChild(btn);
		
			return e;
		});
		
		st.addFilters('Title', function(e){return '<p style="line-height:25px">' + e+ '</p>';});
				
		st.on('click', function(evt, data){
			this.openRelease(win, data);
		}.bind(this));
		
		st.on('open', function(evt, data){
			this.openRelease(win, data);
		}.bind(this));
		
		st.on('remove', function(evt, data){
			this.removeRelease(data, win);
		}.bind(this));
		
		st.on('complete', function(obj){
			if(1 * obj.maxLength) win.forms.BtnReleases.setTag(obj.maxLength);
		});
		
		panel.appendChild(st);
		
		win.ActiveProgress();
		if(win.application.Application_ID != 0) st.load();
				
		win.loadRelease = function(){
			win.ActiveProgress();
			st.setParameters('cmd=application.release.list&options='+ Object.EncodeJSON({Application_ID:win.application.Application_ID}));
			st.load();
		};
		
		
		return panel;
	},
/**
 * AppsUI.createWidgetUsers(win) -> WidgetTable
 *
 * Cette méthode créée le widget du listing des utilisateurs.
 **/	
	createWidgetUsers: function(win){
		var options = {
			range1:			25,
			range2:			50,
			range3:			100,
			link: 			$S.link,
			select:			false,
			complex:	 	true,
			completer:		false,
			readOnly:		true,
			field:			'Right',
			parameters: 	'cmd=application.user.list&Application_ID=' + win.application.Application_ID,
			empty:			'- ' + $MUI('No user\'s team member') + ' -',
		};
		
		//
		// Widget
		//
		var widget = new WidgetTable(options);
		
		widget.setStyle('margin-bottom:0px');
		widget.setStyle('margin:0');
		widget.Body().setStyle('min-height:400px');		
		widget.addHeader({
			Action: 		{title:' ', type:'action', width:10, sort:false},
			Avatar:			{title:$MUI(' '), style:'width:30px', sort:false},
			Name:			{title:$MUI('Name')},
			EMail:			{title:$MUI('E-mail'), width:'30'}
		});
										
		widget.Title($MUI('Listing of members'));
		widget.Body().setStyle('height:300px;min-height:250px');
		
		widget.Table.onWriteName = function(key){
			switch(key * 1){
				case 1: return $MUI('Administrators');
				case 2:	return $MUI('Moderators');
				case 3:	return $MUI('Contributors');
			}
		};
		//configuration de la table-----------------------------------------------		
		widget.addFilters(['Avatar'], function(e, cel, data){
			
			var deficon = 	data.Avatar48 == "" ? ((data.Civility == 'Mme.' || data.Civility == 'Mlle.') ? 'woman-48' : 'men-48') : data.Avatar48.replace('127.0.0.1', window.location.host);
			var button = 	new AppButton({icon: deficon, type:'mini'});
			button.addClassName('user');
			
			if(data.User_ID == $U().User_ID){
				button.css('border-color', '#DF0059');
			}
			
			if(1 * data.Is_Active == 1){
				button.appendChild(new Node('div', {className:'icon-block', style:'position:absolute;bottom:-3px;right:-3px;height:16px;width:16px'}));
			}
						
			return button;
		}.bind(this));
		
		widget.addFilters(['Name'], function(e, cel, data){
			//
			// HTML
			//
			var html = new HtmlNode();
			html.addClassName('user-list-node');
			html.setStyle('padding:4px');
			
			html.append('<h1><span class="user-lastname">' + data.FirstName + '</span> <span class="user-name">' + data.Name + '</span><p style="font-size:11px">Alias ' + data.Login + '</p></h1>');
						
			return html;
		});
		
		widget.addFilters('EMail', function(e, cel, data){
			var group = 	new GroupButton();
			var array =		[];
			//
			// mail
			//
			var button = 	new SimpleButton({icon:'mail'});
			
			button.on('click', function(evt){
				evt.stop();
				window.location = 'mailto:' + data.EMail;
			});
			
			button.on('mouseover', function(){
				win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cliquez ici pour contacter l\'utilisateur') + '.</p><p>E-mail : ' + data.EMail + '</p>');
				win.Flag.setType(FLAG.LEFT).color('grey').show(this, true);
				//win.Flag.decalTo(0, -widget.ScrollBar.getScrollTop());
			});
			
			array.push(button);
			//
			// mail
			//
			if(data.Phone != ''){
				var button = 	new SimpleButton({icon:'device-mobile'});
			
				button.on('click', function(evt){
					evt.stop();
					window.location = 'tel:' + data.Phone;
				});
				
				win.Flag.add(button, {
					orientation: 	Flag.TOP,
					text:			$MUI('N° téléphone') + ' : ' + data.Phone,
					icon:			'device-mobile',
					color:			'grey'
				});
				
				array.push(button);
			}
			//
			// mail
			//
			if(data.Mobile != ''){
				var button = 	new SimpleButton({icon:'device-mobile'});
			
				button.on('click', function(evt){
					evt.stop();
					window.location = 'tel:' + data.Mobile;
				});
				
				win.Flag.add(button, {
					orientation: 	Flag.TOP,
					text:			$MUI('N° mobile') + ' : ' + data.Mobile,
					icon:			'device-mobile',
					color:			'grey'
				});
				
				array.push(button);
			}
			
			if(options.lastConnexion){
				cel.setStyle('width:100px;text-align:center;');		
						
				if(data.Last_Connexion.toDate().minsDiff(new Date()) > 10){	
					var button = new SimpleButton({icon:'14-layer-visible'});
				}else{
					var button = new SimpleButton({icon:'14-layer-novisible'});
				}
				
				button.on('mouseover', function(){
					if(data.Last_Connexion && data.Last_Connexion != "0000-00-00 00:00:00"){
						win.Flag.setText('<p class="icon-clock">' + $MUI('Dernière connexion le') + ' ' + data.Last_Connexion.toDate().format('l d F Y ' + $MUI('à') + ' h\\hi') + '</p>');
					}else{
						win.Flag.setText('<p class="icon-clock">' + $MUI('Jamais connecté') + '</p>');
					}
					
					win.Flag.setType(FLAG.LT).color('grey').show(this, true);
					//win.Flag.decalTo(3, 3);
				});
				array.push(button);
			}
			
			group.appendChilds(array);
					
			return group;
		});
		
		win.loadUsers = function(){
			widget.load();
		};
		
		widget.addFilters('Action', function(e, cel, data){
					
			if(win.application.Right * 1 > 1){
				e.open.hide();
				e.remove.hide();
			}
			
			return e;
		});
		widget.on('open', function(evt, data){
			win.forms.EMail.value = data.EMail;
			win.forms.Right.Value(data.Right_User);
		});
		
		widget.on('remove', function(evt, data){
			this.removeUser(data, win);
		}.bind(this));
		
		return widget;
	},
/**
 * AppsUI.createPanelUsers(win) -> Node
 * - win (Window): Instance de Window.
 *
 * Cette méthode crée le panneau de gestion de l'équipe de développement.
 **/
	createPanelUsers: function(win){
		//
		// Panel
		//
		var panel = 		new Panel({background:"user", style:'min-height:300px;'});
		//
		// EMail
		//
		win.forms.EMail = 	new Node('input', {type:'text', className:'icon-cell-edit'});
		//
		// Right
		//
		win.forms.Right_User = new Select();
		win.forms.Right_User.setData([
			{value:1, text: $MUI('Administrateur')},
			{value:2, text: $MUI('Modérateur')},
			{value:3, text: $MUI('Contributeur')}
		]);
		win.forms.Right_User.selectedIndex(2);
		//
		//
		//
		win.forms.BtnAddMail = new SimpleButton({icon:'filesave', text:$MUI('Enregistrer'), type:'submit'});
		win.forms.BtnAddMail.setStyle('margin-bottom:5px');
		//
		// Splite
		//
		if(win.application.Right * 1 > 1){
			var splite = 	new SpliteIcon($MUI('Composition of the development team'));
		}else{
			var splite = 	new SpliteIcon($MUI('Managing your development team'), $MUI('Enter the email address of a user account so that it can access your Application') + ' :');
		}
		splite.setIcon('group-edit-48');
		//
		// ComplexTable
		//
		var widget = this.createWidgetUsers(win);				
		//
		// Table
		//
		var table = new TableData();
		table.addHead($MUI('E-mail address')  + ' :').addField(win.forms.EMail).addRow();
		table.addHead($MUI('Role')  + ' :').addField(win.forms.Right_User);
		
		panel.appendChild(splite);
		
		if(win.application.Right * 1 <= 1){
			panel.appendChild(table);
			panel.appendChild(win.forms.BtnAddMail);
		}
		
		panel.appendChild(widget);
		
		if(win.application.Application_ID != 0) widget.load();
		
		win.loadUsers = function(){
			win.ActiveProgress();
			widget.load();
		};

		win.forms.EMail.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Enter here the email address of a user account') + '.</p>');
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this,true);
		});
		
		win.forms.BtnAddMail.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Click the button to store the user account') + '.</p>');
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this,true);
		});
		
		win.forms.BtnAddMail.on('click', function(){
			if(win.forms.EMail.value == ''){
				return;	
			}
			
			if(!win.forms.EMail.value.isMail()){
				win.Flag.setText('<p class="icon-cancel">' + $MUI('Please enter a valid email address') + '.</p>');
				win.Flag.setType(FLAG.RIGHT).color('grey').show(this,true);
				return;	
			}
			
			win.ActiveProgress();
			
			$S.exec('application.user.commit', {
				parameters:'EMail=' + win.forms.EMail.value + '&Application_ID=' + win.application.Application_ID + '&Right=' + win.forms.Right_User.Value(),
				onComplete:function(result){
					switch(result.responseText){
						case 'user.mail.err':
							win.Flag.setText('<p class="icon-cancel">' + $MUI('No user account can be associated with the e-mail attachment') + '.</p>');
							win.Flag.setType(FLAG.TOP).color('grey').show(this,true);
							break;
						case 'application.user.commit':
							win.ActiveProgress();
							widget.load();
							win.forms.EMail.value = '';	
							break;		
					}
				}
			});
		});
		
		
		return panel;
	},
/**
 * AppsUI.openRelease(win, release) -> void 
 * - win (Window): Instance de window.
 * - release (Release): Instance d'une release.
 *
 * Cette méthode ouvre le formulaire de gestion des releases.
 **/
	openRelease: function(win, release){	
		release = new Release(release);
		release.Application_ID = 	win.application.Application_ID;
		release.Parent_ID = 		win.application.Parent_ID;
		release.Name =				win.application.Name; 
		release.Type =				win.application.Type; 
		
		return System.AppsMe.Release.open(release);
	},
/**
 * AppsUI.openManuel(win, man) -> void
 * - win (Window): Instance de window.
 * - man (Manuel): Instance d'un manuel.
 *
 * Cette méthode ouvre le formulaire de gestion des releases.
 **/
	openManuel: function(man){
		
	},
/**
 * AppsUI.listNotify() -> void
 *
 * Cette méthode liste les rapports non traité dans le gestionnaire de notification.
 **/
 	/*listNotify:  function($N){
		$S.exec('application.crash.list', {
			parameters:'options=' + escape(Object.toJSON({op:'-n'})),
			onComplete: function(result){
			
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){
					return;	
				}
				
				this.Menu.Tag.stopObserving('click');
				this.Menu.Tag.stopObserving('mouseover');
				this.Menu.Tag.stopObserving('mouseout');
				
				
				if(obj.length > 0){
					
					this.Menu.setTag(obj.length);
					
					this.Menu.Tag.on('mouseover', function(){
						$S.Flag.setText('<p class="icon-documentinfo">' + $MUI('Vous avez') + ' ' + obj.length + ' ' + $MUI('nouveau(x) rapport(s) d\'erreur. Cliquez pour les afficher.')).setType(FLAG.RT).color('grey').show(this, true);
					});
					
					this.Menu.Tag.on('click', function(evt){
						evt.stop();
						this.listing(1);
					}.bind(this));
					
				}else{
					this.Menu.setTag('');	
				}
			}.bind(this)
		});
	},*/
/**
 * AppsUI.openPreview(win, project) -> void
 **/	
	openPreview: function(win, application){
		
		win.widgetText.Body().innerHTML = '<h1 class="lighter">' + application.Name + '</h1>'
											+ '<ul><li>' 
											+ $MUI('Auteur') + ' : ' + application.Author + '</li><li>' 
											+ $MUI('Site web') + ' : <a href="#" onclick="window.open(\'' + application.Author_URI + '\', \'\')">' + application.Author_URI + '</a></li><li>'
											+ $MUI('Site projet') + ' : <a href="#" onclick="window.open(\'' + application.Application_URI + '\', \'\')">' + application.Application_URI + '</a></li></ul>'
											+ '<p>' + application.Description + '</p>';
		
		win.application = application;
	},
/**
 * AppsUI.createWidgetApps
 **/
 	createWidgetApps: function(win){
		
		var widget = new WidgetTable({
			range1:		1000, 
			range2:		1000, 
			range3:		1000,
			readOnly:	true,
			link: 		$S.link,
			parameters:	'cmd=application.list&options=' + Object.EncodeJSON({op:'-owner'}),
			selectable:	false,
			select:		false,
			completer:	false,
			complex:	true,
			field:		'Type',
			count:		false,			
			empty:		'- ' + $MUI('Aucune application') + ' -'
		});
		
		widget.DropMenu.hide();
		widget.Table.Header().hide();
		widget.setStyle('margin:0px');
		widget.Body().setStyle('height:450px');
		
		widget.Table.onWriteName = function(key){
			switch(key){
				case 'app':	return '<span class="icon-appsme" style="padding-left:25px">' + $MUI('Apps') + '</span>';
				case 'plugin':	return '<span class="icon-plugin" style="padding-left:25px">' + $MUI('Plugins') + '</span>';
			}
		};
		
		widget.addHeader({ 
			Icon:		{title: '', width:40, style:'text-align:center'},
			Name:		{title:$MUI('')},
			Action:		{title:$MUI(''), width:30, type:'action'}
		});
		
		widget.addFilters(['Action'], function(e, cel, data){
			e.open.hide();
						
			if(data.Right != '0'){
				e.remove.hide();
			}
		});
		
		widget.addFilters(['Name'], function(e, cel, data){
			var html = new HtmlNode();
			html.addClassName('html-node');
			html.setStyle('padding:5px');
			html.append('<h1 style="margin:0px;font-size:16px">' + e + '<p style="font-size:11px">' + $MUI('Created by') + ' ' + data.Author +'</p></h1>');
			
			return html;
		});
		
		widget.addFilters(['Icon'], function(e, cel, data){
			var button = new AppButton({icon:e ? e : (data.Type == 0 ? 'appsme' : 'plugin'), type:'mini'});									
			return button;
		}.bind(this));
		
		widget.on('click', function(evt,data){
			this.open(data);
		}.bind(this));
		
		widget.on('remove', function(evt,data){
			this.remove(data, win);
		}.bind(this));
		
		win.loadApps = widget.load.bind(widget);
		
		return widget;
	},
/**
 * AppsMe.App.listing(win) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode retourne la liste des applications du catalogue en ligne.
 **/	
	listing:function(win){
		
		System.AppsMe.setCurrent('apps');
		
		var panel = win.AppsMe;
		panel.Progress.show();
		
		var add = new Node('span', {className:'add icon icon-add-element', value:'Add'}, $MUI('Créer application'));
		add.on('click', function(){
			System.AppsMe.App.open({Type:'app'})
		});
		
		var add2 = new Node('span', {className:'add icon icon-add-element', value:'Add'}, $MUI('Créer extension'));
		add2.on('click', function(){
			System.AppsMe.App.open({Type:'plugin'})
		});
		
		panel.PanelBody.Header().appendChilds([
			add,
			add2
			//new Node('span', {className:'tool-contact export', value:'Export'}, $MUI('Exporter')),
			//new Node('span', {className:'tool-appsme name', value:'Name'}, $MUI('Name')),
			//new Node('span', {className:'tool-appsme note', value:'Note'}, $MUI('Note')),
			//new Node('span', {className:'tool-appsme popularity', value:'Popularity'}, $MUI('Popularity'))
		]);		
				
		$S.exec('application.list', {
			parameters:'options=' + escape(Object.toJSON({op:'-owner'})),
			onComplete:function(result){
				
				try{
					var array = $A(result.responseText.evalJSON());
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				try{		
					
				var self = this;
		
				if(array.length > 0){
								
					for(var i = 0; i < array.length; i++){
							
						var button = new $S.AppsMe.AppButton({
							icon:		array[i].Icon, 
							text:		array[i].Name + (!array[i].Version ? '' : ' v' + array[i].Version),
							subTitle:	array[i].Type == 'app' ? $MUI('App')  : $MUI(array[i].Category),
							price:		array[i].Price * 1 == 0 ? $MUI('Free') : ((array[i].Price * 1).toFixed(2) + ' €'),
							overable:	true
						});
												
						button.data = array[i];
						//
						// Button
						//
						var edit = 		new SimpleButton({icon:'search-14', type:'mini'});
						var remove =	new SimpleButton({icon:'cancel-14', type:'mini'});
						var node = 		new Node('div', {className:'wrap-button'}, [edit, remove]);
						
						button.appendChild(node);
															
						win.AppsMe.PanelBody.Body().appendChild(button);
						
						button.on('click', function(){
							//alert(document.HasScrolled);
							if(!document.HasScrolled){
								System.AppsMe.openApp(win, this.data);
							}
						});
						
						edit.on('click', function(){
							System.AppsMe.App.open(this.data);
						}.bind(button));
						
						remove.on('click', function(){
							System.AppsMe.App.remove(this.data, win);
						}.bind(button));
						
						button.addClassName('hide');
					}
					
					win.AppsMe.PanelBody.refresh();
					
					new Timer(function(){
						var b = win.AppsMe.body.select('.market-button.hide')[0];
						if(b){
							
							b.removeClassName('hide');
							b.addClassName('show');
						}
					}, 0.1, array.length).start();
					
				}else{
					if(!win.isSearch){
						win.AppsMe.PanelBody.Body().appendChild(new Node('H1', {className:'wrap-notfound'}, $MUI('Sorry. There is still no application available in this section') + '.'));
					}else{
						win.AppsMe.PanelBody.Body().appendChild(new Node('H1', {className:'wrap-notfound'}, $MUI('Sorry. No application for your search') + '.'));
					}
				}
								
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
 * AppsUI.remove(application, win) -> void
 * - win (Window): Instance de window.
 * - application (Application): Instance d'une application.
 *
 * Cette méthode supprime une application de la base de données.
 **/
	remove: function(application, win){
		
		application = 	new App(application);
				
		var box = 		win.AlertBox;
		var flag = 		box.box.createFlag().setType(FLAG.RIGHT);
		//---------------------
		//Splite---------------
		//---------------------		
		if(application.Type == 0){
			var splite = new SpliteIcon($MUI('Do you want remove the app') + ' "' + application.Name + '" ? ');
		}else{
			var splite = new SpliteIcon($MUI('Do you want remove the plugin') + ' "' + application.Name + '" ? ');
		}
		//
		//
		//
		var removeZip = new ToggleButton();
		removeZip.Value(false);
		//
		//
		//
		var backupData = new ToggleButton();
		backupData.Value(false);
		//
		//
		//
		var table = 	new TableData();
		
		table.addHead($MUI('Backup data') + ' ?', {width:200}).addCel(backupData).addRow();
		table.addHead($MUI('Remove all archive') + ' ?', {width:200}).addCel(removeZip);
		
		splite.setIcon('edittrash-48');
		splite.setStyle('max-width:500px');
		
		box.setTheme('flat black liquid');
		box.as([splite, new Node('h4', $MUI('Deletion settings')) , table]).ty();
		
		$S.fire('application:remove.open', box);
		
		box.show();
		
		box.submit({
			text:$MUI('Remove'),
			click:function(){
						
			var evt = new StopEvent(box);
				$S.fire('application:remove.submit', evt);
				
				if(evt.stopped)	return true;
							
				box.wait();
				
				application.remove(function(){
					box.hide();
					
					$S.fire('application:remove.complete');	
					
					var splite = new SpliteIcon($MUI('App correctly removed'), $MUI('App') + ' : ' + application.Name);
					splite.setIcon('valid-48');
									
					box.setTitle($MUI('Confirmation')).a(splite).setType('CLOSE').Timer(5).show();
					box.setIcon('documentinfo');
					
				}, {
					backup:backupData.Value(),
					remove:removeZip.Value()
				});
				
				return true;
			}
		});
				
	},
/**
 * AppsUI.removeRelease(win, release) -> void
 * - win (Window): Instance de window.
 * - release (Release): Instance d'une release.
 *
 * Cette méthode supprime une release de la base de données.
 **/
	removeRelease: function(release, win){
		
		release = 		new Release(release);
		var box = 		win.AlertBox;
		var flag = 		box.box.createFlag().setType(FLAG.RIGHT);
		//---------------------
		//Splite---------------
		//---------------------		
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer la release N°') + ' ' + release.Release_ID + ' ? ', release.Title);
		splite.setIcon('edittrash-48');
		splite.setStyle('max-width:500px');
		
		box.setTheme('flat black liquid');
		box.as([splite]).ty();
		
		$S.fire('release:remove.open', box);
		
		box.show();
		
		box.submit({
			text:$MUI('Supprimer'),
			click:function(){
							
				var evt = new StopEvent(box);
				$S.fire('release:remove.submit', evt);
				
				if(evt.stopped)	return true;
							
				box.wait();
				
				release.remove(function(){
					box.hide();
					$S.fire('release:remove.complete');	
					
					var splite = new SpliteIcon($MUI('Release correctement supprimé'), $MUI('Release') + ' N° ' + release.Release_ID);
					splite.setIcon('valid-48');
									
					box.setTitle($MUI('Confirmation')).a(splite).setType('CLOSE').Timer(5).show();
					box.getBtnReset().setIcon('cancel');
					box.setIcon('documentinfo');
					
				});
				
				return true;
			}
		});
		
	},
/**
 * AppsUI.removeUser(win, user) -> void
 * - win (Window): Instance de window.
 * - user (User): Information de l'utilisateur.
 *
 * Cette méthode supprime un utilisateur associé à l'application.
 **/
	removeUser: function(user, win){
		
		var box = 		win.AlertBox;
		var flag = 		box.box.createFlag().setType(FLAG.RIGHT);
		//---------------------
		//Splite---------------
		//---------------------		
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer l\'utilisateur de l\'équipe de développement') + ' ?', user.Name + ' ' + user.FirstName);
		splite.setIcon('edittrash-48');
		splite.setStyle('max-width:500px');
		
		box.setTheme('flat black liquid');
		box.as([splite]).ty();
		
		$S.fire('team:remove.open', box);
		
		box.show();
		
		box.submit({
			text:$MUI('Supprimer'),
			click:function(){
						
				var evt = new StopEvent(box);
				$S.fire('team:remove.submit', evt);
				
				if(evt.stopped)	return true;
							
				box.wait();
				
				$S.exec('application.user.delete', {
					parameters: 'User_ID=' + user.User_ID + '&Application_ID=' + win.application.Application_ID,
					onComplete:	function(){
						box.hide();
						$S.fire('team:remove.complete');	
						
						var splite = new SpliteIcon($MUI('L\'utilisateur ne fait plus parti de l\'équipe de développement') + '.', user.Name + ' ' + user.FirstName);
						splite.setIcon('valid-48');
										
						box.setTitle($MUI('Confirmation')).a(splite).setType('CLOSE').Timer(3).show();
						box.getBtnReset().setIcon('cancel');
						box.setIcon('documentinfo');
					}
				});
				
				return true;
			}
		});
				
	}
});

System.AppsMe.App.initialize();
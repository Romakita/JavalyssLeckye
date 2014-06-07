/** section: AutoDBBackup
 * System.AutoDBBackup
 *
 * Cet espace de nom gère l'extension AutoDBBackup
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : autodb.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/

System.AutoDBBackup = {
	className: 'autodbbackup',
/**
 * System.AutoDBBackup.initialize() -> void
 **/
	initialize: function(){		
		$S.on('system:startinterface', this.onStartInterface.bind(this));
	},
/**
 * System.AutoDBBackup.onStartInterface() -> void
 *
 * Méthode appelée au lancement de l'interface du logiciel.
 **/
 	onStartInterface: function(){
		
		this.Menu = $S.DropMenu.addMenu($MUI('AutoDB Backup'), {
			icon:		this.className,
			appName:	'AutoDB Backup'
		}).observe('click', function(){this.open()}.bind(this));	
		
	},
/**
 * System.AutoDBBackup.open() -> Window
 *
 * Ouvre la fenêtre principale de l'extension.
 **/
	open:function(){
		var win = $WR.unique(this.className, {
			autoclose:	false
		});
		
		//on regarde si l'instance a été créée
		if(!win) {			
			return $WR.getByName(this.className);
		}
				
		win.forms = {};
		win.Resizable(false);
		win.ChromeSetting(true);
		win.NoChrome(true);
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();	
		win.MinWin.setIcon(this.className);
		win.addClassName(this.className);
		//
		// TabControl
		//
		win.appendChild(this.createPanel(win));
				
		document.body.appendChild(win);
		
		$S.fire(this.className + ':open', win);
		
		win.resizeTo(800, 850);
		
		this.openPanelSave();
						
		return win;
	},
/**
 * System.Market.createPanel(win) -> Panel
 * - win (Window): Instance Window.
 *
 * Cette méthode créée le panneau de gestion du catalogue.
 **/
 	createPanel: function(win){
		
		var panel = win.Panel = new System.jPanel({
			title:			$MUI('AutoDB Backup'),
			icon:			this.className +'-32',
			search:			false
		});
		
		win.removeDrag();
		win.createDrag(panel.Header());
		
		var self =	this;
		panel.addClassName(this.className);
		panel.setTheme('grey flat');
		panel.Progress.addClassName('splashscreen');
		//
		//
		//
		panel.BtnSave = 	panel.DropMenu.addMenu($MUI('Sauvegarde'), {icon:'autodbbackup-save'});
		panel.BtnSave.parentNode.addClassName('save');
		panel.BtnSave.on('click', function(){
			System.AutoDBBackup.openPanelSave();
		});
		//
		//
		//
		panel.BtnRestore = 	panel.DropMenu.addMenu($MUI('Restoration'), {icon:'autodbbackup-restore'});
		panel.BtnRestore.parentNode.addClassName('restore');
		panel.BtnRestore.on('click', function(){
			System.AutoDBBackup.openPanelRestore();
		});
		
		return panel;
	},
/*
 *
 **/	
	setCurrent:function(currentName){
		var win = 	$WR.getByName(this.className);
		var panel = win.Panel;
		win.Panel.clear();
		
		try{
			win.Panel.setCurrentMenu($MUI(currentName));
		}catch(er){}
		
		panel.clearAll();
		win.CurrentName = name;
		
		panel.Open(false);
		win.destroyForm();
	},
/*
 *
 **/ 	
	openPanelSave:function(){
		
		var win = 	$WR.getByName(this.className);
		var panel = win.Panel;
		
		this.setCurrent('Sauvegarde');	
		
		var options = System.Meta('AUTO_DB_BACKUP') || {};
		
		if(Object.isUndefined(options.BACKUP_NEXT_TIME)){
			options.BACKUP_NEXT_TIME = '';
		}
		
		var body = panel.PanelBody.Body();
		var forms = new Extends.Form();
		//
		//
		//
		body.appendChild(new Node('H1', {style:'margin-bottom:0px'}, [
			$MUI('Gestion de la sauvegarde'), 
			new Node('p', $MUI('Choisissez les options de la sauvegarde automatique'))
		]));
		
		var node = new HtmlNode();
		//
		// Section TABLE
		//
		node.appendChild(new Node('h4', {style:'margin-top:0px'}, $MUI('Table à sauvegarder')));
			
		forms.BACKUP_TABLES = new ListBox({
								type:		Checkbox.BOX,
								parameters:	'cmd=system.table.list',
								empty: 		'- '  + $MUI('Aucune table à exporter') + ' -',
							});
							
		forms.BACKUP_TABLES.addClassName('backup-tables');					
		forms.BACKUP_TABLES.on('complete', function(){
			var win =	$WR.getByName(this.className);
			
			new Timer(function(){
				win.Panel.ProgressBar.hide();
				win.Panel.ProgressBar.removeClassName('splashscreen');
			}, 0.5, 1).start();
		}.bind(this));
		
		win.Panel.ProgressBar.show();
		
		if(options.BACKUP_TABLES){
			forms.BACKUP_TABLES.Value(options.BACKUP_TABLES);
		}
		
		forms.BACKUP_TABLES.load();
		
		/*forms.BACKUP_TABLES.on('draw', function(line){
			if(line.Text('software_meta')){
				line.Checked(true);
				line.hide();	
			}
		});*/
		
		//
		//
		//
		forms.SelectAll =		new ToggleButton({type:'mini'});
		forms.SelectAll.css('float', 'left');
		
		forms.BACKUP_TABLES.on('change', function(){
			forms.SelectAll.Value(forms.BACKUP_TABLES.select('.checkbox').length == forms.BACKUP_TABLES.select('.checkbox.checked').length);
		});
		
		forms.addFilters('BACKUP_TABLES', function(){
			var a = [];
			var array = forms.BACKUP_TABLES.Value();
			
			for(var i = 0; i < array.length; i++){
				a.push(array[i].value);
			}
			
			return a;
		});
		
		forms.SelectAll.on('change', function(){
			if(this.Value()){
				forms.BACKUP_TABLES.select('.checkbox').each(function(e){
					e.Checked(true);
				});
			}else{
				forms.BACKUP_TABLES.select('.checkbox').each(function(e){
					e.Checked(false);
				});	
			}
		});
		
		
		node.appendChild(forms.BACKUP_TABLES);
		node.appendChild(new Node('div', {style:'height:40px'},[
			forms.SelectAll, 
			new Node('div', {style:'float: left; line-height: 22px;padding-left:7px;'}, $MUI('sélectionner / désélectionner'))
		]));
		//
		// Section Stockage
		//
		node.appendChild(new Node('h4', {style:'margin-top:0px'}, $MUI('Options de sauvegarde')));
		//
		//
		//
		forms.BACKUP_ON_SERVER = 	new ToggleButton();
		forms.BACKUP_ON_SERVER.Value(options.BACKUP_ON_SERVER);
		//
		//
		//
		forms.BACKUP_BY_MAIL = 		new ToggleButton();
		forms.BACKUP_BY_MAIL.Value(options.BACKUP_BY_MAIL);
		//
		//
		//
		forms.BACKUP_MAIL_ADDR = 	new Input({type:'mail'});
		forms.BACKUP_MAIL_ADDR.css('width', '200px');
		forms.BACKUP_MAIL_ADDR.Value(options.BACKUP_MAIL_ADDR);
		//
		//
		//
		forms.BACKUP_FILES = 		new ToggleButton();
		forms.BACKUP_FILES.Value(options.BACKUP_FILES);
		//
		//
		//
		forms.BACKUP_PUBLICS = 		new ToggleButton({type:'mini'});
		forms.BACKUP_PUBLICS.Value(options.BACKUP_PUBLICS);
		//
		//
		//
		forms.BACKUP_PLUGINS = 		new ToggleButton({type:'mini'});
		forms.BACKUP_PLUGINS.Value(options.BACKUP_PLUGINS);
		
		var table = new TableData();
		table.addClassName('liquid');
		
		table.addHead($MUI('Stocker les sauvegardes sur le serveur') + ' ? ', {style:'width:250px; line-height:20px'}).addCel(forms.BACKUP_ON_SERVER).addRow();
		
		table.addHead($MUI('Sauvegarder les fichiers') + ' ? ', {style:'line-height:20px'}).addCel(forms.BACKUP_FILES).addRow();
		table.addHead($MUI('Sauvegarder le dossier publique') + ' ? ', {style:'line-height:20px'}).addCel(forms.BACKUP_PUBLICS).addRow();
		table.addHead($MUI('Sauvegarder les extensions') + ' ? ', {style:'line-height:20px'}).addCel(forms.BACKUP_PLUGINS).addRow();
		table.addHead('').addRow();
		table.addHead($MUI('Envoyer la sauvegarde par e-mail') + ' ? ', {style:'line-height:20px'}).addCel(forms.BACKUP_BY_MAIL).addRow();
		table.addHead($MUI('à l\'adresse suivante') + ' : ').addCel(forms.BACKUP_MAIL_ADDR).addRow();
		
		node.appendChild(table);
		
		if(forms.BACKUP_ON_SERVER.Value() == false){
			forms.BACKUP_FILES.Value(false);
			forms.BACKUP_FILES.parentNode.parentNode.hide();
		}
		
		if(forms.BACKUP_BY_MAIL.Value() == false){
			forms.BACKUP_MAIL_ADDR.parentNode.parentNode.hide();
		}
		
		if(forms.BACKUP_FILES.Value() == false){
			forms.BACKUP_PUBLICS.parentNode.parentNode.hide();
			forms.BACKUP_PLUGINS.parentNode.parentNode.hide();
		}
				
		forms.BACKUP_ON_SERVER.on('change', function(){
			
			if(this.Value() == false){
				forms.BACKUP_FILES.parentNode.parentNode.hide();
				forms.BACKUP_PUBLICS.parentNode.parentNode.hide();
				forms.BACKUP_PLUGINS.parentNode.parentNode.hide();	
				forms.BACKUP_FILES.Value(false);
			}else{
				forms.BACKUP_FILES.parentNode.parentNode.show();
				forms.BACKUP_PUBLICS.parentNode.parentNode.show();
				forms.BACKUP_PLUGINS.parentNode.parentNode.show();
				forms.BACKUP_FILES.Value(true);
			}
			
			panel.PanelBody.ScrollBar.refresh();
			
		});
		
		forms.BACKUP_FILES.on('change', function(){
			if(this.Value()){
				forms.BACKUP_PUBLICS.parentNode.parentNode.show();
				forms.BACKUP_PLUGINS.parentNode.parentNode.show();
			}else{
				forms.BACKUP_PUBLICS.parentNode.parentNode.hide();
				forms.BACKUP_PLUGINS.parentNode.parentNode.hide();	
			}
			
			panel.PanelBody.ScrollBar.refresh();
		});
		
		forms.BACKUP_BY_MAIL.on('change', function(){
			if(this.Value()){
				forms.BACKUP_MAIL_ADDR.parentNode.parentNode.show();
			}else{
				forms.BACKUP_MAIL_ADDR.parentNode.parentNode.hide();	
			}
			
			panel.PanelBody.ScrollBar.refresh();
		});
		
		//
		// Planification
		//
		node.appendChild(new Node('h4', {style:'margin-top:0px'}, $MUI('Planification des sauvegardes')));
		
		forms.BACKUP_SCHEDULE_MODE = new Select();
		forms.BACKUP_SCHEDULE_MODE.setData([
			{text:$MUI('Jamais'), value:'never'},
			{text:$MUI('Une fois par heure'), value:'oneperhour'},
			{text:$MUI('Une fois par jour'), value:'oneperday'},
			{text:$MUI('Une fois par semaine'), value:'oneperweek'}
		]);
		
		forms.BACKUP_SCHEDULE_MODE.css('width', '200px');
		
		forms.BACKUP_SCHEDULE_MODE.Value(options.BACKUP_SCHEDULE_MODE ?  options.BACKUP_SCHEDULE_MODE : 'never');
		
		forms.BACKUP_SCHEDULE_MODE.on('change', function(){
			
			var date = Object.isUndefined(options.BACKUP_LAST_TIME) ? new Date() : options.BACKUP_LAST_TIME.toDate();
			
			switch(this.Value()){
				case 'never':
					date = false;
					break;
						
				case 'oneperhour':
					date.setHours(date.getHours()+1,0,0);
					
					if(date.format('Y-m-d H:i:s') < new Date().format('Y-m-d H:i:s')){
						date = new Date();
						date.setHours(date.getHours()+1,0,0);	
					}
					
					break;	
					
				case 'oneperday':
					date.setHours(2,0,0);
					date.setDate(date.getDate() + 1);
										
					if(date.format('Y-m-d H:i:s') < new Date().format('Y-m-d H:i:s')){
						date = new Date();
						date.setHours(2,0,0);
						date.setDate(date.getDate() + 1);
						
					}
					
					break;	
					
				case 'oneperweek':
					
					date = date.endDate();
					date.setHours(2,0,0);
					
					if(date.format('Y-m-d H:i:s') < new Date().format('Y-m-d H:i:s')){
						date = new Date();
						date.setDate(date + 7);
						date.setHours(2,0,0);
					}
					break;	
			}
			
			table2.getCel(1,1).innerHTML = '<p>' + (date ? date.format('l d F Y à H\\h') : $MUI('Jamais')) + '</p>';
			
		});
		//
		//
		//
		//forms.BACKUP_NEXT_TIME = new Input({value:options.BACKUP_NEXT_TIME ? options.BACKUP_NEXT_TIME : ''});
		
		var table2 = new TableData();
		table2.addClassName('liquid');
				
		table2.addHead($MUI('Effectuer la sauvegarde auto') + ' : ', {style:'width:250px;'}).addCel(forms.BACKUP_SCHEDULE_MODE).addRow();
		table2.addHead($MUI('Prochaine sauvegarde le') + ' : ', {style:'line-height:20px'}).addField(options.BACKUP_NEXT_TIME != '' ? options.BACKUP_NEXT_TIME.toDate().format('l d F Y à H\\h') : $MUI('Jamais')).addRow();
		
		node.appendChild(table2);
		
		forms.BACKUP_SCHEDULE_MODE.fire('change');
		//
		// Sauvegarde des options
		//
		var submit = new SimpleButton({type:'submit', text:$MUI('Enregistrer')});
		submit.css('padding', '5px 6px').css('margin-right', '15px');
		
		submit.on('click', function(){
			
			var options = forms.save(System.Meta('AUTO_DB_BACKUP') || {});
			
			System.Meta('AUTO_DB_BACKUP', options);
			
			var box = win.createBox();
			var splite = new SpliteIcon($MUI('Configuration correctement sauvegardée'));
			splite.setIcon('valid-48');
			
			box.setTheme('flat white');
			box.a(splite).setType('CLOSE').show();	
			
		});
		
		node.appendChild(submit);
		//
		// Generation d'une archive
		//
		var btnSave = new SimpleButton({text:$MUI('Sauvegarder maintenaint')});
		btnSave.css('padding', '5px 6px');
		
		btnSave.on('click', function(){
			var options = forms.save(System.Meta('AUTO_DB_BACKUP') || {});
			
			System.Meta('AUTO_DB_BACKUP', options);
			System.AutoDBBackup.dumpStart(function(){
				var splite = new SpliteIcon($MUI('La sauvegarde c\'est correctement déroulée'), $MUI('L\'archive est disponible dans le panneau "Restoration"'));
				splite.setIcon('valid-48');
				
				System.AlertBox.setTheme('flat liquid white');
				System.AlertBox.a(splite).setType('CLOSE').show();	
			});
		});
		
		node.appendChild(btnSave);
		
		body.appendChild(node);
		
		panel.PanelBody.ScrollBar.refresh();
	},
/*
 *
 **/ 	
	openPanelRestore:function(){
		var win = 	$WR.getByName(this.className);
		var panel = win.Panel;
		
		this.setCurrent('Restoration');	
		
		var body = panel.PanelBody.Body();
		
		//
		//
		//
		body.appendChild(new Node('H1', {style:'margin-bottom:0px'}, [
			$MUI('Centre de restoration'), 
			new Node('p', $MUI('Veuillez choisir une sauvegarde à restorer') + ' : ')
		]));
				
		var node = new HtmlNode();
		var forms = new Extends.Form();
		
		forms.File = new System.AutoDBBackup.ListBox({
			
			onLoad:function(){
				win.Panel.ProgressBar.show();	
			},
			
			onComplete:function(){
				win.Panel.ProgressBar.hide();
			},
			
			onDraw:function(button){
				button.BtnRemove.on('click', function(){
					System.AutoDBBackup.remove(button.data, function(){
						forms.File.load();
					});
				});
			}
		});
		
		forms.File.load();		
		node.appendChild(forms.File);
		//
		// Options restoration
		//
		node.appendChild(new Node('h4', {style:'margin-top:0px'}, $MUI('Options de restoration')));
		//
		//
		//
		forms.BackupBeforeRestore = new ToggleButton();
	//	forms.BackupBeforeRestore.Value(true);
		//
		//
		//
		forms.RestoreFiles = new ToggleButton();
		//
		//
		//
		forms.RestoreAllTables = new ToggleButton();
		
		forms.RestoreAllTables.on('change', function(){
			if(this.Value()){
				forms.RestoreTables.parentNode.parentNode.hide();
			}else{
				forms.RestoreTables.parentNode.parentNode.show();
			}
		});
		//
		//
		//
		forms.RestoreTables = new Select({
			multiple:	true,
			parameters:	'cmd=system.table.list'
		});
		
		forms.RestoreTables.css('width', '200px');
		
		var options = System.Meta('AUTO_DB_BACKUP') || {};
		
		forms.RestoreTables.Value(options.BACKUP_TABLES || '');
		forms.RestoreTables.load();
		
		forms.addFilters('RestoreTables', function(){
			
			if(this.RestoreAllTables.Value()){
				return '';
			}
			
			var a = [];
			
			this.RestoreTables.Value().each(function(e){
				a.push(e.value);
			});
			
			return a;
		});
		
		var table = new TableData();
		table.addClassName('liquid');
		
		table.addHead($MUI('Sauvegarder les données avant restoration') + ' ? ').addCel(forms.BackupBeforeRestore).addRow();
		table.addHead($MUI('Restorer les fichiers') + ' ? ').addCel(forms.RestoreFiles).addRow();
		table.addHead($MUI('Restorer toutes les tables') + ' ? ').addCel(forms.RestoreAllTables).addRow();
		table.addHead($MUI('Choisissez les tables à restorer') + ' : ').addCel(forms.RestoreTables).addRow();
						
		node.appendChild(table);
		//
		// Sauvegarde des options
		//
		var submit = new SimpleButton({text:$MUI('Restorer')});
		submit.css('padding', '5px 6px').css('margin-right', '15px');
		
		submit.on('click', function(){
			
			var options = forms.save();
			
			if(options.File == ''){
				return;	
			}
			
			if(options.BackupBeforeRestore){
				System.AutoDBBackup.dumpStart(function(){
					System.AutoDBBackup.restoreStart(options);
				});
			}else{
				System.AutoDBBackup.restoreStart(options);
			}
			
			/*System.AutoDBBackup.dumpStart(function(){
				var splite = new SpliteIcon($MUI('La sauvegarde c\'est correctement déroulée'), $MUI('L\'archive est disponible dans le panneau "Restoration"'));
				splite.setIcon('valid-48');
				
				System.AlertBox.setTheme('flat liquid white');
				System.AlertBox.a(splite).setType('CLOSE').show();	
			});*/
			
		});
		
		node.appendChild(submit);
		
		body.appendChild(node);
	},
/*
 *
 **/	
	dumpStart:function(callback){
		
		var options = 		System.Meta('AUTO_DB_BACKUP');
		this.maxLength = 	options.BACKUP_TABLES.length + 5;
		this.current =  	0;
				
		var splite = new SpliteIcon($MUI('Sauvegarde du logiciel en cours'), $MUI('Veuillez patientez pendant que le logiciel sauvegarde les données') + '.');
		splite.setIcon('autodbbackup-save-48');
		
		System.AlertBox.hide();
		System.AlertBox.setTheme('flat black');
		System.AlertBox.progressBar(1, this.maxLength, $MUI('Création du dossier de stockage')).a(splite).show();
				
		System.exec('autodb.backup.init', function(result){
			
			if(options.BACKUP_TABLES.length > 0){
				this.dumpNext(callback);
			}else{
				this.dumpFiles(callback);
			}
			
		}.bind(this));
	
	},
/*
 *
 **/	
	dumpNext:function(callback){
		var options = 	System.Meta('AUTO_DB_BACKUP');
		var table = 	options.BACKUP_TABLES[this.current];
		
		System.AlertBox.setProgress(this.current+2, this.maxLength, $MUI('Sauvegarde de la table') + ' ' + table);
	
		System.exec('autodb.backup.dump.table', {
			parameters: 'Table=' + encodeURIComponent(table),
			onComplete:function(result){
				
				$S.trace(result.responseText);
				
				try{
					result.responseText.evalJSON();
				}catch(er){
					System.AlertBox.hide();
					return;
				}
				this.current++;
				
				if(this.current < options.BACKUP_TABLES.length){
					this.dumpNext(callback);	
				}else{
					this.dumpFiles(callback);
				}
			
			}.bind(this)
		});	
		
	},
/*
 *
 **/	
	dumpFiles:function(callback){
		var options = System.Meta('AUTO_DB_BACKUP');
		
		if(options.BACKUP_FILES){
						
			System.AlertBox.setProgress(this.current+3, this.maxLength, $MUI('Copie des fichiers'));
			
			System.exec('autodb.backup.dump.files', function(result){
				$S.trace(result.responseText);
				this.package(callback);	
			
			}.bind(this));
			
		}else{
			this.package(callback);	
		}
	},
/*
 *
 **/	
	package:function(callback){
		
		System.AlertBox.setProgress(this.current+4, this.maxLength, $MUI('Création de l\'archive'));
		
		System.exec('autodb.backup.package', function(result){
			$S.trace(result.responseText);
			System.AlertBox.hide();
						
			if(Object.isFunction(callback)){
				callback.call(this);
			}
		}.bind(this));
	},
/*
 *
 **/	
	restoreStart:function(options){
		
		this.maxLength = 	options.RestoreTables.length + 3;
		this.current =  	0;
				
		var splite = new SpliteIcon($MUI('Restoration du logiciel en cours'), $MUI('Veuillez patientez pendant que le logiciel restore les données') + '.');
		splite.setIcon('autodbbackup-restore-48');
		
		System.AlertBox.hide();
		System.AlertBox.setTheme('flat black');
		System.AlertBox.progressBar(1, this.maxLength, $MUI('Restoration des tables')).a(splite).show();
		
		System.exec('autodb.restore.init', {
			parameters:'options=' + Object.EncodeJSON(options),
			onComplete: function(result){
				
				if(options.RestoreTables == ''){
					options.RestoreTables = result.responseText.evalJSON();
					this.maxLength = 	options.RestoreTables.length + 3;
				}
				
				if(options.RestoreTables.length > 0){
					this.restoreNext(options);
				}else{
					this.restoreFiles(options);
				}
				
			}.bind(this)
		});
		
	},
/*
 *
 **/	
	restoreNext:function(options){
		
		var table = 	options.RestoreTables[this.current];
		
		System.AlertBox.setProgress(this.current+2, this.maxLength, $MUI('Restoration de la table') + ' ' + table);
	
		System.exec('autodb.restore.table', {
			parameters: 'options=' + Object.EncodeJSON(options) + '&Table=' + encodeURIComponent(table),
			onComplete:function(result){
				
				$S.trace(result.responseText);
								
				this.current++;
				
				if(this.current < options.RestoreTables.length){
					this.restoreNext(options);
				}else{
					this.restoreFiles(options);
				}
			
			}.bind(this)
		});	
		
	},
/*
 *
 **/	
	restoreFiles:function(options){
				
		if(options.RestoreFiles){
						
			System.AlertBox.setProgress(this.current+2, this.maxLength, $MUI('Restoration des fichiers'));
			
			System.exec('autodb.restore.files', function(result){
				
				System.exec('autodb.restore.clean');
								
				System.AlertBox.setProgress(this.current+3, this.maxLength, $MUI('Restoration terminée. Redemarrage du logiciel...'));
				System.AlertBox.hide();
				window.location.reload();
							
			}.bind(this));
			
		}
		
		System.exec('autodb.restore.clean');
		
		System.AlertBox.setProgress(this.current+3, this.maxLength, $MUI('Restoration terminée. Redemarrage du logiciel...'));
		window.location.reload();
	},
/**
 *
 **/	
	remove:function(file, callback){
		
		var win = $WR.getByName(this.className);
		var box = win.createBox();
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer cette sauvegarde') +' ? ', 'Sauvegarde du ' + file.date.toDate().toString_('datetime', 'fr'));
		splite.setIcon('edittrash-48');
		//
		// 
		//
		box.setTheme('flat black');
		box.a(splite).setType().show();
		
		$S.fire(this.className + ':remove.open', box);
		
		box.reset(function(){
			box.setTheme();	
		});
						
		box.submit({
			text:$MUI('Supprimer la sauvegarde'),
			
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire(this.className + ':remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				System.exec('autodb.backup.remove', {
					parameters:'File=' + Object.EncodeJSON(file),
					onComplete:function(result){
						$S.trace(result.responseText);
						box.hide();
						
						$S.fire(this.className + ':remove.submit.complete', evt);
						
						if(Object.isFunction(callback)){
							callback.call(this);
						}
						
						//
						// Splite
						//
						var splite = new SpliteIcon($MUI('La sauvegarde a bien été supprimé'));
						splite.setIcon('valid-48');
						
						box.setTheme('flat white');
						box.a(splite).setType('CLOSE').Timer(5).show();
					
						
					
					}.bind(this)
				
				});
				
			}.bind(this)
		});
	}
};

System.AutoDBBackup.initialize();

System.AutoDBBackup.ListBox  = Class.createElement('div');
System.AutoDBBackup.ListBox.prototype = {
	className:'wobject border listbox-revision',
	
	onLoad:		null,
	onComplete:	null,
	onDraw:		null,
/*
 *
 **/	
	initialize:function(options){
		
		Object.extend(this, options || {});
		//
		//
		//
		this.body = 	new Node('div', {className:'wrap-body'})
		//
		//
		//
		this.NavBar = new NavBar({
			range1:			5,
			range2:			5,
			range3:			5
		});
		
		this.NavBar.GroupPaging.addClassName('hide');
		this.NavBar.setMaxLength(0);
		//
		// Frameworker
		//
		this.FrameWorker = new FrameWorker({
			type:		'mini',
			text: 		$MUI('Ou charger une sauvegarde Sql'),
			parameters:	'cmd=autodb.backup.import'
		});
		
		this.FrameWorker.on('error',function(result){
			$S.trace(result.responseText);
			this.removeClassName('upload');
		}.bind(this));
		
		this.FrameWorker.on('complete',function(){
			this.addClassName('upload');
			this.body.select('.checked')[0].Checked(false);
			this.body.select('.checked').invoke('removeClassName', 'checked');
			this.body.select('.autodb-button.selected').invoke('removeClassName', 'selected');
			
			if(Object.isFunction(this.onChange)){
				this.onChange.call(this, evt);
			}
			
		}.bind(this));
		
		this.FrameWorker.on('cancel',function(){
			this.removeClassName('upload');
		}.bind(this));
		
		this.FrameWorker.on('change',function(){
			this.removeClassName('upload');
		}.bind(this));
		
		this.FrameWorker.DropFile.addDragArea(this);
		this.FrameWorker.DropFile.addDropArea(this);
		
		this.appendChild(this.NavBar);
		this.appendChild(this.body);	
		this.appendChild(this.FrameWorker);	
		
		this.NavBar.on('change', function(){
			this.load();
		}.bind(this));
	},
/*
 *
 **/	
	load:function(){
		
		if(Object.isFunction(this.onLoad)){
			this.onLoad.call(this);
		}
		
		this.body.removeChilds();
		
		System.exec('autodb.list', {
			parameters:'clauses=' + this.NavBar.getClauses().toJSON(),
			onComplete:function(result){
				
				var array = result.responseText.evalJSON();
				var self =	this;
				
				this.NavBar.setMaxLength(array.maxLength);
				
				for(var i = 0; i < array.length; i++){
					
					var button = new System.AutoDBBackup.ListBox.Button(array[i]);
					button.data = array[i];
					
					if(i == 0){
						button.Checkbox.Checked(true);
						button.addClassName('selected');
					}
						
					button.Checkbox.on('change', function(evt){
						
						self.FrameWorker.Value('');
						self.removeClassName('upload');
						
						if(Object.isFunction(self.onChange)){
							self.onChange.call(self, evt, this);
						}
						
						self.select('.autodb-button.selected').invoke('removeClassName', 'selected');
						this.addClassName('selected');
						
					}.bind(button));
					
					this.body.appendChild(button);
					
					if(Object.isFunction(this.onDraw)){
						this.onDraw.call(this, button);
					}
				}
								
				if(Object.isFunction(this.onComplete)){
					this.onComplete.call(this);
				}
				
			}.bind(this)
		});
		
	},
/*
 *
 **/	
	Value:function(){
		
		if(this.FrameWorker.Value() != ''){
			return this.FrameWorker.Value();
		}
		
		var o = this.body.select('.checked');
		
		if(o.length == 0){
			return '';	
		}
		
		return o[0].parentNode.data;
	}
	
};

System.AutoDBBackup.ListBox.Button = Class.from(AppButton);
System.AutoDBBackup.ListBox.Button.prototype = {
	
	className:'wobject market-button autodb-button overable show',
/**
 * new System.MyStore.Product.Button([options])
 **/	
	initialize:function(file){		
		
		this.setIcon('autodbbackup-' + file.type);
		
		this.setText('Sauvegarde du ' + file.date.toDate().toString_('datetime', 'fr'));
		
		//
		//
		//
		this.SubText = new Node('span', {className:'wrap-subtitle'});
		this.SubText.innerHTML = 'Taille : ' + (file.size / 1024 / 1024).toFixed(2).replace('.', ',') + ' Mo';
		
		this.iFrame = new Node('iframe', {style:'display:none'});
		//
		//
		//
		this.BtnRemove = new SimpleButton({nofill:true, icon:'remove-element'});
		this.BtnRemove.addClassName('btn-remove');
		//
		//
		//
		if(Object.isArray(file.uri)){
			this.BtnDownload = new SimpleMenu({nofill:true, icon:'autodbbackup-download'});
			this.BtnDownload.addClassName('btn-download');
			this.BtnDownload.BtnDB = new LineElement({text:$MUI('Télécharger la base de données')});
			this.BtnDownload.BtnDB.on('click', function(){
				
				var win = System.open(file.uri[0].match(/-db/) ? file.uri[0] : file.uri[1], this.getText(), {height:50,width:200});
				win.hide();
				win.setIcon('autodbbackup-download');
										
			}.bind(this));
			
			this.BtnDownload.BtnFiles = new LineElement({text:$MUI('Télécharger les fichiers')});
			this.BtnDownload.BtnFiles.on('click', function(){
				
				this.iFrame.src = file.uri[0].match(/-files/) ? file.uri[0] : file.uri[1];				
										
			}.bind(this));
			
			this.BtnDownload.appendChild(this.BtnDownload.BtnDB);
			this.BtnDownload.appendChild(this.BtnDownload.BtnFiles);
		}else{
		
			this.BtnDownload = new SimpleButton({nofill:true, icon:'autodbbackup-download'});
			this.BtnDownload.addClassName('btn-download');
			this.BtnDownload.on('click', function(){
								
				this.iFrame.src = file.uri;
				
			}.bind(this));
		}
		//
		//
		//
		this.Checkbox = new Checkbox({type:'radio', name:'autodbrev'});
						
		this.appendChild(this.SubText);
		this.appendChild(this.Checkbox);
		
		if($U().getRight() != 3){
			this.appendChild(this.BtnDownload);
			this.appendChild(this.BtnRemove);
			this.appendChild(this.iFrame);
		}
		
		this.on('click', function(evt){
			this.Checkbox.Checked(true);
			this.Checkbox.fire('checkbox:change', evt);
		}.bind(this));
		
	},
		
	setSubText:function(title){
		this.setSubText.innerHTML = title;
		return this;
	},
	
	Overable:function(bool){
		this.removeClassName('overable');
		
		if(bool){
			this.addClassName('overable');	
		}
	}
};
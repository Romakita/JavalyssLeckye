var WinFileManager = 	Class.from(Window);
var wFilemanager = 		WinFileManager;
/** section: UI
 * class wFilemanager < Window
 *
 * Cette classe permet la gestion des fichiers sur un serveur web.
 *
 **/
wFilemanager.prototype = {
/**
 * wFilemanager#AlertBox -> AlertBox
 * Instance de l'AlertBox relative à la fenêtre.
 **/
	Alert: 			null,
/**
 * wFilemanager#link -> String
 * Lien de la passerelle PHP.
 **/
	link:				'',
/**
 * wFilemanager#folder -> String
 * Chemin relatif du dossier ouvert.
 **/
	folder:				'',
/**
 * wFilemanager#folderInfo -> Object
 * Informations sur le dossier ouvert.
 **/
 	folderInfo:			null,
	
	prefixe:			'',
	cmd:				'',
	parameters:			'',
/**
 * wFilemanager#quota -> Number
 * Indique la taille maximal en Mo que le gestionnaire autorise en stockage.
 **/
	quota:				0,
/**
 * wFilemanager#fileassoc -> Object
 * Tableau associatif des icones en fonction de l'extension.
 **/
	fileassoc: null,
/**
 * wFilemanager#fileprog -> Object
 * Tableau associatif des icones en fonction de l'extension.
 **/	
	fileprog:{},
/**
 * new wFilemanager([options])
 * - options (Object): Object de configuration.
 *
 * Cette méthode créée une nouvelle instance de wFilemanager.
 * 
 * #### Attributs du paramètre options
 * 
 * Le constructeur prend en charge un paramètre `options` permettant de configurer l'instance rapidement :
 *
 * * `title` (`String`): Titre à afficher dans le splite.
 * * `quota` (`Number`): Espace de stockage gérée.
 * * `cmd` (`String`): Nom de la variable des commandes.
 * * `opener` (`Boolean`): Indique si le lien Ouvrir est à afficher.
 * * `join` (`Boolean`): Indique si le lien Joindre est activé.
 * * `readonly` (`Boolean`): Indique si le gestionnaire est en lecture seule.
 * * `explorer` (`Boolean`): Affiche le panneaux d'exploration.
 *
 **/
	initialize: function(obj){
		var options = {
			right:		true,
			left:		true,
			quota:		0,
			title: 		$MUI('File manager'),
			link:		$WR().getGlobals('link'),
			cmd:		'cmd',
			opener:		true,
			join:		false,
			readonly: 	false,
			explorer:	true,
			keyPlace:	'uri',
			prefixe:	'',
			maxSize:	2097152,
			parameters:	'',
			home:		{text:'/', icon:'device-harddrive'}
		};
		
		this.addClassName('filemanager');
		
		if(!Object.isUndefined(obj)) Object.extend(options, obj);
		
		this.fileassoc = {};
		Object.extend(this.fileassoc, $WR().FileIcons);
		 
		this.link = 		options.link;
		this.modeOpen =		options.opener;
		this.modeJoin =		options.join;
		this.readonly = 	options.readonly;
		this.quota = 		options.quota;
		this.cquota =  		0;
		this.cmd = 			options.cmd;
		this.folder =		'';
		this.keyPlace = 	options.keyPlace;
		this.prefixe =		options.prefixe;
		this.parameters = 	options.parameters;
		
		this.oncontextmenu = function(){return false;};
		//#pragma region Instance	
		
		this.setTitle($MUI('File import')).setIcon('fileimport');

		this.Alert = this.AlertBox = this.createBox();
		this.Flag = 			this.createFlag().setType(FLAG.RIGHT);
		this.ProgressBar =		this.createProgressBar();
		this.ProgressBar.hide();
		this.setIcon('file-manager');
		this.resizeTo(800,600);
		//
		//ContextMenu
		//
		this.createContextMenu(options);		
		//
		//WinExport
		//
		this.FormExport = 	new FrameWorker({
			title: 		$MUI('Download file'),
			select:		false,
			link:		this.link,
			debug:		false,
			upload:		false,
			cmd:		'cmd=' + this.prefixe + 'filemanager.export',
			parameters: options.parameters
		});
				
		this.FormExport.Input.name =		"file";
		this.FormExport.setParameters('Quota', options.quota);
		this.FormExport.hide();
		//
		//Explorer
		//		
		this.createPanelExplorer(options);
		this.createPanelUpload(options);
		this.createMenu(options);
		this.createFooter(options);	
		//
		// Observer
		//		
		this.Observer =			new Observer();
		this.Observer.bind(this);
				
		//#pragma endregion Instance
		this.appendChild(this.Explorer);
		this.appendChild(this.BodyExplorer);
		this.appendChild(this.FormImport);
		this.appendChild(this.FormExport);
		this.appendChild(this.ContextMenu);
		
		this.Footer().appendChild(this.TableInfo);
		
		this.observe_ = this.observe;
		
		this.observe = function(eventName, callback){

			switch(eventName){
				case 'draw':
				case 'complete':
				case 'click.file':
				case 'click.folder':
				case 'click.right.folder':
				case 'open.property':
				case 'open.remove':
				case 'open.rename':
				case 'open.copy':
				case 'submit.remove':
				case 'submit.rename':
				case 'submit.copy':
				case 'join':
					this.Observer.observe('filemanager:'+eventName, callback);
					break;	
				default:this.observe_(eventName, callback);
			}
			return this;
		};
		
		this.stopObserving_ = this.stopObserving;
		
		this.stopObserving = function(eventName, callback){
			
			switch(eventName){
				case 'draw':
				case 'complete':
				case 'click.file':
				case 'click.folder':
				case 'click.right.folder':
				case 'open.property':
				case 'join':
					this.Observer.stopObserving('filemanager:'+eventName, callback);
					break;
				default:this.stopObserving_(eventName, callback);
			}
			return this;
		};
		
		this.BtnNew.on('click',this.create.bind(this));
		this.BtnCreate.on('click',this.create.bind(this));
		this.BtnRefresh.on('click',this.load.bind(this));
		this.BtnOpen.on('click',this.open.bind(this));
		this.BtnJoin.on('click',this.join.bind(this));
		this.BtnDownload.on('click',this.download.bind(this));
		
		this.BtnCopy.on('click',this.copy.bind(this));
		this.BtnCut.on('click',this.cut.bind(this));
		this.BtnPaste.on('click',this.paste.bind(this));
			
		this.BtnDelete.on('click',this.remove.bind(this));
		this.BtnRename.on('click',this.rename.bind(this));
			
		this.BtnProperty.on('click',this.property.bind(this));
		
		this.BtnCopy2.on('click',this.copy.bind(this));
		this.BtnDelete2.on('click',this.remove.bind(this));
		this.BtnRename2.on('click',this.rename.bind(this));
		this.BtnProperty2.on('click',this.property.bind(this));
		
		this.FormImport.observe('complete', function(){
			if(this.FormImport.hasFileAPI) {
				
				if(!this.FormImport.DropFile.pending()){
					this.FormImport.DropFile.clearLoaded();
					this.load();
				}
			}else{
				this.load();
			}
		}.bind(this));
				
		this.on('resize', function(){
			this.BodyExplorer.ScrollBar.refresh();
			this.BodyExplorer.ScrollBar.scrollToStart();
		}.bind(this));
		
		if(this.FormImport.hasFileAPI) {
			this.FormImport.DropFile.addDragArea(this.BodyExplorer);
			this.FormImport.DropFile.addDropArea(this.BodyExplorer);
		}
	},
/*
 * wFileManager#createPanelExplorer(options) -> void
 **/	
	createPanelExplorer: function(options){
		
		this.Explorer = new Explorer({
			link: 		 	this.link,
			parameters:  	options.cmd+'=' + this.prefixe + 'filemanager.arborescence' + (options.parameters != '' ? '&' + options.parameters : ''),
			home:			options.home
		});
		
		this.Explorer.ContextMenu.observe('click', this.onClickRightFolder.bind(this));
		this.Explorer.observe('click', this.onClickFolder.bind(this));
		
		this.Explorer.observe('draw', function(line){
			line.Header().addClassName('drop-folder-area');
			line.Header().data = line.data;
		});
		
		this.Explorer.Home.Header().addClassName('drop-folder-area');
		this.Explorer.Home.Header().data = 'home';
		
		this.Explorer.ContextMenu.appendChilds([
			this.BtnCopy2 = 	new LineElement({title: $MUI('Copy'), icon:'editcopy'}),
			this.BtnPaste =		new LineElement({title: $MUI('Paste'), icon:'editpaste', border:true}),
			this.BtnDelete2 = 	new LineElement({title: $MUI('Remove'), icon:'delete'}),
			this.BtnRename2 = 	new LineElement({title: $MUI('Rename'), icon:'cell-edit', border:true}),
			this.BtnNew = 		new LineElement({title: $MUI('New folder'), icon:'folder-add', border:true}),
			this.BtnProperty2 = new LineElement({title: $MUI('Properties'), icon:'advanced'})
		]);

		this.BtnProperty2.setStyle('width:150px');
		
		this.BodyExplorer = new WidgetButtons({pagination:0});
		this.Explorer.ContextMenu.addNode(this.BodyExplorer.Body());
	},
/*
 * wFileManager#createPanelUpload() -> void
 **/	
	createPanelUpload:function(options){
		this.FormImport = 	new FrameWorker({
			select:		false,
			link:		this.link,
			debug:		false,
			cmd:		options.cmd +'='+ this.prefixe + 'filemanager.import',
			maxSize:	options.maxSize,
			parameters:	options.parameters,
			multiple:	true
		});
		
		this.LoadFolder = 	this.FormImport.addInput({type:'hidden', name:'Folder', value:''});
	},
/*
 * wFileManager#createFooter() -> void
 **/	
	createFooter:function(){
		this.TableInfo = new TableData();
		this.TableInfo.addHead($MUI('Total disk space') + ' : ').addCel(this.quota + ' Mo');
		this.TableInfo.addHead($MUI('Disk space used') + ' : ').addCel(this.cquota + ' Mo');
		this.TableInfo.addHead($MUI('Available disk space') + ' : ').addCel(this.quota + ' Mo');	
	},
/*
 * wFileManager#createMenu() -> void
 **/	
	createMenu:function(){
		var sender = this;
		
		this.BtnRefresh = 	this.DropMenu.addMenu($MUI('Refresh'), {icon:'reload'});
		this.BtnCreate = 	this.DropMenu.addMenu($MUI('New folder'), {icon:'add'});
		
		this.Flag.add(this.BtnRefresh, {
			orientation:Flag.RB,
			color:		'grey',
			text:		$MUI('Click here to refresh the page'),
			icon:		'documentinfo'
		});
		
		this.Flag.add(this.BtnCreate, {
			orientation:Flag.RB,
			color:		'grey',
			text:		$MUI('Click here to create a new folder'),
			icon:		'documentinfo'
		});	
	},
/*
 * wFileManager#createContextMenu() -> void
 **/	
	createContextMenu: function(options){
		this.ContextMenu = 	new ContextMenu({
			right:	options.right,
			left:	options.left
		});
		
		this.ContextMenu.observe('click', this.onClickFile.bind(this));
		this.ContextMenu.appendChilds([
			this.BtnOpen = 		new LineElement({title: $MUI('Open'), bold:true, icon:'file-edit'}),
			this.BtnJoin = 		new LineElement({title: $MUI('Join'), bold:true, icon:'attach'}),
			this.BtnDownload = 	new LineElement({title: $MUI('Download'), border:true,  icon:'fileexport'}),
			
			this.BtnCopy = 		new LineElement({title: $MUI('Copy'), icon:'editcopy'}),
			this.BtnCut = 		new LineElement({title: $MUI('Cut'), icon:'editcut'}),
			
			this.BtnDelete = 	new LineElement({title: $MUI('Remove'), icon:'delete'}),
			this.BtnRename = 	new LineElement({title: $MUI('Rename'), icon:'cell-edit', border:true}),
			
			this.BtnProperty = 	new LineElement({title: $MUI('Properties'), icon:'advanced'})
		]);
		
		this.BtnDownload.setStyle('min-width:150px');
		

	},
/**
 * wFilemanager#load() -> wFilemanager
 *
 * Charge les données de la liste des fichiers.
 **/
 	loadData: function(){return this.load()},
	
	load: function(bool){
				
		if(this.link != ''){
				
			//var lasticon = this.getIcon();
			
			this.Explorer.load();			
			
			this.exec('filemanager.list', {
				parameters:'Folder=' + this.folder,
				
				onCreate:function(result){
					this.ProgressBar.setProgress(0, 4, $MUI('Loading of the list. Please wait...'));
					if(Object.isUndefined(bool)) this.ProgressBar.show();
				}.bind(this),
				
				onLoading:function(){
					this.ProgressBar.setProgress(1, 4, $MUI('Loading of the list. Please wait...'));
				}.bind(this),
				
				onLoaded:function(){
					this.ProgressBar.setProgress(2, 4, $MUI('Loading of the list. Please wait...'));
				}.bind(this),
				
				onInteractive:function(){
					this.ProgressBar.setProgress(3, 4, $MUI('Loading of the list. Please wait...'));
				}.bind(this),
				
				onSuccess:function(){
					this.ProgressBar.setProgress(4, 4, $MUI('Loading of the list. Please wait...'));
				}.bind(this),
				
				onComplete: function(result){
					this.ProgressBar.hide();
					this.onComplete(result);
				}.bind(this)
			});
		}
		
		return this;
	},
/**
 * wFilemanager#create() -> void
 *
 * Cette méthode ouvre le gestionnaire de création de dossier.
 **/
	create: function(){
		var box = this.AlertBox;
		//
		//splite
		//
		var splite = new SpliteIcon($MUI('New folder'), $MUI('Enter the name of your new folder') + ' : ');
		splite.setIcon('folder-new-48');
		//
		//Input
		//
		var input = new Input({type:'text', value:'', style:'width:98%', maxLenght:255});
		input.Large(true);
		//
		//Table
		//
		box.setIcon('folder-add');
		box.appendChild(splite);
		box.appendChild(input);
		box.setType().show();
		
		box.submit({
			text:	$MUI('Create the folder'),
			icon:	'folder-add',
			click:function(){
			
				if(input.value == '') return;
								
				this.exec('filemanager.create', {
					parameters: 'Folder=' + this.folder + input.Value(),
					onComplete: function(result){
						this.load();
					}.bind(this)
				});							
	
			}.bind(this)
		});
		
		box.reset({icon:'cancel'});
		input.select();
	},
/**
 * wFilemanager#jumpTo(folder) -> void
 *
 * Cette méthode permet de se rendre au dossier `folder`.
 **/
 	jumpTo: function(folder){
		this.folder = folder;
		this.load();
	},
/**
 * wFilemanager#open(evt, file) -> void
 * 
 * Cette méthode tente d'ouvrir un programme externe pour une extension de fichier afin d'en visualiser le contenu.
 * 
 * <p class="note">Pour associer un programme à une extension veuillez utiliser la méthode [[wFilemanager#addOpener]].</p>
 **/	
	open: function(){
		if(Object.isUndefined(this.file)) return;
		
		this.touch();
		
		if(Object.isFunction(this.fileprog[this.file.extension].click)) {
			this.fileprog[this.file.extension].click.call(this, this.file);
		}
		
	},
/**
 * wFilemanager#join() -> void
 *
 * Cette méthode déclenche l'événement fichier Joint.
 **/	
	join: function(){
		if(Object.isUndefined(this.file)) return;
		this.Observer.fire('filemanager:join', this.file);
		this.close();
	},
/**
 * wFilemanager#touch() -> void
 *
 * Cette méthode modifie la date de modification du fichier.
 **/	
	touch: function(){
		
		this.file.ATime = new Date();
		this.file.MTime = new Date();
		
		this.exec('filemanager.touch', {
			parameters: 'File=' + this.file.link,
			onComplete:function(){
				//this.load(true);
			}.bind(this)
		});
	},
/**
 * wFilemanager#download() -> void
 * 
 * Cette méthode déclenche le téléchargement du fichier séléctionné.
 **/	
	download: function(){
		if(Object.isUndefined(this.file)) return;
		
		this.FormExport.Input.value = this.file.uri;
		this.FormExport.submit();
	},
/**
 * wFilemanager#copy() -> void
 *
 * Cette méthode enregistre une copie du fichier séléctionné.
 **/	
	copy: function(){
		this.filecopy = this.file;
		this.filecut = 	null;
	},
/**
 * wFilemanager#cut() -> void
 *
 * Cette méthode enregistre une copie du fichier séléctionné.
 **/	
	cut: function(){
		this.filecut = 	this.file;
		this.filecopy = null;	
	},
/**
 * wFilemanager#paste() -> void
 *
 * Cette méthode effectue une copie du fichier enregistré vers le dossier cible.
 **/
	paste: function(){
		if(!(Object.isUndefined(this.filecopy) || this.filecopy == null)) {			
			this.exec('filemanager.copy', {
				parameters:'Src=' + this.filecopy.link +'&Dest=' + this.folder + this.filecopy.name,
				onComplete:function(result){
					this.load();
				}.bind(this)
			});
		}

		if(!(Object.isUndefined(this.filecut) || this.filecut == null)) {	
			
			this.exec('filemanager.cut', {
				parameters:'Src=' + this.filecut.link +'&Dest=' + this.folder + this.filecut.name,
				onComplete:function(result){
					this.load();
				}.bind(this)
			});
			
			this.filecut = null;
		}
		
	},
/**
 * wFilemanager#exec(cmd, object) -> void
 **/	
	exec: function(cmd, object){
		if(this.link != ''){
			var parameters = this.cmd + '=' + this.prefixe + cmd;
			
			if(object.parameters != ''){
				parameters += '&' + object.parameters;	
			}
			
			if(this.parameters != ''){
				parameters += '&' + this.parameters;	
			}
			
			var globals = 			$WR().getGlobals('parameters');		
			parameters += 			(globals == '' ? '' : '&' + globals);
			object.parameters = 	parameters;
			object.method = 		'post';
			
			new Ajax.Request(this.link, object);
		}
		
	},
/**
 * wFilemanager#remove() -> void
 *
 * Cette méthode ouvre le gestionnaire de suppression de fichier.
 **/
	remove: function(){
		
		if(Object.isUndefined(this.file.link)){
			return;	
		}
		//
		//splite
		//
		var splite = new SpliteIcon($MUI('Do you really want to delete the') +' '+ (this.file.extension ? $MUI('file') : $MUI('folder')) + ' ?', this.file.name);
		splite.setIcon('trash-48');
		
		this.AlertBox.setIcon('delete');
		this.AlertBox.appendChild(splite);
		
		this.Observer.fire('filemanager:open.remove', this.AlertBox);
		
		
		this.AlertBox.submit(function(){
						
			var evt = new StopEvent(this.AlertBox);		
					
			this.Observer.fire('filemanager:submit.remove', evt, this.AlertBox);
			
			if(evt.stopped){
				return true;	
			}
			
			this.exec('filemanager.delete', {
				parameters: 'File=' + this.file.link,
				onComplete: function(result){
					this.load();
				}.bind(this)
			});	
			
		}.bind(this));
		
		this.AlertBox.setType().show();
		this.AlertBox.getBtnSubmit().setText($MUI('Remove')).setIcon('delete');
		this.AlertBox.getBtnReset().setIcon('cancel');
	},
/**
 * wFilemanager#rename() -> void
 *
 * Cette méthode permet de renommer le fichier séléctionné.
 **/	
	rename: function(){
		var box = this.AlertBox;
		//
		//splite
		//
		var splite = new SpliteIcon($MUI('Rename the') +' '+ (this.file.extension ? $MUI('file') : $MUI('folder')) + ' : ' + this.file.name, $MUI('Enter the new name') + ' : ');
		splite.setIcon('edit-48');
		//
		//Input
		//
		var input = new Input({type:'text', value:this.file.name, style:'width:98%', maxLenght:255});
		input.Large(true);
		//
		//Table
		//		
		box.appendChild(splite).appendChild(input);
		box.setType().show();
		
		box.submit({
			text:	$MUI('Rename'),
			icon:	'cell-edit',
			click:function(){
			
				if(input.value == '') return;
				
				this.exec('filemanager.rename', {
					parameters: 'File=' + this.file.link + '&toFile=' + this.folder + input.value,
					onComplete: function(result){
						this.load();
					}.bind(this)
				});	
	
			}.bind(this)
		});
		
		box.reset({icon:'cancel'});
		
		input.select();
	},
/**
 * wFilemanager#createWidgetInfo() -> void
 *
 * Cette méthode créée un widget affichant les informations du fichier.
 **/	
	createWidgetInfo:function(){
		//
		//Size
		//
		var size = 1 * this.file.size / 1024;
		size = size > 1024 ? (size / 1024).format(2,',',' ') + ' Mo' : size.format(2,',',' ') + ' Ko';
		//
		// Widget
		//
		var widget = new Widget();
		widget.Title($MUI('Informations'));
		widget.setIcon('documentinfo');
		
		widget.Table = new TableData();
		widget.appendChild(widget.Table);
		widget.Table.setStyle('width:100%');	
		widget.Table.addHead($MUI('File type') + ' : ');
		
		if(this.file.extension){
			widget.Table.addField($MUI('File') + ' ' + this.file.extension.toUpperCase() + ' (.' + this.file.extension + ')');
		}else{
			widget.Table.addField($MUI('Folder'));
		}
		
		widget.Table.addRow();
		widget.Table.addHead($MUI('wf.Location') + ' : ', {width:'130'});
		widget.Table.addField(this.file[this.keyPlace], {width:'300', style:'overflow:hidden;word-wrap:normal;white-space:nowrap;'}).addRow();
		
		widget.Table.addHead($MUI('Size') + ' : ').addField(size).addRow();
				
		return widget;
	},
/**
 * wFilemanager#createWidgetHistory() -> void
 *
 * Cette méthode créée un widget affichant les dates de création, modification et d'accès au fichier.
 **/	
	createWidgetHistory:function(){
		var widget = new Widget();
		widget.Title($MUI('Historic'));
		widget.setIcon('clock');
		
		widget.Table = new TableData();
		widget.Table.setStyle('width:100%');
		widget.appendChild(widget.Table);	
		
		var date = this.file.CTime.toDate();
		
		widget.Table.addHead($MUI('wf.Created on') + ' : ', {width:130}).addField(date.format('l d F Y ' + $MUI('wf.at') + ' h:i:s'));
		
		if(this.file.extension){
			date = this.file.MTime.toDate();
			
			widget.Table.addRow();
			widget.Table.addHead($MUI('wf.Modified') + ' : ').addField(date.format('l d F Y ' + $MUI('wf.at') + ' h:i:s')).addRow();
			
			date = this.file.ATime.toDate();
			
			widget.Table.addHead($MUI('Last accessed') + ' : ').addField(date.format('l d F Y ' + $MUI('wf.at') + ' h:i:s'));
		}
		
		return widget;
	},
/**
 * wFilemanager#property() -> void
 *
 * Cette méthode permet d'afficher les informations du fichier séléctionné.
 **/
	property: function(){	
		//
		//splite
		//
		var splite = new SpliteIcon($MUI('Property') + ' : ' + this.file.name);
		
		if(this.file.extension){
			if(this.fileassoc[this.file.extension] == "preview"){
				splite.setIcon('photo-48');
			}else{
				splite.setIcon(this.fileassoc[this.file.extension] || 'filenew-48');
			}
		}else{
			splite.setIcon('folder-48');
		}
		
		var widgetInfo = 	this.createWidgetInfo();
		var widgetHistory = this.createWidgetHistory();
				
		//this.AlertBox.setTitle($MUI('Propriété de') + ' : ' +  this.file.name).setIcon('advanced');
		this.AlertBox.appendChilds([splite, widgetInfo, widgetHistory]);
				
		
		this.AlertBox.getBtnReset().setIcon('cancel');
		
		this.BoxProperty = {
			Table:	widgetInfo.Table,
			info:	widgetInfo,
			history:widgetHistory,
			Splite:	splite
		};
		
		this.Observer.fire('filemanager:open.property', this);
		
		this.AlertBox.setType('CLOSE').show();
	},

/*
 * wFilemanager#onClickFile(evt, file) -> void
 **/
 	onClickFile: function(evt, file){
		
		if(this.BodyExplorer.ScrollBar.isMove()) return;
		evt.stop();
			
		this.file = file.data;
		
		if(this.modeOpen){
			if(!Object.isUndefined(this.fileprog[this.file.extension])){
				this.BtnOpen.show();
			}else{
				this.BtnOpen.hide();
			}
		}else{
			this.BtnOpen.hide();
		}
		
		if(this.modeJoin){
			this.BtnJoin.show();	
		}else{
			this.BtnJoin.hide();
		}
			
		if(this.readonly){
			this.BtnRename.hide();
			this.BtnCopy.hide();
			this.BtnCut.hide();
			this.BtnDelete.hide();
		}else{
			this.BtnRename.show();
			this.BtnCopy.show();
			this.BtnCut.show();
			this.BtnDelete.show();
		}
		
		this.Observer.fire('filemanager:click.file', evt, this);
	},
/*
 * wFilemanager#onClickFolder(evt, folder) -> void
 **/
	onClickFolder: function(evt, folder){
		 if(this.BodyExplorer.ScrollBar.isMove()) return;
		 
		if(Object.isUndefined(folder.data.link)){//Dossier Home
			this.LoadFolder.value = '';
			this.folder = 			'';
			this.folderInfo = 		null;
			
			this.load();	
		}
		else{//Autre Dossier
						
			this.LoadFolder.value = this.folder = folder.data.link + '/';
			this.folderInfo = 		folder.data;
													
			this.load();	
		}
		
		this.Observer.fire('filemanager:click.folder', evt, this);
	},
/*
 * wFilemanager#onClickRightFolder(evt, folder) -> void
 **/	
	onClickRightFolder: function(evt, folder){
		if(this.BodyExplorer.ScrollBar.isMove()) return;
		 
		evt.stop();
		
		if(Object.isUndefined(folder.data)){
			this.file = this.folderInfo;
			this.BtnNew.show();
		}else{
			this.file = folder.data;
			this.BtnNew.hide();
		}

		this.BtnProperty2.show();
		
		if(this.readonly){
			this.BtnRename2.hide();
			this.BtnDelete2.hide();
			this.BtnCopy2.hide();
			this.BtnPaste.hide();
			this.BtnNew.hide();
		}else{
			this.BtnCopy2.show();
			this.BtnRename2.show();
			this.BtnDelete2.show();
			
			if(this.filecopy != null || this.filecut != null){
				this.BtnPaste.show();
			}else{
				this.BtnPaste.hide();
			}
		}
		
		if(Object.isUndefined(this.file) || this.file == null){
			this.BtnRename2.hide();
			this.BtnCopy2.hide();
			this.BtnDelete2.hide();
			this.BtnProperty2.hide();
		}
				
		this.Observer.fire('filemanager:click.right.folder', evt, this);
		
	},
/*
 * wFilemanager#onComplete(result) -> void
 **/
	onComplete:function(result){
				
		var obj = result.responseText.evalJSON();
		
		if(Object.isElement(this.current)){
			this.current.Selected(false);
		}
		try{
			//Mise à jour de l'arborescence				
			this.current = this.Explorer.move(this.folderInfo.rel);
			this.current.Selected(true);
			this.Explorer.Home.Selected(false);
		}catch(er){
			this.Explorer.Home.Selected(true);
		}
		
		
		//suppression

		var nodes = this.BodyExplorer.childElements();		
		try{
			for(var i = 0; i < nodes.length; i++) this.ContextMenu.removeChild(nodes[i]);
		}catch(er){};
		
		this.BodyExplorer.clear();
		
		//ajout
		this.Observer.fire('filemanager:complete', obj);

		var sender = 	this;
		var quota = 	0;
		//
		//
		//
		var folder = 	new Section($MUI('Folders'));
		//
		//
		//
		var file = 		new Section($MUI('Files'));
		
		this.BodyExplorer.appendChild(folder);
		this.BodyExplorer.appendChild(file);
		
		folder.SimpleButton.on('click', function(){
			this.BodyExplorer.ScrollBar.scrollToStart();
			this.BodyExplorer.ScrollBar.refresh();
		}.bind(this));
		
		file.SimpleButton.on('click', function(){
			this.BodyExplorer.ScrollBar.scrollToStart();
			this.BodyExplorer.ScrollBar.refresh();
		}.bind(this));
		
		folder.setStyle('display:none');
		file.setStyle('display:none');
		
		//var options = 	[];
		var self =		this;
		
		for(var i = 0; i < obj.length; i++){
			
			if(obj[i].extension == false){	
				
				var hp = new HeadPiece({
					icon: 'folder-48',
					title:obj[i].name
				});
				
				hp.title = obj[i].name;
				
				folder.appendChild(hp);
				this.Explorer.ContextMenu.addNode(hp);
				
				hp.on('click',function(evt){sender.onClickFolder(evt, this);});
				
				folder.setStyle('display:block');
				hp.data = obj[i];
				
				//options.push(hp);
				
				hp.addClassName('drop-folder-area');
				
			}else{
				if(this.fileassoc[obj[i].extension] == 'preview'){
					
					var hp = new HeadPiece({
						src: 	obj[i].miniature ? obj[i].miniature : obj[i].uri,
						title:	obj[i].name
					});
					
					hp.addClassName('preview');
					
				}else{
					
					var icon = this.fileassoc[obj[i].extension] || 'filenew-48';
					
					var hp = new HeadPiece({
						icon: icon,
						title:obj[i].name
					});
					
					hp.title = obj[i].name;
				}
					
				this.ContextMenu.addNode(hp);
				quota += 1 * obj[i].size;
				
				file.appendChild(hp);
				file.setStyle('display:block');
				
				hp.data = obj[i];
				
				this.Observer.fire('filemanager:draw', hp);
				
				hp.on('mousedown', function(evt){
					self.onDragStartButton(evt, this);
				});
			}	
		}
				
		this.BodyExplorer.ScrollBar.refresh();
		this.BodyExplorer.ScrollBar.scrollToStart();

		this.cquota = (((obj.Quota / 1024) /1024) / 8);

		this.TableInfo.getCel(0,3).innerHTML = this.cquota.format(2, ',', ' ') + ' Mo';
		this.TableInfo.getCel(0,5).innerHTML = (this.quota - this.cquota).format(2, ',', ' ') + ' Mo';
		
	},
	
	onDragStartButton:function(evt, drag){
		if(Event.isRightClick(evt)) return;
		var icon = drag.getIcon().match('/\./') ? 'photo' : drag.getIcon().replace('-48','');
		//
		// Ticket
		//
		var myTicket = 	new Ticket({text:drag.getText(), icon:icon, draggable:false});
		myTicket.setStyle('cursor:default');
		this.appendChild(myTicket);
		//
		// Fix position
		//
		var fix = this.positionedOffset();
		//
		// Configuration du drag'n'drop
		//
		myTicket.setStyle('top:'+ (Event.pointerY(evt) - fix.top - 35) + 'px;left:' + (Event.pointerX(evt) - fix.left - 10) + 'px');
		myTicket.createDrag({absolute:true, opacity:0.9});
		
		this.select('.drop-folder-area').each(function(e){
			myTicket.addDroppable(e)
		});
		
		myTicket.dragOptions.onMouseDown(evt);
		
		myTicket.hide();
		
		myTicket.on('drag', function(){
			this.show();
		});
							
		myTicket.on('drop', function(){
			
			drag.hide();
			var drop = myTicket.getCurrentDrop();
			
			if(drop.data == 'home'){
				this.exec('filemanager.cut', {
					parameters:'Src=' + drag.data.link +'&Dest='+ drag.data.name,
					onComplete:function(result){
						this.load();
					}.bind(this)
				});
			}else{
			
				this.exec('filemanager.cut', {
					parameters:'Src=' + drag.data.link +'&Dest=' + drop.data.link +'/'+ drag.data.name,
					onComplete:function(result){
						this.load();
					}.bind(this)
				});
			}
				
		}.bind(this));
		
		myTicket.on('dragend', function(){
			myTicket.removeDrag();
			this.body.removeChild(myTicket);
		}.bind(this));
	},
/**
 * wFilemanager#getPictures() -> Array
 *
 * Cette méthode retourne toutes les images du dossier affiché dans la fenêtre.
 **/	
	getPictures:function(){
		var array = [];
		
		$A(this.BodyExplorer.getElementsByClassName('preview')).each(function(e){
			e.data.src = 		e.data.uri;
			e.data.title = 		e.data.name;
			
			array.push(e.data);
		});
		return array;
	},
/**
 * wFilemanager#setLink(link) -> wFilemanager
 * - link (String): Lien vers la passerelle PHP.
 *
 * Cette méthode assigne le lien de connexion au serveur d'application.
 **/
	setLink: function(link){
		this.link = link;
		this.WinExport.setLink(link);
		this.WinImport.setLink(link);
		this.WinEmplorer.setLink(link);
		return this;
	},
/*
 * wFilemanager#setCommand(cmd, parameters) -> wFilemanager
 * - cmd (String): La commande telle qu'elle est defini par le script PHP.
 * - parameters (String): Paramètre supplémentaire lors de l'envoi de données.
 *
 * Assigne la commande et les paramètres à l'instance. Ces informations seront 
 * envoyées à PHP à chaque fois que la liste sera rechargé.
 **/
	setCommand: function(cmd, parameters){

		var name = cmd.split('=');
		
		if(name.length == 1){
			this.parameters = this.NAME_CMD + '=' + name[0];	
		}else{
			this.parameters = cmd;	
		}
		
		if(!Object.isUndefined(parameters)){
			this.parameters += "&" + parameters;
		}
		
		//this.InputCompleter.setLink(this.link, this.parameters);
		
		return this;
	},
/**
 * wFilemanager#setParameters(parameters) -> wFilemanager
 * - parameters (String): Paramètres à envoyer.
 *
 * Assigne les paramètres à l'instance. Ces informations seront 
 * envoyées à PHP à chaque fois que la liste sera rechargé.
 **/
	setParameters: function(parameters){
		this.parameters = parameters;
		//this.InputCompleter.setLink(this.link, this.parameters);
		return this;
	},
/**
 * wFilemanager#addOpener(ext, fn) -> wFilemanager
 * - ext (String): Extension du fichier cible.
 * - fn (Function): Fonction à appeller lors de l'ouverture du fichier.
 *
 * Cette méthode vous permet d'associer une fonction à une extension pour visualiser 
 * le fichier séléctionné.
 **/	
	addOpener:function(ext, obj){
		if(Object.isFunction(obj)) obj = {click:obj};
		
		if(Object.isArray(ext)){
			for(var key in ext){
				this.fileprog[ext[key]] = obj; 	
			}
		}else{
			this.fileprog[ext] = obj;
		}
	}
};
/** section: UI
 * class LineExplorer
 * Cette classe créée un sous arbre de dossier. Elle est a utiliser avec la classe [[Explorer]] afin 
 * de créer une arborescence de dossier.
 **/
var LineExplorer = Class.from('ul');
LineExplorer.prototype = {
	__class__:	'lineexplorer',
	className:	'wobject w-line line-explorer',
/*
 * LineExplorer.text -> String
 * Text de la ligne.
 **/
	text: 		'',
	selected: 	false,
	icon:		null,
/**
 * new LineExplorer(options)
 * - options (Object): Options de configuration.
 *
 * Cette méthode créée une nouvelle instance de LineExplorer afin de construire une arborescence de dossier.
 *
 * ##### Paramètre options
 *
 * Le paramètre options prend différents attributs :
 * 
 * * `parent` (`LineExplorer`): Ligne parente de l'instance.
 * * `home` (`Explorer`): Donne un nom à la ligne.
 * * `text` (String): Affiche la valeur du texte dans la ligne.
 *
 **/
	initialize: function(obj){
		
		var options = {
			parent:	null,
			home:	null,
			text:	'',
			data:	{},
			icon:	'folder'
		};
			
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}

		this.Observer = new Observer();
		this.Observer.bind(this);
		
		this.Label =		new Node('label', {className:'font wrap-title'});
		this.icons = 		new Node('div',{className:'wrap-icon le-icon'});	
		this.SimpleButton =	new SimpleButton({type:'mini', icon:'1down-mini-blue'});
		this.SimpleButton.hide();
		
		this.header = new Node('li', {className:'wrap-header'}, [
			this.Label,
			this.SimpleButton
		]);
		
		this.body = new Node('li', {className:'wrap-body'});
	
		this.header.appendChild(this.icons);
		this.appendChild(this.header);
		this.appendChild(this.body);
		
		this.appendChild = this.addChild;
		
		this.parent = 	options.parent;
		this.home =		options.home;
		
		this.setText(options.text);
		this.setIcon(options.icon);
		
		if(options.data) this.setData(options.data);
		
		this.SimpleButton.on('click',function(evt){evt.stop();this.Hidden(!this.hidden_)}.bind(this));
		this.header.on('click',this.onClickHead.bind(this));
	},
	
	Header:function(){
		return this.header;
	},
	
	Body:function(){
		return this.body;
	},
	
	onClickHead: function(evt){
		this.fire('click', evt, this);
		if(this.home != null) this.home.fire('click', evt, this);
	},
/**
 * LineExplorer.Hidden([bool]) -> Boolean
 * - bool (Boolean): Valeur booléen.
 * 
 * Cette méthode change l'état de l'arborescence. Si `bool` est vrai les enfants de l'arbre seront
 * caché.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var line = new LineExplorer();
 *     line.Hidden(true);
 *
 * ##### Récupération d'une valeur :
 * 
 *     var line = new LineExplorer();
 *     alert(line.Hidden()); //false
 *
 **/	
	Hidden: function(bool){
		if(!Object.isUndefined(bool)){
			if(bool){
				this.body.hide();
				this.SimpleButton.setIcon('');
				this.SimpleButton.setIcon('1down-mini-blue');
				this.hidden_ = true;	
			}else{
				this.body.show();
				this.SimpleButton.setIcon('');
				this.SimpleButton.setIcon('1left-mini-blue');
				this.hidden_ = false;	
			}
		}
		return this.hidden_;
	},
/**
 * LineExplorer.observe(eventName, callback) -> LineExplorer
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `click` : Intervient lors du clique sur l'élément cible.
 * * `draw` : Intervient lors de la construction de l'arborescence.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/	
	observe:function(eventName, callback){
		switch(eventName){
			case 'click':
			case 'draw':
				this.Observer.observe(eventName, callback);
				break;
			default: Event.observe(this, eventName, callback);
		}
		return this;
	},
/**
 * LineExplorer.fire(eventName [, args]) -> LineExplorer
 * - eventName (String): Nom de l'événement.
 * - args (Mixed): Arguments à passer aux écouteurs.
 *
 * Cette méthode exécute un événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `click` : Intervient lors du clique sur l'élément cible.
 * * `draw` : Intervient lors de la construction de l'arborescence.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/	
	fire:function(eventName){
		switch(eventName){
			case 'click':
			case 'draw':
				return this.Observer.fire.apply(this.Observer, $A(arguments));
				break;
			default: return Event.fire.apply(this, $A(arguments));
		}
	},
/**
 * LineExplorer.stopObserving(eventName, callback) -> LineExplorer
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode supprime un écouteur `callback`  associé à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `click` : Intervient lors du clique sur l'élément cible.
 * * `draw` : Intervient lors de la construction de l'arborescence.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/	
	stopObserving:function(eventName, callback){
		switch(eventName){
			case 'click':
			case 'draw':
				this.Observer.stopObserving(eventName, callback);
				break;
			default: Event.stopObserving(this, eventName, callback);
		}
		return this;
	},
/**
 * LineExplorer.setData(array) -> LineExplorer
 * - array (Array): Tableau d'objet pour la contruction de l'arbre {text:String, parent:LineExplorer, home:Explorer}
 * 
 * Cette méthode contruit un sous arbre ayant pour sommet l'instance et pour enfants les données contenu dans `array`.
 **/
	setData: function(data){
		
		this.data = data;
		
		if(!Object.isUndefined(data.childs) && !data.childs == null) {
		
			for(var i = 0; i < data.childs.length; i++){

				var le = new LineExplorer({text:data.childs[i].name, data:data.childs[i], parent:this, home: this.home});
				
				this.appendChild(le);

				this.fire('draw', le);
				
				if(this.home != null) {
					this.home.fire('draw', le);
				}

			}
		}
		
		return this;
	},
/**
 * LineExplorer.appendChild(node) -> LineExplorer
 * - node (LineExplorer): Ligne à ajouter au corps de la ligne.
 *
 * Cette méthode ajoute une ligne à la l'instance.
 **/
	addChild: function(le){		
		this.SimpleButton.show();
			
		this.body.appendChild(le);
		this.removeClassName('master');
		this.addClassName('master');
		return this;
	},
/**
 * LineExplorer.addChildAt(node, it) -> LineExplorer
 * - node (Element): Ligne à ajouter au corps de la ligne.
 * - it (Number): Indice d'insertion.
 *
 * Cette méthode ajoute une ligne à la l'instance à l'indice demandé.
 **/
	addChildAt: function(le, it){	
		this.body.addChildAt(le, it);
		this.removeClassName('master');
		this.addClassName('master');
		return this;
	},
/**
 * LineExplorer.top(node) -> LineExplorer
 * - node (LineExplorer): Ligne à ajouter au corps de la ligne.
 *
 * Cette méthode ajoute une ligne à la l'instance en haute de liste.
 **/
	top: function(le){
		return this.addChildAt(le, 0);
	},
/**
 * LineExplorer.removeChild(node) -> LineExplorer
 * - node (LineExplorer): Ligne à supprimer de l'instance.
 *
 * Supprime une ligne de l'instance.
 **/
	removeChild: function(le){
		this.body.removeChild(le);
	},
/**
 * LineExplorer.Text(str) -> String
 * - str (String): Texte à ajouter.
 *
 * Cette méthode ajoute une texte descriptif de la l'instance.
 * 
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var line = new LineExplorer();
 *     line.Text('mon text');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var line = new LineExplorer({text:'mon text'});
 *     alert(line.Text()); //mon text
 *
 **/
 	setText: function(str){
		if(!Object.isUndefined(str)) this.Label.innerHTML = str;
		return this;
	},
	
	getText: function(){
		return this.Label.innerHTML;
	},
	
	Text: function(str){
		if(Object.isUndefined(str)) return this.text;
		return this.text = this.Label.innerHTML = str;
	},
/**
 * LineExplorer.setIcon(icon) -> Boolean
 * - icon (String): Nom de l'icône CSS.
 *
 * Cette méthode assigne une icône à l'instance.
 **/
 	setIcon: function(icon){
		
		this.icons.removeClassName(this.icon);
		
		if(icon){
			this.icon = 'icon-'+icon;
			this.icons.addClassName(this.icon);
		}
		
		return this;
	},
/**
 * LineExplorer.Selected(bool) -> Boolean
 *
 * Cette méthode change l'état de la ligne (séléctionné ou non).
 **/
	Selected: function(bool){
		this.removeClassName('selected');
		
		if(bool){
			this.addClassName('selected');
		}else bool = false;
		
		return this.selected = bool;
	},
/**
 * LineExplorer.clear() -> LineExplorer
 *
 * Vide la liste de l'instance LineExplorer.
 **/
	clear:function(){
		this.body.removeChilds();
		return this;
	},
/**
 * LineExplorer.childElements() -> Array LineExplorer
 *
 * Retourne la liste des elements enfants de la liste.
 **/
	childElements: function(){
		return this.body.childElements();
	},
/**
 * LineExplorer.getChild(folder) -> Array LineExplorer
 **/	
	getChild: function(folder, bool){
		
		bool = Object.isUndefined(bool) ? false : bool;
		
		var childs = this.body.childElements();
		
		for(var i = 0; i < childs.length; i++){
			
			if(childs[i].data.rel == folder) return childs[i];
			
			if(!bool){
				if(childs[i].childElements().length > 0) {
					var node = childs[i].getChild(folder);
					if(node) return node;
				}
			}
		}
		
		return false;
	},
/**
 * LineExplorer.__destruct() -> void
 * 
 * Destruction de l'objet complexe.
 **/
	__destruct:function(){
		$WR.destructObject(this);
	}
};
/** section: Form
 * class Explorer
 * Ensemble de LineExplorer afin de former une arborescence de dossier.
 **/
var Explorer = Class.createSprite('div');
Explorer.prototype = {
	__class__:	'explorer',
	className:	'wobject explorer',
	link:		'',
	parameters:	'',
	folder:		'',
/**
 * new Explorer(obj)
 *
 * Crée une nouvelle instance [[Explorer]]. 
 **/
	initialize: function(obj){
		
		var options = {
			mode:	false,
			link: 	'',
			parameters:	'cmd=explorer.list',
			home:	{text:'/', icon:'folder'}
		};
				
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);	
		}
		
		this.link = options.link;
		this.parameters = options.parameters;
		
		this.Observer = new Observer();
		this.Observer.bind(this);
		//
		//Home
		//
		this.Home = new LineExplorer({text:options.home.text, icon:options.home.icon, parent:this, home: this});
		//
		//ContextMenu
		//
		this.ContextMenu = new ContextMenu({
			right:true,
			left:false
		});
		
		this.ContextMenu.observe('click', this.onClickFolder.bind(this));
		
		this.appendChild(this.Home);
		this.appendChild(this.ContextMenu);
		
		this.appendChild = function(node){
			this.Home.appendChild(node);
		};
		
		this.observe('draw', function(le){
			this.ContextMenu.addNode(le);
		}.bind(this));
		
	},
/**
 * Explorer.onClickFolder(evt, file) -> void
 *
 **/	
	onClickFolder: function(evt, file){
		this.fire('clickright', evt, file);
	},
/**
 * Explorer.move(folder) -> Explorer
 **/
	move: function(folder){
		var node = this.Home.getChild(folder);
		
		if(node){
			node.Selected(true);
			
			if(this.link != ''){
				var globals = 		$WR().getGlobals('parameters');
				
				var parameters = 	this.parameters
									+ (this.folder ? '' : '&Folder=' + folder);
				
				parameters += 		(globals == '' ? '' : '&' + globals);
				
				new Ajax.Request(this.link, {
					parameters: parameters,
					method:		'post',
					onComplete: function(result){
						this.onComplete(result, node);				
					}.bind(this)
				});
							
			}	
				
		}
		return node;
	},
/**
 * Explorer.load() -> Explorer
 **/
	load: function(){

		if(this.link != ''){
			var globals = 		$WR().getGlobals('parameters');
			var parameters = this.parameters
							+ (this.folder ? '' : '&Folder=' + this.folder)
							+ (globals == '' ? '' : '&' + globals);
			
			this.clear();
			
			new Ajax.Request(this.link, {
				parameters: parameters,
				method:		'post',
				onComplete: function(result){
					this.onComplete(result, this.Home);
				}.bind(this)
			});
		}
		
		return this;
	},
/**
 * Explorer.observe(eventName, callback) -> Window
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `click` : Intervient lors du clique sur l'élément cible.
 * * `clickright` : Intervient lors du clique droit sur l'élément cible.
 * * `complete` : Intervient lorsque le chargement des informations est terminé.
 * * `draw` : Intervient lors de la construction de l'arborescence.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	observe:function(eventName, callback){
		switch(eventName){
			case 'click':
			case 'clickright':
			case 'complete':
			case 'draw':
				this.Observer.observe(eventName, callback);
				break;
			default: Event.observe(this, eventName, callback);
		}
		return this;
	},
/**
 * Explorer.fire(eventName [, args]) -> Window
 * - eventName (String): Nom de l'événement.
 * - args (Mixed): Arguments à passer aux écouteurs.
 *
 * Cette méthode exécute un événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `click` : Intervient lors du clique sur l'élément cible.
 * * `clickright` : Intervient lors du clique droit sur l'élément cible.
 * * `complete` : Intervient lorsque le chargement des informations est terminé.
 * * `draw` : Intervient lors de la construction de l'arborescence.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/	
	fire:function(eventName){

		switch(eventName){
			case 'click':
			case 'clickright':
			case 'complete':
			case 'draw':
				return this.Observer.fire.apply(this.Observer, $A(arguments));
				break;
			default: return Event.fire.apply(this, $A(arguments));
		}
	},
/**
 * Explorer.stopObserving(eventName, callback) -> Window
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode supprime un écouteur `callback`  associé à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `click` : Intervient lors du clique sur l'élément cible.
 * * `clickright` : Intervient lors du clique droit sur l'élément cible.
 * * `complete` : Intervient lorsque le chargement des informations est terminé.
 * * `draw` : Intervient lors de la construction de l'arborescence.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	stopObserving:function(eventName, callback){
		switch(eventName){
			case 'click':
			case 'clickright':
			case 'complete':
			case 'draw':
			
				this.Observer.stopObserving(eventName, callback);
				break;
			default: Event.stopObserving(this, eventName, callback);
		}
		return this;
	},
/**
 * Explorer.onComplete(result) -> void
 **/	
	onComplete: function(result, node){
		
		var obj = result.responseText.evalJSON();
		
		//ajout
		this.Observer.fire('complete', obj);

		var sender = 	this;
		var array = 	{};
				
		for(var i = 0; i < obj.length; i++){
			var child = null;
			
			if(child = node.getChild(obj[i].rel, true)){
				array[obj[i].rel] = true;
				continue;	
			}
	
			array[obj[i].rel] = true;
			var le = new LineExplorer({text:obj[i].name, data:obj[i], parent:this, home:this});
			this.fire('draw', le);
			node.appendChild(le);
		}
		
		var childs = node.childElements();
		for(var i = 0; i < childs.length; i++){
			if(typeof childs[i].data === 'object' && Object.isUndefined(array[childs[i].data.rel])){//le dossier n'existe plus
				childs.parentNode.removeChild(childs[i]);
			}
		}
	},
/**
 * Explorer.clear() -> Explorer
 *
 * Cette méthode réinitialise l'arborescence.
 **/
	clear: function(){
		this.Home.body.removeChilds();
		this.length = 0;
		return this;
	},
/**
 * Explorer.size() -> Number
 *
 * Retourne la taille de la liste.
 **/
	size: function(){
		return this.length = this.childElements();
	},
/**
 * Explorer.setLink(link) -> Explorer
 * - link (String): Lien vers la passerelle PHP.
 *
 * Cette méthode assigne le lien de connexion au serveur d'application.
 **/
	setLink: function(link){
		this.link = link;
		return this;
	},
/**
 * Explorer.setParameters(parameters) -> Explorer
 * - parameters (String): Paramètres à envoyer.
 *
 * Assigne les paramètres à l'instance. Ces informations seront 
 * envoyées à PHP à chaque fois que la liste sera rechargé.
 **/
	setParameters: function(parameters){
		this.parameters = parameters;
		return this;
	},
/**
 * Explorer.__destruct() -> void
 * 
 * Destruction de l'objet complexe.
 **/
	__destruct:function(){
		$WR.destructObject(this);
	}
};
MUI.addWords({
	'wf.Location':							'Location',
	'wf.Created on':						'Created on',
	'wf.at':								'at'
}, 'en');
MUI.addWords({
	'Open':									'Ouvrir',
	'Join':									'Joindre',
	'Download':								'Télécharger',
	'New':									'Nouveau', 
	'Folder':								'Dossier',
	'File':									'Fichier',
	'Folders':								'Dossiers',
	'Files':								'Fichiers',
	'folder':								'dossier',
	'file':									'fichier',
	'File manager':						 	'Gestionnaire de fichiers',
	'File import':							'Importation de fichier',
	'Download file':						'Télécharger un fichier',
	'Copy':									'Copier',
	'Cut':									'Couper',
	'Paste':								'Coller',
	'Rename':								'Renommer',
	'Remove':								'Supprimer',
	'New folder':							'Nouveau dossier',
	'Properties':							'Propriétés',
	'Total disk space':						'Espace disque total',
	'Disk space used': 						'Espace disque utilisé',
	'Available disk space':					'Espace disque disponible',
	'Refresh':								'Rafraichir',
	'Click here to refresh the page':		'Cliquez ici pour rafraîchir la page',
	'Click here to create a new folder':	'Cliquez ici pour créer un nouveau dossier',
	'Loading of the list. Please wait...':	'Chargement de la liste. Patientez svp...',
	'Enter the name of your new folder':	'Saisissez le nom de votre nouveau dossier',
	'Create the folder':					'Créer le dossier',
	'Do you really want to delete the':		'Voulez-vous vraiment supprimer le',
	'Rename the':							'Renommer le',
	'Enter the new name':					'Saisissez le nouveau nom',
	'File type':							'Type de fichier',
	'wf.Location':							'Emplacement',
	'Size':									'Taille',
	'Historic':								'Historique',
	'wf.Created on':						'Créé le',
	'wf.Modified':							'Modifié le',
	'wf.at':								'à',
	'Last accessed':						'Dernier accès le',
	'Property':								'Propriété'
}, 'fr');
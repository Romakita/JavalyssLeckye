/** section: Core
 * System.FileManager
 * Cette classe gère l'interface de gestion des médias. `FileManager` permet de manipuler des fichiers 
 * dans le dossier `private` du logiciel Javalyss. Il vous permet donc d'héberger des fichiers et de les gérer
 * comme sur un ordinateur.
 *
 * <p class="note">Cette classe est une extension de Window JS. Pour l'inclure vous devez utiliser la méthode Import('plugins.wfilemanager').</p>
 *
 **/
System.FileManager = System.files = {
/**
 * System.FileManager.startInterface() -> void
 *
 * Cette méthode Lance l'interface du gestionnaire de fichier. Cette méthode est appellé par le système.
 **/
	startInterface: function(){
		if(!$S.Meta('USE_FILEMANAGER')) return;
		
		try{			
			$S.DropMenu.addMenu($MUI('Média'), {icon:'system-filemanager'}).observe('click', function(){this.open()}.bind(this));			
		}catch(er){
			$S.trace(er);
		}
		
		if(document.navigator.html5.FileAPI){
			this.DropFile = new DropFile();
			this.DropFile.addDragArea(document.body);
			this.DropFile.addDropArea(document.body);
			
			this.DropFile.on('dropfile', function(node){
				
				node.friendNode = System.Notify.add({
					appName:	$MUI('Chargement'),
					appIcon:	'fileimport',
					icon:		node.getIcon(),
					title:		node.getText(),
					button:		true,
					progress:	true
				});
				
				node.friendNode.SimpleButton.hide();
				node.friendNode.ProgressBar.show();
								
				System.Notify.show();
			});
			
			this.DropFile.on('progress', function(evt){
				var node = evt.target;
				node.friendNode.setProgress(evt.percentage, 100);
				
				if(evt.percentage == 100){
					node.friendNode.SimpleButton.show();
					node.friendNode.ProgressBar.hide();
				}
			});
		}
	},
/**
 * System.FileManager.open() -> void
 *
 * Cette méthode ouvre le gestionnaire de fichier.
 **/
	open: function(obj){
		
		var options = {
			title:			$MUI('Gestion des médias'),
			icon:			$MUI('multimedia'),
			prefixe:		'',
			join:			false,
			home:			{text:$S.Meta('USE_GLOBAL_DOC') ? $MUI('Publique') : $U().Name, icon:'device-harddrive'},
			instanceid:		'filemanager.open',
			parameters:		 'options=' + escape(Object.toJSON(options))
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
					
		var win = $WR.unique(options.instanceid, {
			instance:	'WinFileManager',
			autoclose:	true,
			action: function(){
				this.open(options);
			}.bind(this),
			
			parameters: [
				{
					quota:		$S.Meta('QUOTA') || 300,
					link:		$S.link,
					prefixe: 	options.prefixe,
					maxSize: 	$S.UPLOAD_MAX_FILESIZE,
					parameters: options.parameters,
					home:		options.home,
					join:		Object.isFunction(options.join)
				}
			]
		});
		
		if(!win) return;
		
		document.body.appendChild(win);
		
		//win.NoChrome(true);
		win.setTitle(options.title).setIcon(options.icon);
		win.centralize();
		
		if(Object.isFunction(options.join)) win.on('join', options.join);
		
		//ajout des openers
		win.addOpener('pdf', function(file){$S.openPDF(file.uri).setTitle(file.name)});
		win.addOpener('txt', function(file){$S.open(file.uri, file.name)});
		
		win.addOpener(['jpg', 'png', 'gif', 'bmp'], function(file){
			this.openPicture(file, win.getPictures());
		}.bind(this));
		
		if($S.Meta('USE_SECURITY')){
			win.observe('open.remove', $S.onOpenRemoveItem.bind($S));
			win.observe('submit.remove', $S.onSubmitRemoveItem.bind($S));
		}
				
		win.load();
		
		return win;
	},
/** alias of: System.openPicture
 * System.FileManager.openPicture(file, array) -> void
 **/
	openPicture: function(file, array){
		return $S.openPicture(file, array);
	},
/**
 * System.FileManager.join() -> void
 *
 * Cette méthode ouvre le gestionnaire de fichier pour joindre un fichier.
 **/
	join: function(folder, callback){
		
		var win = $WR.unique('filemanager.join', {
			instance:	'WinFileManager',
			autoclose:	true,
			action: function(){
				this.join(folder, callback);
			}.bind(this),
			
			parameters: [
				{
					quota:		$S.Meta('QUOTA') || 300,
					link:		$S.link,
					maxSize: 	$S.UPLOAD_MAX_FILESIZE,
					join:		true
				}
			]
		});	
					
		if(!win) return;		
						
		document.body.appendChild(win);
		
		win.setTitle($MUI('Gestion des médias')).setIcon('multimedia');
		//win.NoChrome(true);
		win.centralize();
		
		win.observe('close', function(){this.winJoin = null;}.bind(this));
		win.observe('join', callback);
		
		//ajout des openers
		win.addOpener('pdf', function(file){$S.openPDF(file.uri).setTitle(fil.name)});
		win.addOpener('txt', function(file){$S.open(file.uri, file.name)});
		
		win.addOpener(['jpg', 'png', 'gif', 'bmp'], function(file){
			this.openPicture(file, win.getPictures());
		}.bind(this));
			
		if($S.Meta('USE_SECURITY')){
			win.observe('open.remove', $S.onOpenRemoveItem.bind($S));
			win.observe('submit.remove', $S.onSubmitRemoveItem.bind($S));
		}
		
	 		
		win.load();
	},
/**
 * System.FileManager.createHandler() -> Function
 *
 * Cette méthode créée une fonction pour l'importation de fichier depuis le gestionnaire de fichier.
 **/
	createHandler: function(){
		return function(callback){$FM().join(null, callback);};
	}
};
/*
 * $FM() -> FileManager
 * Raccourci vers l'instance du gestionnaire des médias.
 **/
function $FM(){
	return System.FileManager;
}


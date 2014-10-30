/** section: Core
 * System.Market
 * Gestionnaire des modules additionnels du logiciel.
 * Il permet de gerer des fichiers sur le serveur Web.
 **/
System.Market = {
	stack:[],
/**
 * System.Market.addAppRestartNeeded(app) -> void
 * - app (System.Market.App): Application nécessitant un redemarrage.
 * 
 * Cette méthode ajoute une application à la liste des composants nécessitant un redémarrage du logiciel.
 **/	
	addAppRestartNeeded:function(app){
		this.stack.push(app);
	},
/**
 * System.Market.applyAppsRestartNeeded(win) -> void
 *
 * Cette méthode change l'état des composants nécessitant un rédémarrage du logiciel.
 **/	
	applyAppsRestartNeeded:function(win){
		
		this.stack.each(function(app){
			win.select('.progress-' + app.Name.sanitize().toLowerCase()).each(function(e){
				try{e.restart();}catch(er){}
			});
		});
	},
	
	tryAppUpdate:function(){
		
		var app = new System.Market.App();
		app.Name = 'BlogPress';
		app.statut = 0;
		
		new Timer(function(pe){
			app.statut++;
			
			if(app.statut == 4){
				app.statut == 'err';
				pe.stop();
			}
		}, 2).start();
		
		app.timer = new Timer(function(pe){
			
			$$('.progress-' + app.Name.sanitize().toLowerCase()).each(function(e){
				
				try{
				switch(app.statut){
					case 'err':
						pe.stop();
						
						if(e.timer){
							e.timer.stop();
							e.timer = null;	
						}
						
						e.setProgress(0, 5, $MUI('An error has occurred'));
						break;
					case 0:
						
						if(!e.timer){
							e.it = 0;
							e.setProgress(e.it, 120, $MUI('Downloading') + '...');
							
							e.timer = new Timer(function(pe){
								this.it++;
								this.setProgress(this.it, 120, $MUI('Downloading') + '...');
							}.bind(e), 1, 60);
							e.timer.start();
							
						}
						
						break;
						
					case 1:
						if(e.timer){
							e.timer.stop();
							e.timer = null;	
						}
						
						e.setProgress(80, 120, $MUI('Installation') + '...');
						break;
					case 2:
						if(e.timer){
							e.timer.stop();
							e.timer = null;	
						}
						
						e.setProgress(100, 120, $MUI('Configuration') + '...');
						break;	
					case 3:
						if(e.timer){
							e.timer.stop();
							
							e.timer = null;	
						}
						
						try{e.restart();}catch(er){}
						pe.stop();
						
						break;
				}
				}catch(er){alert(er)};
			}.bind(this));
			
		}.bind(this), 1);
		
		app.timer.start();
	},
/**
 * System.Market.startInterface() -> void
 * 
 * Cette méthode ajoute les composants du market au démarrage de Javalyss.
 **/	
	startInterface:function(){
		
		
		switch($U().getRight()){
			case 1:
				var buttonMenu = $S.DropMenu.addMenu($MUI('Javalyss Market'), {icon:'javalyss-market'});
				buttonMenu.observe('click', this.open.bind(this));
				
				$S.exec('market.update.list', function(result){
					try{
						var obj = result.responseText.evalJSON();
					}catch(er){return er;}
											
					if(obj.length == 0){
						//win.Panel.BtnUpdate.hide();
						return;
					}
					
					if(!System.Notify.add){
						
						var button = $S.TaskBar.Systray.addMenu($MUI('Update'), {icon:'javalyss-market'});
						button.setTag(obj.length);
						buttonMenu.setTag(obj.length);
						
						button.on('click', function(){
							$S.Market.open(true).Market.BtnUpdate.click();
						}.bind(this));
						
						$S.Flag.add(button, {
							orientation:Flag.LB,
							text:$MUI('Update are available'),
							color:'grey'
						});
						
					}else{
						
						for(var i = 0; i < obj.length; i++){
							var line = System.Notify.add({
								appName:	'Javalyss Market',
								appIcon:	'javalyss-market',
								title:		$MUI('Update available for') + ' ' + obj[i].Name,
								icon:		obj[i].Icon
							});
							
							line.on('click', function(){
								$S.Market.open(true).Market.BtnUpdate.click();
							});
							
							line.createProgressBar();
							
							/*if(win.Panel.ProgressBar.hasClassName('splashscreen')){
								new Timer(function(){
									win.Panel.ProgressBar.hide();
									win.Panel.ProgressBar.removeClassName('splashscreen');
								}, 0.5, 1).start();
							}else{
								win.Panel.ProgressBar.hide();
							}*/
							
							line.addClassName('progress-' + obj[i].Name.sanitize().toLowerCase());
						}
					}
				}.bind(this));
				
												
				break;
		}
		
	},
/**
 * System.Market.open() -> Window
 *
 * Cette méthode ouvre l'application Javalyss Market.
 **/	
	open:function(bool){
		var win = $WR.unique('market', {
			autoclose:	false
		});
		
		//on regarde si l'instance a été créée
		if(!win) return $WR.getByName('market');
		
		this.winList = win;
		
		win.forms = {};
		//win.setIcon('javalyss-market');
		win.Resizable(false);
		win.ChromeSetting(true);
		win.NoChrome(true);
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();	
		win.MinWin.setIcon('javalyss-market');
		win.addClassName('market');
		
		win.appendChild(this.createPanel(win));
		//
		// TabControl
		//
		//win.createTabControl({offset:22});
		//win.TabControl.addPanel($MUI('Market'), this.createPanel(win));
		//win.TabControl.addSimpleMenu(new SimpleMenu({text:$MUI('Explorer'), icon:'folder'}).on('click', this.explorer.bind(this)));
				
		$Body.appendChild(win);
		
		$S.fire('appsme:open', win);
		
		win.Fullscreen(true);
		win.moveTo(0,0);
		
		if(bool !== true) {
			//win.Panel.BtnHost.click();
			this.getListLocalApps(win);
		}
		
		return win;
	},
/**
 * System.Market.explorer(options) -> Window
 *
 * Cette méthode ouvre le gestionnaire de fichier permettant l'exploration des extensions installées.
 **/
	explorer: function(options){
	
		if(!(Object.isUndefined(this.win) || this.win == null)){
			try{
				this.win.close();
			}catch(er){}
		}

		var win = 	new WinFileManager({
			quota:	100,
			link:	$S.link,
			prefixe: 'plugin'
		});
					
		this.win = win;
		
		$Body.appendChild(win);
		
		win.Resizable(false);
		win.centralize();
		
		win.observe('close', function(){this.win = null;}.bind(this));
		
		//ajout des openers
		win.addOpener('pdf', function(file){$S.openPDF(file.uri).setTitle(fil.name)});
		win.addOpener('txt', function(file){$S.open(file.uri, file.name)});
		
		win.addOpener(['jpg', 'png', 'gif', 'bmp'], function(file){
			var win = new Window();
			
			$Body.appendChild(win);
			
			win.Title(file.name);
			win.setIcon('paint-2');
			//child.fullscreen();
			win.body.setStyle('text-align:center');
			win.appendChild(new Node('img', {style:"display:block", src:file.uri}));
			win.centralize();				
		});
		
		win.setTitle($MUI('Explorateur des extensions')).setIcon('folder');
		
		if($S.Meta('USE_SECURITY')){
			win.on('open.remove', $S.onOpenRemoveItem.bind($S));
			win.on('remove.submit', $S.onSubmitRemoveItem.bind($S));	 		
		}
		
		//win.DropMenu.addMenu($MUI('Charger une extension'), {icon:'blockdevice-import'}).on('click', this.openImport.bind(this));
		
		new MenuInteract(win, {
			manuelid:	13,
			incident:	'Extensions - Explorateur des extensions'	
		});
		
		win.load();
		
		return win;
	},
/**
 * System.Market.setCurrent(win, currentName) -> void
 * - win (Window): Instance Window.
 * 
 **/	
	setCurrent:function(win, currentName){
		var panel = win.Panel;
		win.Panel.clear();
		
		try{
			win.Panel.setCurrentMenu($MUI(currentName));
		}catch(er){}
		
		var oldCurrent = win.Panel.Current;
		win.Panel.Current = currentName;
		
		
		panel.Open(false);		
		win.Panel.removeClassName('open');
		win.Panel.removeClassName('plugin');
		win.Panel.removeClassName('default');
		
		//win.Panel.Widgets[1].ScrollBar.refresh();
		if(currentName == $MUI('Search')){
			win.isSearch = true;
		}else{
			win.Panel.InputCompleter.Text('');
			win.Panel.InputCompleter.Value('');	
			win.isSearch = false;
		}
		
		if(currentName == $MUI('My apps')){		
			win.Panel.addClassName('plugin');
			win.Panel.PanelBody.Header().select(".all")[0].addClassName('selected');
			return;
		}
		
		if(currentName == $MUI('Update')){		
			win.Panel.addClassName('update');
			return;
		}
		
		win.Panel.addClassName('default');
		
		if(oldCurrent != win.Panel.Current){
			win.Panel.PanelBody.Header().select(".date")[0].addClassName('selected');
		}
	},
	
	
	/*setCurrent:function(name){
		var win = $WR.getByName('mystore');
		var panel = win.MyStore;
		
		if(name != 'setting'){
			panel.Header().select('.selected').invoke('removeClassName', 'selected');
			panel.Header().select('.simple-button.' + name).invoke('addClassName', 'selected');
			
			new fThread(function(){
				panel.select('.cel-date_confirm').invoke('show');
				panel.select('.cel-date_preparation').invoke('show');
				panel.select('.cel-date_delivery_start').invoke('show');
			}, 0.4);
			
			panel.clearAll();
			win.CurrentName = name;
		}else{
			panel.clearSwipAll();
		}
		
		panel.Open(false);
		win.destroyForm();
	},*/
/**
 * System.Market.createPanel(win) -> Panel
 * - win (Window): Instance Window.
 *
 * Cette méthode créée le panneau de gestion du catalogue.
 **/
 	createPanel: function(win){
		
		var panel = new System.jPanel({
			title:			$MUI('Javalyss Market'),
			placeholder:	$MUI('Search for an application'),
			style:			'width:900px',
			parameters:		'cmd=market.app.list',
			icon:			'javalyss-market-32'
		});
		
		var self =	this;
		panel.addClassName('market');
		panel.setTheme('grey flat');
		panel.Progress.addClassName('splashscreen');
		//
		//
		//		
		panel.InputCompleter.on('draw', function(line){
			this.Hidden(true);
		});
		
		//panel.InputCompleter.css('float', 'right');
		
		panel.InputCompleter.on('keyup', function(){
			if(panel.InputCompleter.Text() == ''){
				this.getListApps(win, 'All');
			}
		}.bind(this));
	
		panel.InputCompleter.on('complete', function(array){
			this.setCurrent(win, $MUI('Search'));
			this.drawApps(win, array);
		}.bind(this));
				
		//panel.DropMenu.appendChild();
				
		panel.BtnHost = panel.DropMenu.addMenu($MUI('My apps'));
		panel.BtnHost.parentNode.addClassName('host');
				
		panel.BtnHost.on('click', function(){
			this.getListLocalApps(win);
		}.bind(this));
		
		panel.BtnUpdate = panel.DropMenu.addMenu($MUI('Update'));
		panel.BtnUpdate.parentNode.addClassName('update');
		panel.BtnUpdate.hide();
		
		//
		//
		//
		panel.createDropFile({
			parameters:	'cmd=plugin.import',
			multiple:	true
		});
		//
		//
		//
		panel.PanelBody.Header().appendChilds([
			panel.InputCompleter,
			new Node('span', {className:'tool-market date', value:'Date'}, $MUI('Date')),
			new Node('span', {className:'tool-market name', value:'Name'}, $MUI('Name')),
			new Node('span', {className:'tool-market note', value:'Note'}, $MUI('Note')),
			new Node('span', {className:'tool-market popularity', value:'Popularity'}, $MUI('Popularity')),
			
			new Node('span', {className:'tool-plugin all'}, $MUI('All_')),
			new Node('span', {className:'tool-plugin enabled'}, $MUI('Enabled')),
			new Node('span', {className:'tool-plugin disabled'}, $MUI('Disabled')),
			
			new Node('span', {className:'tool-update update-all'}, $MUI('Update all')),
			new Node('span', {className:'tool-update update-selection'}, $MUI('Update selection')),
			
		]);
		
		//
		//
		//
		var btnReturn = new Node('span', {className:'btn-return'}, $MUI('Back'));
		
		panel.PanelSwip.Header().appendChilds([
			new Node('span', {className:'selected'}, $MUI('Details'))//,
			//new Node('span', {className:'tool-app opinions'}, $MUI('Opinions')),
			//new Node('span', {className:'tool-app visual'}, $MUI('Visual')),
			//new Node('span', {className:'tool-app associated'}, $MUI('Associated'))
		]);
				
		panel.PanelSwip.BtnDownload = 	new SimpleButton({text:$MUI('Download')});
		panel.PanelSwip.BtnDownload.addClassName('download');
		
		panel.PanelSwip.BtnDownload.on('click', function(){
			this.downloadApp(win, this.CurrentApp);
		}.bind(this));
				
		panel.PanelSwip.BtnUpdate = 		new SimpleButton({text:$MUI('Update now')});
		panel.PanelSwip.BtnUpdate.addClassName('update');
		
		panel.PanelSwip.BtnUpdate.on('click', function(){
			
			if(!Object.isUndefined(this.CurrentApp.Version_MAJ)){
				this.CurrentApp.Version = this.CurrentApp.Version_MAJ;
			}
			
			this.updateApps(win, [this.CurrentApp]);
		}.bind(this));
		
		panel.PanelSwip.BtnRemove = 		new SimpleButton({text:$MUI('Remove')});
		panel.PanelSwip.BtnRemove.addClassName('remove');
		
		panel.PanelSwip.BtnRemove.on('click', function(){
			this.removeApp(win, this.CurrentApp);
		}.bind(this));
		
		panel.PanelSwip.Footer().appendChilds([
			panel.PanelSwip.BtnDownload,
			panel.PanelSwip.BtnUpdate,
			panel.PanelSwip.BtnRemove
		]);
		//
		//
		//
				
		win.Panel = panel;
		panel.ProgressBar.hide();
		
		this.getNbUpdate(win);
		this.getListCategory(win);
		
		panel.BtnUpdate.on('click', function(){
			this.getListUpdate(win);
		}.bind(this));	
		//
		// Gestion de la mise à jour
		//	
		panel.PanelBody.Header().select(".update-all").each(function(e){
			e.on('click', function(){
				
				var list = [];
				
				panel.select('.item-update').each(function(e){
					list.push(e.data);
				});
				
				self.updateApps(win, list);
				
			});
		});
		
		panel.PanelBody.Header().select(".update-selection").each(function(e){
			e.on('click', function(){
				
				var list = [];
				
				panel.select('.item-update.checked').each(function(e){
					list.push(e.data);
				});
				
				self.updateApps(win, list);
				
			});
		});
		//
		// Gestion du tri
		//
		panel.PanelBody.Header().select(".tool-market").each(function(e){
			e.on('click', function(){
				panel.PanelBody.Header().select('.selected').invoke('removeClassName', 'selected');
				this.addClassName('selected');
				
				self.getListApps(win, win.Panel.Current); 
			});
		});
		//
		// Gestion de l'affichage des applications locales
		//
		panel.PanelBody.Header().select(".all")[0].on('click', function(){
			panel.PanelBody.Header().select('.selected').invoke('removeClassName', 'selected');
			this.addClassName('selected');
			
			panel.PanelBody.Body().select('.plugin-button').invoke('show');
			panel.PanelBody.refresh();
		});
		
		panel.PanelBody.Header().select(".enabled")[0].on('click', function(){
			panel.PanelBody.Header().select('.selected').invoke('removeClassName', 'selected');
			this.addClassName('selected');
			
			panel.PanelBody.Body().select('.plugin-button').invoke('hide');
			panel.PanelBody.Body().select('.plugin-button.enabled').invoke('show');
			panel.PanelBody.refresh();
		});
		
		panel.PanelBody.Header().select(".disabled")[0].on('click', function(){
			panel.PanelBody.Header().select('.selected').invoke('removeClassName', 'selected');
			this.addClassName('selected');
			
			panel.PanelBody.Body().select('.plugin-button').invoke('hide');
			panel.PanelBody.Body().select('.plugin-button.disabled').invoke('show');
			panel.PanelBody.refresh();
		});
				
		//
		// Gestion du glisser déposer
		//
		
		panel.DropFile.on('complete', function(){
			panel.OpenDropPanel(false);
			self.getListLocalApps(win);
		});
		
		return panel;
	},
/**
 * System.Market.getListCategory(win) -> Panel
 * - win (Window): Instance Window.
 *
 * Cette méthode récupère les catégories du catalogue d'applications.
 **/	
	getListCategory:function(win){
		
		$S.exec('market.category.list', {
			onComplete:function(result){
				try{
					var categories = $A(result.responseText.evalJSON());
				}catch(er){
					$S.trace(er);
					return;	
				}
				
				var self = this;
				for(var i = 0; i < categories.length; i++){
					
					var btn = win.Panel.DropMenu.addMenu($MUI(categories[i].Title));
					
					if(categories[i].Title != 'All'){
						btn.setIcon('edit-' + categories[i].Title.sanitize('-').toLowerCase());
					}
					
					btn.data = categories[i];
					
					btn.on('click', function(){
						self.getListApps(win, this.data.Title);
					});
				}
								
			}.bind(this)
		});
		
	},
/**
 * System.Market.getNbUpdate(win) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode récupère le nombre de mise à jour.
 **/
	getNbUpdate:function(win){
		
		$S.exec('market.update.list', function(result){
			try{
				var obj = result.responseText.evalJSON();
			}catch(er){return er;}
									
			if(obj.length == 0){
				win.Panel.BtnUpdate.hide();
				return;
			}
			
			win.Panel.BtnUpdate.show();
			win.Panel.BtnUpdate.setText($MUI('Update') + ' (' + obj.length + ')');			
		}.bind(this));
	},
/**
 * System.Market.getListUpdate(win) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode liste les applications ayant une mise à jour de disponible.
 **/
	getListUpdate:function(win){
		
		this.setCurrent(win, $MUI('Update'));
		win.Panel.ProgressBar.show();
		
		$S.exec('market.update.list', function(result){
			try{
				var array = result.responseText.evalJSON();
			}catch(er){return er;}
			
			
			var self = this;
				
				if(array.length > 0){
					try{
					for(var i = 0; i < array.length; i++){
												
						var button = new MarketButton({
							icon:		array[i].Icon, 
							text:		array[i].Name, 
							note:  		array[i].Note,
							downloads:  array[i].Nb_Downloads, 
							subTitle:	array[i].Category,
							version:	$MUI('Version') + ' '+ array[i].Version,
							checkbox:	true,
							overable:	true
						});
						
						button.addClassName('item-update');
						
						button.data = 			array[i];
						button.data.Update =	true;
						button.data.Local = 	true;
								
						win.Panel.PanelBody.Body().appendChild(button);
												
						button.on('click', function(){
							if(!document.HasScrolled){
								self.openApp(win, this.data);
							}
						});
												
						button.addClassName('hide');
					}
					}catch(er){$S.trace(er)}
					
					win.Panel.PanelBody.refresh();
					
					new Timer(function(){
						var b = win.Panel.PanelBody.body.select('.market-button.hide')[0];
						if(b){
							b.removeClassName('hide');
							b.addClassName('show');
						}
					}, 0.1, array.length).start();
					
					this.applyAppsRestartNeeded(win);
					
				}else{
					win.Panel.PanelBody.Body().appendChild(new Node('H1', {className:'notfound'}, $MUI('You have no update available') + '.'));
				}
				
				if(win.Panel.ProgressBar.hasClassName('splashscreen')){
					new Timer(function(){
						win.Panel.ProgressBar.hide();
						win.Panel.ProgressBar.removeClassName('splashscreen');
					}, 0.5, 1).start();
				}else{
					win.Panel.ProgressBar.hide();
				}		
			
		}.bind(this));
	},	
/**
 * System.Market.getListApps(win) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode retourne la liste des applications du catalogue en ligne.
 **/	
	getListApps:function(win, category){
		
		this.setCurrent(win, category);
		
		win.Panel.ProgressBar.show();
		
		var field = win.Panel.PanelBody.Header().select('.selected')[0].value;
		
		$S.exec('market.app.list', {
			parameters:'Category=' + encodeURIComponent(category) + '&FieldOrder=' + field + '&Order=down',
			onComplete:function(result){
				try{
					var array = $A(result.responseText.evalJSON());
				}catch(er){
					$S.trace(er);
					return;	
				}
								
				this.drawApps(win, array);
				
				if(win.Panel.ProgressBar.hasClassName('splashscreen')){
					new Timer(function(){
						win.Panel.ProgressBar.hide();
						win.Panel.ProgressBar.removeClassName('splashscreen');
					}, 0.5, 1).start();
				}else{
					win.Panel.ProgressBar.hide();
				}
			}.bind(this)
		});
	},
/**
 * System.Market.drawApps(win, array) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode construit le catalogue à partir de la liste des applications.
 **/	
	drawApps: function(win, array){
		var self = this;
		
		if(array.length > 0){
			for(var i = 0; i < array.length; i++){
									
				var button = new MarketButton({
					icon:		array[i].Icon, 
					text:		array[i].Name, 
					note:  		array[i].Note,
					downloads:  array[i].Nb_Downloads, 
					subTitle:	array[i].Category,
					price:		array[i].Price,
					update:		$S.plugins.get(array[i].Name) ? ($S.plugins.get(array[i].Name).Version < array[i].Version) : false,
					version:	$S.plugins.get(array[i].Name) ? $MUI('Installed') : false,
					overable:	true
				});
				
				if($S.plugins.get(array[i].Name)){
					array[i].Local = false;	
				}
				
				button.data = array[i];
										
				win.Panel.PanelBody.Body().appendChild(button);
				
				button.on('click', function(){
					//alert(document.HasScrolled);
					if(!document.HasScrolled){
						self.openApp(win, this.data);
					}
				});
				
				button.addClassName('hide');
			}
			
			win.Panel.PanelBody.refresh();
			
			new Timer(function(){
				var b = win.Panel.body.select('.market-button.hide')[0];
				if(b){
					b.removeClassName('hide');
					b.addClassName('show');
				}
			}, 0.1, array.length).start();
			
			this.applyAppsRestartNeeded(win);
			
		}else{
			if(!win.isSearch){
				win.Panel.PanelBody.Body().appendChild(new Node('H1', {className:'notfound'}, $MUI('Sorry. There is still no application available in this section') + '.'));
			}else{
				win.Panel.PanelBody.Body().appendChild(new Node('H1', {className:'notfound'}, $MUI('Sorry. No application for your search') + '.'));
			}
		}
		
		return this;
	},
/**
 * System.Market.getListLocalApps(win) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode liste l'ensemble des extensions disponible sur le serveur client.
 **/	
	getListLocalApps:function(win){
		
		this.setCurrent(win, $MUI('My apps'));	
		win.Panel.ProgressBar.show();
		
		$S.exec('market.app.local.list', {
			parameters: 'options=' + Object.EncodeJSON({clear:true}),
			onComplete:function(result){
				
				var array = $A(result.responseText.evalJSON());
				
				var self = this;
				
				if(array.length > 0){
					var options = {
						enabled: 	0,
						disabled:	0
					};
					
					for(var i = 0; i < array.length; i++){
						try{
						var button = new PluginButton({
							icon:		array[i].Icon, 
							enabled:	array[i].Active == 1,
							update:		array[i].Update,
							text:		array[i].Name, 
							note:  		array[i].Note,
							downloads:  array[i].Nb_Downloads,
							local:		array[i].Local,
							subTitle:	$MUI('Version')+ ' '+ array[i].Version
						});
						
						if(array[i].Active == 1){
							options.enabled++;	
						}else{
							options.disabled++;	
						}
						
						button.data = array[i];
																		
						win.Panel.PanelBody.Body().appendChild(button);
						
						button.on('click', function(){
							
							if(!document.HasScrolled){
								self.openApp(win, this.data);
							}
						});
						
						button.addClassName('hide');
						
						button.ToggleButton.on('click', function(evt){evt.stop()});
						button.ToggleButton.on('change', function(evt){
							evt.stop();
							if(this.ToggleButton.Value()){				
								self.enableApp(win, this);
							}else{
								try{
								self.disableApp(win, this);
								}catch(er){$S.trace(er)}
							}
						}.bind(button));
						}catch(er){$S.trace(er)}
					}
										
					if(options.enabled){
						win.Panel.PanelBody.Header().select(".enabled")[0].innerHTML =  $MUI('Enabled') + ' (' + options.enabled + ')';
					}
					
					if(options.disabled){
						win.Panel.PanelBody.Header().select(".disabled")[0].innerHTML =  $MUI('Disabled') + ' (' + options.disabled + ')';
					}
					
					win.Panel.PanelBody.refresh();
					
					new Timer(function(){
						var b = win.Panel.PanelBody.body.select('.plugin-button.hide')[0];
						if(b){
							b.removeClassName('hide');
							b.addClassName('show');
							
						}
					}, 0.1, array.length).start();
					
					this.applyAppsRestartNeeded(win);
					
				}else{
					win.Panel.PanelBody.Body().appendChild(new Node('H1', {className:'notfound'}, $MUI('Sorry. There is still no application available in this section') + '.'));
				}
				
				if(win.Panel.ProgressBar.hasClassName('splashscreen')){
					new Timer(function(){
						win.Panel.ProgressBar.hide();
						win.Panel.ProgressBar.removeClassName('splashscreen');
					}, 0.5, 1).start();
				}else{
					win.Panel.ProgressBar.hide();
				}
				
			}.bind(this)
		});
	},
/**
 * System.Market.openApp(win, app) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode ouvre une application dans Javalyss Market.
 **/	
	openApp:function(win, app){
		
		try{
		
		this.CurrentApp = app;
				
		win.Panel.PanelSwip.removeClassName('local');
		win.Panel.PanelSwip.removeClassName('download');
		win.Panel.PanelSwip.removeClassName('update');
		win.Panel.PanelSwip.removeClassName('removable');
		
		win.Panel.PanelSwip.clear();
				
		var button = new MarketButton({
			icon:		app.Icon, 
			text:		app.Name, 
			note:		app.Note, 
			nbNote:		app.Nb_Note, 
			subTitle:	app.Category, 
			price:		app.Price,
			version: 	$S.plugins.get(app.Name) ? $MUI('Already installed') : false
		});
		
		win.Panel.PanelSwip.Body().appendChild(button);
		
		if(!Object.isUndefined(app.Local)){
			
			win.Panel.PanelSwip.addClassName('local');
			
			if(app.Local){	
				button.Price.innerHTML = 	$MUI('Local');	
				button.SubTitle.innerHTML = $MUI('Version') + ' ' + app.Version
			}
							
			if(app.Update){
				win.Panel.PanelSwip.addClassName('update');
				button.Price.innerHTML = 	$MUI('Update available');			
			}
			
		}else{
			win.Panel.PanelSwip.addClassName('download');	
		}
		
		
		if(app.Type != 'app'){
			win.Panel.PanelSwip.addClassName('removable');
		}
		
		var html = new HtmlNode();
		//html.addClassName('black');
				
		if(app.Date_Update){
			var weight = ((app.Weight / 1024) / 1024).toFixed(2);
			html.append('<ul class="wrap-list"><li><span>' + $MUI('Publisher') + ' : ' + app.Author  + '</span></li>' 
			+ '<li><span>' + $MUI('Release')  + ' ' +  app.Date_Publication.toDate().toString_('date', MUI.lang) + '</span></li>'
			+ '<li><span>' + $MUI('Updated')  + ' ' +  app.Date_Update.toDate().toString_('date', MUI.lang) + '</li>'
			+ '<li><span>' + $MUI('Version') + ' ' + app.Version + ', ' + weight + ' Mo</span></li>');
		}else{
			html.append('<ul class="wrap-list"><li><span>' + $MUI('Publisher') + ' : ' + app.Author  + '</span></li>' 
			+ '<li><span>' + $MUI('Release')  + ' ' +  app.Date_Publication.toDate().toString_('date', MUI.lang) + '</span></li>');
			
			if(Object.isUndefined(app.Local)){
				html.append('<p class="wait">' + $MUI('The application is not yet available for download') + '</p>');
				win.Panel.PanelSwip.removeClassName('download');
			}
		}
		
		html.append(app.Description);
		
		//if(app.Update){
			$S.exec('market.release.list', {
				parameters:'Name=' + app.Name,
				onComplete:	function(result){
					try{
						var options = $A(result.responseText.evalJSON());
						
						for(var i = 0; i < options.length; i++){
							
							if(options[i].Description.replace(/<p> <\/p>/gi, '').replace(/<p>&nbsp;<\/p>/gi, '').trim() == ''){
								continue;
							}
							
							var section = new Section();
							section.Title($MUI('version') + ' ' + options[i].Version);
							section.Body().innerHTML = options[i].Description;
							
							section.Hidden(true);
							
							section.SimpleButton.on('click', function(){
								win.Panel.PanelSwip.ScrollBar.refresh();
							});
							
							html.appendChild(section);
						}
						
					}catch(er){
						$S.trace(er);
						return;	
					}
				}
			});
		//}
		
		win.Panel.PanelSwip.Body().appendChild(html);
		
		this.applyAppsRestartNeeded(win);
		
		win.Panel.Open(true, 650);
		
		}catch(er){$S.trace(er)}
	},
/**
 * System.Market.enableApp(win, button) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode active l'application.
 **/
	enableApp:function(win, button){
		
		button.setProgress(2, 5, $MUI('Activation during'));
		
		new System.Plugin(button.data).active(function(){
			
			button.restart();
			System.Market.addAppRestartNeeded(button.data);
				
			win.on('close', function(){
				$S.reload();
			});
		},
		function(error){
			$S.trace(error);
			button.setProgress(0, 5, $MUI('An error has occurred'));
			button.ToggleButton.Value(false);
		});
		
	},
/**
 * System.Market.disableApp(win, button) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode désactive l'application.
 **/	
	disableApp:function(win, button){
		var splite = 	new SpliteIcon($MUI('Do you really want to disable the application') + ' ? ', button.data.Name + ' ' + button.data.Version);
		splite.leftContent.css('background-image', 'url(' + button.data.Icon + ')');
		splite.leftContent.css('background-size', 'contain');
		splite.css('margin-bottom', 20);
		
		var toggle = 	new ToggleButton();
		toggle.Value(false);
		
		var table = 	new TableData();
		table.addHead($MUI('Erase Data')  + ' ?').addCel(toggle);
		table.css('margin', '8px auto');
		
		var box = 		win.createBox();
		
		box.setTheme('flat liquid black');
		box.ty().as([splite, table]).show();
		
		box.addClassName('market-box');
			
		box.submit({
			text:$MUI('Disable'),
			click:function(){
				button.setProgress(2, 5, $MUI('Deactivation during'));
				
				new System.Plugin(button.data).deactive(button.ToggleButton.Value(), function(){
					
					button.restart();
					System.Market.addAppRestartNeeded(button.data);
						
					win.on('close', function(){
						$S.reload();	
					});
				},
				function(){
					button.setProgress(0, 5, $MUI('An error has occurred'));
					button.ToggleButton.Value(true);
				});
			}
		});
		
		box.reset({click:function(){
			button.ToggleButton.Value(true);
		}});		
	},
/**
 * System.Market.removeApp(win, app) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode supprime définitivement l'application du serveur.
 **/	
	removeApp:function(win, app){
		var splite = 	new SpliteIcon($MUI('Do you really want to delete the application') + ' ? ', app.Name + ' ' + app.Version);
		splite.leftContent.css('background-image', 'url(' + app.Icon + ')');
		splite.leftContent.css('background-size', 'contain');
		splite.css('margin-bottom', 20);
		
		var toggle = 	new ToggleButton();
		toggle.Value(false);
		
		var box = win.createBox();
		
		box.setTheme('flat liquid black');
		box.ty().as([splite]);
		
		box.addClassName('market-box');
			
		box.submit({
			text:$MUI('Remove'),
			click:function(){
				try{
					var evt = new StopEvent(box);
					$S.fire('market:remove.submit', evt);
					
					if(evt.stopped)	return true;
									
					win.select('.progress-' + app.Name.sanitize().toLowerCase()).each(function(e){
						e.setProgress(2, 5, $MUI('Remove during'));
					});
					
					win.Panel.PanelSwip.removeClassName('removable');
						
					new System.Plugin(app).remove(function(){
						
						$S.fire('market:remove.complete', evt);
						
						win.select('.progress-' + app.Name.sanitize().toLowerCase()).each(function(e){
							try{e.restart();}catch(er){}
							System.Market.addAppRestartNeeded(app);
						});
							
						win.Panel.PanelSwip.removeClassName('local');
								
						win.on('close', function(){
							$S.reload();	
						});
					},
					function(){
						win.select('.progress-' + app.Name.sanitize().toLowerCase()).each(function(e){
							e.setProgress(0, 5, $MUI('An error has occurred'));
						});
					});
				}catch(er){
					alert(er)	
				}
			}
		});
				
		$S.fire('market:remove.open', box);
		
		box.show();	
	},
/**
 * System.Market.downloadApp(win, app) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode télécharge l'application demandée.
 **/
 	downloadApp:function(win, app){
		var app = 		new System.Market.App(app);
		app.statut = 	0;
		
		win.Panel.PanelSwip.removeClassName('download');
		
		app.timer = new Timer(function(pe){
			
			win.select('.progress-' + app.Name.sanitize().toLowerCase()).each(function(e){
				
				switch(app.statut){
					case 'err':
						pe.stop();
						
						if(e.timer){
							e.timer.stop();
							e.timer = null;	
						}
						
						e.setProgress(0, 5, $MUI('An error has occurred'));
						break;
					case 0:
						
						if(!e.timer){
							e.it = 0;
							e.setProgress(e.it, 120, $MUI('Downloading') + '...');
							
							e.timer = new Timer(function(pe){
								this.it++;
								this.setProgress(this.it, 120, $MUI('Downloading') + '...');
							}.bind(e), 1, 60);
							e.timer.start();
							
						}
						
						break;
						
					case 1:
						if(e.timer){
							e.timer.stop();
							e.timer = null;	
						}
						
						e.setProgress(80, 120, $MUI('Installation') + '...');
						break;
							
					case 2:
						if(e.timer){
							e.timer.stop();
							e.timer = null;	
						}
						//e.restart();
						pe.stop();
						
						break;
				}
				
			}.bind(this));
			
		}.bind(this), 1);
		
		app.timer.start();
		//
		// Lancement de la procedure
		//	
		
		var fnError = function(){
			app.statut = 'err';
			this.next();
		}.bind(this);
			
		app.download(function(){
			app.statut = 1;
			
			new fThread(function(){
				app.install(function(){
					app.statut = 2;
					
					new fThread(function(){
						app.Local = true;
						
						var box = win.createBox();
						
						var splite = 	new SpliteIcon($MUI('Do you want to activate the app now') + ' ? ', app.Name + ' ' + app.Version);
						splite.leftContent.css('background-image', 'url(' + app.Icon + ')');
						splite.leftContent.css('background-size', 'contain');
						splite.css('margin-bottom', 20);
						
						box.setTheme('flat liquid black');
						box.ty().as([splite]).show();
						
						win.select('.progress-' + app.Name.sanitize().toLowerCase()).each(function(e){
							e.setProgress(100, 120, $MUI('Installation') + '...');
						});
						
						box.submit({
							text:$MUI('Activate now'),
							click:function(){
																	
								win.select('.progress-' + app.Name.sanitize().toLowerCase()).each(function(e){
									e.setProgress(110, 120, $MUI('Activation during') + '...');
								});
								
								new System.Plugin(app).active(function(){
									
									win.select('.progress-' + app.Name.sanitize().toLowerCase()).each(function(e){
										try{e.restart();}catch(er){}
									});
									
									System.Market.addAppRestartNeeded(app);
										
									win.on('close', function(){
										$S.reload();
									});
								}, function(result){
									win.select('.progress-' + app.Name.sanitize().toLowerCase()).each(function(e){
										e.setProgress(0, 120, $MUI('An error has occurred') + '...');
									});
								});
								
							}.bind(this)
						});
						
						box.reset({
							text:$MUI('Close'),
							click:function(){
								win.select('.progress-' + app.Name.sanitize().toLowerCase()).each(function(e){
									e.installed();
								});	
								
								win.Panel.PanelSwip.addClassName('local');
								win.Panel.PanelSwip.addClassName('removable');
							}
						});					
						
						$S.plugins.reload();
						
					}.bind(this), 0.5);
					
				}.bind(this), fnError);
			}.bind(this), 0.5);
			
		}.bind(this), fnError);
	},
/**
 * System.Market.updateApps(win, array) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode met à jour la liste des applications demandées.
 **/	
	updateApps:function(win, array){
		
		try {
			new System.Market.Update(win, array);
		}catch(er){
			$S.trace(er);
		}
	}	
	
};
/** section: Core
 * class MarketButton
 **/
var MarketButton = Class.from(AppButton);
MarketButton.prototype = {
	
	className:'wobject market-button',
/**
 * new MarketButton([options])
 **/	
	initialize:function(obj){
		
		var options = {
			price: 		0,
			note:		0,
			nbNote:		0,
			subTitle:	$MUI('All'),
			overable:	false,
			progress:	false,
			checkbox:	false,
			update:		false,
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
		this.Version = this.Price = 	new Node('span', {className:'wrap-price wrap-version'}, $MUI('Free'));
		//
		//
		//
		this.ProgressBar = new ProgressBar();		
		//
		//
		//
		this.Note = 		new StarsRating();
		
		if(options.version != ''){
			this.Version.innerHTML = options.version;
		}
		
		this.setRating(options.note, options.nbNote);
		
		if(options.update){
			this.addClassName('update');
			this.setTag($MUI('Update'));
		}
		
		this.appendChild(this.SubTitle);
		this.appendChild(this.Price);
		this.appendChild(this.Note);
		this.appendChild(this.ProgressBar);
		
		if(options.checkbox){
			this.Checkbox = new Checkbox();
			this.appendChild(this.Checkbox);
			
			this.Checkbox.on('change', function(){
				this.removeClassName('checked');
				if(this.Checkbox.Checked()){
					this.addClassName('checked');	
				}
				
			}.bind(this));
		}
				
		this.Overable(options.overable);
		
		this.addClassName('progress-'+this.getText().sanitize().toLowerCase());
	},
/**
 * MarketButton#setProgress(min, max, text) -> MarketButton
 * 
 **/
	setProgress:function(current, max, text){
		
		if(!this.hasClassName('progress')){
			this.addClassName('progress');
		}
		
		this.ProgressBar.setProgress(current, max, text);
		return this;
	},
/**
 * MarketButton#restart() -> MarketButton
 * Cette méthode affiche le message de redémarrage pour le boutton.
 **/	
	restart:function(){
		if(!this.hasClassName('progress')){
			this.addClassName('progress');
		}
		
		this.removeClassName('restart');
		this.removeClassName('installed');
		
		this.ProgressBar.setProgress(5, 5, $MUI('The restart is required'));
		this.addClassName('restart');
	},
/**
 * MarketButton#installed() -> MarketButton
 * Cette méthode affiche le message de redémarrage pour le boutton.
 **/	
	installed:function(){
		if(!this.hasClassName('progress')){
			this.addClassName('progress');
		}
		
		this.removeClassName('restart');
		this.removeClassName('installed');
		
		this.ProgressBar.setProgress(5, 5, $MUI('Installed'));
		this.addClassName('installed');
	},
/**
 * MarketButton#setRating(note, nbNote) -> MarketButton
 **/	
	setRating:function(note, nbNote){
		this.Note.setRating(note, nbNote);
		
		if(!nbNote){
			this.Note.hide();
		}
	},
	
	Overable:function(bool){
		this.removeClassName('overable');
		
		if(bool){
			this.addClassName('overable');	
		}
	}
};

/** section: Core
 * class PluginButton
 **/
var PluginButton = Class.from(AppButton);
PluginButton.prototype = {
	
	className:'wobject plugin-button',
/**
 * new PluginButton([options])
 **/	
	initialize:function(obj){
		
		var options = {
			update:		true,
			enabled:	false,
			local:		true,
			subTitle:	''
		};
		
		Object.extend(options, obj || {});
		//
		//
		//
		this.SubTitle = new Node('span', {className:'wrap-subtitle'}, $MUI(options.subTitle));
		//
		//
		//
		this.ToggleButton = new ToggleButton({yes:'I', no:'O'});
		this.ToggleButton.Value(options.enabled);
		//
		//
		//
		this.ProgressBar = new ProgressBar();
		
		this.addClassName(options.enabled ? 'enabled' : 'disabled');
				
		this.Note = 	 	new StarsRating();
		//
		//
		//
		if(options.update){
			this.addClassName('update');
			this.setTag($MUI('Update'));
		}
		
		this.appendChild(this.Note);
		this.appendChild(this.SubTitle);
		this.appendChild(this.ToggleButton);
		this.appendChild(this.ProgressBar);
		
		this.setRating(options.note, options.nbNote);
		
		if(options.local){
			this.Note.hide();
		}
		
		this.addClassName('progress-'+this.getText().sanitize().toLowerCase());
	},
/**
 * PluginButton#setProgress(min, max, text) -> PluginButton
 **/
	setProgress:function(current, max, text){
		if(!this.hasClassName('progress')){
			this.addClassName('progress');
		}
		
		this.ProgressBar.setProgress(current, max, text);
		return this;
	},
/**
 * PluginButton#restart() -> PluginButton
 * Cette méthode affiche le message de redémarrage pour le boutton.
 **/	
	restart:function(){
		if(!this.hasClassName('progress')){
			this.addClassName('progress');
		}
		
		this.removeClassName('restart');
		this.removeClassName('installed');
		
		this.ProgressBar.setProgress(5, 5, $MUI('The restart is required'));
		this.addClassName('restart');
		return this;
	},
/**
 * PluginButton#installed() -> PluginButton
 * Cette méthode affiche le message de redémarrage pour le boutton.
 **/	
	installed:function(){
		if(!this.hasClassName('progress')){
			this.addClassName('progress');
		}
		
		this.removeClassName('restart');
		this.removeClassName('installed');
		
		this.ProgressBar.setProgress(5, 5, $MUI('Installed'));
		this.addClassName('installed');
		return this;
	},
/**
 * PluginButton#setRating() -> PluginButton
 * Cette méthode affiche le message de redémarrage pour le boutton.
 **/	
	setRating:function(note, nbNote){
		
		this.Note.setRating(note, nbNote);
		
		if(!nbNote){
			this.Note.hide();
		}
	}
};
/** section: Core
 * class StarsRating
 **/
var StarsRating = new Class.createElement('div');
StarsRating.prototype = {
	className:'stars-rating wrap-stars',
/**
 * new StarsRating([rating, nbRating])
 **/	
	initialize:function(note, nbNote){
		if(!Object.isUndefined(note)){
			this.setRating(note, nbNote);	
		}
	},
/**
 * StarsRating#setRating([rating, nbRating]) -> StarsRating
 **/	
	setRating:function(note, nbNote){
		
		this.removeChilds();
		
		note = (Math.round(note * 2) / 2) * 2;

		for (var i = 0; i < 10; i += 2){
			if (i + 1 == note) {
				this.appendChild(new Node('span', {className:'star-split'}));
			} else{
				if (i < note){
					this.appendChild(new Node('span', {className:'star-full'}));
				} else {
					this.appendChild(new Node('span', {className:'star-empty'}));
				}
			}
		}
		
		if(nbNote){
			this.appendChild(new Node('div', {className:'number-notes'}, nbNote + ' '+ $MUI('opinions').toLowerCase()));	
		}
		
		return this;
	}
};


MUI.addWords({
	'All_':			'Toutes',
	'Name':			'Nom',
	'Enabled':		'Activée',
	'Downloading':	'Téléchargement en cours',
	'Disabled':		'Désactivée',
	'Update':		'Mise à jour',
	'Release':		'Distribué le',
	'My apps':		'Mes applications',
	'Uncategorized':'Non classé',
	'All':			'Toutes les applications',
	'Business':		'Business',
	'Games':		'Jeux',
	'Media':		'Médias',
	'Productivity':	'Productivité',
	'Security':		'Sécurité',
	'Social Networks': 'Réseaux sociaux',
	'Utilities':	'Utilitaires',			
	'Date':			'Date',
	'Note': 		'Note',
	'Popularity':	'Popularité',
	'Loading in process': 'Chargement en cours', 
	'Back':			'Retour',
	'Details': 		'Détails',
	'Free': 		'Gratuit',
	'opinions': 	'avis',
	'Opinions':		'Avis',
	'Visual':		"Visuel",
	'Associated':	'Associés',
	'Released': 	'Sortie le',
	'Publisher': 	'Editeur',
	'Updated':		'Mise à jour le',
	'Restart now':	'Redémarrer maintenant',
	'Update now':	'Mettre à jour',
	'Remove':		'Supprimer',
	'Restart later':'Redémarrer plutard',
	'Download':		'Télécharger',
	'Installed':	'Installé',
	'Remove during':'Suppression en cours',
	'Activate now':	'Activer maintenant',
	'Disable':		'Désactiver',
	'Update are available': 'Mise à jour disponible',
	'Update available for':'Mise à jour disponible pour',
	'An error has occurred': 'Une erreur est survenue',
	'Already installed':'Déjà installé',
	'The restart is required': 'Le redémmarage est requis',
	'Erase Data':		'Supprimer les données',
	'Activation during':'Activation en cours',
	'Updates are available':'Des mises à jour sont disponibles',
	'Search for an application': 'Rechercher une application',
	'Update completed. Restarting Javalyss required': 'Mise à jour terminé. Le redémarrage de Javalyss est nécessaire',
	'The restart is required': 'Le redémarrage est nécessaire',
	'The application is not yet available for download' : 'Cette application n\'est pas encore disponible au téléchargement',
	'Sorry. There is still no application available in this section': 'Désolé. Il n\'y a encore aucune application de disponible dans cette section',
	'Do you really want to delete the application':	'Voulez-vous vraiment supprimer l\'application',
	'Do you really want to disable the application':'Voulez-vous vraiment désactiver l\'application',
	'Do you want to activate the app now':'Voulez-vous activer l\'application maintenant',
	'Sorry. No application for your search':'Désolé. Aucune application ne correspond à votre recherche'
}, 'fr');

MUI.addWords({
	'All_': 'All'
}, 'en');

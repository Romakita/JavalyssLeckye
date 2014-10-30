/** section: Core
 * class System.Market.Update
 * Cette classe gère la mise à jour d'une collection d'application.
 **/
System.Market.Update =  Class.create();

System.Market.Update.prototype = {
	Window: 	null,
	apps:		null,
	it:			0,
	statut:		0,
/**
 * new System.Market.Update()
 **/
 	initialize:function(win, apps){
		this.Window = 	win;
		this.apps = 	apps;
		
		if(!Object.isArray(apps)){
			this.apps = 	[apps];
		}
		
		this.start();
	},
/**
 * System.Market.Update#start() -> void
 * Cette méthode lance la mise à jour d'une application en file d'attente.
 **/
 	start:function(){
		//
		// Création de l'animation
		//
		var app = 		new System.Market.App(this.current());
		app.statut = 	0;
		
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
				}catch(er){console.log(er)};
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
						app.configure(function(){
							app.statut = 3;
							this.next();
						}.bind(this), fnError);
					}.bind(this), 0.5);
					
				}.bind(this), fnError);
			}.bind(this), 0.5);
			
		}.bind(this), fnError);
	},
/**
 * System.Market.Update#current() -> App
 **/	
	current: function(){
		return this.apps[this.it];
	},
/**
 * System.Market.Update#next() -> void
 * Cette méthode passe à la mise à jour de l'application suivante.
 **/	
	next:function(){
		
		//ajout à la liste des apps déjà up
		System.Market.addAppRestartNeeded(this.current());
		
		this.it++;
		
		if(this.it < this.apps.length){
			this.start();	
		}else{
			//afficher boite de dialogue invitant l'utilisateur à faire une redemmarage de Javalyss
			var box = this.Window.createBox();
			var splite = new SpliteIcon($MUI('Update completed. Restarting Javalyss required') + ' !');
			
			splite.setIcon('javalyss-market-48');
			
			box.hide();
			
			box.setTheme('flat liquid black');
			box.a(splite);
			box.show();
			
			box.reset({
				text:$MUI('Restart later')
			});
			
			this.Window.on('close', function(){
				window.location.reload();
			});
			
			box.submit({
				text:$MUI('Restart now'),
				click:function(){
					$S.reload();	
				}
			});
		}
	}
};
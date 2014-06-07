/**
 *
 **/
Object.extend(AppsUI.prototype, {
	
/**
 * System.Manuel.checkChange(win) -> Boolean
 * - win (Window): Instance du formulaire.
 * 
 * Cette méthode vérifie l'état du formulaire et retourne vrai si le formulaire a été modifié, faux dans le cas de contraire.
 **/	
	checkChangeManuel:function(win){
		
		var last = 		win.man.clone();
		var current =	win.man.clone();
		
		current.Title = 		win.forms.Title.value;
		current.Parent_ID = 	win.forms.Parent_ID.Value();
		current.Statut = 		win.forms.Statut.Value() ? 1 : 0;
		current.Description = 	win.forms.Description.Value();
		
		return (function(o, n){
			
					for(var key in o){
						if(Object.isFunction(o[key])) continue;
						if(key == 'Parent_ID') continue;
						if(o[key] != n[key]){
							$S.trace(key);
							return true;
						}					
					}
					return false;
					
				})(last, current);
	},
/**
 * System.Manuel.submit(win [, noclose]) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode valide le formulaire.
 **/
	submitManuel: function(win){
		
		win.Flag.hide();
		win.AlertBox.hide();
		
		if(win.forms.Title.value == '') {
			win.Flag.setText($MUI('Vous devez choisir un titre pour votre manuel')).setType(FLAG.RIGHT);
			win.Flag.show(win.forms.Title);
			return true;
		}
		
		var evt = new StopEvent(win);
		$S.fire('manuel:open.submit', evt, win);
		
		if(evt.stopped) return true;
				
		win.man.Title = 		win.forms.Title.value;
		win.man.Parent_ID = 	win.forms.Parent_ID.Value();
		win.man.Statut = 		win.forms.Statut.Value() ? 1 : 0;
		win.man.Description = 	win.forms.Description.Value();
		
		if(!this.checkChange(win))	return;	
				
		win.ActiveProgress();
		
		win.man.commit(function(responseText){
		
			$S.fire('manuel:submit.complete', win.man);
			
			try{
				
				//Confirmation d'enregistrement
				var splite = new SpliteIcon($MUI('Le formulaire a été correctement sauvegardé'), $MUI('Manuel N°') +' ' + win.man.Man_ID);
				splite.setIcon('filesave-ok-48');
					
				win.AlertBox.ti($MUI('Confirmation') + '...').a(splite).ty('NONE').Timer(3).show();
				
				widget.Table.getRow(0).show();
				
			}catch(er){}
		}.bind(this))
		
		return true;
	},
	
	openManuel:function(man){
		
		var win = $WR.unique('manuel.form', {
			autoclose:	true,
			action: function(){
				this.open(man);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return;
		//overide
		win.overideClose({
			submit:this.submitManuel.bind(this), 
			change:this.checkChangeManuel.bind(this),
			close: function(){}
		});
		
		//Vérification régulière de l'état de la fiche lorsqu'un click est intercepté
		win.body.on('click', function(){
			try{
				if(this.checkChange(win)){
					win.forms.active();	
				}
			}catch(er){$S.trace(er)}
		}.bind(this));
		
		
		//#pragma region Instance
		var forms = {};
		win.man = man = new Manuel(man);
		win.Resizable(false);
		win.ChromeSetting(true);		
		win.createFlag().setType(FLAG.TYPE);
		
		win.setTitle($MUI('Editeur de manuel')).setIcon('write');
		win.createHandler($MUI('Chargement en cours'), true);
		
		win.forms = 	forms;
		
		$Body.appendChild(win);
		//
		// Menu
		//
		forms.submit =	new SimpleButton({text:$MUI('Enregistrer'), icon:'filesave', type:'submit'}).on('click', function(){this.submit(win)}.bind(this));
		forms.reset = 	new SimpleButton({text:$MUI('Fermer'), icon:'exit', type:'reset'}).on('click', function(){win.close()}.bind(this));
		//
		// Title
		//
		forms.Title = 	new Input({type:'text', value:man.Title});
		forms.Title.addClassName('input-big');
		forms.Title.setStyle('width:478px');
		//
		// Parent_ID
		//
		forms.Parent_ID = new Select({
			link: 		$S.link,
			parameters:	'cmd=application.manuel.list&options=' + escape(Object.toJSON({op:'-h'}))
		});
		
		forms.Parent_ID.setData([{value:0, text:$MUI('Aucune page')}]);
		forms.Parent_ID.Value(man.Parent_ID);
		forms.Parent_ID.load();
		forms.Parent_ID.setStyle('width:300px');
		//
		// Description
		//
		forms.Description = new Editor({
			width:						'500px', 
			height:						'400px', 
			media:						function(){$S.applications.fopen(man.application)}.bind(this),
			content_css: 				'themes/window.css.php?themes=default&all=no&editor=yes',
			theme_advanced_buttons1 : 	"formatselect,styleselect,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,link,unlink,|,charmap",
			style_formats : [
				{title : 'Note', block : 'p', classes : 'note', exact : true},
				{title : 'Package', block : 'p', classes : 'download-file', exact : true}
			]
		});
		forms.Description.Value(man.Description);
		//
		// Statut
		//
		forms.Statut = new ToggleButton();
		forms.Statut.Value(man.Statut == 1);
		//
		// Table
		//
		var widget = new Widget();
		
		widget.Table = new TableData();
		widget.Table.setStyle('width:100%');
	
		widget.appendChild(forms.Title);	
		widget.appendChild(widget.Table);
		
		widget.Table.addHead($MUI('N° du manuel') + ' : ', {width:100}).addCel(man.Man_ID, {height:30}).addRow();
		widget.Table.addHead($MUI('Publié') + ' :').addCel(forms.Statut, {height:30});
		
		if(man.Man_ID == 0){
			widget.Table.getRow(0).hide();
		}else{
			widget.Table.getRow(0).show();
		}
		
		win.appendChild(widget);
		win.appendChild(forms.Description);
		
		win.footer.appendChilds([forms.submit, forms.reset]);
				
		$S.fire('manuel:open', win);
						
		new FooterInteract(win, {
			manuelid: 20,
			incident: 'Manuel - Editeur de manuel'
		});
				
		forms.Description.load();
	}
});
/** section: Core
 * class Manuel
 * Gestion d'une page du manuel.
 **/
var Manuel = Class.create();
Manuel.prototype = {
/**
 * Manuel.Crash_ID -> Number
 **/
	Man_ID:				0, 	 	 	 	 	 	 	 
/**
 * Manuel.Application_ID -> Number
 **/
	Application_ID:		0,
/**
 * Manuel.Name_Application -> Number
 **/
	Parent_ID:			0,
/**
 * Manuel.Title -> String
 **/
	Title:				'',
/**
 * Manuel.Description -> String
 **/	
	Description:		'',
/**
 * Manuel.Level -> Number
 **/	
	Level:				0,
/**
 * Manuel.Version -> String
 **/
	Version:			'',
/**
 * Manuel.Statut -> Number
 **/
	Statut:				0,		
/**
 * new Manuel([obj])
 *
 * Cette méthode créée une nouvelle instance d'Application à partir du paramètre `obj` si ce dernier existe.
 **/
	initialize: function(obj){
				
		if(!Object.isUndefined(obj)){
			this.setObject(obj);
		}
	},
/**
 * Manuel.clone() -> Periode
 **/
	clone: function(){
		var obj = new Manuel({
			Man_ID:				this.Man_ID,
			Parent_ID:			this.Parent_ID,
			Application_ID:		this.Application_ID,
			Title:				this.Title,
			Description:		this.Description,
			Level:				this.Level,
			Statut:				this.Statut
		});
				
		return obj;
	},
/**
 * Manuel.get(callback [, options]) -> void
 *
 * Cette méthode récupère un manuel de l'application depuis le serveur principal Javalyss.
 **/
	get: function(callback, options){
		$S.trace(options)
		$S.exec('system.manuel.get', {
			parameters: "Man_ID=" + this.Man_ID + "&options=" + escape(Object.toJSON(options || {})),
			onComplete: function(result){
				try{
					this.evalJSON(result.responseText);
					if(Object.isFunction(callback)) callback.call(this, this);
				}catch(er){
					if(Object.isFunction(callback)) callback.call(this, false);
				}
			}.bind(this)
			
		});
	},
/**
 * Manuel.commit(callback) -> void
 **/
	commit: function(callback){

		$S.exec('application.manuel.commit', {
			
			parameters: "Manuel=" + this.toJSON(),
			onComplete: function(result){
				this.evalJSON(result.responseText);
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});
	},
/**
 * Manuel.remove(callback) -> void
 **/
	remove: function(callback){
		$S.exec('application.manuel.delete',{
			parameters: 'Manuel=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	},
/**
 * Manuel.evalJSON(json) -> void
 **/
	evalJSON: function(json){
		this.setObject(json.evalJSON());
	},
/**
 * Manuel.toJSON() -> String
 **/
	toJSON: function(){
		var obj = {
			Man_ID:				this.Man_ID,
			Parent_ID:			this.Parent_ID,
			Application_ID:		this.Application_ID,
			Title:				encodeURIComponent(this.Title),
			Description:		encodeURIComponent(this.Description),
			Level:				this.Level,
			Statut:				this.Statut
		};
		return escape(Object.toJSON(obj));
	},
/**
 * Manuel.toJSON() -> String
 **/
	setObject: function(obj){
		for(var key in obj){
			this[key] = obj[key];	
		}
		
		return this;
	}	
};
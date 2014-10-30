/** section: Core
 * class System.CrashRepport
 * Gestion des applications et des distributions du logiciel Javalyss Client.
 **/
System.CrashRepport = System.crashrepport = Class.createAjax({
/**
 * System.CrashRepport#Crash_ID -> Number
 **/
	Crash_ID:			0,
/**
 * System.CrashRepport#Name -> Number
 **/
	Name:				'',
/**
 * System.CrashRepport#Name_Application -> Number
 **/
	Email:				'',
/**
 * System.CrashRepport#Function -> String
 **/
	Function:			'',
/**
 * System.CrashRepport#Conclusion -> String
 **/	
	Conclusion:			'',
/**
 * System.CrashRepport#Description -> String
 **/	
	Description:		'',
/**
 * System.CrashRepport#Version -> String
 **/
	Version:			'',
/**
 * System.CrashRepport#Statut -> Number
 **/
	Statut:				0,
/**
 * new System.CrashRepport([obj])
 *
 * Cette méthode créée une nouvelle [[System.CrashRepport]].
 **/
	initialize: function(obj){
				
		if(!Object.isUndefined(obj)){
			this.setObject(obj);
		}
		
		this.Email = $U().EMail;
	},
/**
 * System.CrashRepport#commit(callback) -> System.CrashRepport
 * - callback (Function): Fonction appelée après que la reqête AJAX soit terminée.
 *
 * Cette méthode enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback){
		$S.exec('system.crash.send', {
			parameters: "CrashRepport=" + this.toJSON(),
			onComplete: callback
		});
		
		return this;	
	}
});

Object.extend(System.CrashRepport, {
/**
 * System.CrashRepport.create(fn [, options]) -> Window
 * - fn (String): Nom de la fonctionnalité.
 * - options (Object): Option de configuration du rapport d'erreur.
 *
 * Cette méthode permet de créer un nouveau rapport d'erreur rencontré dans l'application.
 *
 * #### Paramètre options
 *
 * Le paramètre `options` permet de configurer les informations supplémentaire du rapport d'erreur. Les attributs sont les suivants :
 *
 * * `name`: Nom de l'application ou d'extension cible. (Par défaut, name prend la valeur du nom de l'application et non celle de l'extension).
 * * `version`: Version cible du crash.
 *
 **/	
	create: function(fn, options){
		//
		// Crash
		//
		var crash = new System.CrashRepport();
		
		crash.Name = 		$S.NAME_VERSION;
		crash.Version =		$S.VERSION;
		crash.Function =	fn;
		
		if(!Object.isUndefined(options)){
			crash.Name = 		options.name || $S.CORE_BASENAME;
			crash.Version = 	options.version || $S.VERSION;
		}
		
		//
		// Window
		//
		var win = new Window();
		win.Resizable(false);
		win.Cacheable(false);
		win.setIcon('alert');
		win.ChromeSetting(true);
		win.NoChrome(true);
		win.createHandler($MUI('Envoi du rapport en cours') + '...', true);
		win.createBox();
		win.createFlag();
		win.crash = crash;
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Envoi de rapport d\'erreurs'), $MUI('Veuillez remplir le formulaire suivant concernant l\'erreur rencontrée. Le rapport sera ensuite analysé par l\'équipe de l\'application et corrigé dans les plus brefs délais.'));
		splite.setIcon('alert-48');
		splite.setStyle('width:550px');
		//
		// forms
		//
		var forms = {};
		win.forms = forms;
		win.crash = crash;
		//
		//
		//
		forms.submit = new SimpleButton({text:$MUI('Envoyer'), icon:'mail-forward'});	
		//
		// Panel
		//
		var panel = new Panel({background:'alert'});
		panel.appendChilds( [
			splite,
			this.createWidgetInfo(win),
			this.createWidgetText(win)
		]);
		
		win.Footer().appendChild(forms.submit);
		
		win.appendChild(panel);
		$Body.appendChild(win);
		
		win.centralize();
		
		forms.submit.on('click',function(){
			this.submit(win);
		}.bind(this))
			
		return win;	
	},
/**
 * System.CrashRepport.createWidgetInfo(win) -> Widget
 **/	
	createWidgetInfo: function(win){
		//
		//
		//
		var widget = new Widget();
		widget.setIcon('documentinfo');
		widget.Title($MUI('Détails du rapport'));
		//
		//
		//
		var table = new TableData();
		table.setStyle('width:100%');
		table.addHead($MUI('Fonction') + ' :', {width:100}).addField(win.crash.Function).addRow();
		table.addHead($MUI('Logiciel') + ' :').addField(win.crash.Name).addRow();
		table.addHead($MUI('Version') + ' :').addField(win.crash.Version);
		
		widget.Table = table;
		widget.appendChild(table);
		
		return widget;
	},
/**
 * System.CrashRepport.createWidgetText(win) -> Widget
 **/	
	createWidgetText: function(win){
		var widget = new WidgetTextArea();
		widget.setIcon('file-edit');
		widget.Title($MUI('Description du problème'));
		widget.Body().setStyle('height:300px');
		widget.TextArea.placeholder = $MUI('Saisissez la description de votre problème') + '...';
		win.forms.Description = widget.TextArea;
		return widget;
	},
/**
 * System.CrashRepport.createHandler(fn, options) -> Function
 * - fn (String): Nom de la fonctionnalité.
 * - options (Object): Option de configuration du rapport d'erreur.
 *
 * Cette méthode permet de créer un nouveau rapport d'erreur rencontré dans l'application et retourne une fonction pouvant être appellé au clique d'un élément
 * de type bouton.
 **/	
	createHandler: function(fn, options){
		var sender = this;
		return function(){sender.create(fn, options)};	
	},
/**
 * System.CrashRepport.submit(win) -> void
 * - win (Window): Instance Window.
 *
 * Valide et enregistre le formulaire.
 **/
	submit: function(win){
		win.Flag.hide();
		
		if(win.forms.Description.value == ''){
			win.Flag.setText($MUI('Le rapport doit contenir une description')).setType(FLAG.RIGHT).show(win.forms.Description, true);
			return;
		}
		
		var evt = new StopEvent(win);
		
		$S.fire('crash:create.submit', evt);
		
		if(evt.stopped) return;		
		
		win.crash.Description = win.forms.Description.value;
		
		win.ActiveProgress();
		
		win.crash.commit(function(result){
			
			try{
				var obj = result.responseText.evalJSON();
			}catch(er){
				var splite = new SpliteWait($MUI('Le rapport n\'a pu être envoyé au serveur Javalyss'), $MUI('Des problèmes de connexion peuvent être à l\'origne de cette erreur. Patientez un instant et renvoyer votre rapport')+'.');
				
				splite.setStyle('max-width:400px');	
				win.AlertBox.a(splite).setType('NONE').Timer(3).show();
				return;	
			}
			
			var splite = new SpliteIcon($MUI('Le rapport a bien été enregistré'), $MUI('L\'équipe de l\'application vous remercie d\'avance et traitera votre rapport dans les plus brefs delais')+'.');
			splite.setIcon('filesave-ok-48');
			splite.setStyle('max-width:400px');	
			
			win.close();
			
			$S.AlertBox.a(splite).setType('NONE').Timer(5).show();
		});
	}
});
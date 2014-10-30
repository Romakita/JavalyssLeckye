/** section: UI
 * class MinWin < SimpleMenu
 * Gestionnaire des miniatures d'une fenêtre pour la barre des tâches.
 **/
var MinWin = Class.createSprite('span');
MinWin.prototype = {
	__class__:	'minwin',
	className:	'',
/**
 * MinWin#SimpleMenu -> SimpleMenu
 * Menu appartenant à la miniature.
 **/
	SimpleMenu:	null,
/**
 * MinWin#window -> Window
 * Référence vers la fenêtre de la miniature.
 **/
	window:		null,
/**
 * new MinWin(win)
 *
 * Cette méthode créée une nouvelle miniature associée à une fenêtre [[MinWin]].
 **/
	initialize: function(win){
		
		Object.extend(this, SimpleMenu.prototype);
		
		this.initialize();
		this.addClassName('minwin');
		
		this.window = win;

		this.SimpleMenu =		this;
		//new SimpleMenu({icon:this.window.getIcon()});
		var line = 				new LineElement();
		
		line.setText($MUI('Fermer')).setIcon('cancel');
		line.on('click',function(){
			try{
				this.close();
			}catch(er){
				this.forceClose();
			}
		}.bind(this.window));
		
		this.appendChild(line);
		this.setIcon(this.window.getIcon());
		this.SimpleButton.on('click', this.onClick.bind(this));
	},
/*
 * MinWin#onClick() -> void
 **/	
	onClick: function(evt){
		evt.stop();
		this.window.Hidden(false);
	},
/**
 * MinWin#addLine(title, options) -> LineElement
 * - title (String): Titre de la ligne.
 * - func (Function): Fonction appelée au clique.
 * - options (Object): Objet de configuration.
 *
 **/
	addLine: function(line, arg2, arg3, arg4){
				
		//verification du type pour le paramètre line
		var le;
		var options = {
			isSection:	false,
			border:		false,
			bold:		false,
			lite:		false,
			icon:		'',
			color:		false,
			title:		'',
			enable:		true
		};
		
		switch(typeof(line)){
			default:
			case 'object':
				if(line.__class__ == 'lineelement'){
					le = line;
					line = line.getText();
				}
				else {
					
					le = new LineElement(line);
					
					if(Object.isElement(line)){
						le.appendChild(line);
					}
					line += "";
				}
				
				break;
			case 'string':
				le = new LineElement();
				le.setText(line);		
		}
		
		//vérification du type pour le paramètre arg2
		switch(typeof arg2){
			case 'object': 	arg3 = arg2;
							break;
			case 'function': le.observe('click', arg2);
		}
		
		//vérification du type pour le paramètre arg3
		if(!Object.isUndefined(arg3)){
			Object.extend(options, arg3);
			
			le.Border(options.isSection || options.border);
			le.Bold(options.bold);
			le.setIcon(options.icon || options.icons);
			
		}else arg3 = {};

		
		if(Object.isUndefined(arg3.position))	this.appendChild(le);
		else{	
			if(arg3.position == 0 || arg3.position == 'top') arg3.position =  0;
			this.addChildAt(le, arg3.position);
		}

		return le;
	}
};
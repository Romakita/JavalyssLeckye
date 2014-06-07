/** section: Core
 * class BlockInteract
 * 
 * Cette classe permet d'afficher un block d'aide + incident dans les menus de type Rubban
 **/
 
/**
 * new BlockInteract(win, options)
 *
 * Cette méthode créée une nouvelle instance de BlockInteract.
 **/
function BlockInteract(win, obj){
	
	var options = {
		manuelid: 	0,
		incident: 	false,
		options:	{name:$S.CORE_BASENAME, version:$S.VERSION}
	};
	
	if(!Object.isUndefined(obj)){
		Object.extend(options, obj);
	}
	
	win.createFlag();
	//
	// Block
	//
	var bl = new BlockMenu();
	bl.setStyle('float:right');
/**
 * BlockInteract.Incident -> SimpleButton
 * Bouton menant vers le formulaire d'incident.
 **/
	bl.Incident = 	new SimpleButton({icon:'alert'});
/**
 * BlockInteract.Incident -> SimpleButton
 * Bouton menant vers la fenêtre du manuel utilisateur.
 **/
	bl.Help =		new SimpleButton({icon:'documentinfo'});
	
	if(options.manuelid != 0){
		bl.Help.on('click', $S.Man.createHandler(options.manuelid), options.options);		
	}else{
		bl.Help.setStyle('display:none');
	}
	
	if(options.incident){
		bl.Incident.on('click', $S.CrashRepport.createHandler(options.incident, options.options));
	}else{
		bl.Incident.setStyle('display:none');
	}
		
	bl.Incident.on('mouseover', function(){
		win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Rapporter un incident') + '</p>').color('grey').setType(FLAG.LEFT).show(this, true);
	});
	
	bl.Help.on('mouseover', function(){		
		win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Afficher l\'aide en ligne') + '</p>').color('grey').setType(FLAG.LEFT).show(this, true);
	});
	
	bl.appendChild(bl.Help);
	bl.appendChild(bl.Incident);
	
	win.DropMenu.addBlockMenu(bl);
	
	return bl;
};
/**
 * new MenuInteract(win, options)
 *
 * Cette méthode créée une nouvelle instance de MenuInteract.
 **/
function MenuInteract(win, obj){
	
	var options = {
		manuelid: 	0,
		incident: 	false,
		options:	{name:$S.CORE_BASENAME, version:$S.VERSION}
	};
	
	if(!Object.isUndefined(obj)){
		Object.extend(options, obj);
	}
	
	win.createFlag();
/**
 * MenuInteract.Incident -> SimpleButton
 * Bouton menant vers la fenêtre du manuel utilisateur.
 **/
	//this.Help =			win.DropMenu.addMenu($MUI('Aide'), {icon:'documentinfo'})
/**
 * MenuInteract.Incident -> SimpleButton
 * Bouton menant vers le formulaire d'incident.
 **/
	this.Incident = 	win.DropMenu.addMenu($MUI('Incidents'), {icon:'alert'}).setText(''); 
	
	if(options.manuelid != 0){
		//this.Help.on('click', $S.Man.createHandler(options.manuelid), options.options);		
	}else{
		//this.Help.setStyle('display:none');	
	}
	
	if(options.incident){
		this.Incident.on('click', $S.CrashRepport.createHandler(options.incident, options.options));
	}else{
		this.Incident.setStyle('display:none');
	}
/*		
	this.Incident.on('mouseover', function(){
		win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Rapporter un incident') + '</p>').color('grey').setType(FLAG.LB).show(this, true);
	});
	
	this.Help.on('mouseover', function(){		
		win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Afficher l\'aide en ligne') + '</p>').color('grey').setType(FLAG.LB).show(this, true);
	});
	*/
};
/** section: Core
 * class TabControlInteract
 * 
 * Cette classe permet d'afficher un block d'aide + incident dans une instance [[TabControl]] d'une fenêtre.
 **/

/**
 * new TabControlInteract(win, tabcontrol, options)
 *
 * Cette méthode créée une nouvelle instance de FooterInteract.
 **/
function TabControlInteract(win, tc, obj){

	var options = {
		manuelid: 	0,
		incident: 	false,
		options:	{name:$S.CORE_BASENAME, version:$S.VERSION},
		node:		false
	};
	
	if(!Object.isUndefined(obj)){
		Object.extend(options, obj);
		if(options.options.Name) options.options.name = 		options.options.Name;
		if(options.options.Version) options.options.version = 	options.options.Version;
	}
	
	win.createFlag();
	
/**
 * TabControlInteract.Incident -> SimpleButton
 * Bouton menant vers le formulaire d'incident.
 **/
	this.Incident = 	new SimpleButton({icon:'alert'});
/**
 * TabControlInteract.Incident -> SimpleButton
 * Bouton menant vers la fenêtre du manuel utilisateur.
 **/
	//this.Help =			new SimpleButton({icon:'documentinfo', text:'Aide'});
	
	if(options.manuelid != 0){
	//	this.Help.on('click', $S.Man.createHandler(options.manuelid), options.options);		
	}else{
	//	this.Help.setStyle('display:none');	
	}
	
	if(options.incident){
		this.Incident.on('click', $S.CrashRepport.createHandler(options.incident, options.options));
	}else{
		this.Incident.setStyle('display:none');
	}
		
	this.Incident.on('mouseover', function(){
		win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Rapporter un incident') + '</p>').color('grey').setType(FLAG.BOTTOM).show(this, true);
	});
	
	//this.Help.on('mouseover', function(){		
		//win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Afficher l\'aide en ligne') + '</p>').color('grey').setType(FLAG.BOTTOM).show(this, true);
	//});
	
	//tc.Header().appendChild(this.Help);
	tc.Header().appendChild(this.Incident);
};
/** section: Core
 * class FooterInteract
 * 
 * Cette classe permet d'afficher un block d'aide + incident dans le pied de page d'une fenêtre.
 **/

/**
 * new FooterInteract(win, options)
 *
 * Cette méthode créée une nouvelle instance de FooterInteract.
 **/
function FooterInteract(win, obj){
	if(Object.isUndefined(obj)){
		obj = {node:win.footer};
	}else{
		obj.node = win.footer;
	}
	
	return new ButtonInteract(win, obj);
	
};
/** section: Core
 * class ButtonInteract
 * 
 * Cette classe permet d'afficher un block d'aide + incident.
 **/
 
/**
 * new ButtonInteract(win, options)
 *
 * Cette méthode créée une nouvelle instance de ButtonInteract.
 **/
function ButtonInteract(win, obj){
	
	var options = {
		manuelid: 	0,
		incident: 	false,
		options:	{name:$S.CORE_BASENAME, version:$S.VERSION},
		node:		false
	};
	
	if(!Object.isUndefined(obj)){
		Object.extend(options, obj);
	}
	
	win.createFlag();
	
/**
 * FooterInteract.Incident -> SimpleButton
 * Bouton menant vers le formulaire d'incident.
 **/
	this.Incident = 	new SimpleButton({icon:'alert'});
/**
 * BlockInteract.Incident -> SimpleButton
 * Bouton menant vers la fenêtre du manuel utilisateur.
 **/
	//this.Help =			new SimpleButton({icon:'documentinfo', text:'Aide'});
	
	if(options.manuelid != 0){
		//this.Help.on('click', $S.Man.createHandler(options.manuelid), options.options);		
	}else{
		//this.Help.setStyle('display:none');	
	}
	
	if(options.incident){
		this.Incident.on('click', $S.CrashRepport.createHandler(options.incident, options.options));
	}else{
		this.Incident.setStyle('display:none');
	}
		
	this.Incident.on('mouseover', function(){
		win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Rapporter un incident') + '</p>').color('grey').setType(FLAG.TOP).show(this, true);
	});
	
	//this.Help.on('mouseover', function(){		
	//	win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Afficher l\'aide en ligne') + '</p>').color('grey').setType(FLAG.TOP).show(this, true);
	//});
	
	if(options.node){
		//options.node.appendChild(this.Help);
		options.node.appendChild(this.Incident);	
	}else{
		win.appendChild(this.Help);
		win.appendChild(this.Incident);
	}
};

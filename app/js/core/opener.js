/** section: Core
 * System.Opener
 *
 * Gestionnaire d'ouverture de programme pour une même ressource.
 **/
System.Opener = Class.create({
/**
 * System.Opener#icon -> String
 *
 * Icône format 32x32 à afficher.
 **/	
	icon:	'',
/**
 * System.Opener#text -> String
 *
 * Texte à afficher en complément de l'icône.
 **/
	text:	'',
/**
 * System.Opener#click -> Function
 *
 * Fonction appelée lorsque l'utilisateur clique sur le programme.
 **/
	click:	'',
/**
 * System.Opener#onList -> Function
 *
 * Fonction appelée lorsque le gestionnaire cherche un programme pour ouvrir une ressource.
 **/	
	onList:	'',
	
	initialize:function(obj){
		if(!Object.isUndefined(obj)){
			Object.extend(this, obj);
		}
	}
});

Object.extend(System.Opener, {
	
	stacks: {},
/**
 * System.Opener.initialize() -> void
 **/
	initialize:function(){
		
		System.Opener.add('mailto', {
			text: 	'Editeur d\'e-mail par défaut',
			icon:	'system-windows-32',
			click:	function(mail){
				if(Object.isArray(mail)){
					mail = mail.join(',');
				}
				window.location = 'mailto:' + mail;	
			},
			
			onList:	function(){
				return false;
			}
		});
		
		System.Opener.add('tel', {
			text: 	'Application de bureau Windows',
			icon:	'system-windows-32',
			
			click:	function(o){
				if(Object.isArray(o)){
					o = o.join(',');
				}
				window.location = 'tel:' + o;	
			},
			
			onList:	function(){
				return false;
			}
		});
		
		/*System.Opener.add('tel', {
			text: 	'Skype (audio)',
			icon:	'system-skype-32',
			
			click:	function(o){
				alert('skype:' + o + '?call');
				window.location = 'skype:romakita?call';	
			},
			
			onList:	function(){
				return false;
			}
		});
		
		System.Opener.add('tel', {
			text: 	'Skype (vidéo)',
			icon:	'system-skype-video-32',
			
			click:	function(o){
				window.location = 'skype:' + o + '?call&video=true';	
			},
			
			onList:	function(){
				return false;
			}
		});*/
	},
/**
 * System.Opener.add(key, opener) -> void
 * - key (String): Nom unique.
 * - opener (Object | System.Opener): Information sur l'application.
 * 
 **/	
	add:function(key, obj){
		
		var opener = new System.Opener(obj);
		
		if(Object.isUndefined(this.stacks[key])){
			this.stacks[key] = [];
		}
		
		this.stacks[key].push(opener);
	},
/**
 * System.Opener.open(key, data) -> void
 *
 * 
 **/	
	open:function(key){
		try{
		var args = $A(arguments);
		var args2 = [];
		
		for(var i = 1; i < args.length; i++){
			args2.push(args[i]);	
		}
		
		if(Object.isUndefined(this.stacks[key])){
			return;
		}
		
		var array = 	[];
		
		this.stacks[key].each(function(opener){
			
			if(!Object.isFunction(opener.click)){
				return;
			}
			
			if(Object.isFunction(opener.onList)){
				if(opener.onList.apply(null, args2)){
					return;	
				}
			}
			
			array.push(opener);
		});
				
		var box = System.AlertBox;
		var node = new Node('ul', {className:'area-input system-wrap-opener'});
		
		array.each(function(opener){
			var line = new LineElement(opener);
			line.Large(true);
			line.on('click', function(){
				box.hide();
				box.setTheme();
				opener.click.apply(null, args2);
			});	
			
			node.appendChild(line);
		});
		
		if(array.length == 1){
			array[0].click.apply(null, args2);
			return;	
		}
		
		var html = new HtmlNode();
		html.css('padding', 0).css('margin', 'auto').css('width', '400px');
		html.append('<h4>' + $MUI('Choix de l\'application') + '</h4>');
		html.append('<p style="padding-left:0px">' + $MUI('Plusieurs applications existent pour ouvrir ces données. Veuillez en choisir une :') + '</p>');
		
		box.setTheme('flat white liquid');
		box.a(html).a(node).setType('CLOSE').show();
		}catch(er){alert(er)}
	}
});

System.Opener.initialize();
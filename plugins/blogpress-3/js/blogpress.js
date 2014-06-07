/** section: BlogPress
 * class BlogPress
 *
 * Cet espace de nom gère l'extension System.BlogPress.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : blogpress.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
Import('plugins.inputrecipient');

System.BlogPress = System.blogpress = {
/**
 * new System.Blogpress()
 **/
	initialize: function(){
		
		$S.observe('system:startinterface', this.startInterface.bind(this));
		
	},
/**
 * System.Blogpress.startInterface() -> void
 **/
 	startInterface:function(){
		
		$S.DropMenu.addMenu($MUI('BlogPress'), {
			icon:		'blogpress',
			appName:	'BlogPress'
		}).on('click', function(){this.open()}.bind(this));	
		
		$S.fire('blogpress:startinterface');	
	},
/**
 * System.jGalery.open() -> void
 **/
	open:function(type){
		var win = $WR.unique('blogpress', {
			autoclose:	false
		});
		
		//on regarde si l'instance a été créée
		if(!win) {
			var win = $WR.getByName('blogpress');
			win.Hidden(false);
			return win;
		}
		win.Resizable(false);
		win.ChromeSetting(true);
		win.NoChrome(true);
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();	
		win.MinWin.setIcon('blogpress');
		win.addClassName('blogpress');
		//
		// TabControl
		//
		win.appendChild(this.createPanel(win));
		
				
		document.body.appendChild(win);
		
		$S.fire('blogpress3:open', win);
		
		win.Fullscreen(true);
		win.moveTo(0,0);
		
		switch(type){
			default:
			case 'post':
				System.BlogPress.Post.listing(win);
				break;
			case 'page':
				System.BlogPress.Page.listing(win);
				break;
			case 'comment':
				System.BlogPress.Comment.listing(win);
				break;
		}
				
		return win;
	},
	
	openFromSearch:function(data){
		if(data.Type == 'page'){
			System.BlogPress.Page.open(data);	
		}
		
		if(data.Type == 'post'){
			System.BlogPress.Post.open(data);	
		}
	},
/**
 * Contact.createPanel(win) -> Panel
 * Cette méthode créée le panneau de gestion du catalogue.
 **/
 	createPanel: function(win){
		
		var panel = new System.jPanel({
			title:			'BlogPress',
			search:			false,
			//placeholder:	$MUI('Rechercher'),
			style:			'width:900px',
			//parameters:		'cmd=blogpress.post.list&options=' + Object.EncodeJSON({draft:true}),
			icon:			'blogpress-32',
			menu:			false
		});
		
		win.BlogPress = panel;
		var self =	this;
		panel.addClassName('blogpress');
		panel.setTheme('grey flat');
		panel.Progress.addClassName('splashscreen');
		
		//
		//
		//
		var btnAddPage = new SimpleButton({icon:'add-menu-element', text:$MUI('Créer page')});
		btnAddPage.on('click', function(){
			try{
				System.BlogPress.Page.listing(win);
			}catch(er){}
			
			System.BlogPress.Page.open(win);
		});
		//
		//
		//
		var btnAddPost = new SimpleButton({icon:'add-menu-element', text:$MUI('Créer article')});
		btnAddPost.on('click', function(){
			try{
				System.BlogPress.Post.listing(win);
			}catch(er){}
			
			System.BlogPress.Post.open(win);
		});
		//
		//
		//
		var btnPosts = new SimpleButton({icon:'edit-post', text:$MUI('Articles')});
		btnPosts.addClassName('post selected tab');
		btnPosts.on('click', function(){
			System.BlogPress.Post.listing(win);
		});
		//
		//
		//
		var btnPages = new SimpleButton({icon:'edit-page', text:$MUI('Pages')});
		btnPages.addClassName('page tab');
		btnPages.on('click', function(){
			System.BlogPress.Page.listing(win);
		});
		//
		//
		//
		var btnCommentaire = this.BtnComments = new SimpleButton({icon:'edit-commentaire', text:$MUI('Commentaires')});
		btnCommentaire.addClassName('comment tab');
		btnCommentaire.on('click', function(){
			System.BlogPress.Comment.listing(win);
		});
		
		if(System.BlogPress.Comment.CurrentDraft){
			btnCommentaire.setTag(System.BlogPress.Comment.CurrentDraft);
		}
		//
		//
		//
		var btnLink = new SimpleButton({icon:'edit-links', text:$MUI('Mes liens')});
		btnLink.on('click', function(){
			System.BlogPress.Link.listing(win);
		});
		btnLink.addClassName('link tab');
		//
		//
		//
		var btnAppearance = new SimpleButton({icon:'edit-appearance', text:$MUI('Apparence')});
		btnAppearance.on('click', function(){
			System.BlogPress.Template.listing(win);
		});
		btnAppearance.addClassName('template tab');
		//
		//
		//
		var btnSetting = 	new SimpleButton({icon:'edit-setting', text:$MUI('Configuration')});
		btnSetting.addClassName('setting');
		
		btnSetting.on('click', function(){
			System.BlogPress.Setting.open();
		});
		
		panel.Header().appendChild(btnAddPost);
		panel.Header().appendChild(btnAddPage);
		panel.Header().appendChild(btnPosts);
		panel.Header().appendChild(btnPages);
		panel.Header().appendChild(btnCommentaire);
				
		if($U().getRight() != 3){
			panel.Header().appendChild(btnLink);
			panel.Header().appendChild(btnAppearance);		
			panel.Header().appendChild(btnSetting);
		}
				
		return panel;
	},
/**	
 *
 **/
	setCurrent:function(name){
		var win = $WR.getByName('blogpress');
		var panel = win.BlogPress;
		
		panel.Header().select('.selected').invoke('removeClassName', 'selected');
		panel.Header().select('.simple-button.' + name).invoke('addClassName', 'selected');
		
		panel.clearAll();
		win.CurrentName = name;
				
		panel.Open(false);
		win.destroyForm();
		
		/*switch(name){
			case 'product':
				
				break;
				
			case 'menu':
								
				break;
			case 'segmentation':
				
				break;
			case 'matter':
				
				break;
			case 'color':
				
				break;
		}*/
	}
};

System.BlogPress.initialize();
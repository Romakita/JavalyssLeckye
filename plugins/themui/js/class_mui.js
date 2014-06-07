/** section: BlogPress
 * class TheMUI
 * Cette classe gère l'édition des pages.
 *  
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_pages.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
var TheMUI = Class.create();

TheMUI.prototype = {
	
	options: [
		{icon: 'gb-flag', text:$MUI('Anglais'), value: 'en'},
		{icon: 'de-flag', text:$MUI('Allemand'), value: 'de'},
		{icon: 'cn-flag', text:$MUI('Chinois'), value: 'zh'},
		{icon: 'es-flag', text:$MUI('Espagnol'), value: 'es'},
		{icon: 'fr-flag', text:$MUI('Français'), value: 'fr'},
		{icon: 'it-flag', text:$MUI('Italien'), value: 'it'},
		{icon: 'jp-flag', text:$MUI('Japonais'), value: 'ja'},
		{icon: 'pt-flag', text:$MUI('Portugais'), value: 'pt'}
	],
/**
 * new BpMUI()
 **/
	initialize: function(){
		$S.blogpress.mui = this;
		/*		
		$S.observe('blogpress:page.submit.complete', function(){
			var win = $WR.getByName('blogpress.form');
			if(win){
				win.loadPages();	
			}
		}.bind(this));
			
		$S.observe('blogpress:page.remove.complete', function(){//lorsque l'on supprime une entrée.
			var win = $WR.getByName('blogpress.form');
			if(win){
				win.loadPages();	
			}
		}.bind(this));*/
		
		$S.observe('blogpress:page.open', this.onOpenPage.bind(this));
		//$S.observe('blogpress:page.submit', this.onSubmitPage.bind(this));
	},
/**
 * BpMUI.startInterface() -> void
 **/	
	startInterface:function(){},
/**
 * BpMUI.onOpenPage() -> void
 **/	
	onOpenPage: function(win){
		if(!win.post.Meta.MUICHILD){
			win.TabControl.addPanel($MUI('MUI'), this.createPanel(win)).setIcon('themui-24');
		}
	},
/**
 * BpMUI.createPanel() -> void
 **/	
	createPanel:function(win){
		var panel = 	new Panel({background:'themui', style:'width:600px'});
		var splite =	new SpliteIcon($MUI('Gestion des pages multilingues'));
		splite.setIcon('themui-48');
		//
		//
		//
		var widget = new WidgetTable({
			range1:5000,
			range2:5000,
			range3:5000	,
			completer:false,
			readOnly:true
		});
		
		widget.Body().css('height', 300);
		widget.setTitle($MUI('Liste des pages MUI'));
		
		widget.addHeader({
			'text': 	{title:$MUI('Langue')},
			'action': 	{title:'', width:50, type:'action'}
		});		
			
		widget.addFilters('text', function(e, cel, data){
			var node = new HtmlNode();
			node.css('padding', 0);
			node.append('<h1 style="font-size:15px">' + e  + '</h1>');
			
			if(!win.post.Meta[data.value]){
				cel.parentNode.hide();
			}
			
			return node;
		});
		
		widget.on('open', function(evt, data){
			Post.Get(win.post.Meta[data.value], this.openPage.bind(this));
		}.bind(this));
		
		widget.addRows(this.options);
		//
		//
		//
		var add = new SimpleButton({icon:'add', text:$MUI('Créer page')});
		
		add.css('position', 'absolute').css('top', 15).css('right', 10);
		
		add.on('click', function(){
			var splite =	new SpliteIcon($MUI('Création d\'une nouvelle page MUI'), $MUI('Choisissez la langue de réfèrence de cette page' + ' :'));
			splite.setIcon('themui-48');
			splite.css('margin-bottom', '20px');
			//
			//
			//
			var mui = 		new Select();			
					
			mui.setData(this.createList(win));
			mui.selectedIndex(0);
			mui.css('width', '300');
			//
			// Box
			//
			var box = win.createBox();	
			box.as([splite, new Node('center', mui)]).setType().show();
			
			box.submit({
				text:	$MUI('Créer'),
				click:	function(){
					
					var post = 			win.post.clone();
					post.Post_ID = 		0;
					post.MUICHILD = 	true;
					post.Parent_ID =	win.post.Post_ID;
					post.Name =  		mui.Value() + '/' + win.post.Post_ID;
					
					box.hide();
					box.wait();
					
					post.commit(function(){
						box.hide();
						win.post.Meta[mui.Value()] = post.Post_ID;
						
						win.post.commit(function(){
							win.forms.deactive();
						});
						
						this.openPage(post);
								
						widget.addRows(this.options);
																				
					}.bind(this));
					
					return true;
				}.bind(this)
				
			});
				
		}.bind(this));
		
		panel.appendChild(splite);
		panel.appendChild(add);
		panel.appendChild(widget);
		
		return panel;
	},
	
	createList: function(win){
		var array = [];
		
		for(var i = 0; i < this.options.length; i++){
			if(win.post.Meta[this.options[i]]){
				continue;	
			}
			
			array.push(this.options[i]);
		}
		
		return array;
	},
	
	openPage: function(post){
		
		var muiwin = $S.blogpress.pages.open(post, {
			type:		'themui',
			instance:	'themui.page.form',
			icon:		'themui'
		});
				
		muiwin.Header().select('.simple-button')[1].hide();
		muiwin.Header().select('.simple-button')[2].hide();
		muiwin.forms.Name.parentNode.parentNode.hide(); 	
	}
};

new TheMUI();
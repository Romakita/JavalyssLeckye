/** section: BlogPress
 * System.BlogPress.Template
 *
 * Gestion des themes du site. 
 **/
System.BlogPress.Template = {
	
	Current:null,
/**
 *
 **/	
	initialize:function(){
		$S.exec('blogpress.template.get', function(result){
			try{
				System.BlogPress.Template.Current = result.responseText.evalJSON();
			}catch(er){}
		});
	},
/**
 *
 **/	
	Get:function(){
		return this.Current;
	},
	
	GetCssEditor:function(){
		if(this.Current){
			return this.Current.LinkCssEditor;
		}
		return '';
	},
/**
 * System.BlogPress.Template.listing(win) -> void
 **/	
	listing:function(win){
		
		var panel = win.BlogPress;
		
		System.BlogPress.setCurrent('template');
						
		panel.PanelBody.Header().appendChilds([
			
		]);
		
		this.load(win);
		
	},
/**
 * System.BlogPress.Template.listing(win) -> void
 **/	
	load:function(win){
		
		var panel = win.BlogPress;
		panel.Progress.show();
		
		var bubble = win.createBubble();
		
		$S.exec('blogpress.template.list', {
			
			onComplete:function(result){
				
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				panel.clearBody();
								
				try{		
				
					var letter = '';
					var i = 0;
					for(var key in obj){
						
						var button =	new System.BlogPress.Template.Button({
							text:			obj[key].Title,
							subTitle:		$MUI('Par') + ' <a href="'+obj[key].AuthorURI+'" target="_blank">' + obj[key].Author + '</a>',
							description:	obj[key].Description,
							overable:		false
						});
						
						button.addClassName('hide');
						button.data = obj[key];
						
						
						if(obj[key].Folder == ($S.Meta('BP_THEME') || 'javalyss')){
							button.Selected(true);
							button.setIcon(obj[key].Picture);
							
							panel.PanelBody.Body().top(button);
						}else{
							button.setIcon(obj[key].Preview);
							panel.PanelBody.Body().appendChild(button);
						}
						
						button.BtnEnable.on('click', function(evt){
							evt.stop();
							$S.Meta('BP_THEME', this.data.Folder);
							
							$$('.template-button.selected').each(function(e){
								e.setIcon(e.data.Preview);
								e.Selected(false);
							});
							
							this.setIcon(this.data.Picture);							
							this.Selected(true);
							
							System.BlogPress.Template.Current = this.data;
							
							panel.PanelBody.Body().top(this);
							
							
						}.bind(button));
						
						var html = new HtmlNode();
						html.append(obj[key].Description);
						
						bubble.add(button.BtnDetail,{
							duration:0,
							text: html
						});
						button.BtnRemove.hide();
						
						/*button.BtnRemove.on('click', function(evt){
							evt.stop();
							System.BlogPress.Page.remove(win, this.data);
						}.bind(button));
						*/
						i++;
					}	
					
					panel.PanelBody.refresh();
					
					new Timer(function(){
						var b = panel.PanelBody.select('.template-button.hide')[0];
						if(b){
							
							b.removeClassName('hide');
							b.addClassName('show');
						}
					}, 0.1, i).start();
					
										
				}catch(er){$S.trace(er)}
				
				if(panel.ProgressBar.hasClassName('splashscreen')){
					new Timer(function(){
						panel.ProgressBar.hide();
						panel.ProgressBar.removeClassName('splashscreen');
					}, 0.5, 1).start();
				}else{
					panel.ProgressBar.hide();
				}
			}.bind(this)
		});
	}
	
};

/** section: Core
 * class System.BlogPress.Template.Button
 **/
System.BlogPress.Template.Button = Class.from(AppButton);
System.BlogPress.Template.Button.prototype = {
	
	className:'wobject template-button overable',
/**
 * new System.MyStore.Product.Button([options])
 **/	
	initialize:function(obj){
		
		var options = {
			comment: 		0,
			note:			0,
			nbNote:			0,
			subTitle:		'',
			description:	'',
			overable:		true,
			tag:			false
		};
		
		Object.extend(options, obj || {});
		
		//
		//
		//
		this.SubTitle = new Node('span', {className:'wrap-subtitle'});
		this.SubTitle.innerHTML = options.subTitle;
		//
		//
		//
		this.Description = new Node('div', {className:'wrap-description html-node'});
		this.Description.innerHTML = options.description;
		//
		//
		//
		this.BtnRemove = new SimpleButton({nofill:true, icon:'remove-element-2'});
		this.BtnRemove.addClassName('btn-remove');
		//
		//
		//
		this.BtnEnable = new SimpleButton({nofill:true, text:$MUI('Activer')});
		this.BtnEnable.addClassName('btn-enable');
		//
		//
		//
		this.BtnDetail = new SimpleButton({nofill:true, text:$MUI('Détails')});
		this.BtnDetail.addClassName('btn-detail');
				
		this.appendChild(this.SubTitle);
		this.appendChild(this.Description);
		this.appendChild(this.BtnRemove);
		this.appendChild(this.BtnEnable);
		this.appendChild(this.BtnDetail);
		
		this.Overable(options.overable);
	},
/**
 * System.MyStore.Product.Button#setSubTitle(price) -> System.MyStore.Product.Button
 **/	
	setSubTitle:function(title){
		this.SubTitle.innerHTML = $MUI(title);
		return this;
	},
	
	Overable:function(bool){
		this.removeClassName('overable');
		
		if(bool){
			this.addClassName('overable');	
		}
	}
};

System.BlogPress.Template.initialize();
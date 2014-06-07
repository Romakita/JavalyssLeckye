/** section: plugin
 * class ShareThis
 **/
var ShareThis = System.ShareThis = {
/**
 * new ShareThisUI()
 **/
	initialize: function(){
		$S.observe('blogpress:open', this.onOpenBlogPress.bind(this));
		
		$S.observe('system:open.settings', function(win){
			win.TabControl.addPanel($MUI('ShareThis'), System.ShareThis.createPanel(win)).setIcon('sharethis').on('click', function(){
				win.loadShareThis();
			});
		});
	},
/**
 *
 **/	
	onOpenBlogPress: function(win){
		
		if($U().getRight() <= 2){
			var button = win.TabControl.addPanel($MUI('ShareThis'), this.createPanel(win));
			button.setIcon('sharethis');
			button.on('click', function(){
				win.loadShareThis();
			});
		}
	},
/**
 *
 **/	
	createPanel:function(win){
		var panel = 		new Panel({style:'width:620px;height:600px;padding:0;', background: ''});
		panel.addClassName('sharethis-panel');
		//
		//Splite
		//
		var splite =	new SpliteIcon($MUI('Settings of ShareThis'));
		splite.setIcon('sharethis-48');
		splite.css('margin-top', '-20px;');
		
		var form = 		{};

		form.ShareThis_AUTO = 			new ToggleButton();
		form.ShareThis_AUTO.Value($S.Meta('ShareThis_AUTO') == 1);
		//
		//
		//
		form.ShareThis_FB = new ToggleButton();
		form.ShareThis_FB.Value($S.Meta('ShareThis_FB') == 1);
		//
		//
		//
		form.ShareThis_TWITTER = new ToggleButton();
		form.ShareThis_TWITTER.Value($S.Meta('ShareThis_TWITTER') == 1);
		//
		//
		//
		form.ShareThis_MYSPACE = new ToggleButton();
		form.ShareThis_MYSPACE.Value($S.Meta('ShareThis_MYSPACE') == 1);
		//
		//
		//
		form.ShareThis_LINKEDIN = new ToggleButton();
		form.ShareThis_LINKEDIN.Value($S.Meta('ShareThis_LINKEDIN') == 1);
		//
		//
		//
		form.ShareThis_GPLUS = new ToggleButton();
		form.ShareThis_GPLUS.Value($S.Meta('ShareThis_GPLUS') == 1);
		
		
		var table = new TableData();
		table.addHead($MUI('Auto include')).addCel(form.ShareThis_AUTO).addRow();
						
		panel.appendChild(splite);
		panel.appendChild(table);
				
		var tabcontrol = new TabControl();
		
		tabcontrol.addPanel('Facebook', this.createPanelFaceBook(win, form)).setIcon('facebook');
		tabcontrol.addPanel('Twitter', this.createPanelTwitter(win, form)).setIcon('twitter');
		tabcontrol.addPanel('MySpace', this.createPanelMySpace(win, form)).setIcon('myspace');
		tabcontrol.addPanel('LinkedIn', this.createPanelLinkedIn(win, form)).setIcon('linkedin');
		tabcontrol.addPanel('Google+', this.createPanelGPlus(win, form)).setIcon('google');
		tabcontrol.addPanel('Info', this.createPanelInfo(win, form)).setIcon('documentinfo');
		
		panel.appendChild(tabcontrol);
		
		win.loadShareThis = function(){
			tabcontrol.select(0);
		};
		
		var submit = new SimpleButton({text:$MUI('Save')});
		panel.appendChild(submit);
		
		
		form.ShareThis_AUTO.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Set Yes if you want a BlogPress including the ShareBar automaticaly in the post') + '</p>');
			win.Flag.color('grey').show(this, true);
		});
				
		submit.on('click', function(){
			
			$S.Meta('ShareThis_FB_OPTIONS', {
				HREF:			form.FB_HREF.Value(),
				APP_ID:			form.FB_APP_ID.Value(),
				SEND_BUTTON:	form.FB_SEND_BUTTON.Value() ? 1 : 0, 
				LAYOUT:			form.FB_LAYOUT.Value(), 
				WIDTH:			form.FB_WIDTH.Value(), 
				SHOW_FACES:		form.FB_SHOW_FACES.Value(), 
				ACTION:			form.FB_ACTION.Value(), 
				COLORSCHEMES:	form.FB_COLORSCHEMES.Value(), 
				FONT:			form.FB_FONT.Value(),
				APP_ID:			form.FB_APP_ID.Value(),
				PAGE_ID:		form.FB_PAGE_ID.Value(),
				ADMINS:			form.FB_ADMINS.Value(),
				TYPE:			form.FB_TYPE.Text(),
				IMAGE:			form.FB_IMAGE.Text()
			});
			
			$S.Meta('ShareThis_TWITTER_OPTIONS', {
				SIZE:			form.TWITTER_SIZE.Value(),
				COUNT:			form.TWITTER_COUNT.Value(),
				VIA:			form.TWITTER_VIA.Value(),
				RELATEDTO:		form.TWITTER_RELATEDTO.Value(),
				HASHTAGS:		form.TWITTER_HASHTAGS.Value(),
				DNT:			form.TWITTER_DNT.Value() ? 1 : 0
			});
			
			$S.Meta('ShareThis_MYSPACE_OPTIONS',{
				SIZE:			form.MYSPACE_SIZE.Value()
			});
			
			$S.Meta('ShareThis_LINKEDIN_OPTIONS', {
				COUNTER:		form.LINKED_COUNTER.Value()
			});
			
			$S.Meta('ShareThis_GPLUS_OPTIONS', {
				SIZE:			form.GPLUS_SIZE.Value(),
				ANNOTATION:		form.GPLUS_ANNOTATION.Value(),
				WIDTH:			form.GPLUS_WIDTH.Value()
			});
			
			$S.Meta('ShareThis_AUTO', form.ShareThis_AUTO.Value() ? 1 : 0);
			$S.Meta('ShareThis_FB', form.ShareThis_FB.Value() ? 1 : 0);
			$S.Meta('ShareThis_LINKEDIN', form.ShareThis_LINKEDIN.Value() ? 1 : 0);
			$S.Meta('ShareThis_TWITTER', form.ShareThis_TWITTER.Value() ? 1 : 0);
			$S.Meta('ShareThis_MYSPACE', form.ShareThis_MYSPACE.Value() ? 1 : 0);
			
			win.ActiveProgress();
			
			$S.Meta('ShareThis_GPLUS', form.ShareThis_GPLUS.Value() ? 1 : 0);
		});
		
		return panel;
	},
/**
 *
 **/	
	createPanelFaceBook: function(win, form){
		var panel = new Panel({style:'height:300px;'});
		
		var options = $S.Meta('ShareThis_FB_OPTIONS') || {
						HREF:			'',
						APP_ID:			'',
						PAGE_ID:		'',
						ADMINS:			'',
						SEND_BUTTON:	1, 
						LAYOUT:			'standard', 
						WIDTH:			450, 
						SHOW_FACES:		1, 
						ACTION:			'like', 
						COLORSCHEMES:	'white', 
						FONT:			'arial'
					};
					
		form.FB_HREF = new Input({type:'text', value:options.HREF || '', className:'icon-cell-edit'});
		form.FB_APP_ID = new Input({type:'text', value:options.APP_ID, className:'icon-cell-edit'});
		form.FB_PAGE_ID = new Input({type:'text', value:options.PAGE_ID, className:'icon-cell-edit'});
		form.FB_ADMINS = new Input({type:'text', value:options.ADMINS, className:'icon-cell-edit'});
		//
		//
		//
		form.FB_SEND_BUTTON = new ToggleButton();
		form.FB_SEND_BUTTON.Value(options.SEND_BUTTON == 1);
		//
		//
		//
		form.FB_LAYOUT = new Select();
		form.FB_LAYOUT.setData([
			{text:'standard', value:'standard'},
			{text:'button_count', value:'button_count'},
			{text:'box_count', value:'box_count'}
		]);
		
		form.FB_LAYOUT.Value(options.LAYOUT);
		//
		//
		//
		form.FB_WIDTH = new Input({type:'number', decimal:0, value:options.WIDTH, className:'icon-cell-edit'});
		//
		//
		//
		form.FB_SHOW_FACES = new ToggleButton();
		form.FB_SHOW_FACES.Value(options.SHOW_FACES == 1);
		//
		//
		//
		form.FB_ACTION = new Select();
		form.FB_ACTION.setData([
			{value:'like', text:'like'},
			{value:'recommend', text:'recommend'}
		]);
		
		form.FB_ACTION.Value(options.ACTION);
		//
		//
		//
		form.FB_COLORSCHEMES = new Select();
		form.FB_COLORSCHEMES.setData([
			{value:'white', text:'white'},
			{value:'dark', text:'dark'}
		]);
		
		form.FB_COLORSCHEMES.Value(options.COLORSCHEMES);
		//
		//
		//
		form.FB_FONT = new Select();
		form.FB_FONT.setData([
			{value:'arial', text:'arial'},
			{value:'lucida grande', text:'lucida grande'},
			{value:'segoe ui', text:'segoe ui'},
			{value:'tahoma', text:'tahoma'},
			{value:'trebuchet ms', text:'trebuchet ms'},
			{value:'verdana', text:'verdana'}
		]);
		
		form.FB_FONT.Value(options.FONT);
		
		//
		//
		//
		form.FB_TYPE = new Select();
		form.FB_TYPE.setData([
			{text:'activity'},
			{text:'actor'},
			{text:'album'},
			{text:'article'},
			{text:'athlete'},
			{text:'author'},
			{text:'band'},
			{text:'bar'},
			{text:'blog'},
			{text:'book'},
			{text:'cafe'},
			{text:'cause'},
			{text:'city'},
			{text:'company'},
			{text:'country'},
			{text:'director'},
			{text:'drink'},
			{text:'food'},
			{text:'game'},
			{text:'government'},
			{text:'hotel'},
			{text:'landmark'},
			{text:'movie'},
			{text:'musician'},
			{text:'non_profit'},
			{text:'politician'},
			{text:'product'},
			{text:'public_figure'},
			{text:'restaurant'},
			{text:'school'},
			{text:'song'},
			{text:'sport'},
			{text:'sports_league'},
			{text:'sports_team'},
			{text:'state_province'},
			{text:'tv_show'},
			{text:'university'},
			{text:'website'}
		]);
		form.FB_TYPE.Value(options.TYPE);
		
		form.FB_IMAGE = new InputButton({icon:'attach', sync:true});
		form.FB_IMAGE.Text(options.IMAGE);
		
		form.FB_IMAGE.SimpleButton.on('click', function(){
			$FM().join(null, function(file){
				form.FB_IMAGE.Text(file.uri);
				form.FB_IMAGE.Value(file.uri);
			});
		});
		//
		//
		//
		var table = new TableData();
		
		table.addHead($MUI('Enable') + ' Facebook', {style:'width:160px'}).addCel(form.ShareThis_FB).addRow();
		panel.appendChild(table);
		
		panel.appendChild(new Node('h4', $MUI('Like Button')));
			
		var table = new TableData();
		table.addHead($MUI('Default Url'), {style:'width:160px'}).addField(form.FB_HREF).addRow();
		table.addHead($MUI('Send Button')).addCel(form.FB_SEND_BUTTON).addRow();
		table.addHead($MUI('Layout style')).addField(form.FB_LAYOUT).addRow();
		table.addHead($MUI('Width')).addField(form.FB_WIDTH).addRow();
		table.addHead($MUI('Verb to display')).addField(form.FB_ACTION).addRow();
		table.addHead($MUI('Color scheme')).addField(form.FB_COLORSCHEMES).addRow();
		table.addHead($MUI('Font')).addField(form.FB_FONT).addRow();
		
		panel.appendChild(table);
		//
		//
		//
		panel.appendChild(new Node('h4', $MUI('Configure Open Graph Tags')));
		var table = new TableData();
		
		table.addHead($MUI('App ID'), {style:'width:160px'}).addField(form.FB_APP_ID).addRow();
		table.addHead($MUI('Page ID'), {style:'width:160px'}).addField(form.FB_PAGE_ID).addRow();
		table.addHead($MUI('Admins')).addField(form.FB_ADMINS).addRow();
		table.addHead($MUI('Type')).addField(form.FB_TYPE).addRow();
		table.addHead($MUI('Image')).addField(form.FB_IMAGE).addRow();
		
		panel.appendChild(table);
		
		return panel;
	},
/**
 *
 **/	
	createPanelTwitter: function(win, form){
		var panel = new Panel({style:'height:300px;'});
		
		var options = $S.Meta('ShareThis_TWITTER_OPTIONS') || {
						SIZE:			'standard',
						COUNT:			'none',
						VIA:			'',
						RELATEDTO:		'',
						HASHTAGS:		'',
						DNT:			0
					};
		
		//
		//
		//
		form.TWITTER_SIZE = new Select();
		form.TWITTER_SIZE.setData([
			{text:'medium', value:'medium'},
			{text:'large', value:'large'}
		]);
		
		form.TWITTER_SIZE.Value(options.SIZE);
		//
		//
		//
		form.TWITTER_COUNT = new Select();
		form.TWITTER_COUNT.setData([
			{text:'none', value:'none'},
			{text:'horizontal', value:'horizontal'},
			{text:'vertical', value:'vertical'}
		]);
		
		form.TWITTER_COUNT.Value(options.COUNT);
		//
		//
		//
		form.TWITTER_VIA = new Input({type:'text', value:options.VIA});
		//
		//
		//
		form.TWITTER_RELATEDTO = new Input({type:'text', value:options.RELATEDTO});
		//
		//
		//
		form.TWITTER_HASHTAGS = new Input({type:'text', value:options.HASHTAGS});
		//
		//
		//
		form.TWITTER_DNT =		new ToggleButton();
		form.TWITTER_DNT.Value(options.DNT == 1);
		
	
		var table = new TableData();
		table.addHead($MUI('Enable') + ' Twitter', {style:'width:160px'}).addCel(form.ShareThis_TWITTER).addRow();
		panel.appendChild(table);
				
		var table = new TableData();
		table.addHead($MUI('Size'), {style:'width:160px'}).addField(form.TWITTER_SIZE).addRow();
		table.addHead($MUI('Enable count')).addField(form.TWITTER_COUNT).addRow();
		table.addHead($MUI('Via')).addField(form.TWITTER_VIA).addRow();
		table.addHead($MUI('Related to')).addField(form.TWITTER_RELATEDTO).addRow();
		table.addHead($MUI('Hashtag')).addField(form.TWITTER_HASHTAGS).addRow();
		table.addHead($MUI('Unregister')).addCel(form.TWITTER_DNT).addRow();
		
		panel.appendChild(new Node('h3', $MUI('Tweet Button')));
		panel.appendChild(table);
		
		return panel;
	},
/**
 *
 **/	
	createPanelMySpace: function(win, form){
		var panel = new Panel({style:'height:300px;'});
		
		var options = $S.Meta('ShareThis_MYSPACE_OPTIONS') || {
						SIZE:			'16'
					};
		
		//
		//
		//
		form.MYSPACE_SIZE = new Select();
		form.MYSPACE_SIZE.setData([
			{text:'small', value:'16'},
			{text:'medium', value:'32'},
			{text:'large', value:'48'},
			{text:'small with "share" word', value:'share'},
			{text:'small with "share on MySpace"', value:'shareonmyspace'}
		]);
		
		form.MYSPACE_SIZE.Value(options.SIZE);
		
		var table = new TableData();
		table.addHead($MUI('Enable') + ' MySpace', {style:'width:160px'}).addCel(form.ShareThis_MYSPACE).addRow();
		panel.appendChild(table);	
			
		var table = new TableData();
		table.addHead($MUI('Size'), {style:'width:160px'}).addField(form.MYSPACE_SIZE).addRow();
		
		panel.appendChild(new Node('h3', $MUI('MySpace Button')));
		panel.appendChild(table);
		
		return panel;
	},
/**
 *
 **/	
	createPanelLinkedIn: function(win, form){
		var panel = new Panel({style:'height:300px;'});
		
		var options = 	$S.Meta('ShareThis_LINKEDIN_OPTIONS') || {
							COUNTER:	''
						};
		
		//
		//
		//
		form.LINKED_COUNTER = new Select();
		form.LINKED_COUNTER.setData([
			{text:'no count', value:''},
			{text:'horizontal', value:'right'},
			{text:'vertical', value:'top'}
		]);
		
		form.LINKED_COUNTER.Value(options.COUNTER);
		
		var table = new TableData();
		table.addHead($MUI('Enable') + ' LinkedIn', {style:'width:160px'}).addCel(form.ShareThis_LINKEDIN).addRow();
		panel.appendChild(table);
		
		
		var table = new TableData();
		table.addHead($MUI('Type'), {style:'width:160px'}).addField(form.LINKED_COUNTER).addRow();
		
		panel.appendChild(new Node('h3', $MUI('LinkedIn Button')));
		panel.appendChild(table);
		
		return panel;
	},
/**
 *
 **/	
	createPanelGPlus: function(win, form){
		var panel = new Panel({style:'height:300px;'});
		
		var options = 	$S.Meta('ShareThis_GPLUS_OPTIONS') || {
							SIZE:		'small',
							ANNOTATION:	'none',
							WIDTH:		450
						};
		
		//
		//
		//
		form.GPLUS_SIZE = new Select();
		form.GPLUS_SIZE.setData([
			{text:'small (15px)', value:'small'},
			{text:'medium (20px)', value:'medium'},
			{text:'standard (24px)', value:''},
			{text:'tall (60px)', value:'tall'}
		]);
		
		form.GPLUS_SIZE.Value(options.SIZE);
		//
		//
		//
		form.GPLUS_ANNOTATION = new Select();
		form.GPLUS_ANNOTATION.setData([
			{text:'none', value:'none'},
			{text:'bubble', value:'bubble'},
			{text:'inline', value:'inline'}
		]);
		
		form.GPLUS_ANNOTATION.Value(options.ANNOTATION);
		//
		//
		//
		form.GPLUS_WIDTH = new Input({type:'number', decimal:0, value:options.WIDTH});
		
				
		var table = new TableData();
		table.addHead($MUI('Enable') + ' Google+', {style:'width:160px'}).addCel(form.ShareThis_GPLUS).addRow();
		panel.appendChild(table);
			
		var table = new TableData();
		table.addHead($MUI('Size'), {style:'width:160px'}).addField(form.GPLUS_SIZE).addRow();
		table.addHead($MUI('Annotation')).addField(form.GPLUS_ANNOTATION).addRow();
		table.addHead($MUI('Width')).addField(form.GPLUS_WIDTH).addRow();
		
		panel.appendChild(new Node('h4', $MUI('Google+ Button')));
		panel.appendChild(table);
		
		panel.appendChild(new Node('h4', $MUI('Examples')));
				
		var html = 	new HtmlNode();
		html.css('padding', '0');
				
		html.append('<h5>' + $MUI('Button Sizes') + '</h5>');
		html.append('<img src="'+ $S.plugins.get('ShareThis').PathURI + 'images/gplus_array.png'  +'">');
		html.append('<h5>' + $MUI('Inline Annotation Widths') + '</h5>');
		html.append('<img src="'+ $S.plugins.get('ShareThis').PathURI + 'images/gplus_array2.png'  +'">');
		
		panel.appendChild(html);
		
		return panel;
	},	
/**
 *
 **/	
	createPanelInfo: function(win){
		var panel = new Panel({style:'height:300px;'});
		var html = 	new HtmlNode();
		html.css('padding', '0');
				
		html.append('<h3>' + $MUI('Include the ShareBar manually') + '</h3>');
		html.append('<p>' + $MUI('Paste this code for include the ShareBar in your template') + ' :</p>');
		html.append('<pre>&lt;article&gt;\n&lt;?php echo new ShareThis(); ?&gt;\n&lt;/article&gt;</pre>');
		
		html.append('<h3>' + $MUI('Optimize Google+') + '</h3>');
		html.append('<p>' + $MUI('Paste this code in html tag to maximize the sum to be shared') + ' :</p>');
		html.append('<pre>&lt;html itemscope itemtype="http://schema.org/Article"&gt;</pre>');
		
		
		panel.appendChild(html);
		
		
		
		return panel;
	}
};

MUI.addWords({
	'Save':			'Enregistrer',
	'Enable':		'Activer'
}, 'fr');

System.ShareThis.initialize();
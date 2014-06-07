/**
 * == Messenger ==
 **/

/**
 * class MessengerUI
 **/
var MessengerUI = Class.create();

MessengerUI.prototype = {
/**
 * MessengerUI.delay = 5
 **/
	delay:	5, 
	isBlur:	false,
/**
 * new MessengerUI()
 **/
 	initialize:function(){
		$S.observe('system:startinterface', this.startInterface.bind(this));
		
		$S.observe('room:submit.complete', function(){
			var win = $WR.getByName('messenger');
			if(win){
				win.loadRooms();
			}
		});
		
		$S.observe('room:remove.complete', function(){
			var win = $WR.getByName('messenger');
			if(win){
				win.loadRooms();
			}
		});
		
		$S.observe('user:account.open', this.onCreatePanelAccount.bind(this));
		$S.observe('user:account.submit', this.onSubmit.bind(this));
		
		this.lightbox = new LightBox();
		$Body.appendChild(this.lightbox);
		
		
	},
/**
 * MessengerUI.onCreatePanelAccount(win, panel) -> void
 * 
 **/	
	onCreatePanelAccount:function(win, panel){
		//
		// Messenger
		//
		win.forms.BgColor = new InputColor();
		win.forms.BgColor.Value($U("Messenger_Bg_Color") || "#FFF");
		//
		// Messenger
		//
		win.forms.TextColor = new InputColor();
		win.forms.TextColor.Value($U("Messenger_Text_Color") || "#000");
		//
		//
		//
		win.forms.resetColor = new SimpleButton({icon:'reload'});
		
		var table = panel.getElementsByClassName('table-data')[0];
		table.addHead(new Node('h3', $MUI('Messenger')), {colSpan:2}).addRow();
		table.addHead($MUI('Couleur du texte') +  ' : ').addField(win.forms.TextColor).addCel(win.forms.resetColor).addRow();
		table.addHead($MUI('Couleur d\'arrière plan') +  ' : ', {style:'width:130px'}).addField(win.forms.BgColor).addRow();
		
		
		win.forms.resetColor.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Réinitialise les couleurs de vos messages dans le messenger') + '</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		
		win.forms.resetColor.on('click', function(){
			win.forms.BgColor.Value('#FFF');
			win.forms.TextColor.Value('#000');
		});
	},
	
	onSubmit:function(evt){
		
		if(evt.target.forms.BgColor.Value() == '#FFFFFF' && evt.target.forms.TextColor.Value() =="#000000"){
			$U('Messenger_Bg_Color', '', true);
			$U('Messenger_Text_Color', '', true);
		}else{
			$U('Messenger_Bg_Color', evt.target.forms.BgColor.Value(), true);
			$U('Messenger_Text_Color', evt.target.forms.TextColor.Value(), true);
		}
	},
/**
 * MessengerUI.startInterface() -> void
 **/
 	startInterface: function(){
		this.Button = $S.DropMenu.addMenu($MUI('Messenger'), {icon:'messenger', appName:'Messenger'}).on('click', this.open.bind(this));
		//on indique que le plugin messenger c'est correctement lancé
		$S.fire('messenger:started', this);
		
		this.originalTitle = document.title;
	},
/**
 * MessengerUI.alertClose() -> void
 **/	
	alertClose: function(win, room){
		
		var room = new Room(room);
		try{
			room.timer.stop();
		}catch(er){}
		
		win.loadRooms();
		win.TabControl.removePanel(room.ui.Button.getID());
		win.TabControl.select(0);
		win.resizeTo('auto', document.stage.stageHeight);
		win.Editor.hide();	
		this.CurrentRoom = {Room_ID: -1};
			
		$S.fire('room:close', win, room);
		//
		//
		//
		var splite = new SpliteIcon($MUI('Le salon vient d\'être supprimé par son créateur'));
		splite.setIcon('documentinfo-48');
		var box = 		win.createBox();
		
		box.hide();
		
		splite.setStyle('width:400px');
		
		box.a(splite).setType('CLOSE').Timer(10).show();
	},
/**
 * MessengerUI.load() -> void
 **/	
	load: function(room){
		try{
			room.timer.stop();
		}catch(er){}
		
		room.ui.Users.load();
	},
/**
 * MessengerUI.startNotify() -> void
 **/	
	startNotify:function(win){
		win.AudioNotify.currentTime = 0;
		win.AudioNotify.play();
		var toggle = false;
		
		if(this.timerNotify){
			this.timerNotify.stop();
		}
		
		this.timerNotify = new Timer(function(){
			if(!toggle){
				document.title = $MUI('Nouveau message');
			}else{
				document.title = this.originalTitle;	
			}
			toggle = !toggle;
		}.bind(this), 1);
		
		this.timerNotify.start();
	},
/**
 * MessengerUI.stopNotify() -> void
 **/	
	stopNotify:function(){
		if(this.timerNotify){
			this.timerNotify.stop();
		}
		document.title = 	this.originalTitle;
		this.timerNotify = 	null;
	},
/**
 * MessengerUI.listing() -> void
 **/
	open: function(){
		
		var win = $WR.unique('messenger', {
			autoclose:	false,
			action: function(){
				//this.open();
			}.bind(this)
		});
		//on regarde si l'instance a été créée
		if(!win) return;
		
		win.stacks = 	[];
		win.forms = 	{};
		win.setIcon('messenger');
		win.Resizable(false);
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();
		win.addClassName('messenger');
		
		win.removeDrag();
		win.NoChrome(true);
		
		//
		// Editor
		//
		win.Editor = new Editor({
			theme_advanced_buttons1 : 			"forecolor,backcolor,|,bold,italic,underline,strikethrough,|,link,unlink,|,emotions,charmap,media",
			theme_advanced_buttons2 : 			"",
			width:								'100%',
			height:								'60px',
			content_css: 						'themes/window.css.php?themes=default&all=no&editor=true',
			source:								false,
			theme_advanced_statusbar_location: 	false,
			//media:								document.navigator.mobile ? false : $FM().createHandler()
		});
		
		win.Editor.css('height', 'auto');
		win.Editor.Header().hide();
		
		win.Editor.on('setup', function(){
			win.Editor.hide();
			win.Editor.TinyMce.onKeyDown.add(function(ed, evt) {
				this.isBlur = false;
				try{
						
				if(Event.getKeyCode(evt) == 13){
					if(!evt.shiftKey){
						if(this.sanitize(win.Editor.Value(), true) != '') {						
							//this.CurrentRoom.timer.stop();
							var data = this.sanitize(win.Editor.Value());
							
							if(this.CurrentRoom.currentQuotedMessage){
								var reg = new RegExp('@' + this.CurrentRoom.currentQuotedMessage.pseudo + ' &gt;', 'gi');
								
								if(data.text.match(reg)){
									data.text = this.CurrentRoom.currentQuotedMessage.content + data.text.replace(reg, '');
								}
								
								this.CurrentRoom.currentQuotedMessage = false;
							}
							
							this.addMessages(win, this.CurrentRoom, [{
								Pseudo:			$U().Login, 
								Date_Create:	new Date().toString_('datetime', 'eng'), 
								Content:		data.text,
								BgColor:		$U('Messenger_Bg_Color'),
								TextColor:		$U('Messenger_Text_Color'),
								Ignore:			false,
								Message_ID:		-1
							}]);
							
							this.CurrentRoom.ui.Messages.ScrollBar.scrollToEnd();
							
							this.CurrentRoom.addMessage(data.text);
							
							if(data.options.length){
								this.CurrentRoom.addPictures(data.options);
							}
							
							this.CurrentRoom.ui.Messages.ScrollBar.scrollToEnd();
						}else{
							win.Editor.Value('');
						}
					}
				}
				}catch(er){$S.trace(er)}
				
      		}.bind(this));
			
			win.Editor.TinyMce.onKeyUp.add(function(ed, evt) {
				if(Event.getKeyCode(evt) == 13){
					win.Editor.Value('');
					return false;
				}
			});

		}.bind(this));
		//
		// TabControl
		//
		win.createTabControl().addClassName('tab');
				
		win.TabControl.addPanel($MUI('Salles'), this.createPanelListRoom(win)).on('click', function(){
			win.resizeTo('auto', document.stage.stageHeight);
			win.loadRooms();
			win.Editor.hide();	
			this.CurrentRoom = {Room_ID: -1};
		}.bind(this));
		
		win.appendChild(win.TabControl);
		win.appendChild(win.Editor);
		$Body.appendChild(win);
		
		win.Editor.load();
		
		win.moveTo(0,0);
		win.resizeTo('auto', document.stage.stageHeight);
				
		win.on('close', function(){
			window.onblur = new Function();
			window.onfocus = new Function();
		});
		
		$S.fire('messenger:open', win);
		
		var o = new TabControlInteract(win, win.TabControl, {
			manuelid:	0,
			incident:	'Gestion des salles',
			options:	$S.plugins.get('Messenger')
		});
		
		//o.Help.setStyle('float:right');
		o.Incident.setStyle('float:right');
		
		//
		//
		//
		win.AudioNotify = new Node('audio');
		win.AudioNotify.appendChild(new Node('source', {src:$S.plugins.get('Messenger').PathURI + 'css/notify.ogg', type:"audio/ogg"}));
		win.AudioNotify.appendChild(new Node('source', {src:$S.plugins.get('Messenger').PathURI + 'css/notify.mp3', type:"audio/mpeg"}));
		
		win.appendChild(win.AudioNotify);
		
		window.onblur = function(){
			this.isBlur = true;
		}.bind(this);
		
		window.onfocus = function(){
			if(this.isBlur){
				this.isBlur = false;
				this.stopNotify();
				
				this.CurrentRoom.ui.Button.length = 0;
				this.CurrentRoom.ui.Button.setTag('');
			}
		}.bind(this);
		
		
	},
/**
 * MessengerUI.openRoom(win, room) -> void
 **/
 	openRoom:function(win, room){
		//On empêche le doublon d'ouverture de salle 
		for(var i = 0; i < win.stacks.length; i++){
			if(room.Room_ID ==  win.stacks[i].Room_ID){
				win.TabControl.select(win.stacks[i].ui.Button.getID());
				win.Editor.show();
				win.resizeTo(document.stage.stageWidth, document.stage.stageHeight);
				return;
			}
		}
		win.Editor.show();		
		//
		// Room
		//
		this.CurrentRoom = room = new Room(room);
		room.Loaded = false;
		win.stacks.push(room);
		
		room.open = true;
		room.ui = 	{};
		room.LAST = {Message_ID: 0};
		
		//
		// Panel
		//
		room.ui.Panel = 	new Panel();
		room.ui.Panel.addClassName('room');
		
		/*var name = room.Name;
		
		if(name == $U().Pseudo){
			name = 
		}*/
		
		//
		// Button
		//		
		room.ui.Button = 	win.TabControl.addPanel(room.Name, room.ui.Panel).on('click', function(){
			win.Editor.show();
			win.resizeTo(document.stage.stageWidth, document.stage.stageHeight);
			this.CurrentRoom = room;
			room.ui.Button.length = 0;
			room.ui.Button.setTag('');
			this.stopNotify();
		}.bind(this));
		
		room.ui.Button.addClassName('messenger-onglet');
		room.ui.Button.SpanText.setStyle('padding-right:20px');
		room.ui.Button.length = 0;
		//
		// 
		//
		room.ui.close = new SimpleButton({icon:'cancel-14', type:'mini'});
		//room.ui.close.setStyle('position:absolute;top:2px;right:0px');
		
		room.ui.Button.appendChild(room.ui.close);			
		win.TabControl.select(room.ui.Button.getID());
		//
		//
		//
		room.ui.History = new SimpleButton({icon:'clock', text:$MUI('Historique')});
		room.ui.History.on('click', function(){
			this.openHistory(win, room);
		}.bind(this));
		//
		//
		//
		room.ui.Users = this.createWidgetUsers(win, room);
		room.ui.Users.DropMenu.hide();
		room.ui.Users.BorderRadius(false);
		room.ui.Users.setParameters('cmd=room.user.list&Room=' + escape(Object.toJSON(room)) + "&trace=false");			
		//
		//widgetText
		//
		room.ui.Messages =	this.createWidgetMessages(win);
		room.ui.Messages.addClassName('messenger-message');
		room.ui.Messages.BorderRadius(false);
		room.ui.Messages.Title(room.Name.match($MUI('Conversation entre')) ? '&nbsp;' : $MUI('Salle') + ' : ' + room.Name);
		room.ui.Messages.addGroupButton(room.ui.History);
				
		room.ui.Panel.appendChilds([room.ui.Users, room.ui.Messages]);
		
		//Ajout de l'utilisateur à la liste des connectés
		room.connect(function(connected){
			
			if(Object.isString(connected)){
				if(connected == 'room.force.disconnect'){
					this.alertClose(win, room);
					return;
				}
			}
			
			if(connected){
				room.ui.Users.load();
								
				room.timer = new Timer(function(){
					this.load(room);
				}.bind(this), this.delay);	
			}
			
		}.bind(this));
		
		room.ui.Users.on('error', function(response){
			room.open = false;
			
			switch(response){
				case 'room.force.disconnect':
					this.alertClose(win, room);
					break;
				case 'room.ban.user':
					
					break;
			}			
		}.bind(this));
				
		room.ui.Users.on('complete', function(obj){		
			try{
				$A(obj.RoomsForced).each(function(theRoom){
				this.openRoom(win, theRoom);
			}.bind(this));
			
			}catch(er){$S.trace(er)}
			try{
				this.addMessages(win, room, $A(obj.Messages));
			}catch(er){$S.trace(er)}
		}.bind(this));
		
		room.ui.close.on('click', function(){
			
			room.timer.stop();
			room.timer = null;
									
			win.TabControl.removePanel(room.ui.Button.getID());
			win.TabControl.select(0);
			win.Editor.hide();
					
			room.disconnect(function(){win.loadRooms();});
			
			win.resizeTo('auto', document.stage.stageHeight);
			var options = [];
						
			win.stacks.each(function(r){
				if(room.Room_ID * 1 == r.Room_ID * 1) return;
				options.push(r);
			});
			
			win.stacks = options;
		});
						
		win.on('close', function(){
			
			win.stacks = null;
			room.timer.stop();
			room.timer = null;
			
			room.open = false;
			room.disconnect();
			win.loadRooms();
						
			$S.fire('room:close', win, room);
		});
		
		win.on('resize', function(){
			if(!win.Hidden()){
				room.ui.Messages.ScrollBar.update();
				room.ui.Messages.ScrollBar.scrollToEnd();
			}
		}.bind(this));
		
		win.resizeTo(document.stage.stageWidth, document.stage.stageHeight);
	},
/**
 * MessengerUI.createWidgetUsers(win) -> Widget
 *
 * Cette méthode créée la liste liste des utilisateurs.
 **/	
	createWidgetUsers: function(win, room){
				
		var widget = 	new WidgetTable({
			range1:		30, 
			range2:		40, 
			range3:		50,
			readOnly:	true,
			link: 		$S.link,
			empty:		' - ' + $MUI('Aucune salle de créée') + ' - ',
			select:		false,
			overable:	false,
			selectable:	false,
			completer:	false,
			complex:	true,
			field:		'Statut',
			count:		false,
			progress:	false
		});
		
		widget.Table.onWriteName = function(key){
			
			switch(key * 1){
				case 0:return $MUI('En ligne');
				case 1:return $MUI('Absent');
				case 2:return $MUI('Hors ligne');
			}
		};
		
		widget.Table.Header().hide();
		widget.Title($MUI('Utilisateurs'));
		widget.setIcon('user-edit');
		widget.addClassName('users');
		
		widget.addHeader({
			Avatar: {title: '', width:30},
			Pseudo: {title: ''}
		});
		
		widget.addFilters(['Avatar'], function(e){
			var button = new AppButton({icon: e == "" ? 'user-edit' : e.replace('127.0.0.1', window.location.host), type:'mini'});
			button.setStyle('margin:2px');					
			return button;
		}.bind(this));
		
		widget.addFilters(['Pseudo'], function(e, cel, data){
			var html = new HtmlNode();
			html.addClassName('carbon-node messenger-user');
			html.setStyle('padding:5px');		
			html.append('<h1 style="margin:0px;font-size:16px">' + e +'</h1>');
			
			if(data.User_ID != $U().User_ID && room.User_Friend == 0){
				//
				//
				//
				var btnMessage = new SimpleButton({icon:'mail-new'});
							
				html.appendChild(btnMessage);
				
				btnMessage.on('mouseover', function(){
					win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Envoyer un message privé') + '</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
				});
				
				btnMessage.on('mouseup', function(){
					//créer le nouveau sallon
					var newRoom = 			new Room();
					newRoom.User_ID = 		$U().User_ID;
					newRoom.User_Friend = 	data.User_ID;
					newRoom.Name = 			data.Pseudo;
					newRoom.Group = 		'Conversations';
					newRoom.User_Max = 		2;
					
					newRoom.commit(function(){
						this.openRoom(win, newRoom);
						win.loadRooms();
					}.bind(this))
				}.bind(this));
			}
			
			if($U().User_ID != data.User_ID){
				cel.parentNode.on('click', function(){
					
					this.CurrentRoom.currentQuotedMessage = null;
					win.Editor.Value('');
					win.Editor.Value('@' + e + ' &gt;&nbsp; ');
				}.bind(this));
			}
			return html;
		}.bind(this));
		
		return widget;			
	},
/**
 * MessengerUI.createWidgetMessages(win) -> Widget
 *
 * Cette méthode créée la liste des messages du salon.
 **/	
	createWidgetMessages: function(win){
		var widget = new Widget();
		widget.addClassName('messages');
		widget.setIcon('file-edit');
		widget.createScrollBar();
		widget.Latest = {};
		
		return widget;
	},
/**
 * MessengerUI.addMessages(win, room, array) -> void
 **/	
	addMessages: function(win, room, array){
		//this.stopNotify();
		
		var screen = 	room.ui.Messages;
		var start = 	room.LAST.Message_ID;
		var isnew = 	this.CurrentRoom.Room_ID * 1 != room.Room_ID * 1;
				
		array.each(function(message){
			
			if(message.Message_ID > 0) {//mon message possède un ID suppérieur à zero
				room.LAST = message;
				//mise à jour de la requête
				room.ui.Users.setParameters('cmd=room.user.list&trace=false&Room=' + escape(Object.toJSON(room)) + "&LAST_INCREMENT=" + room.LAST.Message_ID);
				//on compte le nombre de message non lu
				if(start * 1 != 0 && isnew || this.isBlur){
					room.ui.Button.length++;
					room.ui.Button.setTag(room.ui.Button.length);
				}
			}
			
			if(start != 0){//si il s'agit d'un premier chargement
				if(message.User_ID == $U().User_ID){//qu'il s'agit d'un de mes messages. Je l'ignore vue que je l'ai déjà affiché à l'écran
					return;	
				}
			}
			
			var html = new HtmlNode();
			
			html.setStyle('position:relative');
			
			screen.appendChild(html);
			
			if(screen.Latest.Pseudo != message.Pseudo || Object.isUndefined(screen.Latest.Pseudo)){
				screen.Latest.className = screen.Latest.className == 'line-altern-0' ? 'line-altern-1' : 'line-altern-0' ;	
				html.append('<h1 class="pseudo">' + message.Pseudo + ' dit :</h1>');
				screen.Latest.Pseudo = message.Pseudo;
			}else{
				try{html.previousSiblings()[0].addClassName('grouped');}catch(er){}
			}
			
			html.addClassName(screen.Latest.className);
			
			if(message.TextColor != '#000'){
				html.setStyle('color:' + message.TextColor);
			}
			if(message.BgColor != '#FFF'){
				html.setStyle('background-color:' + message.BgColor);
			}			
			//
			// Gestion de la date.
			//*
			var date = message.Date_Create.toDate();
			
			if(new Date().format('Ymd') == date.format('Ymd')){
				date = date.format('h:i');
			}else{
				if(date.dateDiff(new Date()) > 7 ){
					date = date.format('d M Y h:i');
				}else{
					date = date.format('l h:i');
				}
			}
			
			html.append('<div class="time">' + date +'</div>');
			html.append(message.Content);			
			
			this.parse(html);
			
			if(message.Pseudo != $U().Login){
				html.on('click', function(){
					room.currentQuotedMessage = {
						pseudo:		message.Pseudo,
						content:	'<blockquote><h1>' + message.Pseudo 
									+ ' dit :</h1><div class="time">' + message.Date_Create.toDate().format('l d F Y à h\\hi') +'</div>'
									+ '<div class="content">' + message.Content + '</div></blockquote>'
					};
					
					win.Editor.Value('');
					win.Editor.Value('@' + message.Pseudo + ' &gt;&nbsp; ');
				}.bind(this));
			}
			
			screen.ScrollBar.refresh();		
			if(screen.ScrollBar.isScrollEnd(20)){
				screen.ScrollBar.scrollToEnd();
			}
		}.bind(this));
		
		screen.ScrollBar.refresh();
		
		if(room.timer) room.timer.start();
		if(!room.Loaded){
			room.Loaded = true;
			screen.ScrollBar.scrollToEnd();
		}
		//
		// On joue le son 
		//
		if(array.length > 0 && this.isBlur) {
			try{	
				this.startNotify(win);
			}catch(er){alert(er)}
		}
	},
/**
 * MessengerUI.openHistory(win, room) -> void
 **/
 	openHistory:function(win, room){
		var box = win.createBox();
		box.hide();
		
		var widget = new WidgetTable({
			range1:		30, 
			range2:		50, 
			range3:		100,
			readOnly:	true,
			count:		false,
			sortable:	false,
			overable:	false,
			link: 		$S.link,
			parameters:	'cmd=room.history.get&Room=' + Object.toJSON(room),
			complex:	true,
			field:		'Date_Section',
			text:		''
		});
		
		widget.Table.onWriteName = function(key){
			return key.toDate().format('l d F Y');
		};
		
		widget.addHeader({
			Avatar:	 {title:'', width:30},
			Content: {title:''}
		});
		
		widget.BorderRadius(false);
		widget.Title($MUI('Historique de conversation'));
		widget.addClassName('messenger-message messenger-history');
		widget.setIcon('clock');
		widget.Table.Header().hide();
		widget.css('margin','0px');
		widget.Body().setStyle('width:800px;height:600px;');
		widget.Latest = {};
		
		widget.addFilters(['Avatar'], function(e, cel){
			
			cel.css('vertical-align', 'top').css('padding-top', '5px');
			
			var button = new AppButton({icon: e == "" ? 'user-edit' : e.replace('127.0.0.1', window.location.host), type:'mini'});
			button.setStyle('margin:2px');					
			return button;
		}.bind(this));
		
		widget.addFilters('Content', function(e, cel, data){
			var html = new HtmlNode();
			
			html.setStyle('position:relative');
			
			html.append('<h1>' + data.Pseudo + ' '  + $MUI('dit') + ' :</h1>');
					
			//
			// Gestion de la date.
			//
			var date = data.Date_Create.toDate();
		
			if(new Date().format('Ymd') == date.format('Ymd')){
				date = date.format('h:i');
			}else{
				if(date.dateDiff(new Date()) > 7){
					date = date.format('d M Y h:i');
				}else{
					date = date.format('l h:i');
				}
			}
		
			html.append('<div class="time">' + date +'</div>');
			html.append(data.Content);							
			this.parse(html);
			
			return html;
		}.bind(this));
		
		box.addClassName('history-box')
		box.appendChild(widget);
		box.setType('CLOSE').show();
		box.reset(function(){box.removeClassName('history-box')});
		widget.load();
	},
/**
 * MessengerUI.openConfigRoom(win, room) -> void
 **/
 	openConfigRoom:function(win, room){
		var box = 	win.createBox();
		var flag = 	box.box.createFlag();
		var forms = {};
		
		room = new Room(room);	
		//
		// Name
		//
		forms.Name = 		new Input({type:'text', value:room.Name, maxLength:100});
		forms.Name.setStyle('width:200px');
		//
		// Name
		//
		forms.Group = 		new Select({
			link: 		$S.link,
			parameters:	'cmd=room.group.list'
		});
		forms.Group.Input.readOnly = false;
		forms.Group.load();
		forms.Group.Value(room.Group);
		forms.Group.setStyle('width:200px');
		//
		// Private
		//
		forms.Private = 	new ToggleButton();
		forms.Private.Value(room.Private);
		//
		// Name
		//
		forms.Password = 	new Input({type:'password', value:room.Password, maxLength: 8});
		forms.Password.setStyle('width:200px');
		//
		// User_Max
		//
		forms.User_Max = 	new Input({type:'number', decimal: 0, value:room.User_Max});
		forms.User_Max.setStyle('width:50px; text-align:right');
		//
		// User_Max
		//
		forms.Message_Max = 	new Input({type:'number', decimal: 0, value:room.Message_Max});
		forms.Message_Max.setStyle('width:50px; text-align:right');
		//
		// Widget
		//
		var widget = new Widget();
		widget.Table = new TableData();
		widget.BorderRadius(false);
		widget.Title($MUI('Configuration de la salle de chat'));
		widget.css('width', '360px').css('margin', '0');
		widget.Table.setStyle('width:100%');
		widget.appendChild(widget.Table);
		
		widget.Table.addHead($MUI('Nom') + ' : ', {width:150}).addField(forms.Name).addRow();
		widget.Table.addHead($MUI('Groupe') + ' : ').addField(forms.Group).addRow();
		widget.Table.addHead($MUI('Privée') + ' : ').addField(forms.Private).addRow();
		widget.Table.addHead($MUI('Mot de passe') + ' : ').addField(forms.Password).addRow();
		widget.Table.addHead($MUI('Nb. max utilisateur') + ' : ').addField(forms.User_Max).addRow();
		widget.Table.addHead($MUI('Nb. max message') + ' : ').addField(forms.Message_Max);
		
		box.a(widget).setType().show();
		box.addClassName('history-box');
		
		box.submit({
			text:	$MUI('Enregistrer'),
			icon:	'filesave',
			click: function(){
				flag.hide();
				box.removeClassName('history-box');
				if(forms.Name.Value() == ''){
					flag.setText($MUI('Veuillez choisir un nom pour votre salle de chat')).setType(FLAG.RIGHT).show();
					return true;
				}
				
				if(forms.User_Max.Value() > 100) {
					forms.User_Max.Value(100);
				}
				
				if(forms.User_Max.Value() < 0){
					forms.User_Max.Value(0)
					return true;
				}
				
				if(forms.Message_Max.Value() > 200) {
					forms.MessageMax.Value(200);
				}
				
				if(forms.Message_Max.Value() < 5){
					forms.MessageMax.Value(5)
					return true;
				}
				
				$S.fire('room:submit', room);	
				
				room.Name = 		forms.Name.Value();
				room.Group = 		forms.Group.getText();
				room.Password = 	forms.Password.Value();
				room.Private = 		forms.Private.Value();
				room.Message_Max = 	forms.Message_Max.Value();
				room.User_Max =		forms.User_Max.Value();
				
				box.wait();
				
				room.commit(function(){
					
					box.hide();
					$S.fire('room:submit.complete', room);	
					
					var splite = new SpliteIcon($MUI('Paramètres correctement enregistrés'), $MUI('Salle') + ' : ' + room.Name);
					splite.setIcon('filesave-ok-48');
					
					box.a(splite).Timer(3).setType('NONE').show();
				});
				
				return true;
			}
		});
		
		box.reset({
			icon:	'cancel',
			click: function(){
				box.addClassName('history-box');
			}
		});
		
		if(forms.Private.Value()){
			widget.Table.getRow(2).show();
		}else{
			widget.Table.getRow(2).hide();
		}
		
		forms.Private.on('change', function(){
			if(this.Value()){
				widget.Table.getRow(2).show();
			}else{
				widget.Table.getRow(2).hide();
			}
		});
		
		forms.Message_Max.on('mouseover', function(){
			flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez le nombre maximum de message affichable pour votre salle.</p><p>Ce nombre doit être compris entre 10 et 200') + '.</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		
		forms.User_Max.on('mouseover', function(){
			flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez le nombre maximum d\'utilisateur pouvant se connecter à votre salle.</p><p>Ce nombre doit être compris entre 0 et 100.</p><p>Saisissez 0 pour lever la limitation') + '.</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
		});
	},
/**
 * MessengerUI.createPanelListRoom() -> Node
 **/	
	createPanelListRoom: function(win){
		var panel = new Panel({style:'width:500px; padding:0px;'});
		panel.addClassName('panel-list-room');
		//
		// Widget
		//
		var widget = new WidgetTable({
			range1:		30, 
			range2:		40, 
			range3:		50,
			readOnly:	true,
			link: 		$S.link,
			parameters:	'cmd=room.list',
			empty:		' - ' + $MUI('Aucune salle de créée') + ' - ',
			select:		false,
			completer:	false,
			count:		false,
			progress:	false,
			complex:	true,
			field:		'Group'
		});
		
		widget.BorderRadius(false);
		widget.Table.Header().hide();
		
		widget.Title($MUI('Messenger')+ ' v' + $S.plugins.get('Messenger').Version + ' - ' + $MUI('Liste des salles'));
		widget.DropMenu.hide();
		
		var btns = [];
		if($U().getRight() <= 2) {
			btns.push(new SimpleButton({text:$MUI('Créer')}));		
			btns[0].on('click', function(){this.openConfigRoom(win)}.bind(this));
		}
		
		btns.push(new SimpleButton({icon:'reload'}).on('click', function(){win.loadRooms()}.bind(this)));
		
		widget.addGroupButton(btns);
				
		widget.addHeader({
			Private: 	{title: '', width:30},
			Name: 		{title: ''},
			Pseudo:		{title: '', width:80, style:'font-size:11px'},
			Action: 	{Title: '', width:50, type: 'action'}	
		});
		
		widget.addFilters(['Private'], function(e, cel, data){
			
			if(data.User_Friend == 0 || Object.isUndefined(data.User_Friend)){
				var button = new AppButton({icon: e * 1 ? 'locked' : 'group-edit-24', type:'mini'});
			}else{
				var button = new AppButton({icon:'user-24', type:'mini'});
			}
						
			return button;
		}.bind(this));
		
		widget.addFilters(['Pseudo'], function(e, cel, data){
			return $MUI('Par') + ' ' + e;
		});
		
		widget.addFilters(['Name'], function(e, cel, data){
						
			var html = new HtmlNode();
			
			html.setStyle('padding:5px');
			
			if(data.User_Friend == 0 || Object.isUndefined(data.User_Friend)){
				html.append('<h1 style="margin:0px;font-size:16px">' + e 
						+'<p style="font-size:11px">' + data.NbUser + ' personne(s), maximum : ' + (data.User_Max == 0 ? $MUI('pas de limite') : data.User_Max) + '</p></h1>');
			}else{
				html.append('<h1 style="margin:0px;font-size:16px">' + e + '</h1>');
			}
			
			return html;
		});
		
		widget.addFilters(['User_Max'], function(e, cel, data){
			if(1 * e){
				return '5 / ' + e; 
			}
			return '';
		});
		
		widget.addFilters(['Action'], function(e, cel, data){
			
			if(!Object.isUndefined(data.User_Friend) && data.User_Friend != null &&  data.User_Friend != 0){
				
				if(data.User_Friend != $U().User_ID && data.User_ID != $U().User_ID){
					cel.parentNode.hide();	
					return;
				}
			}
			
			e.remove.setIcon('cancel-14');
			e.open.setIcon('advanced');
			
			if(data.User_ID != $U().User_ID){
				e.hide();	
				
				if($U().getRight() == 1){
					e.show();
					e.open.hide();
				}
			}
						
			e.remove.on('click', function(evt){
				Event.stop(evt);
				
				this.removeRoom(win, data);
			}.bind(this));
			
			e.open.on('click', function(evt){
				Event.stop(evt);
				
				this.openConfigRoom(win, data);
				
			}.bind(this));
			
			return e;
		}.bind(this));
		
		widget.on('click', function(evt, data){
			
			if(data.NbUser * 1 > data.User_Max * 1 && data.User_Max != 0){
				var box = 		win.createBox();
				var splite = 	new SpliteWait($MUI('Oups !! Le salon est complet. Il vous faudra attendre quelques temps avant qu\'une place se libère.'));
				splite.setStyle('width:400px');
				
				box.a(splite).setType('CLOSE').Timer(10).show();
				
				win.loadRooms();
				
				return;
			}
			
			if(data.Private * 1){
				var box = 	win.createBox();
				var flag = 	box.box.createFlag();
				//
				// Password
				//
				var passwordSecurity = new Input({type:'password', style:'width:100%'});
				//
				// Splite
				//
				var splite = new SpliteIcon('', $MUI('L\'accès au salon est protégé par un mot de passe. Merci de saisir le mot de passe du salon')+'.');
				splite.setIcon('password-48');
				splite.setStyle('max-width:400px');
				//
				// Widget
				//
				var widget = 	new Widget();
				widget.Table = 	new TableData();
				widget.Title($MUI('Sécurité - Saisissez votre mot de passe'));
				widget.setIcon('locked');
				widget.Table.setStyle('width:100%');
				
				widget.Table.addHead($MUI('Mot de passe') + ' : ', {width:120}).addField(passwordSecurity);
				widget.appendChild(widget.Table);
				
				box.a(splite);
				box.a(widget);
								
				passwordSecurity.focus();	
				
				box.setType().show();
				
				box.submit({
					text: 	$MUI('Valider'),
					icon:	'valid',
					click:function(){
						
						if(passwordSecurity.Value() == '' || passwordSecurity.Value() != data.Password){
							flag.setText($MUI('Le mot de passe saisie est incorrect') + '.').setType(FLAG.RIGHT).show(passwordSecurity, true);
							return true;
						}
						
						this.openRoom(win, data);
					}.bind(this)
				});
				
				box.reset({icon:'cancel'});
			}else{
				this.openRoom(win, data);
			}
			
			
		}.bind(this));
				
		//panel.appendChild(splite);
		panel.appendChild(widget);
		
		win.loadRooms = function(){
			widget.load()
		};
		
		win.on('resize', function(){
			if(!win.Hidden()){
				/*win.TabControl.setHeight(win.stageHeight()+31);
				var height = win.stageHeight() - 26;
				widget.Body().setStyle('height:'+height+'px');*/
			}
		}.bind(this));	
			
		widget.load();
		
		return panel;
	},
/**
 * MessengerUI.removeRoom(win, room) -> void
 **/
 	removeRoom:function(win, room){
		room = new Room(room);
		
		var box = 		win.createBox();
		var flag = 		box.box.createFlag().setType(FLAG.RIGHT);
		//
		//Splite
		//	
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer le Salon') + ' "' + room.Name + '" ?');
		splite.setIcon('trash-48');
		splite.setStyle('max-width:500px');
		
		box.as([splite]).ty()
		
		$S.fire('room:remove.open', box);
		
		box.show();
		
		box.submit(function(){
						
			var evt = new StopEvent(box);
			$S.fire('room:remove.submit', evt);
			
			if(evt.stopped)	return true;
						
			box.wait();
			
			room.remove(function(){
				box.hide();
				$S.fire('room:remove.complete');
				
				var splite = new SpliteIcon($MUI('Le salon a été correctement supprimé') + '.', $MUI('Salon') + ' "' + room.Name + '"');
				splite.setIcon('valid-48');
								
				box.a(splite).setType('CLOSE').Timer(3).show();
				box.getBtnReset().setIcon('cancel');
				box.setIcon('documentinfo');
				
			});
			
			return true;
		});
		
		box.getBtnSubmit().setIcon('delete').setText($MUI('Supprimer'));
		box.getBtnReset().setIcon('cancel');	
	},
/**
 * MessengerUI.parse(node) -> Element
 *
 * Cette méthode parse le contenu d'un element HTML.
 **/
	parse: function(node){
		//surbrillance du Message To Login
		var reg = 			new RegExp($U().Login, 'gi');
		msg = 				node.innerHTML.replace(reg, '[b]' + $U().Login + '[/b]');
		node.innerHTML = 	this.sanitize(msg, true).parseBBCodes({
			'[youtube](.*?)[/youtube]':			'<div class="media youtube">$1</div>',
			'[gvideo](.*?)[/gvideo]':			'<div class="media gvideo">$1</div>',
			'[dailymotion](.*?)[/dailymotion]':	'<div class="media dailymotion">$1</div>'
		});
				
		try{
			//récupération des éléments de type image
			var array = [];
			
			$A(node.select('img')).each(function(img){
				if(!img.src.match(/tiny_mce/) && img.className != 'messenger-load'){
					img.array = array;
					this.imgToHp(img);
				}
				
				if(img.className == 'messenger-load'){
					if(img.complete){
						img.className = '';
						img.array = array;						
						this.imgToHp(img);
					}else{
						
						var picture = new Node('img', {src: img.src});
						img.replaceBy(picture);
						img = picture;
						
						new Timer(function(t){
							if(img.complete){
								t.stop();
								img.className = '';
								img.array = array;
								this.imgToHp(img);
							}
						}.bind(this), 0.2).start();
					}
				}
			}.bind(this));
			
			$A(node.select('.media')).each(function(e){
				switch(e.className){
					case "media dailymotion":
						var btn = new AppButton({icon:'quicktime-32', text:$MUI('Voir la vidéo')});
						btn.on('click', function(){
							var win = new Window();
							win.setIcon('quicktime');
							win.Resizable(false);
							win.Title('Dailymotion');
							win.addClassName('media-video');
							win.Body().innerHTML = ('[dailymotion]' + e.innerHTML + '[/dailymotion]').parseBBCodes();
							$Body.appendChild(win);
							win.centralize();
						});
						e.replaceBy(btn);
						break;
					case "media youtube":
						var btn = new AppButton({icon:'youtube-32', text:$MUI('Voir la vidéo')});
						btn.on('click', function(){
							var win = new Window();
							win.setIcon('youtube');
							win.Title('Youtube');
							win.Resizable(false);
							win.addClassName('media-video');
							win.Body().innerHTML = ('[youtube]' + e.innerHTML + '[/youtube]').parseBBCodes();
							$Body.appendChild(win);
							win.centralize();
						});
						e.replaceBy(btn);
						break;
					case "media gvideo":
						var btn = new AppButton({icon:'google-32', text:$MUI('Voir la vidéo')});
						btn.on('click', function(){
							var win = new Window();
							win.setIcon('google');
							win.Title('Google video');
							win.Resizable(false);
							win.addClassName('media-video');
							win.Body().innerHTML = ('[gvideo]' + e.innerHTML + '[/gvideo]').parseBBCodes();
							$Body.appendChild(win);
							win.centralize();
						});
						e.replaceBy(btn);
						break;	
				}
			}.bind(this));
			
			//récupération des liens externes
			$A(node.select('a')).each(function(a){
				if(a.href == '' && a.innerHTML.match(/http:\/\//)){
					a.href = a.innerHTML;
				}
				
				a.link = a.href;
				a.href = '#';
				
				a.on('click', function(){
					$S.open(this.link, this.link).resizeTo(600, 700);
				});
			});
			
		}catch(er){$S.trace(er)}
	},
/**
 * MessengerUI.sanitize(msg) -> Object
 **/	
	sanitize: function(msg, bool){
		var reg = new RegExp('<p>&nbsp;</p>', 'gi');
		msg = msg.replace(reg, '');
		msg = msg.replace(/\n\r|\r\n|\n/gi, '');
		msg = msg.stripslashes();
		
		//interception des images base64
		var node = new Node('div');
		node.innerHTML = msg;
		
		if(!bool){
			var array = [];
			
			$A(node.getElementsByTagName('img')).each(function(img){
				if(img.src.match(/^data:image/)){
					img.id = new Date().format('Ymdhis') + array.length;
					img.className = 'messenger-load';
					array.push({data:img.src, id:img.id});
					img.src = $S.URI_PATH  + $S.PATH_PUBLIC + $U().User_ID + '/' + img.id + '.' + img.src.split(',')[0].split('/')[1].split(';')[0];
				}
			}.bind(this));
			
			return {text:node.innerHTML, options:array};
		}
		return msg;
	},
/**
 * MessengerUI.imgToHp(img) -> void
 *
 * Cette méthode échange une image par un contrôle HeadPiece de la bibliothèque Windows
 **/	
	imgToHp: function(img){
		var src = img.src.replace('%3Cstrong%3E', '');
		src = src.replace('%3C/strong%3E', '');
		src = src.replace('127.0.0.1', window.location.host);
		
		try{
			var hp = new HeadPiece({text: $MUI('Agrandir'), icon:src.replace('.jpg', '1.jpg'), resize:true, nbTry:10});
			img.replaceBy(hp);
		}catch(er){$S.trace(er)}
		
		hp.link = 	src;
		
		img.array.push({src:src, title:''});
		
		hp.on('click', function(){
			try{
				$S.openPicture(this.link, img.array);
			}catch(er){
				$S.trace(er)
			}
		});
	}
};

Extends.ready(function(){new MessengerUI()});

/** section: Messenger
 * class Room
 **/
var Room = Class.create();
Room.prototype = {
/**
 * Room.Room_ID -> Number
 **/	
	Room_ID:	0,
/**
 * Room.User_ID -> Number
 **/
 	User_ID:		0,
	User_Friend: 	0,
/**
 * Room.Name -> String
 **/	
	Name:		'',
/**
 * Room.Group -> String
 **/	
	Group:		'default',
/**
 * Room.Private -> String
 **/	
	Private:	false,
/**
 * Room.Password -> String
 **/	
	Password:	'',
/**
 * Room.User_Max -> Number
 **/	
	User_Max:	10,
/**
 * Room.StackMax -> Number
 **/	
	Message_Max:	100,
/**
 * new Room()
 **/
	initialize: function(obj){
		if(!Object.isUndefined(obj)){
			this.setObject(obj);
		}
	},
/**
 * Room.clone() -> Room
 **/
	clone: function(){
		var obj = new Room({
			Room_ID: 	this.Room_ID,
			User_ID: 	this.User_ID,
			User_Friend: this.User_Friend,
			Name:		this.Name,
			Private:	this.Private,
			Password:	this.Password,
			User_Max:	this.User_Max,
			MessageMax:	this.MessageMax
		});
				
		return obj;
	},
/**
 * Room.disconnect() -> void
 **/
 	addMessage:function(msg, callback){
		$S.exec('room.message.add', {
			parameters: 'Room=' + escape(Object.toJSON(this))+ "&Message=" +escape(encodeURI(msg)),
			onComplete: function(result){
				try{
					this.evalJSON(result.responseText);
				}catch(er){}
				if(Object.isFunction(callback)) callback.call(this, this);
			}
		});
	},
/**
 * Room.disconnect() -> void
 **/
 	addPictures:function(pictures, callback){
		
		$S.exec('room.pictures.add', {
			parameters: 'Room=' + escape(Object.toJSON(this))+ "&Pictures=" +escape(encodeURIComponent(Object.toJSON(pictures))),
			onComplete: function(result){
				try{
					this.evalJSON(result.responseText);
				}catch(er){}
				if(Object.isFunction(callback)) callback.call(this, this);
			}
		});
	},
/**
 * Room.commit() -> void
 **/
 	commit: function(callback){
		$S.exec('room.commit', {
			parameters: 'Room=' + escape(Object.toJSON(this)),
			onComplete: function(result){
				try{
					this.evalJSON(result.responseText);
				}catch(er){}
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
		});
	},
/**
 * Room.getHistory(callback) -> void
 **/
 	getHistory: function(callback){
		$S.exec('room.history.get', {
			parameters: 'Room=' + escape(Object.toJSON(this)),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){}
				if(Object.isFunction(callback)) callback.call(this, obj);
			}.bind(this)
		});
	},
/**
 * Room.remove() -> Periode
 **/
 	remove: function(callback){
		$S.exec('room.remove', {
			parameters: 'Room=' + escape(Object.toJSON(this)),
			onComplete: function(result){
				try{
					this.evalJSON(result.responseText);
				}catch(er){}
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
		});
	},
/**
 * Room.connect() -> Periode
 **/	
	connect: function(callback){
		$S.exec('room.connect', {
			parameters: 'Room=' + escape(Object.toJSON(this)),
			onComplete: function(result){
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					if(Object.isFunction(callback)) callback.call(this, result.responseText);
					return;
				}
				
				if(Object.isFunction(callback)) callback.call(this, true);
			}.bind(this)
		});
	},	
/**
 * Room.disconnect() -> Periode
 **/	
	disconnect: function(callback){
		$S.exec('room.disconnect', {
			parameters: 'Room=' + escape(Object.toJSON(this)),
			onComplete: function(result){			
				if(Object.isFunction(callback)) callback.call(this, true);
			}.bind(this)
		});
	},
/**
 * Room.evalJSON(json) -> void
 **/
	evalJSON: function(json){
		this.setObject(json.evalJSON());
	},
/**
 * Room.toJSON() -> String
 **/
	toJSON: function(){
		var obj = {
			Room_ID: 		this.Room_ID,
			User_ID: 		this.User_ID,
			User_Friend: 	this.User_Friend,
			Name:			encodeURIComponent(this.Name),
			Group:			encodeURIComponent(this.Group),
			Password:		encodeURIComponent(this.Password),
			Private:		this.Private,
			User_Max:		this.User_Max,
			Message_Max:	this.Message_Max
		};
		
		return Object.toJSON(obj);
	},
/**
 * Room.setObject(obj) -> void
 * - obj (Object): Object anonyme.
 *
 * Assigne les attributs de l'objet anonyme à l'instance courante.
 **/
	setObject: function(obj){
		
		for(var key in obj){			
			this[key] = obj[key];
		}
		
	}
};
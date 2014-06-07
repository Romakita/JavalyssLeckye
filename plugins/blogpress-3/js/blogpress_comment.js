/** section: BlogPress
 * class System.BlogPress.Comment
 *
 * Gestion des commentaires postés sur le site.
 **/
System.BlogPress.Comment = Class.createAjax({

/**
 * System.BlogPress.Comment#Comment_ID -> Number
 **/
	Comment_ID: 0,
/**
 * System.BlogPress.CommentPost_ID -> Number
 **/
	Post_ID: 0,
/**
 * System.BlogPress.Comment#User_ID -> Number
 **/
	User_ID: 0,
/**
 * System.BlogPress.Comment#Author -> String
 * Varchar
 **/
	Author: "",
/**
 * System.BlogPress.CommentEmail -> String
 * Varchar
 **/
	Email: "",
/**
 * System.BlogPress.Comment#Tracking -> Number
 **/
	Tracking: 0,
/**
 * System.BlogPress.Comment#Url -> String
 * Varchar
 **/
	Url: "",
/**
 * System.BlogPress.Comment#IP -> String
 * Varchar
 **/
	IP: "",
/**
 * System.BlogPress.Comment#User_Agent -> String
 * Varchar
 **/
	User_Agent: "",
/**
 * System.BlogPress.Comment#Content -> String
 * Longtext
 **/
	Content: "",
/**
 * System.BlogPress.Comment#Note -> Number
 **/
	Note: 0,
/**
 * System.BlogPress.Comment#Date_Create -> Datetime
 **/
	Date_Create: null,
/**
 * System.BlogPress.Comment#Statut -> String
 * Varchar
 **/
	Statut:	'draft',
/**
 * System.BlogPress.Comment#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback){
		
		$S.exec('blogpress.post.comment.commit', {
			
			parameters: 'PostComment=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					if(Object.isFunction(error)) error.call(this, result.responseText);
				}
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});
	
	},
/**
 * System.BlogPress.Comment#valid(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Cette méthode valide le commentaire.
 **/
	valid: function(callback){
		
		this.Statut = 'publish';
		this.commit(callback);
	
	},
/**
 * System.BlogPress.Comment#spam(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Cette méthode place le commentaire dans la boite des spams.
 **/
	spam: function(callback){
		
		this.Statut = 'spam';
		this.commit(callback);
	
	},
/**
 * System.BlogPress.Comment#basket(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Cette méthode place le commentaire dans la boite des spams.
 **/
	basket: function(callback){
		
		this.Statut = 'basket';
		this.commit(callback);
	
	},
/**
 * Comment.delete(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback){
		$S.exec('blogpress.post.comment.delete',{
			parameters: 'PostComment=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	}
});

Object.extend(System.BlogPress.Comment, {
	CurrentDraft: 0,
	
	initialize: function(){
				
		$S.observe('blogpress:comment.submit.complete', function(){
			var win = $WR.getByName('blogpress');
			if(win){
				System.BlogPress.Comment.load(win);
			}
		}.bind(this));
			
		$S.observe('blogpress:comment.remove.complete', function(){//lorsque l'on supprime une entrée.
			var win = $WR.getByName('blogpress');
			if(win){
				System.BlogPress.Comment.load(win);
			}
		}.bind(this));
		
		$S.observe('system:startinterface', function(){
			if(Object.isFunction(System.plugins.HaveAccess) && !System.plugins.HaveAccess('BlogPress')){
				return;	
			}
			System.BlogPress.Comment.CountDraft();
		});
	},
	
	CountDraft:function(){
		
		$S.exec('blogpress.post.comment.count', {
			parameters:	'options=' + escape(Object.toJSON({Statut:'draft'})),
			onComplete:	function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){
					$S.trace(er);
					return;	
				}
				try{
					
				this.CurrentDraft = obj;
					
				if(obj != 0){
					
					try{
						System.BlogPress.BtnComments.setTag(obj);
					}catch(er){}
					
					if(Object.isUndefined(this.LineNotify)){
						this.LineNotify = System.Notify.add({
							appName:	'Commentaires',
							appIcon:	'blogpress',
							title:		$MUI('Vous avez')+' '+ obj+' '+ $MUI('commentaire(s) en attente')
						});
						
						this.LineNotify.on('click', function(){
							var win = System.BlogPress.open('comment');
							win.BlogPress.NavBar.PrintDraft.click();
						});
					}else{
						this.LineNotify.setText($MUI('Vous avez')+' '+ obj+' '+ $MUI('commentaire(s) en attente'));	
					}
					
					
				}else{
					if(this.LineNotify){
						this.LineNotify.parentNode.removeChild(	this.LineNotify);
					}
					try{
						System.BlogPress.BtnComments.setTag('');
					}catch(er){}
				}
				
				}catch(er){$S.trace(er)}
				
			}.bind(this)
		});
	},
/**
 * System.BlogPress.Comment.listing(win) -> void
 **/	
	listing:function(win){
		
		var panel = win.BlogPress;
		
		System.BlogPress.setCurrent('comment');
		
		if(!this.NavBar){
			
			this.NavBar = new NavBar( {
				range1:100,
				range2:200,
				range3:300
			});
			
			this.NavBar.on('change', this.load.bind(this));
						
			this.NavBar.PrintAll = 		new Node('span', {className:'action view all selected', value:''}, $MUI('Afficher tout'));
			this.NavBar.PrintDraft = 	new Node('span', {className:'action view draft', value:'draft'}, $MUI('En attente')),	
			this.NavBar.PrintPublish = 	new Node('span', {className:'action view publish', value:'publish'}, $MUI('Publié'));
					
			this.NavBar.appendChilds([
				this.NavBar.PrintAll,
				this.NavBar.PrintPublish,
				this.NavBar.PrintDraft
			]);
			
			this.NavBar.PrintAll.on('click', function(){
				this.NavBar.getClauses().page = 0;
				
				this.NavBar.select('span.view.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintAll.addClassName('selected');
				
				this.load(win);
			}.bind(this));
			
			this.NavBar.PrintDraft.on('click', function(){
				this.NavBar.getClauses().page = 0;
				
				this.NavBar.select('span.view.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintDraft.addClassName('selected');
				
				this.load(win);
			}.bind(this));
			
			
			this.NavBar.PrintPublish.on('click', function(){
				this.NavBar.getClauses().page = 0;
				
				this.NavBar.select('span.view.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintPublish.addClassName('selected');
				
				this.load(win);
			}.bind(this));
			
		}
				
		panel.PanelBody.Header().appendChilds([
			this.NavBar
		]);
		
		this.load(win);
		
	},
	
	getParameters:function(){
		var clauses = this.NavBar.getClauses();
		
		//var sort = this.NavBar.select('span.sort.selected')[0];
		//var field = sort.value;
				
		//if(sort.hasClassName('desc')){	
		//	sort = 'desc';
		//}else{
		//	sort = 'asc';
		//}
		
		//clauses.order = field + ' ' + sort;
		//clauses.where = $WR.getByName('mystore').Panel.InputCompleter.Text();
		
		var options = {
			draft:true, 
			statistics:true,
			Statut:this.NavBar.select('span.view.selected')[0].value
		};
		
		return 'options=' + Object.EncodeJSON(options) + '&clauses=' + clauses.toJSON();
	},
/**
 * System.BlogPress.Comment.listing(win) -> void
 **/	
	load:function(win){
		
		var options = {};
		
		var panel = win.BlogPress;
		panel.Progress.show();
		
		this.NavBar.setMaxLength(0);
			
		$S.exec('blogpress.post.comment.list', {
			parameters:this.getParameters(),			
			onComplete:function(result){
				
				try{
					var obj;
					var array = $A(obj = result.responseText.evalJSON());
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				try{
				panel.clearBody();
								
				//this.NavBar.PrintAll.innerHTML = 		$MUI('Afficher tout') + '(' + obj.NbAll + ')';
				//this.NavBar.PrintPublish.innerHTML = 	$MUI('Publié') + '(' + obj.NbPublish + ')';
				//this.NavBar.PrintDraft.innerHTML = 	$MUI('Brouillon') + '(' + obj.NbDraft + ')';
				
				this.NavBar.setMaxLength(obj.maxLength);
				}catch(er){alert(er)}
				try{		
				
					var letter = '';
					
					for(var i = 0; i < array.length;  i++){
						
						if(array[i].Date_Group != letter){
							letter = array[i].Date_Group;
							panel.PanelBody.Body().appendChild(new Node('h2', {className:'letter-group'}, array[i].Date_Group.toDate().format('l d F Y').toUpperCase())); 
						}
						
						var button =	new System.BlogPress.Comment.Button({
							icon:			array[i].Avatar,
							text:			array[i].Title,
							subTitle:		$MUI('Commenté par') + ' ' + array[i].Author,
							comment:		array[i].Content
						});
						button.data = array[i];
						
						
						if(array[i].Comment_Statut.match(/note/)){	
							button.setRating(array[i].Note);
						}else{
							button.Note.hide();	
						}
												
						if(array[i].Statut.match('draft')){
							button.setTag($MUI('En attente'));
						}else{
							button.BtnEnable.hide();	
						}
						
						button.addClassName('hide');
						
						panel.PanelBody.Body().appendChild(button);
						
						button.BtnRemove.on('click', function(evt){
							evt.stop();
							System.BlogPress.Comment.remove(win, this.data);
						}.bind(button));
						
						button.BtnSpam.on('click', function(evt){
							evt.stop();
							new System.BlogPress.Comment(this.data).spam(function(){
								System.BlogPress.Comment.load(win);
								System.BlogPress.Comment.CountDraft();
							});
						}.bind(button));
						
						button.BtnEnable.on('click', function(evt){
							evt.stop();
							new System.BlogPress.Comment(this.data).valid(function(){
								System.BlogPress.Comment.load(win);
								System.BlogPress.Comment.CountDraft();
							});
						}.bind(button));
						
						button.Message.on('change', function(){
							
							var o = new System.BlogPress.Comment(this.data);
							o.Content = button.Message.Value();
							
							this.Message.addClassName('icon-loading-32');
							
							o.commit(function(){
								this.Message.removeClassName('icon-loading-32');
							}.bind(this));
						
						}.bind(button));
						
						var html = new HtmlNode();
						var str = '';
						
						var style = 'style="display:inline-block;width:150px"';
						
						str += '<p style:"line-height:normal"><strong '+style+'> '+$MUI('Auteur')+' : </strong><span>'+array[i].Author+'</span><br />';
						str += '<strong '+style+'> '+$MUI('Utilisateur enregistré')+' ? </strong><span>'+(array[i].User_ID == 0 ? $MUI('Non') : $MUI('Oui'))+'</span><br />';
						str += '<strong '+style+'> '+$MUI('Posté le')+' : </strong><span>'+(array[i].Date_Create.toDate().format('l d F Y à H\\hi'))+'</span><br />';
						str += '<strong '+style+'> '+$MUI('IP')+' : </strong><span>'+array[i].IP+'</span></p>';
						
						str += '<p style:"line-height:normal"><strong> '+$MUI('User Agent')+' : </strong></p><p style="width:350px;line-height:normal"><code style="display:block">'+array[i].User_Agent+'</code></p>';
						str += '<p style:"line-height:normal">';
						
						if(array[i].Url != ''){
							str += '<strong '+style+'> '+$MUI('Site internet')+' : </strong><span>'+array[i].Url+'</span><br />';
						}
						
						if(array[i].Email != ''){
							str += '<strong '+style+'> '+$MUI('E-mail')+' : </strong><span>'+array[i].Email+'</span>';
						}
						
						str += '</p>';
						html.append(str);
												
						win.createBubble().add(button.BtnInfo,{
							duration:0,
							text: html
						});
						
						
						//button.on('click', function(){
							//System.BlogPress.Page.open(this.data);	
						//});
						
					}	
					
					panel.PanelBody.refresh();
					
					new Timer(function(){
						var b = panel.PanelBody.select('.market-button.hide')[0];
						if(b){
							
							b.removeClassName('hide');
							b.addClassName('show');
						}
					}, 0.1, array.length).start();
					
										
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
	},
	
	formatString: function(str){
		str = str.split(';');
		str.pop();
		return str.join(', ');
	},
/**
 * System.BlogPress.Page.remove(post) -> void
 * - evenement (Post): Instance d'un événement.
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(win, comment){
		comment = new System.BlogPress.Comment(comment);
		//
		// Splite
		//
		var splite = 			new SpliteIcon($MUI('Voulez-vous vraiment supprimer ce commentaire') + ' ? ');
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = win.createBox();
		
		box.setTitle($MUI('Suppression du commentaire')).a(splite).setIcon('delete').setType().show();
				
		$S.fire('blogpress:comment.remove.open', box);
				
		box.submit({
			text: $MUI('Supprimer le commentaire'),
			click:function(){
			
				var evt = new StopEvent(box);
				$S.fire('blogpress:comment.remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				comment.remove(function(){
					box.hide();
						
					$S.fire('blogpress:comment.remove.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('Le commentaire a bien été supprimé'));
					splite.setIcon('valid-48');
					
					
					box.setTitle($MUI('Confirmation')).setContent(splite).setType('CLOSE').Timer(5).show();
					box.getBtnReset().setIcon('cancel');
					box.setIcon('documentinfo');
						
					System.BlogPress.Comment.CountDraft();
					
				}.bind(this));
				
			}.bind(this)
		});
	}
});

System.BlogPress.Comment.initialize();


/** section: Core
 * class System.BlogPress.Comment.Button
 **/
System.BlogPress.Comment.Button = Class.from(AppButton);
System.BlogPress.Comment.Button.prototype = {
	
	className:'wobject market-button comment-button overable',
/**
 * new System.BlogPress.Comment.Button([options])
 **/	
	initialize:function(obj){
		
		var options = {
			comment: 	0,
			note:		0,
			nbNote:		0,
			subTitle:	$MUI('All'),
			overable:	true,
			tag:		false
		};
		
		Object.extend(options, obj || {});
		
		if(options.category == 'All'){
			options.category = 'Uncategorized';
		}
		//
		//
		//
		this.SubTitle = new Node('span', {className:'wrap-subtitle'}, $MUI(options.subTitle));
		//
		//
		//
		this.Message = 	new TextArea();
		this.Message.addClassName('wrap-message');
		this.Message.Value(options.comment);
		//
		//
		//
		this.Note = 	new StarsRating();
		//
		//
		//
		this.BtnInfo = new SimpleButton({nofill:true, icon:'info'});
		//
		//
		//
		this.BtnRemove = new SimpleButton({nofill:true, icon:'remove-element'});
		//
		//
		//
		this.BtnSpam = new SimpleButton({nofill:true, icon:'spam-element'});
		//
		//
		//
		this.BtnEnable = new SimpleButton({nofill:true, icon:'valid-element'});
		
		this.GroupButton = new Node('div', {className:'wrap-button'}, [
			this.BtnInfo,
			this.BtnEnable,
			this.BtnSpam,
			this.BtnRemove
		]);
				
		this.appendChild(this.SubTitle);
		this.appendChild(this.Note);
		this.appendChild(this.Message);
		this.appendChild(this.GroupButton);
		
		if(options.tag){
			this.setTag(options.tag);
		}
		
		this.setRating(options.note, options.nbNote);
		//this.Overable(options.overable);
		
		if(options.icon == ''){
			this.addClassName('no-icon');	
		}
	},
/**
 * System.BlogPress.Comment.Button#setRating(note, nbNote) -> System.MyStore.Product.Button
 **/	
	setRating:function(note, nbNote){
		this.Note.setRating(note, nbNote);
	},
/**
 * System.BlogPress.Comment.Button#setSubTitle(price) -> System.MyStore.Product.Button
 **/	
	setSubTitle:function(title){
		this.Message.innerHTML = title;
		return this;
	},
/**
 * System.BlogPress.Comment.Button#setComment(price) -> System.MyStore.Product.Button
 **/	
	setComment:function(comment){
		this.SubTitle.innerHTML = title;
		return this;
	},
	
	Overable:function(bool){
		this.removeClassName('overable');
		
		if(bool){
			this.addClassName('overable');	
		}
	}
};
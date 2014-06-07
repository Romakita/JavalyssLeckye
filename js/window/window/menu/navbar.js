/** section: Menu
 * class NavBar < DropMenu
 *
 * Cette classe permet de créer une barre de navigation hérité de [[DropMenu]].
 * 
 **/
var NavBar = Class.from(DropMenu);

NavBar.prototype = {
	__class__:	'navbar',
/**
 * NavBar#BtnViewBy5 -> SimpleButton
 * Bouton d'affichage par 5 (ou valeur personnalisée).
 **/
	BtnViewBy5:			null,
/**
 * NavBar#BtnViewBy10 -> SimpleButton
 * Bouton d'affichage par 10 (ou valeur personnalisée).
 **/
	BtnViewBy10:		null,
/**
 * NavBar#BtnViewBy20 -> SimpleButton
 * Bouton d'affichage par 20 (ou valeur personnalisée).
 **/
	BtnViewBy20:		null,
/**
 * NavBar#RANGE_1 -> Number
 * Valeur d'affichage du premier bouton.
 **/
	RANGE_1:			10,
/**
 * NavBar#RANGE_2 -> Number
 * Valeur d'affichage du second bouton.
 **/
	RANGE_2:			20,
/**
 * NavBar#RANGE_3 -> Number
 * Valeur d'affichage du troisième bouton.
 **/
	RANGE_3:			30,
/**
 * NavBar#clauses -> Clauses
 * Clauses d'affichage de la liste.
 **/
	clauses: 			null,
/**
 * new NavBar()
 * 
 * Cette méthode créée une nouvelle instance du gestionnaire de menu.
 **/
	initialize:function(obj){
		var self =  this;
		
		var options = {
			range1:		10,
			range2:		20,
			range3:		30
		};
		
		Object.extend(options, obj || {});
		
		this.RANGE_1 = 		options.range1;
		this.RANGE_2 = 		options.range2;
		this.RANGE_3 = 		options.range3;
		
		this.clauses = 				new Clauses();
		this.clauses.pagination =	options.range1;
		
		this.addClassName('navbar');
		//
		//
		//
		this.GroupNavigation = 	new GroupButton();
		this.GroupNavigation.hide();
		//
		//Btn
		//	
		this.BtnPrev =			new SimpleButton({icon:'prev'});
		//
		//Btn
		//	
		this.BtnNext =			new SimpleButton({icon:'next'});
		this.GroupNavigation.appendChilds([this.BtnPrev, this.BtnNext]);
		this.appendChild(this.GroupNavigation);
		//
		// Paging
		//
		this.Paging = 			this.addPaging();
		this.Paging.hide();
		
		this.GroupPaging = 		new GroupButton();
		this.GroupPaging.Selectable(true);
		this.GroupPaging.hide();
		this.appendChild(this.GroupPaging);
		//
		//Btn
		//
		this.BtnViewBy10 = 		new SimpleButton({text:''+options.range1, icon:'list'});
		this.BtnViewBy10.Selected(true);
		this.appendChild(this.BtnViewBy10);
		//
		//Btn
		//
		this.BtnViewBy20 = 		new SimpleButton({text:''+options.range2, icon:'list'});
		this.appendChild(this.BtnViewBy20);
		//
		//Btn
		//
		this.BtnViewBy30 = 		new SimpleButton({text:''+options.range3, icon:'list'});
		this.appendChild(this.BtnViewBy30);
		
		
		this.Paging.observe('change', function(){
			this.clauses.page = this.Paging.Page();
			this.fire('change');
		}.bind(this));
		
		this.BtnViewBy10.observe('click', function(){
			this.clauses.pagination = this.RANGE_1;
			this.clauses.page = 0;
			this.fire('change');
		}.bind(this));
		
		this.BtnViewBy20.observe('click', function(){
			this.clauses.pagination = this.RANGE_2;
			this.clauses.page = 0;
			this.fire('change');
		}.bind(this));
		
		this.BtnViewBy30.observe('click', function(){
			this.clauses.pagination = this.RANGE_3;
			this.clauses.page = 0;
			this.fire('change');
		}.bind(this));
		
		this.BtnPrev.observe('click', this.previous.bind(this));
		this.BtnNext.observe('click', this.next.bind(this));
		
		this.setMaxLength(0);
	},
/**
 * NavBar#observe(eventName, callback) -> NavBar
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 **/
	observe: function(eventName, callback){
		switch(eventName){
			case 'change':
				this.observe('navbar:' + eventName, callback);
				break;
			
			default:
				Event.observe(this, eventName, callback);
				break;	
		}
		return this;
	},
/**
 * NavBar#fire(eventName[, memo[, bubble = true]]) -> NavBar
 * - eventName (String): Nom de l'événement.
 *
 * Cette méthode déclenche l'événement `eventName`.
 **/	
	fire:function(eventName, memo, bubble){
		
		switch(eventName){
			case 'change':
				this.fire('navbar:' + eventName, memo, bubble);
				break;
			
			default:
				Event.fire(this, eventName, memo, bubble);
				break;	
		}
		
		return this;
	},
/**
 * NavBar#stopObserving(eventName, callback) -> NavBar
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` associé à un nom d'événement `eventName`.
 **/
	stopObserving: function(eventName, callback){
		switch(eventName){
			case 'change':
				this.stopObserving('navbar:' + eventName, callback);
				break;
			
			default:
				Event.observe(this, eventName, callback);
				break;		
		}
		return this;
	},
/**
 * NavBar#next() -> NavBar
 **/
	next: function(){

		this.clauses.page = (this.clauses.page + 1) % Math.ceil(this.maxLength / this.clauses.pagination);
		
		this.fire('change');
		return this;
	},
/**
 * NavBar#previous() -> NavBar
 **/
	previous: function(){
		
		var maxPage = Math.ceil(this.maxLength / this.clauses.pagination);
		
		this.clauses.page = (this.clauses.page - 1) % maxPage;
		this.clauses.page = (this.clauses.page == -1) ? maxPage - 1 : this.clauses.page;
		
		this.fire('change');
		return this;
	},
/**
 * NavBar#refresh() -> NavBar
 *
 * Cette méthode actualise l'affichage des boutons de navigation de la barre.
 **/	
	refresh:function(){
		
		this.GroupPaging.appendChilds([this.BtnViewBy10, this.BtnViewBy20, this.BtnViewBy30]);
		this.GroupPaging.hide();
		this.clauses.maxLength = this.maxLength;
		
		if(this.maxLength == 0){
			
			this.GroupNavigation.hide();
			this.Paging.hide();
			this.GroupPaging.hide();
			return;	
		}
		
		var nbPage = Math.ceil(this.maxLength / this.clauses.pagination);
		
		if(!isNaN(nbPage * 1)){
			
			this.GroupNavigation.show();
			this.Paging.show();
			
			this.Paging.setMaxLength(nbPage);
			this.Paging.setPageNumber(this.clauses.page);
			
			if($R(0, this.RANGE_1).include(this.maxLength)){
				this.GroupPaging.hide();
			}else{
				
				if($R(this.RANGE_1, this.RANGE_2).include(this.maxLength)){
					this.GroupPaging.show();
					this.GroupPaging.removeChild(this.BtnViewBy30);
				}else{
						
					if($R(this.RANGE_2, this.RANGE_3).include(this.maxLength)){
						this.GroupPaging.show();
					}else{
					
						if(this.RANGE_3 < this.maxLength){
							this.GroupPaging.show();
						}
					}
				}
			}
			
			if(nbPage <= 1){
				this.GroupNavigation.hide();
				this.Paging.hide();	
			}
			
		}else{
			this.GroupNavigation.hide();
			this.Paging.hide();
			this.GroupPaging.hide();
		}
		
		return this;
	},
/**
 * NavBar#setMaxLength(maxLength) -> NavBar
 * - maxLength (Number): Nombre maximal d'élément affichable.
 *
 * Cette méthode change le nombre d'élément maximal à paginer.
 **/	
	setMaxLength:function(maxLength){
		this.maxLength = 1 * maxLength;
		return this.refresh();
	},
/**
 * NavBar#setRanges(range, rangeTwo, rangeThree) -> NavBar
 *
 * Cette méthode permet d'assigner le nombre de ligne affichée pour chaque boutton de l'instance.
 **/
	setRanges: function(r1, r2, r3){
		if(Object.isUndefined(r1)) return this;
		
		this.RANGE_1 = r1;
		this.clauses.pagination = 	this.RANGE_1;
		this.BtnViewBy10.setText(this.RANGE_1);
		
		if(!Object.isUndefined(r2)){
			this.RANGE_2 = r2;
			this.BtnViewBy20.setText(this.RANGE_2);
		}
		if(!Object.isUndefined(r3)){
			this.RANGE_3 = r3;
			this.BtnViewBy30.setText(this.RANGE_3);
		}
		
		return this;
	},
/**
 * NavBar#getClauses() -> Clauses
 **/	
	getClauses:function(){
		return this.clauses;	
	}
};

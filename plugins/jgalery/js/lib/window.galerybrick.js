var l10n_str = l10n_str || {},
    just_clicked_browse_months = false;
/** section: UI
 * class GaleryBrick
 * Cette classe créée un mur de photo sous forme de brique.
 **/
var GaleryBrick = Class.createSprite('div');

GaleryBrick.prototype = {
	__class__:	'galery-brick',
	className:	'wobject galery-brick',
/**
 * GaleryBrick#rebuildingColumns -> Boolean
 **/
	rebuildingColumns: 		false,
/**
 * GaleryBrick#layingBricks -> Boolean
 **/
	layingBricks: 			false,
/**
 * GaleryBrick#columnWidth -> Number
 **/
	columnWidth:			125,
/**
 * GaleryBrick#columnFullWidth -> Number
 **/
	columnFullWidth: 		0,
/**
 * GaleryBrick#bottomMargin -> Number
 **/
	bottomMargin:			30,
/**
 * GaleryBrick#columns -> Number
 **/
	columns:				1,
/**
 * GaleryBrick#currentColumn -> Number
 **/
	currentColumn: 			0,
/**
 * GaleryBrick#columnHeights -> Array
 **/
	columnHeights: 			null,
/**
 * GaleryBrick#tallestColumn -> Number
 **/
	tallestColumn:			0,
/**
 * GaleryBrick#contentWidth -> Number
 **/
	contentWidth:			null,
/**
 * GaleryBrick#contentPadding -> Number
 **/
	contentPadding:			0,
/**
 * GaleryBrick#headings -> Number
 **/
	headings:				0,
/**
 * GaleryBrick#headingHeight -> Number
 **/
	headingHeight:			1,
/**
 * GaleryBrick#tooBigToAnimate -> Boolean
 **/
	tooBigToAnimate:		false,
/**
 * GaleryBrick#wayTooBigToAnimate -> Boolean
 **/
	wayTooBigToAnimate: 	false,
/**
 * GaleryBrick#qeue -> Array
 **/
	queue:					[],
/**
 * GaleryBrick#currentUrl -> String
 **/
	currentUrl:				document.location.href,
/**
 * GaleryBrick#lastPostTime -> ?
 **/
	lastPostTime:			null,
/**
 * GaleryBrick#lastPostTimeFetched -> ?
 **/
	lastPostTimeFetched:	null,
/**
 * GaleryBrick#loadingPage -> Boolean
 **/
	loadingPage:			false,
/**
 * GaleryBrick#nextPage -> Boolean
 **/
	nextPage:				true,
/**
 * new GaleryBrick()
 *
 * Créée une nouvelle instance [[GaleryBrick]].
 **/
 	initialize:function(options){
		
		if(!Object.isUndefined(options)){
			Object.extend(this, options);	
		}
			
		this.columnHeights = 	[];
		this.queue =			[];		
		this.hide();
	},
/**
 * GaleryBrick#start() -> void
 *
 * Cette méthode lance les effets de transition de la galerie et met en forme les photos sous forme de brique.
 **/	
	start: function(){
		
		new Timer(function () {
			
			if (this.queue.length) {
				
				el = this.queue.shift();
				
				var new_height = 	el.getHeight() + parseInt(el.css('top'), 10);
				var body = 			el.parentNode;
				
				if (!body.css('height') || new_height > parseInt(body.css('height'), 10)) {
					body.css('height', new_height);
				}
				
				if(this.parentNode){
					if(this.parentNode.parentNode.hasClassName('scroll-bar-content')){
						this.parentNode.parentNode.refresh();
					}
				}
				
				el.removeClassName('hide');
				el.addClassName('show');
				
			}
		}.bind(this), 0.05).start();
		
		this.show();
		
		//récupération du décalage
		var node  = 			this.select('.wrap-body a');
		
		if(node.length){
			node =					node[0];
			this.margin =			node.css('margin-right');
			this.marginFull =		node.css('border-right-width') * 2 + this.margin;
			this.columnWidth =		node.css('width') + node.css('padding-left') + node.css('padding-right');
			
			this.columnFullWidth = 	this.columnWidth + this.marginFull;
			this.contentPadding = 	this.css('margin-left') + this.css('border-left-width');
			
			this.select('.brick', '.wrap-header').invoke('removeClassName', 'hide').invoke('addClassName', 'hide');
			
			this.buildColumns();
			//this.layBricks();
			new PeriodicalExecuter(this.layBricks.bind(this), 0.2);	
		}
	},
/**
 * GaleryBrick#buildColumns() -> void
 **/
	buildColumns: function(reset) {
		
		this.contentWidth = 	this.select('.one-galery')[0].css('width') - this.contentPadding * 2;
		this.columns = 			Math.floor(this.contentWidth / this.columnFullWidth);
				
		if(reset) {
			this.rebuildingColumns =	true;
			this.tallestColumn = 		0;
			this.columnHeights = 		[];
			this.currentColumn =		0;
			this.headings = 			0;
			this.layBricks(false, true);
			this.rebuildingColumns = false
		}
	},
/**
 * GaleryBrick#layBricks(timer, reset) -> void
 **/
	layBricks: function(pe, reset) {
		if (this.layingBricks) return;
		
		this.layingBricks = true;
		
		this.select('.wrap-header', '.wrap-body').each(function(node){
				
			if(this.rebuildingColumns && !reset) return;
			if(node.css('position') == 'absolute' && !reset) return;
			var animate = (node.css('position') != 'absolute' && !this.wayTooBigToAnimate);
			
			if (node.hasClassName('wrap-header')) {
				if(animate) {
					this.queue.push(node);
				}
			}else {
				if(node.hasClassName('wrap-body')) {
					
					for (i = 0; i < this.columns; i++) {
						this.columnHeights[i] = 1;
					}
					
					this.currentColumn = 0;
					this.tallestColumn = 0;
					
					node.select('.brick.photo').each(function(node){
						this.draw(node, animate);
					}.bind(this));
				}
			}
			
			pe.stop();
			
		}.bind(this));
						
				
		this.layingBricks = false
	},
/**
 *
 **/	
	draw:function(el, animate){
		this.lastPostTime = el.className.replace(/[^0-9]*/g, '');
				
		if(animate) {
			el.removeClassName('hide');
			el.addClassName('hide');
		}
		
		el.css('position', 'absolute').css('left', (this.columnFullWidth * this.currentColumn) + 'px');
		el.css('top', (this.columnHeights[this.currentColumn]) + 'px').css('height', 'auto');
		
		var height = el.getHeight();
		
		if(!height) {
			height = 125;
		}
			
		this.columnHeights[this.currentColumn] += height + this.margin;
		
		if(animate){
			this.queue.push(el);
		}
				
		if(this.columnHeights[this.currentColumn] > this.columnHeights[this.tallestColumn]){
			this.tallestColumn = this.currentColumn;
		}
		
		this.columnHeights.each(function (height, column) {
			if (!this.columnHeights[this.currentColumn] || height < this.columnHeights[this.currentColumn]) {
				this.currentColumn = column;
			}
		}.bind(this));
					
	},
/**
 * GaleryBrick#columnsNeedRebuilding() -> void
 **/	
	columnsNeedRebuilding: function() {
		if (this.tooBigToAnimate) return false;
		
		var new_contentWidth = 	document.body.getDimensions().width - this.contentPadding * 2;
		var new_columns = 		Math.floor(new_contentWidth / this.columnFullWidth);
		return (new_columns !== this.columns);
	}
};

GaleryBrick.Transform = function(e){
	
	if(Object.isElement(e)){
		
		var g =		new GaleryBrick();
		g.addClassName(e.className);
		g.appendChilds(e.childElements());
		
		g.removeClassName('box-galery-brick');
				
		e.replaceBy(g);
		g.start();
		
		return g;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(GaleryBrick.Transform(e));
	});
	
	return options;
};

$WR.ready(function(){
	GaleryBrick.Transform(current ='.box-galery-brick');
});
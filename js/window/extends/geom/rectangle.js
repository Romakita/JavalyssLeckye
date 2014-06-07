/** section: Geom
 * class Rectangle
 * Un objet [[Rectangle]] est une zone définie par sa position, indiquée par son angle supérieur gauche (x, y), ainsi que par sa largeur et sa hauteur.
 **/
var Rectangle = Class.create();
Rectangle.prototype = {
/**
 * Rectangle.x -> Number
 * Coordonnée x du coin supérieur gauche du rectangle. La modification de la valeur de la propriété x d'un objet [[Rectangle]] n'a pas d'effet sur les propriétés y, width et height.
 **/
	x:		0,
/**
 * Rectangle.y -> Number
 * Coordonnée y du coin supérieur gauche du rectangle. La modification de la valeur de la propriété y d'un objet [[Rectangle]] n'a pas d'effet sur les propriétés x, width et height.
 **/
	y:		0,
/**
 * Rectangle.width -> Number
 * Largeur du rectangle, en pixels. La modification de la valeur width d'un objet Rectangle n'a pas d'effet sur les propriétés x, y et height.
 **/
	width:	0,
/**
 * Rectangle.height -> Number
 * Hauteur du rectangle en pixels. La modification de la valeur height d'un objet Rectangle n'a pas d'effet sur les propriétés x, y et width.
 **/
	height:	0,
/**
 * new Rectangle()
 * new Rectangle(x, y, width, height)
 * new Rectangle(node)
 * new Rectangle(node, relative)
 * - x (Number): Coordonnée x du coin supérieur gauche du rectangle.
 * - y (Number): Coordonnée y du coin supérieur gauche du rectangle.
 * - width (Number): Largeur du rectangle en pixels.
 * - height (Number): Hauteur du rectangle en pixels.
 * - node (Element): Element du DOM à convertir en object équivalent à [[Rectangle]].
 * - relative (Boolean): definit si le calcul de positionnement doit être fait de façon relative ou absolue.
 *
 * Crée un objet [[Rectangle]] dont le coin supérieur gauche est déterminé par les paramètres x et y, avec des paramètres width et height spécifiés.
 **/
	initialize: function(x, y, width, height){
		
		if(Object.isElement(x)){
			this.x = 		y ? x.cumulativeOffset() : x.positionedOffset();
			this.y = 		this.x.top;
			this.x = 		this.x.left;
			this.height = 	x.getHeight();
			this.width =	x.getWidth();
		}else{
			if(!Object.isUndefined(x)){
				this.x = x;
			}
			if(!Object.isUndefined(y)){
				this.y = y;
			}
			if(!Object.isUndefined(width)){
				this.width = width;
			}
			if(!Object.isUndefined(height)){
				this.height = height;
			}
		}
	},
/**
 * Rectangle.clone() -> Rectangle
 *
 * Crée une copie de cet objet [[Rectangle]].
 **/
 	clone: function(){
		return new Rectangle(this.x, this.y, this.width, this.height);
	},
/**
 * Rectangle.contains(p) -> Boolean
 * Rectangle.contains(x, y) -> Boolean
 * - p (Point): Le point, tel qu'il est représenté par ses coordonnées x et y.
 * - x (Number): Coordonnée x (position horizontale) du point.
 * - y (Number): Coordonnée y (position verticale) du point.
 *
 * Détermine si le point spécifié figure dans la zone rectangulaire définie par cet objet [[Rectangle]].
 **/
 	contains: function(x, y){
		if(Object.isUndefined(y)){
			y = x.y;
			x = x.x;
		}
		
		return this.x <= x && x <= (this.x + this.width) && this.y <= y && (y <= this.y + this.height);
	},
/**
 * Rectangle.moveTo(x, y) -> Point
 * - x (Number): Valeur pour la coordonnée horizontale, `x`.
 * - y (Number): Valeur pour la coordonnée verticale, `y`.
 *
 * Change les coordonnées du [[Rectangle]].
 **/	
	moveTo: function(x, y){
		this.x = x;
		this.y = y;
	},
/**
 * Rectangle.containsRect(rect) -> Boolean
 * - rect (Rectangle): Objet Rectangle en cours de vérification.
 *
 * Détermine si l'objet [[Rectangle]] spécifié par le paramètre `rect` figure dans cet objet [[Rectangle]]. 
 * On dit qu'un objet [[Rectangle]] en contient un autre si ce dernier est entièrement circonscrit dans les limites du premier.
 **/	
	containsRect: function(rect){
		return this.contains(rect.x, rect.y) && this.contains(rect.x + rect.width, rect.y) && this.contains(rect.x, rect.y + rect.height) && this.contains(rect.x + rect.width, rect.y + rect.height);
	},
/**
 * Rectangle.equals(rect) -> Boolean
 * - rect (Rectangle): Rectangle que vous voulez comparer à cet objet [[Rectangle]].
 * 
 * Détermine si l'objet spécifié dans le paramètre `rect` est égal à cet objet [[Rectangle]]. 
 * Cette méthode compare les propriétés `x`, `y`, `width` et `height` d'un objet aux mêmes propriétés de cet objet [[Rectangle]].
 **/
	equals: function(rect){
		return this.x == rect.x && this.y == rect.y && this.width == rect.width && this.height == rect.height;
	},
/**
 * Rectangle.inflate(p) -> void
 * Rectangle.inflate(dx, dy) -> void
 * - dx (Number):
 * - dy (Number):
 * - p (Point):	
 *
 * Agrandit l'objet [[Rectangle]] en fonction des quantités spécifiées, en pixels. 
 * Le point central de l'objet [[Rectangle]] reste inchangé tandis que sa taille augmente de la valeur de `dx` sur la gauche et la droite, et de la valeur de `dy` vers le haut et bas.
 **/	
	inflate: function(x, y){
		if(Object.isUndefined(y)){
			y = x.y;
			x = x.x;
		}
		
		this.x -=		x;
		this.width += 	2 * x;
	
		this.y -= 		y;
    	this.height += 	2 * y;
		
		return this;
	},
/**
 * Rectangle.intersection(rect) -> Rectangle
 * - rect (Rectangle): Objet [[Rectangle]] à prendre comme comparaison pour voir s'il recoupe cet objet [[Rectangle]].
 * 
 * Si l'objet [[Rectangle]] spécifié dans le paramètre `rect` forme une intersection avec cet objet Rectangle, la zone d'intersection est renvoyée en tant qu'objet [[Rectangle]]. 
 * Si les rectangles ne se recoupent pas, cette méthode renvoie un objet [[Rectangle]] vide dont les propriétés sont définies sur 0.
 **/
	intersection: function(rect){
		if(this.containsRect(rect)) return new Rectangle();
		if(!this.intersects(rect)) return new Rectangle();
		
		var inter = new Rectangle();
		
		inter.x = 		Math.max(this.x, rect.x);
		inter.y = 		Math.max(this.y, rect.y);
		inter.width = 	Math.min(this.x + this.width, rect.x + rect.width) - inter.x;
		inter.height = 	Math.min(this.y + this.height, rect.y + rect.height) - inter.y;
		
		return inter;
	},
/**
 * Rectangle.intersects(rect) -> Boolean
 * - rect (Rectangle): Objet [[Rectangle]] à comparer à cet objet [[Rectangle]].
 *
 * Détermine si l'objet spécifié par le paramètre `rect` forme une intersection avec cet objet [[Rectangle]]. 
 * Cette méthode vérifie les propriétés `x`, `y`, `width` et `height` de l'objet [[Rectangle]] spécifié pour déterminer s'il recoupe cet objet [[Rectangle]].
 **/
	intersects: function(rect){
		//console.log(rect.x + rect.width);		
		return this.contains(rect.x, rect.y) 
				|| this.contains(rect.x + rect.width, rect.y) 
				|| this.contains(rect.x, rect.y + rect.height) 
				|| this.contains(rect.x + rect.width, rect.y + rect.height) 
				|| rect.contains(this.x, this.y)
				|| rect.contains(this.x + this.width, this.y) 
				|| rect.contains(this.x, this.y + this.height)
				|| rect.contains(this.x + this.width, this.y + this.height) ;
	},
/**
 * Rectangle.isEmpty() -> Boolean
 *
 * Détermine si cet objet Rectangle est vide. Si la largeur ou la hauteur de l'objet [[Rectangle]] est inférieure ou égale à 0, true est renvoyé ; false dans le cas contraire.
 **/
	isEmpty: function(){
		return this.width <= 0 || this.height <= 0;	
	},
/**
 * Rectangle.offset(p) -> void
 * Rectangle.offset(dx, dy) -> void
 * - dx (Number): Déplace en fonction de cette quantité la valeur x de l'objet [[Rectangle]].
 * - dy (Number): Déplace en fonction de cette quantité la valeur y de l'objet [[Rectangle]].
 * - p (Point): Objet [[Point]] à utiliser pour décaler cet objet [[Rectangle]].
 *
 * Règle la position de l'objet [[Rectangle]], identifié par son coin supérieur gauche, en fonction des quantités spécifiées.
 **/	
	offset: function(dx, dy){
		if(Object.isUndefined(dy)){
			dy = dx.y;
			dx = dx.x;
		}
		this.x += dx;
		this.y += dy;
	},
/**
 * Rectangle.Right([right]) -> Number
 * - right (Number):  Coordonnée x (position horizontale).
 **/
 	Right:function(right){
		if(!Object.isUndefined(right)){
			this.width = right - this.x;
		}
		return this.width;
	},
/**
 * Rectangle.Bottom([bottom]) -> Number
 * - bottom (Number):  Coordonnée y (position verticale).
 **/
 	Bottom:function(bottom){
		if(!Object.isUndefined(bottom)){
			this.height = bottom - this.y;
		}
		return this.height;
	},
/**
 * Rectangle.setEmpty() -> void
 *
 * Définit toutes les propriétés de l'objet [[Rectangle]] sur 0. Un objet [[Rectangle]] est vide si sa largeur ou sa hauteur est inférieure ou égale à 0.
 *
 * Cette méthode règle les valeurs des propriétés `x`, `y`, `width` et `height` sur 0.
 **/
	setEmpty: function(){
		this.x = 		0;
		this.y = 		0;
		this.width = 	0;
		this.height = 	0;	
	},
/**
 * Rectangle.toString() -> String
 *
 * Crée et renvoie une chaîne qui répertorie les positions horizontale et verticale ainsi que la largeur et la hauteur de l'objet [[Rectangle]].
 **/
	toString: function(){
		return "(x="+this.x+", y="+this.y+", w=" + this.width + ", h=" + this.height + ")";	
	},
/**
 * Rectangle.union(rect) -> Rectangle
 * - rect (Rectangle): 
 *
 * Additionne deux rectangles pour créer un nouvel objet [[Rectangle]] en remplissant l'essentiel de l'espace horizontal et vertical qui les sépare.
 **/	
	union: function(rect){
		var union = new Rectangle();
		
		union.x = 		Math.min(this.x, rect.x);
		union.y = 		Math.min(this.y, rect.y);
		union.width = 	Math.max(this.x + this.width, rect.x + rect.width) - union.x;
		union.height = 	Math.max(this.y + this.height, rect.y + rect.height) - union.y;
		
		return union;
	}
};
/** section: Geom
 * class Point
 * L'objet [[Point]] représente un emplacement dans un système de coordonnées à deux dimensions où `x` est l'axe horizontal et `y` l'axe vertical. 
 **/
var Point = Class.create();
Point.prototype = {
/**
 * Point.x -> Number
 * Les coordonnées horizontales du point. La valeur par défaut est 0. 
 **/
	x: 0,
/**
 * Point.y -> Number
 * Les coordonnées verticales du point. La valeur par défaut est 0. 
 **/
	y: 0,
/**
 * new Point(x, y)
 * - x (Number):  
 * Crée un nouveau point. Si vous ne transmettez pas de paramètres à cette méthode, un point est créé aux coordonnées (0,0). 
 **/
	initialize: function(x, y){
		if(!Object.isUndefined(x)){
			this.x = x;
			this.y = y;
		}
	},
/**
 * Point.add(p) -> Point
 * - p (Point): Le point à ajouter.
 *
 * Ajoute les coordonnées d'un autre point à celles de ce point pour créer un nouveau point. 
 **/
 	add: function(p){
		return new Point(this.x + p.x, this.y + p.y);
	},
/**
 * Point.clone() -> Point
 *
 * Crée une copie de cet objet [[Point]].
 **/
 	clone: function(){
		return new Point(this.x, this.y);
	},
/**
 * Point.compare(p) -> Number
 * - p (Point): Le point à comparer.
 *
 * Compare deux points et retourne soit -1 si `p` est inférieur à l'instance, 0 si `p` est égale à l'instance et 1 si `p` est suppérieur à l'instance.
 **/	
	compare:function(p){
		if(this.x == p.x && this.y == p.y) return 0;
		if(p.x >= this.x && p.y >= this.y) return 1;
		return -1;
	},
/**
 * Point.degreesTo(p) -> Number
 * - p (Point): Instance Point.
 *
 **/	
	degreesTo:function(v){
		var dx = this.x - v.x;
		var dy = this.y - v.y;
		var angle = Math.atan2(dy, dx); // radians
		return angle * (180 / Math.PI); // degrees
	},
/**
 * Point.distanceTo(p) -> Number
 * - p (Point): Instance Point.
 *
 * Retourne la distance entres deux points, l'instance et `p`.
 **/
	distanceTo:function(p){
		var dx = this.x - p.x;
		var dy = this.y - p.y;
		return Math.sqrt(dx * dx + dy * dy);
	},
/**
 * Point.equals(p) -> Point
 * - p (Point): Point à comparer.
 *
 * Détermine si deux points sont égaux. Deux points sont considérés comme égaux s'ils ont les mêmes valeurs `x` et `y`. 
 **/	
	equals: function(p){
		return this.x == p.x && this.y == p.y;
	},
/**
 * Point.interpolate(p, f) -> Point
 * - p (Point): Instance point.
 * - f (Number): Niveau d'interpolation entre les deux points. Indique l'emplacement du nouveau point sur la ligne reliant l'`instance` et `p`. Si `f = 1`, l'`instance` est renvoyé ; si `f = 0`, `p` est renvoyé.
 *
 * Détermine un point entre deux points spécifiés. 
 * Le paramètre `f` détermine l'emplacement du nouveau point interpolé par rapport aux deux points d'extrémité spécifiés par l'`instance` et le paramètre `p`. 
 * Plus la valeur du paramètre `f` est proche de `1.0`, plus le point interpolé est proche du premier point (instance). 
 * Plus la valeur du paramètre `f` est proche de `0`, plus le point interpolé est proche du second point (paramètre p).  
 **/	
	interpolate: function(v, f){
		new Point((this.x + v.x) * f, (this.y + v.y) * f);
	},
/**
 * Point.length() -> Number
 *
 * La longueur du segment de ligne de `(0,0)` à ce point.
 **/	
 	length: function(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},
/**
 * Point.moveTo(x, y) -> Point
 * - x (Number): Valeur pour la coordonnée horizontale, `x`.
 * - y (Number): Valeur pour la coordonnée verticale, `y`.
 *
 * Change les coordonnées du [[Point]].
 **/	
	moveTo: function(x, y){
		this.x = x;
		this.y = y;
	},
/**
 * Point.normalize(thickness) -> void
 * - tichkness (Number): Valeur de redimensionnement. Si, par exemple, le point actuel se trouve à (0,5) et que vous le normalisez à 1, les coordonnées du point renvoyé sont (0,1).
 *
 * Met à l'échelle le segment de ligne entre (0,0) et le point actuel en fonction d'une longueur définie.
 **/	
	normalize: function(thickness){
		var l = this.length();
		this.x = this.x / l * thickness;
		this.y = this.y / l * thickness;
	},
/**
 * Point.offset(dx, dy) -> void
 * - dx (Number): Valeur de décalage pour la coordonnée horizontale, `x`.
 * - dy (Number): Valeur de décalage pour la coordonnée verticale, `y`. 
 *
 * Met à l'échelle le segment de ligne entre (0,0) et le point actuel en fonction d'une longueur définie.
 **/	
	offset: function(dx, dy){
		this.x += dx;
		this.y += dy;
	},
/**
 * Point.orbit(origin, arcWidth, arcHeight, degrees) -> void
 * - origin (Point):
 * - arcWidth (Number):
 * - arcHeight (Number):
 * - degrees (Number):
 *
 **/
	orbit:function(origin, arcWidth, arcHeight, degrees){
		var radians = degrees * (Math.PI / 180);
		this.x = origin.x + arcWidth * Math.cos(radians);
		this.y = origin.y + arcHeight * Math.sin(radians);
	},
/**
 * Point.polar(len, angle) -> Point
 * - len (Number): Coordonnée de longueur de la paire polaire.
 * - angle (Number): Angle, en radians, de la paire polaire. 
 *
 * Convertit une paire de coordonnées polaires en coordonnées cartésiennes.
 **/	
	polar: function(len, angle){
		return new Point(len * Math.sin(angle), len * Math.cos(angle));
	},
/**
 * Point.substract(v) -> Point
 * - v (Point): Point à soustraire.
 *
 * Soustrait les coordonnées d'un autre point à celles de ce point pour créer un nouveau point.
 **/
 	substract: function(v){
		return new Point(this.x - v.x, this.y - v.y);
	},
/**
 * Point.toString(v) -> String
 *
 * Renvoie une chaîne qui contient les valeurs des coordonnées `x` et `y`. 
 * La chaîne se présente au format `(x=x, y=y)` ; par conséquent, l'appel de la méthode `toString()` pour un point se trouvant à `23,17` renvoie `(x=23, y=17)`. 
 **/	
	toString: function(){
		return "(x=" + this.x + ", y=" + this.y + ")";
	},
/**
 * Point.inArea(p1, p2) -> Boolean
 **/
	inArea: function(p1, p2){
		return p1.x <= this.x && this.x <= p2.x && p1.y <= this.y && this.y <= p2.y; 
	}
};

Point.FromEvent = function(event){
	return new Point(Event.pointerX(event), Event.pointerY(event));
};

Point.FromCSS = function(css){
	return new Point(css.left, css.top);
};
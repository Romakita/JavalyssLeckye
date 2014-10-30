/** section: lang
 * class Timer
 * Gestionnaire de temps. Cette classe appellera un nombre de fois paramètré une fonction qui lui est associé.
 **/
var Timer = $.Timer = $.Class.create();
Timer.prototype = {
	isStart:	false,
	callback:	null,
/** 
 * Timer.frequency -> Number
 **/
	frequency:	0,
	timer:		null,
/** 
 * Timer.cycle -> Number
 **/
	cycle:		0,
/**
 * new Timer(callback, frequency [, cycle])
 * - callback (Function): Fonction à appeller à chaque top d'horloge.
 * - frequency (Number): Durée de la temporisation avant appel de la fonction `callback`.
 * - cycle (Number): Nombre de boucle avant l'arret du timer. par défaut le nombre boucle est illimité.
 *
 * Initialise une nouvelle temporisation qui appellera un nombre de `cycle` paramètré la fonction `callback`. 
 *
 * ##### Exemples
 *
 * Dans cet exemple nous allons créer un [[Timer]] sans cycle :
 * 
 *     var timer = new Timer(
 *          function(){alert("hello world");},//callback
 *          10 //fréquence
 *     );
 *     timer.start();
 *
 * Dans ce second exemple nous allons créer un [[Timer]] avec cycke :
 *
 *     var timer = new Timer(
 *          function(pe){alert("Cycle : " + pe.cycle);}, //pe est l'instance du Timer.
 *          10, //fréquence
 *          5 //cycle
 *     );
 *     timer.start();
 *
 **/
  	initialize: function(callback, frequency, cycle) {
    	this.callback = callback;
    	this.frequency = frequency;
		this.cycle =	Object.isUndefined(cycle) ? 0 : cycle;
  	},
/**
 * Timer.start() -> Timer
 * 
 * Enclenche le Timer.
 **/
  	start: function() {
		if(this.isStart) return;

		this.isStart = true;
    	if(this.cycle == 0) this.timer = setInterval(this.onTimer_Tick.bind(this), this.frequency * 1000);
		else{
			this.cycle--;
			this.timer = setTimeout(this.onTimer_Tick.bind(this), this.frequency * 1000);
		}
		return this;
  	},
/**
 * Timer.stop() -> Timer
 * 
 * Stop le Timer.
 **/
	stop: function(){
		if(this.isStart){
			clearInterval(this.timer);
		}
		this.timer = null;
		this.isStart = false;
		return this;
	},
	/*
	 * @private
	 */
	execute: function(){
		this.callback(this);
		
		if(this.cycle > 0){
			this.cycle--;
			this.timer = setTimeout(this.onTimer_Tick.bind(this), this.frequency * 1000);	
		}
		
		return this;
	},
	/*
	 * @private
	 * @event
	 */
	onTimer_Tick: function(){
	
		if(!this.isStart){
			this.stop();
			return;
		}
		
		this.execute();
	}
};

var fThread = $.fThread = $.Class.create();
fThread.prototype = {
	initialize: function(callback, delay){
		if(Object.isUndefined(delay)){
			delay = 0.01;
		}
		setTimeout(callback, delay * 1000);
	}
};
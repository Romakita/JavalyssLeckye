/** section: lang
 * class Date
 * L'objet Date permet de travailler avec toutes les variables qui concernent les dates et la gestion du temps. Il s'agit d'un objet inclus de façon native dans Javascript, 
 * et que l'on peut toujours utiliser. 
 *
 * `Extends` ajoute un important de méthode utile pour travailler sur les dates. Bon nombre de méthode de `Date` sont issues de PHP et d'autre langage objet afin de faciliter
 * la vie du développeur.
 **/
Object.extend(Date.prototype,(function(){
	var __class__ = 'date';
/**
 * Date#clone() -> Date
 *
 * Crée une copie de l'objet `Date`.
 **/
	function clone(){
		return this.toString_('datetime', 'en').toDate();	
	}
/**
 * Date#dateDiff(date) -> Number
 * - date (Date): date permettant de calculer la différence entre deux dates.
 *
 * Cette méthode calcule le nombre de jour entre la date de l'instance et la date passée en paramètre.
 **/
	function dateDiff(date){
		
		if(this.format('Ymd') == date.format('Ymd')){
			return 0;	
		}
		
		return (Math.abs((this.getTime() - this.getTimezoneOffset()) - (date.getTime() - date.getTimezoneOffset()))/ (1000*60*60*24));
	}
/**
 * Date#daysInMonth() -> Number
 *
 * Retourne le nombre de jours dans le mois de l'instance.
 **/
	function daysInMonth(){
		return this.getArrayDaysByMonth()[this.getMonth()];
	}
	//ignore
	function getDaysInMonth(){
		return this.getArrayDaysByMonth()[this.getMonth()];
	}
/**
 * Date#format(format) -> String
 * - format (String): formatFormat accepté par la fonction PHP date().
 *
 * Retourne la date de l'instance au format demandé.
 * 
 * <p class="note">Voir la description de la fonction date <a href="http://www.php.net/manual/fr/function.date.php">http://www.php.net/manual/fr/function.date.php</a></p>
 *
 * Cette méthode supporte quelques caractères spéciaux en plus que celle prise en charge par `date()` de PHP, dont:
 * 
 * * `t` : Sera convertie par le dernier jour du mois.
 * * `$s` : Sera convertie par le jour de début de la semaine de l'instance.
 * * `$e` : Sera convertie par le jour de fin de la semaine de l'instance.
 * * `$S` : Sera convertie par le jour de début de la semaine + le mois.
 * * `$E` : Sera convertie par le jour de fin de la semaine + le mois.
 * * `$b` : Sera convertie par le mois (sur trois lettre) de début de la semaine de l'instance.
 * * `$l` : Sera convertie par le mois (sur trois lettre) de fin de la semaine de l'instance.
 *
 **/
	function format(frm){ 
			
		var str = '';
		
		for(var i = 0; i < frm.length; i += 1){
			var char = frm.substring(i,i+1);

			switch(char){
				case '$':
					char += frm.substring(i+1,i+2);
										
					if('$s' == char){
						str += this.startDate().getDate();
						i++;
					}
					if('$e' == char){
						str += this.endDate().getDate();
						i++;	
					}

					if('$S' == char){
						var d = this.startDate();
						str += d.getDate() + ' ' ;
						str += MUI.getMonth(d.getMonth());
						i++;
					}
					if('$E' == char){
						var d = this.endDate();
						str += this.endDate().getDate() + ' ';
						str += MUI.getMonth(d.getMonth());
						i++;	
					}
					
					if('$b' == char){
						var d = this.startDate();
						str += d.getDate() + ' ' ;
						str += MUI.getMonth(d.getMonth()).slice(0,3);
						i++;
					}
					if('$l' == char){
						var d = this.endDate();
						
						str += d.getDate() + ' ';
						str += MUI.getMonth(d.getMonth()).slice(0,3);
						i++;	
					}
					break;
				//année
				case 'Y':
					str += this.getFullYear();
					break;
				case 'y':
					str += this.getYear();
					break;
					
				//mois
				case 'm':
					str += ('0' + (this.getMonth() + 1)).slice(-2);
					break;
				case 'M':
					str += MUI.getMonth(this.getMonth()).slice(0,3);
					break;
				case 'F':
					str += MUI.getMonth(this.getMonth());
					break;
				case 'n':
					str += (this.getMonth() + 1);
					break;
				
				case 't':
					str += this.getDaysInMonth();
					break;
					
				//jours
				case 'd':
					str += ('0' + this.getDate()).slice(-2);
					break;
					
				case 'j':
					str += this.getDate();
					break;
					
				case 'D':

					str += MUI.getDay(this.getDay()).slice(0,3);
					break;
					
				case 'l':
					str += MUI.getDay(this.getDay());
					break;
					
				
				//semaine
				case 'w':
					str += $MUI('Sem.') + ' ' +this.getWeekNumber();
					break;
				case 'W':
					str += $MUI('Semaine') + ' ' +this.getWeekNumber();
					break;
				//heure
				case 'H':
				case 'h':
					str += ('0' + this.getHours()).slice(-2);
					break;
				case 'i':
					str += ('0' + this.getMinutes()).slice(-2);
					break;
				case 's':
					str += ('0' + this.getSeconds()).slice(-2);
					break;
					
				case '\\':
					i++;
					str += frm.substring(i,i+1);
					break;
					
				default: str+= char;
			}

		}
		
		
		return str;
	}
/**
 * Date#getArrayDaysByMonth() -> Array
 *
 * Retourne un tableau de jour par mois courant à la date
 **/
	function getArrayDaysByMonth(){
		//On initialise le nombre de jour par mois
		var nbJoursfevrier = (this.getFullYear() % 4) == 0 ? 29 : 28;
		//Initialisation du tableau indiquant le nombre de jours par mois
		return new Array(31,nbJoursfevrier,31,30,31,30,31,31,30,31,30,31);
	}
/**
 * Date#getWeekNumber() -> Number
 * 
 * Cette méthode retourne le numéro de la semaine en fonction de l'instance.
 **/
	function getWeekNumber(){

		var NumSemaine = 	0;//numéro de la semaine
		var DebutAn = 		new Date(this.getFullYear(),0,1);
		// calcul du nombre de jours écoulés entre le 1er janvier et la date à traiter.
		// ----------------------------------------------------------------------------
		// initialisation d'un tableau avec le nombre de jours pour chaque mois
		ListeMois = 		this.getArrayDaysByMonth();
		// on parcours tous les mois précédants le mois à traiter 
		// et on calcul le nombre de jour écoulé depuis le 1er janvier dans TotalJour
		var TotalJour = 0;
		for(cpt = 0; cpt < this.getMonth(); cpt++){TotalJour+=ListeMois[cpt];}
		TotalJour += this.getDate();
		
		
		//on determine ensuite le jour correspondant au 1er janvier
		//de 1 pour un lundi à 7 pour un dimanche/

		var JourDebutAn = DebutAn.getDay();
		
		if(JourDebutAn == 0){
			JourDebutAn = 7;
		};
		
		//Calcul du numéro de semaine
		//----------------------------------------------------------------------
		//on retire du TotalJour le nombre de jours que dure la première semaine 
		TotalJour -= 8 - JourDebutAn;
		//on comptabilise cette première semaine
		NumSemaine = 1;
		//on ajoute le nombre de semaine compléte (sans tenir compte des jours restants)
		NumSemaine += Math.floor(TotalJour/7);
		// s'il y a un reste alors le n° de semaine est incrémenté de 1
		if(TotalJour % 7 != 0){
			NumSemaine += 1;
		}

		return(NumSemaine);
	}
/**
 * Date#startDate() -> Date
 *
 * Retourne la date du début de la semaine de l'instance.
 **/
	function startDate(){
		var day = 	this.getDay() == 0 ? 6 : this.getDay() -1;
		var date = 	this.clone();
		
		date.setDate(this.getDate() - day);
		
		return date;
	}
/**
 * Date#endDate() -> Date
 *
 * Retourne la date de fin de la semaine de l'instance.
 **/
	function endDate(){
		var day = 	this.getDay() == 0 ? 6 : this.getDay() -1;
		
		var date = 	this.clone();
		
		date.setDate(this.getDate() + 6 - day);
		
		return date;
	}
/**
 * Date#hoursDiff(date) -> Number
 * - date (Date): date pour le calcul de la différence.
 *
 * Retourne la différence entre deux dates en heure.
 **/
	function hoursDiff(date){
		return (Math.abs((this.getTime() - this.getTimezoneOffset()) - (date.getTime() - date.getTimezoneOffset())) / (1000*60*60));
	}
/**
 * Date#minsDiff(date) -> Number
 * - date (Date): date pour le calcul de la différence.
 *
 * Retourne la différence entre deux dates en minutes.
 **/
	function minsDiff(date){
		return (Math.abs((this.getTime()- this.getTimezoneOffset()) - (date.getTime() - date.getTimezoneOffset())) / (1000*60));
	}
/**
 * Date#secondsDiff(date) -> Number
 * - date (Date): date pour le calcul de la différence.
 *
 * Retourne la différence entre deux dates en secondes.
 **/
	function secondsDiff(date){
		return (Math.abs((this.getTime()- this.getTimezoneOffset()) - (date.getTime() - date.getTimezoneOffset()))/ 1000);
	}
/**
 * Date#hoursDiffWithInterval(interval) -> Number
 * - interval (Array): Bornes.
 *
 * Retourne l'heure entres deux bornes.
 *
 * ##### Exemples
 *
 * * Si l'heure est 23h et que l'intervalle est `[6,18]`, la valeur retourné sera `6 - 18 = 12`.
 * * Si l'heure est 14h et que l'intervalle est `[6,18]`, la valeur retourné sera `14 - 6 = 8`.
 *
 **/
	function hoursDiffWithInterval(interval){

		if(Object.isUndefined(interval)){
			interval = [0,23];	
		}

		if(this.getHours() < interval[0]) return 0;
		if(this.getHours() > interval[1]) return interval[1] - interval[0];
		
		return this.getHours() - interval[0];
				
	}
/**
 * Date#setDay(nb) -> Date
 * - nb (Number): Entier qui correspondant au jour de la semain entre 0 et 6.
 *
 * Permet de fixer la valeur du jour de la semaine.
 **/
	function setDay(nb){
		
		if(Object.isUndefined(nb)) nb = 1;
		
		var currentDay = this.getDay();
		
		currentDay = 	currentDay == 0 ? 6 : currentDay - 1;
		nb = 			nb == 0 ? 6 : nb - 1;

		var days = Math.abs(currentDay - nb);

		if(currentDay > nb) this.setDate(this.getDate() - days);
		else this.setDate(this.getDate() + days);
				
		return this;
			
	}
/**
 * Date#timeDiff(date) -> Number
 * - date (Date): date pour le calcul de la différence.
 *
 * Retourne la différence entre deux dates en milisecondes.
 **/
	function timeDiff(date){
		return Math.abs((this.getTime()- this.getTimezoneOffset()) - (date.getTime() - date.getTimezoneOffset()));
	}
	/*
	 * @ignore
	 */
	function toDate(){
		return this;	
	}
/**
 * Date#toString_(type [, lang]) -> String
 * - type (String): type de conversion.
 * - lang (String): format de sortie, Anglais (`eng`) ou Français (`fr`).
 * 
 * Effectue une conversion de l'instance `Date` vers [[String]] au format anglais ou français.
 * Cette méthode est utile pour l'envoi de la date vers une base de données SQL.
 * 
 * #### Paramètre type
 *
 * Il existe trois type de conversion de la date :
 *
 * * `date` : La chaine de sortie sera une date au format (fr) `jj/mm/aaaa` ou (eng) `aaaa-mm-jj`.
 * * `datetime` : La chaine de sortie sera une date au format (fr) `jj/mm/aaaa hh:mm:ss` ou (eng) `aaaa-mm-jj hh:mm:ss`.
 * * `hours` : La chaine de sortie sera une date au format `hh:mm:ss`.
 *
 **/
	function toString_(){

		var args = $A(arguments);
		var str = '';
		if(Object.isUndefined(args[0])) args[0] = '';
		
		switch(args[0]){
			default: 		str = this.toString();
							break;
			case 'datetime':str = this.toStringDateTime(args[1]);
							break;
			case 'date':	str = this.toStringDate(args[1]);
							break;
			case 'hours':	str = this.toStringHours(args[1]);
		}

		return str;
	}
/** deprecated
 * Date#toStringFormated(lang) -> String
 * - lang (String): format de sortie en fonction de langue.
 *
 * Depuis la version 0.9.6 cette méthode est déprecié.
 * 
 * Utilisez plutot la méthode [[Date#toStringDateTime]].
 **/
	function toStringFormated(frm){
		return this.toStringDateTime(frm);
	}
/** 
 * Date#toStringDateTime(frm) -> String
 * - lang (String): format de sortie en fonction de langue (`fr`) ou (`en`).
 *
 * Cette méthode convertit l'instance en [[String]] au format (fr) `jj/mm/aaaa hh:mm:ss` ou (en) `aaaa-mm-jj hh:mm:ss`.
 *
 **/
	function toStringDateTime(frm){
		if(!Object.isUndefined(frm)) frm = frm.toLowerCase();
		
		switch(frm){
			default:
			case 'en':
			case 'eng':
				return this.format('Y-m-d h:i:s');
			case 'fr':
			case 'fra':
				return this.format('d/m/Y h:i:s');
		}
	}
/** 
 * Date#toStringDate(frm) -> String
 * - lang (String): format de sortie en fonction de langue (`fr`) ou (`en`).
 *
 * Cette méthode convertit l'instance en [[String]] au format (fr) `jj/mm/aaaa` ou (en) `aaaa-mm-jj`.
 **/
	function toStringDate(frm){
		if(Object.isUndefined(frm)) frm = 'en';
		frm = frm.toLowerCase();
		
		switch(frm){
			default:
			case 'en':
			case 'eng':
				return this.format('Y-m-d');
				break;
			case 'fra':
			case 'fr':
				return this.format('d/m/Y');
		}	
	}
/** 
 * Date#toStringHours() -> String
 *
 * Convertie l'instance en [[String]] au format `hh:mm:ss`.
 **/
	function toStringHours(){
		return this.format('h:i:s');
	}
/** 
 * Date#isNationalDays([country]) -> False | String
 * - country (String): Code du pays 'fr' ou 'en'.
 *
 * Cette méthode indique si le jour est une fete national.
 **/	
	function isNationalDays(country){
		if(Object.isUndefined(country)){
			country = 'fr';	
		}
		
		for(var i = 0; i < Date.NationalDays[country].length; i++){
			var current = 	Date.NationalDays[country][i];
			var date = 		current.dynamic ? (Date.NationalDays[country + 'Dynamic'])(this.getFullYear(), current.date) : current.date;
						
			if(this.format('m-d') == date){
				return current.name;
			}
		}
		return false;
	}

	return {
		__class__:				__class__,
		clone:					clone,
		dateDiff:				dateDiff,
		daysInMonth:			daysInMonth,
		format:					format,
		endDate:				endDate,
		isNationalDays:			isNationalDays,
		getArrayDaysByMonth:	getArrayDaysByMonth,
		getDaysInMonth:			getDaysInMonth,
		getWeekNumber:			getWeekNumber,
		hoursDiff:				hoursDiff,
		hoursDiffWithInterval:	hoursDiffWithInterval,
		secondsDiff:			secondsDiff,
		setDay:					setDay,
		startDate:				startDate,
		timeDiff:				timeDiff,
		minsDiff:				minsDiff,
		toDate:					toDate,
		toString_:				toString_,
		toStringDate:			toStringDate,
		toStringDateTime:		toStringDateTime,
		toStringFormated:		toStringFormated,
		toStringHours:			toStringHours
	};
})());

Object.extend(Date, {
	NationalDays:{
		//calendrier français
		'fr':[
			{date:'01-01', name:$MUI('Jour de l\'an')},
			{date:'05-01', name:$MUI('Fête du travail')},
			{date:'05-08', name:$MUI('Armistice 1945')},
			{date:'07-14', name:$MUI('Fête nationale')},
			{date:'08-15', name:$MUI('Assomption')},
			{date:'11-01', name:$MUI('Toussaint')},
			{date:'11-11', name:$MUI('Armistice 1914')},
			{date:'12-25', name:$MUI('Noël')},
			
			//dynamic
			{date:'paques', name:$MUI('Lundi de pâques'), dynamic:true},
			{date:'ascension', name:$MUI('Ascension'), dynamic:true},
			{date:'pentecote', name:$MUI('Lundi de Pentecôte'), dynamic:true}
			
		],
		
		'en':[
		
		],
		
		frDynamic: function(annee, jour){
			var b = annee-1900;
			var c = annee%19;
			var d = Math.floor((7*c+1)/19);
			var e = (11*c+4-d)%29;
			var f = Math.floor(b/4); 
			var g = (b+f+31-e)%7;
			
			switch(jour){
				
				case 'paques':
					var date = 26-e-g;
					if (date>0){
						var mois = '04';
						if (date < 10){
							date = '0'+date;
						}
					} else {
						date=31+date;
						if (date < 10){
							date = '0'+date;
						}
						var mois = '03';
					}
					//alert(mois+'-'+date);
					return mois+'-'+date;
					
				case 'ascension':
					var date = 25-e-g;
					if (date>0){
						var mois = 4;
						
					} else {
						date=31+date;
						var mois = 3;
					}
					
					var NewDate = new Date();
					NewDate.setFullYear(annee, mois-1, date+39);
					
					return NewDate.format('m-d');
					
				case 'pentecote':
					var date = 26-e-g;
					if (date>0){
						var mois = 4;
						
					} else {
						date=31+date;
						var mois = 3;
					}
					var NewDate = new Date();
					NewDate.setFullYear(annee, mois-1, date+49);
					return NewDate.format('m-d');
					
			}
			
			return '';
		},
	}
});
/** section: lang
 * class Number
 * Extends apporte peu de nouvelle méthode à la Classe Number de Javascript puisque la majorité
 * sont déjà implémenté ou disponible au travers de la classe String.
 **/
Object.extend(Number.prototype, (function(){
/** alias of: String#toMoney
 * Number#toMoney() -> String
 *
 * Transforme la chaine au format Money pour l'affichage de feuille de Calcul.
 **/
	function toMoney(){
		return (""+this).toMoney();
	}
/**
 * Number#toHexa() -> String
 *
 * Cette méthode tente de convertire une chaine décimal en héxadecimal.
 **/
	function toHexa(){
		var oDec = this;
		if(oDec == undefined) return false;
		
		var regDec = /^\d+$/;
	
		if (!regDec.test(oDec)) return false;
		
		return parseInt(oDec,10).toString(16).toUpperCase();
	}
/**
 * Number#format(decimals, decpoint, thousandssep) -> String
 * - decimals (Number): Définit le nombre de décimal.
 * - decpoint (String): Définit le séparateur pour le point décimal.
 * - thousandssep (String): Définit le séparateur des milliers. Seul le premier caractère du paramètre `thousandssep` est utilisé. Par exemple, si vous utilisez bar comme séparateur de milliers, sur le nombre 1000, `Number#format()` retournera 1b000.
 *
 * Formate un nombre pour l'affichage.
 * 
 * #### Les paramètres
 * 
 * Cette méthode accepte un, deux, ou quatre paramètres (et pas trois) :
 * 
 * * Si seul le paramètre number est donné, il sera formaté sans partie décimale, mais avec une virgule entre chaque millier.
 * * Si les deux paramètres number et decimals sont fournis, number sera formaté avec decimals décimales, un point (".") comme séparateur décimal et une virgule entre chaque millier.
 * * Avec quatre paramètres, number sera formaté avec decimals décimales, `decpoint` comme séparateur décimal, et `thousandssep` comme séparateur de milliers.
 *
 **/
	function format(decimals, dec_point, thousands_sep) {
		var n = this, prec = decimals;

		var toFixedFix = function (n,prec) {
			var k = Math.pow(10,prec);
			return (Math.round(n*k)/k).toString();
		};
		
		n = !isFinite(+n) ? 0 : +n;
		prec = !isFinite(+prec) ? 0 : Math.abs(prec);
		var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
		var dec = (typeof dec_point === 'undefined') ? '.' : dec_point;

		var s = (prec > 0) ? toFixedFix(n, prec) : toFixedFix(Math.round(n), prec); //fix for IE parseFloat(0.55).toFixed(0) = 0;

		var abs = toFixedFix(Math.abs(n), prec);
		var _, i;

		if (abs >= 1000) {
			_ = abs.split(/\D/);
			i = _[0].length % 3 || 3;

			_[0] = s.slice(0,i + (n < 0)) +
			_[0].slice(i).replace(/(\d{3})/g, sep+'$1');
			s = _.join(dec);
		} else {
			s = s.replace('.', dec);
		}

		var decPos = s.indexOf(dec);
		if (prec >= 1 && decPos !== -1 && (s.length-decPos-1) < prec) {
			s += new Array(prec-(s.length-decPos-1)).join(0)+'0';
		} else if (prec >= 1 && decPos === -1) {
			s += dec+new Array(prec).join(0)+'0';
		}
		return s;
	}
	return {
		toMoney:	toMoney,
		toHexa:		toHexa,
		format:		format
	};
})());
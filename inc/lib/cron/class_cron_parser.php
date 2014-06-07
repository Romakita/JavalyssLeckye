<?php
/** section: Library
 * class CronParser
 *
 * Cettte classe convertit une règle Cron en date.
 **/
class CronParser{
/**
 * CronParser#bits -> Array
 * Représentation du la chaine Cron sous forme de tableau.
 **/
	public $bits = 		array();
/**
 * CronParser#now -> Boolean
 **/
	public $now =		false;
/**
 * CronParser#nextDate -> String
 **/
	public $nextDate = 	NULL;
/**
 * new CronParser([str])
 * - str (String): Chaine à parser.
 *
 * Cette méthode créée une nouvelle instance [[CronParser]].
 **/
	function __construct($string = ""){
		if($string == "") return;
		$this->setTime($string);
	}
/**
 * CronParser#setTime(time) -> void
 *
 * Cette méthode permet d'assigner une syntaxe Cron en vue d'être convertie en date.
 **/
	public function setTime($strtime){
				
		$this->nextDate = false;
		$this->bits = @explode(" ", $strtime);
		
		for($i = 0; $i < count($this->bits); $i++){
			
			if(preg_match('/,/', $this->bits[$i])){
				$this->bits[$i] = 	@explode(',', $this->bits[$i]);
				continue;
			}
			
			if(preg_match('/\-/', $this->bits[$i])){
				
				list($min, $max) = 	@explode('-', $this->bits[$i]);
				$this->bits[$i] = 	self::createRange($min, $max, $i);		
				continue;
			}
			
			if(preg_match('/\//', $this->bits[$i])){
				switch($i){
					default:
						list($min, $max) = 	@explode('/', $this->bits[$i]);
						$this->bits[$i] = 	self::CreateStep(0, $max, $i);		
						break;
					case 4:
						die('cron.syntaxe.year.err');
				}
			}
		}
		
		$this->calculate();
	}
/**
 * CronParser.CreateRange(min, max, flag) -> Array
 *
 *
 **/	
	public static function CreateRange($min, $max, $flag){
		$array = array();
		
		switch($flag){//pré-traitement des champs en limitant les intervals
			case 0: //minutes
					$min = ($min < 0 ? 0 : ($min < 60 ? $min : 60));
					$max = ($max < 0 ? 0 : ($max < 60 ? $max : 60));
					if($min == $max) return $min;
					break;
			case 1: //hours
					//$maxd = self::daysinmonth(date('m'), date('y'));
					$min = ($min < 1 ? 1 : ($min < 24 ? $min : 24));
					$max = ($max < 1 ? 1 : ($max < 24 ? $max : 24));
					break;
			case 2: //days or weekly
					$maxd = self::daysinmonth(date('m'), date('y'));
					$min = ($min < 1 ? 1 : ($min <= $maxd ? $min : $maxd));
					$max = ($max < 1 ? 1 : ($max <= $maxd ? $max : $maxd));
					break; 
			case 3: //month / week
					$min = ($min < 1 ? 1 : ($min < 13 ? $min : 12));
					$max = ($max < 1 ? 1 : ($max < 13 ? $max : 13));
					if($min == $max) return $min;
					break;
			case 4: //weekly
					$min = ($min < 0 ? 0 : ($min < 6 ? $min : 6));
					$max = ($max < 0 ? 0 : ($max < 6 ? $max : 6));
					if($min == $max) return $min;
					break;
		}
		
		for(; $min <= $max; $min++){
			$array[] = $min;
		}
		return $array;
	}
/**
 * CronParser.CreateRange(start, step, flag) -> Array
 *
 *
 **/	
	public static function createStep($start, $pas, $flag){
		$array = array();
		
		switch($flag){//pré-traitement des champs en limitant les intervals
			case 0: //minutes
					$max = 59;
					break;
			case 1: //hours
					$max = 23;
					break;
			case 2: //days
					$max = self::daysinmonth(date('m'), date('y'));
					break;
			case 3: //month
					$max = self::daysinmonth(date('m'), date('y'));
					break;
			case 4: //weekly
					$max = 6;
					break;
		}
		
		for(; $start <= $max; $start += $pas){
			$array[] = $start;
		}
		
		return $array;
	}
/**
 * CronParser.DaysInMonth(month, year) -> Number
 * - month (Number): Numéro de mois.
 * - year (Number): Année.
 *
 * Cette méthode retourne le nombre de jour dans le mois.
 **/
	public function DaysInMonth($month,  $year){
		if(checkdate($month,  31,  $year)) return 31;
		if(checkdate($month,  30,  $year)) return 30;
		if(checkdate($month,  29,  $year)) return 29;
		if(checkdate($month,  28,  $year)) return 28;
		return 0; // error
	}
/**
 * CronParser#calculate() -> void
 *
 * Cette méthode calcule la prochaine exécution de la tâtche.
 **/
	public function calculate(){
		
		/*if($this->nextDate){
			if(date('Y-m-d H:i') < $this->nextDate){
				return false;
			}
		}*/
		
		//if(!$this->now){
			$year = 	date("Y");
			$month = 	date("m");
			$numday = 	date("w");
			$day = 		date("d");
			$hour = 	date("H");
			$minute = 	date("i");
		//}else{
			//list($year, $month, $day, $hour, $minute) = explode('-', $this->now);
		//}
		
		$size = 	count($this->bits);
		$weekly = 	false;
		
		for($i = 0; $i < $size; $i++){
			$field = $this->bits[$i];
			
			switch($i){
				case 0: //minutes

					if(is_array($field)){
																		
						for($y = 0, $len = $field; $y < $len; $y++){
							if($minute < $field[$y]) {
								$minute = $field[$y];
								break;
							}
						}
						
						if(date('hi') > substr('0'.$hour, -2).substr('0'.$minute, -2)){
							$y++;
							$y = $len > $y ? $y : 0;
							$minute = $field[$y];
							
							list($year, $month, $day, $hour, $minute) = explode(' ', date("Y m d H i", mktime($hour, $minute, 0, $month, $day, $year)));
						}
						
					}
					else{
						if($field != '*'){
							if($field != $minute){//minute est fixé
								$minute = $field;
							}
						}else{//pas figé on verifie que la date construite n'est pas dépassé
							if(date('hi') > substr('0'.$hour, -2).substr('0'.$minute, -2)){
								$minute++;
								list($year, $month, $day, $hour, $minute) = explode(' ', date("Y m d H i", mktime($hour, $minute, 0, $month, $day, $year)));
							}
						}
					}
					
					break;
				
				case 1: //hours
					
					if(is_array($field)){
						
						for($y = 0, $len = $field; $y < $len; $y++){
							if($hour < $field[$y]) {
								$hour = $field[$y];
								break;
							}
						}
						
						if(date('dhi') > substr('0'.$day, -2).substr('0'.$hour, -2).substr('0'.$minute, -2)){
							$y++;
							$y = $len > $y ? $y : 0;						
							$hour = $field[$y];
														
							list($year, $month, $day, $hour, $minute) = explode(' ', date("Y m d H i", mktime($hour, $minute, 0, $month, $day, $year)));
							
						}						
					}
					else{
						if($field != '*'){
							if($field != $hour){
								$hour = $field;
							}
						}else{//pas figé on verifie que la date construite n'est pas dépassé
							if(date('dhi') > substr('0'.$day, -2).substr('0'.$hour, -2).substr('0'.$minute, -2)){
								$hour++;
								list($year, $month, $day, $hour, $minute) = explode(' ', date("Y m d H i", mktime($hour, $minute, 0, $month, $day, $year)));
							}
						}
					}
					
					break;
				case 2: //days et weekly
					
					if(is_array($field)){
						
												
						for($y = 0, $len = $field; $y < $len; $y++){
							if($day < $field[$y]) {
								$day = $field[$y];
								break;
							}
						}
						
						if(date('mdhi') > substr('0'.$month, -2).substr('0'.$day, -2).substr('0'.$hour, -2).substr('0'.$minute, -2)){
							$y++;
							$y = $len > $y ? $y : 0;							
							$day = $field[$y];
														
							list($year, $month, $day, $hour, $minute) = explode(' ', date("Y m d H i", mktime($hour, $minute, 0, $month, $day, $year)));
						}
						
					}
					else{
						
						if($field != '*'){//le jour est figé
							if($field != $day){
								$day = $field;
							}
						}else{//pas figé on verifie que la date construite n'est pas dépassé
							
							if($this->bits[3] == '*' && $this->bits[4] != '*'){
								$weekly = true;
								
								$thenumday = $this->bits[4];
								$day += $thenumday - $numday;
								
								if($numday >= $thenumday){
									if($numday == $thenumday){
										if(date('mdhi') > $month.$day.$hour.$minute){
											$day += 7;	
										}
											
									}else{
										$day += 7;	
									}
								}
								
							}else{
							
								if(date('mdhi') > substr('0'.$month, -2).substr('0'.$day, -2).substr('0'.$hour, -2).substr('0'.$minute, -2)){
									$day++;	
									list($year, $month, $day, $hour, $minute) = explode(' ', date("Y m d H i", mktime($hour, $minute, 0, $month, $day, $year)));
								}
							}
						}
					}
					break;
				case 3:	//month
				
					if(is_array($field)){
												
						for($y = 0, $len = $field; $y < $len; $y++){
							if($month < $field[$y]) {
								$month = $field[$y];
								break;
							}
						}
						
						if(date('Ymdhi') > $year.substr('0'.$month, -2).substr('0'.$day, -2).substr('0'.$hour, -2).substr('0'.$minute, -2)){
							$y++;
							$y = $len > $y ? $y : 0;							
							$month = $field[$y];
														
							list($year, $month, $day, $hour, $minute) = explode(' ', date("Y m d H i", mktime($hour, $minute, 0, $month, $day, $year)));
						}
						
					}
					else{
						
						if($field != '*'){
							if($field != $month){
								$month = $field;
							}
						}
						else{//pas figé on verifie que la date construite n'est pas dépassé
														
							if(date('Ymdhi') > $year.substr('0'.$month, -2).substr('0'.$day, -2).substr('0'.$hour, -2).substr('0'.$minute, -2)){
								$month++;
								list($year, $month, $day, $hour, $minute) = explode(' ', date("Y m d H i", mktime($hour, $minute, 0, $month, $day, $year)));
							}
						}
						
					}
					break;
				case 4: //year
					if(is_array($field)){
												
						for($y = 0, $len = $field; $y < $len; $y++){
							if($year < $field[$y]) {
								$year = $field[$y];
								break;
							}
						}
						
						if(date('Ymdhi') > $year.substr('0'.$month, -2).substr('0'.$day, -2).substr('0'.$hour, -2).substr('0'.$minute, -2)){
							$y++;
							$y = $len > $y ? $y : 0;							
							$year = $field[$y];
														
							list($year, $month, $day, $hour, $minute) = explode(' ', date("Y m d H i", mktime($hour, $minute, 0, $month, $day, $year)));
						}
						
					}
					else{
						if($field != '*' && !$weekly){
							if($field != $month){
								$month = $field;
							}
						}else{//pas figé on verifie que la date construite n'est pas dépassé
							
							if(date('Ymdhi') > $year.substr('0'.$month, -2).substr('0'.$day, -2).substr('0'.$hour, -2).substr('0'.$minute, -2)){
								$year++;
								list($year, $month, $day, $hour, $minute) = explode(' ', date("Y m d H i", mktime($hour, $minute, 0, $month, $day, $year)));
							}
						}
					}
					
					break;
			}
		}
		
		$this->nextDate = date("Y-m-d H:i", mktime($hour, $minute, 0, $month, $day, $year));
				
		return;
	}
}
?>

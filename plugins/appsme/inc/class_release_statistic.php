<?php
define('TABLE_APP_RELEASE_STATS', '`'.PRE_TABLE.'applications_releases_statistics`');
/** section: AppsMe
 * class ReleaseStatisticStatistic
 * Gestion des sous-version d'une application.
 * 
 * Les sous-versions constituent une application donnée. Une sous-version est en d'autre terme une mise à jour de l'application principale.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_release.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 **/
class ReleaseStatistic extends ObjectTools implements iClass{
/* 
 * Liste robots à ne recenser dans les stats
 **/
	private static $BOTS = array(
		array('User_Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; AhrefsBot/4.0; +http://ahrefs.com/robot/)'),
		array('User_Agent' => 'Wotbox/2.01 (+http://www.wotbox.com/bot/)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; bnf.fr_bot; +http://www.bnf.fr/fr/outils/a.dl_web_capture_robot.html)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; Ezooms/1.0; ezooms.bot@gmail.com)'),
		array('User_Agent' => 'TurnitinBot/2.1 (http://www.turnitin.com/robot/crawlerinfo.html)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; AhrefsBot/3.1; +http://ahrefs.com/robot/)'),
		array('User_Agent' => 'SEOENGWorldBot/1.0 (+http://www.seoengine.com/seoengbot.htm)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; Exabot/3.0; +http://www.exabot.com/go/robot)'),
		array('User_Agent' => 'Mozilla/5.0 (Windows; U; Windows NT 5.1;fr;rv:1.8.1) VoilaBotCollector BETA 0.1  (http://www.voila.com/)'),
		array('User_Agent' => 'SAMSUNG-SGH-E250/1.0 Profile/MIDP-2.0 Configuration/CLDC-1.1 UP.Browser/6.2.3.3.c.1.101 (GUI) MMP/2.0 (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)'),
		array('User_Agent' => 'DoCoMo/2.0 N905i(c100;TB;W24H16) (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)'),
		array('User_Agent' => 'Mozilla/5.0 (Windows; U; Windows NT 5.1; fr; rv:1.8.1) VoilaBot BETA 1.2 (support.voilabot@orange-ftgroup.com)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; YandexBot/3.0; MirrorDetector; +http://yandex.com/bots)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; MJ12bot/v1.4.3; http://www.majestic12.co.uk/bot.php?+)'),
		array('User_Agent' => 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_1 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8B117 Safari/6531.22.7 (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)'),
		array('User_Agent' => 'Linguee Bot (http://www.linguee.com/bot; bot@linguee.com)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; Mail.RU_Bot/2.0; +http://go.mail.ru/help/robots)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; WBSearchBot/1.1; +http://www.warebay.com/bot.html)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; AhrefsBot/5.0; +http://ahrefs.com/robot/)'),
		array('User_Agent' => 'ScreenerBot Crawler Beta 2.0 (+http://www.ScreenerBot.com)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; BLEXBot/1.0; +http://webmeup.com/crawler.html)'),
		array('User_Agent' => 'msnbot/2.0b (+http://search.msn.com/msnbot.htm)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; Linux x86_64; Mail.RU_Bot/2.0; +http://go.mail.ru/help/robots)'),
		array('User_Agent' => 'TurnitinBot/3.0 (http://www.turnitin.com/robot/crawlerinfo.html)'),
		array('User_Agent' => 'Mozilla/5.0 (compatible; BLEXBot/1.0; +http://webmeup-crawler.com/)')
	);
/**
 * ReleaseStatistic.TABLE_NAME -> String 
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			TABLE_APP_RELEASE_STATS;
/**
 * ReleaseStatistic.PRIMARY_KEY -> String
 * Clef primaire de la table TABLE_NAME gérée par la classe.
 **/
	const PRIMARY_KEY = 		'Stat_ID';
/**
 * ReleaseStatistic#Stat_ID -> Number
 * Clef primaire d'une stat.
 **/
	public $Stat_ID = 			0;
/**
 * ReleaseStatistic#Release_ID -> Number
 **/
	public $Release_ID = 		0;
/**
 * ReleaseStatistic#User_Agent -> String
 **/
	public $User_Agent =		'';
/**
 * ReleaseStatistic#IP -> String
 **/
	public $IP = 				'';
/**
 * ReleaseStatistic#Lang -> String
 **/
	public $Lang =				'';
/**
 * ReleaseStatistic#Date -> String
 **/
	public $Date = 				'';
/**
 * new ReleaseStatistic([mixed])
 * - mixed (array | int | Object | String): restitution du context.
 *
 * Cette méthode créée une nouvelle instance [[ReleaseStatistic]].
 *
 * #### Paramètre mixed
 *
 * Le paramètre `mixed` permet de restituer le context de l'objet à partir de différente source. Si le type de `mixed` est :
 *
 * * Integer : c'est-à-dire un numéro Application_ID, alors l'objet sera reconstitué à partir de son image en base de données.
 * * String : Si la chaine est format JSON, elle sera évalué et ses attributs seront copiés dans l'instance.
 * * Array et Object : Les attributs du tableau associatif ou de l'objet seront copiés dans l'instance.
 *
 **/
	final function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		$this->Date =			date('Y-m-d H:i:s');
		$this->User_Agent =		@$_SERVER['HTTP_USER_AGENT'];
		$this->IP =				$_SERVER['REMOTE_ADDR'];
		$this->Lang =			@explode(',',$_SERVER['HTTP_ACCEPT_LANGUAGE']);
		$this->Lang = 			@strtolower(substr(chop($this->Lang), 0, 2));
		
		if($numargs >0){
			if(is_numeric($arg_list[0])) {
	
				$request = 			new Request();
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
				$request->where =	self::PRIMARY_KEY.' = '.(int) $arg_list[0];

				$u = $request->exec('select');
				
				if($u['length'] > 0){
					$this->setArray($u[0]);
				}

			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->setObject($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->setArray($arg_list[0]);
		}
	}
/**
 * ApplicationReleaseStatistic.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE ".self::TABLE_NAME." (
		  `Stat_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Release_ID` bigint(20) NOT NULL,
		  `User_Agent` text NOT NULL,
		  `Lang` varchar(2) NOT NULL,
		  `IP` varchar(15) NOT NULL DEFAULT '0.0.0.0',
		  `Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
		  PRIMARY KEY (`Stat_ID`)
		) ENGINE=InnoDB AUTO_INCREMENT=721 DEFAULT CHARSET=utf8";
		$request->exec('query');	
	}
	
	public static function Initialize(){
		
	}
/**
 * ReleaseStatistic#commit() -> bool
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 * Elle retourne vrai quand l'enregistrement réussi.
 **/
	public function commit(){
		
		if(in_array($this->User_Agent, self::$BOTS) || strpos($this->User_Agent, 'bot') !== false ){//on filtre
			return true;
		}
		
		$request = 			new Request();
		
		$request->from = 	self::TABLE_NAME;
		$request->fields = 	'(`Release_ID`, `User_Agent`, `IP`, `Lang`, `Date`)';
		$request->values = 	"(
								'".$this->Release_ID."',
								'".Sql::EscapeString($this->User_Agent)."',
								'".Sql::EscapeString($this->IP)."',
								'".Sql::EscapeString($this->Lang)."',
								'".Sql::EscapeString($this->Date)."'
							)";
					
		if(!$request->exec('insert')) return false;
		
		$this->Stat_ID = $request->exec('lastinsert');
		
		return true;
	}
	
	public function delete(){
		
	}
	
	public static function exec($op){
		
	}
/**
 * ReleaseStatistic#ipExists() -> Boolean
 *
 * Cette méthode indique si l'ip a déjà été flashé pour une release.
 **/	
	public function ipExists(){
		return Sql::Count(self::TABLE_NAME, "Release_ID = '".Sql::EscapeString($this->Release_ID) ."' AND '".Sql::EscapeString($this->IP)."'") > 0;
	}
/**
 * ReleaseStatistic.ByMonth(id) -> Array
 *
 **/	
	static function ByMonth($id){
	
		$array = 	array();
		$month = 	date('m') * 1;
		$year =		date('Y') * 1;
		
		for($i = 12; $i > 0; $i--){
			$date = $year.'-'. substr('0'.$month, -2);
			$array[$date] = array(
				'single' =>	1 * self::CountAppSingleDownload($id, $date.'%'),
				'total' =>	1 * self::CountAppDownload($id, $date.'%')
			);
			
			$month--;
			
			if($month <=0){
				$year--;
				$month = 12;	
			}
		}
		
		return $array;
	}
/**
 * ReleaseStatistic.ByVersion(id) -> Array
 *
 **/	
	static function ByVersion($id){
		
		$options = new stdClass();
		$options->Application_ID = 	$id;
		
		$release = Release::GetList('', $options);
		
		$array = 	array();
		
		for($i = 0; $i < $release['length']; $i++){
			$array[$release[$i]['Version']] = 1 * self::CountDownload($release[$i]['Release_ID']);
		}
		
		return $array;
	}
/**
 * ReleaseStatistic.ByLang(id) -> Array
 *
 **/	
	static function ByLang($id){
		$request = new Request();
		
		$request->select = 	'S.Lang, COUNT(Stat_ID) as NB';
		$request->from = 	self::TABLE_NAME.' S INNER JOIN '.Release::TABLE_NAME.' R ON S.Release_ID = R.Release_ID';
		$request->where =	'Application_ID = '. (int) $id;
		$request->group = 	'Application_ID, Lang';
		
		$result = $request->exec('select');
		
		if(!$result) return array();
		
		$array = array();
		$total = 0;
		
		for($i = 0; $i < $result['length']; $i++){
			$total += $result[$i]['NB'];
			array_push($array, array($result[$i]['Lang'], 1 * $result[$i]['NB']));
		}
		
		/*for($i = 0; $i < $result['length']; $i++){
			$array[$i][1] = ($array[$i][1] / $total) * 100;
		}*/
		
		return $array;
	}
/**
 * ReleaseStatistic.CountAppSingleDownload() -> Boolean
 *
 * Cette méthode indique si l'ip a déjà été flashé pour une application.
 **/	
	static function CountAppSingleDownload($id, $date = false){
		$request = 			new Request();
		$request->select = 	'COUNT(DISTINCT(IP)) as NB';
		$request->from =	self::TABLE_NAME.' S INNER JOIN '.Release::TABLE_NAME.' R ON S.Release_ID = R.Release_ID';
		$request->where =	"Application_ID = '".Sql::EscapeString($id)."'";
		
		if($date){
			$request->where .=	' AND Date LIKE	"'.Sql::EscapeString($date).'"';
		}
		
		$result = $request->exec('select');
		
		if(!$result){
			
			return false;
		}
		
		return $result[0]['NB'];
	}
/**
 * ReleaseStatistic.CountAppSingleDownload() -> Boolean
 *
 * Cette méthode indique si l'ip a déjà été flashé pour une application.
 **/	
	static function CountReleaseDownload($id, $date = false){
		$request = 			new Request();
		$request->select = 	'COUNT(DISTINCT(IP)) as NB';
		$request->from =	self::TABLE_NAME;
		$request->where =	"Release_ID = '".Sql::EscapeString($id)."'";
		
		if($date){
			$request->where .=	' AND Date LIKE	"'.Sql::EscapeString($date).'"';
		}
		
		$result = $request->exec('select');
		
		if(!$result){
			
			return false;
		}
		
		return $result[0]['NB'];
	}
/**
 * ReleaseStatistic.CountSingleDownload() -> Boolean
 *
 * Cette méthode indique si l'ip a déjà été flashé pour une release.
 **/		
	static function CountAppDownload($id, $date = ''){
		if($date){
			$date =	' AND Date LIKE	"'.Sql::EscapeString($date).'"';
		}
		
		return Sql::Count(self::TABLE_NAME.' S INNER JOIN '.Release::TABLE_NAME.' R ON S.Release_ID = R.Release_ID', "Application_ID = '".Sql::EscapeString($id) ."' ".$date);
	}
	
	static function CountDownload($id){
		return Sql::Count(self::TABLE_NAME.' S INNER JOIN '.Release::TABLE_NAME.' R ON S.Release_ID = R.Release_ID', "R.Release_ID = '".Sql::EscapeString($id) ."'");
	}
	
	public static function GetList($clauses = '', $options =''){
		
	}
	
	public static function onGetList(&$row, &$request){
		
	}
}
?>
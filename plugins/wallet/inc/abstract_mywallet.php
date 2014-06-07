<?php
/** section: Plugins
 * MyWallet 
 * includes Models, iPlugin
 *
 * Gérez vos modes de paiement pour votre site en ligne.
 * 
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Application : MyWallet
 * * Fichier : abstract_mywallet.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyWallet extends Models implements iPlugin{
	
	protected static $Current = NULL;
	protected $Header = array( 
		'Name' => 			'Name',
		'Author' => 		'Author',
		'Tags' =>			'Tags'
	);
/**
 * SystemTemplate.Extensions -> Array
 *
 * Liste des extensions de fichier à analyser.
 **/
	public $Extensions = array('.xml', '.php', '.css');	
/**
 * new SystemTemplate(path [, root [,  header]])
 * - path (String): Répertoire du dossier à analyser.
 * - root (String): Répertoire racine du site.
 *
 * Cette méthode créée une nouvelle instance de [[SystemTemplate]].
 **/
	function __construct($path, $root = '', $header = NULL){
		
		if(is_array($header)){
			$this->Header = $header;
		}
		//
		// AbsolutePath
		//
		$this->AbsPath = 		$path;
		//
		// HomePath
		//
		$this->HomePath	=		$root;
							
		//$this->Array = $this->GetList();
		
	}
/**
 * MyWallet.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/	
	public static function Initialize(){
		
		define('MYWALLET_URI', Plugin::Uri());
		define('MYWALLET_PATH', Plugin::Path());
		
		include_once('iwallet.php');
		include_once('class_mywallet_card.php');
		
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
				/*
		 * Evenement plugin.active. Cette événement est lancé lorsque l'utilisateur installera votre module depuis le menu Extension du logiciel.
		 **/
		System::Observe('plugin.active', array(__CLASS__,'Install')); 
		/*
		 * Evenement plugin.active. Cette événement est lancé lorsque l'utilisateur désinstallera votre module depuis le menu Extension du logiciel.
		 **/
		System::Observe('plugin.deactive', array(__CLASS__,'Uninstall'));
		/*
		 * Evenement plugin.configure. Cette événement est lancé lorsque l'utilisateur met à jour l'extension depuis Javalyss.fr ou un autre dépôt d'application.
		 **/
		System::Observe('plugin.configure', array(__CLASS__,'Install'));
		
		System::EnqueueScript('mywallet', Plugin::Uri().'js/mywallet.js');
		System::AddCSS(Plugin::Uri().'css/mywallet.css');
		
		//inclusion des librairies
		self::$Current = $o = new self(MYWALLET_PATH.'inc/class/', System::Path('self'));
		$list = $o->getList();
		
		for($i = 0; $i < count($list); $i++){
			
			self::$Current = MYWALLET_PATH.'inc/class/' . $list[$i]['Folder'];
			
			include_once(MYWALLET_PATH.'inc/class/' . $list[$i]['File']);
		}
	}
/**
 * MyWallet.Install() -> void
 * Cette méthode installe l'extension ou une partie de l'extension gérées par la classe.
 **/
	public static function Install(){
				
		MyWallet\Card::Install();
		
		Market::RequireApp('Paypal');
	//	Market::RequireApp('MasterCard');
		
		//Market::RequireApp('Kwixo');	
		//Market::RequireApp('Simplify Commerce');	
		
		//on lance les scripts d'installation et de mise à jour de la base de données	
			
	}
/**
 * iPlugin.Uninstall(eraseData) -> void
 * - eraseData (Boolean): Suppression de données. 
 *
 * Cette méthode désintalle  l'extension et supprime les données liées à l'extension si `eraseData` est vrai.
 **/	
	static public function Uninstall($eraseData = false){
		if($erasData){
			$request = new Request(DB_BLOGPRESS);
			$request->from(MyWalletCard::TABLE_NAME)->exec('drop');	
		}
	}
	
	public static function LibraryURI(){
		return File::ToURI(self::$Current);
	}
	
	public static function LibraryPath(){
		return self::$Current;
	}
/**
 * MyWallet.exec(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/
	public static function exec($op){
		
		switch($op){
			case 'mywallet.db.configure':
			
				self::Install();
				echo "Base configurée";
				break;
				
			case 'mywallet.list':
				
				$o = new MyWallet(MYWALLET_PATH.'inc/class/', System::Path('self'));
				
				echo json_encode($o->getList());
				
				break;	
		}
	}
/**
 * MyWallet.execSafe(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande - en mode non connecté - et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/	
	static public function execSafe($op){
		
	}
	
	public function getList($root = ''){
		
		$array = 	parent::getList();
		$options = 	array();
		
		foreach($array as $key => $template){
			
			$template['text'] = 	$template['Name'];
			$template['value'] = 	strtolower(Stream::Sanitize($template['Name'], ''));
			$template['link'] = 	ucfirst(Stream::Sanitize($template['Name'], ''));
			$template['Folder'] =	dirname($key);
			$template['File'] =		$key;
			
			$icon =					MYWALLET_PATH.'inc/class/'.$template['Folder'].'/icon.png';
			$template['icon'] =		file_exists($icon) ? File::ToURI($icon) : 'custom';
			
			$icon =					MYWALLET_PATH.'inc/class/'.$template['Folder'].'/icon-70.png';
			$template['icon-70'] =	file_exists($icon) ? File::ToURI($icon) : 'custom';
			
			array_push($options, $template);			
		}
		
		return $options;
	}
}

Mywallet::Initialize();


?>
<?php
/**
 * class Exposition
 **/
class Exposition extends Post{
	const PRE_OP =				'exposition.';
/**
 * Exposition.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'exposition';	
/**
 * Exposition.PRIMARY_KEY -> String
 * Clef primaire de la table Exposition.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Exposition_ID';
/**
 * Exposition#Exposition_ID -> Number
 **/
	public $Exposition_ID = 0;
/**
 * Exposition#Post_ID -> Number
 **/
	public $Post_ID = 0;
/**
 * Exposition#Title -> String
 * Varchar
 **/
	public $Title = "";
/**
 * Exposition#DateDep -> Datetime
 **/
	public $DateDep = NULL;
/**
 * Exposition#DateRet -> Datetime
 **/
	public $DateRet = NULL;
/**
 * Exposition#Adresse -> String
 * Varchar
 **/
	public $Adresse = "";
/**
 * Exposition#Adresse2 -> String
 * Varchar
 **/
	public $Adresse2 = "";
/**
 * Exposition#Ville -> String
 * Varchar
 **/
	public $Ville = "";
/**
 * Exposition#CP -> String
 * Varchar
 **/
	public $CP = "";
/**
 * Exposition#Description -> String
 * Text
 **/
	public $Description = "";
/**
 * new Exposition()
 * new Exposition(json)
 * new Exposition(array)
 * new Exposition(obj)
 * new Exposition(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[Exposition]].
 * - array (Array): Tableau associatif équivalent à une instance [[Exposition]]. 
 * - obj (Object): Objet équivalent à une instance [[Exposition]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[Exposition]].
 **/
	public function __construct(){
		global $S;
		
		$numargs = 	func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
					
			if(is_int($arg_list[0])) {	
				$request = 			new Request(DB_NAME);
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
				$request->where =	self::PRIMARY_KEY.' = '.$arg_list[0];
					
				$u = $request->exec('select');
				$this->setArray($u[0]);
	
			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->setObject($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->setArray($arg_list[0]);

		}
	}
/**
 * Exposition.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array('Exposition', 'exec'));
		System::Observe('gateway.exec.safe', array('Exposition', 'execSafe'));
	}
/**	
 * Exposition#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		global $S;
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if($this->Exposition_ID == 0){
			
			//creation du post
			$request->fields = 	"(`Post_ID`,
								`Title`,
								`DateDep`,
								`DateRet`,
								`Adresse`,
								`Adresse2`,
								`Ville`,
								`CP`,
								`Description`)";
			$request->values = 	"('".Sql::EscapeString($this->Post_ID)."',
								'".Sql::EscapeString($this->Title)."',
								'".Sql::EscapeString($this->DateDep)."',
								'".Sql::EscapeString($this->DateRet)."',
								'".Sql::EscapeString($this->Adresse)."',
								'".Sql::EscapeString($this->Adresse2)."',
								'".Sql::EscapeString($this->Ville)."',
								'".Sql::EscapeString($this->CP)."',
								'".Sql::EscapeString($this->Description)."')";

			
			if(!$request->exec('insert')) return false;
			
			$this->Exposition_ID = $request->exec('lastinsert');
			//$this->setPost();
			
			return true;
		}
		
		//$this->setPost();		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Post_ID` = '".Sql::EscapeString($this->Post_ID)."',
								`Title` = '".Sql::EscapeString($this->Title)."',
								`DateDep` = '".Sql::EscapeString($this->DateDep)."',
								`DateRet` = '".Sql::EscapeString($this->DateRet)."',
								`Adresse` = '".Sql::EscapeString($this->Adresse)."',
								`Adresse2` = '".Sql::EscapeString($this->Adresse2)."',
								`Ville` = '".Sql::EscapeString($this->Ville)."',
								`CP` = '".Sql::EscapeString($this->CP)."',
								`Description` = '".Sql::EscapeString($this->Description)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Exposition_ID."'";
	
		return $request->exec('update');			
	}
/**
 * Exposition.setPost() -> void
 *
 * Cette méthode créée un post lié à l'annonce.
 **/	
	public function setPost(){
		$post = 			new Post($this->Post_ID);
						
		if($this->Post_ID == 0){			
			$date = 			explode(' ', $this->DateDep);
			$date =				str_replace('-', '/', $date[0]);
			$post->Title =		$this->Title.' à '.$this->Ville;
			$post->Type = 		'post expo';	
			$post->Content =	'[exposition]'.$this->Exposition_ID.'[/exposition]';
			$post->Category = 	'annonce';
			$post->Name =		'expo/'.$date .'/' . Post::Sanitize($this->Title.' '.$this->Ville) ;
			$post->commit();
		}else{			
			$date = 			explode(' ', $this->DateDep);
			$date =				str_replace('-', '/', $date[0]);
			$post->Title =		$this->Title.' à '.$this->Ville;
			$post->Type = 		'post expo';
			$post->Content =	'[exposition]'.$this->Exposition_ID.'[/exposition]';
			$post->Name =		'expo/'. $date.'/' . Post::Sanitize($this->Title.' '.$this->Ville);
			$post->Template =	'page.php';
			$post->commit();
		}
		
		$this->Post_ID = $post->Post_ID;
		
		$request= 			new Request();
		$request->where = 	"`" . self::PRIMARY_KEY."` = ".$this->Exposition_ID;
		$request->set = 	"`".Post::PRIMARY_KEY."` = '".Sql::EscapeString($this->Post_ID)."'";
		$request->from = 	self::TABLE_NAME;
		
		$request->exec('update');
	}
/**
 * Exposition.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `exposition` (
		  `Exposition_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Post_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Title` varchar(300) NOT NULL,
		  `DateDep` datetime NOT NULL,
		  `DateRet` datetime NOT NULL,
		  `Adresse` varchar(300) NOT NULL,
		  `Adresse2` varchar(300) NOT NULL,
		  `Ville` varchar(200) NOT NULL,
		  `CP` varchar(5) NOT NULL,
		  `Description` text NOT NULL,
		  PRIMARY KEY (`Exposition_ID`)
		) ENGINE=MyISAM AUTO_INCREMENT=140 DEFAULT CHARSET=utf8";
		$request->exec('query');	
	}
/**
 * Exposition.active() -> void
 **/
	public static function Active(){
		self::Install();		
		self::Configure();
		
	}
/**
 * Exposition.Configure() -> void
 **/	
	static public function Configure(){
		$request = 			new Request();
		$request->query = 	"ALTER TABLE `".self::TABLE_NAME."` DROP `User_ID`";
		$request->exec('query');
		
		$request->query =	"ALTER TABLE `".self::TABLE_NAME."` ADD `Post_ID` BIGINT( 20 ) NOT NULL DEFAULT '0' AFTER `Exposition_ID`";
		$request->exec('query');
				
		if(class_exists('BlogPress')){
			
			$cat = new Category();
			$cat->Name = 'exposition';
			$cat->commit();
			
			$expos = self::GetList();
			for($i = 0; $i < $expos['length']; $i++){
				
				$expo = 	new Exposition($expos[$i]);
				$post = 	new Post();
				
				$date = 	explode(' ', $expo->DateDep);
				$date =		str_replace('-', '/', $date[0]);
				
				$post->Title =		$expo->Title;
				$post->Type = 		'post expo';	
				$post->Content =	'[exposition]'.$expo->Exposition_ID.'[/exposition]';
				$post->Category = 	'exposition';
				$post->Name =		'expo/'.$date .'/' . Post::Sanitize($post->Title);
				
				if(!$post->exists()){
					$post->commit();
				}
								
				$expo->Post_ID = $post->Post_ID;
				$expo->commit();
			}
		}
	}
/**
 * Exposition.deactive() -> void
 **/	
	public static function Deactive(){
		if(class_exists('BlogPress')){
			$request = 			new Request();
			$request->from = 	Post::TABLE_NAME;
			$request->where = 	"Type = 'expo' || Type='post expo'";
			
			$request->exec('delete');	
		}
	}
/**
 * Exposition.onStartInterface() -> void
 **/	
	static public function onStartInterface(){
		Blog::EnqueueScript('googlemap');
	}
/**
 * Exposition#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/
 	public function delete(){
		$request =			new Request();
		$request->from = 	self::TABLE_NAME;
		$request->where = 	self::PRIMARY_KEY.' = '.$this->Exposition_ID;
		
		return $request->exec('delete');
	}
/**
 * Exposition.exec(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){
			case self::PRE_OP."commit":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->commit()){
					return $op.'.err';	
				}
				
				echo json_encode($o);
				
				break;
				
			case self::PRE_OP."delete":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->delete()){
					return $op.'.err';	
				}
				
				echo json_encode($o);
				
				break;
			
			case self::PRE_OP."exists":
				
				$o = new self($_POST[__CLASS__]);
				
				echo json_encode($o->exists());
				
				break;
			
			case self::PRE_OP."distinct":
				
				$tab = self::Distinct($_POST['field'], @$_POST['word']);
				
				if(!$tab){
					return $op.'.err';	
				}
				
				echo json_encode($tab);
				
				break;
			
			case self::PRE_OP."count":
				$date = 	$_POST['options']->date;
				$length = 	$_POST['options']->length;
				
				$_POST['options']->op = '-count-event';
				$array = array();
				
				for($i = 1; $i <= $length; $i++){
					$_POST['options']->date = $date .'-' . substr('0'.$i, -2);
					
					$nb = self::GetList('', $_POST['options']);
					
					if(!$nb){
						return $op.'err';
					}
					
					if($nb[0]['NB'] > 0){
						array_push($array, array('date' => $_POST['options']->date, 'length' => $nb[0]['NB']));
					}
				}
				
				echo json_encode($array);
				
				break;	
			
			case self::PRE_OP."list":
				
				if(!empty($_POST['word'])){
					if(is_object($_POST['options'])){
						$_POST['options']->word = 	$_POST['word'];
					}else{
						$_POST['options'] = new stdClass();
						$_POST['options']->word = 	$_POST['word'];
					}
				}
				
				if(!empty($_POST['start']) && !empty($_POST['end'])){
					if(!is_object($_POST['options'])){
						
						$_POST['options'] = new stdClass();
					}
					
					$_POST['options']->start = 	$_POST['start'];
					$_POST['options']->end = 	$_POST['end'];
				}
				
				$tab = self::GetList($_POST['clauses'], $_POST['options']);
				
				if(!$tab){
					return $op.'.err';	
				}
				if(!empty($_POST['start']) && !empty($_POST['end'])){
					unset($tab['length'], $tab['maxLength']);	
				}
				echo json_encode($tab);
				
				break;
			
			case self::PRE_OP."print":
			
				$_POST['clauses']->limits ='';
				
				$pdf = self::PrintList($_POST['clauses'], $_POST["options"]);
				
				if(!$pdf){
					return $op.'.err';	
				}
				
				@Stream::MkDir(System::Path('prints'), 0777);
				$link = System::Path('prints') . str_replace('.', '-', self::PRE_OP) . 'list-' . date('ymdhis') .'.pdf';
				@unlink($link);
				$pdf->Output($link, 'F');
				
				echo json_encode(str_replace(ABS_PATH, URI_PATH, $link));
				
				break;
		}
		
		return 0;	
	}
/**
 * Exposition#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Exposition_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
	
	public function printPDF(){
		
		setlocale(LC_TIME, 'fr_FR');
		define('EURO',chr(128));
			
		$pdf = new pdfHTML('P','mm','A4');
		$pdf->name = 'Fiche de exposition N° '. $this->Exposition_ID;
		$pdf->AliasNbPages();
		$pdf->AddPage();
		$pdf->SetLeftMargin(5);
		$pdf->SetRightMargin(5);
		$pdf->SetAutoPageBreak(true, 15);
		$pdf->SetDisplayMode('real');
		
				
		//récupération du client et du contact
		
		//--------------------------
		//Titre----------------------
		//--------------------------
		$pdf->Ln(7);
		$back_y = $pdf->GetY();
		
		
		$pdf->SetFont('Arial','',8);
		$pdf->Cell(20,5,utf8_decode('Titre :'),0,0,'R');
		$pdf->SetFillColor(220, 220, 220);
		$pdf->SetFont('Arial','B',8);
		$pdf->Cell(78,5,utf8_decode($this->Title),0,0,'L', 1);
		$pdf->Ln(6);
		
		//--------------------------
		//DateDep-------------------
		//--------------------------
		switch(@strtoupper(LANG)){
			default:
			case 'FR':
				$DateDep = explode(' ',$this->DateDep);
				
				list($y, $m, $d) = explode('-', $DateDep[0]);
				list($h, $i, $s) = explode(':', $DateDep[1]);
				$DateDep = strftime ("%A %d %B %Y - %Hh%M", mktime($h,$i,$s,$m,$d,$y));
				
				$DateRet = explode(' ', $this->DateRet);
				
				list($y, $m, $d) = explode('-', $DateRet[0]);
				list($h, $i, $s) = explode(':', $DateRet[1]);
				$DateRet = strftime ("%A %d %B %Y - %Hh%M", mktime($h,$i,$s,$m,$d,$y));
				
				break;
		}
		
		$pdf->SetFont('Arial','',8);
		$pdf->Cell(20,5,utf8_decode('Début le :'),0,0,'R');
		$pdf->SetFillColor(220, 220, 220);
		$pdf->SetFont('Arial','B',8);
		$pdf->Cell(78,5,utf8_decode($DateDep),0,0,'L', 1);
		$pdf->Ln(6);
		
		//--------------------------
		//DateRet--------------------
		//--------------------------
		
		$pdf->SetFont('Arial','',8);
		$pdf->Cell(20,5,utf8_decode('Fin le :'),0,0,'R');
		$pdf->SetFillColor(220, 220, 220);
		$pdf->SetFont('Arial','B',8);
		$pdf->Cell(78,5, utf8_decode($DateRet),0,0,'L', 1);
				
		$back_y2 = $pdf->GetY();
		//
		
		
		//--------------------------
		//Adresse--------------------
		//--------------------------
		$pdf->SetXY(105, $back_y);
		
		$pdf->SetFont('Arial','',8);
		$pdf->Cell(20, 5, utf8_decode('Adresse :'),0,0,'R');
		$pdf->SetFillColor(220, 220, 220);
		$pdf->SetFont('Arial','B',8);
		$pdf->Cell(79, 5, utf8_decode($this->Adresse),0,0,'L', 1);
		$pdf->Ln(6);
		
		$pdf->SetX(105);
		$pdf->SetFont('Arial','',8);
		$pdf->Cell(20, 5, utf8_decode(' '),0,0,'R');
		$pdf->SetFillColor(220, 220, 220);
		$pdf->SetFont('Arial','B',8);
		$pdf->Cell(79, 5, utf8_decode($this->Adresse2),0,0,'L', 1);
		$pdf->Ln(6);
		
		$pdf->SetX(105);
		$pdf->SetFont('Arial','',8);
		$pdf->Cell(20,5, utf8_decode('Cp / Ville :'),0,0,'R');
		$pdf->SetFillColor(220, 220, 220);
		$pdf->SetFont('Arial','B',8);
		$pdf->Cell(79,5,utf8_decode($this->CP.' '.$this->Ville),0,0,'L', 1);
		$pdf->Ln(6);	
		
		$back_y3 = $pdf->GetY();
		
		$back_y2 = $back_y2 < $back_y3 ? $back_y3 : $back_y2;
		
		$pdf->Rect(5, 51, 99, $back_y2 - $back_y+1);
		$pdf->Rect(106, 51, 99, $back_y2 - $back_y+1);
		
		$pdf->SetXY(5, $back_y2);
		$pdf->Ln(4);
		
		//En-têtes listing
		$pdf->SetFont('Arial','B',9);
		$pdf->Cell(0,5,utf8_decode('Note de frais :'), 'B',0,'L');
		
		$pdf->Ln(7);
		
		$pdf->SetFont('Arial','B',8);
		$pdf->Cell(20,5,utf8_decode('N°'),0,0,'C');
		$pdf->Cell(100,5,utf8_decode('Titre'),0,0,'C');
		$pdf->Cell(20,5,utf8_decode('Date'),0,0,'C');
		$pdf->Cell(30,5,utf8_decode('Montant HT'),0,0,'C');
		$pdf->Cell(30,5,utf8_decode('Montant TTC'),0,1,'C');
		
		//Listing
		$pdf->SetFont('Arial','',8);
		
		$options->op = '-e';
		$options->value = $this->Exposition_ID;
		
		$tab = Expense::GetList('', $options);		
		$ttc = 0;
		$ht = 0;
		for($i = 0;$i < $tab['length']; $i++){
			
			switch(@strtoupper(LANG)){
				default:
				case 'FR':
					$DateDep = explode(' ', $tab[$i]['Date']);
					
					list($y, $m, $d) = explode('-', $DateDep[0]);
					
					$tab[$i]['Date'] = "$d/$m/$y";
					break;
			}
			
			$color = ($i % 2 == 0) ? 220 : 255;
			$pdf->SetFillColor($color, $color, $color);
			$pdf->SetDrawColor(255, 255, 255);		
			$pdf->Cell(20,5, $tab[$i]["Frais_ID"] . " ", 'RL', 0,'R', 1);
			$pdf->Cell(100,5, utf8_decode(" " . $tab[$i]["Description"]),'RL',0,'L', 1);
			$pdf->Cell(20,5, utf8_decode(" " . $tab[$i]["Date"]),'RL',0,'C', 1);
			$pdf->Cell(30,5, utf8_decode(" " . number_format($tab[$i]["Montant_HT"], 2) . ' ' . EURO), 'RL', 0, 'R', 1);
			$pdf->Cell(30,5, utf8_decode(" " . number_format($tab[$i]["Montant_TTC"], 2) . ' ' . EURO), 'RL', 1,'R', 1);
			
			$ht += $tab[$i]["Montant_HT"];
			$ttc += $tab[$i]["Montant_TTC"];
		}
		
		$pdf->Ln(1);
		$pdf->Cell(20,5, " ",0,0,'R');
		$pdf->Cell(100,5, " ",0,0,'L');
		$pdf->Cell(20,5, utf8_decode("Total :"),0,0,'R');
		$pdf->Cell(30, 5, number_format($ht, 2). ' ' . EURO, 1, 0, 'R');
		$pdf->Cell(30, 5, number_format($ttc, 2). ' ' . EURO, 1, 0, 'R');
		
		$pdf->Ln(7);
		
		$pdf->SetFont('Arial','B',9);
		$pdf->Cell(0,5,utf8_decode('Description :'), 'B',0,'L');

		$pdf->Ln(7);
		
		$pdf->SetFont('Arial','',8);

		@$pdf->WriteHTML(utf8_decode($this->Description));

		return $pdf;
	}
/**
 * 
 **/	
	public static function printPDFList($clauses = '', $options = ''){
				
		define('EURO',chr(128));
			
		$pdf = new PDFSimpleTable('L','mm','A4');
		$pdf->name = 'Listing des expositions';
		$pdf->AliasNbPages();
		$pdf->AddPage();
		$pdf->SetLeftMargin(5);
		$pdf->SetRightMargin(5);
		$pdf->SetAutoPageBreak(true, 15);
		$pdf->SetDisplayMode('real');
		
		//En-têtes listing
		$pdf->SetFont('Arial','B',8);
		
		$pdf->AddHeader(array(
			'Exposition_ID' => 	array('Title' => 'N°', 'Width' => 15, "BodyAlign" => "R"),
			'Title' => 			array('Title' => 'Titre', 'Width' => 80),
			'DateDep' => 		array('Title' => 'Début le', 'Width' => 30, 'BodyAlign' => 'C'),
			'DateRet' => 		array('Title' => 'Fin le', 'Width' => 30, 'BodyAlign' => 'C'),
			'Adresse' => 		array('Title' => 'Adresse', 'Width' => 60),
			'CP' => 			array('Title' => 'CP', 'Width' => 15, 'BodyAlign' => 'C'),
			'Ville' => 			array('Title' => 'Ville', 'Width' => 50),
		));
		
		$pdf->AddFilters(array('DateDep', 'DateRet'), array('Exposition', 'FilterDate'));
		$pdf->AddFilters('Adresse', array('Exposition', 'FilterAdresse'));
				
		//Listing
		$pdf->SetFont('Arial','',8);
		
		$pdf->AddRows(self::GetList($clauses, $options));
		
		return $pdf;
	}
/**
 * 
 **/	
	public static function FilterDate($e, $short = false){
		
		switch(@strtoupper(LANG)){
			default:
			case 'FR':
				$e = explode(' ', $e);				
				list($y, $m, $d) = explode('-', $e[0]);
				
				$e = "$d/$m/$y" . ($short ? '' : (' à ' . substr($e[1], 0, 5)));
				break;
		}
		
		return $e;
	}
	
	public static function FilterAdresse($e, $data){
		
		return $e;
	}
/**
 * Exposition.Distinct(field [, word]) -> Array
 *
 * Cette méthode liste les données d'une colonne de la table.
 **/
	public static function Distinct($field, $word = ''){
		$request = new Request(DB_NAME);
		
		$request->select = 	"distinct " . Sql::EscapeString($field) ." as text";		
		$request->from = 	self::TABLE_NAME;
		$request->where = 	' 1 ';
							
		if(!empty($word)){
			$request->where .= ' 
				AND '.Sql::EscapeString($field)." LIKE '". Sql::EscapeString($word)."%'";
		}
		
		$request->where .= 	" AND TRIM(".Sql::EscapeString($field).") != ''";
		$request->order =	Sql::EscapeString($field);
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		
		return $result; 
	}
/**
 * Exposition.GetList([clauses [, options]]) -> Array | boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des instances en fonction des paramètres `clauses` et `options`.
 *
 * #### Le paramètre options
 *
 * Ce paramètre permet de modifier le resultat de la liste. Voici les différentes options possibles :
 * 
 * Pas d'options.
 *
 **/
	public static function GetList($clauses = '', $options = ''){
		$request = 			new Request();
		
		$request->select = 	' *, DateDep as start, DateRet as end, CONCAT(Title," à ", Ville) as title';
		$request->from = 	self::TABLE_NAME;
		$request->where = 	' 1 ';
		
		if(!empty($options->start) && !empty($options->end)){
			$request->select .= 	', "06F" as background, "FFF" as color';
			$request->where .= " AND ((`DateDep` >= '".$options->start."' AND `DateDep` <= '".$options->end."')
								OR (`DateRet` > '".$options->start."' AND `DateRet` < '".$options->end."')
								OR (`DateDep` <= '".$options->start."' AND `DateRet` >= '".$options->end."'))";
		}
		
		
		switch(@$options->op){
			default:
			
			
				break;
			
			case '-count-event'://retourne la liste des événements suppérieur à la date demandée
				$request->select = 'COUNT(*) as NB';
				
				if(empty($options->date)){
					$options->date = date('Y-m-d');
				}
				
				$DateDep = Sql::EscapeString($options->date ." 00:00:00");
				$DateRet = Sql::EscapeString($options->date ." 23:59:59");
				
				$request->where = 	" ((`DateDep` > '".$DateDep."' AND `DateDep` < '".$DateRet."')
 									OR (`DateRet` > '".$DateDep."' AND `DateRet` < '".$DateRet."')
									OR (`DateDep` <= '".$DateDep."' AND `DateRet` >= '".$DateRet."'))";
						
				break;	
				
			case '-next':
				$request->where = '(DateDep >= NOW() OR (DateRet >= NOW() AND DateDep <= NOW())) ';
				$request->order = 'DateDep';
				break;
				
			case '-f': // 
				$request->where = 'DateRet < NOW()';
				$request->order = 'DateDep DESC';
				break;
		}
		
		if(isset($clauses) && $clauses != ''){
			if(@$clauses->where) {
								
				$request->where .= " 	AND (	Title like '%". Sql::EscapeString($clauses->where) . "%' or 
												Description like '%". Sql::EscapeString($clauses->where) . "%' or 
												Adresse like '%". Sql::EscapeString($clauses->where) . "%' or 
												Adresse2 like '%". Sql::EscapeString($clauses->where) . "%' or 
												Ville like '%". Sql::EscapeString($clauses->where) . "%' or 
												CP like '%". Sql::EscapeString($clauses->where) . "%'
											)";
				
			}
			if(@$clauses->order) 	$request->order = $clauses->order;
			if(@$clauses->limits) 	$request->limits = $clauses->limits;
		}	
						
		$result = $request->exec('select');
		//echo $request->query;
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		return $result;
	}
/**
 * Exposition.onBuildPost() -> void
 **/
 	public static function onBuildPost(){
		
		preg_match_all('/\[exposition\](.*?)\[\/exposition\]/', Post::Content(), $match);
		
		if(!empty($match)){
			for($i = 0; $i < count($match[0]); $i++){
				$expo = 		new Exposition((int) $match[1][$i]);
				
				$gmap = 		new GoogleMapAPI();
				
				$gmap->setDirectionID('route');
				$gmap->setCenter($expo->CP . ' ' . $expo->Ville);

				$gmap->enableWindowZoom = 			true;
				$gmap->enableAutomaticCenterZoom = 	false;
				$gmap->DisplayDirectionFields =		true;
				$gmap->infoWindowZoom =				10;
				
				// $gmap->setClusterer(true);
				//$gmap->setSize('490px','400px');
				$gmap->setZoom(10);
				$gmap->setLang('fr');
				$gmap->setDefaultHideMarker =		false;
							
				$coordtab = 	array();
				$coordtab[] = 	array(strtolower($expo->CP . ' ' . $expo->Ville), $expo->Ville, '<h2>'. $expo->Title.'</h2><p style=\"margin:0px\">'. $expo->Adresse. '</p><p style=\"margin:0px\">'.$expo->CP . ' ' . $expo->Ville.'</p>');
				
				$gmap->addArrayMarkerByAddress($coordtab, 'cat1');
								
				$string = '
					<div class="exposition">
						<p>L\'exposition "'. $expo->Title .'" aura lieu entre le <b>'.str_replace(':', 'h', self::FilterDate($expo->DateDep)).'</b>
						et le <b>'.str_replace(':', 'h', self::FilterDate($expo->DateRet)).'</b>.</p>
						
						<p>'. $expo->Description .'</p>
						
						<div class="location-expo">
							<h2>Localisation</h2>
							
							<table>
								<th>Adresse</th>
								<td>'. $expo->Adresse . ' ' . $expo->Adresse2.'</td>
								</tr>
								<tr>
								<th>Ville</th>
								<td>'. $expo->CP . ' ' . $expo->Ville .'</td>
								</tr>
							</table>
							
							'.$gmap.'
							
						</div>		
					</div>';
				
				Post::Content(str_replace($match[0][$i], $string, Post::Content()));
			}
		}
	}
}
Exposition::Initialize();
/**
 * class Expositions
 *
 * Cette classe gère une collection d'Expositions.
 **/
class Expositions extends ObjectTools{
	public $title =			'Expositions à venir';
	public $more =			'plus';
	public $titleClass =	'';
/**
 * Expositions.type -> String
 **/
	public $Type =			'post';
/**
 * Expositions.limits -> Number
 **/
	public $limits = 		5;
/**
 * Expositions.order -> Number
 **/
	public $order = 		'';
/**
 * Expositions.where -> String
 **/
	public $where =			'';
/**
 * Expositions.op -> String
 **/
	protected $op = 		'-e';
/**
 * new Expositions()
 *
 * Cette méthode créée une nouvelle instance `Posts`.
 **/
	function __construct($instance = NULL){
		if(is_object($instance) || is_array($instance)){
			foreach($instance as $key => $value){
				$this->$key = $value;
			}
		}
	}
/**
 * Expositions.Widget() -> String
 **/
	final static function Widget($options = NULL){
		
		$options = 	$posts = new Expositions($options);
		
		$posts = 	$posts->exec();
		
		$string = '<h3 class="'.$options->titleClass.'">' . $options->title;
		
		if($posts['maxLength'] > $posts['length']){
			$string .= '<a class="more" href="'.Blog::GetInfo('uri').'exposition/page/2">'.$options->more.'</a>';	
		}
		
		$string .= '</h3><ul class="list posts-list posts-recently">';
		
		for($i = 0; $i < $posts['length']; $i++){
			
			if($posts[$i]['Post_ID'] == 0){
				$expo = new Exposition((int) $posts[$i]['Exposition_ID']);
				$expo->commit();
			}
			
			$post = new Post((int) $posts[$i]['Post_ID']);
			$string .= '<li class="post-entry post-'.$post->Post_ID.'"><a href="'.Blog::GetInfo('uri').$post->Name.'">'. $post->Title .'</a></li>';
		}
		
		if($i == 0){
			$string .= '<li class="no-entry"><a>Aucune exposition</a></li>';
			$string .= '<li class="last-entry"><a href="'.Blog::GetInfo('uri').'exposition/">Voir les anciennes expositions</a></li>';
		}
		
		$string .= '<div class="clearfloat"></div></ul>';
		
		echo $string;
	}
	
	public function exec(){
		return Exposition::GetList($this->toObject(), $this->toObject()); 
	}
}
?>
<?php
/** section: Core
 * class ModelPDF
 * includes Models
 *
 * Cette classe gère les modèles FPDF utilisés par les différentes versions de PMO.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_modele_pdf.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class ModelPDF extends Models{
	private static $instance;
	private static $path;
/**
 * ModelPDF.Header -> Array
 *
 * Liste des attributs devant être présent dans l'entête de description d'un modèle.
 **/	
	protected $Header = array( 
		'Name' => 			'Model Name',
		'Version' => 		'Version',
		'Meta' => 			'Meta', 
		'Description' => 	'Description', 
		'Author' => 		'Author',
		'TextDomain' => 	'Text Domain', 
		'DomainPath' => 	'Domain Path',
		'Statut' =>			'Statut'
	);
/*
 * ModelPDF.Get() -> ModelPDF
 *
 * Cette méthode retourne l'instance ModelPDF.
 **/
	public static function Get(){
		
		/*if(isset(self::$instance)) return self::$instance;
		
		if(!file_exists(System::Path('models')) && file_exists(System::Path('publics') . 'Modeles/')){
			Stream::Copy(System::Path('publics') . 'Modeles/', System::Path('models'));
		}
		
		self::$path = System::Path('models.societe');
		
		@Stream::MkDir(System::Path('models'), 0777);	
		@Stream::MkDir(System::Path('models.version'), 0755);
		@Stream::MkDir(System::Path('models.societe'), 0755);
		@Stream::MkDir(System::Path('models.defaul'), 0755);
		@Stream::MkDir(System::Path('models.societe'), 0755);
		
		@chmod(self::$path, 0755);
		@chmod(System::Path('models'), 0755);
		@chmod(System::Path('models.version'), 0755);
		@chmod(System::Path('models.societe'), 0755);
		@chmod(System::Path('models.default'), 0755);
		@chmod(System::Path('models.societe'), 0755);
		
		//
		// On recherche les modèles dédiés aux clients
		//
		self::$instance = new ModelPDF(self::$path, System::Path('self'));
		
		if(self::$instance->length == 0){
			self::$path = System::Path('models.default');
			self::$instance = new ModelPDF(self::$path, System::Path('self'));
		}
		
		return self::$instance;*/
	}
/*
 * ModelPDF.exec(command) -> int
 * - command (String): Commande à exécuter.
 *
 * Cette méthode `static` exécute une commande envoyée par l'interface du logiciel.
 *
 * #### Liste des commandes gérées par cette méthode
 *
 *
 **/	
	public static function exec($op){
		
	}
/**
 * ModelPDF.resizeTo(height, width, widthMax, heightMax) -> Array
 *
 * Cette méthode donne les nouvelles dimensions d'une image pour FPDF.
 **/	
	public static function ResizeTo($height, $width, $widthMax, $heightMax){

		if($height > $width){
			
			$width = round(($heightMax / $height) * $width);				
			$height = $heightMax; 
			
			
		}
		else if($height < $width){
			
			if($widthMax <= $heightMax){
				$height = round(($widthMax / $width) * $height);
				//Largeur du nouveau logo
				$width = $widthMax;
			}else{
				
				$width = round(($heightMax / $height) * $width);				
				$height = $heightMax; 
				
				if($width > $widthMax){
					$height = round(($widthMax / $width) * $height);
					//Largeur du nouveau logo
					$width = $widthMax;
				}
				
			}
			
		}
		else if($height == $width){
			//Largeur & hauteur du nouveau logo
			
			if($heightMax > $widthMax){
				$width = $widthMax;
				$height = $widthMax;
			}
			else{
				$width = $heightMax;
				$height = $heightMax;
				
			}
		}

		return array($width, $height);
	}
}
/** section: Core
 * class pdfModel < FPDF
 *
 * Cette classe permet de créer une modèle générique FPDF avec entête et pied de page.
 **/
class pdfModel extends FPDF{
	const EURO =			'#128';
/**
 * pdfModel.HeaderType -> Number | String
 *
 * Type d'entête à utiliser.
 **/
	public $HeaderType = -1;
	public $HeaderFunc;
	public $Title = 	'';
	public $name = 		'';
	public $width = 	30;
	public $height = 	20;
	public $pageNo = 	0;
	public $lastPageNo = 1;
/**
 * pdfModel#Header() -> void
 **/
	public function Header(){
		
		$options = System::Meta('Prints');
		
		if(empty($options)){
			$options = 				new stdClass();
			$options->Name =		'';
			$options->Address = 	'';
			$options->City = 		'';
			$options->Phone = 		'';
			$options->Fax = 		'';
			$options->RCS = 		'';
			$options->TVA_Intra = 	'';
			$options->Logo = 		'';
		}
		
		if(!empty($options->Name)){
			
			$left = 5;
			
			if(!empty($options->Logo) ){
				
				$path = File::ToABS($options->Logo);
				
				if(file_exists($options->Logo)){
					if(!empty($path)){
						$this->Image($path, 5, 5, $this->width);
					}
					
					$left = $this->width + 8;
				}
			}
		
			$this->SetFont('Arial','B', 14);
			$this->SetXY($left, 3);
			$this->Cell(20,10, utf8_decode($options->Name),0,0,'L');
			$this->Ln(5);
				
			if(!empty($options->Address)){
				$this->SetFont('Arial','', 8);
				$this->SetTextColor(49, 49, 49);
				$this->SetX($left);
				$this->Cell(100,11, utf8_decode($options->Address),0,0,'L');
				$this->Ln(3);
			}
		
			if(!empty($options->City)){
				$this->SetFont('Arial','', 7);
				$this->SetTextColor(49, 49, 49);
				$this->SetX($left);
				$this->Cell(100,11, utf8_decode($options->City),0,0,'L');
				$this->Ln(3);
			}
			
			if(!empty($options->Phone)){
				$this->SetFont('Arial','', 7);
				$this->SetTextColor(49, 49, 49);
				$this->SetX($left);
				$this->Cell(100,11, utf8_decode($options->Phone),0,0,'L');
				$this->Ln(3);
			}
			
			if(!empty($options->Fax)){
				$this->SetFont('Arial','',7);
				$this->SetTextColor(49, 49, 49);
				$this->SetX($left);
				$this->Cell(100,11, utf8_decode($options->Fax),0,0,'L');
				$this->Ln(3);
			}
			if(!empty($options->RCS)){
				$this->SetFont('Arial','', 7);
				$this->SetTextColor(49, 49, 49);
				$this->SetX($left);
				$this->Cell(100,11, utf8_decode($options->RCS),0,0,'L');
				$this->Ln(3);
			}
			if(!empty($options->TVA_Intra)){
				$this->SetFont('Arial','', 7);
				$this->SetTextColor(49, 49, 49);
				$this->SetX($left);
				$this->Cell(100,11, str_replace(self::EURO, chr(128), utf8_decode(str_replace('€', self::EURO, $options->TVA_Intra))),0,0,'L');
				$this->Ln(3);
			}
			
		}
		
		System::fire('pdf:model.header', array(&$this));
				
		//Informations listing
		
		if(!empty($this->name)){
			$this->Title = $this->name;	
		}
		
		if(!empty($this->Title)){
			
			$this->SetFont('Arial','B',10);
			$this->SetTextColor(0, 0, 0);
			$this->SetDrawColor(0, 0, 0);
			
			if($this->CurOrientation == 'P' || $this->CurOrientation == 'Portrait'){
				$this->SetXY(60, 15);
				$this->Cell(90,6, utf8_decode($this->Title),1,0,'C');
			}else{
				$this->SetXY(100, 15);
				$this->Cell(90,6, utf8_decode($this->Title),1,0,'C');
			}
		}
		
		$this->SetXY(5, 35);
	}
/**
 * pdfModel.Footer() -> void
 * 
 * Cette méthode affiche le pied de page du PDF.
 **/
	function Footer(){
		
		System::fire('pdf:model.footer', array(&$this));
		
		$page = $this->Title . ' - page : '. $this->PageNo() . "/{nb}";
		$this->SetXY(5, -8);
		$this->Cell(0, 5, utf8_decode($page), 0,0,'C');
		
	}
/**
 * pdfModel#NbLines() -> void
 * 
 * Cette méthode affiche le pied de page du PDF.
 **/	
	protected function NbLines($w, $txt){
		
		//Calcule le nombre de lignes qu'occupe un MultiCell de largeur w
		$cw=&$this->CurrentFont['cw'];
		
		if($w == 0){
			$w = $this->w - $this->rMargin - $this->x;
		}
		
		$wmax = ($w - $this->cMargin) * 1000 / $this->FontSize;
				
		$s =	str_replace("\r",'',$txt);
		$nb =	strlen($s);
		
		if($nb > 0 and $s[$nb-1]=="\n"){
			$nb--;
		}
		
		$sep =-	1;
		$i =	0;
		$j =	0;
		$l =	0;
		$nl =	1;
		
		while($i<$nb){
			$c=$s[$i];
			if($c=="\n"){
				$i++;
				$sep=-1;
				$j=$i;
				$l=0;
				$nl++;
				continue;
			}
			if($c==' ')
				$sep=$i;
			$l+=$cw[$c];
			if($l>$wmax){
				if($sep==-1){
					if($i==$j)
						$i++;
				} else
					$i=$sep+1;
				$sep=-1;
				$j=$i;
				$l=0;
				$nl++;
			} else
				$i++;
		}
		
		return $nl;
	}
/**
 * pdfModel#addSection() -> void
 *
 * Cette méthode ajoute créé nouveau block de page et réinitialise le compte des pages.
 **/	
	public function addSection(){
		
		$this->AddPage();
		
		if($this->page > 1){
			//var_dump('add section');
			
			$start = $this->lastPageNo;
			
			if(!empty($this->AliasNbPages)){
				// Replace number of pages
				
				for($n = $start; $n <= $this->page; $n++){
					$this->pages[$n] = str_replace($this->AliasNbPages, $this->pageNo-1, $this->pages[$n]);
				}
			}
			
			$this->lastPageNo = $this->page;
		}
		
		
		$this->pageNo = 	1;
		//var_dump('add page ' . $this->PageNo() . ' ' . $this->pageNo);
	}

	function _putpages(){
		
		if(!empty($this->AliasNbPages))
		{
			$start = $this->lastPageNo;
			// Replace number of pages
			if(!empty($this->AliasNbPages)){
				// Replace number of pages
				
				for($n = $start; $n <= $this->page; $n++){
					$this->pages[$n] = str_replace($this->AliasNbPages, $this->pageNo, $this->pages[$n]);
				}
			}
		}
		
		return parent::_putpages();
	}

	
	public function PageNo(){
		return $this->pageNo;
	}

	public function _beginpage($orientation, $size){
		$this->pageNo++;
		return parent::_beginpage($orientation, $size);
	}
}
/** section: Core
 * class pdfHTML < pdfModel
 * 
 * Cette classe permet de convertir un document HTML simple en fichier PDF.
 **/
class pdfHTML extends pdfModel{
	var $B = '';
	var $I = '';
	var $U = '';
	var $HREF = '';
	var $fontList = '';
	var $issetfont= '';
	var $issetcolor = '';

	//////////////////////////////////////
	//html parser
	
	function WriteHTML($html){
		
		$html=strip_tags($html,"<b><u><i><a><img><p><br><strong><em><font><tr><blockquote><hr><td><tr><table><sup>"); //remove all unsupported tags
		$html=str_replace("\n",'',$html); //replace carriage returns by spaces
		$html=str_replace("\t",'',$html); //replace carriage returns by spaces
		$a=preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE); //explodes the string
		
		foreach($a as $i=>$e)
		{
			if($i%2==0)
			{
				//Text
				if($this->HREF)
					$this->PutLink($this->HREF,$e);
				elseif($this->tdbegin) {
					if(trim($e)!='' && $e!="&nbsp;") {
						$this->Cell($this->tdwidth,$this->tdheight, stripslashes(pdfHTML::htmlEntities($e)), $this->tableborder,'',$this->tdalign,$this->tdbgcolor);
					}
					elseif($e=="&nbsp;") {
						$this->Cell($this->tdwidth,$this->tdheight,'',$this->tableborder,'',$this->tdalign,$this->tdbgcolor);
					}
				}
				else
					$this->Write(5,stripslashes(pdfHTML::htmlEntities($e)));
			}
			else
			{
				//Tag
				if($e[0]=='/')
					$this->CloseTag(strtoupper(substr($e,1)));
				else
				{
					//Extract attributes
					$a2=explode(' ',$e);
					$tag=strtoupper(array_shift($a2));
					$attr=array();
					foreach($a2 as $v)
					{
						if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
							$attr[strtoupper($a3[1])]=$a3[2];
					}
					$this->OpenTag($tag,$attr);
				}
			}
		}
	}
	
	function OpenTag($tag, $attr){
		//Opening tag
		switch($tag){
	
			case 'SUP':
				if( !empty($attr['SUP']) ) {    
					//Set current font to 6pt     
					$this->SetFont('','',6);
					//Start 125cm plus width of cell to the right of left margin         
					//Superscript "1" 
					$this->Cell(2,2,$attr['SUP'],0,0,'L');
				}
				break;
	
			case 'TABLE': // TABLE-BEGIN
				if( !empty($attr['BORDER']) ) $this->tableborder=$attr['BORDER'];
				else $this->tableborder=0;
				break;
			case 'TR': //TR-BEGIN
				break;
			case 'TD': // TD-BEGIN
				if( !empty($attr['WIDTH']) ) $this->tdwidth=($attr['WIDTH']/4);
				else $this->tdwidth=40; // Set to your own width if you need bigger fixed cells
				if( !empty($attr['HEIGHT']) ) $this->tdheight=($attr['HEIGHT']/6);
				else $this->tdheight=6; // Set to your own height if you need bigger fixed cells
				if( !empty($attr['ALIGN']) ) {
					$align=$attr['ALIGN'];        
					if($align=='LEFT') $this->tdalign='L';
					if($align=='CENTER') $this->tdalign='C';
					if($align=='RIGHT') $this->tdalign='R';
				}
				else $this->tdalign='L'; // Set to your own
				if( !empty($attr['BGCOLOR']) ) {
					$coul=pdfHTML::hex2dec($attr['BGCOLOR']);
						$this->SetFillColor($coul['R'],$coul['G'],$coul['B']);
						$this->tdbgcolor=true;
					}
				$this->tdbegin=true;
				break;
	
			case 'HR':
				if( !empty($attr['WIDTH']) )
					$Width = $attr['WIDTH'];
				else
					$Width = $this->w - $this->lMargin-$this->rMargin;
				$x = $this->GetX();
				$y = $this->GetY();
				$this->SetLineWidth(0.2);
				$this->Line($x,$y,$x+$Width,$y);
				$this->SetLineWidth(0.2);
				$this->Ln(1);
				break;
			case 'STRONG':
				$this->SetStyle('B',true);
				break;
			case 'EM':
				$this->SetStyle('I',true);
				break;
			case 'B':
			case 'I':
			case 'U':
				$this->SetStyle($tag,true);
				break;
			case 'A':
				$this->HREF=$attr['HREF'];
				break;
			case 'IMG':
				if(isset($attr['SRC']) && (isset($attr['WIDTH']) || isset($attr['HEIGHT']))) {
					if(!isset($attr['WIDTH']))
						$attr['WIDTH'] = 0;
					if(!isset($attr['HEIGHT']))
						$attr['HEIGHT'] = 0;
					$this->Image($attr['SRC'], $this->GetX(), $this->GetY(), pdfHTML::px2mm($attr['WIDTH']), pdfHTML::px2mm($attr['HEIGHT']));
				}
				break;
			case 'BLOCKQUOTE':
			case 'BR':
				$this->Ln(5);
				break;
			case 'P':
				$this->Ln(10);
				break;
			case 'FONT':
				if (isset($attr['COLOR']) && $attr['COLOR']!='') {
					$coul=pdfHTML::hex2dec($attr['COLOR']);
					$this->SetTextColor($coul['R'],$coul['G'],$coul['B']);
					$this->issetcolor=true;
				}
				if (isset($attr['FACE']) && in_array(strtolower($attr['FACE']), $this->fontlist)) {
					$this->SetFont(strtolower($attr['FACE']));
					$this->issetfont=true;
				}
				if (isset($attr['FACE']) && in_array(strtolower($attr['FACE']), $this->fontlist) && isset($attr['SIZE']) && $attr['SIZE']!='') {
					$this->SetFont(strtolower($attr['FACE']),'',$attr['SIZE']);
					$this->issetfont=true;
				}
				break;
		}
	}
	
	function CloseTag($tag){
		//Closing tag
		if($tag=='SUP') {
		}
	
		if($tag=='TD') { // TD-END
			$this->tdbegin=false;
			$this->tdwidth=0;
			$this->tdheight=0;
			$this->tdalign="L";
			$this->tdbgcolor=false;
		}
		if($tag=='TR') { // TR-END
			$this->Ln();
		}
		if($tag=='TABLE') { // TABLE-END
			//$this->Ln();
			$this->tableborder=0;
		}
	
		if($tag=='STRONG')
			$tag='B';
		if($tag=='EM')
			$tag='I';
		if($tag=='B' || $tag=='I' || $tag=='U')
			$this->SetStyle($tag,false);
		if($tag=='A')
			$this->HREF='';
		if($tag=='FONT'){
			if ($this->issetcolor==true) {
				$this->SetTextColor(0);
			}
			if ($this->issetfont) {
				$this->SetFont('arial');
				$this->issetfont=false;
			}
		}
	}
	
	function SetStyle($tag, $enable){
		//Modify style and select corresponding font
		$this->$tag+=($enable ? 1 : -1);
		$style='';
		foreach(array('B','I','U') as $s) {
			if($this->$s>0)
				$style.=$s;
		}
		$this->SetFont('',$style);
	}
	
	function PutLink($URL, $txt){
		//Put a hyperlink
		$this->SetTextColor(0,0,255);
		$this->SetStyle('U',true);
		$this->Write(5,$txt,$URL);
		$this->SetStyle('U',false);
		$this->SetTextColor(0);
	}	
/*
 * Récupération de couleur.
 **/
	public static function hex2dec($couleur = "#000000"){
		$R = substr($couleur, 1, 2);
		$rouge = hexdec($R);
		$V = substr($couleur, 3, 2);
		$vert = hexdec($V);
		$B = substr($couleur, 5, 2);
		$bleu = hexdec($B);
		$tbl_couleur = array();
		$tbl_couleur['R']=$rouge;
		$tbl_couleur['G']=$vert;
		$tbl_couleur['B']=$bleu;
		return $tbl_couleur;
	}
/*
 * Convertion Pixel vers millimetre
 **/
	public static function px2mm($px){
		return $px * 25.4 / 72;
	}
/*
 *
 **/
	public static function htmlEntities($html){
		$trans = get_html_translation_table(HTML_ENTITIES);
		$trans = array_flip($trans);
		return strtr($html, $trans);
	}
}
/** section: Core
 * class pdfCssStyle
 *
 * Cette classe founrnit un parseur CSS simple pour la création de modèle [[FDPF]].
 **/
class pdfCssStyle extends ObjectTools{
/**
 * pdfCssStyle#Background -> Color
 **/	
	public $Background = 	NULL;
/**
 * pdfCssStyle#Color -> Color
 **/
	public $Color = 		NULL;
/**
 * pdfCssStyle#Fill -> Color
 **/
	public $Fill =			1;
/**
 * pdfCssStyle#BorderColor -> String
 **/
	public $BorderColor =	NULL;
/**
 * pdfCssStyle#BorderStyle -> String
 **/
	public $BorderStyle =	0;
/**
 * pdfCssStyle#FontSize -> Number
 **/
	public $FontSize =		12;
/**
 * pdfCssStyle#FontFamily -> String
 **/
	public $FontFamily =	'Arial';
/**
 * pdfCssStyle#FontWeight -> String
 **/
	public $FontWeight =	'';
/**
 * pdfCssStyle#TextAlign -> String
 **/
	public $TextAlign =		'J';
/**
 * pdfCssStyle#Width -> String
 **/
	public $Width = 		0;
/**
 * pdfCssStyle#Height -> String
 **/	
	public $Height =		5;
/**
 * pdfCssStyle#MinHeight -> String
 **/	
	public $MinHeight =		0;
/**
 * pdfCssStyle#Overflow -> String
 **/	
	public $Overflow = 		1;
/**
 * new pdfCssStyle()
 **/	
	function __construct($css = ''){
		$this->Background = 	new Color('#FFF');
		$this->Color = 			new Color('#000');
		$this->BorderColor = 	new Color('#000');
		
		if(!empty($css)){
			$this->setStyle($css);	
		}
	}
/**
 * pdfCssStyle.setStyle(style) -> void
 **/	
	public function setStyle($style){
		$style = explode(';', $style);
		
		for($i = 0; $i < count($style); $i++){
			
			$current = 		explode(':',trim($style[$i]));
			if(count($current) != 2){
				continue;	
			}
			$current[1] =	trim($current[1]);
			//var_dump($current);
			switch(trim(strtolower($current[0]))){
				case 'background':
					$this->Background = new Color($current[1]);
					break;
					
				case 'color':
					$this->Color = new Color($current[1]);
					break;
					
				case 'border':
					$current = explode(' ', $current[1]);
					$this->BorderColor = new Color('#000');
					$this->BorderStyle = 1;
					
					foreach($current as $value){
						if(substr($value, 0, 1) == '#'){
							$this->BorderColor = new Color($value);
						}else{
							$this->BorderStyle = $value;
						}
					}
					break;
					
				case 'borderstyle':
				case 'border-style':
					$this->BorderStyle = $current[1];
					break;
					
				case 'bordercolor':
				case 'border-color':
					if($this->BorderStyle == 0){
						$this->BorderStyle = 1;	
					}
					$this->BorderColor = 	new Color($current[1]);
					break;
				case 'font-family':
					$this->FontWeight = 	$current[1];
					break;
				case 'font-weight':
					$this->FontWeight = 	strtolower($current[1]) == 'bold' ? 'B' : '';
					break;
				case 'font-size':
					$this->FontSize = 		(int) str_replace('px', '', $current[1]);
					break;
				case 'font':
					
					if(strpos($current[1], 'bold') !== false){
						$current[1] = str_replace('bold', '', $current[1]);
						$this->FontWeight = 'B';
					}
					
					$current[1] = explode(' ', $current[1]);
					
					foreach($current[1] as $value){
						$tmp = str_replace('px', '', $value);
						
						if(is_numeric($tmp)){
							$this->FontSize = 	(int) $tmp;
						}else{
							$this->FontFamily = $value;
						}
					}
					break;
				
				case 'fill':
					$this->Fill = 		strtolower($current[1]) == 'true' ? 1 : 0;
					break;
					
				case 'text-align':
					$this->TextAlign = 	strtoupper(substr($current[1], 0, 1));
					break;
				
				case 'width':
					$this->Width = 		(int) str_replace('px', '', $current[1]);
					break;
				
				case 'height':
					$this->Height = 	(int) str_replace('px', '', $current[1]);
					break;
				
				case 'min-height':
					$this->MinHeight = 	(int) str_replace('px', '', $current[1]);
					break;

								
				case 'overflow':
					$this->Overflow = 	strtolower($current[1]) == 'visible' ? 1 : 0;
					break;	
			}
		}
		//var_dump($this);
	}
	
	public function apply($pdf){
		$pdf->SetFillColor($this->Background->getRed(), $this->Background->getGreen(), $this->Background->getBlue());
		$pdf->SetDrawColor($this->BorderColor->getRed(), $this->BorderColor->getGreen(), $this->BorderColor->getBlue());
		$pdf->SetTextColor($this->Color->getRed(), $this->Color->getGreen(), $this->Color->getBlue());
		$pdf->SetFont($this->FontFamily, $this->FontWeight, $this->FontSize);
	}
	
	public static function Reset($pdf){
		$pdf->SetFillColor(255, 255, 255);
		$pdf->SetDrawColor(255, 255, 255);
		$pdf->SetTextColor(0, 0, 0);
		$pdf->SetFont('Arial','', 8);	
	}
}
/** section: Core
 * class pdfSimpleTable < pdfHTML
 *
 * Cette classe permet de créer des documents PDF avec un tableau de données paramètrable.
 **/
class pdfSimpleTable extends pdfHTML{
	const EURO =			'#128';
	private $header;
	private $headerTitle = 	array();
	private $filters = 		array();
	private $callbacks = 	array();
	private $row = 			0;
	private $currentGroup =	'';
	public $totalWidth =	0;
	protected $startYTable = 0;
	public $FieldGroup =	false;
	public $FieldSum =		false;
	public $FieldSumText = 	'Qté';
	
	public $Header =		NULL;
	public $HeaderGroup =	NULL;
	public $Body =			NULL;
	public $BG1 = 			240;
/**
 * new pdfSimpleTable()
 *
 * Cette méthode créée une nouvelle instance [[pdfSimpleTable]].
 **/	
	function __construct($arg1 = '', $arg2 = '', $arg3 = ''){
		
		parent::__construct($arg1, $arg2, $arg3);
		
		$this->Header = 		new pdfCssStyle('background:200; color:#000; border:#FFF; font: 8px Arial bold; text-align:center;');
		$this->HeaderGroup = 	new pdfCssStyle('background:170; color:#FFF; border:#FFF; font: 8px Arial bold; text-align:left;');
		$this->Body = 			new pdfCssStyle('background:240; color:#000; border:#FFF; font: 8px Arial; text-align:left;');
		$this->Body2 = 			new pdfCssStyle('background:255; color:#000; border:#FFF; font: 8px Arial; text-align:left;');
		
	}
/**
 * pdfSimpleTable#AddHeader(header) -> void
 * - header (Array): Tableau de configuration d'une entête de tableau PDF. 
 *
 * Cette méthode permet de configuer l'entête du tableau de données.
 **/
	public function AddHeader($header){
		//
		// Assignation des styles de l'ancienne version
		//
		if(isset($this->HeaderBG)){
			$this->Header->setStyle('background:'.$this->HeaderBG.';');
			$this->HeaderBG->setStyle('background:'.($this->HeaderBG - 30).';');
		}
		if(isset($this->HeaderColor)){
			$this->Header->setStyle('color:'.$this->HeaderColor.';');
			$this->HeaderGroup->setStyle('color:'.$this->HeaderGroupColor.';');
		}
		if(isset($this->HeaderBorder)){
			$this->Header->setStyle('border-color:'.$this->HeaderBorder.';');
			$this->HeaderBorder->setStyle('border-color:'.$this->HeaderBorderColor.';');
		}
		
		if($this->BG1 != 240){
			$this->Body->setStyle('background:'.$this->BG1.';');
		}
		if(isset($this->BG2)){
			$this->Body->setStyle('background:'.$this->BG2.';');
		}
		if(isset($this->Color1)){
			$this->Body->setStyle('color:'.$this->Color1.';');
		}
		if(isset($this->Color2)){
			$this->Body->setStyle('color:'.$this->Color2.';');
		}
		
		if(isset($this->Color1)){
			$this->Body->setStyle('border-color:'.$this->Border1.';');
		}
		if(isset($this->Color2)){
			$this->Body->setStyle('border-color:'.$this->Border2.';');
		}
		
		$this->header = 		$header;
		$this->headerTitle = 	array();
		$this->currentGroup = 	'';
		$this->totalWidth =		0;
		
		foreach($this->header as $key => $value){
			$this->headerTitle[] = 	$value['Title'];
			//$this->widths[] =		$value['Width'];
			$this->totalWidth += 	$value['Width'];
		}
					
		$this->addRow();
	}
/**
 * pdfSimpleTable#Observe(event, callback) -> void
 * - event (String): Nom de l'événement à observer.
 * - callback (Array|String): Fonction à appeler.
 * 
 * Cette méthode permet d'observer un événement.
 **/	
	public function Observe($event, $callback){
		$this->callbacks[$event] = $callback;		
	}
/**
 * pdfSimpleTable#FireEvent(event [, args]) -> void
 * - event (String): Nom de l'événement à déclencher
 * - args (Array): Liste des arguments à passer aux fonctions écoutant l'événement.
 *
 * Cette méthode déclenche un évenement `event`.
 **/
	private function FireEvent($event, $args){
		if(empty($this->callbacks[$event])) return;
		
		return call_user_func_array($this->callbacks[$event], $args);
	}
/**
 * pdfSimpleTable#AddFilters(key, callback) -> void
 * - key (String|callback): Nom ou liste de nom des colonnes à filtrer.
 *
 * Cette méthode permet d'appliquer un filtre de mise en forme sur une colonne du tableau.
 **/
	public function AddFilters($keys, $callback){
		
		if(!is_array($keys)){			
			$this->filters[$keys] = $callback;
		}else{
			
			for($i = 0; $i < count($keys); $i++){
				$this->addFilters($keys[$i], $callback);	
			}
		}
	}
/**
 * pdfSimpleTable#Fire(event [, args]) -> void
 * - event (String): Nom de l'événement à déclencher
 * - args (Array): Liste des arguments à passer aux fonctions écoutant l'événement.
 *
 * Cette méthode déclenche un évenement `event`.
 **/
	private function Fire($key, $args){
		if(@$this->filters[$key] == '') return $args[0];
		
		return call_user_func_array($this->filters[$key], $args);
	}
/**
 * pdfSimpleTable#AddRows(array) -> void
 * - array (Array): Tableau de données à ajouter.
 *
 * Cette méthode permet d'ajouter un tableau de données au tableau PDF.
 **/
	public function AddRows($array){
		
		$length = @$array['length'] != '' ? $array['length'] : count($array);
		$backY = $this->GetY();
		
		for($i = 0; $i < $length; $i++){
			if(empty($array[$i])){
				continue;	
			}
			if($this->FieldGroup){
				if($this->CheckPageBreak(5)){
					$this->AddRow();	
				}
				
				if($array[$i][$this->FieldGroup] != $this->currentGroup){//critère de regroupement
					$x = $this->GetX();
					$y = $this->GetY();
					$w = $this->totalWidth;
					
					pdfCssStyle::Reset($this);
					//
					// Creation du style
					//
					$style = new pdfCssStyle();
					$style->extend($this->HeaderGroup);
					//
					// Application du style
					//
					$style->apply($this);
															
					$this->Rect($x, $y, $w, $style->Height, 'DF');	
					
					$nb = 0;
					$this->currentGroup = $array[$i][$this->FieldGroup];
					
					$sum = 0;
									
					for($y = $i; $y < $length && $this->currentGroup == $array[$y][$this->FieldGroup]; $y++) {
						if($this->FieldSum && $this->currentGroup == $array[$y][$this->FieldGroup]){
							if(is_numeric($array[$y][$this->FieldSum] )){
								$sum += $array[$y][$this->FieldSum];
							}
						}
					}
					if(!$this->FieldSum){
						$sum = $y - $i;
					}
					
					$str = $this->Fire('fieldGroup', array(!isset($array[$i][$this->FieldGroup]) ? '' : $array[$i][$this->FieldGroup], &$this));
					$str = empty($str) ?  $array[$i][$this->FieldGroup] : $str;
					
					$this->MultiCell($w, $style->Height, utf8_decode($str) . " (" . utf8_decode($this->FieldSumText). " : " . ($sum). ')', $style->BorderStyle, $style->TextAlign, $style->Fill);					
				}
			}
			
			$this->AddRow($array[$i]);
		}
		
		if(in_array($this->Body->BorderStyle, array('L', 'RL', 'LR', 'R'))){
			$this->Body->apply($this);
			//on est dans le cas d'un rendu de border droite et/ou gauche. Logiquement il manquera la bordure de fin
			//var_dump($this->LastX);
			$this->Line($this->GetX(), $this->GetY(), $this->LastX, $this->GetY());
			pdfCssStyle::Reset($this);
		}
		
		$newY = $this->GetY();
		
		if(!empty($this->Header->MinHeight)){//ya un cadre de hauteur minimale
			
			if(1 * $this->Header->MinHeight < 0){//hauteur calculé par rapport à la bordure basse de la page
				$min = $this->PageBreakTrigger + 1 * $this->Header->MinHeight;
								
				if($newY < $min){
					$this->SetY($min);
				}
				
			}else{
				
				if(($newY - $backY) < $this->Header->MinHeight){
					$this->SetY($this->startYTable + $this->Header->MinHeight - 5);
				}
			}
			
			
		}
	}
/**
 * pdfSimpleTable#AddRow(data) -> void
 * - data (Object|Array): Données à ajouter au tableau PDF.
 *
 * Cette méthode permet d'ajouter une ligne au tableau PDF.
 **/	
	public function AddRow($data = NULL){
		$this->FireEvent('addrow', array($this));
		
		pdfCssStyle::Reset($this);
		
		//Calcule la hauteur de la ligne
		$drawHeader = 	false;
		
		if(!is_array($data)){//recupération de l'entete
			$data = 		$this->headerTitle;
			$drawHeader = 	true;
		}
		
		$length = count($this->headerTitle);
		
		$nb = 	$this->preLayout($data, $drawHeader);
		$h = 	($drawHeader ? $this->Header->Height : $this->Body->Height)  * $nb;
		
		//Effectue un saut de page si nécessaire
		if($this->CheckPageBreak($h) && !$drawHeader){//ajout de l'entete avant la première ligne			
			$this->AddRow();
		}
		
		//Dessine les cellules
		$this->row = 	$this->row == 0 ? 1 : 0;
		$this->LastX = 	$this->GetX();
		
		foreach($this->header as $key => $value){
			
			//Sauve la position courante
			$x = $this->GetX();
			$y = $this->GetY();
			
			pdfCssStyle::Reset($this);
			//
			// Creation du style
			//
			$style = new pdfCssStyle();
			
			if($drawHeader){//Ajout d'une entete de tableau
				$style->extend($this->Header);
				$this->row = 	0;
				
				if(isset($value['Style'])){
					$style->setStyle($value['Style']);
				}
				
				if(isset($value['HeaderStyle'])){
					$style->setStyle($value['HeaderStyle']);
				}
			}else{
				if($this->row){
					$style->extend($this->Body);
				}else{
					$style->extend($this->Body2);
				}
				
				if(isset($value['Style'])){
					$style->setStyle($value['Style']);
				}
				
				if(isset($value['BodyStyle'])){
					$style->setStyle($value['BodyStyle']);
				}
			}
			
			$node =  $drawHeader ? $value['Title'] : '';
			
			if(isset($value['Width'])){
				$style->Width = $value['Width'];
			}
			
			if(isset($value['Align'])){
				$style->TextAlign = @$value['Align'] == '' ? 'C' : $value['Align'];
			}
			
			if(isset($value['Border'])){
				$style->TextAlign = $value['Border'];
			}
				
			if(isset($value['BodyAlign'])){
				$style->TextAlign = @$value['BodyAlign'] == '' ? 'L' : $value['BodyAlign'];
			}
			
			if(isset($value['BodyBorder'])){
				$style->TextAlign = $value['BodyBorder'];
			}
			//
			// Application du style
			//
			$style->apply($this);
			
			if(!$drawHeader){
				$node = 		$this->Fire($key, array(@$data[$key], $data, &$this));
			}
			
			//Imprime le texte
			$this->Rect($x, $y, $style->Width, $h, 'F');
			
			if(strpos($style->BorderStyle, 'T') !== false || $style->BorderStyle == 1){
				$this->Line($x, $y, $x + $style->Width, $y);
			}
			
			if(strpos($style->BorderStyle, 'B') !== false || $style->BorderStyle == 1){
				$this->Line($x, $y + $h, $x + $style->Width, $y + $h);
			}
			
			if(strpos($style->BorderStyle, 'L') !== false || $style->BorderStyle == 1){
				$this->Line($x, $y, $x, $y + $h);
			}
			
			if(strpos($style->BorderStyle, 'R') !== false || $style->BorderStyle == 1){
				$this->Line($x + $style->Width, $y, $x + $style->Width, $y + $h);
			}
			
			$this->MultiCell($style->Width, $style->Height, str_replace(self::EURO, chr(128), utf8_decode($node)), 0, $style->TextAlign, 0);
						
			$this->LastX += $style->Width;
			//Repositionne à droite
			$this->SetXY($x + $style->Width, $y);
			
			pdfCssStyle::Reset($this);
		}
		
		//Va à la ligne
		if($drawHeader){
			$this->Header->apply($this);
			
			if(empty($this->Header->MinHeight) || $this->PageNo() > 1){
				$this->Rect(5, $this->GetY(), $this->totalWidth, $this->Header->Height);
			}else{
				
				if(1 * $this->Header->MinHeight < 0){//hauteur calculé par rapport à la bordure basse de la page
					$min = 	$this->PageBreakTrigger;
					$min += 1 * $this->Header->MinHeight;
					$min -= $this->GetY();
					
					$this->Rect(5, $this->GetY(), $this->totalWidth, $min);
					
				}else{
					$this->Rect(5, $this->GetY(), $this->totalWidth, $this->Header->MinHeight);
				}								
			}
		}
		
		$this->Ln($h);
		
		pdfCssStyle::Reset($this);
		
	}
	
	protected function preLayout($data, $drawHeader = false){
		$nb = 0;
		//calcul de l'occupation de l'espace
		foreach($this->header as $key => $value){
			//
			// Creation du style
			//
			$style = new pdfCssStyle();
			
			
			if($drawHeader){
				$style->extend($this->Header);
				
				if(isset($value['Style'])){
					$style->setStyle($value['Style']);
				}
				
				if(isset($value['HeaderStyle'])){
					$style->setStyle($value['HeaderStyle']);
				}
				
				$style->apply($this);
				
				if($style->Overflow == 1){
					$nb = max($nb, $this->NbLines($value['Width'], $value['Title']));
				}else{
					$nb = max($nb, 1);	
				}
				
			}else{
				
				if($this->row){
					$style->extend($this->Body);
				}else{
					$style->extend($this->Body2);
				}
				
				if(isset($value['Style'])){
					$style->setStyle($value['Style']);
				}
				
				if(isset($value['BodyStyle'])){
					$style->setStyle($value['BodyStyle']);
				}
				
				$node = $this->Fire($key, array(!isset($data[$key]) ? '' : $data[$key], $data, &$this));
				
				$style->apply($this);
				
				if($style->Overflow == 1){
					$nb = max($nb, $this->NbLines($value['Width'], $node));
				}else{
					$nb = max($nb, 1);
				}
			}
			
			pdfCssStyle::Reset($this);
		}
		
		return $nb;
	}

	protected function CheckPageBreak($h){
		//Si la hauteur h provoque un débordement, saut de page manuel
		if($this->GetY() + $h > $this->PageBreakTrigger){
			
			if(in_array($this->Body->BorderStyle, array('L', 'RL', 'LR', 'R'))){
				$this->Body->apply($this);
				//on est dans le cas d'un rendu de border droite et/ou gauche. Logiquement il manquera la bordure de fin
				//var_dump($this->LastX);
				$this->Line($this->GetX(), $this->GetY(), $this->LastX, $this->GetY());
				pdfCssStyle::Reset($this);
			}
			
			$this->AddPage($this->CurOrientation);
			return true;
		}
		return false;
	}
}
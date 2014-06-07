<?php
/** section: Plugins
 * class MyStoreCommandPDF < pdfSimpleTable
 * 
 * Modèle PDF de base.
 **/
class MyStoreCommandPDF extends pdfSimpleTable{
	
	public $BackgroundBox = 		array(255, 234, 206);
	public $ColorTitleBox =			array(210, 10, 38);
	public $BorderTitleSection = 	array(255, 144, 0);
	public $ColorAmount = 			array(255, 144, 0);
/**
 *
 **/	
	protected $headerInfo =			array(
		'Reference' => 		array(
								'Title' => 	'Reference', 
								'Width' =>	'63',
								'HeaderStyle' => 'text-align:left;'
							),
							
		'Qte' => 			array(
								'Title' => 'Qte', 
								'Width' =>	'20',
								'BodyStyle' => 	'text-align:center'
							),
							
		'Price' => 			array(
								'Title' => 		'PU HT sans Eco C.', 
								'Width' =>		'23',
								'BodyStyle' => 	'text-align:right'
							),
							
		'Eco_Tax' => 		array(
								'Title' => 		'U. HT Eco C.', 
								'Width' =>		'23',
								'BodyStyle' => 	'text-align:right'
							),
												
		'Total_HT' => 		array(
								'Title' => 		'Total HT sans Eco C.', 
								'Width'=>		'23',
								'BodyStyle' => 	'text-align:right;'
							),
		
		'Total_Eco_Tax' => 	array(
								'Title' => 		'Total Eco C.', 
								'Width'=>		'23',
								'BodyStyle' => 	'text-align:right;'
							),
							
		'Total' => 			array(
								'Title' => 		'Total HT avec Eco C.', 
								'Width'=>		'25',
								'BodyStyle' => 	'text-align:right; border:0'
							)
	);
	
	function __construct($u, $d, $t){
		
		parent::__construct($u, $d, $t);
		
		/*$this->Table = 			new pdfCssStyle('background:FFF; color:#000; border:#666 B; min-height:100');
		$this->Header = 		new pdfCssStyle('background:#FFF; color:#222; border:#666 B; font: 8px Arial bold; text-align:center;');
		$this->Body = 			new pdfCssStyle('background:FFF; color:#000; font: 7px Arial; text-align:left;overflow:hidden;');
		$this->Body2 = 			new pdfCssStyle('background:efefef; border:#efefef R;color:#000; font: 7px Arial; text-align:left;overflow:hidden');
		*/
		
		/*$this->Header = 		new pdfCssStyle('background:000; color:#FFF; border:#FFF; font: 9px Arial bold; text-align:center;');
		$this->HeaderGroup = 	new pdfCssStyle('background:220; color:#000; border:#FFF; font: 9px Arial bold; text-align:left;');
		$this->Body = 			new pdfCssStyle('background:255; color:#000; border:#FFF; font: 8px Arial; text-align:left;');
		$this->Body2 = 			new pdfCssStyle('background:255; color:#000; border:#FFF; font: 8px Arial; text-align:left;');*/
		
		$this->Header = 		new pdfCssStyle('background:#666; color:#FFF; border:#000; font: 8px Arial; text-align:center;min-height:-37px');
		$this->HeaderGroup = 	new pdfCssStyle('background:220; color:#000; border:#000; font: 9px Arial bold; text-align:left;height:6px;');
		$this->Body = 			new pdfCssStyle('background:240; color:#000; border:#000 LR; font: 9px Arial; text-align:left;height:6px;');
		$this->Body2 = 			new pdfCssStyle('background:255; color:#000; border:#000 LR; font: 9px Arial; text-align:left;height:6px;');
		
	}
/**
 * MyStoreCommandPDF#drawHeaderCompany() -> void
 *
 * Cette méthode créée l'entête de page contenant les informations du vendeur.
 **/
	public function drawHeaderCompany(){
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
			
			$left = 10;
			
			if(!empty($options->Logo)){
				
				$path = File::ToABS($options->Logo);
				
				if(!empty($path)){
					$this->Image($path, 5, 8, $this->width);
				}
				
				$left = $this->width + 8;
			}
		
			$this->SetFont('Arial','B', 11);
			$this->SetTextColor(50, 50, 50);
			$this->SetDrawColor(0, 0, 0);
		
			$this->SetXY($left, 6);
			$this->Cell(20,10, utf8_decode($options->Name),0,0,'L');
			$this->Ln(6);
				
			$this->SetFont('Arial','', 8);
				
			if(!empty($options->Address)){
				$this->SetTextColor(49, 49, 49);
				$this->SetX($left);
				$this->Cell(100,11, utf8_decode($options->Address),0,0,'L');
				$this->Ln(4);
			}
		
			if(!empty($options->City)){
				$this->SetTextColor(49, 49, 49);
				$this->SetX($left);
				$this->Cell(100,11, utf8_decode($options->City),0,0,'L');
				$this->Ln(4);
			}
			
			if(!empty($options->Phone)){
				$this->SetTextColor(49, 49, 49);
				$this->SetX($left);
				
				$this->Cell(100,11, utf8_decode(ObjectPrint::PhoneFormat($options->Phone)),0,0,'L');
				$this->Ln(4);
			}
			
			if(!empty($options->Fax)){
				$this->SetTextColor(49, 49, 49);
				$this->SetX($left);
				$this->Cell(100,11, utf8_decode(ObjectPrint::PhoneFormat($options->Fax)),0,0,'L');
				$this->Ln(4);
			}
			if(!empty($options->RCS)){
				$this->SetTextColor(49, 49, 49);
				$this->SetX($left);
				$this->Cell(100,11, utf8_decode($options->RCS),0,0,'L');
				$this->Ln(4);
			}
			if(!empty($options->TVA_Intra)){
				$this->SetTextColor(49, 49, 49);
				$this->SetX($left);
				$this->Cell(100,11, utf8_decode($options->TVA_Intra),0,0,'L');
				$this->Ln(4);
			}
			
		}
		
		System::fire('pdf:model.header', array(&$this));
				
		//Informations listing
		if($this->name !=''){
			
			$this->SetFont('Arial','B',10);
			$this->SetTextColor(0, 0, 0);
			$this->SetDrawColor(0, 0, 0);
			
			if($this->CurOrientation == 'P' || $this->CurOrientation == 'Portrait'){
				$this->SetXY(60, 15);
				$this->Cell(90,6, utf8_decode($this->name),1,0,'C');
			}else{
				$this->SetXY(100, 15);
				$this->Cell(90,6, utf8_decode($this->name),1,0,'C');
			}
		}	
	}
/**
 * MyStoreCommandPDF#drawHeaderCustomer() -> void
 *
 * Cette méthode créée l'entête de page contenant les informations du client.
 **/
	public function drawHeaderCustomer(){
		
		
		$this->SetXY(135, 10);
		//
		// Block Client
		//
		$command = 	MyStoreCommand::Get();
		$address =	$command->Address_Billing;
		
		$this->SetFont('Arial','B', 11);
		$this->SetTextColor(50, 50, 50);
		$this->SetDrawColor(255, 255, 255);
		
		$this->SetFillColor($this->BackgroundBox[0], $this->BackgroundBox[1], $this->BackgroundBox[2]);
		$this->Rect(143, 8, 62, 23, 'F');
		
		$this->Cell(68,6, utf8_decode($address->Name), 0,0,'R');
		$this->Ln(6);
		
		$this->SetFont('Arial','', 8);
		
		$this->SetX(135);
		$this->Cell(68,6, utf8_decode(trim($address->Address . ' ' . $address->Address2)), 0,0,'R');
		$this->Ln(4);
		
		$this->SetX(135);
		$this->Cell(68,6, utf8_decode($address->CP .  ' ' . $address->City), 0,0,'R');
		$this->Ln(4);
		
		$this->SetX(135);
		$this->Cell(68,6, utf8_decode('Tel : ' . ObjectPrint::PhoneFormat($address->Phone)), 0,0,'R');
		$this->Ln(4);
		
	}
/**
 * MyStoreCommandPDF#drawSectionTitle(title) -> void
 * - title (String): Titre de la section.
 *
 * Cette méthode permet de créer une nouvelle section de page avec un titre.
 **/	
	public function drawSectionTitle($title){
		
		$this->SetTextColor(100, 100, 100);
		$this->SetFont('Arial','', 13);
		$this->Cell(90, 6, utf8_decode($title), 0,0,'L');
		$this->Ln(6);
		
		$this->SetDrawColor($this->BorderTitleSection[0], $this->BorderTitleSection[1], $this->BorderTitleSection[2]);
		$this->SetLineWidth(0.5);
		$this->Line(5, $this->GetY(), 205, $this->GetY());
		
		$this->Ln(6);
		
		$this->SetDrawColor(255, 255, 255);
		$this->SetLineWidth(0.2);
	}
/**
 * MyStoreCommandPDF#header() -> void
 *
 * Cette méthode imprime l'entête de la page. 
 **/
	public function Header(){
		//Logo Phibee
		
		$this->drawHeaderCompany();	
		$this->drawHeaderCustomer();		
		//Informations listing
		if($this->name != ''){
			
			$this->SetFont('Arial','B', 10);
			$this->SetTextColor(0, 0, 0);
			$this->SetDrawColor(0, 0, 0);
			
			if($this->CurOrientation == 'P' || $this->CurOrientation == 'Portrait'){
				$this->SetXY(60, 20);
				$this->Cell(90,6, utf8_decode($this->name),1,0,'C');
			}else{
				$this->SetXY(100, 20);
				$this->Cell(90,6, utf8_decode($this->name),1,0,'C');
			}
		}
				
		$this->SetXY(5, 40);
	}
/**
 * MyStoreCommandPDF#drawAddressDelivery() -> void
 *
 * Cette méthode imprime l'adresse de livraison.
 **/
	public function drawAddressDelivery($x = 5){
		$command = 	MyStoreCommand::Get();
		$address = 	$command->Address_Delivery;
		
		
		$this->SetX($x);
		$this->SetTextColor($this->ColorTitleBox[0], $this->ColorTitleBox[1], $this->ColorTitleBox[2]);
		$this->SetFont('Arial','B', 10);
		
		$this->Cell(50, 6, utf8_decode('Adresse de livraison'), 0, 0, 'L');
		$this->Ln(7);
		
		$y = $this->GetY();
		
		$this->Ln(2);
		$this->SetX($x + 2);
		
		$this->SetFont('Arial','B', 9);
		$this->SetTextColor(0, 0, 0);
		$this->Cell(56, 6, utf8_decode($address->Name),0, 0, 'L');
		$this->Ln(4.5);
		$this->SetX($x + 2);
		
		$this->SetFont('Arial','', 9);
		$this->SetTextColor(0, 0, 0);
		$this->Cell(56, 6, utf8_decode(trim($address->Address . ' ' . $address->Address2)),0, 0, 'L');
		$this->Ln(4.5);
		$this->SetX($x + 2);
		
		$this->SetTextColor(0, 0, 0);
		$this->Cell(56, 6, utf8_decode(trim($address->CP . ' ' . $address->City)),0, 0, 'L');
		$this->Ln(4.5);
		$this->SetX($x + 2);
		
		$this->SetTextColor(0, 0, 0);
		$this->Cell(56, 6, utf8_decode(trim($address->Country)),0, 0, 'L');
		$this->Ln(4.5);
		$this->SetX($x + 2);
		
		$this->SetTextColor(0, 0, 0);
		$this->Cell(56, 6, utf8_decode('Tel : ' . ObjectPrint::PhoneFormat($address->Phone)), 0, 0, 'L');
		$this->Ln(4.5);
		$this->SetX($x + 2);
		
		$this->SetDrawColor(178, 178, 178);
		$this->Rect($x, $y, 58, 27);
		
	}
/**
 * MyStoreCommandPDF#drawAddressBilling() -> void
 *
 * Cette méthode imprime l'adresse de facturation.
 **/	
	public function drawAddressBilling($x = 65){
		$command = 	MyStoreCommand::Get();
		$address = 	$command->Address_Billing;
				
		$this->SetX($x);
		$this->SetTextColor($this->ColorTitleBox[0], $this->ColorTitleBox[1], $this->ColorTitleBox[2]);
		$this->SetFont('Arial','B', 10);
		//$this->SetFillColor(255, 144, 0);
		
		$this->Cell(56, 6, utf8_decode('Adresse de facturation'), 0, 0, 'L');
		$this->Ln(7);
		
		$y = $this->GetY();
		
		$this->Ln(2);
		$this->SetX($x + 2);
		
		$this->SetFont('Arial','B', 9);
		$this->SetTextColor(0, 0, 0);
		$this->Cell(56, 6, utf8_decode($address->Name),0, 0, 'L');
		$this->Ln(4.5);
		$this->SetX($x + 2);
		
		$this->SetFont('Arial','', 9);
		$this->SetTextColor(0, 0, 0);
		$this->Cell(50, 6, utf8_decode(trim($address->Address . ' ' . $address->Address2)),0, 0, 'L');
		$this->Ln(4.5);
		$this->SetX($x + 2);
		
		$this->SetTextColor(0, 0, 0);
		$this->Cell(56, 6, utf8_decode(trim($address->CP . ' ' . $address->City)),0, 0, 'L');
		$this->Ln(4.5);
		$this->SetX($x + 2);
		
		$this->SetTextColor(0, 0, 0);
		$this->Cell(56, 6, utf8_decode(trim($address->Country)),0, 0, 'L');
		$this->Ln(4.5);
		$this->SetX($x + 2);
		
		$this->SetTextColor(0, 0, 0);
		$this->Cell(56, 6, utf8_decode('Tel : ' . ObjectPrint::PhoneFormat($address->Phone)),0, 0, 'L');
		$this->Ln(4.5);
		$this->SetX($x + 2);
		
		$this->SetDrawColor(178, 178, 178);
		$this->Rect($x, $y, 58, 27);
		
		
	}
/**
 * MyStoreCommandPDF#drawBankInfo() -> void
 *
 * Cette méthode imprime les informations bancaires du vendeur.
 **/	
	public function drawBankInfo($x = 5, $y = -1){
		$options = System::Meta('Prints_Bank');
		
		if(empty($options)){
			return;
		}
		
		if($y < 0){
			$y = $this->GetY() + $y;	
		}
		
		$this->SetY($y);
		$this->SetX($x);
		$this->SetTextColor($this->ColorTitleBox[0], $this->ColorTitleBox[1], $this->ColorTitleBox[2]);
		$this->SetFont('Arial','B', 10);
		//$this->SetFillColor(255, 144, 0);
		
		$this->Cell(56, 6, utf8_decode('Informations bancaires'), 0, 0, 'L');
		$this->Ln(7);
		$this->SetX($x);
		$this->SetFont('Arial','', 8);
		$this->SetTextColor(0, 0, 0);
		$this->SetFillColor($this->BackgroundBox[0], $this->BackgroundBox[1], $this->BackgroundBox[2]);
		
		$this->MultiCell(80, 5, utf8_decode($options), 0, 'L', 1);
		
		$this->SetFillColor(255, 255, 255);
		
	}
/**
 * MyStoreCommandPDF#drawProducts() -> void
 *
 * Cette méthode imprime les produits de la facture.
 **/	
	public function drawProducts(){
		
		$this->SetFont('Arial','',8);
		$this->AddHeader($this->headerInfo);
		
		$this->addFilters('Price', array(__CLASS__, 'drawPriceHT'));
		$this->addFilters('Eco_Tax', array(__CLASS__, 'drawEcoTax'));
		$this->addFilters('Total_HT', array(__CLASS__, 'drawTotalHT'));
		$this->addFilters('Total_Eco_Tax', array(__CLASS__, 'drawTotalEcoTax'));
		$this->addFilters('Total', array(__CLASS__, 'drawTotal'));
		
		$details = MyStoreCommand::GetProducts();
		
		$y = $this->GetY();
		
		@$this->addRows($details);
		
		$this->SetY(max($this->GetY(),$y + 95));
		$y = $this->GetY();
		
		$this->Ln(2);
		
		$this->Cell(175,6, utf8_decode('Total' . (MyStore::ModeTVA() != MyStore::TVA_DISABLED ? ' ' . MUI('HT') : '')), 0,0,'R');
		$this->Cell(25,6, MyStoreCommand::AmountHT(',', ' ', 'pdf'), 0,0,'R');
		$this->Ln(6);
		$this->SetX(5);
				
		$this->SetTextColor(80, 80, 80);
		$this->SetDrawColor(0, 0, 0);
		$this->SetFont('Arial','', 8);
		
		$this->Cell(175,6, utf8_decode('Eco contribution HT'), 0,0,'R');
		$this->Cell(25,6, MyStoreCommand::EcoTax(',', ' ', 'pdf'), 0,0,'R');
		$this->Ln(6);
		$this->SetX(5);
		
		switch(MyStore::ModeTVA()){
			case MyStore::TVA_PRINT:
			case MyStore::TVA_USE:
				$this->Cell(175,6, utf8_decode('TVA ' . MyStore::TVA() . '%'), 0,0,'R');
				$this->Cell(25,6, MyStoreCommand::AmountTVA(',', ' ', 'pdf'), 0,0,'R');
				break;
		}
		
		
		//if(MyStoreCommand::CostDelivery() != MyStore::NullPrice()){
			$this->Ln(6);
			$this->SetX(5);
				
			$this->Cell(175,6, utf8_decode('Coût de livraison'), 0,0,'R');
			$this->Cell(25,6, MyStoreCommand::CostDelivery(',', ' ', 'pdf'), 0,0,'R');	
		//}
				
		$this->Ln(7);
		$this->SetX(5);
		
		$this->SetFont('Arial','B', 9);
		$this->SetTextColor(80, 80, 80);
		$this->SetDrawColor(0, 0, 0);
		
		$this->Cell(175,6, utf8_decode('Total' . (MyStore::ModeTVA() != MyStore::TVA_DISABLED ? ' ' . MUI('TTC') : '')), 0,0,'R');
		
		$this->SetTextColor($this->ColorAmount[0], $this->ColorAmount[1], $this->ColorAmount[2]);
		$this->Cell(25,6, MyStoreCommand::AmountTTC(',', ' ', 'pdf'), 0,0,'R');
		
		$this->SetTextColor(0, 0, 0);	
		
		$this->drawBankInfo(5, $y + 3);
		
	}
	
	public static function drawPriceHT($e, $data){
		return number_format($e * 1 - 1 * $data['Eco_Tax'], 2, ',', ' ') . ' ' . self::EURO;
	}
	
	public static function drawEcoTax($e, $data){
		return number_format($e, 2, ',', ' ') . ' ' . self::EURO;
	}
	
	public static function drawTotalEcoTax($e, $data){
		return number_format($data['Eco_Tax'] * $data['Qte'], 2, ',', ' ') . ' ' . self::EURO;
	}
	
	public static function drawTotalHT($e, $data){
		return number_format(($data['Price'] * 1 - 1 * $data['Eco_Tax']) * $data['Qte'], 2, ',', ' ') . ' ' . self::EURO;
	}
	
	public static function drawTotal($e, $data){
		
		$e = $data['Qte'] * $data['Price'];
		
		return number_format($e * 1, 2, ',', ' ') . ' ' . self::EURO;
	}
/**
 * pdfModel#footer() -> void
 * 
 * Cette méthode affiche le pied de page du PDF.
 **/
	function Footer(){
		
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
		
		
		$this->SetTextColor(0, 0, 0);
		
		$page = $options->Name . ' | ' .$this->name . $this->PageNo() . "/{nb}";
		$this->SetXY(0, -10);
		$this->Cell(0, 5, utf8_decode($page), 0,0,'C');
		
	}
}

?>
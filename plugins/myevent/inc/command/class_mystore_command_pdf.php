<?php
/** section: MyEvent
 * class MyEventCommandPDF < pdfSimpleTable
 *
 * Modèle PDF de base.
 **/
class MyEventCommandPDF extends pdfSimpleTable{
	
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
	
	public function drawHeaderCustomer(){
		
		
		$this->SetXY(135, 10);
		//
		// Block Client
		//
		$command = 	MyEventCommand::Get();
		$address =	$command->Address_Billing;
		
		$this->SetFont('Arial','B', 11);
		$this->SetTextColor(50, 50, 50);
		$this->SetDrawColor(255, 255, 255);
		
		$this->SetFillColor(255, 234, 206);
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
		$this->Cell(68,6, utf8_decode('Tel : ' . str_replace(array(' ', '.', '_'), ' ', ObjectPrint::PhoneFormat($address->Phone))), 0,0,'R');
		$this->Ln(4);
		
		
				
	}
	
	public function drawSectionTitle($title){
		
		$this->SetTextColor(100, 100, 100);
		$this->SetFont('Arial','', 13);
		$this->Cell(90, 6, utf8_decode($title), 0,0,'L');
		$this->Ln(6);
		
		$this->SetDrawColor(255, 144, 0);
		$this->SetLineWidth(0.5);
		$this->Line(5, $this->GetY(), 205, $this->GetY());
		
		$this->Ln(6);
		
		$this->SetDrawColor(255, 255, 255);
		$this->SetLineWidth(0.2);
	}
/**
 * MyEventCommandPDF.Header() -> void
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
	
	public function drawAddressDelivery($x = 5){
		$command = 	MyEventCommand::Get();
		$address = 	$command->Address_Delivery;
		
		
		$this->SetX($x);
		$this->SetTextColor(210, 10, 38);
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
	
	public function drawAddressBilling($x = 65){
		$command = 	MyEventCommand::Get();
		$address = 	$command->Address_Billing;
				
		$this->SetX($x);
		$this->SetTextColor(210, 10, 38);
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
	
	public function drawProducts(){
				
		$this->Table = 			new pdfCssStyle('background:FFF; color:#000; border:#666 B; min-height:100');
		$this->Header = 		new pdfCssStyle('background:#FFF; color:#222; border:#666 B; font: 8px Arial bold; text-align:center;');
		$this->Body = 			new pdfCssStyle('background:FFF; color:#000; font: 7px Arial; text-align:left;overflow:hidden;');
		$this->Body2 = 			new pdfCssStyle('background:efefef; border:#efefef R;color:#000; font: 7px Arial; text-align:left;overflow:hidden');
		
		$this->SetFont('Arial','',8);
		$this->AddHeader(array(
			'Reference' => 		array(
									'Title' => 	'Reference', 
									'Width' =>	'105',
									'HeaderStyle' => 'text-align:left;'
								),
								
			'Price' => 			array(
									'Title' => 'PU HT', 
									'Width' =>	'25',
									'BodyStyle' => 	'text-align:right'
								),
								
			'Eco_Tax' => 		array(
									'Title' => 		'Eco-taxe', 
									'Width' =>		'25',
									'BodyStyle' => 	'text-align:right'
								),
													
			'Qte' => 			array(
									'Title' => 'Qte', 
									'Width' =>	'20',
									'BodyStyle' => 	'text-align:center'
								),
								
			'Total' => 			array(
									'Title' => 		'Total HT', 
									'Width'=>		'25',
									'BodyStyle' => 	'text-align:right; border:0'
								)
		));
		
		$this->addFilters('Price', array(__CLASS__, 'drawPrice'));
		$this->addFilters('Eco_Tax', array(__CLASS__, 'drawPrice'));
		$this->addFilters('Total', array(__CLASS__, 'drawTotal'));
		
		$details = MyEventCommand::GetProducts();
		
		$y = $this->GetY();
		@$this->addRows($details);
		
		$this->SetY(max($this->GetY(),$y + 100));
		
		$this->Ln(2);
		
		$this->Cell(175,6, utf8_decode('Total' . (MyEvent::ModeTVA() != MyEvent::TVA_DISABLED ? ' ' . MUI('HT') : '')), 0,0,'R');
		$this->Cell(25,6, MyEventCommand::AmountHT(',', ' ', 'pdf'), 0,0,'R');
		$this->Ln(6);
		$this->SetX(5);
				
		$this->SetTextColor(80, 80, 80);
		$this->SetDrawColor(0, 0, 0);
		$this->SetFont('Arial','', 8);
		
		$this->Cell(175,6, utf8_decode('Dont éco-taxe'), 0,0,'R');
		$this->Cell(25,6, MyEventCommand::EcoTax(',', ' ', 'pdf'), 0,0,'R');
		$this->Ln(6);
		$this->SetX(5);
		
		switch(MyEvent::ModeTVA()){
        	case MyEvent::TVA_PRINT:
			
            	$this->Cell(175,6, utf8_decode('Dont TVA ' . MyEvent::TVA() . '%'), 0,0,'R');
				$this->Cell(25,6, MyEventCommand::AmountTVA(',', ' ', 'pdf'), 0,0,'R');
				
				break;
			
			 case MyEvent::TVA_USE:
				$this->Cell(175,6, utf8_decode('TVA ' . MyEvent::TVA() . '%'), 0,0,'R');
				$this->Cell(25,6, MyEventCommand::AmountTVA(',', ' ', 'pdf'), 0,0,'R');
				break;
				
		}
		
		
		if(MyEventCommand::CostDelivery() != MyEvent::NullPrice()){
			$this->Ln(6);
			$this->SetX(5);
				
			$this->Cell(175,6, utf8_decode('Coût de livraison'), 0,0,'R');
			$this->Cell(25,6, MyEventCommand::CostDelivery(',', ' ', 'pdf'), 0,0,'R');	
		}
				
		$this->Ln(7);
		$this->SetX(5);
		
		$this->SetFont('Arial','B', 9);
		$this->SetTextColor(80, 80, 80);
		$this->SetDrawColor(0, 0, 0);
		
		$this->Cell(175,6, utf8_decode('Total' . (MyEvent::ModeTVA() != MyEvent::TVA_DISABLED ? ' ' . MUI('TTC') : '')), 0,0,'R');
		
		$this->SetTextColor(255, 144, 0);
		$this->Cell(25,6, MyEventCommand::Amount(',', ' ', 'pdf'), 0,0,'R');
		
		$this->SetTextColor(0, 0, 0);	
	}
	
	public static function drawPrice($e){
		return number_format($e * 1, 2, ',', ' ') . ' ' . self::EURO;
	}
	
	public static function drawTotal($e, $data){
		
		$e = $data['Qte'] * $data['Price'];
		
		return number_format($e * 1, 2, ',', ' ') . ' ' . self::EURO;
	}
	
/**
 * pdfModel.Footer() -> void
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
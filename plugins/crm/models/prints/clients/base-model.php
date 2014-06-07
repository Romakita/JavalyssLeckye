<?php
class modelCRMClientPDF extends pdfSimpleTable{
	
	public function __construct(){
		
		parent::__construct('P','mm','A4');
		
		$this->HeaderType = 	2;
		$this->AliasNbPages();
		$this->SetLeftMargin(5);
		$this->SetRightMargin(5);
		$this->SetAutoPageBreak(true, 15);
		$this->SetDisplayMode('real');
		
		$client = 			CRMClient::Get();
		
		setlocale(LC_TIME, 'fr_FR');
		if(!defined('EURO')){
			define('EURO',chr(128));
		}
	}
	
	public static function Initialize(){
		CRMClient::SetPDF(new self());
	}
	
	public function AddPage(){
		$client = 			CRMClient::Get();
		
		$this->Title =		'Fiche client ' . $client->Company;
				
		parent::AddPage();
	}
	
	public function draw(){				
		$this->drawInformation();
		$this->drawContacts();
		$this->drawCalls();
		$this->drawEvents();
	}
/**
 *
 **/	
	public function drawInformation(){
		$client = CRMClient::Get();
		$comment = is_object($client->Comment) ? $client->Comment : json_decode($client->Comment);
		
		$this->Ln(3);
		
		$this->SetFont('Arial','B',15);
		
		$this->Cell(150,5,utf8_decode($client->Company),0,1,'L');
		$this->Ln(3);
		
		$back_y = $this->GetY()-1;
		//--------------------------
		//User----------------------
		//--------------------------
		
		
		$this->SetFont('Arial','B',8);

		$this->Cell(20,5,utf8_decode(MUI('Raison') . ' :'),0,0,'R');
		$this->SetFillColor(220, 220, 220);
		$this->SetFont('Arial','',8);
		$this->Cell(78,5,utf8_decode($client->CompanyName),0,0,'L', 1);
		$this->Ln(6);
		
		$categories = array();
		
		for($i = 0; $i < count($client->Categories); $i++){
			
			$c = $client->Categories[$i];
			
			if($c == 'all') continue;
			
			$c = Contact::GetCategory($c);
			
			if(!empty($c)){
				array_push($categories, $c);	
			}
			
		}
		//--------------------------
		//Categorie-----------------
		//--------------------------
		$this->SetFont('Arial','B',8);
		if(count($c) <= 1){
			$this->Cell(20,5,utf8_decode(MUI('Catégorie') . ' :'),0,0,'R');
		}else{
			$this->Cell(20,5,utf8_decode(MUI('Catégories') . ' :'),0,0,'R');
		}
		$this->SetFillColor(220, 220, 220);
		$this->SetFont('Arial','',8);
		$this->Cell(78,5, utf8_decode(implode(', ', $categories)),0,0,'L', 1);
		$this->Ln(6);
		//--------------------------
		//Activite------------------
		//--------------------------
		$this->SetFont('Arial','B',8);
		$this->Cell(20,5,utf8_decode(MUI('Activité') . ' :'),0,0,'R');
		$this->SetFillColor(220, 220, 220);
		$this->SetFont('Arial','',8);
		$this->Cell(78,5, utf8_decode(@$comment->activity),0,0,'L', 1);
		$this->Ln(6);
		
		//--------------------------
		//Taille--------------------
		//--------------------------		
		$this->SetFont('Arial','B',8);
		$this->Cell(20,5,utf8_decode(MUI('Taille') .' :'),0,0,'R');
		$this->SetFillColor(220, 220, 220);
		$this->SetFont('Arial','',8);
		$this->Cell(78,5, utf8_decode(@$comment->sizeofcompany),0,0,'L', 1);
		$this->Ln(6);
		
		$back_y2 = $this->GetY();
		//--------------------------
		//E-mail--------------------
		//--------------------------
		$this->SetXY(105, $back_y+1);
		
		$this->SetFont('Arial','B',8);
		$this->Cell(20,5,utf8_decode(MUI('E-mail') .' :'),0,0,'R');
		$this->SetFillColor(220, 220, 220);
		$this->SetFont('Arial','',8);
		$this->Cell(79,5,utf8_decode(@$client->Email),0,0,'L', 1);
		$this->Ln(6);
		
		$tel = 		implode(' ', str_split(str_replace(array('.', ' ', '_', '/'), '', $client->Phone), 2));
		$fax = 		implode(' ', str_split(str_replace(array('.', ' ', '_', '/'), '', $client->Fax), 2));
		//--------------------------
		//Tel-----------------------
		//--------------------------
		$this->SetX(105);
		$this->SetFont('Arial','B',8);
		$this->Cell(20,5, utf8_decode(MUI('Tel / Fax') . ' :'),0,0,'R');
		$this->SetFillColor(220, 220, 220);
		$this->SetFont('Arial','',8);
		$this->Cell(39,5,utf8_decode($tel),0,0,'L', 1);
		$this->SetX($this->GetX() + 1);
		$this->Cell(39,5,utf8_decode($fax),0,0,'L', 1);
		$this->Ln(6);
		
		$address = explode('\n', $client->Address);
		//--------------------------
		//Adr-----------------------
		//--------------------------
		$this->SetX(105);
		$this->SetFont('Arial','B',8);
		$this->Cell(20,5,utf8_decode(MUI('Adresse') .' :'),0,0,'R');
		$this->SetFillColor(220, 220, 220);
		$this->SetFont('Arial','',8);
		$this->Cell(79,5, utf8_decode($address[0]),0,0,'L', 1);
		$this->Ln(6);
			
		//--------------------------
		//Adr2----------------------
		//--------------------------
		$this->SetX(105);
		$this->SetFont('Arial','B',8);
		$this->Cell(20,5,utf8_decode(' '),0,0,'R');
		$this->SetFillColor(220, 220, 220);
		$this->SetFont('Arial','',8);
		$this->Cell(79,5, utf8_decode(@$address[1]),0,0,'L', 1);
		$this->Ln(6);
		
		
		//--------------------------
		//Ville et CP---------------
		//--------------------------
		$this->SetX(105);
		$this->SetFont('Arial','B',8);
		$this->Cell(20,5,utf8_decode(MUI('Ville') .' :'),0,0,'R');
		$this->SetFillColor(220, 220, 220);
		$this->SetFont('Arial','',8);
		$this->Cell(79,5, utf8_decode($client->CP . ' ' . $client->City ),0,0,'L', 1);
		$this->Ln(6);
		
		$back_y3 = $this->GetY();
		//--------------------------
		//Fax-----------------------
		//--------------------------
		
		$back_y2 = $back_y2 < $back_y3 ? $back_y3 : $back_y2;
		
		$this->Rect(5, $back_y, 99, $back_y2 - $back_y);
		$this->Rect(106, $back_y, 99, $back_y2 - $back_y);
		
		$this->SetXY(5, $back_y2);
		$this->Ln(6);		
		
	}
/**
 *
 **/	
	public function drawContacts(){
		$options = new stdClass();
		$options->Client_ID = CRMClient::Get()->Client_ID;
		$_POST['options'] = $options;
		
		$tab = CRMContact::GetList($options, $options);
		
		if($tab['length'] == 0){
			return;	
		}
		
		$this->SetDrawColor(0,0,0);
		$this->SetFont('Arial','B', 13);
		$this->Cell(0,5,utf8_decode('Contacts'), 'B',0,'L');
		$this->Ln(8);
		$this->FieldGroup = '';
		
		//En-têtes listing
		$this->SetFont('Arial','B',8);
		
		$this->AddHeader(array(
			'Name' => 		array(
								'Title' => MUI('Nom'), 
								'Width'=>'50'
							),
			'Service' => 	array('Title' => MUI('Service'), 'Width'=>'50'),
			'Email' => 		array(
								'Title' => MUI('E-mail'), 
								'Width'=>'50',
								'BodyStyle' => 	'text-align:left',
								'HeaderStyle' => 'text-align:center'
							),
			'Phone' => 		array(
								'Title' => MUI('Tel/Fax'), 
								'Width'=>'50',
								'BodyStyle' => 	'text-align:left',
								'HeaderStyle' => 'text-align:center'
							)
		));
		
		if($tab['length'] == 0){
			$this->Ln(6);
			return $this;
		}
		
		$this->addFilters('Name', array(__CLASS__, 'FilterContactName'));
		$this->addFilters('Service', array(__CLASS__, 'FilterContactService'));
		$this->addFilters('Phone', array(__CLASS__, 'FilterContactPhone'));
		$this->addFilters('Email', array(__CLASS__, 'FilterContactEmail'));
		
		$this->SetFont('Arial','',8);
		@$this->addRows($tab);
		$this->Ln(6);	
	}
	
	public function FilterContactName($e, $data, $pdf){
		return $data['Name'] . ' ' . $data['FirstName'];
	}
	
	public function FilterContactPhone($e, $data){
		
		$phones = json_decode($e);
		$str = '';
		
		foreach($phones as $key => $phone){
			$str .= Contact::$LABELS[$key] . ' : ' . $phone . "\n";
		}
		
		return $str;
	}
	
	public function FilterContactEmail($e, $data){
		
		$mails = json_decode($e);
		$str = '';
		
		foreach($mails as $key => $mail){
			$str .= Contact::$LABELS[$key] . ' : ' . $mail . "\n";
		}
		
		return $str;
	}
	
	public function FilterContactService($e, $data){
		
		$obj = json_decode($data['Comment']);
		return empty($obj->service) ? '' : $obj->service;	
	}
/**
 *
 **/	
	public function drawCalls(){
		$options = new stdClass();
		$options->Client_ID = CRMClient::Get()->Client_ID;
		$_POST['options'] = $options;
		
		$tab = CRMClientCall::GetList($options, $options);
		
		if($tab['length'] == 0){
			return;	
		}
				
		$this->SetFont('Arial','B', 13);
		$this->SetDrawColor(0,0,0);
		$this->Cell(0,5,utf8_decode('Appels'), 'B',0,'L');
		$this->Ln(8);
		
		//En-têtes listing
		$this->SetFont('Arial','B',8);
		$this->FieldGroup = 'Date_Group';
		$this->FieldSumText = 'Nb';
		
		$this->AddHeader(array(
			'Date_Call' => 	array(
									'Title' => 'Date Call', 
									'Width'=>'20',
									'BodyStyle' => 	'text-align:center',
									'HeaderStyle' => 'text-align:center'	
								),
								
			'User' => 			array(
									'Title' => 'Appellant', 
									'Width'=>'30',
									'BodyStyle' => 	'text-align:left',
									'HeaderStyle' => 'text-align:center'
								),
								
			'Contact' => 		array(
									'Title' => 'Contact', 'Width'=>'40',
									'BodyStyle' => 	'text-align:left',
									'HeaderStyle' => 'text-align:center'
								),
								
			'Subject' => 		array(
									'Title' => 'Objet', 
									'Width'=>'45',
									'BodyStyle' => 	'text-align:left',
									'HeaderStyle' => 'text-align:center'
								),
			'Conclusion' => 	array(
									'Title' => 'Conclusion', 
									'Width'=>'40',
									'BodyStyle' => 	'text-align:left',
									'HeaderStyle' => 'text-align:center'
								),
			'Date_Recall' => 	array(
									'Title' => 		'Date Rappel', 
									'Width'=>		'25', 
									'BodyStyle' => 	'text-align:center',
									'HeaderStyle' => 'text-align:center'
								)
		
		
		));
		
		if($tab['length'] == 0){
			$this->Ln(6);
			return $this;
		}
		
		$this->addFilters('fieldGroup', array(__CLASS__, 'FilterCallGroup'));
		$this->addFilters('Date_Call', array(__CLASS__, 'FilterDateCall'));
		$this->addFilters('Date_Recall', array(__CLASS__, 'FilterDateRecall'));
		
		$this->SetFont('Arial','',8);
		$this->addRows($tab);
		$this->Ln(6);	
	}
	
	public static function FilterCallGroup($e, $pdf){
	
		return ObjectTools::DateFormat($e, '%d/%m/%Y');
	}
	
	public static function FilterDateCall($e, $data, $pdf){
		
		return 'à ' . ObjectTools::DateFormat($e, '%Hh%M');
	}
	
	public static function FilterDateRecall($e, $data, $pdf){
		if($e == '0000-00-00 00:00:00'){
			return '';	
		}
		
		if(strpos($e, '00:00:00')){
			return ObjectTools::DateFormat($e, '%d/%m/%Y');
		}
		return ObjectTools::DateFormat($e, '%d/%m/%Y %Hh%M');
	}
/**
 *
 **/	
	public function drawEvents(){
		$options = new stdClass();
		$options->Client_ID = CRMClient::Get()->Client_ID;
		$_POST['options'] = $options;
		
		$tab = AgendaEvent::GetList($options, $options);
		
		if($tab['length'] == 0){
			return;	
		}
				
		$this->SetFont('Arial','B', 13);
		$this->SetDrawColor(0,0,0);
		$this->Cell(0,5,utf8_decode('Evénements'), 'B',0,'L');
		$this->Ln(8);
		
		//En-têtes listing
		$this->SetFont('Arial','B',8);
		$this->FieldGroup = 'Date_Group';
		$this->FieldSumText = 'Nb';
		
		$this->AddHeader(array(
			'Date_Start' => 	array(
									'Title' => 'Date', 
									'Width'=>'30',
									'BodyStyle' => 	'text-align:center',
									'HeaderStyle' => 'text-align:center'
								),
											
			'User' => 			array(
									'Title' => 'Agenda de', 
									'Width'=>'30',
									'BodyStyle' => 	'text-align:left',
									'HeaderStyle' => 'text-align:center'	
								),
								
			'Owner' => 			array(
									'Title' => 'Créateur', 
									'Width'=>'30',
									'BodyStyle' => 	'text-align:left',
									'HeaderStyle' => 'text-align:center'	
								),
			
			'Title' => 			array(
									'Title' => 'Objet', 
									'Width'=>'42',
									'BodyStyle' => 	'text-align:left',
									'HeaderStyle' => 'text-align:center'	
								),
								
			'Location' => 		array(
									'Title' => 	'Lieu', 
									'Width'=>	'42',
									'BodyStyle' => 	'text-align:left',
									'HeaderStyle' => 'text-align:center'
								),
			
			
			'Statut' => 		array(
									'Title' => 'Statut', 
									'Width'=>'24',
									'BodyStyle' => 	'text-align:left',
									'HeaderStyle' => 'text-align:center'	
								),
			'StatutColor' => 		array(
									'Title' => ' ', 
									'Width'=>'2',
									'BodyStyle' => 	'text-align:left',
									'HeaderStyle' => 'text-align:center'	
								)		
		));
		
		if($tab['length'] == 0){
			$this->Ln(6);
			return $this;
		}
		
		$this->addFilters('fieldGroup', array(__CLASS__, 'FilterCallGroup'));
		$this->addFilters('Date_Start', array(__CLASS__, 'FilterDateStart'));
		$this->addFilters('Statut', array(__CLASS__, 'FilterStatut'));
		$this->addFilters('StatutColor', array(__CLASS__, 'FilterStatutColor'));
		//$this->addFilters('Date_Recall', array(__CLASS__, 'FilterDateRecall'));
		
		$this->SetFont('Arial','',8);
		$this->addRows($tab);
		$this->Ln(6);	
	}
/**
 *
 **/	
	public static function FilterDateStart($e, $data, $pdf){
		
		$start = 	ObjectTools::DateFormat($e, '%Y%m%d');
		$end = 		ObjectTools::DateFormat($data['Date_End'], '%Y%m%d');
		
		if($start == $end){
			return ObjectTools::DateFormat($e, '%Hh%M') . ' - ' . ObjectTools::DateFormat($data['Date_End'], '%Hh%M');
		}
		
		return ObjectTools::DateFormat($e, '%Hh%M') . ' - ' . ObjectTools::DateFormat($data['Date_End'], '%d/%m/%Y %Hh%M');	
	}
	
	public static function FilterStatut($e, $data, $pdf){
		$statut = Agenda::Status($e);
		return $statut->text;		
	}
	
	public static function FilterStatutColor($e, $data, $pdf){
		$statut = Agenda::Status($data['Statut']);
		$color = new Color($statut->color);
		
		$pdf->setFillColor($color->getRed(), $color->getGreen(), $color->getBlue());
		
		return '';		
	}
}
?>
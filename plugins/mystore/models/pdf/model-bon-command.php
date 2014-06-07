<?php
/** section: MyStore
 * class MyStoreBillingPDF < pdfSimpleTable
 *
 * Modèle PDF de base.
 **/
class MyStoreBCPDF extends MyStoreCommandPDF{
	
	static function Initialize(){
		$pdf = new self();
		$pdf->Output(MyStoreCommand::GetLink(), 'F');	
	}
/**
 * new MyStoreBCPDF()
 **/
	function __construct(){
		
		$command = 	MyStoreCommand::Get();
				
		parent::__construct('P','mm','A4');
		
		$this->AliasNbPages();
		$this->AddPage();
		$this->SetLeftMargin(5);
		$this->SetRightMargin(5);
		$this->SetAutoPageBreak(true, 15);
		$this->SetDisplayMode('real');
		
		$this->drawSectionTitle('Commande N°' . $command->Command_NB);
				
		$y = $this->GetY();
		$this->drawAddressDelivery();
		
		$this->SetY($y);
		$this->drawAddressBilling();
		
		$this->SetY($y);
		$this->drawInfo();
		$this->Ln(10);
		
		$this->drawSectionTitle('Produits');
		
		$this->drawProducts();
		
	}
	
	public function drawInfo($x = 125){
		
		$command = 	MyStoreCommand::Get();
		$wallet =	new MyWallet\Card((int) $command->Wallet_Card_ID);
		$user =		new User((int) $command->User_ID);
			
		$this->SetX($x);
		$this->SetTextColor(210, 10, 38);
		$this->SetFont('Arial','B', 10);
		//$this->SetFillColor(255, 144, 0);
		
		$this->Cell(50, 6, utf8_decode('Informations'), 0, 0, 'L');
		$this->Ln(7);
		
		$y = $this->GetY();
		
		$this->Ln(2);
		$this->SetX($x + 2);
		
		$this->SetTextColor(0, 0, 0);
		
		$this->SetFont('Arial','B', 9);
		$this->Cell(33, 6, utf8_decode('Commandé par'), 0, 0, 'L');
		$this->SetFont('Arial','', 9);
		$this->Cell(50, 6, utf8_decode(trim($user->Name . ' '.$user->FirstName)),0, 0, 'L');
		$this->Ln(4.5);
		$this->SetX($x + 2);
		
		$this->SetFont('Arial','B', 9);
		$this->Cell(33, 6, utf8_decode('Mode de paiement'), 0, 0, 'L');
		$this->SetFont('Arial','', 9);
		$this->Cell(50, 6, utf8_decode($wallet->Name),0, 0, 'L');
		$this->Ln(4.5);
		$this->SetX($x + 2);
		
		$this->SetFont('Arial','B', 9);
		$this->Cell(33, 6, utf8_decode('Mode de livraison'), 0, 0, 'L');
		$this->SetFont('Arial','', 7);
		$this->Cell(50, 6, utf8_decode($command->Mode_Delivery),0, 0, 'L');
		$this->Ln(4.5);
		$this->SetX($x + 2);
		
		$this->SetFont('Arial','B', 9);
		$this->Cell(33, 6, utf8_decode('Date commande'), 0, 0, 'L');
		$this->SetFont('Arial','', 9);
		$this->Cell(50, 6, utf8_decode(ObjectPrint::DateFormat($command->Date_Payment, '%d/%m/%Y')), 0, 0, 'L');
		$this->Ln(4.5);
		$this->SetX($x + 2);
				
		$this->SetDrawColor(178, 178, 178);
		$this->Rect($x, $y, 80, 27);
		
	}
		
}

MyStoreBCPDF::Initialize();
?>
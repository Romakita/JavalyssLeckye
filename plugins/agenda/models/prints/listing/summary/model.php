<?php
/*
Model Name: Listing des événements
Description:
Author: Lenzotti Romain
Version: 1.0
Meta: Listing, Agenda

Copyright 2010  Javalyss

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

*/
class modelAgendaEventListingPDF extends pdfSimpleTable{
	
	public function __construct(){
		
		parent::__construct('L','mm','A4');
		
		//$this->HeaderType = 	2;
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
		
		$this->AddPage();
		$this->draw();
	}
	
	public static function Initialize(){
		CRMClient::SetPDF(new self());
		
	}
	
	public function AddPage(){
		$this->Title =		'Listing des événements';
				
		parent::AddPage();
	}
	
	public function draw(){
		
		$obj = AgendaEvent::GetOptions();
		$clauses = $obj->clauses;
		$options = $obj->options;
								
		$obj->header =	array(
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
			
			'title' => 			array(
									'Title' => 'Objet', 
									'Width'=>'82',
									'BodyStyle' => 	'text-align:left',
									'HeaderStyle' => 'text-align:center'	
								),
			
			'Contact' => 			array(
									'Title' => 		'Contact', 
									'Width'=>		'37',
									'BodyStyle' => 	'text-align:left',
									'HeaderStyle' => 'text-align:center'	
								),
								
			'Location' => 		array(
									'Title' => 	'Lieu', 
									'Width'=>	'52',
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
		);
		
		System::Fire('agenda:list.print', array(&$obj));
		
		$this->SetFont('Arial','B', 8);
		$this->FieldGroup = 'Date_Group';
		$this->FieldSumText = 'Nb';
		
		$this->AddHeader($obj->header);
		
		$this->addFilters('fieldGroup', array(__CLASS__, 'FilterDateGroup'));
		$this->addFilters('Date_Start', array(__CLASS__, 'FilterDateStart'));
		$this->addFilters('Statut', array(__CLASS__, 'FilterStatut'));
		$this->addFilters('StatutColor', array(__CLASS__, 'FilterStatutColor'));
		$this->addFilters('Contact', array(__CLASS__, 'FilterContact'));
		
		//Listing
		$this->SetFont('Arial','',8);		
		$this->addRows($obj->data);
		
	}
	
	public static function FilterDateGroup($e, $pdf){
		return ObjectTools::DateFormat($e, '%d/%m/%Y');
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
	
	public static function FilterContact($e, $data, $pdf){
		return empty($e) ? '' : $e;
	}
	
	public static function FilterStatutColor($e, $data, $pdf){
		$statut = Agenda::Status($data['Statut']);
		$color = new Color($statut->color);
		
		$pdf->setFillColor($color->getRed(), $color->getGreen(), $color->getBlue());
		
		return '';		
	}
	
}

modelAgendaEventListingPDF::Initialize();
?>
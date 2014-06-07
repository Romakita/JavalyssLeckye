<?php
/*
Model Name: Listing sous forme de tableau
Description:
Author: Lenzotti Romain
Version: 1.0
Meta: Listing, Client

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
class modelCRMClientListingPDF extends pdfSimpleTable{
	
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
		$this->Title =		'Listing des clients';
				
		parent::AddPage();
	}
	
	public function draw(){
		
		$obj = CRMClient::GetOptions();
						
		$obj->header =	array(
			'Company' => 		array('Title' => 'Société', 'Width'=>'35'),
			'Categories' => 	array('Title' => 'Catégorie', 'Width'=>'35'),
			'Activity' => 		array('Title' => 'Activité', 'Width'=>'35'),
			'CP' => 			array('Title' => 'CP', 'Width'=>'12', 'BodyAlign' => 'C'),
			'City' => 			array('Title' => 'Ville', 'Width'=>'30','BodyAlign' => 'C'),
			'Country' => 		array('Title' => 'Pays', 'Width'=>'20', 'BodyAlign' => 'C'),
			'Phone' => 			array('Title' => 'Tel', 'Width'=>'30', 'BodyAlign' => 'C'),
			'Fax' => 			array('Title' => 'Fax', 'Width'=>'30', 'BodyAlign' => 'C'),
			'Call' => 			array(
									'Title' => 'Dernier appel',
									'Width'=>'60', 
									'BodyStyle' => 	'text-align:left',
									'HeaderStyle' => 'text-align:center'
								)
		);
		
		System::Fire('crm.client:list.print', array(&$obj));
		
		$this->SetFont('Arial','B', 8);
		$this->AddHeader($obj->header);
		
		$this->addFilters('Categories', array(__CLASS__, 'FilterCategories'));
		$this->addFilters('Activity', array(__CLASS__, 'FilterActivity'));
		$this->addFilters('Call', array(__CLASS__, 'FilterLastCall'));
		
		//Listing
		$this->SetFont('Arial','',8);		
		$this->addRows($obj->data);
		
	}
	
	public static function FilterCategories($e, $data, $pdf){
		$categories = array();
		$e = json_decode($e);
		
		for($i = 0; $i < count($e); $i++){
			
			$c = $e[$i];
			
			if($c == 'all') continue;
			
			$c = CRMPlugin::GetCategory($c);
			
			if(!empty($c)){
				array_push($categories, $c);	
			}
			
		}
		
		return implode(', ', $categories);	
	}
	public static function FilterActivity($e, $data, $pdf){
		$e = json_decode($data['Comment']);
		return empty($e->activity) ? '' : $e->activity;
	}
	
	public static function FilterLastCall($e, $data, $pdf){
		if($e === false){
			return ' - ' . MUI('Jamais') . ' - ';
		}
		
		$str = '';
			
		if(!empty($e->Date_Call)){
			$str .= MUI('Le') . ' : ' . ObjectTools::DateFormat($e->Date_Call, "%d/%m/%Y %H:%M") . "\n";	
		}
		
		$str = MUI('Conclusion') . ' : ' . $e->Conclusion . "\n";
		
		if(!empty($e->Date_Recall)){
			$str .= MUI('Prochain appel') . ' : ' . ObjectTools::DateFormat($e->Date_Recall, "%d/%m/%Y") . "\n";
		} 	
		return $str;
	}
}

modelCRMClientListingPDF::Initialize();
?>
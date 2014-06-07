<?php
/** section: CRM
 * class CRMStatistics 
 * includes ObjectTools
 *
 * Cette classe gère les informations liées à un contact
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_contact.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/

abstract class CRMStatistics extends CRMPlugin{
	const PRE_OP =				'crm.statistic.';
	
	private static $CATEGORIES = '';
/**
 * CRMStatistics.Initialize() -> void
 **/	
	static public function Initialize(){
		
		System::observe('gateway.exec', array(__CLASS__, 'exec'));
		
	}
/**
 * CRMStatistics.exec(command) -> int
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){			
			case self::PRE_OP . 'user':
				
				echo json_encode(self::GetStatistics($_POST['options']));
							
				break;
			
			case self::PRE_OP . 'export': 
			
				echo json_encode(File::ToURI(self::Export($_POST['options'])));
				
				break;
		}
		
		return 0;	
	}
/**
 * CRMStatistics.GetStatistics(options) -> Array
 **/	
	static function GetStatistics($options){
		
		$array = array();
		$array['length'] = 0;
				
		$date = explode('-', $options->Date);
		$days = 1 * $options->Days;
		
		$array['Total'] = array(
			'Nb_Call' => 	0, 
			'NRP' => 		0, 
			'NRA' => 		0, 
			'CTINF' => 		0, 
			'PROJ' => 		0, 
			'OTH' => 		0, 
			'RDV' => 		0, 
			'Start_AM' => 	0, 
			'End_AM' => 	0, 
			'Start_PM' => 	0, 
			'End_PM' => 	0, 
			'Duree' => 		0,
			'Nb_Opened_Work' => 0,
			'Min_Call' =>		10000,
			'Max_Call' =>		0,
			'Nb_Days_Call_30' => 	0,
			'Nb_Days_Call_30_50' => 0,
			'Nb_Days_Call_50' => 	0
		);
		
		for($i = 0; $i < $days; $i++){
			$obj = new stdClass();
			
			$obj->op = 			'-date';
			
			if(!empty($options->User_ID)){
				$obj->User_ID = 	$options->User_ID;
			}
			
			$obj->Date = 		$date[0] . '-' .$date[1] . '-' . substr('0'. ($i+1), -2);
			
			$obj2 = new stdClass();
			$obj2->Date = 		$obj->Date;
			
			$array['Total']['Nb_Call'] += 	$obj2->Nb_Call = 	CRMClientCall::Count($obj);
			
			if($obj2->Nb_Call != 0){
				$array['Total']['Min_Call'] = 	min($obj2->Nb_Call, $array['Total']['Min_Call']);
				$array['Total']['Max_Call'] = 	max($obj2->Nb_Call, $array['Total']['Max_Call']);
			}
			
			if(1 * $obj2->Nb_Call < 30 && $obj2->Nb_Call > 0){
				$array['Total']['Nb_Days_Call_30']++;
			}
			
			if(30 <= 1 * $obj2->Nb_Call && 1 * $obj2->Nb_Call <= 50){
				$array['Total']['Nb_Days_Call_30_50']++;
			}
			
			if(1 * $obj2->Nb_Call > 50){
				$array['Total']['Nb_Days_Call_50']++;
			}
			
			//
			// Catégorie de conclusion
			//
			$obj->Conclusion =		'NRP';
			
			$array['Total']['NRP'] += 	$obj2->NRP = 		CRMClientCall::Count($obj);
			
			$obj->Conclusion =		'NRA';
			
			$array['Total']['NRA'] += 	$obj2->NRA = 		CRMClientCall::Count($obj);
			
			$obj->Conclusion =		'CTINF';
			
			$array['Total']['CTINF'] += $obj2->CTINF = 		CRMClientCall::Count($obj);
			
			$obj->Conclusion =		'PROJ';
			
			$array['Total']['PROJ'] += 	$obj2->PROJ = 		CRMClientCall::Count($obj);
			
			$obj->Conclusion =		'OTH';
			
			$array['Total']['OTH'] += 	$obj2->OTH = 		CRMClientCall::Count($obj);
			
			unset($obj->Conclusion);
			//
			//
			//
			$array['Total']['RDV'] += 	$obj2->RDV = 		CRMEvent::Count($obj);
			
			//
			// Debut
			//
			$obj->op = 			'-min-am';
			$obj2->Start_AM =	CRMClientCall::MinMax($obj);
			
			if(!empty($obj2->Start_AM)){
				$array['Total']['Start_AM'] = ($array['Total']['Start_AM'] + self::DateToMinutes($obj2->Start_AM)) / 2;
			}
			//
			// Fin
			//					
			$obj->op = 			'-max-am';
			$obj2->End_AM =		CRMClientCall::MinMax($obj);
			
			if(!empty($obj2->Start_AM)){
				$array['Total']['End_AM'] = ($array['Total']['End_AM'] + self::DateToMinutes($obj2->End_AM)) / 2;
			}
			//
			// Debut
			//
			$obj->op = 			'-min-pm';
			$obj2->Start_PM =	CRMClientCall::MinMax($obj);
			
			if(!empty($obj2->Start_PM)){
				$array['Total']['Start_PM'] = ($array['Total']['Start_PM'] + self::DateToMinutes($obj2->Start_PM)) / 2;
			}
			//
			// Fin
			//
			$obj->op = 			'-max-pm';
			$obj2->End_PM =		CRMClientCall::MinMax($obj);
			
			if(!empty($obj2->End_PM)){
				$array['Total']['End_PM'] = ($array['Total']['End_PM'] + self::DateToMinutes($obj2->End_PM)) / 2;
			}
			
			$obj2->Duree = 0;
			
			if(!empty($obj2->Start_AM) && !empty($obj2->End_AM)){
				$obj2->Duree += self::DateToMinutes($obj2->End_AM) - self::DateToMinutes($obj2->Start_AM);
			}
			
			if(!empty($obj2->Start_PM) && !empty($obj2->End_PM)){
				$obj2->Duree += self::DateToMinutes($obj2->End_PM) - self::DateToMinutes($obj2->Start_PM);
			}
			
			$array['Total']['Duree'] += $obj2->Duree;
			
			$obj2->Duree = self::MinutesToStr($obj2->Duree);
			
			//
			// Récupération du nombre d'appel
			//
			
			if($obj2->Nb_Call != 0){
				if(!empty($obj2->Start_PM)){
					$array['Total']['Nb_Opened_Work'] += 0.5; 
				}
				
				if(!empty($obj2->End_AM)){
					$array['Total']['Nb_Opened_Work'] += 0.5;
				}
			}
			
			array_push($array, $obj2);
			$array['length']++;
		}
		
		$array['Total']['Start_AM'] = 	self::MinutesToStr($array['Total']['Start_AM']);
		$array['Total']['End_AM'] = 	self::MinutesToStr($array['Total']['End_AM']);
		$array['Total']['Start_PM'] = 	self::MinutesToStr($array['Total']['Start_PM']);
		$array['Total']['End_PM'] = 	self::MinutesToStr($array['Total']['End_PM']);
		$array['Total']['Duree'] =		self::MinutesToStr($array['Total']['Duree']);
		
		if($array['Total']['Min_Call'] == 10000){
			$array['Total']['Min_Call'] = 0;
		}
		return $array;	
	}
/**
 * CRMStatistics.Export(options) -> String
 **/	
	public static function Export($options = ''){
		set_time_limit(0);
		
		if(empty($options->Format)){
			$options->Format = 'xls';
		}
		
		@Stream::MkDir(System::Path('prints'), 0755);
		
		$options->User = $user = new User((int) $options->User_ID);
		
		$folder = 	System::Path('prints');
		$file = 	System::Path('prints') . 'statistics-' . Stream::Sanitize($user->Name . ' ' . $user->FirstName, '-') . '-' . $options->Date;
		
		//récupérer la liste
		$obj = $options->data = self::GetStatistics($options);
		
		$file = $file . '.' . $options->Format;
		
		self::WriteXLS($file, $options);
		
		return File::ToURI($file);
	}
/**
 * CRMStatistics.WriteXLS(file, options) -> void
 * 
 * Cette méthode écrit le fichier XLS correspondant aux statistiques.
 **/ 	
	public static function WriteXLS($file, $options){
		
		date_default_timezone_set('Europe/Paris');
		
		$fileTitle = 	"Statistique des appels de " . $options->User->Name . ' ' . $options->User->FirstName. ' du ' . ObjectTools::DateFormat($options->Date, '%B %Y');
		$title = 		'Appels de ' .  substr($options->User->FirstName, 0, 1) . substr($options->User->Name, 0,1) . ' du ' . ObjectTools::DateFormat($options->Date, '%B %Y');
		//$titleZ = 		'Appels de ' .  $options->User->Name . ' ' . $options->User->FirstName . ' pour ' . ObjectTools::DateFormat($options->Date, '%B %Y');
		
		$objPHPExcel = new PHPExcel();
		$objPHPExcel->getProperties()->setCreator("CRM - Javalyss")
							 ->setLastModifiedBy("CRM - Javalyss")
							 ->setTitle($fileTitle)
							 ->setSubject($fileTitle)
							 ->setDescription($fileTitle . ' généré par CRM Javalyss')
							 ->setKeywords("office PHPExcel php CRM appel statistique")
							 ->setCategory("statistique appel");
		//creation dela 				 
		$current = $objPHPExcel->setActiveSheetIndex(0);
		//
		// Style des colonnes
		//
		$current->getColumnDimension('A')->setWidth(15);
		$current->getColumnDimension('B')->setWidth(13);
		$current->getColumnDimension('C')->setWidth(10);
		$current->getColumnDimension('D')->setWidth(10);
		$current->getColumnDimension('E')->setWidth(10);
		$current->getColumnDimension('F')->setWidth(10);
		$current->getColumnDimension('G')->setWidth(10);
		
		$current->getColumnDimension('H')->setWidth(10);
		
		$current->getColumnDimension('I')->setWidth(17);
		$current->getColumnDimension('J')->setWidth(17);
		$current->getColumnDimension('K')->setWidth(17);
		$current->getColumnDimension('L')->setWidth(17);
		
		$current->getColumnDimension('M')->setWidth(11);
		
		$current->getRowDimension('3')->setRowHeight(30);
		//
		// Style
		//
		$sharedStyle = new PHPExcel_Style();
		$sharedStyle->applyFromArray(array(
			
			'fill' 	=> array(
				'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
				'color'		=> array('argb' => 'FFFFFFFF')
			),
			
			
				
			'borders' => array(
				'bottom'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_NONE
				),
				
				'right'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_NONE
				),
				
				'left'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_NONE
				),
				
				'top'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_NONE
				)
			)
		));
		
		$current->setSharedStyle($sharedStyle, "A1:N" . ($options->data['length'] + 15));
		
		//
		//
		//
		$current->mergeCells("A1:M1")->setCellValue('A1', $fileTitle)->getStyle('A1')->getFont()->applyFromArray(
			array(
				'name'      => 'Segoe UI Light',
				'size' 		=> '25',
				'bold'      => FALSE,
				'italic'    => FALSE,
				'strike'    => FALSE//,
				/*'color'     => array(
					'rgb' => '808080'
				)*/
			)
		);
		//
		//
		//
		$sharedStyle = self::CreateStyleHeader();
		
		/**/
		
		$current->setSharedStyle($sharedStyle, "A3:M3");
		
		/**/
		
		$sharedStyle = clone $sharedStyle;
		
		$sharedStyle->applyFromArray(array(
			'fill' 	=> array(
				'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
				'color'		=> array('argb' => 'FFDFDFDF')
			)
		));
		
		$current->setSharedStyle($sharedStyle, "A3");
		//
		// Ecriture de l'entete
		//
		$current->setCellValue('A3', MUI('Date'));
		$current->setCellValue('B3', MUI('Nb Appels'));
		$current->setCellValue('C3', MUI('NRP'));
		$current->setCellValue('D3', MUI('NRA'));
		$current->setCellValue('E3', MUI('CTINF'));
		$current->setCellValue('F3', MUI('PROJ'));
		$current->setCellValue('G3', MUI('Autre'));
		$current->setCellValue('H3', MUI('Nb RDV'));
		$current->setCellValue('I3', MUI('1er appel AM'));
		$current->setCellValue('J3', MUI('Dernier appel AM'));
		$current->setCellValue('K3', MUI('1er appel PM'));
		$current->setCellValue('L3', MUI('Dernier appel PM'));
		$current->setCellValue('M3', MUI('Durée'));
		//
		// Boucle
		//
		
		for($i = 0, $startIt = 4; $i < $options->data['length']; $i++){
			$data = 	$options->data[$i];
			$it = 		$i + $startIt;
			$dayOff = 	in_array(ObjectTools::DateFormat($data->Date, '%w'), array(0,6));
			
			$style = 			self::CreateStyleCel();
			$headerBodyStyle = 	self::CreateStyleDateCel();
			
			if($dayOff){
				
				$style->applyFromArray(array(
					'fill' 	=> array(
						'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
						'color'		=> array('argb' => 'FFCFCFCF')
					)
				));
				
				$headerBodyStyle->applyFromArray(array(
					'fill' 	=> array(
						'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
						'color'		=> array('argb' => 'FFCFCFCF')
					)
				));
			
			}
			
			$dateStyle = clone $style;
			$dateStyle->getNumberFormat()->setFormatCode('hh:mm');
			
			$current->setSharedStyle($style, 'B' . $it . ':H' . $it);
			$current->setSharedStyle($dateStyle, 'I' . $it . ':M' . $it);
			$current->setSharedStyle($headerBodyStyle, 'A' . $it);
			
			$current->setCellValue('A' . $it, substr(ObjectTools::DateFormat($data->Date, '%d-%B'), 0,6));
			
			if(!empty($data->Nb_Call)){
				$current->setCellValue('B' . $it, $data->Nb_Call);
			}
			
			if(!empty($data->NRP)){
				$current->setCellValue('C' . $it, $data->NRP)->getStyle();
			}
			
			if(!empty($data->NRA)){
				$current->setCellValue('D' . $it, $data->NRA);
			}
			
			if(!empty($data->CTINF)){
				$current->setCellValue('E' . $it, $data->CTINF);
			}
			
			if(!empty($data->PROJ)){
				$current->setCellValue('F' . $it, $data->PROJ);
			}
			
			if(!empty($data->OTH)){
				$current->setCellValue('G' . $it, $data->OTH);
			}
			
			if(!empty($data->RDV)){
				$current->setCellValue('H' . $it, $data->RDV);
			}
			
			if(!empty($data->Start_AM)){
				
				$current->setCellValue('I' . $it,  self::DatePHPToExcel($data->Start_AM));
				//$current->setSharedStyle($dateStyle, 'I' . $it);
				
			}else{
				if(!$dayOff){
					$current->setSharedStyle(self::CreateStyleGrayCel(), 'I' . $it);
				}
				
			}
			
			if(!empty($data->End_AM)){
				$current->setCellValue('J' . $it, self::DatePHPToExcel($data->End_AM));
				//$current->setSharedStyle($dateStyle, 'J' . $it);
			}else{
				if(!$dayOff){
					$current->setSharedStyle(self::CreateStyleGrayCel(), 'J' . $it);
				}
			}
			
			if(!empty($data->Start_PM)){
				$current->setCellValue('K' . $it, self::DatePHPToExcel($data->Start_PM));
				//$current->setSharedStyle($dateStyle, 'K' . $it);
			}else{
				if(!$dayOff){
					$current->setSharedStyle(self::CreateStyleGrayCel(), 'K' . $it);
				}
			}
			
			if(!empty($data->End_PM)){
				$current->setCellValue('L' . $it, self::DatePHPToExcel($data->End_PM));
				//$current->setSharedStyle($dateStyle, 'L' . $it);
			}else{
				if(!$dayOff){
					$current->setSharedStyle(self::CreateStyleGrayCel(), 'L' . $it);
				}
			}
			
			$current->setCellValue('M' . $it, '=+L' . $it . ' - I' . $it . ' - ( +K' . $it . ' - J' . $it . ')');
			
			$current->getRowDimension($it)->setRowHeight(20);
		}
		
		//
		// Footer
		//
		$it = 		$i + 4;
		$endIt = 	$it-1;
		//$options->data['Total']
		$current->setCellValue('A' . $it, MUI('Total') . ' :')
				->setCellValue($refTotal = 'B'. $it, '=SUM(B4:B' . ($it-1).')')
				->setCellValue('C'. $it, '=SUM(C4:C' . ($it-1).')')
				->setCellValue('D'. $it, '=SUM(D4:D' . ($it-1).')')
				->setCellValue('E'. $it, '=SUM(E4:E' . ($it-1).')')
				->setCellValue('F'. $it, '=SUM(F4:F' . ($it-1).')')
				->setCellValue('G'. $it, '=SUM(G4:G' . ($it-1).')')
				->setCellValue('H'. $it, '=SUM(H4:H' . ($it-1).')');
				
		$current->setCellValue('I'. $it, '=+AVERAGE(I4:I' . ($it-1).')');
		$current->setCellValue('J'. $it, '=+AVERAGE(J4:J' . ($it-1).')');
		$current->setCellValue('K'. $it, '=+AVERAGE(K4:K' . ($it-1).')');
		$current->setCellValue('L'. $it, '=+AVERAGE(L4:L' . ($it-1).')');
		$current->setCellValue('M'. $it, '=SUM(M4:M' . ($it-1).')');
		
		$footerStyle = self::CreateStyleFooter(false);
		$footerDateStyle = self::CreateStyleFooter(false);
		$footerDateStyle->getNumberFormat()->setFormatCode('hh:mm');
		
		$footerDuree = self::CreateStyleFooter(false);
		$footerDuree->getNumberFormat()->setFormatCode('[h]:mm');
		
		$current->setSharedStyle($footerStyle, 'B' . $it . ':H' . $it);
		$current->setSharedStyle($footerDateStyle, 'I' . $it . ':L' . $it);
		$current->setSharedStyle($footerDuree, 'M' . $it);
		$current->setSharedStyle(self::CreateStyleFooter(true), 'A' . $it);
				
		$current->getRowDimension($it)->setRowHeight(20);
		
		//
		// Analyse
		//
		$it+= 2;
		
		$analyseStyle = self::CreateStyleFooter(false);
		$analyseStyle2 = self::CreateStyleFooter(false);
		
		$analyseStyle->applyFromArray(array(
			'alignment' =>array(
				'horizontal' =>	PHPExcel_Style_Alignment::HORIZONTAL_RIGHT,
				'vertical' =>	PHPExcel_Style_Alignment::VERTICAL_CENTER
			),
			
			'font' => array(
				'name'      => 'Segoe UI',
				'size' 		=> '10',
				'bold'      => true
			)
		));
		
		$analyseStyle2->applyFromArray(array(
			'alignment' =>array(
				'horizontal' =>	PHPExcel_Style_Alignment::HORIZONTAL_RIGHT,
				'vertical' =>	PHPExcel_Style_Alignment::VERTICAL_CENTER
			),
			
			'fill' 	=> array(
				'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
				'color'		=> array('argb' => 'FFFFFFFF')
			),
		));
		
		$current->setSharedStyle($analyseStyle, "A$it:C" . ($it+8));
		$current->setSharedStyle($analyseStyle2, "D$it:D" . ($it+8));
		
		$current->mergeCells("A$it:C$it")->setCellValue("A$it", MUI('Nombre appels du mois') . ' :')
			->setCellValue("D$it", "=" . $refTotal)
			->getRowDimension($it)->setRowHeight(20);
		$it++;
		
		$current->mergeCells("A$it:C$it")->setCellValue("A$it", MUI('Jours ouvré (présence salarié)') . ' :')
			->setCellValue($refCallWork = "D$it", "=(COUNTIF(J$startIt:J$endIt, \"<>\") + COUNTIF(K$startIt:K$endIt, \"<>\")) / 2")
			->getRowDimension($it)->setRowHeight(20);
		$it++;
		
		$current->mergeCells("A$it:C$it")->setCellValue("A$it", MUI('Appels moyen par jour ouvré') . ' :')
			->setCellValue("D$it", "=ROUND(" . $refTotal . "/" .  $refCallWork . ', 0)')
			->getRowDimension($it)->setRowHeight(20);
		$it++;
		
		$current->mergeCells("A$it:C$it")->setCellValue("A$it", MUI('- Valeur minimale') . ' :')
			->setCellValue("D$it", "=MIN(B$startIt:B$endIt)")
			->getRowDimension($it)->setRowHeight(20);
		$it++;
		
		$current->mergeCells("A$it:C$it")->setCellValue("A$it", MUI('- Valeur maximale') . ' :')
			->setCellValue("D$it", "=MAX(B$startIt:B$endIt)")
			->getRowDimension($it)->setRowHeight(20);
		$it++;
		
		$current->mergeCells("A$it:C$it")->setCellValue("A$it", MUI('Nombre de jour pour les appels passés') . ' :')
			->getRowDimension($it)->setRowHeight(20);
		$it++;
		
		$current->mergeCells("A$it:C$it")->setCellValue("A$it", MUI('- Etant inférieur à 30') . ' :')
			->setCellValue("D$it", "=COUNTIF(B$startIt:B$endIt, \"<30\") - COUNTIF(B$startIt:B$endIt, \"0\")")
			->getRowDimension($it)->setRowHeight(20);
		$it++;
		
		$current->mergeCells("A$it:C$it")->setCellValue("A$it", MUI('- Entre 30 et 50') . ' :')
			->setCellValue("D$it", "= COUNTIF(B$startIt:B$endIt, \">=30\") - COUNTIF(B$startIt:B$endIt, \">50\")")
			->getRowDimension($it)->setRowHeight(20);
		$it++;
		
		$current->mergeCells("A$it:C$it")->setCellValue("A$it", MUI('- Supérieur à 50') . ' :')
			->setCellValue("D$it", "=COUNTIF(B$startIt:B$endIt, \">50\")")
			->getRowDimension($it)->setRowHeight(20);
		
		//
		// Titre de l'onglet
		//
		
		
		$objPHPExcel->getActiveSheet()->setTitle($title);


		// Set active sheet index to the first sheet, so Excel opens this as the first sheet
		$objPHPExcel->setActiveSheetIndex(0);
		//
		// Ecriture du fichier
		// 
		
		switch($options->Format){
			default:
							
			case 'csv':
				$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'CSV');
				break;
				
			case 'xls':
				$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
				break;
				
			case 'xlsx':
				$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
				break;
		}
		
		$objWriter->save($file);
						
	}
/**
 * CRMStatistics.CreateStyleHeader() -> PHPExcel_Style
 **/
	static function CreateStyleHeader(){
		$sharedStyle = new PHPExcel_Style();
		$sharedStyle->applyFromArray(array(
			'alignment' =>array(
				'horizontal' =>	PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
				'vertical' =>	PHPExcel_Style_Alignment::VERTICAL_CENTER
			),
			
			'font' => array(
				'name'      => 'Segoe UI',
				'size' 		=> '10',
				'bold'      => TRUE,
				'color'     => array(
					'rgb' => '464646'
				)
			),
						
			'borders' => array(
				
				'bottom'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => 'FF999999')
				),
				
				'right'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => 'FF999999')
				),
				
				'left'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => 'FF999999')
				),
				
				'top'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => 'FF999999')
				)
			)
		));	
		
		return $sharedStyle;
	}
/**
 * CRMStatistics.CreateStyleDateCel() -> PHPExcel_Style
 **/	
 	static function CreateStyleDateCel(){
		
		$style = new PHPExcel_Style();
		$style->applyFromArray(array(
			'alignment' =>array(
				'horizontal' =>	PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
				'vertical' =>	PHPExcel_Style_Alignment::VERTICAL_CENTER
			),
			
			'fill' 	=> array(
				'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
				'color'		=> array('argb' => 'FFDFDFDF')
			),
			
			'font' => array(
				'name'      => 'Segoe UI',
				'size' 		=> '10',
				'bold'      => true
			),
						
			'borders' => array(
								
				'right'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => 'FF999999')
				),
				
				'left'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => 'FF999999')
				)
			)
		));	
		
		return $style;
	}
/**
 * CRMStatistics.CreateStyleCel() -> PHPExcel_Style
 **/
	static function CreateStyleCel(){
		
		$style = new PHPExcel_Style();
		$style->applyFromArray(array(
			'alignment' =>array(
				'horizontal' =>	PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
				'vertical' =>	PHPExcel_Style_Alignment::VERTICAL_CENTER
			),
			
			'fill' 	=> array(
				'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
				'color'		=> array('argb' => 'FFFFFFFF')
			),
			
			'font' => array(
				'name'      => 'Segoe UI',
				'size' 		=> '10',
				'bold'      => FALSE
			),
						
			'borders' => array(
								
				'right'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => 'FF999999')
				),
				
				'left'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => 'FF999999')
				)
			)
		));	
		
		return $style;
	}
/**
 * CRMStatistics.CreateStyleGrayCel() -> PHPExcel_Style
 **/
	static function CreateStyleGrayCel(){
		
		$style = new PHPExcel_Style();
		$style->applyFromArray(array(
			'alignment' =>array(
				'horizontal' =>	PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
				'vertical' =>	PHPExcel_Style_Alignment::VERTICAL_CENTER
			),
			
			'fill' 	=> array(
				'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
				'color'		=> array('argb' => 'FFF0F0F0')
			),
			
			'font' => array(
				'name'      => 'Segoe UI',
				'size' 		=> '10',
				'bold'      => FALSE
			),
						
			'borders' => array(
								
				'right'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => 'FF999999')
				),
				
				'left'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => 'FF999999')
				)
			)
		));	
		
		return $style;
	}
/**
 * CRMStatistics.CreateStyleFooter() -> PHPExcel_Style
 **/	
	static function CreateStyleFooter($bold = false){
		$sharedStyle = new PHPExcel_Style();
		$sharedStyle->applyFromArray(array(
			
			'alignment' =>array(
				'horizontal' =>	$bold ? PHPExcel_Style_Alignment::HORIZONTAL_RIGHT : PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
				'vertical' =>	PHPExcel_Style_Alignment::VERTICAL_CENTER
			),
			
			'fill' 	=> array(
				'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
				'color'		=> array('argb' => 'FFCCCCCC')
			),
			
			'font' => array(
				'name'      => 'Segoe UI',
				'size' 		=> '10',
				'bold'      => $bold
			),
						
			'borders' => array(
				
				'bottom'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => 'FF999999')
				),
				
				'right'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => 'FF999999')
				),
				
				'left'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => 'FF999999')
				),
				
				'top'	=> array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => 'FF999999')
				)
			)
		));	
		
		return $sharedStyle;
	}
	
	static function MinutesToStr($minutes){
		
		$hours = 	floor($minutes / 60);
		$minutes = 	floor($minutes - $hours * 60);
		
		return $hours.'h'. substr('0'.$minutes, -2);
		
	}
	
	static function DateToMinutes($date){
		$date = 	explode(' ', $date);
		$hours = 	explode(':', $date[1]);
		
		
		return $hours[0] * 60 + $hours[1];
	}
	
	static function Sanitize($date){
		return substr($date, 0, 17) . '00';	
	}
/**
 *
 **/	
	static function DatePHPToExcel($date){
		return PHPExcel_Shared_Date::PHPToExcel(new DateTime(self::Sanitize($date)));
	}
}

CRMStatistics::Initialize();
?>
<?php
/** section: BlogPress
 * class WidgetTable
 * includes Attributs
 *
 **/
class WidgetTable extends Attributs{
	private $Header = 	array();
	private $Array = 	array();
	public $Title =		'';
	public $Icon =		'';
	function __construct($title = '', $icon = ''){
		$this->Title = 	$title;
		$this->Icon =	$icon;
		$this->pushAttr('class', 'box-widget widget-table');
	}
/**
 * WidgetTable.addRows(array) -> void
 * - array (Array): Tableau de données.
 * 
 * Cette méthode enregistre un tableau de données afin d'être affiché par l'instance [[SimpleTable]] à l'écran.
 *
 * #### Exemple
 *
 * Cette exemple affiche un tableau à deux lignes avec un numéro d'identifiant `Event_ID`, un titre `Titre` et un sous-titre `Conferencier` :
 *
 *     $st = new SimpleTable('page_event.php');
 *     $st.addHeader(array('Event_ID', 'Titre', 'Conferencier'));
 *     $st.addRows(array(
 *         array('Event_ID' => 1, 'Titre' => 'Projet SOS 21',   'Conferencier' => 'avec : Mr PLANCHON Frédéric '),
 *         array('Event_ID' => 2, 'Titre' => 'Mon Titre 2',   'Conferencier' => 'Avec Blabla'),
 *     );
 *
 **/
	public function addRows($table){
		$this->Array = $table;
	}
/**
 * WidgetTable.addHeader(header) -> String
 * - header (Array): Tableau d'entete.
 *
 * Cette méthode ajoute une entête permettant le traitement des données via [[SimpleTable.addRows]].
 *
 **/
	public function addHeader($header){
		$this->Header = $header;
	}
	
	final function __toString(){
		
		$string = 	'
		<div '.$this->serializeAttributs().'>
			<div class="header icon-'.$this->Icon.'">'.$this->Title.'</div>
			<div>
			<table class="simple-table simple-table-chrome">';
		$theader = 	'';
		
		foreach($this->Header as $key => $value){
			$th = new ElementNode();
			$th->Name = 'th';
			$th->addChild('<div class="st-div-h">'.$value['title'].'</div>');
			
			foreach($value as $key_ => $value_){
				if($key_ == 'title') continue;
				$th->pushAttr($key_, $value_);
			}
						
			$theader .= $th;
		}
		
		$string .= '<thead><tr>'.$theader.'</tr></thead>';
		
		$tbody = 	'';
		$i = 		0;
		
		foreach($this->Array as $row){
			$tbody .= '<tr class="altern-'. ($i % 2).'">';
			
			foreach($this->Header as $key => $value){
				$tbody .= '<td><p>' . $row[$key] . '</p></td>';
			}
			
			$tbody .= '</tr>';
			$i++;
		}
		
		$string .= '<tbody>'.$tbody.'</tbody>';
		
		$string .= '</table>
			</div>
		</div>';
		return $string;
	}
}
?>
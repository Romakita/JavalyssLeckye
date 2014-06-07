<?php
/** section: Window Builder
 * class GlobalCss
 * Cette classe gère l'analyse du modèle XML à employer pour la création du template de Window.
 **/
class GlobalCss extends CssNode{
	public $header;
	public $import =	'';
	public $fragment = 	'';
	public $body;
	public $button;
	public $table;
	public $row;
	public $form;
	public $window;
	public $taskbar;
	public $minwin;
	public $calendar;
	public $boxShadow = '0px 0px 8px #000';
	public $progress;
/**
 * new GlobalCss()
 **/
	public function __construct(){
		parent::__construct(false);
		//
		// Global 
		//
		/*$this->border->radius =		'5px';
		$this->border->width =		'1px';
		$this->border->style =  	'solid';
		$this->border->color =		'#444';
		$this->font->color =		"#000";
		$this->background->color = 	'#5c6269';
		$this->font->size =			'12px';
		$this->font->family =		'Arial, Helvetica, sans-serif';*/
		//
		// Header
		//
		$this->header =			new CssNode(false);
		$this->footer =			new CssNode(false);
		
		$this->UpdateHeader();
		
		/*$this->header->color =					'white';
		$this->header->background->repeat =		'repeat-x';
		$this->header->border->color =			'#808080';*/
		//
		// Body
		//
		$this->body =						new CssNode(false);
		
		$this->UpdateBody();
		
		//$this->body->background->color = 	'#f0f0f0';

		//
		// Button
		//
		$this->button = 		new Button();
		
		$this->UpdateButton();
		//
		// Table
		//
		$this->table = 	new Table();
		
		$this->table->header->over->color =						'white';
		$this->table->header->over->background->color = 		'#999';
		$this->table->border->color =							"#808080";
		
		$this->UpdateTable();
		
		$this->table->border->collapse = 						'collapse !important';
		
		$this->table->background->color = 						"#EBEAEF";
		$this->table->header->normal->color =					'#222';
		$this->table->header->normal->background->color = 		'#C3C3C3';
		$this->table->header->normal->background->repeat =		'repeat-x';
		$this->table->header->normal->background->position = 	'left top';
				
		//
		// Row
		//
		$this->row =	new Row();
		
		$this->UpdateRow();
		
		$this->row->odd->color =						"#222";
		$this->row->odd->background->color =			"#EBEAEF";
		$this->row->even->color =						"#111";
		$this->row->even->background->color =			"#D4D4D4";
		$this->row->normal->color =						"#111";
		$this->row->normal->border->color =				"transparent";
		$this->row->normal->background->color =			'transparent';
		$this->row->selected->border->style = 			'dotted';
		$this->row->outline->left->color = 				'#fff';
		$this->row->outline->right->color = 			'#e2e3e3';
		$this->row->margin->bottom =					'2px';
		$this->row->margin->top =						'2px';/**/
		
		//
		//Form
		//
		$this->form =	new Form();
		
		$this->UpdateForm();
		
		$this->form->input->normal->border->color = 		'#999';
		$this->form->input->height = 						'18px';
		$this->form->input->focus->border->color = 			'#A33';
		
		$this->form->field->background->color = 			"#E1DFDF";
		$this->form->field->height =						"18px";
		$this->form->field->padding =						'3px';
		$this->form->field->color =							'#000';/*$*/
		//
		// Window
		//
		$this->window =	new Window();
		
		$this->UpdateWindow();
		
		$this->window->padding = 				'5px';
		$this->window->header->height = 		'24px';
		$this->window->header->icon->background->image =	"window/images/view_choose.png";
		$this->window->header->button->background->image = 	"window/images/win-btn-all.png";
		
		$this->window->menu->color = 			"white";
		$this->window->menu->height = 			"24px";
		$this->window->menu->background->color = "#808080";
		$this->window->menu->rubbon->height =	'70px';

		$this->window->footer->mode =			'true';
		$this->window->footer->pointer->image = "window/images/win-pointer.png";
		$this->window->footer->margin->bottom = "3px";
		$this->window->footer->margin->top =	"3px";/**/
		
		//
		// TaskBar
		//
		$this->taskbar = new TaskBar();
		
		$this->UpdateTaskBar();
		
		$this->taskbar->height =					'41px';
		
		$this->taskbar->background->image = 		'window/images/taskbar-font.png';
		$this->taskbar->background->repeat = 		'repeat-x';
		$this->taskbar->background->position =		'bottom';
		
		$this->taskbar->menu->background->image = 	'window/images/win-task-menu-icon.png';
		$this->taskbar->menu->background->position = 'left center';
		$this->taskbar->menu->background->repeat = 	'no-repeat';
		$this->taskbar->menu->width =				'160px';
		
		
		$this->taskbar->clock->width =				"109px";
		$this->taskbar->clock->background->image =	"window/images/win-task-calendar-font.png";
		$this->taskbar->clock->position =			"left center";
		$this->taskbar->clock->repeat =				"no-repeat";
		$this->taskbar->clock->color =				"white";/**/
		//
		// MinWin
		//
		$this->minwin = new MinWin();
		
		$this->UpdateMinWin();
		
		$this->minwin->width =							'49px';		
		$this->minwin->normal->color = 					'white';
		$this->minwin->margin->top = 					'0px';
		$this->minwin->margin->left = 					'1px';
		$this->minwin->margin->right = 					'1px';
		
		$this->minwin->normal->background->image = 		'window/images/min-win-font.png';
		$this->minwin->normal->background->repeat =		'repeat-x';
		$this->minwin->normal->background->position =	'top';
		
		$this->minwin->over->background->image = 		'window/images/min-win-font-hover.png';
		$this->minwin->over->background->repeat =		'repeat-x';
		$this->minwin->over->background->position =		'top';/**/
		
		//
		// Calendar
		//
		$this->calendar = new Calendar();
		
		$this->UpdateCalendar();
		
		$this->calendar->body->background->color = 			'#FFF';
		$this->calendar->body->color = 						'#222';		
		$this->calendar->day->off->color =					'#999';
		$this->calendar->day->selected->color =				'#FFF';
		$this->calendar->day->selected->background->color = '#09F';
		$this->calendar->day->over->color =					'#FFF';
		$this->calendar->day->over->background->color =		'#333';
		$this->calendar->inter->background->color =			'#BBB';
		$this->calendar->inter->color =						'#222';
		$this->calendar->today->background->color =			'#06F';
		$this->calendar->today->color =						'#FFF';
		$this->calendar->week->background->color =			'#DDD';
		$this->calendar->week->color =						'#222';
		$this->calendar->weekend->background->color =		'#CCC';
		$this->calendar->weekend->color =					'#222';
		//
		//Progress
		//
		$this->progress = new CssNode(false);
		$this->progress->flex = new CssNode(false);
		
		$this->UpdateProgress();
		
		if(defined(ABS_PATH)){
			if(file_exists(ABS_PATH.'themes/system/style.xml')){
				self::ParseXML(ABS_PATH.'themes/system/style.xml');
			}else{
				self::ParseXML(ABS_PATH.'themes/default/style.xml');
			}
		}
	}
/**
 * GlobalCss.UpdateHeader() -> void	
 **/
	final function UpdateHeader(){
		$this->header->font->Copy($this->font);
		//$this->header->background->color =	$this->background->color;	
		$this->header->border->width =		$this->border->width;
		$this->header->border->style =		$this->border->style;
	}
/**
 * GlobalCss.UpdateBody() -> void	
 **/
	final function UpdateBody(){
		$this->body->color =				$this->font->color;
		$this->body->font->Copy($this->font);
		$this->body->border->width =		$this->border->width;
		$this->body->border->style =		$this->border->style ;
		$this->body->border->color =		$this->body->background->color;
	}
/**
 * GlobalCss.UpdateButton() -> void
 **/
	final function UpdateButton(){
		
		$this->button->font->size =						$this->font->size;
		$this->button->font->family =					$this->font->family;
		
		$this->button->normal->border->width =			$this->border->width;
		$this->button->normal->border->style =			$this->border->style;
		$this->button->normal->border->color = 			$this->border->color;
		
	}
/**
 * GlobalCss.UpdateTable() -> void	
 **/
	final function UpdateTable(){
		
		$this->table->border->style =		$this->border->style;
		$this->table->border->width =		$this->border->width;
		
		$this->table->header->normal->border->Copy($this->table->border);
		$this->table->body->header->border->Copy($this->table->border);
		$this->table->body->row->border->Copy($this->table->border);
		
		$this->table->body->header->background->color = 	$this->table->header->over->background->color;
		$this->table->body->header->color = 				$this->table->header->over->color;
	}
/**
 * GlobalCss.UpdateRow() -> void	
 **/
	final function UpdateRow(){
		
		$this->row->over->border->Copy($this->button->over->border);
		$this->row->over->background->Copy($this->button->over->background);
		
		$this->row->selected->border->Copy($this->button->selected->border);
		$this->row->selected->background->Copy($this->button->selected->background);
		
		$this->row->odd->border->width =				$this->border->width;
		$this->row->odd->border->style =				$this->border->style;
		$this->row->odd->border->color =				$this->table->border->color;
		
		$this->row->over->color = 						empty($this->button->over->color) ? $this->button->color : $this->button->over->color;		
		$this->row->selected->color = 					empty($this->button->over->color) ? $this->button->color : $this->button->over->color;
		
		$this->row->even->border->width =				$this->border->width;
		$this->row->even->border->style =				$this->border->style;
		$this->row->even->border->color =				$this->table->border->color;
		
		$this->row->normal->border->width =				$this->border->width;
		$this->row->normal->border->style =				$this->border->style;
		
		$this->row->outline->left->width = 				$this->border->width;
		$this->row->outline->left->style = 				$this->border->style;
		$this->row->outline->right->width = 			$this->border->width;
		$this->row->outline->right->style = 			$this->border->style;
		
	}
/**
 * GlobalCss.UpdateForm() -> void	
 **/
	final function UpdateForm(){
		$this->form->input->font->Copy($this->font);
		$this->form->field->font->Copy($this->font);
		
		$this->form->input->normal->border->width = 		$this->border->width;
		$this->form->input->normal->border->style = 		$this->border->style;
		$this->form->input->focus->border->width =			$this->border->width;
		$this->form->input->focus->border->style = 			$this->border->style;	
	}
/**
 * GlobalCss.UpdateWindow() -> void	
 **/
	final function UpdateWindow(){
		$this->window->font->Copy($this->font);
		$this->window->background->Copy($this->background);
		$this->window->border->Copy($this->border);
		$this->window->boxShadow = $this->boxShadow;
		$this->window->header->background->Copy($this->header->background);
		$this->window->header->font->Copy($this->header->font);
		$this->window->header->color = $this->header->color;
		$this->window->menu->border->Copy($this->border);
		$this->window->menu->font->Copy($this->font);
		//$this->window->menu->rubbon->background->Copy($this->button->normal->background);
		$this->window->body->background->Copy($this->body->background);
		$this->window->body->font->Copy($this->body->font);
		$this->window->body->border->Copy($this->border);
		$this->window->footer->background->Copy($this->body->background);
		$this->window->footer->font->Copy($this->body->font);
		$this->window->footer->border->Copy($this->border);	
		$this->window->footer->border->radius = '0px';
		$this->window->body->border->radius = 	'0px';
	}
/**
 * GlobalCss.UpdateTaskBar() -> void	
 **/
	final function UpdateTaskBar(){
		$this->taskbar->border->Copy($this->header->border);
		$this->taskbar->clock->font->copy($this->header->font);
		$this->taskbar->menu->height =	$this->taskbar->height;	
	}
/**
 * GlobalCss.UpdateMinWin() -> void	
 **/
	final function UpdateMinWin(){
		$this->minwin->height =	(CssNode::Value($this->taskbar->height) - 1).'px' ;	
		$this->minwin->over->height = $this->minwin->height;
	}
/**
 * GlobalCss.UpdateCalendar() -> void	
 **/
	final function UpdateCalendar(){
		
		$this->calendar->font->Copy($this->font);
		$this->calendar->header->background->Copy($this->header->background);
		$this->calendar->header->color =	$this->header->color;	
	
	}
/**
 * GlobalCss.UpdateProgress() -> void
 **/
	final function UpdateProgress(){
		
		$this->progress->background->Copy($this->body->background);
		$this->progress->border->Copy($this->button->normal->border);
		$this->progress->flex->background->Copy($this->button->over->background);	
	
	}
/**
 * GlobalCss.ParseXML() -> void
 **/
	final function ParseXML($file){
		if(file_exists($file)){
			$handle = 	file_get_contents($file);	
			
			$xml = 		new SimpleXMLElement($handle);	
			
			$array = $this->xmlToArray($xml);
			
			//var_dump($array['global']);
			//extension de premier niveau - valeur global
			$this->Extend($this, $array['global']);
			
			$this->window->footer->mode = $this->window->footer->mode == 'false' ? false : true;
		}else{
			$xml = 		new SimpleXMLElement($file);	
			
			$array = $this->xmlToArray($xml);
			
			//var_dump($array['global']);
			//extension de premier niveau - valeur global
			$this->Extend($this, $array['global']);
			
			$this->window->footer->mode = $this->window->footer->mode == 'false' ? false : true;
		}
	}
/**
 * GlobalCss.xmlToArray() -> void
 **/
	public static function xmlToArray($simpleXmlElementObject, &$recursionDepth=0) {
			
		if(!defined("DEBUG")){
			define("DEBUG", false);
		}
		
		if(!defined("MAX_RECURSION_DEPTH_ALLOWED")){
			// Maximum Recursion Depth that we can allow.
			define("MAX_RECURSION_DEPTH_ALLOWED", 25);
		}
		if(!defined("SIMPLE_XML_ELEMENT_OBJECT_PROPERTY_FOR_ATTRIBUTES")){
			// SimpleXMLElement object property name for attributes
			define("SIMPLE_XML_ELEMENT_OBJECT_PROPERTY_FOR_ATTRIBUTES", "@attributes");
		}
		
		if(!defined("SIMPLE_XML_ELEMENT_PHP_CLASS")){
			// SimpleXMLElement object name.
			define ("SIMPLE_XML_ELEMENT_PHP_CLASS", "SimpleXMLElement");
		}
		
		if ($recursionDepth > MAX_RECURSION_DEPTH_ALLOWED) {
			// Fatal error. Exit now.
			return NULL;
		}


		if($recursionDepth == 0) {
			
			if (!$simpleXmlElementObject instanceof SimpleXMLElement) {
				return NULL; 
			} else {
				$callerProvidedSimpleXmlElementObject = $simpleXmlElementObject;
			}
		}


		if ($simpleXmlElementObject instanceof SimpleXMLElement) {
			// Get a copy of the simpleXmlElementObject
			$copyOfsimpleXmlElementObject = $simpleXmlElementObject;
			// Get the object variables in the SimpleXmlElement object for us to iterate.
			$simpleXmlElementObject = get_object_vars($simpleXmlElementObject);
		}

		// It needs to be an array of object variables.
		if (is_array($simpleXmlElementObject)) {
			// Initialize the result array.
			$resultArray = array();
			
			// Is the input array size 0? Then, we reached the rare CDATA text if any.
			if (count($simpleXmlElementObject) <= 0) {
				// Let us return the lonely CDATA. It could even be
				// an empty element or just filled with whitespaces.
				return (trim(strval($copyOfsimpleXmlElementObject)));
			}
			
			
			// Let us walk through the child elements now.
			foreach($simpleXmlElementObject as $key=>$value) {
				$recursionDepth++; 
				$resultArray[$key] = 
				self::xmlToArray($value, $recursionDepth);
				$recursionDepth--;
			}
			
			
			if ($recursionDepth == 0) {
				// That is it. We are heading to the exit now.
				// Set the XML root element name as the root [top-level] key of
				// the associative array that we are going to return to the caller of this
				// recursive function.
				$tempArray = $resultArray;
				$resultArray = array();
				$resultArray[$callerProvidedSimpleXmlElementObject->getName()] = $tempArray;
			}
			return ($resultArray);
		}
		// We are now looking at either the XML attribute text or
		// the text between the XML tags.
		return (trim(strval($simpleXmlElementObject)));

	}
/**
 * GlobalCss.Extend() -> void
 *
 **/
 	final function Extend($dest, $src){
		
		foreach($src as $key => $value){
			
			if($value == '') continue;
			if($key == '@attributes') continue;
			if($key == 'comment') continue;
			
			if(method_exists($this->$key, 'Copy')){			
			
				switch($key){
					//case 'row':
						//var_dump($value);
						//break;
					default:
					//if($key == 'row') var_dump($value);
						@$this->$key->Copy($value);
					//if($key == 'row') var_dump($this->$key);	
						break;
					case 'header':
						$this->$key->Copy($value);
						
						$this->UpdateHeader();
						$this->UpdateBody();
						$this->UpdateButton();
						$this->UpdateCalendar();
						$this->UpdateMinWin();
						$this->UpdateForm();
						break;
						
					case 'table':
						$this->UpdateTable();
						
						@$this->$key->Copy($value);
						
						$this->UpdateRow();
						$this->UpdateProgress();
						$this->UpdateWindow();
						$this->UpdateTaskBar();
						break;
				}
				
			}else{
				$this->$key = @$value;
			}
			
		}	
	}
}
?>
<?php
if(!class_exists('JavalyssIconPack')):
/** section: Core
 * class JavalyssIconPack
 *
 * Cette classe gère le rendu du fichier CSS des icônes.
 **/
class JavalyssIconPack{
	
	const PATH = 'http://javalyss.fr/public/javalyss_icons_pack.zip';
/**
 * JavalyssIconPack.Rename -> Array
 **/
	static $Rename = array (
		'1day' => 				'day', 
		'1downarrow' => 		'down', 
		'1leftarrow' => 		'prev', 
		'1rightarrow' => 		'next', 
		'1uparrow' => 			'up', 
		'2leftarrow' =>	 		'prevtwo', 
		'2rightarrow' =>	 	'nexttwo', 
		'7days' => 				'week',
		'apply' => 				'valid', 
		'blockdevice' => 		'plugin', 
		'browser-alt' => 		array ( 0 => 'browser', 1 => 'browser-alt', 2 => 'globe'), 
		'documentinfo' => 		array ( 0 => 'documentinfo', 1 => 'info'), 
		'edit-add' => 			'add', 
		'energy-2' => 			array ( 0 => 'energy-2', 1 => 'laptop-battery'), 
		'family' => 			'people', 
		'file-manager' => 		array ( 0 => 'file-manager', 1 => 'file-manager-2'),
		'file-revert' => 		array ( 0 => 'revert', 1 => 'file-revert'), 
		'file-saveall' => 		array ( 0 => 'file-saveall', 1 => 'save-all', 2 => 'file-save-all'),
		'file-search' => 		array ( 0 => 'file-search', 1 => 'file-find'),
		'filenew' => 			array ( 0 => 'file', 1 => 'filenew', 2 => 'empty', 3 => 'unknown'),
		'fileopen' => 			'open',
		'folder' => 			array ( 0 => 'folder', 1 => 'folder-blue'),
		'group-edit' => 		array ( 0 => 'group-edit', 1 => 'group'),
		'knotes' => 			array ( 0 => 'notes', 1 => 'knotes'), 
		'mail-info' => 			array ( 0 => 'mail-info', 1 => 'messagebox-info'), 
		'package-multimedia' => array ( 0 => 'package-multimedia', 1 => 'multimedia', 2 => 'multimedia-3'), 
		'paint' => 				array ( 0 => 'paint', 1 => 'kpaint'), 
		'pps' => 				array ( 0 => 'pps', 1 => 'ppt', 2 => 'ppsx', 3 => 'pptx', 4 => 'powerpoint'), 
		'print-quick' => 		array ( 0 => 'filequickprint', 1 => 'print-quick'), 
		'print' => 				array ( 0 => 'fileprint', 1 => 'print'), 
		'tar' => 				array ( 0 => 'tar', 1 => 'tgz'), 
		'text' => 				array ( 0 => 'text', 1 => 'txt'), 
		'thumbnail' => 			array ( 0 => 'thumbnail', 1 => 'picture', 2 => 'photo'), 
		'vsd' => 				array ( 0 => 'visio', 1 => 'vsd'), 
		'word' => 				array ( 0 => 'word', 1 => 'doc', 2 => 'docx'), 
		'write' => 				array ( 0 => 'write', 1 => 'write-2'), 
		'xls' => 				array ( 0 => 'xls', 1 => 'excel', 2 => 'xlsx')
	
	);
/**
 * JavalyssIconPack#Type -> String
 **/	
	public $Type 	=	'';	
/**
 * JavalyssIconPack#Name -> String
 **/
	public $Name = 		'';
/**
 * JavalyssIconPack#Link -> String
 **/
	public $link =		'';
	
	public $link16 =	'';
	public $link24 =	'';
	public $link32 =	'';
	public $link48 =	'';
	
	public static $Output =	'css';
/**
 * new JavalyssIconPack()
 **/	
	function __construct($file, $type){
		$this->link = 	$file;
		$this->Type = 	$type;
		$base = 		basename($this->link);
		$this->Name = 	str_replace(array('.png', '.gif', '.jpg'), '', $base);
		
		if($this->Type == '16'){
			$this->link16 = 		'16/'.$base;
			$this->link24 = 		file_exists(System::Path('icons').'24/'.$base) ? '24/'.$base : $this->link16;
			$this->link32 = 		file_exists(System::Path('icons').'32/'.$base) ? '32/'.$base : $this->link24;
			$this->link48 = 		file_exists(System::Path('icons').'48/'.$base) ? '48/'.$base : $this->link32;
		}	
	}
/**
 * JavalyssIconPack.exec() -> void
 **/	
	final static function exec($op){
		
		switch($op){
			default:
			case 'css':
				self::DrawCSS();
				break;
				
			case 'html':	
				self::DrawHTML();
				break;
			case 'html.flag':	
				self::DrawHTMLFlag();
				break;
		}
		
	}
	
	final static function DrawCSS(){
		self::$Output = 'css';
		
		ob_start("ob_gzhandler");
		@header('content-type: text/css');

		$list = 	Stream::FileList(System::Path('icons'));
		
		foreach($list as $folder){
			if(in_array($folder->name, array('24', '32','48'))) continue;
			if($folder->extension) continue;
			
			$sub = Stream::FileList($folder->link.'/', NULL, NULL, array('png', 'gif', 'jpg'));
			
			foreach($sub as $file){
				$current = new self($file->link, $folder->name);
				echo $current;
			}
		}
		
		ob_end_flush();
	}
	
	final static function DrawHTML(){
		self::$Output = 'html';
		
		ob_start("ob_gzhandler");
		//@header('content-type: text/css');
		?>
        <html>
        <head>
        	<title>Javalyss Icon Pack</title>
           	<style>
				table{
					 border-spacing: 10px;
				}
				th{
					color:#333;	
				}
				td.pic{
					background-color: #DFDFDF;
					border-radius: 	3px 3px 3px 3px;
					box-shadow:		0 1px 5px rgba(0, 0, 0, 0.1);	
					height:			60px;
					width:			60px;
					text-align:		center;
				}
				
			</style>
        </head>
        <body>
         
        <table>
        <thead>
            <tr>
            <th width=200 rowspan="2">Nom</th>
            <th colspan="4">Taille</th>
            </tr>
            <tr>
            <th>16x16</th>
            <th>24x24</th>
            <th>32x32</th>
            <th>48x48</th>
            </tr>
        </thead>  
        <?php

		$list = 	Stream::FileList(System::Path('icons'));
		
		foreach($list as $folder){
			if(in_array($folder->name, array('14', '24', '32','48', 'flag', 'panel'))) continue;
			if($folder->extension) continue;
			
			$sub = Stream::FileList($folder->link.'/', NULL, NULL, array('png', 'gif', 'jpg'));
			
			foreach($sub as $file){
				$current = new self($file->link, $folder->name);
				echo $current;
			}
		}
		?>
        
        </body>
        </html>
        
		<?php
		
	
		ob_end_flush();
	}
	
	final static function DrawHTMLFlag(){
		self::$Output = 'html';
		
		ob_start("ob_gzhandler");
		//@header('content-type: text/css');
		?>
        <html>
        <head>
        	<title>Javalyss Icon Pack</title>
           	<style>
				table{
					 border-spacing: 10px;
				}
				th{
					color:#333;	
				}
				td.pic{
					background-color: #DFDFDF;
					border-radius: 	3px 3px 3px 3px;
					box-shadow:		0 1px 5px rgba(0, 0, 0, 0.1);	
					height:			50px;
					width:			50px;
					text-align:		center;
				}
				
			</style>
        </head>
        <body>
         
        <table>
        <thead>
            <tr>
            <th>Code</th>
            <th>CSS</th>
            <th colspan="4">Drapeau</th>
            </tr>
        </thead>
        
        <?php

		$list = 	Stream::FileList(System::Path('icons'));
		
		foreach($list as $folder){
			if(!in_array($folder->name, array('flag'))) continue;
			if($folder->extension) continue;
			
			$sub = Stream::FileList($folder->link.'/', NULL, NULL, array('png', 'gif', 'jpg'));
			
			foreach($sub as $file){
				$current = new self($file->link, $folder->name);
				echo $current;
			}
		}
		?>
        
        </body>
        </html>
        
		<?php
		
	
		ob_end_flush();
	}
	
	public function __toString(){
		switch(self::$Output){
			default:
			case 'css':
				return $this->toCSS();
			
			case 'html':
				return $this->toHTML();
				
			case 'html.flag':
				return $this->toHTML();
		}
	}
	
	public function toCSS(){
		$string = '';
		
		switch($this->Type){
			case '14':
				$string = 	".icon-".$this->Name."-14{background-image:url(\"".File::ToURI($this->link)."\");background-repeat:no-repeat;}";
				break;
			case '16':
				
				$str =	'.icon-'.$this->Name.'#size';	
								
				if(!empty(self::$Rename[$this->Name])){
					
					
					if(is_array(self::$Rename[$this->Name])){
						$str = '';	
												
						for($i = 0, $len = count(self::$Rename[$this->Name]); $i < $len; $i++){
							$str .= ".icon-".self::$Rename[$this->Name][$i]."#size";
							
							if($i < $len-1){
								$str .= ',';
							}
						}
						
					}else{
						$str = '.icon-'.$this->Name.'#size,.icon-'.self::$Rename[$this->Name].'#size';
					}
				}
				
				$string = 	str_replace('#size', '', $str)."{background-image:url(\"".System::Path('icons', false).$this->link16."\");background-repeat:no-repeat;}";
				$string .= 	str_replace('#size', '-24', $str)."{background-image:url(\"".System::Path('icons', false).$this->link24."\");background-repeat:no-repeat;}";
				$string .= 	str_replace('#size', '-32', $str)."{background-image:url(\"".System::Path('icons', false).$this->link32."\");background-repeat:no-repeat;}";
				$string .= 	str_replace('#size', '-48', $str)."{background-image:url(\"".System::Path('icons', false).$this->link48."\");background-repeat:no-repeat;}";
				
				break;
			case 'flag':
				$string = 	".icon-".$this->Name."-flag{background-image:url(\"".File::ToURI($this->link)."\");background-repeat:no-repeat;}";
				break;
			case 'panel':
				$string = 	"." . $this->Name . "-panel, .panel-" . str_replace('my-', '', $this->Name) . "{background-image:url(\"" . File::ToURI($this->link) ."\");background-repeat:no-repeat;background-position:right bottom;}";
				break;
				
		}
		
		return $string;
	}
	
	public function toHTML(){
		$string = '';
		
		switch($this->Type){
			case '16':
				
				$str =	'.icon-'.$this->Name;	
								
				if(!empty(self::$Rename[$this->Name])){
					
					
					if(is_array(self::$Rename[$this->Name])){
						$str = '';	
												
						for($i = 0, $len = count(self::$Rename[$this->Name]); $i < $len; $i++){
							$str .= ".icon-".self::$Rename[$this->Name][$i];
							
							if($i < $len-1){
								$str .= ',';
							}
						}
						
					}else{
						$str = '.icon-'.$this->Name.', .icon-'.self::$Rename[$this->Name];
					}
				}
				
				
				$string = '
				<tr>
				<td>
					'.$str.'
				</td>
				
				<td class="pic">
				<img src="'.System::Path('icons', false).$this->link16.'" title="'.$this->Name.'" />
				</td>
				<td class="pic">
				<img src="'.System::Path('icons', false).$this->link24.'" title="'.$this->Name.'" />
				</td>
				
				<td class="pic">
				<img src="'.System::Path('icons', false).$this->link32.'" title="'.$this->Name.'" />
				</td>
				
				<td class="pic">
				<img src="'.System::Path('icons', false).$this->link48.'" title="'.$this->Name.'" />
				</td>
				
				</tr>
				';
				
				
				break;
				
			case 'flag':
				$string = '
				<tr>
				<td>'.$this->Name.'</td>
				<td>.icon-'.$this->Name.'-flag</td>
				<td class="pic"><img src="'.File::ToURI($this->link).'" title="'.$this->Name.'" /></td>
				</tr>';
				
				break;
				
		}
		
		return $string;
	}
};
endif;
?>
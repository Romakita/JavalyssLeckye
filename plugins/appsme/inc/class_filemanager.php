<?php
/** section: AppsMe
 * class AppFileManager < FileManager
 **/
class AppFileManager extends FileManager{
/**
 * FileManager.Initialize() -> void
 * 
 * Cette méthode initialise le lien du dossier de référence et les extensions autorisées à être manipulés.
 **/	
	public function Initialize(){
		global $S;	
		
		if(!User::IsConnect()) return;
		
		$this->prefixe = 'application';
		
		if(!empty($_POST['Application_ID'])){
			$this->Path = App::MkDir((int) $_POST['Application_ID']);
			@Stream::MkDir($this->Path, 0751);
		}
	}
}
?>
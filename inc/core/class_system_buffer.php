<?php
/** section: Core
 * mixin SystemBuffer
 *
 * Cette classe gère le buffer et la compression des données.
 * 
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_system_buffer.php
 * * Version : 1.0
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
abstract class SystemBuffer{
/**
 * SystemBuffer.Stack -> Array
 **/	
	protected static $Stack = array();
/**
 * SystemBuffer.Start([ output_callback [, chunk_size [, erase ]]] ) -> String
 * - output_callback (String): Méthode de compression.
 * - chunksize (Number): Taille maximale par ligne.
 * - erase (Boolean): ?
 *
 * Démarre la temporisation de sortie. Tant qu'elle est enclenchée, aucune donnée, hormis les en-têtes, n'est envoyée au navigateur, mais temporairement mise en tampon. 
 *
 * Voir la documentation d'ob_start pour plus d'information <a href="http://www.php.net/manual/fr/function.ob-start.php">http://www.php.net/manual/fr/function.ob-start.php</a>.
 **/
	static function  Start($output_callback = '', $chunk_size = 0, $erase = true){
		
		// if gzip_compression is enabled, start to buffer the output				
		if ($output_callback == 'ob_gzhandler' && !headers_sent() && ($ext_zlib_loaded = extension_loaded('zlib')) ) {
			
			// For use in the footer
			$ini_zlib_output_compression = 	(int) ini_get ('zlib.output_compression'); // an empty string where it doesn't exist or is null
			$ini_set_available = 			function_exists('ini_set'); // some hosts disable this
			/**
			 * @see https://bugs.php.net/bug.php?id=55544&edit=1
			 * PHP 5.4.0 - 5.4.5 - ob_gzhandler always conflicts with zlib.output_compression
			 **/
			$last_known_bugged_version = 	'5.4.5'; // Only here to make clear which version is the bugged one in the code
			$php_bugged_version = 			(version_compare( PHP_VERSION, '5.4.0') >= 0 ) && (version_compare(PHP_VERSION, $last_known_bugged_version) <= 0);
			
			// If zlib is not 1 then it is off
			if ($ini_zlib_output_compression !== 1) {
				
				// No point trying to ini_set if the host has it turned off!
				if ($ini_set_available && (version_compare(PHP_VERSION, '4.0.5') >= 0)) {
					
					ini_set('zlib.output_compression', 1);
					
					//ini_set('zlib.output_compression_level', OUTPUT_COMPRESSION_LEVEL);
					
					// If the PHP version is larger than 4.0.4 and it is not a bugged version then we should be ok using the ob_gzhandler callback
					
					
				} elseif ((version_compare(PHP_VERSION, '4.0.4') >= 0) && !$php_bugged_version) {
					return ob_start('ob_gzhandler', $chunk_size, $erase) ;
				} 
				
				
			} else {
				//ini_set('zlib.output_compression_level', OUTPUT_COMPRESSION_LEVEL); // It's on so well set the level
			}
			
			return ob_start(NULL, $chunk_size, $erase);
		} // end gzip compression
		
					
		return ob_start($output_callback, $chunk_size, $erase);
		
	}
/**
 * SystemBuffer.GetClean() -> String
 * Lit le contenu courant du tampon de sortie puis l'efface.
 **/
	static function GetClean(){
		return @ob_get_clean();
	}
/**
 * SystemBuffer.Clean() -> void
 * Cette fonction vide le tampon de sortie sans l'envoyer au navigateur.
 **/
	static function Clean(){
		return ob_clean();
	}
/**
 * SystemBuffer.Get() -> String
 * Retourne le contenu du tampon de sortie sans l'effacer. 
 **/	
	static function Get(){
		return ob_get_contents();
	}
/**
 * SystemBuffer.EndClean() -> void
 * Détruit les données du tampon de sortie et éteint la tamporisation de sortie.
 **/
	static function EndClean(){
		return @ob_end_clean();
	}
/**
 * SystemBuffer.EndFlush() -> void
 * Envoie les données du tampon de sortie et éteint la tamporisation de sortie.
 **/
	static function EndFlush(){
		return @ob_end_flush();
	}
/**
 * SystemBuffer.Flush() -> void
 * Vide les tampons de sortie
 **/
	static function Flush(){
		return @ob_flush();
	}
/**
 * SystemBuffer.Store([ output_callback [, chunk_size [, erase ]]] ) -> String
 *
 * Cette méthode copie le buffer courant, le stock dans la pile et le supprime du contexte. Il pourra être récupéré via la fonction Restore.
 **/	
	static function Store($output_callback = '', $chunk_size = 0, $erase = true){
		array_push(self::$Stack, $str = self::GetClean());
		self::Start($output_callback, $chunk_size, $erase);
		return $str;
	}
/**
 * SystemBuffer.Restore([ output_callback [, chunk_size [, erase ]]] ) -> String
 *
 * Cette méthode détruit le buffer courrant et le remplace par une copie précédente.
 **/	
	static function Restore($output_callback = '', $chunk_size = 0, $erase = true){
		self::EndClean();
		$str = array_pop(self::$Stack);
		self::Start($output_callback, $chunk_size, $erase);
		echo $str;
		return $str;
	}
}
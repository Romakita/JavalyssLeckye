<?php
/*
 * Test de l'API AppsMe
 **/
 
function DrawTest($cmd, $options = '', $vardump = false){
	?>
    <h2>Commande "<?php echo $cmd ?>"</h2>
    <?php
        
		if(is_array($options)){
			echo '<ul>';
			
			foreach($options as $key => $value){
				$_POST[$key] = $value;
				echo '<li><strong>' . $key . ' :</strong> ' . $value . '</li>'; 	
			}
			
			echo '</ul>';
		}
		
		ob_start();
		
		AppsMe::execSafe($cmd);
		
		$result = ob_get_clean();
		
		if($vardump){
			var_dump(json_decode($result));
		}else{
			echo '<pre><code>';
			echo $result;
        	echo '</code></pre>';
		}
    	
		
		if(is_array($options)){
			foreach($options as $key => $value){
				unset($_POST[$key]);
			}
		}
}
?>
<html>
<head>
<style>
	pre{
		background-color:#F0F0FF;
		border:			1px solid #DDDDEE;
		color:			#333333;
		font: 			13px "Panic Sans","Bitstream Vera Sans Mono",Monaco,Consolas,Andale Mono,monospace;
		line-height: 	1.5;
		margin-bottom: 	1.625em;
		overflow: 		auto;
		padding: 		0.75em 1.625em;
		max-height:		500px;
	}
	code{
		font: 			13px Monaco, Consolas, "Andale Mono", "DejaVu Sans Mono", monospace;
	}

.html-node code{
	background-color: #F0F0F0;
	border: 1px solid #CCCCCC;
	border-radius: 3px 3px 3px 3px;
	padding: 0 3px;	
}
</style>
</head>
<body>

<div style="width:800px; margin:auto">
	
    <?php
        
        DrawTest('depot.info');
        DrawTest('depot.info.array');
        DrawTest('depot.category.list');
        DrawTest('depot.app.list', NULL, true);
    	
		DrawTest('depot.app.info', array('Name' => 'BlogPress'));
		DrawTest('depot.app.info', array('Application_ID' => 10));
		
		DrawTest('depot.update.list', array('Name' => 'Javalyss Leckye', 'Version' => '0.4.0'), true);
		
		DrawTest('depot.update.list', array(
			'Name' => 		'Javalyss Leckye', 
			'Version' => 	'0.4.0', 
			'Apps' => 		'[{"Name":"BlogPress", "Version":"1.1"}]'
		), true);
		
		DrawTest('depot.release.list', array('Name' => 'Javalyss Leckye'), true);
		DrawTest('depot.release.list', array('Application_ID' => 12), true);
		DrawTest('depot.release.list', array('Name' => 'Javalyss Leckye', 'Version' => '0.4.0'), true);
		
		DrawTest('depot.release.last', array('Name' => 'Javalyss Leckye'), true);
		
		DrawTest('depot.release.description', array('Name' => 'Javalyss Leckye', 'Version' => '0.5.0'), false);
		DrawTest('depot.release.info', array('Name' => 'Javalyss Leckye', 'Version' => '0.5.0'), true);
		
		
		echo '<a href="'.URI_PATH.'/admin/ajax/?cmd=depot.release.get&Name=Javalyss Leckye&Version=0.5.0">Télécharger</a>';
		
		
    ?>
 	   
</div>

</body>
</html>
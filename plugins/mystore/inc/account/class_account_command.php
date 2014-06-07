<?php
/** section: MyStore
 * class MyStoreAccount 
 * includes ObjectTools
 *
 * Cette classe permet de gérer les différents événements du logiciel Javalyss pour la mise en place des données de l'extension MyStore.
 *
 * #### Informations
 *
 * * Auteur : Paul Tabet
 * * Fichier : class_account.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
abstract class MyStoreAccountCommand extends ObjectTools{
	
	static public function Initialize(){
		System::Observe('blog:start', array(__CLASS__, 'onStart')); 
		//System::Observe('mystore:gateway.exec', array('MyStoreAccountCommand', 'exec'));	
	}
	
	static public function onStart(){
		$link = Permalink::Get();
		if($link->match('/command\/export\/([0-9].*)/')){//on vide la panier
			
			if(User::IsConnect()){
				
				$parameters = $link->getParameters();
				
				$command = new MyStoreCommand((int)$parameters[2]);
				
				if(1 * $command->User_ID == User::IsConnect()->User_ID){
					
					FrameWorker::Download($pdf = File::ToABS($command->printPDF()), false);
					@Stream::Delete($pdf);
				}else{
					header('Location:'. Blog::GetInfo('page:compte'));
				}
				
			}else{
				header('Location:' . Blog::GetInfo('admin') . '?redir=' . rawurlencode($link) );
			}
			
			exit();
		}	
	}
/**
 * MyStoreAccount.onStartPage() -> void
 *
 * Cette méthode génère le contenu de la page Compte
 **/	
	public static function Draw(){
		$options = 			new stdClass();
		$options->User_ID = User::Get()->User_ID;
		$options->Statut =	array('paid', 'confirmed', 'prepared', 'delivery', 'finish');
		$options->order =	'Date_Create ASC';
		MyStoreCommand::GetList($options, $options);
		
		?>
        <div class="mystore-command">
           
           	<?php
		   		if(!MyStoreCommand::Count()):
			?>
            	<h2><?php echo MUI('Vous n\'avez pas de commande en cours'); ?></h2>
            <?php
				else:
		   	?>
        		
                <table class="form-table table-form table-command mystore-command">
                <thead>
                    <tr>
                        
                        <th class="col-number">N° Commande</th><!-- order-image col -->
                        <th class="col-statut">Etat</th><!-- item description col -->
                        <th class="col-date">Effectuée le</th>
                        <th class="col-date">Livrée le</th>
                        <th class="col-price">Valeur</th>
                        <th class="col-actions"> </th>
                        
                    </tr>
                </thead>
                
                <tbody>
             	<?php
					while(MyStoreCommand::Current()):
				?>
                	<tr>
                    	<td class="col-number"><?php echo MyStoreCommand::NB() ?></td><!-- order-image col -->
                        <td class="col-statut"><?php
                        	switch(MyStoreCommand::Statut()){
								case 'paid':
									echo MUI('En attente de confirmation');
									break;
									
								case 'confirmed':	
									echo MUI('Confirmée et en en cours de préparation');
									break;
									
								case 'prepared':
									echo MUI('Préparée');
									break;
								
								case 'delivery':
									echo MUI('En cours de livraison');
									break;
								
								case 'finish':
									echo MUI('Terminée');
									break;
							}
						?></td><!-- item description col -->
                        <td class="col-date"><?php
							echo MyStoreCommand::DateCreate('%d/%m/%Y');
						?></td>
                        <td class="col-date"><?php
							if(MyStoreCommand::Statut() == 'finish'){
								echo MyStoreCommand::DateFinish('%d/%m/%Y');
							}
						?></td>
                        <td class="col-price"><?php echo MyStoreCommand::Amount(',', ' ') ?></td>
                        <td class="col-actions"><span class="box-simple-button"><a href="<?php Blog::Info('uri'); ?>command/export/<?php echo MyStoreCommand::ID(); ?>">Télécharger</a></span></td>
                    </tr>
                <?php
						MyStoreCommand::Next();
					endwhile;
				?>
                </tbody>
                </table>
                
            <?php
				endif;
			?>
        </div>
        <?php
		
	}
}


MyStoreAccountCommand::Initialize();
?>
<?php
/** section: Interfaces
 * mixin iForm
 *
 * Interface des classes de gestion des formulaires BlogPress.
 **/
interface iForm{
/**
 * iForm.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/
	public static function Initialize();
/**
 * iForm.onFormSubmit() -> void
 *
 * Cette méthode teste les champs envoyés par le formulaire affiché dans la page source.
 *
 * Utilisez les méthodes [[System.GetCMD]] pour connaitre la commande et [[BlogPress.SetError]] pour indiquer une erreur dans le formulaire.
 **/
	public static function onFormSubmit();
/**
 * iForm.onFormCommit() -> void
 *
 * Cette méthode permet d'enregistrer les données du formulaire seulement si aucune erreur n'a été signalé via la méthode [[BlogPress.SetError]].
 **/
	public static function onFormCommit();
/**
 * iForm.onBeforeForm() -> void
 *
 * Cette méthode permet d'afficher des données en tête du formulaire si le formulaire déclenche l'événement `blog:form.before`.
 *
 * #### Exemple
 *
 *     <form action="<?php Blog::Info('submit'); ?>" method="post" name="formRegister" class="form form-register">
 *     <?php
 *         Blog::Fire('form.before'); 
 *     ?>
 *     Formulaire
 *     <?php
 *         Blog::Fire('form.after'); 
 *     ?>
 *     </form>
 *
 **/
	public static function onBeforeForm();
/**
 * iForm.onAfterForm() -> void
 *
 * Cette méthode permet d'afficher des données en pied de formulaire si le formulaire déclenche l'événement `blog:form.after`.
 *
 * #### Exemple
 *
 *     <form action="<?php Blog::Info('submit'); ?>" method="post" name="formRegister" class="form form-register">
 *     <?php
 *         Blog::Fire('form.before'); 
 *     ?>
 *     Formulaire
 *     <?php
 *         Blog::Fire('form.after'); 
 *     ?>
 *     </form>
 *
 **/
	public static function onAfterForm();
}
?>
<?
///////////////////////////////////////////////////
///                         www.planningmaster.fr			///
///                         Planning Master Online			///
///                    Version Hotellerie/Campings		///
///									///
///	                              locations.php				///
///		          V1.01 du 16/02/09 17:30		///
///									///
///		          Développé par Analemme			///
///		                www.analemme.fr			///
///////////////////////////////////////////////////

//Vérif Utilisateur
require("fonctions_communes.php");
test_session();
select_version_db();

if (isset($_GET["op"])){
	$op = $_GET["op"];
} elseif (isset($_POST["op"])) {
	$op = $_POST["op"];
}
//print "Op : " . $op . "<br />";

////////////////////////////////////////////////////
//	Gestion de la langue de la page
////////////////////////////////////////////////////
$User = $_SESSION["User"];
$languages = array("FR","EN");
if ($User["Lang"] == ""){
	if (isset($_GET["Lang"]) && in_array($_GET["Lang"],$languages)){
		$User["Lang"] = $_GET["Lang"];
	} else {
		$User["Lang"] = "FR";
	}
}
$_SESSION["User"] = $User;
include_once("lang/" . $User["Lang"] . "/locations.inc.php");
include_once("lang/" . $User["Lang"] . "/fonctions_communes.inc.php");


////////////////////////////////////////////////////
//	Gestion de la page ouvrante
////////////////////////////////////////////////////
if (isset($_GET["opener"])){
	$Location = $_SESSION["Location"];
	$Location["Opener"] = $_GET["opener"];
	$Location["Opener_Action"] = $_GET["opener_action"];
	$_SESSION["Location"] = $Location;
} elseif (isset($_POST["opener"])) {
	$Location = $_SESSION["Location"];
	$Location["Opener"] = $_POST["opener"];
	$Location["Opener_Action"] = $_POST["opener_action"];
	$_SESSION["Location"] = $Location;
}

switch ($op){
	case "add_location":
		add_location();
		break;
		
	case "add_location_init":
		add_location_init();
		break;
		
	case "calcule_total":
		calcule_total($_GET["Redirect"]);
		break;
		
	case "delete_location":
		delete_location($_GET["Action"]);
		break;
		
	case "delete_materiel":
		delete_materiel($_GET["Record_ID"]);
		break;
		
	case "do_add_location":
		do_add_location($_POST["Employe_ID"], $_POST["Client_ID"], $_POST["Statut_ID"], $_POST["Ref"], $_POST["Date_Depart"], $_POST["Heure_Depart"], $_POST["Date_Retour"], $_POST["Heure_Retour"], $_POST["Duree"], $_POST["Remarques"], $_POST["TVA"], $_POST["Caution"], $_POST["Accompte"], $_POST["Save"]);
		break;

	case "do_add_duplication":
		do_add_duplication($_POST["Employe_ID"], $_POST["Client_ID"], $_POST["Statut_ID"], $_POST["Ref"], $_POST["Date_Depart"], $_POST["Heure_Depart"], $_POST["Date_Retour"], $_POST["Heure_Retour"], $_POST["Duree"], $_POST["Remarques"], $_POST["Caution"], $_POST["Save"]);
		break;

	case "do_modif_param":
		do_modif_param($_POST["Employe_ID"], $_POST["Statut_ID"], $_POST["Date_Depart"], $_POST["Heure_Depart"], $_POST["Date_Retour"], $_POST["Heure_Retour"], $_POST["Duree"], $_POST["Save"]);
		break;

	case "do_save_location":
		do_save_location();
		break;

	case "do_select_nb":
		do_select_nb($_POST["Fiche_ID"]);
		break;
		
	case "duplication_init":
		duplication_init($_GET["Fiche_ID"]);
		break;	
		
	case "duplication":
		duplication();
		break;	
	
	case "duplication_set_date":
		duplication_set_date($_GET["Type"], $_GET["Date"], $_GET["Heure"]);
		break;
		
	case "duplication_set_qte":
		duplication_set_qte($_GET["Value"]);
		break;	
	
	case "duplication_set_state":
		duplication_set_state($_GET["Line"], $_GET["State"]);
		break;	
	
	case "duplication_use_serial":
		duplication_use_serial($_GET["Line"], $_GET["State"]);
		break;	
	
	case "modif_param_init":
		modif_param_init();
		break;

	case "modif_param":
		modif_param();
		break;

	case "modif_set_date":
		modif_set_date($_GET["Type"], $_GET["Date"], $_GET["Heure"]);
		break;
		
	case "password_check":
		password_check($_POST["Password"], $_POST["DestPage"], $_POST["From"]);
        break;
		
	case "password_init":
		password_init();
        break;

	case "popup_create":
		popup_create($_GET["Start_X"], $_GET["Start_Y"]);
        break;
		
	case "print_location":
		print_location();
		break;
	
	case "select_nb":
		select_nb();
		break;
		
	case "set_date":
		set_date($_GET["Type"], $_GET["Date"], $_GET["Heure"]);
		break;
		
	case "view_location_init":
		view_location_init($_GET["Fiche_ID"], $_GET["Output"]);
		break;	
		
	case "view_revisions":
		view_revisions();
		break;
		
	case "calcule_date_fin":	
		calcule_date_fin($_GET["duree"]);
		break;	
}

///////////////////////////////////////////////////////////
///		  Fonction initialisation nouvelle Location		///
///////////////////////////////////////////////////////////
function add_location_init(){
	global $db;
	
	$Client_Info = $_SESSION["Client_Info"];
	$Location = $_SESSION["Location"];
	$User = $_SESSION["User"];
	$TVA_List = $_SESSION["TVA_List"];
	$Version_Info = $_SESSION["Version_Info"];
	
	select_version_db();
	//Créer la location pour N° Fiche
	$Filtre = "insert into Locations (Fiche_ID) values ('')";
	$sql = mysql_query($Filtre,$db);
	
	//Rapatrier N° Fiche
	$Filtre = "Select Last_insert_ID() as Fiche_ID from Locations limit 0,1";
	$sql = mysql_query($Filtre,$db);
	$row= mysql_fetch_array($sql);
	
	$Location["Fiche_ID"] = $row["Fiche_ID"];
	$Location["Action"] = "Add";
	$Location["Employe_ID"] = 0;
	
	$Location["Revision"] = 0;
	$Location["Client_ID"] = 0;
	
	$Location["Statut_ID"] = 1;
	$Location["Ref"] = "";
	$Location["Remarques"] = "";
	$Location["Duree"] = "";
	$Location["Caution"] = 0;
	
	//Dates selon préférences utilisateurs
	$CurrDay = date("d");
	$CurrMonth = date("m");
	$CurrYear = date("Y");
	
	if ($User["Pref_DateDep"] != ""){
		$Location["Date_Depart_FR"] = date("d/m/Y", mktime(0, 0, 0, $CurrMonth, $CurrDay + $User["Pref_DateDep"], $CurrYear));
		$Location["Date_Depart_EN"] = date("Y-m-d", mktime(0, 0, 0, $CurrMonth, $CurrDay + $User["Pref_DateDep"], $CurrYear));
	} else {
		$Location["Date_Depart_FR"] = date("d/m/Y", mktime(0, 0, 0, $CurrMonth, $CurrDay + $Version_Info["Pref_DateDep"], $CurrYear));
		$Location["Date_Depart_EN"] = date("Y-m-d", mktime(0, 0, 0, $CurrMonth, $CurrDay + $Version_Info["Pref_DateDep"], $CurrYear));
	}
	$Location["Heure_Depart"] = $User["Pref_HeureDep"];
	
	if ($User["Pref_DateRet"] != ""){
		$Location["Date_Retour_FR"] = date("d/m/Y", mktime(0, 0, 0, $CurrMonth, $CurrDay + $User["Pref_DateRet"], $CurrYear));
		$Location["Date_Retour_EN"] = date("Y-m-d", mktime(0, 0, 0, $CurrMonth, $CurrDay + $User["Pref_DateRet"], $CurrYear));
		$Location["Duree"] = $User["Pref_DateRet"] - $User["Pref_DateDep"];
	} else {
		$Location["Date_Retour_FR"] = date("d/m/Y", mktime(0, 0, 0, $CurrMonth, $CurrDay + $Version_Info["Pref_DateRet"], $CurrYear));
		$Location["Date_Retour_EN"] = date("Y-m-d", mktime(0, 0, 0, $CurrMonth, $CurrDay + $Version_Info["Pref_DateRet"], $CurrYear));
		$Location["Duree"] = $Version_Info["Pref_DateRet"] - $Version_Info["Pref_DateDep"];
	}
	$Location["Heure_Retour"] = $User["Pref_HeureRet"];
	
	$Groupes["Materiels"] = "";
	$Groupes["Max_Materiels"] = 0;
	
	//Variables de Sauvegarde et Modification
	$Location["Historique"] = "";
	$Location["Saved"] = 0;
	$Location["Modifiee"] = 1;
	$Location["Alert_Saved"] = "";
	
	//Taille des Listings
	$Available_Space = $User["Util_ResY"] - 580;
	$Location["Canvas_Height_Materiels"] = $Available_Space ;
	
	$Location["Total_HT"] = 0;
	$Location["TVA_Montant"] = 0;
	$Location["Total_TTC"] = 0;
	$Location["Remise_Montant"] = 0;
	$Location["Accompte"] = 0;
	$Location["A_Payer"] = 0;
	
	//RAZ des taux de TVA
	for ($i=0;$i<$TVA_List["Max"];$i++){
		$TVA_List[$i]["Articles"] = 0;
		$TVA_List[$i]["Base"] = 0;
		$TVA_List[$i]["Montant"] = 0;
	}
	//$TVA_List["Max"] = 0;
		
	$_SESSION["Location"] = $Location;
	$_SESSION["Groupes"] = $Groupes;
	$_SESSION["TVA_List"] = $TVA_List;
	
	header("Location: " . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=add_location");
}

///////////////////////////////////////////////////////////
///		         Fonction affichage Location			///
///////////////////////////////////////////////////////////
function add_location(){
	global $db, $lang;
	
	$Client_Info = $_SESSION["Client_Info"];
	$Groupes = $_SESSION["Groupes"];
	$JS = $_SESSION["JS"];
	$Location = $_SESSION["Location"];
	$Palette = $_SESSION["Palette"];
	$TVA_List = $_SESSION["TVA_List"];
	$User = $_SESSION["User"];
	
	setLocale(LC_TIME, "fr_FR.UTF-8");
	
	//Liste des Employés pour ce compte utilisateur
	select_client_db();
	mysql_query("SET NAMES 'utf8'");
	$Filtre = "Select * from Utilisateurs_Employes where User_ID = '" . $User["User_ID"] . "' order by Nom asc";
	//print $Filtre;
	$sql = mysql_query($Filtre,$db);
	$MaxEmployes = mysql_numrows($sql);
	$CreateurStr = "";
	if ($MaxEmployes == 1){
		$CreateurStr = "<option value=\"" . mysql_result($sql,0,"Employe_ID") . "\" selected>" . mysql_result($sql,0,"Nom") . "</option>\n";
		$Location["Employe_ID"] = mysql_result($sql,0,"Employe_ID");
	} else {
		while ($row = mysql_fetch_array($sql)){
			if ($row["Employe_ID"] == $Location["Employe_ID"]){
				$CreateurStr .= "<option value=\"" . $row["Employe_ID"] . "\" selected>" . $row["Nom"] . "</option>\n";
			} else {
				$CreateurStr .= "<option value=\"" . $row["Employe_ID"] . "\">" . $row["Nom"] . "</option>\n";
			}
		}
	}
	select_version_db();
	
	//Dates selon type d'action
	if ($Location["Action"] == "Edit"){
		//Jours
		$DateDepStr = "
			<div class=\"champ_formulaire_location\" style=\"width: 240px; height: 14px; padding-top: 4px;\">
				<div style=\"float: left; width: 160px; color: #0000FF; text-align: center; font-weight: bold;\">
					" . utf8_decode(ucfirst(strftime ("%A %d %B %Y", strtotime($Location["Date_Depart_EN"])))) . "
					<input type=\"hidden\" name=\"Date_Depart\" value=\"" . $Location["Date_Depart_FR"] . "\">
				</div>
				<div style=\"float: left; width: 10px; text-align: center;\">à</div>
				<div style=\"float: left; width: 60px; color: #0000FF; text-align: center; font-weight: bold;\">
					" . $Location["Heure_Depart"] . "
					<input type=\"hidden\" name=\"Heure_Depart\" value=\"" . $Location["Heure_Depart"] . "\">
				</div>
			</div>\n";
			
		$DateRetStr = "
			<div class=\"champ_formulaire_location\" style=\"width: 240px; height: 14px; padding-top: 4px;\">
				<div style=\"float: left; width: 160px; color: #0000FF; text-align: center; font-weight: bold;\">
					" . utf8_decode(ucfirst(strftime ("%A %d %B %Y", strtotime($Location["Date_Retour_EN"])))) . "
					<input type=\"hidden\" name=\"Date_Retour\" value=\"" . $Location["Date_Retour_FR"] . "\">
				</div>
				<div style=\"float: left; width: 10px; text-align: center;\">à</div>
				<div style=\"float: left; width: 60px; color: #0000FF; text-align: center; font-weight: bold;\">
					" . $Location["Heure_Retour"] . "
					<input type=\"hidden\" name=\"Heure_Retour\" value=\"" . $Location["Heure_Retour"] . "\">
				</div>
			</div>\n";
		
		//Statut
		$RealStatus = $Location["Statut_ID"] - 1;
		$StatutStr = "
			<div class=\"champ_formulaire_location\" style=\"width: 430px; height: 17px; padding-top: 1px;\">
				<div id=\"Statut_ID\" style=\"float: left; padding-top: 2px;\">
					<div style=\"width: 120px; padding-bottom: 1px; border: 1px solid #000000; color: #" . $Palette["Police_Hex"][$RealStatus] . "; background-color: #" . $Palette["Couleur_Hex"][$RealStatus] . "; text-align: center; font-weight: bold;\">" . $Palette["Statut"][$RealStatus] . "</div>
					<input type=\"hidden\" name=\"Statut_ID\" value=\"" . $Location["Statut_ID"] . "\">
				</div>
			</div>\n";
						
		//Durée
		if ($Location["Duree"] != 1){
			$NuitsStr = $lang["Add_Location"]["Nuits"];
		} else {
			$NuitsStr = $lang["Add_Location"]["Nuits"];
		}
		$DureeStr = "
			<div style=\"float: left; width: 100px; text-align: center; color: #0000FF; font-weight: bold;\">
				" . $Location["Duree"] . " " . $NuitsStr . "
				<input type=\"hidden\" name=\"Duree\" value=\"" . $Location["Duree"] . "\">
			</div>\n";
		
	} else {
		//Création des zones d'heure
		$Exact_Day = date("d");
		$Exact_Month = date("m");
		$Exact_Year = date("Y");

		$HeureDepStr = "
				<select name=\"Heure_Depart\" class=\"form_element\" onChange=\"SetDate('Debut')\" onFocus=\"ShowMessage('HeureDep', 'inform', '" . addslashes($lang["Add_Location"]["Tooltip_Heuredep"]) . "', 'Up');\" onBlur=\"return nd();\">\n";
		$HeureRetStr = "
				<select name=\"Heure_Retour\" class=\"form_element\" onChange=\"SetDate('Fin')\" onFocus=\"ShowMessage('HeureRet', 'inform', '" . addslashes($lang["Add_Location"]["Tooltip_Heureret"]) . "', 'Up');\" onBlur=\"return nd();\">\n";

		for ($i=0;$i<24;$i++){
			$CurrTime = date("H:i", mktime($i, 0, 0, $Exact_Month, $Exact_Day, $Exact_Year));
			if ($Location["Heure_Depart"] != $CurrTime){
				$HeureDepStr .= "<option value=\"" . $CurrTime . "\">" . $CurrTime . "</option>\n";
			} else {
				$HeureDepStr .= "<option value=\"" . $CurrTime . "\" selected>" . $CurrTime . "</option>\n";
			}
			if ($Location["Heure_Retour"] != $CurrTime){
				$HeureRetStr .= "<option value=\"" . $CurrTime . "\">" . $CurrTime . "</option>\n";
			} else {
				$HeureRetStr .= "<option value=\"" . $CurrTime . "\" selected>" . $CurrTime . "</option>\n";
			}
		}
		$HeureDepStr .= "</select>\n";
		$HeureRetStr .= "</select>\n";
		
		$DateDepStr = "
			<div class=\"champ_formulaire_location\" style=\"width: 240px; height: 18px;\">
				<div id=\"DateDep\" style=\"float: left; margin-top: 2px;\">
					<input type=\"text\" id=\"Date_Depart\" name=\"Date_Depart\" value=\"" . $Location["Date_Depart_FR"] . "\" size=\"11\" maxLength=\"10\" class=\"form_element\" readonly=\"readonly\">
				</div>
				<div id=\"DateDepIcon\" style=\"float: left; padding-left: 5px; margin-top: 4px;\">
					<img src=\"images/software_icons/calendrier.png\" width=\"25\" border=\"0\" id=\"trigger_dd\" style=\"cursor: pointer; vertical-align: middle;\" onMouseOver=\"ShowMessage('DateDepIcon', 'inform', '" . addslashes($lang["Add_Location"]["Tooltip_Datedep_Icon"]) . "', 'Up');\" onMouseOut=\"return nd();\" />
				</div>
				<script type=\"text/javascript\">
					function DoSelect1(calendar, date) {
						var input_field = document.getElementById(\"Date_Depart\");
						input_field.value = date;
						if (calendar.dateClicked) {
							calendar.callCloseHandler(); // this calls \"onClose\" (see above)
							SetDate('Debut');
						}
					};
					Calendar.setup(
						{
							inputField : \"Date_Depart\",
							ifFormat : \"%d/%m/%Y\",
							firstDay : 1,
							showsTime : false,
							button : \"trigger_dd\",
							onSelect : DoSelect1
						}
					);
				</script>
				<div style=\"float: left; padding-left: 5px; margin-top: 5px;\">" . $lang["Add_Location"]["A"] . "</div>
				<div id=\"HeureDep\" style=\"float: left; padding-left: 5px; margin-top: 3px;\">
					" . $HeureDepStr . "
				</div>
			</div>\n";
			
		$DateRetStr = "
			<div class=\"champ_formulaire_location\" style=\"width: 240px; height: 18px;\">
				<div id=\"DateRet\" style=\"float: left; margin-top: 2px;\">
					<input type=\"text\" id=\"Date_Retour\" name=\"Date_Retour\" value=\"" . $Location["Date_Retour_FR"] . "\" size=\"11\" maxLength=\"10\" class=\"form_element\" readonly=\"readonly\">
				</div>
				<div id=\"DateRetIcon\" style=\"float: left; padding-left: 5px; margin-top: 4px;\">
					<img src=\"images/software_icons/calendrier.png\" width=\"25\" border=\"0\" id=\"trigger_dr\" style=\"cursor: pointer; vertical-align: middle;\" onMouseOver=\"ShowMessage('DateRetIcon', 'inform', '" . addslashes($lang["Add_Location"]["Tooltip_Dateret_Icon"]) . "', 'Up');\" onMouseOut=\"return nd();\" />
				</div>
				<script type=\"text/javascript\">
					function DoSelect2(calendar, date) {
						var input_field = document.getElementById(\"Date_Retour\");
						input_field.value = date;
						if (calendar.dateClicked) {
							calendar.callCloseHandler(); // this calls \"onClose\" (see above)
							SetDate('Fin');
						}
					};

					Calendar.setup(
						{
							inputField : \"Date_Retour\",
							ifFormat : \"%d/%m/%Y\",
							firstDay : 1,
							showsTime : false,
							button : \"trigger_dr\",
							onSelect : DoSelect2
						}
					);
				</script>
				<div style=\"float: left; padding-left: 5px; margin-top: 5px;\">" . $lang["Add_Location"]["A"] . "</div>
				<div id=\"HeureRet\" style=\"float: left; padding-left: 5px; margin-top: 3px;\">
					" . $HeureRetStr . "
				</div>
			</div>\n";
			
		//Statut : liste et bulle d'information
		$tooltip_statut = "<div style='height: 5px;'></div>";
		$CurrStatus = $Location["Statut_ID"] -1;
		$LstStatuts = "";
		for ($i=0;$i<$Palette["Max_Palette"];$i++){
			if ($Location["Statut_ID"] != $Palette["ID"][$i]){
				$LstStatuts .= "<option value=\"" . $Palette["ID"][$i] . "\">" . $Palette["Statut"][$i] . "</option>\n";
			} else {
				$LstStatuts .= "<option value=\"" . $Palette["ID"][$i] . "\" selected>" . $Palette["Statut"][$i] . "</option>\n";
			}
			$tooltip_statut .= "<div class='statut' style='color: #" . $Palette["Police_Hex"][$i] . "; background-color: #" . $Palette["Couleur_Hex"][$i] . ";'>". $Palette["Statut"][$i] ."</div>";
			$tooltip_statut .= "<div style='height: 2px;'></div>";
			
		}
		$tooltip_statut .= "<div style='height: 3px;'></div>";
		$tooltip_statut = addslashes($tooltip_statut);
		
		$StatutStr = "
			<div class=\"champ_formulaire_location\" style=\"width: 430px; height: 16px; padding-top: 2px;\">
				<div id=\"Statut_ID\" style=\"float: left;\">
					<select name=\"Statut_ID\" class=\"form_element\" onChange=\"SubmitDoc()\" onFocus=\"ShowMessage('Statut_ID', 'inform', '" . addslashes($lang["Add_Location"]["Tooltip_Statut"]) . "', 'Up');\" onBlur=\"return nd();\">
						<option value=\"0\" selected>". $lang["Add_Location"]["Choisissez"] ."</option>
						" . $LstStatuts . "
					</select>
				</div>
				<div style=\"float: left; padding-left: 5px;\">
					<img src=\"" . $User["Image_Path"] . "/information.png\" alt=\"\" style=\"width: 16px; cursor: pointer;\" onMouseOver=\"ShowPopup('" . $tooltip_statut . "')\" onMouseOut=\"return nd();\">
				</div>
			</div>\n";
		
		//Liste des Durées
		$ListDuree = "";
		for ($i=1;$i<366;$i++){
			if ($Location["Duree"] != $i){
				$ListDuree .= "<option value=\"" . $i . "\">" . $i . "</option>\n";
			} else {
				$ListDuree .= "<option value=\"" . $i . "\" selected>" . $i . "</option>\n";
			}
		}
		if ($Location["Duree"] != 1){
			$NuitsStr = $lang["Add_Location"]["Nuits"];
		} else {
			$NuitsStr = $lang["Add_Location"]["Nuit"];
		}
		
		$DureeStr = "
			<div id=\"Duree\" style=\"float: left;\">
				<select name=\"Duree\" class=\"form_element\" onChange=\"SubmitDoc()\" style=\"text-align: right; margin-right: 5px;\" onFocus=\"ShowMessage('Duree', 'inform', '" . addslashes($lang["Add_Location"]["Tooltip_Duree"]) . "', 'Up');\" onBlur=\"return nd();\">
					" . $ListDuree . "
				</select>
			</div>
			<div style=\"float: left; padding-top: 2px;\">
				" . $NuitsStr . "
			</div>\n";
	}
	
	//Liste des Clients
	$ClientStr = "";
	$Filtre = "Select Client_ID, Nom, Prenom from Clients where Client_Account='" . $User["Client_ID"] . "' order by Nom asc, Prenom asc";
	$sql = mysql_query($Filtre);
	while ($row = mysql_fetch_array($sql)){
		if ($row["Prenom"] != ""){
			$Client_Name = $row["Nom"] . " " . $row["Prenom"];
		} else {
			$Client_Name = $row["Nom"];
		}
		if ($row["Client_ID"] != $Location["Client_ID"]){ 
			$ClientStr .= "<option value=\"" . $row["Client_ID"] . "\">" . $Client_Name . "</option>\n";
		} else {
			$ClientStr .= "<option value=\"" . $row["Client_ID"] . "\" selected>" . $Client_Name . "</option>\n";
		}
	}

	//Affichage des totaux de TVA
	$TVAStr = "";
	$CurrTaux = 0;
	for ($i=0;$i<$TVA_List["Max"];$i++){
		if ($TVA_List[$i]["Articles"] > 0){
			if ($CurrTaux % 2 == 0){
				$CurrClass = "impaire";
			} else {
				$CurrClass = "paire";
			}
			
			$TVAStr .= "
				<tr>
					<td class=\"listing_ligne_" . $CurrClass . "_droite\" style=\"width: 40px;\">" . ($i + 1) . "</td>
					<td class=\"listing_ligne_" . $CurrClass . "_droite\" style=\"width: 60px;\">" . $TVA_List[$i]["Articles"] . "</td>
					<td class=\"listing_ligne_" . $CurrClass . "_droite\" style=\"width: 100px;\">" . number_format($TVA_List[$i]["Base"], 2, ',', ' ') . " &euro;</td>
					<td class=\"listing_ligne_" . $CurrClass . "_droite\" style=\"width: 80px;\">" . number_format($TVA_List[$i]["Taux"], 2, ',', ' ') . " %</td>
					<td class=\"listing_ligne_" . $CurrClass . "_droite\">" . number_format($TVA_List[$i]["Montant"], 2, ',', ' ') . " &euro;</td>
				</tr>\n";
			$CurrTaux++;
		}
	}
	
	//Rattraper la liste du matos réservé
	$ListResaStr = "";
	$Filtre = "
		Select
			PU, Locations_Materiels.PU_Type, TVA, Qte, Remise, Duree, Locations_Materiels.ID, Locations_Materiels.Statut_ID as Details_Statut,
			Date_Format(DateDep,'%d/%m/%y - %Hh') as DateDepFR, Date_Format(DateRet,'%d/%m/%y - %Hh') as DateRetFR, Inventaire.Designation, Inventaire.Modele,
			Inventaire.Num_Interne, Inventaire.Statut, Materiel_ID
		from
			Locations_Materiels, Inventaire
		where
			Fiche_ID = '" . $Location["Fiche_ID"] . "' and Inventaire.ID = Locations_Materiels.Materiel_ID
		order by
			Locations_Materiels.ID asc";
	//echo $Filtre;
	$sql = mysql_query($Filtre,$db);

	$CurrMatosID = 0;
	$FoundTarget = 0;
	while ($ListResa = mysql_fetch_array($sql)){
		//Créer un groupe si besoin
		$FoundGroup = -1;
		for ($i=0;$i<$Groupes["Max_Materiels"];$i++){
			if ($ListResa["Designation"] == $Groupes["Materiels"][$i]["Nom"]){
				//Matériel appartenant à un groupe... Sauver info
				$FoundGroup = $i;
				//echo "Trouvé : " . $ListResa["Designation"] . "<br />";
				break;
			}
		}
		
		//Ajouter le matériel à la liste du matériel
		$MatosInGroup[$CurrMatosID]["Record_ID"] = $ListResa["ID"];
		$MatosInGroup[$CurrMatosID]["Materiel_ID"] = $ListResa["Materiel_ID"];
		$MatosInGroup[$CurrMatosID]["Group_ID"] = $FoundGroup;
		$MatosInGroup[$CurrMatosID]["Debut"] = $ListResa["DateDepFR"];
		$MatosInGroup[$CurrMatosID]["Fin"] = $ListResa["DateRetFR"];
		
		$RealStatus = $ListResa["Details_Statut"] - 1;
		$MatosInGroup[$CurrMatosID]["Line_Color"] = $Palette["Couleur_Hex"][$RealStatus];
		$MatosInGroup[$CurrMatosID]["Statut"] = $Palette["Statut"][$RealStatus];
		$MatosInGroup[$CurrMatosID]["Type"] = $ListResa["Statut"];
		$MatosInGroup[$CurrMatosID]["Designation"] = $ListResa["Designation"];
		$MatosInGroup[$CurrMatosID]["Modele"] = $ListResa["Modele"];
		$MatosInGroup[$CurrMatosID]["Internal"] = $ListResa["Num_Interne"];
		$MatosInGroup[$CurrMatosID]["PU_Type"] = $ListResa["PU"];
		$MatosInGroup[$CurrMatosID]["TVA"] = $ListResa["TVA"];
		$MatosInGroup[$CurrMatosID]["Qte"] = $ListResa["Qte"];
		$MatosInGroup[$CurrMatosID]["Remise"] = $ListResa["Remise"];
		$MatosInGroup[$CurrMatosID]["Duree"] = $ListResa["Duree"];
		$MatosInGroup[$CurrMatosID]["Qte"] = $ListResa["Qte"];
		
		//Recalculer valeurs HT pour affichage dans listing
		if ($ListResa["PU_Type"] == "HT"){
			$MatosInGroup[$CurrMatosID]["PUHT"] = $ListResa["PU"];
			if ($ListResa["Statut"] == 0){
				$MatosInGroup[$CurrMatosID]["Total_HT"] = round($MatosInGroup[$CurrMatosID]["PUHT"] * $MatosInGroup[$CurrMatosID]["Duree"],2);
			} else {
				$MatosInGroup[$CurrMatosID]["Total_HT"] = round($MatosInGroup[$CurrMatosID]["PUHT"] * $MatosInGroup[$CurrMatosID]["Qte"],2);
			}
		} else {
			$MatosInGroup[$CurrMatosID]["PUTTC"] = $ListResa["PU"];
			$MatosInGroup[$CurrMatosID]["PUHT"] = round($MatosInGroup[$CurrMatosID]["PUTTC"] / (1 + $MatosInGroup[$CurrMatosID]["TVA"] / 100),2);
			
			if ($ListResa["Statut"] == 0){
				$MatosInGroup[$CurrMatosID]["Total_TTC"] = round($MatosInGroup[$CurrMatosID]["PUTTC"] * $MatosInGroup[$CurrMatosID]["Duree"],2);
			} else {
				$MatosInGroup[$CurrMatosID]["Total_TTC"] = round($MatosInGroup[$CurrMatosID]["PUTTC"] * $MatosInGroup[$CurrMatosID]["Qte"],2);
			}
			$MatosInGroup[$CurrMatosID]["Total_HT"] = round($MatosInGroup[$CurrMatosID]["Total_TTC"] / (1 + ($MatosInGroup[$CurrMatosID]["TVA"] / 100)),2);
		}
		
		//Augmenter ID matériel traité
		$CurrMatosID++;
	}	

	//La liste est prête, contsruire tableau
	$ListMatosStr = "";
	for ($i=0;$i<$Groupes["Max_Materiels"];$i++){
		if ($i<10){
			$CurrNb = "0" . $i;
			$CurrGroup = "Groupe_0" . $i;
			$CurrGroupImg = "Groupe_Img_0" . $i;
		} else {
			$CurrNb = $i;
			$CurrGroup = "Groupe_" . $i;
			$CurrGroupImg = "Groupe_Img_" . $i;
		}
					
		$ListMatosStr .= "
			<div class=\"group_header\">
				<div class=\"group_toggle\"><img id=\"" . $CurrGroupImg . "\" src=\"" . $User["Image_Path"] . "/list_close.png\" onClick=\"ToggleGroup('" . $CurrNb . "')\" style=\"cursor: pointer;\" title=\"". $lang["Add_Location"]["Tooltip_Etendre"] ."\" alt=\"\"></div>
				<div class=\"group_name\">
					<b>" . $Groupes["Materiels"][$i]["Nom"] . "</b> ( Qté : <b>" . $Groupes["Materiels"][$i]["Max"] . "</b> )
				</div>
			</div>
			<div id=\"" . $CurrGroup . "\" class=\"group\" style=\"visibility: visible;\">
				<table border=\"0\" cellpadding=\"0\" cellspacing=\"2\" width=\"100%\" class=\"text\">\n";
	
		//Afficher matériels de ce groupe
		$CurrLine = 0;
		for ($j=0;$j<$CurrMatosID;$j++){
			if ($MatosInGroup[$j]["Group_ID"] == $i){
				if ($CurrLine % 2 == 0){
					$CurrClass = "impaire";
				} else {
					$CurrClass = "paire";
				}
				
				//Positionnement sur dernier matériel si besoin
				$CurrLineVal = $CurrMatosID - 1;
				if ($j == $CurrLineVal && $FoundTarget == 0){
					$MatosInGroup[$j]["Target_Start"] = "<a name=\"Courant\">";
					$MatosInGroup[$j]["Target_End"] = "</a>";			
				}
					
				//Numéro si besoin
				if ($MatosInGroup[$j]["Type"] == 0){
					$CurrInternal = $MatosInGroup[$j]["Internal"];
					$CurrDebut = $MatosInGroup[$j]["Debut"];
					$CurrFin = $MatosInGroup[$j]["Fin"];
					$CurrStatut = $MatosInGroup[$j]["Statut"];
					if ($MatosInGroup[$j]["Duree"] != 1){
						$CurrDuree = $MatosInGroup[$j]["Duree"] . " " . $lang["Add_Location"]["Nuits"];
					} else {
						$CurrDuree = $MatosInGroup[$j]["Duree"] . " " . $lang["Add_Location"]["Nuit"];
					}
				} else {
					$CurrInternal = "";
					$CurrDebut = "";
					$CurrFin = "";
					$CurrStatut = "";
					$CurrDuree = "";
					$MatosInGroup[$j]["Line_Color"] = "000000";
				}
					
				//Matériel appartenant à ce groupe, afficher
				$ListMatosStr .= "
					<tr>
						<td class=\"listing_location_" . $CurrClass . "_centre\" style=\"width: 50px;\">
							<img src=\"" . $User["Image_Path"] . "/icon_edit.png\" onClick=\"EditMateriel('" . $MatosInGroup[$j]["Record_ID"] . "')\" style=\"width: 16px; cursor: pointer;\" border=\"0\" title=\"". $lang["Add_Location"]["Tooltip_Modifier"] ."\" alt=\"\">
							<img src=\"" . $User["Image_Path"] . "/icon_delete.png\" onClick=\"" . $JS["Locations_Supprimer_Materiel"] . "('" . $MatosInGroup[$j]["Record_ID"] . "', '" . $MatosInGroup[$j]["Designation"] . " " . $MatosInGroup[$j]["Modele"] . " N°" . $MatosInGroup[$j]["Internal"] . "')\" style=\"width: 16px; cursor: pointer;\" border=\"0\" title=\"". $lang["Add_Location"]["Tooltip_Supprimer"] ."\" alt=\"\">
						</td>
						<td class=\"listing_location_" . $CurrClass . "_gauche\" style=\"color: #" . $MatosInGroup[$j]["Line_Color"] . ";\">" . $MatosInGroup[$j]["Target_Start"] . $MatosInGroup[$j]["Modele"] . $MatosInGroup[$j]["Target_End"] . "</td>
						<td class=\"listing_location_" . $CurrClass . "_gauche\" style=\"width: 150px; color: #" . $MatosInGroup[$j]["Line_Color"] . ";\">" . $CurrInternal . "</td>
						<td class=\"listing_location_" . $CurrClass . "_centre\" style=\"width: 120px; color: #" . $MatosInGroup[$j]["Line_Color"] . ";\">" . $CurrDebut . "</td>
						<td class=\"listing_location_" . $CurrClass . "_centre\" style=\"width: 120px; color: #" . $MatosInGroup[$j]["Line_Color"] . ";\">" . $CurrFin . "</td>
						<td class=\"listing_location_" . $CurrClass . "_centre\" style=\"width: 75px; color: #" . $MatosInGroup[$j]["Line_Color"] . ";\">" . $CurrStatut . "</td>
						<td class=\"listing_location_" . $CurrClass . "_droite\" style=\"width: 85px; color: #" . $MatosInGroup[$j]["Line_Color"] . ";\">" . number_format($MatosInGroup[$j]["PUHT"] , 2, ',', ' ') ." &euro;</td>
						<td class=\"listing_location_" . $CurrClass . "_droite\" style=\"width: 55px; color: #" . $MatosInGroup[$j]["Line_Color"] . ";\">" . $MatosInGroup[$j]["Qte"] . "</td>
						<td class=\"listing_location_" . $CurrClass . "_droite\" style=\"width: 55px; color: #" . $MatosInGroup[$j]["Line_Color"] . ";\">" . $CurrDuree . "</td>
						<td class=\"listing_location_" . $CurrClass . "_droite\" style=\"width: 85px; color: #" . $MatosInGroup[$j]["Line_Color"] . ";\">" . number_format($MatosInGroup[$j]["TVA"] , 2, ',', ' ') . " %</td>
						<td class=\"listing_location_" . $CurrClass . "_droite\" style=\"width: 85px; color: #" . $MatosInGroup[$j]["Line_Color"] . ";\">" . number_format($MatosInGroup[$j]["Total_HT"] , 2, ',', ' ') . " &euro;</td>
						<td class=\"listing_location_" . $CurrClass . "_droite\" style=\"width: 85px; color: #" . $MatosInGroup[$j]["Line_Color"] . ";\">" . $MatosInGroup[$j]["Remise"] . " %</td>
					</tr>\n";
					
				$CurrLine++;
			}
		}
		$ListMatosStr .= "</table></div>\n";		
	}

	if ($Location["Alert_Saved"] == ""){
		$JS_Start = "StartPage()";
	} else {
		$tooltip_saved_content = "<div class='sauvegarde_location'>";
		$tooltip_saved_content .= "<div style='text-align: center; margin-top: 40px;'>";
		$tooltip_saved_content .= $lang["Add_Location"]["Sauvegarde_OK"];
		$tooltip_saved_content .= "</div>";
		$tooltip_saved_content .= "</div>";
		$tooltip_saved_content = addslashes($tooltip_saved_content);
		
		$JS_Start = "Confirm_Saved()";
	}
	
	//Etat des boutons selon création/edition
	if ($Location["Action"] == "Add"){
		$Etat_Bouton_Copier = "disabled";
		$Etat_Bouton_Modifier = "disabled";
		$Etat_Bouton_Supprimer = "disabled";
	} else {
		$Etat_Bouton_Copier = "";
		$Etat_Bouton_Modifier = "";
		$Etat_Bouton_Supprimer = "";
	}
	
	//Couleur de la fiche selon état modifiée ou pas
	if ($Location["Modifiee"] == 0){
		$Location["Couleur"] = "008000";
		$Location["Info_Modif"] = $lang["Add_Location"]["Non_Modifiee"];
	} else {
		$Location["Couleur"] = "FF0000";
		$Location["Info_Modif"] = $lang["Add_Location"]["Modifiee"];
	}
	
	//Fonction courante
	$Fonction["Nom"] = $lang["Add_Location"]["Fonction_Nom"];
	$_SESSION["Fonction"] = $Fonction;
	
	print "
	<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">
	
	<html>
	<head>
	<title>". $lang["Add_Location"]["Titre_Page"] ."</title>
	<script type=\"text/javascript\" src=\"js/planning.js\"></script>
	<script type=\"text/javascript\" src=\"js/overlib/overlib.js\"></script>
	<script type=\"text/javascript\" src=\"js/overlib/overlib_anchor.js\"></script>
	<style type=\"text/css\">@import url(js/jscalendar-1.0/calendar-orange.css);</style>
	<script type=\"text/javascript\" src=\"js/jscalendar-1.0/calendar.js\"></script>
	<script type=\"text/javascript\" src=\"js/jscalendar-1.0/lang/calendar-fr.js\"></script>
	<script type=\"text/javascript\" src=\"js/jscalendar-1.0/calendar-setup.js\"></script>
	<LINK REL=\"STYLESHEET\" TYPE=\"text/css\" HREF=\"planning.css\">
	</head>
	
	<body onload=\"" . $JS_Start . "\">
	<form action=\"" . $_SERVER["PHP_SELF"] . "\" method=\"post\" name=\"MainForm\">
	<div class=\"section_titre\" style=\"width: 99.5%;\">
		" . display_block_aide() . "
		". $lang["Add_Location"]["Informations_Generales"] ."
	</div>
	<div class=\"section_block_location\" style=\"width: 99.5%; height: 180px; padding-bottom: 5px;\">
		<div style=\"float: right; width: 430px;\" class=\"text\">
			<div style=\"float: left; width: 120px; height: 12px; margin: auto;\">
				<div style=\"padding-top: 5px;\">
					" . $lang["Add_Location"]["Remarques"] . "<br>
					<div id=\"Remarques\" class=\"champ_formulaire_location\" style=\"padding: 4px 6px 4px 6px;\">
						<textarea name=\"Remarques\" rows=\"10\" cols=\"75\" class=\"form_element\" onKeyDown=\"CheckEnterKey(event)\" onFocus=\"select(); ShowMessage('Remarques', 'inform', '" . addslashes($lang["Add_Location"]["Tooltip_Remarques"]) . "', 'DownLeft');\" onBlur=\"return nd();\">" . $Location["Remarques"] . "</textarea>
					</div>
				</div>
			</div>
		</div>
		
		<div style=\"width: 550px; height: 180px;\" class=\"text\">
			<div class=\"section_block_contenu_location\">
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Add_Location"]["Numero_Fiche"] ."</div>
				<div style=\"float: left;\">
					<div style=\"width: 430px; height: 16px;\">
						<div style=\"float: right; padding-top: 4px; color: #" . $Location["Couleur"] . ";\">
							" . $Location["Info_Modif"] . "
						</div>
						<div class=\"champ_total_donnee\" style=\"float: left; width: 70px;\">
							" . $Location["Fiche_ID"] . "." . $Location["Revision"] . "
						</div>
						<div style=\"float: left; padding-left: 10px; padding-top: 2px;\">
								<img src=\"" . $User["Image_Path"] . "/information_small.png\" style=\"width: 19px; cursor: pointer;\" alt=\"\" title=\"" . $lang["Add_Location"]["Bouton_Historique"] . "\" onClick=\"ViewRevisions()\">
						</div>
					</div>
				</div>
			</div>
			<div class=\"section_block_contenu_location\">
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Add_Location"]["Employe"] ."</div>
				<div style=\"float: left;\">
					<div class=\"champ_formulaire_location\" style=\"width: 430px; height: 16px; padding-top: 3px;\">
						<div id=\"Div_Employe\" style=\"float: left;\">
							<select name=\"Employe_ID\" class=\"select_zone\" onChange=\"SubmitDoc()\" onFocus=\"ShowMessage('Div_Employe', 'inform', '" . addslashes($lang["Add_Location"]["Tooltip_Employe"]) . "', 'Down');\" onBlur=\"return nd();\">
								<option value=\"0\" selected>". $lang["Add_Location"]["Choisissez"] ."</option>
								" . $CreateurStr . "
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class=\"section_block_contenu_location\">
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Add_Location"]["Client"] ."</div>
				<div style=\"float: left;\">
					<div class=\"champ_formulaire_location\" style=\"width: 430px; height: 18px;\">
						<div id=\"Div_Client\" style=\"float: left; padding-top: 2px;\">
							<select name=\"Client_ID\" class=\"select_zone\" onChange=\"SubmitDoc()\" onFocus=\"ShowMessage('Div_Client', 'inform', '" . addslashes($lang["Add_Location"]["Tooltip_Client"]) . "', 'Down');\" onBlur=\"return nd();\">
								<option value=\"0\" selected>". $lang["Add_Location"]["Choisissez"] ."</option>
								" . $ClientStr . "
							</select>
						</div>
						<div style=\"float: left; padding-left: 10px; padding-top: 1px;\">
							<img src=\"" . $User["Image_Path"] . "/icon_add.png\" style=\"width: 18px; cursor: pointer;\" alt=\"\" title=\"" . $lang["Add_Location"]["Bouton_Creer_Client"] . "\" onClick=\"CreateClient()\">
						</div>
					</div>
				</div>
			</div>
			<div class=\"section_block_contenu_location\">
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Add_Location"]["Reference"] ."</div>
				<div style=\"float: left;\">
					<div class=\"champ_formulaire_location\" style=\"width: 430px; height: 16px; padding-top: 2px;\">
						<div id=\"Div_Ref\" style=\"float: left;\">
							<input type=\"text\" name=\"Ref\" value=\"" . $Location["Ref"] . "\" size=\"50\" maxLength=\"50\" class=\"form_element\" autocomplete=\"off\" onKeyDown=\"CheckEnterKey(event)\" onFocus=\"select(); ShowMessage('Div_Ref', 'inform', '" . addslashes($lang["Add_Location"]["Tooltip_Ref"]) . "', 'Up');\" onBlur=\"return nd();\">
						</div>
					</div>
				</div>
			</div>
			<div class=\"section_block_contenu_location\">
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Add_Location"]["Statut"] ."</div>
				<div style=\"float: left;\">
					" . $StatutStr  . "
				</div>
			</div>
			<div class=\"section_block_contenu_location\">
				<div style=\"float: right;\">
					<div class=\"champ_formulaire_location\" style=\"width: 100px; margin-right: 10px; height: 14px; padding-top: 4px;\">
						" . $DureeStr . "
					</div>
				</div>
				<div class=\"champ_description_location\" style=\"float: right; width: 80px;\">". $lang["Add_Location"]["Duree"] ."</div>
				
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Add_Location"]["Debut"] ."</div>
				<div style=\"float: left;\">
					" . $DateDepStr . "
				</div>
			</div>
			<div class=\"section_block_contenu_location\">
				<div style=\"float: right;\">
					<div class=\"champ_formulaire_location\" style=\"width: 100px; margin-right: 10px; height: 16px; padding-top: 2px;\">
						<div id=\"Div_Caution\">
							<input type=\"text\" name=\"Caution\" value=\"" . number_format($Location["Caution"], 2, ',', '') . "\" size=\"10\" maxLength=\"30\" class=\"form_element\" style=\"text-align: right; padding-right: 5px;\" autocomplete=\"off\" onKeyDown=\"CheckEnterKey(event)\" onKeyUp=\"CheckCaution(event, this, '" . number_format($Location["Caution"], 2, ',', '') . "')\" onFocus=\"select(); ShowMessage('Div_Caution', 'inform', '" . addslashes($lang["Add_Location"]["Tooltip_Caution"]) . "', 'Up');\" onBlur=\"return nd();\"> &euro;
						</div>
					</div>
				</div>
				<div class=\"champ_description_location\" style=\"float: right; width: 80px;\">". $lang["Add_Location"]["Caution"] ."</div>
				
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Add_Location"]["Fin"] ."</div>
				<div style=\"float: left;\">
					" . $DateRetStr . "
				</div>
			</div>
		</div>
	</div>

	<div class=\"section_titre\" style=\"width: 99.5%; font-weight: normal;\">
		<b>". $lang["Add_Location"]["Titre_Section_References"] ."</b> ( " . $lang["Add_Location"]["Qte"] . " <b>" . $CurrMatosID . "</b> )
	</div>
	<div class=\"section_block\" style=\"width: 99.5%;\">
		<div style=\"width: 100%; text-align: left;\">
			<table border=\"0\" cellpadding=\"0\" cellspacing=\"2\" width=\"100%\" class=\"text\">
			<tr>
				<td class=\"listing_titre_centre\" style=\"width: 47px; text-align: left; padding-left: 3px;\">
					<img id=\"Groupes_Tous\" src=\"" . $User["Image_Path"] . "/list_close.png\" onClick=\"ToggleGroup('All')\" style=\"cursor: pointer;\" title=\"". $lang["Add_Location"]["Tooltip_Etendre_Tous"] ."\" alt=\"\">
				</td>
				<td class=\"listing_titre_gauche\">". $lang["Add_Location"]["Modele"] ."</td>
				<td class=\"listing_titre_gauche\" style=\"width: 140px;\">". $lang["Add_Location"]["Numero"] ."</td>
				<td class=\"listing_titre_centre\" style=\"width: 120px;\">". $lang["Add_Location"]["Colonne_Debut"] ."</td>
				<td class=\"listing_titre_centre\" style=\"width: 120px;\">". $lang["Add_Location"]["Colonne_Fin"] ."</td>
				<td class=\"listing_titre_centre\" style=\"width: 75px;\">". $lang["Add_Location"]["Colonne_Statut"] ."</td>
				<td class=\"listing_titre_centre\" style=\"width: 90px;\">". $lang["Add_Location"]["Colonne_PUHT"] ."</td>
				<td class=\"listing_titre_centre\" style=\"width: 60px;\">". $lang["Add_Location"]["Colonne_Qte"] ."</td>
				<td class=\"listing_titre_centre\" style=\"width: 60px;\">". $lang["Add_Location"]["Colonne_Duree"] ."</td>
				<td class=\"listing_titre_centre\" style=\"width: 90px;\">". $lang["Add_Location"]["Colonne_TVA"] ."</td>
				<td class=\"listing_titre_centre\" style=\"width: 90px;\">". $lang["Add_Location"]["Colonne_Total_HT"] ."</td>
				<td class=\"listing_titre_centre\" style=\"width: 90px;\">". $lang["Add_Location"]["Colonne_Remise"] ."</td>
			</tr>
			</table>
		</div>
		<div style=\"width: 100%; height: " . $Location["Canvas_Height_Materiels"] . "px; text-align: left; overflow: auto; margin-bottom: 5px;\">
			" . $ListMatosStr . "
		</div>
		<div style=\"width: 100%; text-align: center; height: 30px;\">
			<input type=\"button\" value=\"". $lang["Add_Location"]["Bouton_Ajouter"] ."\" onClick=\"AddMateriel()\" class=\"button\">
		</div>
	</div>

	<div style=\"width: 99.5%; height: 140px; margin-bottom: 5px;\">
		<div style=\"float: right; width: 660px; height: 125px; class=\"text\">
			<div class=\"section_titre\" style=\"width: 100%;\">
				". $lang["Add_Location"]["Titre_Section_Total"] ."
			</div>
			<div class=\"section_block\" style=\"width: 100%; height: 110px; padding-top: 3px;\">
				<div class=\"section_block_contenu_total\">
					<div class=\"champ_total_donnee\" style=\"margin-right: 5px;\">" . number_format($Location["Total_TTC"], 2, ',', ' ') . " &euro;</div>
					<div class=\"champ_total_description\">" . $lang["Add_Location"]["Total_TTC"] . "</div>
					<div class=\"champ_total_donnee\">" . number_format($Location["TVA_Montant"], 2, ',', ' ') . " &euro;</div>
					<div class=\"champ_total_description\">" . $lang["Add_Location"]["Montant_TVA"] . "</div>
					<div class=\"champ_total_donnee\">" . number_format($Location["Total_HT"], 2, ',', ' ') . " &euro;</div>
					<div class=\"champ_total_description\">" . $lang["Add_Location"]["Total_HT"] . "</div>
				</div>
				<div class=\"section_block_contenu_total\">
					<div class=\"champ_total_donnee\" style=\"margin-right: 5px;\">" . number_format($Location["Remise_Montant"], 2, ',', ' ') . " &euro;</div>
					<div class=\"champ_total_description\">" . $lang["Add_Location"]["Total_Remises"] . "</div>
				</div>
				<div class=\"section_block_contenu_total\">
					<div class=\"champ_total_donnee\" style=\"margin-right: 5px; padding-top: 1px; height: 19px;\">
						<div id=\"Div_Accompte\" style=\"float: right;\">
							<input type=\"text\" name=\"Accompte\" size=\"12\" maxLength=\"10\" class=\"text_zone\" value=\"" .  number_format($Location["Accompte"], 2, ',', '') . "\" style=\"text-align: right; padding-right: 5px;\" autocomplete=\"off\" onKeyDown=\"CheckAccompteOver(event, this, '" . number_format($Location["Accompte"], 2, ',', '') . "')\" onKeyUp=\"CheckAccompte(event, this, '" . number_format($Location["Accompte"], 2, ',', '') . "')\"  onFocus=\"select(); ShowMessage('Div_Accompte', 'inform', '" . addslashes($lang["Add_Location"]["Tooltip_Accompte"]) . "', 'UpLeft');\" onBlur=\"return nd();\"> &euro;
						</div>
					</div>
					<div class=\"champ_total_description\" style=\"padding-top: 4px;\">" . $lang["Add_Location"]["Accompte"] . "</div>
				</div>
				<div class=\"section_block_contenu_total\">
					<div class=\"champ_total_donnee\" style=\"margin-right: 5px;\">" . number_format($Location["A_Payer"], 2, ',', ' ') . " &euro;</div>
					<div class=\"champ_total_description\">" . $lang["Add_Location"]["A_Payer"] . "</div>
				</div>
			</div>
			&nbsp;
		</div>
		
		<div style=\"float: left; width: 430px; height: 125px;\" class=\"text\">
			<div class=\"section_titre\" style=\"width: 100%;\">
				". $lang["Add_Location"]["Titre_Section_TVA"] ."
			</div>
			<div class=\"section_block\" style=\"width: 100%; height: 110px;\">
				<div style=\"width: 100%; text-align: center;\">
					<table border=\"0\" cellpadding=\"0\" cellspacing=\"2\" width=\"95%\" class=\"text\">
					<tr>
						<td class=\"listing_titre_centre\" style=\"width: 45px;\">". $lang["Add_Location"]["Colonne_Numero_Ligne"] ."</td>
						<td class=\"listing_titre_centre\" style=\"width: 65px;\">". $lang["Add_Location"]["Colonne_Articles"] ."</td>
						<td class=\"listing_titre_centre\" style=\"width: 100px;\">". $lang["Add_Location"]["Colonne_Base"] ."</td>
						<td class=\"listing_titre_centre\" style=\"width: 85px;\">". $lang["Add_Location"]["Colonne_Taux"] ."</td>
						<td class=\"listing_titre_centre\">". $lang["Add_Location"]["Colonne_Montant"] ."</td>
					</tr>
					</table>
				</div>
				<div style=\"width: 100%; text-align: center; height: 90px; overflow: auto;\">
					<table border=\"0\" cellpadding=\"0\" cellspacing=\"2\" width=\"95%\" class=\"text\">
					" . $TVAStr . "
					</table>
				</div>
			</div>
		</div>
	</div>	
		
	<div class=\"section_titre\" style=\"width: 99.5%; height: 21px;\">
		<div class=\"colonne_action\" style=\"width: 17%;\">
			<input type=\"button\" class=\"button\" value=\"" . $lang["Add_Location"]["Bouton_Sauver"] . "\" onClick=\"" . $JS["Locations_Sauver_Fiche"] . "\">
		</div>
		<div class=\"colonne_action\" style=\"width: 17%;\">
			<input type=\"button\" class=\"button\" value=\"" . $lang["Add_Location"]["Bouton_Dupliquer"] . "\" onClick=\"Duplicate()\" " . $Etat_Bouton_Copier . ">
		</div>
		<div class=\"colonne_action\" style=\"width: 17%;\">
			<input type=\"button\" class=\"button\" value=\"" . $lang["Add_Location"]["Bouton_Modifier"] . "\" onClick=\"ModifParam()\" " . $Etat_Bouton_Modifier . ">
		</div>
		<div class=\"colonne_action\" style=\"width: 16%;\">
			<input type=\"button\" class=\"button\" value=\"" . $lang["Add_Location"]["Bouton_Imprimer"] . "\" onClick=\"PrintFiche()\">
		</div>
		<div class=\"colonne_action\" style=\"width: 17%;\">
			<input type=\"button\" class=\"button\" value=\"" . $lang["Add_Location"]["Bouton_Supprimer"] . "\" onClick=\"" . $JS["Locations_Supprimer_Fiche"] . "()\" " . $Etat_Bouton_Supprimer . ">
		</div>
		<div class=\"colonne_action\" style=\"width: 16%;\">
			<input type=\"button\" class=\"button\" value=\"" . $lang["Add_Location"]["Bouton_Fermer"] . "\" onClick=\"CloseFiche()\">
		</div>
	</div>
	<input type=\"hidden\" name=\"PHPSESSID\" value=\"" . session_id() . "\">
	<input type=\"hidden\" name=\"op\" value=\"do_add_location\">
	<input type=\"hidden\" name=\"Save\" value=\"0\">
	</form>
	
	</body>
	</html>

	<script language=\"JavaScript\">
	var Hauteur_Groupes = [];
	var Groupes_Tous = 'visible';
	var Original_DateDep = document.MainForm.Date_Depart.value;
	var Original_DateRet = document.MainForm.Date_Retour.value;
	
	function AddMateriel(){
		if (Check_Dates() == true){
			window.open('locations_materiels.php?PHPSESSID=" . session_id() . "&op=add_materiel_init', 'Ajouter_Materiel', 'scrollbars=no,status=no')
		}
	}

	function Check_Dates(){
		var DateDep = document.MainForm.Date_Depart.value;
		var DateRet = document.MainForm.Date_Retour.value;
		if ('" . $Location["Action"] . "' == 'Add'){
			var HeureDep = document.MainForm.Heure_Depart.options[document.MainForm.Heure_Depart.selectedIndex].value;
			var HeureRet = document.MainForm.Heure_Retour.options[document.MainForm.Heure_Retour.selectedIndex].value;
		} else {
			var HeureDep = document.MainForm.Heure_Depart.value;
			var HeureRet = document.MainForm.Heure_Retour.value;
		}
		if (DateDep == '' || DateRet == '' || HeureDep == '' || HeureRet == '') {
			//Données manquantes, pas de calcul
			ShowMessage('DateDep', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Dates_Manquantes"]) . "', 'Up');
			//alert(\"" . $lang["Add_Location"]["Tooltip_Erreur_Dates_Manquantes"] . "\");
			return false;
		} else {
			var Debut = DateDep + ' ' + HeureDep;
			var Fin = DateRet + ' ' + HeureRet;
			//alert(Debut + ' - ' + Fin);
			var D = /^(\d\d)\/(\d\d)\/(\d{4})\ (\d\d)\:(\d\d)$/.test(Debut);
			if (D) with (RegExp){
				var DtDateDebut = new Date($3, $2-1, $1 , $4, $5);
				var ValDateDebut = Date.parse(DtDateDebut);
			} else {
				//alert(\"La Date de début de la Location doit être au format JJ/MM/AAAA !\");
				return false;
			}
			var F = /^(\d\d)\/(\d\d)\/(\d{4})\ (\d\d)\:(\d\d)$/.test(Fin);
			if (F) with (RegExp){
				var DtDateFin = new Date($3, $2-1, $1 , $4, $5);
				var ValDateFin = Date.parse(DtDateFin);
			} else {
				//alert(\"La Date de fin de la Location doit être au format JJ/MM/AAAA !\");
				return false;
			}
			//alert(ValDateDebut + ' - ' + ValDateFin);
			if(ValDateFin.valueOf() < ValDateDebut.valueOf() + 360000) {
				ShowMessage('DateDep', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Dates"]) . "', 'Up');
				return false;
			} else {
				return true;
			}
		}
	}
	
	function CheckAccompte(event, textbox, original_value){
		if (CheckInteger(event, textbox, original_value) == false){
			ShowMessage('Div_Accompte', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Touche"]) . "', 'UpLeft');
		}
	}

	function CheckAccompteOver(event, textbox, original_value){
		var keyCode = (event) ? event.keyCode : keyStroke.which;
		CurrAccompte = document.MainForm.Accompte.value.replace(/,/, '.');
		floatAccompte = parseFloat(CurrAccompte);
		
		//Si moins de 10 caractères, pas de controle
		if (event.keyCode == 13){
			if (floatAccompte > " . ($Location["Total_TTC"]-$Location["Remise_Montant"]) . "){
				ShowMessage('Div_Accompte', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Accompte_Over"]) . "', 'UpLeft');
				return false;
			} else {
				SubmitDoc();
			}
		}
	}

	function CheckEnterKey(event, textbox){
		var keyCode = (event) ? event.keyCode : keyStroke.which;
		
		if (event.keyCode == 13){
			SubmitDoc();
		}
	}
	
	function CheckInteger(event, textbox, original_value){
		var keyCode = (event) ? event.keyCode : keyStroke.which;
		
		nd();
			
		//Tester contenu Qte
		Broken = false;
		for (var i = 0; i < textbox.value.length; i++){
			CurrChar = textbox.value.substring(i,i+1);
			if (isNaN(CurrChar)) {
				if (CurrChar != '.'){
					if (CurrChar != ','){
						NewVal = textbox.value.substring(0,i);
						Broken = true;
					}
				}
			}
		}
		if (Broken == true && textbox.value.length > 1){
			textbox.value = NewVal;
			return false;
		} else if (Broken == true && textbox.value.length == 1) {
			textbox.value = original_value;
			textbox.select();
			return false;
		} else {
			return true;
		}
	}
	
	function CheckCaution(event, textbox, original_value){
		if (CheckInteger(event, textbox, original_value) == false){
			ShowMessage('Div_Caution', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Touche"]) . "', 'Up');
		}
	}

	function CheckTime(Field){
		if (Check_Dates()){
			document.MainForm.submit();
		} else {
			if (Field == 'HeureDep'){
				document.MainForm.Heure_Depart.selectedIndex = Original_HeureDep;
				nd();
				ShowMessage('Div_HeureDep', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Touche"]) . "', 'Down');
			} else {
				document.MainForm.Heure_Retour.selectedIndex = Original_HeureRet;
				nd();
				ShowMessage('Div_HeureRet', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Touche"]) . "', 'Down');
			}
		}
	}

	function CloseFiche(){
		if (\"" . $Location["Modifiee"] . "\" == '0'){
			opener.location.href = '" . $Location["Opener"] . "?PHPSESSID=" . session_id() . "&op=" . $Location["Opener_Action"] . "';
			self.close();
		} else if (\"" . $Location["Saved"] . "\" == '1'){
			opener.location.href = '" . $Location["Opener"] . "?PHPSESSID=" . session_id() . "&op=" . $Location["Opener_Action"] . "';
			self.close();
		} else if (\"" . $Location["Action"] . "\" == \"Edit\") {
			if (confirm(\"" . $lang["Add_Location"]["Tooltip_Sauvegarde"] . "\")){
				//Fiche déja sauvée. Fermer
				opener.location.href = '" . $Location["Opener"] . "?PHPSESSID=" . session_id() . "&op=" . $Location["Opener_Action"] . "';
				self.close();
			}
		} else if (\"" . $Location["Action"] . "\" == \"Add\") {
			if (confirm(\"" . $lang["Add_Location"]["Tooltip_Confirmation_Annulation_Fiche"] . "\")){
				//Fiche déja sauvée. Fermer
				self.location.href = \"" . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=delete_location&Action=cancel\";
			}
		}
	}

	function Confirm_Saved(){
		ResizeWindow();
		SaveGroupHeights();
		Timer = setTimeout('MessageConfirmation()',250)
	}
	
	function CreateClient(){
		window.open('clients.php?PHPSESSID=" . session_id() . "&op=add_client_init&Opener=Location', 'Ajouter_Materiel', 'scrollbars=no,status=no');
	}
	
	function DelLocation(){
		if (confirm(\"" . $lang["Add_Location"]["Tooltip_Confirmation_Supression_Fiche"] . $Location["Fiche_ID"] . " ?\")){
			if ('" . $Client_Info["Security_Pass_Needed"] . "' >= '1'){
				neo = window.open(\"" . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=password_init&Destination_Page=" .$_SERVER["PHP_SELF"] . "&Destination_Action=delete_location\", 'Supprimer_Fiche', 'scrollbars=no,status=no');
				if(neo.window.focus){neo.window.focus();}
			} else {
				neo = window.open(\"" . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=delete_location\", 'Supprimer_Fiche', 'scrollbars=no,status=no');
			}
		}
	}

	function DeleteMateriel(Record_ID, Materiel){
		if (confirm(\"" . $lang["Add_Location"]["Tooltip_Confirmation_Supression_Materiel_1"] . "\" + Materiel + \"" . $lang["Add_Location"]["Tooltip_Confirmation_Supression_Materiel_2"] . $Location["Fiche_ID"] . "\")){
			if ('" . $Client_Info["Security_Pass_Needed"] . "' >= '2'){
				neo = window.open(\"" . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=password_init&Destination_Page=" .$_SERVER["PHP_SELF"] . "&Destination_Action=delete_materiel&Record_ID=\" + Record_ID, 'Supprimer_Fiche', 'scrollbars=no,status=no');
				if(neo.window.focus){neo.window.focus();}
			} else {
				neo = window.open(\"" . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=delete_materiel&Record_ID=\" + Record_ID, 'Supprimer_Materiel', 'scrollbars=no,status=no');
				if(neo.window.focus){neo.window.focus();}
			}
		}
	}

	function Duplicate(){
		if (confirm(\"" . $lang["Add_Location"]["Tooltip_Confirmer_Copie"] . "\")){
			self.location.href='" . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=duplication_init&Fiche_ID=" . $Location["Fiche_ID"] . "';
		}
	}
	
	function EditMateriel(Record_ID){
		neo = window.open('locations_materiels.php?PHPSESSID=" . session_id() . "&op=edit_materiel_init&Record_ID=' + Record_ID, 'Modifier_Materiel', 'scrollbars=no,status=no');
		if(neo.window.focus){neo.window.focus();}
		return nd();	
	}

	function MessageConfirmation(){
		clearTimeout(Timer)
		CurrX = (" . $User["Util_ResX"] . " - 420) / 2;
		CurrY = (" . $User["Util_ResY"] . " - 100) / 2;
		return overlib('" . $tooltip_saved_content . "', STICKY, FIXX, CurrX, FIXY, CurrY, WIDTH, 500, HEIGHT, 100, FGCOLOR, '#EBEAEF', CAPCOLOR, '#000000', BGCOLOR, '#000000', TIMEOUT, 2000);
	}
	
	function ModifParam(){
		//Ouvrir fenêtre modifcation
		window.open('" . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=modif_param_init', 'Modifier_Parametres', 'scrollbars=no,status=no')
	}

	function NoRights(){
		alert(\"" . $lang["Add_Location"]["Tooltip_Erreur_Droits"] . "\");
	}

	function PrintFiche(){
		//Ouvrir fenêtre dupli
		window.open('locations.php?PHPSESSID=" . session_id() . "&op=print_location&Fiche_ID=" . $Location["Fiche_ID"] . "', 'Imprimer_Fiche', 'scrollbars=no,status=no')
	}

	function ResizeWindow(){
		self.moveTo(0,0);
		Width = '" . $User["Util_ResX"] . "';
		Height = '" . $User["Util_ResY"] . "';
		window.resizeTo(Width,Height);		
	}
	
	function SaveGroupHeights(){
		for (i=0;i<" . $Groupes["Max_Materiels"] . ";i++){
			if (i < 10){
				Groupe = 'Groupe_0' + i;
			} else {
				Groupe = 'Groupe_' + i;
			}
			Hauteur_Groupes[i] = document.getElementById(Groupe).offsetHeight;
			//alert(Hauteur_Groupes[i]);
		}
	}
	
	function SaveLocation(){
		CurrClient = document.MainForm.Client_ID.options[document.MainForm.Client_ID.selectedIndex].value;
		CurrCreateur = document.MainForm.Employe_ID.options[document.MainForm.Employe_ID.selectedIndex].value;
		
		CurrCaution = document.MainForm.Caution.value.replace(/,/, '.');
		floatCaution = parseFloat(CurrCaution);
		
		CurrAccompte = document.MainForm.Accompte.value.replace(/,/, '.');
		floatAccompte = parseFloat(CurrAccompte);
		
		if (CurrCreateur == '0'){
			ShowMessage('Div_Employe', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Employe"]) . "', 'Down');
			return false;
		} else if (CurrClient == '0') {
			ShowMessage('Div_Client', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Client"]) . "', 'Down');
			return false;
		} else if (isNaN(floatCaution)){
			document.MainForm.Caution.value = '" . number_format($Location["Caution"], 2, ',', '') . "';
			document.MainForm.Caution.select();
			nd();
			ShowMessage('Div_Caution', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Caution_NaN"]) . "', 'Up');
			return false;
		} else if (floatCaution < 0){
			document.MainForm.Caution.value = '" . number_format($Location["Caution"], 2, ',', '') . "';
			document.MainForm.Caution.select();
			nd();
			ShowMessage('Div_PUHT', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Caution_Subzero"]) . "', 'Up');
			return false;
		} else if (isNaN(floatAccompte)){
			document.MainForm.Accompte.value = '" . number_format($Location["Accompte"], 2, ',', '') . "';
			document.MainForm.Accompte.select();
			nd();
			ShowMessage('Div_Accompte', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Accompte_NaN"]) . "', 'UpLeft');
			return false;
		} else if (floatAccompte < 0){
			document.MainForm.Accompte.value = '" . number_format($Location["Accompte"], 2, ',', '') . "';
			document.MainForm.Accompte.select();
			nd();
			ShowMessage('Div_Accompte', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Accompte_Subzero"]) . "', 'UpLeft');
			return false;
		} else if (floatAccompte > " . $Location["Total_TTC"] . "){
			document.MainForm.Accompte.value = '" . number_format($Location["Accompte"], 2, ',', '') . "';
			document.MainForm.Accompte.select();
			nd();
			ShowMessage('Div_Accompte', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Accompte_Over"]) . "', 'UpLeft');
			return false;
		} else if (Check_Dates() == false){
			document.MainForm.Date_Depart.value = '" . $Location["Date_Depart_FR"] . "';
			ShowMessage('DateDep', 'alert', '" . addslashes($lang["Add_Location"]["Tooltip_Erreur_Dates"]) . "', 'Down');
			return false;
		} else {
			document.MainForm.Save.value = '1';
			SubmitDoc();
		}
	}
	
	function SetDate(Type){
		if (Check_Dates()){
			if (Type == 'Debut'){
				CurrDate = document.MainForm.Date_Depart.value;
				CurrHeure = document.MainForm.Heure_Depart.options[document.MainForm.Heure_Depart.selectedIndex].value;
			} else {
				CurrDate = document.MainForm.Date_Retour.value;
				CurrHeure = document.MainForm.Heure_Retour.options[document.MainForm.Heure_Retour.selectedIndex].value;
			}
			self.location.href='" . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=set_date&Type='+Type+'&Date='+CurrDate+'&Heure='+CurrHeure;
		} else {
			if (Type == 'Debut'){
				document.MainForm.Date_Depart.value = Original_DateDep;
				document.MainForm.Heure_Depart.selectedIndex = Original_HeureDep;
			} else {
				document.MainForm.Date_Retour.value = Original_DateRet;
				document.MainForm.Heure_Retour.selectedIndex = Original_HeureRet;
			}
		}
	}
	
	function ShowPopup(Content){
		return overlib(Content, WIDTH, 125, HAUTO, VAUTO, FGCOLOR, '#FFD616', BGCOLOR, '#000000');
	}
	
	function SubmitDoc(){
		document.MainForm.submit();
	}
	
	function StartForm(){
		clearTimeout(Timer)
		for (i=0;i<document.MainForm.elements.length;i++){
			//alert(document.MainForm.elements[i].type);
			if (document.MainForm.elements[i].type == 'text'){
				if (document.MainForm.elements[i].value == '' || document.MainForm.elements[i].value == '0' || document.MainForm.elements[i].value == '0,00'){
					document.MainForm.elements[i].focus();
					break;
				}
			} else if (document.MainForm.elements[i].type == 'select-one') {
				if (document.MainForm.elements[i].selectedIndex == 0){
					document.MainForm.elements[i].focus();
					break;
				}
			}
		}
	}
	
	function StartPage(){
		ResizeWindow();
		SaveGroupHeights();
		Timer = setTimeout('StartForm()',250);
	}
	
	function TestAccountLocked(){
		alert(\"" . $lang["Add_Location"]["Test_Account_Locked"] . "\");
	}
	
	function ToggleGroup(Numero){
		if (Numero != 'All'){
			Groupe = 'Groupe_' + Numero;
			Icone = 'Groupe_Img_' + Numero;
			
			//alert(document.getElementById('Groupe_00').style.visibility);
			if (document.getElementById(Groupe).style.visibility == 'visible'){
				document.getElementById(Groupe).style.visibility = 'hidden';
				document.getElementById(Groupe).style.height = '0px';
				document.getElementById(Icone).src = '" . $User["Image_Path"] . "/list_open.png';
			} else {
				floatNumero = parseFloat(Numero);
				document.getElementById(Groupe).style.visibility = 'visible';
				document.getElementById(Groupe).style.height = Hauteur_Groupes[floatNumero] + 'px';
				document.getElementById(Icone).src = '" . $User["Image_Path"] . "/list_close.png';
			}
		} else {
			if (Groupes_Tous == 'visible'){
				State = 'hidden';
				Src = 'list_open.png';
				document.getElementById('Groupes_Tous').src = '" . $User["Image_Path"] . "/list_open.png';
				Groupes_Tous = 'hidden';
			} else {
				State = 'visible';
				Src = 'list_close.png';
				document.getElementById('Groupes_Tous').src = '" . $User["Image_Path"] . "/list_close.png';
				Groupes_Tous = 'visible';
			}
			
			for (i=0;i<" . $Groupes["Max_Materiels"] . ";i++){
				if (i < 10){
					Groupe = 'Groupe_0' + i;
					Icone = 'Groupe_Img_0' + i;
				} else {
					Groupe = 'Groupe_' + i;
					Icone = 'Groupe_Img_' + i;
				}
				
				document.getElementById(Groupe).style.visibility = State;
				document.getElementById(Icone).src = '" . $User["Image_Path"] . "/' + Src;
				if (State == 'hidden'){
					document.getElementById(Groupe).style.height = '0px';
				} else {
					document.getElementById(Groupe).style.height = Hauteur_Groupes[i] + 'px';
				}
			}
			
		}
	}
	
	function ViewRevisions(){
		window.open('locations.php?PHPSESSID=" . session_id() . "&op=view_revisions&Fiche_ID=" . $Location["Fiche_ID"] . "', 'Voir_Revisions', 'scrollbars=no,status=no')
	}
	</script>";

	$Location["Alert_Saved"] = "";
	$Location["Saved"] = 0;
	
	$_SESSION["Location"] = $Location;
}

//////////////////////////////////////////////////////////////////////////////////
///	 Fonctions de calcul de la Date de fin après saisie d'une durée en jours dans la liste	///
//////////////////////////////////////////////////////////////////////////////////
function calcule_date_fin($Jour){
	global $db;
	
	$Location = $_SESSION["Location"];

	$Date_Start = strtotime($Location["Date_Depart_EN"] . " " . $Location["Heure_Depart"]. " GMT");
	$Duree = $Jour*3600*24;
	$Date_End = $Date_Start + $Duree;
	$Location["Date_Retour_FR"] = date("d/m/Y",$Date_End);
	$Location["Duree"] = $Jour;
	$_SESSION["Location"] = $Location;
	
	add_location();
}

///////////////////////////////////////////////////////////
///    		  Fonction calcul total location			///
///////////////////////////////////////////////////////////
function calcule_total($Redirect="Add"){
	global $db;
	
	$Location = $_SESSION["Location"];
	$TVA_List = $_SESSION["TVA_List"];
	
	select_version_db();
	
	//RAZ Variables
	$ListRef["Max"] = 0;
	$Location["Total_HT"] = 0;
	$Location["TVA_Montant"] = 0;
	$Location["Total_TTC"] = 0;
	$Location["Remise_Montant"] = 0;
	$Location["A_Payer"] = 0;
	
	//RAZ Montants tva
	for ($i=0;$i<$TVA_List["Max"];$i++){
		$TVA_List[$i]["Articles"] = 0;
		$TVA_List[$i]["Base"] = 0;
		$TVA_List[$i]["Montant"] = 0;
	}
	
	//Recalculer total Matériels
	$Prix_Ligne = 0;
	$Total_Ligne = 0;
	$Remise_Ligne = 0;
	$Location["Total_Materiel"] = 0;
	$Filtre = "
		select
			PU, Locations_Materiels.PU_Type, Duree, Qte, Remise, TVA, Inventaire.Statut
		from
			Locations_Materiels, Inventaire
		where
			Locations_Materiels.Materiel_ID = Inventaire.ID and Fiche_ID = '" . $Location["Fiche_ID"] . "'
		order by
			Locations_Materiels.ID asc";
	//print $Filtre . "<br />";
	mysql_query("SET NAMES 'utf8'");
	$sql = mysql_query($Filtre, $db);
	while ($row = mysql_fetch_array($sql)){
		if ($row["PU_Type"] == "HT"){
			$ListRef[$ListRef["Max"]]["PUHT"] = $row["PU"];
			$ListRef[$ListRef["Max"]]["TVA_Montant_Unitaire"] = round($ListRef[$ListRef["Max"]]["PUHT"] * $row["TVA"] / 100,2);
			$ListRef[$ListRef["Max"]]["PUTTC"] = round($ListRef[$ListRef["Max"]]["PUHT"] + $ListRef[$ListRef["Max"]]["TVA_Montant_Unitaire"],2);
			$ListRef[$ListRef["Max"]]["Total_HT"] = round($ListRef[$ListRef["Max"]]["PUHT"] * $row["Duree"] * $row["Qte"],2);
			$ListRef[$ListRef["Max"]]["TVA_Montant"] = round($ListRef[$ListRef["Max"]]["Total_HT"] * $row["TVA"] / 100,2);
			$ListRef[$ListRef["Max"]]["Total_TTC"] = round($ListRef[$ListRef["Max"]]["Total_HT"] + $ListRef[$ListRef["Max"]]["TVA_Montant"],2);	
		} else {
			$ListRef[$ListRef["Max"]]["PUTTC"] = $row["PU"];
			$ListRef[$ListRef["Max"]]["PUHT"] = round($ListRef[$ListRef["Max"]]["PUTTC"] / (1 + $row["TVA"] / 100),2);
			$ListRef[$ListRef["Max"]]["TVA_Montant_Unitaire"] = round($ListRef[$ListRef["Max"]]["PUTTC"] - $ListRef[$ListRef["Max"]]["PUHT"],2);
			$ListRef[$ListRef["Max"]]["Total_TTC"] = round($ListRef[$ListRef["Max"]]["PUTTC"] * $row["Duree"] * $row["Qte"],2);
			$ListRef[$ListRef["Max"]]["Total_HT"] = round($ListRef[$ListRef["Max"]]["Total_TTC"] / (1 + ($row["TVA"] / 100)),2);
			$ListRef[$ListRef["Max"]]["TVA_Montant"] = round($ListRef[$ListRef["Max"]]["Total_TTC"] - $ListRef[$ListRef["Max"]]["Total_HT"],2);
		}
		$ListRef[$ListRef["Max"]]["Remise_Montant"] = round($ListRef[$ListRef["Max"]]["Total_TTC"] * $row["Remise"] / 100,2);
		
		$Location["Total_HT"] += $ListRef[$ListRef["Max"]]["Total_HT"];
		$Location["TVA_Montant"] += $ListRef[$ListRef["Max"]]["TVA_Montant"];
		$Location["Total_TTC"] += $ListRef[$ListRef["Max"]]["Total_TTC"];
		$Location["Remise_Montant"] += $ListRef[$ListRef["Max"]]["Remise_Montant"];
		
		//Reporter informations dans liste TVA
		for ($i=0;$i<$TVA_List["Max"];$i++){
			if ($TVA_List[$i]["Taux"] == $row["TVA"]){
				$TVA_List[$i]["Articles"]++;
				$TVA_List[$i]["Base"]+= $ListRef[$ListRef["Max"]]["Total_HT"];
				$TVA_List[$i]["Montant"]+= $ListRef[$ListRef["Max"]]["TVA_Montant"];
				break;
			}
		}
			
		$ListRef["Max"]++;
	}
	
	$Location["A_Payer"] = $Location["Total_TTC"] - $Location["Remise_Montant"] - $Location["Accompte"];
	/*print "Total_TTC : " . $Location["Total_TTC"]; 
	print "Accompte : " . $Location["Accompte"]; 
	print "A payer : " . $Location["A_Payer"];*/
	
	$_SESSION["Location"] = $Location;
	$_SESSION["TVA_List"] = $TVA_List;
	
	//print $Redirect;
	if ($Redirect == "Add"){
		header("Location: locations.php?PHPSESSID=" . session_id() . "&op=add_location");
	}
}

///////////////////////////////////////////////////////////
///	           Fonction supression Proforma annulée			///
///////////////////////////////////////////////////////////
function delete_location($Action=""){
	global $db, $lang;
	
	$Location = $_SESSION["Location"];

	$Filtre = "delete from Locations_Materiels where Fiche_ID = '" . $Location["Fiche_ID"] . "'";
	//print $Filtre;
	$sql = mysql_query($Filtre, $db);
	
	$Filtre = "delete from Locations where Fiche_ID = '" . $Location["Fiche_ID"] . "'";
	//print $Filtre;
	$sql = mysql_query($Filtre, $db);
	
	$Filtre = "delete from Revisions where Fiche_ID = '" . $Location["Fiche_ID"] . "' and Type_Fiche = 'Location'";
	//print $Filtre;
	$sql = mysql_query($Filtre, $db);
	
	
	
	if ($Action == "cancel"){	
		$Information["Message"] = $lang["Do_Add_Location"]["Annulation_OK"];
		$Information["Action"] = "Close_Self";
	} else {
		$Information["Message"] = $lang["Do_Add_Location"]["Supression_OK"];
		$Information["Action"] = "Close_All";
	}
	$Information["Action"] = "Close_Self";
	$Information["Destination_Page"] = "";
	$Information["Destination_Action"] = "";
	$Information["Opener_Page"] = "planning.php";
	$Information["Opener_Action"] = "display_multiple";
	$_SESSION["Information"] = $Information;

	inform_client();
}

///////////////////////////////////////////////////////////
///                     Fonction supression Materiel			///
///////////////////////////////////////////////////////////
function delete_materiel($Record_ID){
	global $db, $lang;
	
	$Location = $_SESSION["Location"];
	$Groupes = $_SESSION["Groupes"];
	
	//Rapatrier infos nécessaires à l'historique
	$Filtre = "select Statut, Designation, Modele, Num_Interne from Inventaire, Locations_Materiels where Inventaire.ID=Locations_Materiels.Materiel_ID and Locations_Materiels.ID = '" . $Record_ID . "'";
	//print $Filtre;
	mysql_query("SET NAMES 'utf8'");
	$sql = mysql_query($Filtre, $db);
	$row = mysql_fetch_array($sql);
	//exit;
	
	//Supprimer de la DB
	$Filtre = "delete from Locations_Materiels where ID = " . $Record_ID;
	//print $Filtre;
	$sql = mysql_query($Filtre, $db);
	
	if ($row["Statut"] == 0){
		$Location["Historique"] .= $lang["Delete_Materiel"]["Historique_A_Supprime"] . stripslashes($row["Designation"]) . " " . stripslashes($row["Modele"]) . " N° "  . stripslashes($Num_Interne) . $lang["Delete_Materiel"]["Historique_De_La_Fiche"];
	} else {
		$Location["Historique"] .= $lang["Delete_Materiel"]["Historique_A_Supprime"] . stripslashes($row["Designation"]) . " " . stripslashes($row["Modele"]) . $lang["Delete_Materiel"]["Historique_De_La_Fiche"];
	}
	$Location["Modifiee"] = 1;
	$_SESSION["Location"] = $Location;	
	
	//Gestion des groupes
	$FoundGroup = -1;
	for ($i=0;$i<$Groupes["Max_Materiels"];$i++){
		if (stripslashes($row["Designation"]) == $Groupes["Materiels"][$i]["Nom"]){
			//Matériel appartenant à un groupe... Sauver info
			$Groupes["Materiels"][$i]["Max"] -= 1;
			
			//Si groupe vide, supprimer
			if ($Groupes["Materiels"][$i]["Max"] <= 0){
				for ($j=$i+1;$j<$Groupes["Max_Materiels"];$j++){
					$Groupes["Materiels"][$j-1]["Statut"] = $Groupes["Materiels"][$j]["Statut"];
					$Groupes["Materiels"][$j-1]["Image"] = $Groupes["Materiels"][$j]["Image"];
					$Groupes["Materiels"][$j-1]["Nom"] = $Groupes["Materiels"][$j]["Nom"];
					$Groupes["Materiels"][$j-1]["Max"] = $Groupes["Materiels"][$j]["Max"];
				}
				$Groupes["Max_Materiels"]--;
			}
			break;
		}
	}
	
	$_SESSION["Groupes"] = $Groupes;		
	
	$Information["Action"] = "Close_Self";
	$Information["Destination_Page"] = "";
	$Information["Destination_Action"] = "";
	$Information["Opener_Page"] = $_SERVER["PHP_SELF"];
	$Information["Opener_Action"] = "calcule_total";
	$Information["Message"] = $lang["Delete_Materiel"]["Supression_OK"];
	
	$_SESSION["Information"] = $Information;
	
	inform_client();
}

///////////////////////////////////////////////////////////
///	  Fonction enregistrement données Location en session	///
///////////////////////////////////////////////////////////
function do_add_location($Employe_ID, $Client_ID, $Statut_ID, $Ref, $Date_Depart, $Heure_Depart, $Date_Retour, $Heure_Retour, $Duree, $Remarques, $TVA, $Caution, $Accompte, $Save=0){
	global $lang;
	
	$Location = $_SESSION["Location"];

	//Mises à jour dans la page ?
	if ($Location["Saved"] == 0){
		if ($Statut_ID != $Location["Statut_ID"]){
			$Location["Modifiee"] = 1;
			$Location["Historique"] .= $lang["Do_Add_Location"]["Historique_Statut"];
		}
		if ($Client_ID != $Location["Client_ID"]){
			$Location["Modifiee"] = 1;
			$Location["Historique"] .= $lang["Do_Add_Location"]["Historique_Client"];
		}
		if ($Date_Depart != $Location["Date_Depart_FR"]){
			$Location["Modifiee"] = 1;
			$Location["Historique"] .= $lang["Do_Add_Location"]["Historique_Date_Debut"];
		}
		if ($Heure_Depart != $Location["Heure_Depart"]){
			$Location["Modifiee"] = 1;
			$Location["Historique"] .= $lang["Do_Add_Location"]["Historique_Heure_Debut"];
		}
		if ($Date_Retour != $Location["Date_Retour_FR"]){
			$Location["Modifiee"] = 1;
			$Location["Historique"] .= $lang["Do_Add_Location"]["Historique_Date_Fin"];
		}
		if ($Heure_Retour != $Location["Heure_Retour"]){
			$Location["Modifiee"] = 1;
			$Location["Historique"] .= $lang["Do_Add_Location"]["Historique_Heure_Fin"];
		}
		if ($Ref != $Location["Ref"]){
			$Location["Modifiee"] = 1;
			$Location["Historique"] .= $lang["Do_Add_Location"]["Historique_Reference"];
		}
		if ($Remarques != $Location["Remarques"]){
			$Location["Modifiee"] = 1;
			$Location["Historique"] .= $lang["Do_Add_Location"]["Historique_Remarques"];
		}
		
		if (floatval($Duree) != floatval($Location["Duree"])){
			//print "Caution recue : '" .floatval($Caution) . "' - caution session : '" . floatval($Location["Caution"]). "'<br>";
			$Location["Modifiee"] = 1;
			$Location["Historique"] .= $lang["Do_Add_Location"]["Historique_Duree"];
		}
		if (floatval($Caution) != floatval($Location["Caution"])){
			//print "Caution recue : '" .floatval($Caution) . "' - caution session : '" . floatval($Location["Caution"]). "'<br>";
			$Location["Modifiee"] = 1;
			$Location["Historique"] .= $lang["Do_Add_Location"]["Historique_Caution"];
		}
		if (floatval($Accompte) != floatval($Location["Accompte"])){
			//print "Accompte recue : '" .floatval($Accompte) . "' - Accompte session : '" . floatval($Location["Accompte"]). "'<br>";
			$Location["Modifiee"] = 1;
			$Location["Historique"] .= $lang["Do_Add_Location"]["Historique_Accompte"];
		}
	}

	$Location["Saved"] = 0;
	$Location["Employe_ID"] = $Employe_ID;
	$Location["Client_ID"] = $Client_ID;
	$Location["Statut_ID"] = $Statut_ID;
	$Location["Ref"] = stripslashes($Ref);
	
	//$Location["Duree"] = $Duree;
	$Location["Remarques"] = stripslashes($Remarques);
	//$Location["Assurance"] = str_replace(",", ".", $Assurance);
	$Location["TVA"] = str_replace(",", ".", $TVA);
	$Location["Caution"] = str_replace(",", ".", $Caution);
	$Location["Accompte"] = str_replace(",", ".", $Accompte);
	
	$Location["Date_Depart_FR"] = $Date_Depart;
	$Location["Heure_Depart"] = $Heure_Depart;
	$Location["Date_Retour_FR"] = $Date_Retour;
	$Location["Heure_Retour"] = $Heure_Retour;
	$Location["Date_Depart_EN"] = substr($Date_Depart,6,4) . "-" . substr($Date_Depart,3,2) . "-" . substr($Date_Depart,0,2);
	$Location["Date_Retour_EN"] = substr($Date_Retour,6,4) . "-" . substr($Date_Retour,3,2) . "-" . substr($Date_Retour,0,2);
	$Location["Duree"] = $Duree;
	
	$_SESSION["Location"] = $Location;
	
	if ($Save == 0){
		calcule_total();
	} else {
		calcule_total("save");
		
		do_save_location();
	}
	
}

///////////////////////////////////////////////////////////
///	   Fonction enregistrement données Copie en session	///
///////////////////////////////////////////////////////////
function do_add_duplication($Employe_ID, $Client_ID, $Statut_ID, $Ref, $Date_Depart, $Heure_Depart, $Date_Retour, $Heure_Retour, $Duree, $Remarques, $Caution, $Save=0){
	$Duplication = $_SESSION["Duplication"];

	$Duplication["Employe_ID"] = $Employe_ID;
	$Duplication["Client_ID"] = $Client_ID;
	$Duplication["Statut_ID"] = $Statut_ID;
	$Duplication["Ref"] = stripslashes($Ref);
	$Duplication["Date_Depart_FR"] = $Date_Depart;
	$Duplication["Heure_Depart"] = $Heure_Depart;
	$Duplication["Date_Retour_FR"] = $Date_Retour;
	$Duplication["Heure_Retour"] = $Heure_Retour;
	$Duplication["Remarques"] = stripslashes($Remarques);
	$Duplication["Duree"] = stripslashes($Duree);
	$Duplication["Caution"] = str_replace(",", ".", $Caution);
	
	$Duplication["Date_Depart_EN"] = substr($Date_Depart,6,4) . "-" . substr($Date_Depart,3,2) . "-" . substr($Date_Depart,0,2);
	$Duplication["Date_Retour_EN"] = substr($Date_Retour,6,4) . "-" . substr($Date_Retour,3,2) . "-" . substr($Date_Retour,0,2);

	$_SESSION["Duplication"] = $Duplication;
	
	if ($Save == 0){
		header("Location: " . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=duplication");
	} else {
		do_save_duplication();
	}
}

///////////////////////////////////////////////////////////
///   Fonction enregistrement données Modification en session	///
///////////////////////////////////////////////////////////
function do_modif_param($Employe_ID, $Statut_ID, $Date_Depart, $Heure_Depart, $Date_Retour, $Heure_Retour, $Duree, $Save=0){
	$Modification = $_SESSION["Modification"];
	
	$Modification["Date_Depart_EN"] = substr($Date_Depart,6,4) . "-" . substr($Date_Depart,3,2) . "-" . substr($Date_Depart,0,2);
	$Modification["Date_Retour_EN"] = substr($Date_Retour,6,4) . "-" . substr($Date_Retour,3,2) . "-" . substr($Date_Retour,0,2);
	
	//Dates Modifiées
	$Modification["Date_Depart_FR"] = $Date_Depart;
	$Modification["Heure_Depart"] = $Heure_Depart;
	$Modification["Date_Retour_FR"] = $Date_Retour;
	$Modification["Heure_Retour"] = $Heure_Retour;
	
	$Modification["Statut_ID"] = $Statut_ID;
	$Modification["Employe_ID"] = $Employe_ID;
	$Modification["Duree"] = $Duree;
	
	$_SESSION["Modification"] = $Modification;
	
	if ($Save == 0){
		header("Location: " . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=modif_param");
	} else {
		do_save_modif();
	}	
}

///////////////////////////////////////////////////////////
///	  Fonction enregistrement données Location dans DB	///
///////////////////////////////////////////////////////////
function do_save_location(){
	global $db;
	
	$Location = $_SESSION["Location"];
	
	//Incrémentation Révision si besoin
	if ($Location["Modifiee"] == 1){
		//Mise à jour Fiche dans la DB
		$Filtre = "
			update Locations set
				Client_ID='" . $Location["Client_ID"] . "', Ref='" . mysql_real_escape_string($Location["Ref"]) . "',
				DateDep='" . $Location["Date_Depart_EN"] . " " . $Location["Heure_Depart"] . "',
				DateRet='" . $Location["Date_Retour_EN"] . " " . $Location["Heure_Retour"] . "', Statut_ID='" . $Location["Statut_ID"] . "',
				Remarques='" . mysql_real_escape_string($Location["Remarques"]) . "', Duree='" . $Location["Duree"] . "', Caution='" . $Location["Caution"] . "',
				Accompte='" . $Location["Accompte"] . "'
			where
				Fiche_ID='" . $Location["Fiche_ID"] . "'";
		//echo $Filtre . "<br />";
		mysql_query("SET NAMES 'utf8'");
		$sql = mysql_query($Filtre,$db);
	
		//Rapatrier nom employé
		select_client_db();
		$Filtre = "Select Nom from Utilisateurs_Employes where Employe_ID = '" . $Location["Employe_ID"] . "' limit 1";
		//print $Filtre;
		$sql = mysql_query($Filtre,$db);
		$row = mysql_fetch_array($sql);
		select_version_db();
		
		$Location["Revision"]++;
		$Location["Revision_Str"] = "";
		//Mise à jour Historique si besoin
		$Location["Historique"] = stripslashes($Location["Historique"]);
		$Filtre = "
			insert into Revisions (
				Fiche_ID, Revision, Date, Employe, Historique
			) values (
				" . $Location["Fiche_ID"] . ", " . $Location["Revision"] . ",'" . date("Y-m-d H:i:s") . "', '" . mysql_real_escape_string($row["Nom"]) . "',
				'" . mysql_real_escape_string($Location["Historique"]) . "')";
		//echo $Filtre . "<br />";
		$sql = mysql_query($Filtre,$db);
		
		//Si premiere sauvegarde d'une nouvelle fiche, basculer la fiche en mode édition
		if ($Location["Revision"] == 1){
			$Location["Action"] = "Edit";
		}
		
		//Flags divers
		$Location["Historique"] = "";
		$Location["Saved"] = 1;
		$Location["Modifiee"] = 0;
		$Location["Alert_Saved"] = "Fiche";
	}

	$_SESSION["Location"] = $Location;
	//exit;
	
	header("Location: " . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=add_location");
}

///////////////////////////////////////////////////////////
///  	      Fonction enregistrement copie dans la DB		///
///////////////////////////////////////////////////////////
function do_save_duplication(){
	global $db, $lang;
	
	$Duplication = $_SESSION["Duplication"];
	$Location = $_SESSION["Location"];
	$MatosInGroup = $_SESSION["MatosInGroup"];
	$User = $_SESSION["User"];
	
	//Enregistrement données dans la DB
	$Filtre = "
		insert into Locations (
			Client_Account, Client_ID, Ref, DateDep, DateRet, Statut_ID, Remarques, Duree, Caution
		) values (
			'" . $User["Client_ID"] . "', '" . $Duplication["Client_ID"] . "', '" . mysql_real_escape_string($Duplication["Ref"]) . "',
			'" . $Duplication["Date_Depart_EN"] . " " . $Duplication["Heure_Depart"] . "',
			'" . $Duplication["Date_Retour_EN"] . " " . $Duplication["Heure_Retour"] . "', '" . $Duplication["Statut_ID"] . "',
			'" . mysql_real_escape_string($Duplication["Remarques"]) . "', '" . mysql_real_escape_string($Duplication["Duree"]) . "',
			'" . mysql_real_escape_string($Duplication["Caution"]) . "'
		)";
	//echo $Filtre . "<br />";
	//exit;
	mysql_query("SET NAMES 'utf8'");
	$sql = mysql_query($Filtre,$db);
	
	// Rattraper N° de la Lcocation créée
	$Filtre = "select last_insert_id() as Fiche_ID from Locations";
	$sql = mysql_query($Filtre,$db);
	$row = mysql_fetch_array($sql);
	$Duplication["Destination_ID"] = $row["Fiche_ID"];
	$_SESSION["Duplication"] = $Duplication;
	
	//Création des matériels
	$Filtre2 = "";
	for ($i=0;$i<$MatosInGroup["Max"];$i++){
		if ($MatosInGroup[$i]["Selected"] == 1){
			//Rattraper infos manquantes sur le matériel source
			$Filtre = "select PU, PU_Type, Qte, TVA, Remise from Locations_Materiels where ID = '" . $MatosInGroup[$i]["Record_ID"] . "'";
			//print $Filtre . "<br />";
			$sql = mysql_query($Filtre,$db);		
			$row = mysql_fetch_array($sql);
			
			//Durée selon type
			if ($MatosInGroup[$i]["Type_Materiel"] == 0){
				$CurrDuree = $Duplication["Duree"];
			} else {
				$CurrDuree = 1;
			}
			
			$Filtre2 .= "
			('" . $Duplication["Destination_ID"] . "', '" . $MatosInGroup[$i]["Final_Materiel_ID"] . "',
			'" . $Duplication["Date_Depart_EN"] . " " . $Duplication["Heure_Depart"] . "',
			'" . $Duplication["Date_Retour_EN"] . " " . $Duplication["Heure_Retour"] . "', '" . $CurrDuree . "',
			'" . $Duplication["Statut_ID"] . "', '" . $row["PU"] . "', '" . $row["PU_Type"] . "', '" . $MatosInGroup[$i]["Qte"] . "', '" . $row["TVA"] . "', '" . $row["Remise"] . "'), ";
		}
	}
	$Filtre2 = substr($Filtre2, 0 , strlen($Filtre2)-2);
	
	$Filtre = "
		insert into Locations_Materiels (
			Fiche_ID, Materiel_ID, DateDep, DateRet, Duree, Statut_ID, PU, PU_Type, Qte, TVA, Remise
		) values " . $Filtre2;
	//print $Filtre . "<br>";
	//exit;
	$sql = mysql_query($Filtre,$db);
	
	//Rapatrier nom employé
	select_client_db();
	$Filtre = "Select Nom from Utilisateurs_Employes where Employe_ID = '" . $Duplication["Employe_ID"] . "' limit 1";
	//print $Filtre;
	$sql = mysql_query($Filtre,$db);
	$row = mysql_fetch_array($sql);
	select_version_db();
		
	//Mise à jour Historique
	$Historique = $lang["Do_Save_Duplication"]["Historique"] . $Duplication["Fiche_ID"] . "</b>";
	$Filtre = "
		insert into Revisions (
			Fiche_ID, Type_Fiche, Revision, Date, Employe, Historique
		) values (
			'" . $Duplication["Destination_ID"] . "', 'Location', " . '1' . ",'" . date("Y-m-d H:i:s") . "', '" . mysql_real_escape_string($row["Nom"]) . "',
			'" . mysql_real_escape_string($Historique) . "'
		)";
	//echo $Filtre . "<br />";
	$sql = mysql_query($Filtre,$db);
	
	//rediriger vers la fiche créée
	//exit;
	$Information["Action"] = "Redirect";
	$Information["Message"] = $lang["Do_Save_Duplication"]["Copie_OK"];
	$Information["Destination_Page"] = $_SERVER["PHP_SELF"];
	//$Information["Destination_Action"] = "view_location_init&Fiche_ID=" . $Duplication["Destination_ID"] . "&Output=Screen&opener=locations_listings.php&opener_action=display_listing_fiches";
	$Information["Destination_Action"] = "view_location_init&Fiche_ID=" . $Duplication["Destination_ID"] . "&Output=Screen";
	$Information["Opener_Page"] = $Location["Opener"];
	$Information["Opener_Action"] = $Location["Opener_Action"];
	$_SESSION["Information"] = $Information;

	inform_client();
}

///////////////////////////////////////////////////////////
///   Fonction enregistrement données Modification dans DB	///
///////////////////////////////////////////////////////////
function do_save_modif(){
	global $db, $lang;
	
	$Location = $_SESSION["Location"];
	$Modification = $_SESSION["Modification"];
	$MatosInGroup = $_SESSION["MatosInGroup"];

	if ($Modification["Statut_ID"] != $Location["Statut_ID"]){
		$Location["Historique"] .= $lang["Modif_Param"]["Historique_Statut"];
	}
	if ($Modification["Date_Depart_FR"] != $Location["Date_Depart_FR"]){
		$Location["Historique"] .= $lang["Modif_Param"]["Historique_Date_Debut"];
	}
	if ($Modification["Heure_Depart"] != $Location["Heure_Depart"]){
		$Location["Historique"] .= $lang["Modif_Param"]["Historique_Heure_Debut"];
	}
	if ($Modification["Date_Retour_FR"] != $Location["Date_Retour_FR"]){
		$Location["Historique"] .= $lang["Modif_Param"]["Historique_Date_Fin"];
	}
	if ($Modification["Heure_Retour"] != $Location["Heure_Retour"]){
		$Location["Historique"] .= $lang["Modif_Param"]["Historique_Heure_Fin"];
	}
	if ($Modification["Duree"] != $Location["Duree"]){
		$Location["Historique"] .= $lang["Modif_Param"]["Historique_Duree"];
	}
	
	//Mise à jour de la Fiche
	$Filtre = "
		update
			Locations
		set
			DateDep='" . $Modification["Date_Depart_EN"] . " " . $Modification["Heure_Depart"] . "',
			DateRet='" . $Modification["Date_Retour_EN"] . " " . $Modification["Heure_Retour"] . "',
			Duree='" . $Modification["Duree"] . "', Statut_ID = '" . $Modification["Statut_ID"] . "'
		where
			Fiche_ID=" . $Modification["Fiche_ID"];
	//echo $Filtre . "<br />";
	mysql_query("SET NAMES 'utf8'");
	$sql = mysql_query($Filtre,$db);

	//Mise à jour des matériels dans la fiche si disponibles
	$Max_Treated = 0;
	for ($i=0;$i<$MatosInGroup["Max"];$i++){
		if ($MatosInGroup[$i]["Statut"] == 1){
			if ($MatosInGroup[$i]["Statut_ID"] != $Location["Statut_ID"]){
				$Filtre = "
					update
						Locations_Materiels
					set
						DateDep='" . $Modification["Date_Depart_EN"] . " " . $Modification["Heure_Depart"] . "',
						DateRet='" . $Modification["Date_Retour_EN"] . " " . $Modification["Heure_Retour"] . "',
						Duree='" . $Modification["Duree"] . "', Statut_ID = '" . $Modification["Statut_ID"] . "'
					where
						ID = '" . $MatosInGroup[$i]["Record_ID"] . "'";
			} else {
				$Filtre = "
					update
						Locations_Materiels
					set
						DateDep='" . $Modification["Date_Depart_EN"] . " " . $Modification["Heure_Depart"] . "',
						DateRet='" . $Modification["Date_Retour_EN"] . " " . $Modification["Heure_Retour"] . "',
						Duree='" . $Modification["Duree"] . "'
					where
						ID = '" . $MatosInGroup[$i]["Record_ID"] . "'";
			}
			//print $Filtre . "<br />";
			$sql = mysql_query($Filtre,$db);
			$Max_Treated++;
		}
	}
	if ($Max_Treated != '1'){
		$Max_Treated_Str = $Max_Treated . $lang["Modif_Param"]["References_Modifiees"];
	} else {
		$Max_Treated_Str = $lang["Modif_Param"]["Reference_Modifiee"];
	}
	//exit;
	
	//Rapatrier nom employé
	select_client_db();
	$Filtre = "Select Nom from Utilisateurs_Employes where Employe_ID = '" . $Modification["Employe_ID"] . "' limit 1";
	//print $Filtre;
	$sql = mysql_query($Filtre,$db);
	$row = mysql_fetch_array($sql);
	select_version_db();
	
	//Mise à jour Historique si besoin
	$Location["Revision"]++;
	$Location["Revision_Str"] = "";
	$Location["Historique"] = stripslashes($Location["Historique"]);
	$Filtre = "
		insert into Revisions (
			Fiche_ID, Type_Fiche, Revision, Date, Employe, Historique
		) values (
			'" . $Location["Fiche_ID"] . "', 'Location', '" . $Location["Revision"] . "', '" . date("Y-m-d H:i:s") . "',
			'" . mysql_real_escape_string($row["Nom"]) . "', '" . mysql_real_escape_string($Location["Historique"]) . "'
		)";
	//echo $Filtre . "<br />";
	//exit;
	$sql = mysql_query($Filtre,$db);
			
	//Redirection vers fiche entièrement rechargée
	$Information["Action"] = "Close_Self";
	$Information["Message"] = $lang["Modif_Param"]["Modification_OK"] . $Max_Treated_Str;
	$Information["Destination_Page"] = "";
	$Information["Destination_Action"] = "";
	$Information["Opener_Page"] = $_SERVER["PHP_SELF"];
	$Information["Opener_Action"] = "view_location_init&Fiche_ID=" . $Modification["Fiche_ID"] . "&Output=Screen";
	$_SESSION["Information"] = $Information;
	//exit;
	
	inform_client();
}

///////////////////////////////////////////////////////////
///	         Fonction recherche d'une Fiche via son N°		///
///////////////////////////////////////////////////////////
function do_select_nb($Fiche_ID){
	global $db, $lang;

	$Filtre = "Select count(*) as Max from Locations where Fiche_ID = '" . $Fiche_ID . "'";
	$sql= mysql_query($Filtre,$db);
	if (mysql_result($sql,0,"Max") == 0){
		$Information["Action"] = "Redirect";
		$Information["Message"] = $lang["Select_NB"]["Location_Inexistante"];
		$Information["Destination_Page"] = "locations.php";
		$Information["Destination_Action"] = "select_nb";
		$Information["Opener_Page"] = "";
		$Information["Opener_Action"] = "";
		
		$_SESSION["Information"] = $Information;		
		
		inform_client();
		exit;
	} else {
		view_location_init($Fiche_ID, "Screen");
	}	
}

///////////////////////////////////////////////////////////
///	             Fonction initialisation Duplication			///
///////////////////////////////////////////////////////////
function duplication_init($Fiche_ID){
	global $db, $lang;
	
	$User = $_SESSION["User"];
	$Version_Info = $_SESSION["Version_Info"];
	
	$Filtre = "Select * from Locations where Fiche_ID = '" . $Fiche_ID . "'";
	mysql_query("SET NAMES 'utf8'");
	$sql = mysql_query($Filtre);
	$Duplication = mysql_fetch_array($sql);
	
	//Dates selon préférences utilisateurs
	$CurrDay = date("d");
	$CurrMonth = date("m");
	$CurrYear = date("Y");
	
	if ($User["Pref_DateDep"] != ""){
		$Duplication["Date_Depart_FR"] = date("d/m/Y", mktime(0, 0, 0, $CurrMonth, $CurrDay + $User["Pref_DateDep"], $CurrYear));
		$Duplication["Date_Depart_EN"] = date("Y-m-d", mktime(0, 0, 0, $CurrMonth, $CurrDay + $User["Pref_DateDep"], $CurrYear));
	} else {
		$Duplication["Date_Depart_FR"] = date("d/m/Y", mktime(0, 0, 0, $CurrMonth, $CurrDay + $Version_Info["Pref_DateDep"], $CurrYear));
		$Duplication["Date_Depart_EN"] = date("Y-m-d", mktime(0, 0, 0, $CurrMonth, $CurrDay + $Version_Info["Pref_DateDep"], $CurrYear));
	}
	$Duplication["Heure_Depart"] = $User["Pref_HeureDep"];
	
	if ($User["Pref_DateRet"] != ""){
		$Duplication["Date_Retour_FR"] = date("d/m/Y", mktime(0, 0, 0, $CurrMonth, $CurrDay + $User["Pref_DateRet"], $CurrYear));
		$Duplication["Date_Retour_EN"] = date("Y-m-d", mktime(0, 0, 0, $CurrMonth, $CurrDay + $User["Pref_DateRet"], $CurrYear));
	} else {
		$Duplication["Date_Retour_FR"] = date("d/m/Y", mktime(0, 0, 0, $CurrMonth, $CurrDay + $Version_Info["Pref_DateRet"], $CurrYear));
		$Duplication["Date_Retour_EN"] = date("Y-m-d", mktime(0, 0, 0, $CurrMonth, $CurrDay + $Version_Info["Pref_DateRet"], $CurrYear));
	}
	$Duplication["Heure_Retour"] = $User["Pref_HeureRet"];
	
	//Durée de la location
	$Duree = date_diff($Duplication["Date_Depart_EN"] . " " . $Duplication["Heure_Depart"], $Duplication["Date_Retour_EN"] . " " . $Duplication["Heure_Retour"]);
	
	if ($Duree < 24){
		$Jours = 1;
	} else {
		$Jours = intval($Duree / 24);
		$Heures = $Duree % 24;
		// Si plus de 6 heures sur dépassement journée, facturer un jour supplémentaire
		if ($Heures >= 6){
			$Jours++;
		}
	}
	$Duplication["Duree"] = $Jours;
	
	$Duplication["Employe_ID"] = 0;
	$Duplication["Statut_ID"] = 1;
	
	//Gestion des Groupes
	$Dupli_Groupes = array();
	$Dupli_Groupes["Max"] = 0;
	$Filtre = "
		Select
			Inventaire.Designation, count(Inventaire.Designation) as Qte
		from
			Locations_Materiels, Inventaire
		where
			Fiche_ID = '" . $Duplication["Fiche_ID"] . "' and Inventaire.ID = Locations_Materiels.Materiel_ID
		group by
			Inventaire.Designation
		order by
			Locations_Materiels.ID asc";
	//echo $Filtre . "<br />";
	//exit;
	$Duplication["Total_References"] = 0;
	$sql = mysql_query($Filtre,$db);
	while ($row = mysql_fetch_array($sql)){
		$Dupli_Groupes[$Dupli_Groupes["Max"]]["Nom"] = $row["Designation"];
		$Dupli_Groupes[$Dupli_Groupes["Max"]]["Max"] = $row["Qte"];
		$Duplication["Total_References"] += 1;
		$Dupli_Groupes["Max"]++;
	}
	
	//Construction de la liste du matériel
	$Filtre = "
		Select
			Inventaire.Statut as Type_Materiel, Locations_Materiels.ID, Locations_Materiels.Statut_ID as Details_Statut,
			Date_Format(DateDep,'%d/%m/%y - %Hh') as DateDepFR, Date_Format(DateRet,'%d/%m/%y - %Hh') as DateRetFR, Inventaire.Designation, Inventaire.Modele,
			Inventaire.Num_Interne, Materiel_ID, Qte
		from
			Locations_Materiels, Inventaire
		where
			Fiche_ID = " . $Duplication["Fiche_ID"] . " and Inventaire.ID = Locations_Materiels.Materiel_ID
		order by Locations_Materiels.ID asc";
	//echo $Filtre;
	$sql = mysql_query($Filtre,$db);

	$MatosInGroup["Max"] = 0;
	while ($row = mysql_fetch_array($sql)){
		//Créer un groupe si besoin
		$FoundGroup = -1;
		for ($i=0;$i<$Dupli_Groupes["Max"];$i++){
			if ($row["Designation"] == $Dupli_Groupes[$i]["Nom"]){
				//Matériel appartenant à un groupe... Sauver info
				$FoundGroup = $i;
				//echo "Trouvé : " . $ListResa["Designation"] . "<br>";
				break;
			}
		}
		
		//Ajouter le matériel à la liste du matériel
		$MatosInGroup[$MatosInGroup["Max"]]["Selected"] = 1;
		$MatosInGroup[$MatosInGroup["Max"]]["Selected_Str"] = "checked";
		$MatosInGroup[$MatosInGroup["Max"]]["Record_ID"] = $row["ID"];
		$MatosInGroup[$MatosInGroup["Max"]]["Group_ID"] = $FoundGroup;
		$MatosInGroup[$MatosInGroup["Max"]]["Qte"] = $row["Qte"];
		$MatosInGroup[$MatosInGroup["Max"]]["Type_Materiel"] = $row["Type_Materiel"];
		if ($row["Type_Materiel"] == 0){
			$MatosInGroup[$MatosInGroup["Max"]]["Type_Materiel_Str"] = $lang["Duplication"]["Emplacement"];
		} elseif ($row["Type_Materiel"] == 1) {
			$MatosInGroup[$MatosInGroup["Max"]]["Type_Materiel_Str"] = $lang["Duplication"]["Service"];
		} elseif ($row["Type_Materiel"] == 2) {
			$MatosInGroup[$MatosInGroup["Max"]]["Type_Materiel_Str"] = $lang["Duplication"]["Fourniture"];
		}
		$MatosInGroup[$MatosInGroup["Max"]]["Materiel_ID"] = $row["Materiel_ID"];
		$MatosInGroup[$MatosInGroup["Max"]]["Designation"] = $row["Designation"];
		$MatosInGroup[$MatosInGroup["Max"]]["Modele"] = $row["Modele"];
		$MatosInGroup[$MatosInGroup["Max"]]["Internal"] = $row["Num_Interne"];
		$MatosInGroup[$MatosInGroup["Max"]]["Use_Serial"] = 1;
		$MatosInGroup[$MatosInGroup["Max"]]["Use_Serial_Str"] = "checked";
		$MatosInGroup[$MatosInGroup["Max"]]["Statut"] = 0;
		$MatosInGroup[$MatosInGroup["Max"]]["Statut_Str"] = "En attente";
		$MatosInGroup[$MatosInGroup["Max"]]["Statut_Color"] = "0000FF";
		
		//Augmenter ID matériel traité
		$MatosInGroup["Max"]++;
	}	

	$_SESSION["Dupli_Groupes"] = $Dupli_Groupes;
	$_SESSION["Duplication"] = $Duplication;
	$_SESSION["MatosInGroup"] = $MatosInGroup;
	
	duplication();
}

///////////////////////////////////////////////////////////
///	             Fonction initialisation Duplication			///
///////////////////////////////////////////////////////////
function duplication(){
	global $db, $lang;
	
	$Dupli_Groupes = $_SESSION["Dupli_Groupes"];
	$Duplication = $_SESSION["Duplication"];
	$JS = $_SESSION["JS"];
	$MatosInGroup = $_SESSION["MatosInGroup"];
	$Palette = $_SESSION["Palette"];
	$User = $_SESSION["User"];
	
	//Format dates France
	setLocale(LC_TIME, "fr_FR.UTF-8");
	
	//Taille tableau des références
	$Available_Space = $User["Util_ResY"] - 400;

	//Liste des employés
	select_client_db();
	mysql_query("SET NAMES 'utf8'");
	$CreateurStr = "";
	$Filtre = "Select * from Utilisateurs_Employes where User_ID = '" . $User["User_ID"] . "' order by Nom asc";
	//print $Filtre;
	$sql = mysql_query($Filtre,$db);
	$MaxEmployes = mysql_numrows($sql);
	if ($MaxEmployes == 1){
		$CreateurStr = "<option value=\"" . mysql_result($sql,0,"Employe_ID") . "\" selected>" . mysql_result($sql,0,"Nom") . "</option>\n";
		$Incident["Employe_ID"] = mysql_result($sql,0,"Employe_ID");
	} else {
		while ($row = mysql_fetch_array($sql)){
			if ($row["Employe_ID"] == $Duplication["Employe_ID"]){
				$CreateurStr .= "<option value=\"" . $row["Employe_ID"] . "\" selected>" . $row["Nom"] . "</option>\n";
			} else {
				$CreateurStr .= "<option value=\"" . $row["Employe_ID"] . "\">" . $row["Nom"] . "</option>\n";
			}
		}
	}
	select_version_db();
	
	//Création des zones d'heure
	$Exact_Day = date("d");
	$Exact_Month = date("m");
	$Exact_Year = date("Y");

	$HeureDepStr = "
		<select name=\"Heure_Depart\" class=\"form_element\" onChange=\"SetDate('Debut')\" onFocus=\"ShowMessage('HeureDep', 'inform', '" . addslashes($lang["Duplication"]["Tooltip_Heuredep"]) . "', 'Up');\" onBlur=\"return nd();\">\n";
	$HeureRetStr = "
		<select name=\"Heure_Retour\" class=\"form_element\" onChange=\"SetDate('Fin')\" onFocus=\"ShowMessage('HeureRet', 'inform', '" . addslashes($lang["Duplication"]["Tooltip_Heureret"]) . "', 'Up');\" onBlur=\"return nd();\">\n";

	for ($i=0;$i<24;$i++){
		$CurrTime = date("H:i", mktime($i, 0, 0, $Exact_Month, $Exact_Day, $Exact_Year));
		if ($Duplication["Heure_Depart"] != $CurrTime){
			$HeureDepStr .= "<option value=\"" . $CurrTime . "\">" . $CurrTime . "</option>\n";
		} else {
			$HeureDepStr .= "<option value=\"" . $CurrTime . "\" selected>" . $CurrTime . "</option>\n";
		}
		if ($Duplication["Heure_Retour"] != $CurrTime){
			$HeureRetStr .= "<option value=\"" . $CurrTime . "\">" . $CurrTime . "</option>\n";
		} else {
			$HeureRetStr .= "<option value=\"" . $CurrTime . "\" selected>" . $CurrTime . "</option>\n";
		}
	}
	$HeureDepStr .= "</select>\n";
	$HeureRetStr .= "</select>\n";
		
	$DateDepStr = "
		<div class=\"champ_formulaire_location\" style=\"width: 240px; height: 18px;\">
			<div id=\"DateDep\" style=\"float: left; margin-top: 2px;\">
				<input type=\"text\" id=\"Date_Depart\" name=\"Date_Depart\" value=\"" . $Duplication["Date_Depart_FR"] . "\" size=\"11\" maxLength=\"10\" class=\"form_element\" readonly=\"readonly\">
			</div>
			<div id=\"DateDepIcon\" style=\"float: left; padding-left: 5px; margin-top: 4px;\">
				<img src=\"images/software_icons/calendrier.png\" width=\"25\" border=\"0\" id=\"trigger_dd\" style=\"cursor: pointer; vertical-align: middle;\" onMouseOver=\"ShowMessage('DateDepIcon', 'inform', '" . addslashes($lang["Duplication"]["Tooltip_Datedep_Icon"]) . "', 'Up');\" onMouseOut=\"return nd();\" />
			</div>
			<script type=\"text/javascript\">
				function DoSelect1(calendar, date) {
					var input_field = document.getElementById(\"Date_Depart\");
					input_field.value = date;
					if (calendar.dateClicked) {
						calendar.callCloseHandler(); // this calls \"onClose\" (see above)
						SetDate('Debut');
					}
				};
				Calendar.setup(
					{
						inputField : \"Date_Depart\",
						ifFormat : \"%d/%m/%Y\",
						firstDay : 1,
						showsTime : false,
						button : \"trigger_dd\",
						onSelect : DoSelect1
					}
				);
			</script>
			<div style=\"float: left; padding-left: 5px; margin-top: 5px;\">" . $lang["Duplication"]["A"] . "</div>
			<div id=\"HeureDep\" style=\"float: left; padding-left: 5px; margin-top: 3px;\">
				" . $HeureDepStr . "
			</div>
		</div>\n";
		
	$DateRetStr = "
		<div class=\"champ_formulaire_location\" style=\"width: 240px; height: 18px;\">
			<div id=\"DateRet\" style=\"float: left; margin-top: 2px;\">
				<input type=\"text\" id=\"Date_Retour\" name=\"Date_Retour\" value=\"" . $Duplication["Date_Retour_FR"] . "\" size=\"11\" maxLength=\"10\" class=\"form_element\" readonly=\"readonly\">
			</div>
			<div id=\"DateRetIcon\" style=\"float: left; padding-left: 5px; margin-top: 4px;\">
				<img src=\"images/software_icons/calendrier.png\" width=\"25\" border=\"0\" id=\"trigger_dr\" style=\"cursor: pointer; vertical-align: middle;\" onMouseOver=\"ShowMessage('DateRetIcon', 'inform', '" . addslashes($lang["Duplication"]["Tooltip_Dateret_Icon"]) . "', 'Up');\" onMouseOut=\"return nd();\" />
			</div>
			<script type=\"text/javascript\">
				function DoSelect2(calendar, date) {
					var input_field = document.getElementById(\"Date_Retour\");
					input_field.value = date;
					if (calendar.dateClicked) {
						calendar.callCloseHandler(); // this calls \"onClose\" (see above)
						SetDate('Fin');
					}
				};
				Calendar.setup(
				{
					inputField : \"Date_Retour\",
					ifFormat : \"%d/%m/%Y\",
					firstDay : 1,
					showsTime : false,
					button : \"trigger_dr\",
					onSelect : DoSelect2
				}
				);
			</script>
			<div style=\"float: left; padding-left: 5px; margin-top: 5px;\">" . $lang["Duplication"]["A"] . "</div>
			<div id=\"HeureRet\" style=\"float: left; padding-left: 5px; margin-top: 3px;\">
				" . $HeureRetStr . "
			</div>
		</div>\n";
			
	//Statut : liste et bulle d'information
	$tooltip_statut = "<div style='height: 5px;'></div>";
	$CurrStatus = $Duplication["Statut_ID"] -1;
	$LstStatuts = "";
	for ($i=0;$i<$Palette["Max_Palette"];$i++){
		if ($Duplication["Statut_ID"] != $Palette["ID"][$i]){
			$LstStatuts .= "<option value=\"" . $Palette["ID"][$i] . "\">" . $Palette["Statut"][$i] . "</option>\n";
		} else {
			$LstStatuts .= "<option value=\"" . $Palette["ID"][$i] . "\" selected>" . $Palette["Statut"][$i] . "</option>\n";
		}
		$tooltip_statut .= "<div class='statut' style='color: #" . $Palette["Police_Hex"][$i] . "; background-color: #" . $Palette["Couleur_Hex"][$i] . ";'>". $Palette["Statut"][$i] ."</div>";
		$tooltip_statut .= "<div style='height: 2px;'></div>";
		
	}
	$tooltip_statut .= "<div style='height: 3px;'></div>";
	$tooltip_statut = addslashes($tooltip_statut);
	
	$StatutStr = "
		<div class=\"champ_formulaire_location\" style=\"width: 430px; height: 16px; padding-top: 2px;\">
			<div id=\"Div_Statut_ID\" style=\"float: left;\">
				<select name=\"Statut_ID\" class=\"form_element\" onChange=\"SubmitDoc()\" onFocus=\"ShowMessage('Div_Statut_ID', 'inform', '" . addslashes($lang["Duplication"]["Tooltip_Statut"]) . "', 'Up');\" onBlur=\"return nd();\">
					<option value=\"0\" selected>". $lang["Duplication"]["Choisissez"] ."</option>
					" . $LstStatuts . "
				</select>
			</div>
			<div style=\"float: left; padding-left: 5px;\">
				<img src=\"" . $User["Image_Path"] . "/information.png\" alt=\"\" style=\"width: 16px; cursor: pointer;\" onMouseOver=\"ShowPopup('" . $tooltip_statut . "')\" onMouseOut=\"return nd();\">
			</div>
		</div>\n";
	
	//Liste des Durées
	$ListDuree = "";
	for ($i=1;$i<366;$i++){
		if ($Duplication["Duree"] != $i){
			$ListDuree .= "<option value=\"" . $i . "\">" . $i . "</option>\n";
		} else {
			$ListDuree .= "<option value=\"" . $i . "\" selected>" . $i . "</option>\n";
		}
	}
	if ($Duplication["Duree"] != 1){
		$NuitsStr = $lang["Duplication"]["Nuits"];
	} else {
		$NuitsStr = $lang["Duplication"]["Nuit"];
	}
	
	$DureeStr = "
		<div id=\"Div_Duree\" style=\"float: left;\">
			<select name=\"Duree\" class=\"form_element\" onChange=\"SubmitDoc()\" style=\"text-align: right; margin-right: 5px;\" onFocus=\"ShowMessage('Div_Duree', 'inform', '" . addslashes($lang["Duplication"]["Tooltip_Duree"]) . "', 'Up');\" onBlur=\"return nd();\">
				" . $ListDuree . "
			</select>
		</div>
		<div style=\"float: left; padding-top: 2px;\">
			" . $NuitsStr . "
		</div>\n";
		
	//Liste des Clients
	$ClientStr = "";
	$Filtre = "Select Client_ID, Nom, Prenom from Clients where Client_Account = '" . $User["Client_ID"] . "' order by Nom asc";
	$sql = mysql_query($Filtre);
	while ($row = mysql_fetch_array($sql)){
		if ($row["Prenom"] != ""){
			$Client_Name = $row["Nom"] . " " . $row["Prenom"];
		} else {
			$Client_Name = $row["Nom"];
		}
		if ($row["Client_ID"] != $Duplication["Client_ID"]){ 
			$ClientStr .= "<option value=\"" . $row["Client_ID"] . "\">" . $Client_Name . "</option>\n";
		} else {
			$ClientStr .= "<option value=\"" . $row["Client_ID"] . "\" selected>" . $Client_Name . "</option>\n";
		}
	}

	$_SESSION["Duplication"] = $Duplication;
	
	//Liste du matériel et statut
	//TGraitement selon dates sélectionnées ou pas
	$MatosInGroup["Max_Selected"] = 0;
	if ($Duplication["Date_Depart_EN"] != "" && $Duplication["Date_Retour_EN"] != "" && $Duplication["Heure_Depart"] != "" && $Duplication["Heure_Retour"] != ""){
		//Remise en forme dates
		$NewDateDep = $Duplication["Date_Depart_EN"] . " " . $Duplication["Heure_Depart"] . ":00";
		$NewDateRet = $Duplication["Date_Retour_EN"] . " " . $Duplication["Heure_Retour"] . ":00";

		//Indiquer machines en attente
		for ($i=0;$i<$MatosInGroup["Max"];$i++){
			//Le matériel est-il à traitér ?
			if ($MatosInGroup[$i]["Type_Materiel"] == 0 && $MatosInGroup[$i]["Selected"] == 1){
				$MatosInGroup["Max_Selected"]++;
				
				//Regarder disponibilité de chaque matériel pour les dates sélectionnées
				if ($MatosInGroup[$i]["Use_Serial_Str"] == "checked"){
					//N° de série demandé... Regarder si CE matériel est libre
					$FiltreFree = "
						Select 
							Fiche_ID
						FROM
							Locations_Materiels
						where
							Materiel_ID = " . $MatosInGroup[$i]["Materiel_ID"] . " and ((Locations_Materiels.DateDep >= '" . $NewDateDep . "' AND
							Locations_Materiels.DateRet <= '" . $NewDateRet . "' ) OR (Locations_Materiels.DateDep >= '" . $NewDateDep . "' AND
							Locations_Materiels.DateDep < '" . $NewDateRet . "') OR (Locations_Materiels.DateRet >= '" . $NewDateRet . "' AND
							Locations_Materiels.DateDep <= '" . $NewDateDep . "') OR (Locations_Materiels.DateRet >= '" . $NewDateDep . "' AND
							Locations_Materiels.DateRet < '" . $NewDateRet . "'))
						order by DateDep asc limit 0,1";
					//print $FiltreFree . "<br>";
					$resultFree = mysql_query($FiltreFree,$db);
					
					if (mysql_numrows($resultFree) != 0){
						$MatosInGroup[$i]["Statut"] = -1;
						$MatosInGroup[$i]["Statut_Str"] = $lang["Duplication"]["Non_Disponible"];
						$MatosInGroup[$i]["Statut_Color"] = "FF0000";
						$MatosInGroup[$i]["Final_Materiel_ID"] = 0;
					} else {
						$MatosInGroup[$i]["Statut"] = 1;
						$MatosInGroup[$i]["Statut_Str"] = $lang["Duplication"]["Disponible"];
						$MatosInGroup[$i]["Statut_Color"] = "008000";
						$MatosInGroup[$i]["Final_Materiel_ID"] = $MatosInGroup[$i]["Materiel_ID"];
					}
				} else {
					//Pas de N° demandé... trouver premier matériel correspondant
					$Filtre = "
						Select
							Inventaire.ID
						FROM
							Inventaire, Locations_Materiels
						where
							Inventaire.ID = Locations_Materiels.Materiel_ID and ((DateDep >= '" . $NewDateDep . "' AND DateRet <= '" . $NewDateRet . "' )
							OR (DateDep >= '" . $NewDateDep . "' AND DateDep < '" . $NewDateRet . "') OR (DateRet >= '" . $NewDateRet . "' AND
							DateDep <= '" . $NewDateDep . "') OR (DateRet > '" . $NewDateDep . "' AND DateRet <= '" . $NewDateRet . "')) and
							Inventaire.Designation = '" . mysql_real_escape_string($MatosInGroup[$i]["Designation"]) . "' and
							Inventaire.Modele = '" . mysql_real_escape_string($MatosInGroup[$i]["Modele"]) . "' and Client_Account = '" . $User["Client_ID"] . "' and
							Inventaire.Statut = 0
						order by Num_Interne asc";
					//echo "$Filtre<br /><br />";
					$resultTakenMatos = mysql_query($Filtre);
					
					$Filtre1 = "";
					while ($row = mysql_fetch_array($resultTakenMatos)){
						$Filtre1 .= "Inventaire.ID != " . $row["ID"] . " and ";
					}
					//echo $Filtre1;

					//Pour tous les matériels déjà traités, autre matériel du même type étant déjà réservé ?
					for ($j=0;$j<$i;$j++){
						//Si même modèle et même désignation que matériel actuel
						if ($MatosInGroup[$i]["Designation"] == $MatosInGroup[$j]["Designation"] && $MatosInGroup[$i]["Modele"] == $MatosInGroup[$j]["Modele"]){
							$Filtre1 .= "Inventaire.ID != " . $MatosInGroup[$j]["Final_Materiel_ID"] . " and ";
						}
					}
						
					//Filtre contient la liste des matériels libres pour les dates sélectionnées
					$Filtre = "
						Select
							ID, Num_Interne
						FROM
							Inventaire
						where
							Client_Account = '" . $User["Client_ID"] . "' and Designation = '" . mysql_real_escape_string($MatosInGroup[$i]["Designation"]) . "' and
							Modele = '" . mysql_real_escape_string($MatosInGroup[$i]["Modele"]) . "' and Statut = 0 and ";
					$Filtre = $Filtre . $Filtre1 . $Save_Filtre;
					$Filtre = substr($Filtre,0,strlen($Filtre)-4);
					$Filtre = $Filtre . " order by Num_Interne asc limit 1";
					//echo $Filtre . "<br>";
					$resultFreeMatos = mysql_query($Filtre);
					
					if (mysql_numrows($resultFreeMatos) == 0){
						$MatosInGroup[$i]["Statut"] = -1;
						$MatosInGroup[$i]["Statut_Str"] = $lang["Duplication"]["Non_Disponible"];
						$MatosInGroup[$i]["Statut_Color"] = "FF0000";
						$MatosInGroup[$i]["Final_Materiel_ID"] = 0;
					} else {
						$row = mysql_fetch_array($resultFreeMatos);
						$MatosInGroup[$i]["Statut"] = 1;
						$MatosInGroup[$i]["Statut_Str"] = "<span title=\"" . $lang["Duplication"]["Numero_Designe"] . $row["Num_Interne"] . "\">" . $lang["Duplication"]["Disponible"] . "</span>";
						$MatosInGroup[$i]["Statut_Color"] = "008000";
						$MatosInGroup[$i]["Final_Materiel_ID"] = $row["ID"];
					}
				}
			} elseif ($MatosInGroup[$i]["Selected"] == 1) {
				$MatosInGroup[$i]["Statut"] = 1;
				$MatosInGroup[$i]["Statut_Str"] = $lang["Duplication"]["Disponible"];
				$MatosInGroup[$i]["Statut_Color"] = "008000";
				$MatosInGroup[$i]["Final_Materiel_ID"] = $MatosInGroup[$i]["Materiel_ID"];
				$MatosInGroup["Max_Selected"]++;
			} elseif ($MatosInGroup[$i]["Selected"] == 0) {
				$MatosInGroup[$i]["Statut"] = -2;
				$MatosInGroup[$i]["Statut_Str"] = $lang["Duplication"]["Non_Selectionne"];
				$MatosInGroup[$i]["Statut_Color"] = "0000FF";
				$MatosInGroup[$i]["Final_Materiel_ID"] = -1;
			}
		}
	} else {
		//Indiquer machines en attente
		for ($i=0;$i<$MatosInGroup["Max"];$i++){
			if ($MatosInGroup[$i]["Selected"] == 0){
				$MatosInGroup[$MatosInGroup["Max"]]["Statut_Str"] = $lang["Duplication"]["Non_Selectionne"];
				$MatosInGroup[$i]["Final_Materiel_ID"] = -1;
			} else {	
				$MatosInGroup["Max_Selected"]++;
				$MatosInGroup[$MatosInGroup["Max"]]["Statut_Str"] = $lang["Duplication"]["En_Attente"];
				$MatosInGroup[$i]["Final_Materiel_ID"] = -1;
			}
			$MatosInGroup[$MatosInGroup["Max"]]["Statut_Color"] = "0000FF";
		}
	}

	//La liste est prête, contsruire tableau
	$ListMatosStr = "";
	for ($i=0;$i<$Dupli_Groupes["Max"];$i++){
		if ($i<10){
			$CurrNb = "0" . $i;
			$CurrGroup = "Groupe_0" . $i;
			$CurrGroupImg = "Groupe_Img_0" . $i;
		} else {
			$CurrNb = $i;
			$CurrGroup = "Groupe_" . $i;
			$CurrGroupImg = "Groupe_Img_" . $i;
		}
					
		$ListMatosStr .= "
			<div class=\"group_header\">
				<div class=\"group_toggle\"><img id=\"" . $CurrGroupImg . "\" src=\"" . $User["Image_Path"] . "/list_close.png\" onClick=\"ToggleGroup('" . $CurrNb . "')\" style=\"cursor: pointer;\" title=\"". $lang["Duplication"]["Tooltip_Etendre"] ."\" alt=\"\"></div>
				<div class=\"group_name\">
					<b>" . $Dupli_Groupes[$i]["Nom"] . "</b>
				</div>
			</div>
			<div id=\"" . $CurrGroup . "\" class=\"group\" style=\"visibility: visible;\">
				<table border=\"0\" cellpadding=\"0\" cellspacing=\"2\" width=\"100%\" class=\"text\">\n";
	
		//Afficher matériels de ce groupe
		$CurrLine = 0;
		for ($j=0;$j<$MatosInGroup["Max"];$j++){
			if ($MatosInGroup[$j]["Group_ID"] == $i){
				if ($CurrLine % 2 == 0){
					$CurrClass = "impaire";
				} else {
					$CurrClass = "paire";
				}
				
				//Nom des divs
				if ($j<10){
					$CurrDivNumName = "Div_Serial_0" . $j;
					$CurrDivSelectName = "Div_Ref_0" . $j;
					$CurrQteName = "Qte_0" . $j;
					$CurrDivQteName = "Div_Qte_0" . $j;
				} else {
					$CurrDivNumName = "Div_Serial_" . $j;
					$CurrDivSelectName = "Div_Ref_" . $j;
					$CurrQteName = "Qte_" . $j;
					$CurrDivQteName = "Div_Qte_" . $j;
				}
				
				//Numéro si besoin
				if ($MatosInGroup[$j]["Type_Materiel"] == 0){
					$CurrInternal = $MatosInGroup[$j]["Internal"];
					if ($MatosInGroup[$j]["Duree"] != 1){
						$CurrDuree = $MatosInGroup[$j]["Duree"] . " " . $lang["Add_Location"]["Nuits"];
					} else {
						$CurrDuree = $MatosInGroup[$j]["Duree"] . " " . $lang["Add_Location"]["Nuit"];
					}
					$Use_Serial_Str = "<input type=\"checkbox\" name=\"SerialList[]\" value=\"" . $j . "\" " . $MatosInGroup[$j]["Use_Serial_Str"] . " onClick=\"UseSerial(this)\" onMouseOver=\"ShowMessage('" . $CurrDivNumName . "', 'inform', '" . addslashes($lang["Duplication"]["Tooltip_Use_Serial"]) . "', 'UpLeft');\" onMouseOut=\"return nd();\">";
					
					//Quantités
					$QteStr = $MatosInGroup[$j]["Qte"];
				} else {
					$CurrDuree = "";
					$MatosInGroup[$j]["Line_Color"] = "000000";
					$Use_Serial_Str = "";
					
					//Liste des quantités
					$LstQte = "";
					for ($k=1;$k<1001;$k++){
						if ($k != $MatosInGroup[$j]["Qte"]){
							$LstQte .= "<option value=\"" . $j . "^" . $k . "\">" . $k . "</option>";
						} else {
							$LstQte .= "<option value=\"" . $j . "^" . $k . "\" selected>" . $k . "</option>";
						}
					}
					$QteStr = "
						<div id=\"" . $CurrDivQteName . "\">
							<select name=\"" . $CurrQteName . "\" class=\"form_element\" style=\"text-align: right;\" onChange=\"SetQte(" . $CurrQteName . ")\" onFocus=\"ShowMessage('" . $CurrDivQteName . "', 'inform', '" . addslashes($lang["Duplication"]["Tooltip_Qte"]) . "', 'Up');\" onBlur=\"return nd();\">
							" . $LstQte . "
							</select>
						</div>\n";
				}
					
				//Matériel appartenant à ce groupe, afficher
				$ListMatosStr .= "
					<tr>
						<td class=\"listing_location_" . $CurrClass . "_droite\" style=\"width: 80px; color: #" . $MatosInGroup[$j]["Statut_Color"] . ";\">" . $QteStr . "</td>
						<td class=\"listing_location_" . $CurrClass . "_gauche\" style=\"width: 200px; color: #" . $MatosInGroup[$j]["Statut_Color"] . ";\">" . $MatosInGroup[$j]["Type_Materiel_Str"] . "</td>
						<td class=\"listing_location_" . $CurrClass . "_gauche\" style=\"width: 20%; color: #" . $MatosInGroup[$j]["Statut_Color"] . ";\">" . $MatosInGroup[$j]["Designation"] . "</td>
						<td class=\"listing_location_" . $CurrClass . "_gauche\" style=\"color: #" . $MatosInGroup[$j]["Statut_Color"] . ";\">" . $MatosInGroup[$j]["Modele"] . "</td>
						<td class=\"listing_location_" . $CurrClass . "_gauche\" style=\"width: 200px; color: #" . $MatosInGroup[$j]["Statut_Color"] . ";\">
							<div id=\"" . $CurrDivNumName . "\" style=\"float: left; width: 15px; text-align: center;\">
								" . $Use_Serial_Str . "
							</div>
							<div style=\"float: left; padding-left: 10px; padding-top: 3px;\">
								" . $MatosInGroup[$j]["Internal"] . "
							</div>
						</td>
						<td class=\"listing_location_" . $CurrClass . "_gauche\" style=\"width: 125px; color: #" . $MatosInGroup[$j]["Statut_Color"] . ";\">" . $MatosInGroup[$j]["Statut_Str"] . "</td>
						<td class=\"listing_location_" . $CurrClass . "_centre\" style=\"width: 15px; color: #" . $MatosInGroup[$j]["Statut_Color"] . ";\">
							<div id=\"" . $CurrDivSelectName . "\" style=\"float: left;\">
								<input type=\"checkbox\" name=\"MatosList[]\" value=\"" . $j . "\" " . $MatosInGroup[$j]["Selected_Str"] . " onClick=\"SelectRef(this)\" onMouseOver=\"ShowMessage('" . $CurrDivSelectName . "', 'inform', '" . addslashes($lang["Duplication"]["Tooltip_Use_Ref"]) . "', 'UpLeft');\" onMouseOut=\"return nd();\">
							</div>
						</td>
					</tr>\n";
					
				$CurrLine++;
			}
		}
		$ListMatosStr .= "</table></div>\n";		
	}
	
	$_SESSION["MatosInGroup"] = $MatosInGroup;
	
	//Fonction courante
	$Fonction["Nom"] = $lang["Duplication"]["Fonction_Nom"];
	$_SESSION["Fonction"] = $Fonction;
	
	// Affichage page
	print "
	<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">
	
	<html>
	<head>
	<title>". $lang["Duplication"]["Titre_Page"] ."</title>
	<LINK REL=\"STYLESHEET\" TYPE=\"text/css\" HREF=\"planning.css\">
	<script type=\"text/javascript\" src=\"js/planning.js\"></script>
	<style type=\"text/css\">@import url(js/jscalendar-1.0/calendar-orange.css);</style>
	<script type=\"text/javascript\" src=\"js/jscalendar-1.0/calendar.js\"></script>
	<script type=\"text/javascript\" src=\"js/jscalendar-1.0/lang/calendar-fr.js\"></script>
	<script type=\"text/javascript\" src=\"js/jscalendar-1.0/calendar-setup.js\"></script>
	<script type=\"text/javascript\" src=\"js/overlib/overlib.js\"></script>
	<script type=\"text/javascript\" src=\"js/overlib/overlib_anchor.js\"></script>
	</head>

	<body onload=\"StartPage()\">
	<form action=\"" .$_SERVER["PHP_SELF"] . "\" method=\"post\" name=\"MainForm\">
	<div class=\"section_titre\">
		" . display_block_aide() . "
		". $lang["Duplication"]["Titre_Section_Location"] ."
	</div>
	<div class=\"section_block_location\" style=\"height: 180px; padding-bottom: 5px;\">
		<div style=\"float: right; width: 430px;\" class=\"text\">
			<div style=\"float: left; width: 120px; height: 12px; margin: auto;\">
				<div style=\"padding-top: 5px;\">
					" . $lang["Duplication"]["Remarques"] . "<br>
					<div id=\"Div_Remarques\" class=\"champ_formulaire_location\" style=\"padding: 4px 6px 4px 6px;\">
						<textarea name=\"Remarques\" rows=\"10\" cols=\"75\" class=\"form_element\" onKeyDown=\"CheckEnterKey(event, this)\" onFocus=\"select(); ShowMessage('Div_Remarques', 'inform', '" . addslashes($lang["Duplication"]["Tooltip_Remarques"]) . "', 'DownLeft');\" onBlur=\"return nd();\">" . $Duplication["Remarques"] . "</textarea>
					</div>
				</div>
			</div>
		</div>
		
		<div style=\"width: 550px; height: 180px;\" class=\"text\">
			<div class=\"section_block_contenu_location\">
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Duplication"]["Employe"] ."</div>
				<div style=\"float: left;\">
					<div class=\"champ_formulaire\" style=\"width: 350px;\">
						<div id=\"Div_Employe\" style=\"float: left;\">
							<select name=\"Employe_ID\" class=\"select_zone\" onChange=\"SubmitDoc()\" onFocus=\"ShowMessage('Div_Employe', 'inform', '" . addslashes($lang["Duplication"]["Tooltip_Employe"]) . "', 'Down');\" onBlur=\"return nd();\">
								<option value=\"0\" selected>". $lang["Duplication"]["Choisissez"] ."</option>
								" . $CreateurStr . "
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class=\"section_block_contenu_location\">
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Duplication"]["Client"] ."</div>
				<div style=\"float: left;\">
					<div class=\"champ_formulaire\" style=\"width: 350px;\">
						<div id=\"Div_Client\" style=\"float: left;\">
							<select name=\"Client_ID\" class=\"select_zone\" onChange=\"SubmitDoc()\" onFocus=\"ShowMessage('Div_Client', 'inform', '" . addslashes($lang["Duplication"]["Tooltip_Client"]) . "', 'Up');\" onBlur=\"return nd();\">
								<option value=\"0\" selected>". $lang["Duplication"]["Choisissez"] ."</option>
								" . $ClientStr . "
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class=\"section_block_contenu_location\">
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Duplication"]["Reference"] ."</div>
				<div style=\"float: left;\">
					<div class=\"champ_formulaire\" style=\"width: 350px;\">
						<div id=\"Div_Ref\" style=\"float: left;\">
							<input type=\"text\" name=\"Ref\" value=\"" . htmlspecialchars($Duplication["Ref"]) . "\" size=\"50\" maxLength=\"50\" class=\"form_element\" autocomplete=\"off\" onKeyDown=\"CheckEnterKey(event, this)\" onFocus=\"select(); ShowMessage('Div_Ref', 'inform', '" . addslashes($lang["Duplication"]["Tooltip_Ref"]) . "', 'Up');\" onBlur=\"return nd();\">
						</div>
					</div>
				</div>
			</div>
			<div class=\"section_block_contenu_location\">
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Duplication"]["Statut"] ."</div>
				<div style=\"float: left;\">
					" . $StatutStr  . "
				</div>
			</div>
			<div class=\"section_block_contenu_location\">
				<div style=\"float: right;\">
					<div class=\"champ_formulaire_location\" style=\"width: 100px; margin-right: 10px; height: 14px; padding-top: 4px;\">
						" . $DureeStr . "
					</div>
				</div>
				<div class=\"champ_description_location\" style=\"float: right; width: 80px;\">". $lang["Duplication"]["Duree"] ."</div>
				
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Duplication"]["Debut"] ."</div>
				<div style=\"float: left;\">
					" . $DateDepStr . "
				</div>
			</div>
			<div class=\"section_block_contenu_location\">
				<div style=\"float: right;\">
					<div class=\"champ_formulaire_location\" style=\"width: 100px; margin-right: 10px; height: 16px; padding-top: 2px;\">
						<div id=\"Div_Caution\">
							<input type=\"text\" name=\"Caution\" value=\"" . number_format($Duplication["Caution"], 2, ',', '') . "\" size=\"10\" maxLength=\"30\" class=\"form_element\" style=\"text-align: right; padding-right: 5px;\" autocomplete=\"off\" onKeyDown=\"CheckEnterKey(event, this)\" onKeyUp=\"CheckCaution(event, this, '" . number_format($Duplication["Caution"], 2, ',', '') . "')\" onFocus=\"select(); ShowMessage('Div_Caution', 'inform', '" . addslashes($lang["Duplication"]["Tooltip_Caution"]) . "', 'Up');\" onBlur=\"return nd();\"> &euro;
						</div>
					</div>
				</div>
				<div class=\"champ_description_location\" style=\"float: right; width: 80px;\">". $lang["Duplication"]["Caution"] ."</div>
				
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Duplication"]["Fin"] ."</div>
				<div style=\"float: left;\">
					" . $DateRetStr . "
				</div>
			</div>
		</div>
	</div>
	
	<div class=\"section_titre\" style=\"font-weight: normal;\">
		<b>". $lang["Duplication"]["Titre_Section_References"] ."</b> : <b><span id=\"MaxSel\">" . $MatosInGroup["Max_Selected"] . "</span></b>" . $lang["Duplication"]["Sur"] . " <b>" . $Duplication["Total_References"] . "</b>" . $lang["Duplication"]["Total"] . "
	</div>
	<div class=\"section_block\">
		<div style=\"width: 100%; text-align: left;\">
			<table border=\"0\" cellpadding=\"0\" cellspacing=\"2\" width=\"100%\" class=\"text\">
			<tr>
				<td class=\"listing_titre_centre\" style=\"width: 37px; text-align: left; padding-left: 3px;\">
					<img id=\"Groupes_Tous\" src=\"" . $User["Image_Path"] . "/list_close.png\" onClick=\"ToggleGroup('All')\" style=\"cursor: pointer;\" title=\"". $lang["Add_Location"]["Tooltip_Etendre_Tous"] ."\" alt=\"\">
				</td>
				<td class=\"listing_titre_centre\" style=\"width: 43px;\">". $lang["Duplication"]["Colonne_Qte"] ."</td>
				<td class=\"listing_titre_gauche\" style=\"width: 200px;\">". $lang["Duplication"]["Colonne_Type"] ."</td>
				<td class=\"listing_titre_gauche\" style=\"width: 20%;\">". $lang["Duplication"]["Colonne_Designation"] ."</td>
				<td class=\"listing_titre_gauche\">". $lang["Duplication"]["Colonne_Modele"] ."</td>
				<td class=\"listing_titre_gauche\" style=\"width: 185px;\">". $lang["Duplication"]["Colonne_Numero"] ."</td>
				<td class=\"listing_titre_gauche\" style=\"width: 150px;\">". $lang["Duplication"]["Colonne_Statut"] ."</td>
			</tr>
			</table>
		</div>
		<div style=\"width: 100%; height: " . $Available_Space . "px; text-align: left; overflow: auto; margin-bottom: 5px;\">
			" . $ListMatosStr . "
		</div>
	</div>
	
	<div class=\"section_titre\" style=\"width: 99.5%; height: 21px;\">
		<div class=\"colonne_action\" style=\"width: 33%;\">
			<input type=\"button\" class=\"button\" value=\"" . $lang["Duplication"]["Bouton_Creer"] . "\" onClick=\"" . $JS["Locations_Sauver_Duplication"] . "\">
		</div>
		<div class=\"colonne_action\" style=\"width: 33%;\">
			<input type=\"button\" class=\"button\" value=\"" . $lang["Duplication"]["Bouton_Annuler"] . "\" onClick=\"Cancel()\">
		</div>
		<div class=\"colonne_action\" style=\"width: 33%;\">
			<input type=\"button\" class=\"button\" value=\"" . $lang["Duplication"]["Bouton_Fermer"] . "\" onClick=\"self.close()\">
		</div>
	</div>
	<input type=\"hidden\" name=\"PHPSESSID\" value=\"" . session_id() . "\">
	<input type=\"hidden\" name=\"op\" value=\"do_add_duplication\">
	<input type=\"hidden\" name=\"Save\" value=\"0\">
	</form>
	
	</body>
	</html>

	<script language=\"JavaScript\">
	var Hauteur_Groupes = [];
	var Groupes_Tous = 'visible';
	var Original_DateDep = document.MainForm.Date_Depart.value;
	var Original_DateRet = document.MainForm.Date_Retour.value;
	var Original_HeureDep = document.MainForm.Heure_Depart.selectedIndex;
	var Original_HeureRet = document.MainForm.Heure_Retour.selectedIndex;
	
	function Cancel(){
		if (confirm(\"" . $lang["Duplication"]["Tooltip_Confirmation_Annulation"] . "\")){
			self.location.href = '" . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=view_location_init&Fiche_ID=" . $Duplication["Fiche_ID"] . "&Output=Screen';
		}
	}
	
	function Check_Dates(){
		var DateDep = document.MainForm.Date_Depart.value;
		//alert(DateDep);
		var DateRet = document.MainForm.Date_Retour.value;
		var HeureDep = document.MainForm.Heure_Depart.options[document.MainForm.Heure_Depart.selectedIndex].value;
		var HeureRet = document.MainForm.Heure_Retour.options[document.MainForm.Heure_Retour.selectedIndex].value;
		if (DateDep == '' || DateRet == '' || HeureDep == '' || HeureRet == '') {
			//Données manquantes, pas de calcul
			ShowMessage('DateDep', 'alert', '" . addslashes($lang["Duplication"]["Tooltip_Erreur_Dates_Manquantes"]) . "', 'Up');
			return false;
		} else {
			var Debut = DateDep + ' ' + HeureDep;
			var Fin = DateRet + ' ' + HeureRet;
			//alert(Debut + ' - ' + Fin);
			var D = /^(\d\d)\/(\d\d)\/(\d{4})\ (\d\d)\:(\d\d)$/.test(Debut);
			if (D) with (RegExp){
				var DtDateDebut = new Date($3, $2-1, $1 , $4, $5);
				var ValDateDebut = Date.parse(DtDateDebut);
			} else {
				return false;
			}
			var F = /^(\d\d)\/(\d\d)\/(\d{4})\ (\d\d)\:(\d\d)$/.test(Fin);
			if (F) with (RegExp){
				var DtDateFin = new Date($3, $2-1, $1 , $4, $5);
				var ValDateFin = Date.parse(DtDateFin);
			} else {
				return false;
			}
			//alert(ValDateDebut + ' - ' + ValDateFin);
			if(ValDateFin.valueOf() < ValDateDebut.valueOf() + 360000) {
				ShowMessage('DateDep', 'alert', '" . addslashes($lang["Duplication"]["Tooltip_Erreur_Dates"]) . "', 'Up');
				return false;
			} else {
				return true;
			}
		}
	}
	
	function CheckCaution(event, textbox, original_value){
		if (CheckInteger(event, textbox, original_value) == false){
			ShowMessage('Div_Caution', 'alert', '" . addslashes($lang["Duplication"]["Tooltip_Erreur_Touche"]) . "', 'Up');
		}
	}

	function CheckEnterKey(event, textbox){
		var keyCode = (event) ? event.keyCode : keyStroke.which;
		
		if (event.keyCode == 13){
			SubmitDoc();
		}
	}
	
	function CheckInteger(event, textbox, original_value){
		var keyCode = (event) ? event.keyCode : keyStroke.which;
		
		nd();
			
		//Tester contenu Qte
		Broken = false;
		for (var i = 0; i < textbox.value.length; i++){
			CurrChar = textbox.value.substring(i,i+1);
			if (isNaN(CurrChar)) {
				if (CurrChar != '.'){
					if (CurrChar != ','){
						NewVal = textbox.value.substring(0,i);
						Broken = true;
					}
				}
			}
		}
		if (Broken == true && textbox.value.length > 1){
			textbox.value = NewVal;
			return false;
		} else if (Broken == true && textbox.value.length == 1) {
			textbox.value = original_value;
			textbox.select();
			return false;
		} else {
			return true;
		}
	}
	
	function CreateLocation(){
		var CurrClient = document.MainForm.Client_ID.options[document.MainForm.Client_ID.selectedIndex].value;
		var CurrCreateur = document.MainForm.Employe_ID.options[document.MainForm.Employe_ID.selectedIndex].value;
		var CurrStatut = document.MainForm.Statut_ID.options[document.MainForm.Statut_ID.selectedIndex].value;
		
		var CurrCaution = document.MainForm.Caution.value.replace(/,/, '.');
		var floatCaution = parseFloat(CurrCaution);
		
		var CurrSelected = document.getElementById('MaxSel').innerHTML;
		
		if (CurrCreateur == '0'){
			ShowMessage('Div_Employe', 'alert', '" . addslashes($lang["Duplication"]["Tooltip_Erreur_Employe"]) . "', 'Down');
			return false;
		} else if (CurrClient == '0') {
			ShowMessage('Div_Client', 'alert', '" . addslashes($lang["Duplication"]["Tooltip_Erreur_Client"]) . "', 'Down');
			return false;
		} else if (CurrStatut == '0') {
			ShowMessage('Div_Statut_ID', 'alert', '" . addslashes($lang["Duplication"]["Tooltip_Erreur_Statut"]) . "', 'Up');
			return false;
		} else if (isNaN(floatCaution)){
			document.MainForm.Caution.value = '" . number_format($Duplication["Caution"], 2, ',', '') . "';
			document.MainForm.Caution.select();
			nd();
			ShowMessage('Div_Caution', 'alert', '" . addslashes($lang["Duplication"]["Tooltip_Erreur_Caution_NaN"]) . "', 'Up');
			return false;
		} else if (floatCaution < 0){
			document.MainForm.Caution.value = '" . number_format($Duplication["Caution"], 2, ',', '') . "';
			document.MainForm.Caution.select();
			nd();
			ShowMessage('Div_Caution', 'alert', '" . addslashes($lang["Duplication"]["Tooltip_Erreur_Caution_Subzero"]) . "', 'Up');
			return false;
		} else if (Check_Dates() == false){
			document.MainForm.Date_Depart.value = '" . $Duplication["Date_Depart_FR"] . "';
			ShowMessage('DateDep', 'alert', '" . addslashes($lang["Duplication"]["Tooltip_Erreur_Dates"]) . "', 'Down');
			return false;
		} else if (CurrSelected == 0){
			ShowMessage('Div_Ref_00', 'alert', '" . addslashes($lang["Duplication"]["Tooltip_Erreur_Reference_Vide"]) . "', 'UpLeft');
			return false;
		} else {
			if (confirm(\"" . $lang["Duplication"]["Confirmer_Copie_1"] . $Duplication["Fiche_ID"] . $lang["Duplication"]["Confirmer_Copie_2"] . "\")){
				document.MainForm.Save.value = '1';
				SubmitDoc();
			}
		}
	}
	
	function NoRights(){
		alert(\"" . $lang["Duplication"]["Tooltip_Erreur_Droits"] . "\");
	}
	
	function ResizeWindow(){
		self.moveTo(0,0);
		Width = '" . $User["Util_ResX"] . "';
		Height = '" . $User["Util_ResY"] . "';
		window.resizeTo(Width,Height);		
	}
	
	function SaveGroupHeights(){
		for (var i=0;i<" . $Dupli_Groupes["Max"] . ";i++){
			if (i < 10){
				Groupe = 'Groupe_0' + i;
			} else {
				Groupe = 'Groupe_' + i;
			}
			Hauteur_Groupes[i] = document.getElementById(Groupe).offsetHeight;
			//alert(Hauteur_Groupes[i]);
		}
	}
	
	function SelectRef(checkbox){
		if (checkbox.checked == 1){
			State = 1;
		} else {
			State = 0;
		}
		Line = checkbox.value;
		//alert(Line);
		self.location.href = '" . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=duplication_set_state&Line=' + Line + '&State=' + State;
	}
	
	function SetDate(Type){
		if (Check_Dates()){
			if (Type == 'Debut'){
				var CurrDate = document.MainForm.Date_Depart.value;
				var CurrHeure = document.MainForm.Heure_Depart.options[document.MainForm.Heure_Depart.selectedIndex].value;
			} else {
				var CurrDate = document.MainForm.Date_Retour.value;
				var CurrHeure = document.MainForm.Heure_Retour.options[document.MainForm.Heure_Retour.selectedIndex].value;
			}
			self.location.href='" . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=duplication_set_date&Type='+Type+'&Date='+CurrDate+'&Heure='+CurrHeure;
		} else {
			if (Type == 'Debut'){
				document.MainForm.Date_Depart.value = Original_DateDep;
				document.MainForm.Heure_Depart.selectedIndex = Original_HeureDep;
			} else {
				document.MainForm.Date_Retour.value = Original_DateRet;
				document.MainForm.Heure_Retour.selectedIndex = Original_HeureRet;
			}
		}
	}
	
	function SetQte(selectzone){
		var Qte = selectzone.options[selectzone.selectedIndex].value;
		self.location.href = '" . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=duplication_set_qte&Value=' + Qte;
	}
	
	function ShowPopup(Content){
		return overlib(Content, WIDTH, 125, HAUTO, VAUTO, FGCOLOR, '#FFD616', BGCOLOR, '#000000');
	}
	
	function StartForm(){
		clearTimeout(Timer)
		for (i=0;i<document.MainForm.elements.length;i++){
			//alert(document.MainForm.elements[i].type);
			if (document.MainForm.elements[i].type == 'text'){
				if (document.MainForm.elements[i].value == '' || document.MainForm.elements[i].value == '0' || document.MainForm.elements[i].value == '0,00'){
					document.MainForm.elements[i].focus();
					break;
				}
			} else if (document.MainForm.elements[i].type == 'select-one') {
				if (document.MainForm.elements[i].selectedIndex == 0){
					document.MainForm.elements[i].focus();
					break;
				}
			}
		}
	}
	
	function StartPage(){
		ResizeWindow();
		SaveGroupHeights();
		Timer = setTimeout('StartForm()',250);
	}
	
	function SubmitDoc(){
		document.MainForm.submit();
	}
	
	function TestAccountLocked(){
		alert(\"" . $lang["Duplication"]["Test_Account_Locked"] . "\");
	}
	
	function ToggleGroup(Numero){
		if (Numero != 'All'){
			var Groupe = 'Groupe_' + Numero;
			var Icone = 'Groupe_Img_' + Numero;
			
			//alert(document.getElementById('Groupe_00').style.visibility);
			if (document.getElementById(Groupe).style.visibility == 'visible'){
				document.getElementById(Groupe).style.visibility = 'hidden';
				document.getElementById(Groupe).style.height = '0px';
				document.getElementById(Icone).src = '" . $User["Image_Path"] . "/list_open.png';
			} else {
				floatNumero = parseFloat(Numero);
				document.getElementById(Groupe).style.visibility = 'visible';
				document.getElementById(Groupe).style.height = Hauteur_Groupes[floatNumero] + 'px';
				document.getElementById(Icone).src = '" . $User["Image_Path"] . "/list_close.png';
			}
		} else {
			if (Groupes_Tous == 'visible'){
				var State = 'hidden';
				var Src = 'list_open.png';
				document.getElementById('Groupes_Tous').src = '" . $User["Image_Path"] . "/list_open.png';
				var Groupes_Tous = 'hidden';
			} else {
				var State = 'visible';
				var Src = 'list_close.png';
				document.getElementById('Groupes_Tous').src = '" . $User["Image_Path"] . "/list_close.png';
				var Groupes_Tous = 'visible';
			}
			
			for (var i=0;i<" . $Dupli_Groupes["Max"] . ";i++){
				if (i < 10){
					Groupe = 'Groupe_0' + i;
					Icone = 'Groupe_Img_0' + i;
				} else {
					Groupe = 'Groupe_' + i;
					Icone = 'Groupe_Img_' + i;
				}
				
				document.getElementById(Groupe).style.visibility = State;
				document.getElementById(Icone).src = '" . $User["Image_Path"] . "/' + Src;
				if (State == 'hidden'){
					document.getElementById(Groupe).style.height = '0px';
				} else {
					document.getElementById(Groupe).style.height = Hauteur_Groupes[i] + 'px';
				}
			}
			
		}
	}
	
	function UseSerial(checkbox){
		if (checkbox.checked == 1){
			var State = 1;
		} else {
			var State = 0;
		}
		var Line = checkbox.value;
		//alert(Line);
		self.location.href = '" . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=duplication_use_serial&Line=' + Line + '&State=' + State;
	}
	</script>\n";
}

///////////////////////////////////////////////////////////
///      Calcul de la date de fin si durée modifiée dans Dupli	     ///
///////////////////////////////////////////////////////////
function duplication_set_date($Type, $Date, $Heure){
	$Duplication = $_SESSION["Duplication"];
	
	if ($Type == "Debut"){
		//Date début modifiée, transférer info
		$Duplication["Date_Depart_FR"] = $Date;
		$Duplication["Date_Depart_EN"] = substr($Duplication["Date_Depart_FR"],6,4) . "-" . substr($Duplication["Date_Depart_FR"],3,2) . "-" . substr($Duplication["Date_Depart_FR"],0,2);
		$Duplication["Heure_Depart"] = $Heure;
	} else {
		//Date début modifiée, transférer info
		$Duplication["Date_Retour_FR"] = $Date;
		$Duplication["Date_Retour_EN"] = substr($Duplication["Date_Retour_FR"],6,4) . "-" . substr($Duplication["Date_Retour_FR"],3,2) . "-" . substr($Duplication["Date_Retour_FR"],0,2);
		$Duplication["Heure_Retour"] = $Heure;
	}
	
	//Recalculer durée selon dates existantes
	$Date_Start = strtotime($Duplication["Date_Depart_EN"] . " " . $Duplication["Heure_Depart"]. " GMT");
	$Date_End = strtotime($Duplication["Date_Retour_EN"] . " " . $Duplication["Heure_Retour"]. " GMT");
	$Duree = $Date_End - $Date_Start;
	//print "Durée calculée : $Duree<br>";
	$Duree_Estimee = $Duree / 3600;
	//print "Durée estimée en heures : $Duree_Estimee";
	if ($Duree_Estimee < 24){
		$Duplication["Duree"] = 1;
	} else {
		$Jours_Estimes = round($Duree_Estimee / 24);
		//print "Durée estimée en Jours : $Jours_Estimes";
		
		//Offset sur heure si départ matin retour soir
		$Date_Start = strtotime($Duplication["Date_Depart_EN"] . " " . $Duplication["Heure_Depart"]. " GMT");
		$Date_End = strtotime($Duplication["Date_Depart_EN"] . " " . $Duplication["Heure_Retour"]. " GMT");
		$Offset = ($Date_End - $Date_Start) / 3600;
		//print "Offset heures trouvées : $Offset<br>";
		if ($Offset > 6){
			$Jours_Estimes++;
			//print "Durée estimée en Jours avec offset : $Jours_Estimes";
		}
		$Duplication["Duree"] = $Jours_Estimes;
	}
		
	$_SESSION["Duplication"] = $Duplication;
	
	duplication();
}

///////////////////////////////////////////////////////////
///             Fonction qte d'une ref dans la duplication			///
///////////////////////////////////////////////////////////
function duplication_set_qte($Value){
	$MatosInGroup = $_SESSION["MatosInGroup"];
	
	$NewVal = explode("^", $Value);
	
	
	$MatosInGroup[$NewVal[0]]["Qte"] = $NewVal[1];
	
	$_SESSION["MatosInGroup"] = $MatosInGroup;
	
	duplication();
}

///////////////////////////////////////////////////////////
///             Fonction etat d'une ref dans la duplication			///
///////////////////////////////////////////////////////////
function duplication_set_state($Line, $State){
	$MatosInGroup = $_SESSION["MatosInGroup"];
	
	$MatosInGroup[$Line]["Selected"] = $State;
	if ($State == 0){
		$MatosInGroup[$Line]["Selected_Str"] = "";
	} else {
		$MatosInGroup[$Line]["Selected_Str"] = "checked";
	}
	
	$_SESSION["MatosInGroup"] = $MatosInGroup;
	
	duplication();
}

///////////////////////////////////////////////////////////
///             Fonction etat d'une ref dans la duplication			///
///////////////////////////////////////////////////////////
function duplication_use_serial($Line, $State){
	$MatosInGroup = $_SESSION["MatosInGroup"];
	
	$MatosInGroup[$Line]["Use_Serial"] = $State;
	if ($State == 0){
		$MatosInGroup[$Line]["Use_Serial_Str"] = "";
	} else {
		$MatosInGroup[$Line]["Use_Serial_Str"] = "checked";
	}
	
	$_SESSION["MatosInGroup"] = $MatosInGroup;
	
	duplication();
}

///////////////////////////////////////////////////////////
///  		Fonction init Modification paramètres Fiche 		///
///////////////////////////////////////////////////////////
function modif_param_init(){
	global $db;
	
	$Groupes = $_SESSION["Groupes"];
	$Location = $_SESSION["Location"];
	
	//Copier intégralité de la location originale dans $Modification
	$Modification = $Location;
	$_SESSION["Modification"] = $Modification;

	//Rattraper la liste des emplacements pour gestion de la disponibilité
	$ListResaStr = "";
	$Filtre = "
		Select
			Locations_Materiels.ID as Record_ID, Inventaire.ID as Materiel_ID, Inventaire.Designation, Inventaire.Modele, Inventaire.Num_Interne
		from
			Locations_Materiels, Inventaire
		where
			Fiche_ID = '" . $Location["Fiche_ID"] . "' and Inventaire.Statut = '0' and Inventaire.ID = Locations_Materiels.Materiel_ID
		order by Locations_Materiels.ID asc";
	//echo $Filtre;
	mysql_query("SET NAMES 'utf8'");
	$sql = mysql_query($Filtre,$db);

	$MatosInGroup["Max"] = 0;
	while ($ListResa = mysql_fetch_array($sql)){
		//Créer un groupe si besoin
		$FoundGroup = -1;
		for ($i=0;$i<$Groupes["Max_Materiels"];$i++){
			if ($ListResa["Designation"] == $Groupes["Materiels"][$i]["Nom"]){
				//Matériel appartenant à un groupe... Sauver info
				$FoundGroup = $i;
				//echo "Trouvé : " . $ListResa["Designation"] . "<br />";
				break;
			}
		}
		
		//Ajouter le matériel à la liste du matériel
		$MatosInGroup[$MatosInGroup["Max"]]["Group_ID"] = $FoundGroup;
		
		$MatosInGroup[$MatosInGroup["Max"]]["Record_ID"] = $ListResa["Record_ID"];
		$MatosInGroup[$MatosInGroup["Max"]]["Materiel_ID"] = $ListResa["Materiel_ID"];
		$MatosInGroup[$MatosInGroup["Max"]]["Designation"] = $ListResa["Designation"];
		$MatosInGroup[$MatosInGroup["Max"]]["Modele"] = $ListResa["Modele"];
		$MatosInGroup[$MatosInGroup["Max"]]["Internal"] = $ListResa["Num_Interne"];
		
		//Augmenter ID matériel traité
		$MatosInGroup["Max"]++;
	}
	
	$_SESSION["MatosInGroup"] = $MatosInGroup;

	modif_param();
}

///////////////////////////////////////////////////////////
///  		Fonction Modification paramètres Fiche 		///
///////////////////////////////////////////////////////////
function modif_param(){
	global $db, $lang;
	
	//$Groupes = $_SESSION["Groupes"];
	$JS = $_SESSION["JS"];
	$Location = $_SESSION["Location"];
	$MatosInGroup = $_SESSION["MatosInGroup"];
	$Modification = $_SESSION["Modification"];
	$Palette = $_SESSION["Palette"];
	$User = $_SESSION["User"];
	
	//Création des zones d'heure
	$Exact_Day = date("d");
	$Exact_Month = date("m");
	$Exact_Year = date("Y");

	$HeureDepStr = "
		<select name=\"Heure_Depart\" class=\"form_element\" onChange=\"SetDate('Debut')\" onFocus=\"ShowMessage('HeureDep', 'inform', '" . addslashes($lang["Modif_Param"]["Tooltip_Heuredep"]) . "', 'Up');\" onBlur=\"return nd();\">\n";
	$HeureRetStr = "
		<select name=\"Heure_Retour\" class=\"form_element\" onChange=\"SetDate('Fin')\" onFocus=\"ShowMessage('HeureRet', 'inform', '" . addslashes($lang["Modif_Param"]["Tooltip_Heureret"]) . "', 'Up');\" onBlur=\"return nd();\">\n";

	for ($i=0;$i<24;$i++){
		$CurrTime = date("H:i", mktime($i, 0, 0, $Exact_Month, $Exact_Day, $Exact_Year));
		if ($Modification["Heure_Depart"] != $CurrTime){
			$HeureDepStr .= "<option value=\"" . $CurrTime . "\">" . $CurrTime . "</option>\n";
		} else {
			$HeureDepStr .= "<option value=\"" . $CurrTime . "\" selected>" . $CurrTime . "</option>\n";
		}
		if ($Modification["Heure_Retour"] != $CurrTime){
			$HeureRetStr .= "<option value=\"" . $CurrTime . "\">" . $CurrTime . "</option>\n";
		} else {
			$HeureRetStr .= "<option value=\"" . $CurrTime . "\" selected>" . $CurrTime . "</option>\n";
		}
	}
	$HeureDepStr .= "</select>\n";
	$HeureRetStr .= "</select>\n";
		
	$DateDepStr = "
		<div class=\"champ_formulaire_location\" style=\"width: 240px; height: 18px;\">
			<div id=\"DateDep\" style=\"float: left; margin-top: 2px;\">
				<input type=\"text\" id=\"Date_Depart\" name=\"Date_Depart\" value=\"" . $Modification["Date_Depart_FR"] . "\" size=\"11\" maxLength=\"10\" class=\"form_element\" readonly=\"readonly\">
			</div>
			<div id=\"DateDepIcon\" style=\"float: left; padding-left: 5px; margin-top: 4px;\">
				<img src=\"images/software_icons/calendrier.png\" width=\"25\" border=\"0\" id=\"trigger_dd\" style=\"cursor: pointer; vertical-align: middle;\" onMouseOver=\"ShowMessage('DateDepIcon', 'inform', '" . addslashes($lang["Modif_Param"]["Tooltip_Datedep_Icon"]) . "', 'Down');\" onMouseOut=\"return nd();\" />
			</div>
			<script type=\"text/javascript\">
				function DoSelect1(calendar, date) {
					var input_field = document.getElementById(\"Date_Depart\");
					input_field.value = date;
					if (calendar.dateClicked) {
						calendar.callCloseHandler(); // this calls \"onClose\" (see above)
						SetDate('Debut');
					}
				};
				Calendar.setup(
					{
						inputField : \"Date_Depart\",
						ifFormat : \"%d/%m/%Y\",
						firstDay : 1,
						showsTime : false,
						button : \"trigger_dd\",
						onSelect : DoSelect1
					}
				);
			</script>
			<div style=\"float: left; padding-left: 5px; margin-top: 5px;\">" . $lang["Modif_Param"]["A"] . "</div>
			<div id=\"HeureDep\" style=\"float: left; padding-left: 5px; margin-top: 3px;\">
				" . $HeureDepStr . "
			</div>
		</div>\n";
			
	$DateRetStr = "
		<div class=\"champ_formulaire_location\" style=\"width: 240px; height: 18px;\">
			<div id=\"DateRet\" style=\"float: left; margin-top: 2px;\">
				<input type=\"text\" id=\"Date_Retour\" name=\"Date_Retour\" value=\"" . $Modification["Date_Retour_FR"] . "\" size=\"11\" maxLength=\"10\" class=\"form_element\" readonly=\"readonly\">
			</div>
			<div id=\"DateRetIcon\" style=\"float: left; padding-left: 5px; margin-top: 4px;\">
				<img src=\"images/software_icons/calendrier.png\" width=\"25\" border=\"0\" id=\"trigger_dr\" style=\"cursor: pointer; vertical-align: middle;\" onMouseOver=\"ShowMessage('DateRetIcon', 'inform', '" . addslashes($lang["Modif_Param"]["Tooltip_Dateret_Icon"]) . "', 'Down');\" onMouseOut=\"return nd();\" />
			</div>
			<script type=\"text/javascript\">
				function DoSelect2(calendar, date) {
					var input_field = document.getElementById(\"Date_Retour\");
					input_field.value = date;
					if (calendar.dateClicked) {
						calendar.callCloseHandler(); // this calls \"onClose\" (see above)
						SetDate('Fin');
					}
				};

				Calendar.setup(
					{
						inputField : \"Date_Retour\",
						ifFormat : \"%d/%m/%Y\",
						firstDay : 1,
						showsTime : false,
						button : \"trigger_dr\",
						onSelect : DoSelect2
					}
				);
			</script>
			<div style=\"float: left; padding-left: 5px; margin-top: 5px;\">" . $lang["Modif_Param"]["A"] . "</div>
			<div id=\"HeureRet\" style=\"float: left; padding-left: 5px; margin-top: 3px;\">
				" . $HeureRetStr . "
			</div>
		</div>\n";
			
	//Statut : liste et bulle d'information
	$tooltip_statut = "<div style='height: 5px;'></div>";
	$CurrStatus = $Modification["Statut_ID"] -1;
	$LstStatuts = "";
	for ($i=0;$i<$Palette["Max_Palette"];$i++){
		if ($Modification["Statut_ID"] != $Palette["ID"][$i]){
			$LstStatuts .= "<option value=\"" . $Palette["ID"][$i] . "\">" . $Palette["Statut"][$i] . "</option>\n";
		} else {
			$LstStatuts .= "<option value=\"" . $Palette["ID"][$i] . "\" selected>" . $Palette["Statut"][$i] . "</option>\n";
		}
		$tooltip_statut .= "<div class='statut' style='color: #" . $Palette["Police_Hex"][$i] . "; background-color: #" . $Palette["Couleur_Hex"][$i] . ";'>". $Palette["Statut"][$i] ."</div>";
		$tooltip_statut .= "<div style='height: 2px;'></div>";
		
	}
	$tooltip_statut .= "<div style='height: 3px;'></div>";
	$tooltip_statut = addslashes($tooltip_statut);
	
	$StatutStr = "
		<div class=\"champ_formulaire_location\" style=\"width: 430px; height: 16px; padding-top: 2px;\">
			<div id=\"Div_Statut_ID\" style=\"float: left;\">
				<select name=\"Statut_ID\" class=\"form_element\" onChange=\"SubmitDoc()\" onFocus=\"ShowMessage('Div_Statut_ID', 'inform', '" . addslashes($lang["Modif_Param"]["Tooltip_Statut"]) . "', 'Down');\" onBlur=\"return nd();\">
					" . $LstStatuts . "
				</select>
			</div>
			<div style=\"float: left; padding-left: 5px;\">
				<img src=\"" . $User["Image_Path"] . "/information.png\" alt=\"\" style=\"width: 16px; cursor: pointer;\" onMouseOver=\"ShowPopup('" . $tooltip_statut . "')\" onMouseOut=\"return nd();\">
			</div>
		</div>\n";
		
	//Liste des Durées
	$ListDuree = "";
	for ($i=1;$i<366;$i++){
		if ($Modification["Duree"] != $i){
			$ListDuree .= "<option value=\"" . $i . "\">" . $i . "</option>\n";
		} else {
			$ListDuree .= "<option value=\"" . $i . "\" selected>" . $i . "</option>\n";
		}
	}
	if ($Modification["Duree"] != 1){
		$NuitsStr = $lang["Modif_Param"]["Nuits"];
	} else {
		$NuitsStr = $lang["Modif_Param"]["Nuit"];
	}
		
	$DureeStr = "
		<div id=\"Div_Duree\" style=\"float: left;\">
			<select name=\"Duree\" class=\"form_element\" onChange=\"SubmitDoc()\" style=\"text-align: right; margin-right: 5px;\" onFocus=\"ShowMessage('Div_Duree', 'inform', '" . addslashes($lang["Modif_Param"]["Tooltip_Duree"]) . "', 'UpLeft');\" onBlur=\"return nd();\">
				" . $ListDuree . "
			</select>
		</div>
		<div style=\"float: left; padding-top: 2px;\">
			" . $NuitsStr . "
		</div>\n";
	
	//Liste des Employés pour ce compte utilisateur
	select_client_db();
	mysql_query("SET NAMES 'utf8'");
	$Filtre = "Select * from Utilisateurs_Employes where User_ID = '" . $User["User_ID"] . "' order by Nom asc";
	//print $Filtre;
	$sql = mysql_query($Filtre,$db);
	$MaxEmployes = mysql_numrows($sql);
	$CreateurStr = "";
	if ($MaxEmployes == 1){
		$CreateurStr = "<option value=\"" . mysql_result($sql,0,"Employe_ID") . "\" selected>" . mysql_result($sql,0,"Nom") . "</option>\n";
		$Modification["Employe_ID"] = mysql_result($sql,0,"Employe_ID");
	} else {
		while ($row = mysql_fetch_array($sql)){
			if ($row["Employe_ID"] == $Modification["Employe_ID"]){
				$CreateurStr .= "<option value=\"" . $row["Employe_ID"] . "\" selected>" . $row["Nom"] . "</option>\n";
			} else {
				$CreateurStr .= "<option value=\"" . $row["Employe_ID"] . "\">" . $row["Nom"] . "</option>\n";
			}
		}
	}
	select_version_db();
	
	$Filtre = "
		Select
			Inventaire.Designation, count(Inventaire.Designation) as Qte
		from
			Locations_Materiels, Inventaire
		where
			Fiche_ID = " . $Location["Fiche_ID"] . " and Inventaire.ID = Locations_Materiels.Materiel_ID and Inventaire.Statut = '0'
		group by
			Inventaire.Designation
		order by
			Locations_Materiels.ID asc";
	//echo $Filtre . "<br />";
	//exit;
	$sql = mysql_query($Filtre,$db);
	while ($row = mysql_fetch_array($sql)){
		$Groupes["Materiels"][$Groupes["Max_Materiels"]]["Nom"] = $row["Designation"];
		$Groupes["Materiels"][$Groupes["Max_Materiels"]]["Max"] = $row["Qte"];
		$Groupes["Max_Materiels"]++;
	}
	
	//Traitement selon dates sélectionnées ou pas
	$Max_Dispo = 0;
	if ($Modification["Date_Depart_EN"] != "" && $Modification["Date_Retour_EN"] != "" && $Modification["Heure_Depart"] != "" && $Modification["Heure_Retour"] != ""){
		//Remise en forme dates
		$NewDateDep = $Modification["Date_Depart_EN"] . " " . $Modification["Heure_Depart"] . ":00";
		$NewDateRet = $Modification["Date_Retour_EN"] . " " . $Modification["Heure_Retour"] . ":00";

		//Indiquer machines en attente
		for ($i=0;$i<$MatosInGroup["Max"];$i++){
			//N° de série demandé... Regarder si CE matériel est libre
			$FiltreFree = "
				Select Fiche_ID FROM Locations_Materiels where
					Fiche_ID != '" . $Modification["Fiche_ID"] . "' and Materiel_ID = " . $MatosInGroup[$i]["Materiel_ID"] . " and
					((Locations_Materiels.DateDep >= '" . $NewDateDep . "' AND Locations_Materiels.DateRet <= '" . $NewDateRet . "' ) OR 
					(Locations_Materiels.DateDep >= '" . $NewDateDep . "' AND Locations_Materiels.DateDep < '" . $NewDateRet . "') OR
					(Locations_Materiels.DateRet >= '" . $NewDateRet . "' AND Locations_Materiels.DateDep <= '" . $NewDateDep . "') OR
					(Locations_Materiels.DateRet >= '" . $NewDateDep . "' AND Locations_Materiels.DateRet < '" . $NewDateRet . "'))
				order by DateDep asc limit 0,1";
			//print $FiltreFree . "<br>";
			$resultFree = mysql_query($FiltreFree,$db);
			if (mysql_numrows($resultFree) != 0){
				$MatosInGroup[$i]["Statut"] = -1;
				$MatosInGroup[$i]["Statut_Str"] = $lang["Modif_Param"]["Indisponible"];
				$MatosInGroup[$i]["Statut_Color"] = "FF0000";
				$MatosInGroup[$i]["Final_Materiel_ID"] = 0;
			} else {
				$MatosInGroup[$i]["Statut"] = 1;
				$MatosInGroup[$i]["Statut_Str"] = $lang["Modif_Param"]["Disponible"];
				$MatosInGroup[$i]["Statut_Color"] = "008000";
				$MatosInGroup[$i]["Final_Materiel_ID"] = $MatosInGroup[$i]["Materiel_ID"];
				$Max_Dispo++;
			}
		}
	} else {
		//Indiquer machines en attente
		for ($i=0;$i<$MatosInGroup["Max"];$i++){
			$MatosInGroup[$i]["Statut"] = 0;
			$MatosInGroup[$i]["Statut_Str"] = $lang["Modif_Param"]["En_Attente"];
			$MatosInGroup[$i]["Final_Materiel_ID"] = -1;
			$MatosInGroup[$i]["Statut_Color"] = "0000FF";
		}
	}

	//La liste est prête, contsruire tableau
	$ListMatosStr = "";
	for ($i=0;$i<$Groupes["Max_Materiels"];$i++){
		$ListMatosStr .= "
			<div class=\"group_header\">
				<div class=\"group_name\">
					<b>" . $Groupes["Materiels"][$i]["Nom"] . "</b> ( Qté : <b>" . $Groupes["Materiels"][$i]["Max"] . "</b> )
				</div>
			</div>
			<div class=\"group\">
				<table border=\"0\" cellpadding=\"0\" cellspacing=\"2\" width=\"100%\" class=\"text\">\n";
	
		//Afficher matériels de ce groupe
		$CurrLine = 0;
		for ($j=0;$j<$MatosInGroup["Max"];$j++){
			if ($MatosInGroup[$j]["Group_ID"] == $i){
				if ($CurrLine % 2 == 0){
					$CurrClass = "impaire";
				} else {
					$CurrClass = "paire";
				}
				
				//Matériel appartenant à ce groupe, afficher
				$ListMatosStr .= "
					<tr>
						<td class=\"listing_location_" . $CurrClass . "_gauche\" style=\"color: #" . $MatosInGroup[$j]["Statut_Color"] . ";\">" . $MatosInGroup[$j]["Modele"] . "</td>
						<td class=\"listing_location_" . $CurrClass . "_centre\" style=\"width: 150px; color: #" . $MatosInGroup[$j]["Statut_Color"] . ";\">" . $MatosInGroup[$j]["Internal"] . "</td>
						<td class=\"listing_location_" . $CurrClass . "_centre\" style=\"width: 120px; color: #" . $MatosInGroup[$j]["Statut_Color"] . ";\">" . $MatosInGroup[$j]["Statut_Str"] . "</td>
					</tr>\n";
					
				$CurrLine++;
			}
		}
		$ListMatosStr .= "</table></div>\n";		
	}
	
	$_SESSION["MatosInGroup"] = $MatosInGroup;
	$_SESSION["Modification"] = $Modification;
	
	$Fonction["Nom"] = $lang["Modif_Param"]["Fonction_Nom"];
	$_SESSION["Fonction"] = $Fonction;
	
	print "
	<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">
	
	<html>
	<head>
	<title>". $lang["Modif_Param"]["Titre_Page"] ."</title>
	<script type=\"text/javascript\" src=\"js/planning.js\"></script>
	<script type=\"text/javascript\" src=\"js/overlib/overlib.js\"></script>
	<script type=\"text/javascript\" src=\"js/overlib/overlib_anchor.js\"></script>
	<style type=\"text/css\">@import url(js/jscalendar-1.0/calendar-orange.css);</style>
	<script type=\"text/javascript\" src=\"js/jscalendar-1.0/calendar.js\"></script>
	<script type=\"text/javascript\" src=\"js/jscalendar-1.0/lang/calendar-fr.js\"></script>
	<script type=\"text/javascript\" src=\"js/jscalendar-1.0/calendar-setup.js\"></script>
	<LINK REL=\"STYLESHEET\" TYPE=\"text/css\" HREF=\"planning.css\">
	</head>
	
	<body onload=\"StartPage()\">
	<form action=\"" . $_SERVER["PHP_SELF"] . "\" method=\"post\" name=\"MainForm\">
	<div class=\"section_titre\" style=\"width: 99.5%;\">
		" . display_block_aide() . "
		". $lang["Modif_Param"]["Titre_Section"] ."
	</div>
	<div class=\"section_block_location\" style=\"height: 100px; padding-bottom: 10px;\">
		<div style=\"width: 550px; height: 100px; padding-top: 10px;\" class=\"text\">
			<div class=\"section_block_contenu_location\">
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Modif_Param"]["Employe"] ."</div>
				<div style=\"float: left;\">
					<div class=\"champ_formulaire_location\" style=\"width: 430px; height: 16px; padding-top: 3px;\">
						<div id=\"Div_Employe\" style=\"float: left;\">
							<select name=\"Employe_ID\" class=\"select_zone\" onChange=\"SubmitDoc()\" onFocus=\"ShowMessage('Div_Employe', 'inform', '" . addslashes($lang["Modif_Param"]["Tooltip_Employe"]) . "', 'Down');\" onBlur=\"return nd();\">
								<option value=\"0\" selected>". $lang["Modif_Param"]["Choisissez"] ."</option>
								" . $CreateurStr . "
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class=\"section_block_contenu_location\">
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Modif_Param"]["Statut"] ."</div>
				<div style=\"float: left;\">
					" . $StatutStr  . "
				</div>
			</div>
			<div class=\"section_block_contenu_location\">
				<div style=\"float: right;\">
					<div class=\"champ_formulaire_location\" style=\"width: 100px; margin-right: 10px; height: 14px; padding-top: 4px;\">
						" . $DureeStr . "
					</div>
				</div>
				<div class=\"champ_description_location\" style=\"float: right; width: 80px;\">". $lang["Modif_Param"]["Duree"] ."</div>
				
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Modif_Param"]["Debut"] ."</div>
				<div style=\"float: left;\">
					" . $DateDepStr . "
				</div>
			</div>
			<div class=\"section_block_contenu_location\">
				<div class=\"champ_description_location\" style=\"width: 100px;\">". $lang["Modif_Param"]["Fin"] ."</div>
				<div style=\"float: left;\">
					" . $DateRetStr . "
				</div>
			</div>
		</div>
	</div>

	<div class=\"section_titre\">
		". $lang["Modif_Param"]["Titre_Section_References"] ."
	</div>
	<div class=\"section_block\">
		<div style=\"width: 99%; text-align: left;\">
			<table border=\"0\" cellpadding=\"0\" cellspacing=\"2\" width=\"100%\" class=\"text\">
			<tr>
				<td class=\"listing_titre_gauche\">". $lang["Modif_Param"]["Modele"] ."</td>
				<td class=\"listing_titre_centre\" style=\"width: 120px;\">". $lang["Modif_Param"]["Numero"] ."</td>
				<td id=\"Div_Dispo\" class=\"listing_titre_centre\" style=\"width: 150px;\">". $lang["Modif_Param"]["Colonne_Statut"] ."</td>
			</tr>
			</table>
		</div>
		<div style=\"width: 99%; height: 250px; text-align: left; overflow: auto; margin-bottom: 5px;\">
			" . $ListMatosStr . "
		</div>
	</div>
	
	<div class=\"section_titre\" style=\"height: 21px;\">
		<div class=\"colonne_action\" style=\"width: 50%;\">
			<input type=\"button\" class=\"button\" value=\"" . $lang["Modif_Param"]["Bouton_Sauver"] . "\" onClick=\"" . $JS["Locations_Sauver_Modifications"] . "\">
		</div>
		<div class=\"colonne_action\" style=\"width: 50%;\">
			<input type=\"button\" class=\"button\" value=\"" . $lang["Modif_Param"]["Bouton_Fermer"] . "\" onClick=\"self.close();\">
		</div>
	</div>
	<input type=\"hidden\" name=\"PHPSESSID\" value=\"" . session_id() . "\">
	<input type=\"hidden\" name=\"op\" value=\"do_modif_param\">
	<input type=\"hidden\" name=\"Save\" value=\"0\">
	</form>
	
	</body>
	</html>
	
	<script language=\"JavaScript\">
	var Original_DateDep = document.MainForm.Date_Depart.value;
	var Original_DateRet = document.MainForm.Date_Retour.value;
	
	function Check_Dates(){
		var DateDep = document.MainForm.Date_Depart.value;
		var DateRet = document.MainForm.Date_Retour.value;
		var HeureDep = document.MainForm.Heure_Depart.options[document.MainForm.Heure_Depart.selectedIndex].value;
		var HeureRet = document.MainForm.Heure_Retour.options[document.MainForm.Heure_Retour.selectedIndex].value;
		if (DateDep == '' || DateRet == '' || HeureDep == '' || HeureRet == '') {
			//Données manquantes, pas de calcul
			ShowMessage('DateDep', 'alert', '" . addslashes($lang["Modif_Param"]["Tooltip_Erreur_Dates_Manquantes"]) . "', 'Up');
			//alert(\"" . $lang["Modif_Param"]["Tooltip_Erreur_Dates_Manquantes"] . "\");
			return false;
		} else {
			var Debut = DateDep + ' ' + HeureDep;
			var Fin = DateRet + ' ' + HeureRet;
			//alert(Debut + ' - ' + Fin);
			var D = /^(\d\d)\/(\d\d)\/(\d{4})\ (\d\d)\:(\d\d)$/.test(Debut);
			if (D) with (RegExp){
				var DtDateDebut = new Date($3, $2-1, $1 , $4, $5);
				var ValDateDebut = Date.parse(DtDateDebut);
			} else {
				//alert(\"La Date de début de la Location doit être au format JJ/MM/AAAA !\");
				return false;
			}
			var F = /^(\d\d)\/(\d\d)\/(\d{4})\ (\d\d)\:(\d\d)$/.test(Fin);
			if (F) with (RegExp){
				var DtDateFin = new Date($3, $2-1, $1 , $4, $5);
				var ValDateFin = Date.parse(DtDateFin);
			} else {
				//alert(\"La Date de fin de la Location doit être au format JJ/MM/AAAA !\");
				return false;
			}
			//alert(ValDateDebut + ' - ' + ValDateFin);
			if(ValDateFin.valueOf() < ValDateDebut.valueOf() + 360000) {
				ShowMessage('DateDep', 'alert', '" . addslashes($lang["Modif_Param"]["Tooltip_Erreur_Dates"]) . "', 'Up');
				return false;
			} else {
				return true;
			}
		}
	}
	
	function CheckForm(){
		if ('" . $Max_Dispo . "' != '0'){
			CurrCreateur = document.MainForm.Employe_ID.options[document.MainForm.Employe_ID.selectedIndex].value;
			if (CurrCreateur == '0'){
				ShowMessage('Div_Employe', 'alert', '" . addslashes($lang["Modif_Param"]["Tooltip_Erreur_Employe"]) . "', 'Down');
				return false;
			} else if (Check_Dates() == false){
				document.MainForm.Date_Depart.value = '" . $Modification["Date_Depart_FR"] . "';
				document.MainForm.Date_Depart.value = '" . $Modification["Date_Retour_FR"] . "';
				ShowMessage('DateDep', 'alert', '" . addslashes($lang["Modif_Param"]["Tooltip_Erreur_Dates"]) . "', 'Down');
				return false;
			} else {
				if (confirm(\"" . $lang["Modif_Param"]["Confirmer_Modif_01"] . $Modification["Fiche_ID"] . $lang["Modif_Param"]["Confirmer_Modif_02"] . "\")){
					document.MainForm.Save.value = '1';
					SubmitDoc();
					return true;
				} else {
					return false;
				}
			}
		} else {
			ShowMessage('Div_Dispo', 'alert', '" . addslashes($lang["Modif_Param"]["Tooltip_Erreur_Aucun_Dispo"]) . "', 'UpLeft');
			return false;
		}
	}
	
	function NoRights(){
		alert(\"" . $lang["Modif_Param"]["Tooltip_Erreur_Droits"] . "\");
	}
	
	function ResizeWindow(){
		Width = 700;
		Height = 600;
		window.resizeTo(Width,Height)
		StartX = eval(screen.width/2-Width/2);
		StartY = eval(screen.height/2-Height/2);
		self.moveTo(StartX,StartY);
	}

	function SetDate(Type){
		if (Check_Dates()){
			if (Type == 'Debut'){
				CurrDate = document.MainForm.Date_Depart.value;
				CurrHeure = document.MainForm.Heure_Depart.options[document.MainForm.Heure_Depart.selectedIndex].value;
			} else {
				CurrDate = document.MainForm.Date_Retour.value;
				CurrHeure = document.MainForm.Heure_Retour.options[document.MainForm.Heure_Retour.selectedIndex].value;
			}
			self.location.href='" . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=modif_set_date&Type='+Type+'&Date='+CurrDate+'&Heure='+CurrHeure;
		} else {
			if (Type == 'Debut'){
				document.MainForm.Date_Depart.value = Original_DateDep;
				document.MainForm.Heure_Depart.selectedIndex = Original_HeureDep;
			} else {
				document.MainForm.Date_Retour.value = Original_DateRet;
				document.MainForm.Heure_Retour.selectedIndex = Original_HeureRet;
			}
		}
	}
	
	function ShowPopup(Content){
		return overlib(Content, WIDTH, 125, HAUTO, VAUTO, FGCOLOR, '#FFD616', BGCOLOR, '#000000');
	}
	
	function SubmitDoc(){
		document.MainForm.submit();
	}
	
	function StartForm(){
		clearTimeout(Timer)
		for (i=0;i<document.MainForm.elements.length;i++){
			//alert(document.MainForm.elements[i].type);
			if (document.MainForm.elements[i].type == 'text'){
				if (document.MainForm.elements[i].value == '' || document.MainForm.elements[i].value == '0' || document.MainForm.elements[i].value == '0,00'){
					document.MainForm.elements[i].focus();
					break;
				}
			} else if (document.MainForm.elements[i].type == 'select-one') {
				if (document.MainForm.elements[i].selectedIndex == 0){
					document.MainForm.elements[i].focus();
					break;
				}
			}
		}
	}
	
	function StartPage(){
		ResizeWindow();
		Timer = setTimeout('StartForm()',250);
	}
	
	function TestAccountLocked(){
		alert(\"" . $lang["Modif_Param"]["Test_Account_Locked"] . "\");
	}
	</script>";
}

///////////////////////////////////////////////////////////
///      Calcul de la date de fin si durée modifiée dans Dupli	     ///
///////////////////////////////////////////////////////////
function modif_set_date($Type, $Date, $Heure){
	$Modification = $_SESSION["Modification"];
	
	if ($Type == "Debut"){
		//Date début modifiée, transférer info
		$Modification["Date_Depart_FR"] = $Date;
		$Modification["Date_Depart_EN"] = substr($Modification["Date_Depart_FR"],6,4) . "-" . substr($Modification["Date_Depart_FR"],3,2) . "-" . substr($Modification["Date_Depart_FR"],0,2);
		$Modification["Heure_Depart"] = $Heure;
	} else {
		//Date début modifiée, transférer info
		$Modification["Date_Retour_FR"] = $Date;
		$Modification["Date_Retour_EN"] = substr($Modification["Date_Retour_FR"],6,4) . "-" . substr($Modification["Date_Retour_FR"],3,2) . "-" . substr($Modification["Date_Retour_FR"],0,2);
		$Modification["Heure_Retour"] = $Heure;
	}
	
	//Recalculer durée selon dates existantes
	$Date_Start = strtotime($Modification["Date_Depart_EN"] . " " . $Modification["Heure_Depart"]. " GMT");
	$Date_End = strtotime($Modification["Date_Retour_EN"] . " " . $Modification["Heure_Retour"]. " GMT");
	$Duree = $Date_End - $Date_Start;
	//print "Durée calculée : $Duree<br>";
	$Duree_Estimee = $Duree / 3600;
	//print "Durée estimée en heures : $Duree_Estimee";
	if ($Duree_Estimee < 24){
		$Modification["Duree"] = 1;
	} else {
		$Jours_Estimes = round($Duree_Estimee / 24);
		//print "Durée estimée en Jours : $Jours_Estimes";
		
		//Offset sur heure si départ matin retour soir
		$Date_Start = strtotime($Modification["Date_Depart_EN"] . " " . $Modification["Heure_Depart"]. " GMT");
		$Date_End = strtotime($Modification["Date_Depart_EN"] . " " . $Modification["Heure_Retour"]. " GMT");
		$Offset = ($Date_End - $Date_Start) / 3600;
		//print "Offset heures trouvées : $Offset<br>";
		if ($Offset > 6){
			$Jours_Estimes++;
			//print "Durée estimée en Jours avec offset : $Jours_Estimes";
		}
		$Modification["Duree"] = $Jours_Estimes;
	}
		
	$_SESSION["Modification"] = $Modification;
	
	modif_param();
}

///////////////////////////////////////////////////////////
///  Fonction initialisation nouvelle Location depuis clic planning	///
///////////////////////////////////////////////////////////
function popup_create($Start_X, $Start_Y){
	global $db;
	
	$Client_Info = $_SESSION["Client_Info"];
	$Planning = $_SESSION["Planning"];
	$TVA_List = $_SESSION["TVA_List"];
	$User = $_SESSION["User"];
	$Version_Info = $_SESSION["Version_Info"];
	
	select_version_db();
	
	//Retrouver date et ligne matériel selon paramètres passés
	$Ligne = floor($Start_Y / $Planning["Row_Height"]);
	$Colonne = floor($Start_X / $Planning["Cell_Width"]);
	//print "Ligne : $Ligne<br>";
	//print "Colonne : $Colonne<br>";
	
	if ($User["Admin"] == 2){
		$CurrDay = date("d", mktime(0, 0, 0, 1, 1, 2008)) + $Planning["Offset_Date"];
		$CurrMonth = date("m", mktime(0, 0, 0, 1, 1, 2008));
		$CurrYear = date("Y", mktime(0, 0, 0, 1, 1, 2008));
		$StartDate = date ("Y-m-d", mktime($Planning["Min_Time"],0,0,$CurrMonth,($CurrDay+$Colonne),$CurrYear));
	} else {
		$CurrDay = date("d") + $Planning["Offset_Date"];
		$CurrMonth = date("m");
		$CurrYear = date("Y");
		$StartDate = date ("Y-m-d", mktime($Planning["Min_Time"],0,0,$CurrMonth,($CurrDay+$Colonne),$CurrYear));
	}
	//print $StartDate . " " . $User["Pref_HeureDep"] . "<br>";
	//print "Offset User Depart : " . $User["Pref_DateDep"] . "<br>";
	//print "Offset User retour : " . $User["Pref_DateRet"] . "<br>";
	
	if ($User["Pref_DateRet"] != "" && $User["Pref_DateDep"] != ""){
		$Offset_Retour = $User["Pref_DateRet"] - $User["Pref_DateDep"];
	} else {
		$Offset_Retour = $Version_Info["Pref_DateRet"] - $Version_Info["Pref_DateDep"];
	}
	//print "Diff : " . $Offset_Retour . "<br>";
	//print "Colonne + Offset retour : " . ($Colonne+$Offset_Retour) . "<br>";
	$EndDate = date ("Y-m-d", mktime($Planning["Min_Time"],0,0,$CurrMonth,($CurrDay+$Colonne+$Offset_Retour),$CurrYear));
	//print $EndDate . " " . $User["Pref_HeureRet"] . "<br>";
	
	$Duree = date_diff($StartDate . " 00:00:00", $EndDate . "  00:00:00") / 24;
	if ($Duree < 1){
		$Duree = 1;
	}
	//print "Duree : $Duree<br>";
	
	//Rattraper infos sur matériel désiré
	$Filtre = "Select ID, PUHT, PU_Type from Inventaire where Client_Account = '" . $Client_Info["Client_ID"] . "' and Statut = 0 order By Modele asc, Num_Interne asc limit " . ($Planning["Current_Row"] + $Ligne) . ",1";
	//print $Filtre . "<br>";
	mysql_query("SET NAMES 'utf8'");
	$sql = mysql_query($Filtre,$db);
	$row = mysql_fetch_array($sql);
	
	//Infos de TVA depuis la dernière utilisation de cette référence
	$Filtre = "Select TVA_ID from Locations_Materiels where Materiel_ID = '" . $row["ID"] . "' order by ID desc limit 1";
	//print $Filtre . "<br>";
	$sql = mysql_query($Filtre,$db);
	if (mysql_numrows($sql) == 0){
		//Matériel jamais utilisé, prendre 1er taux trouvé
		$row["TVA_ID"] = $TVA_List[0]["TVA_ID"];
	} else {
		$row2 = mysql_fetch_array($sql);
		$row["TVA_ID"] = $row2["TVA_ID"];
	}
	
	//Créer la location pour N° Fiche
	$Date_Depart_EN = $StartDate . " " . $User["Pref_HeureDep"];
	$Date_Retour_EN = $EndDate . " " . $User["Pref_HeureRet"];
	$Filtre = "
		insert into Locations (
			Client_Account, DateDep, DateRet, Statut_ID, Duree
		) values (
			'" . $Client_Info["Client_ID"] . "', '" . $Date_Depart_EN . "', '" . $Date_Retour_EN . "', '1', '" . $Duree . "')";
	//print $Filtre . "<br>";
	$sql = mysql_query($Filtre,$db);
	
	//Rapatrier N° Fiche
	$Filtre = "Select Last_insert_ID() as Fiche_ID from Locations limit 0,1";
	$sql = mysql_query($Filtre,$db);
	$rowFiche = mysql_fetch_array($sql);
	
	$Fiche_ID = $rowFiche["Fiche_ID"];
	
	//Insérer matériel sélectionné	dans la table appropriée
	$Filtre = "
		insert into Locations_Materiels (
			Fiche_ID, DateDep, DateRet, Statut_ID, Materiel_ID, PU, PU_Type, Qte, Duree, TVA_ID
		) values (
			'" . $Fiche_ID . "', '" . $Date_Depart_EN . "', '" . $Date_Retour_EN . "', '1', '" . $row["ID"] . "', '" . $row["PUHT"] . "', '" . $row["PU_Type"] . "',
			'1', '" . $Duree . "', '" . $row["TVA_ID"] . "')";
	//print $Filtre . "<br>";
	$sql = mysql_query($Filtre,$db);
		
	header("Location: " . $_SERVER["PHP_SELF"] . "?PHPSESSID=" . session_id() . "&op=view_location_init&Fiche_ID=" . $Fiche_ID . "&Output=Screen");
}
		
///////////////////////////////////////////////////////////
///	   		    Impression Location				///
///////////////////////////////////////////////////////////
function print_location(){
	global $db, $lang;
	
	setlocale(LC_TIME, "fr_FR.utf-8");
	
	$Client_Info = $_SESSION["Client_Info"];
	$Groupes = $_SESSION["Groupes"];
	$Location = $_SESSION["Location"];
	$Palette = $_SESSION["Palette"];
	$TVA_List = $_SESSION["TVA_List"];
	$User = $_SESSION["User"];
	
	//Rapatrier Infos Client
	$Filtre = "Select * from Clients where Client_ID = " . $Location["Client_ID"];
	$sql = mysql_query($Filtre,$db);
	$row = mysql_fetch_array($sql);
			
	//Construire le Jour de départ, texte complet
	$CurrDateDep = utf8_decode(ucfirst(strftime ("%A %d %B %Y", strtotime($Location["Date_Depart_EN"])))) . " à " . $Location["Heure_Depart"];
	$CurrDateRet = utf8_decode(ucfirst(strftime ("%A %d %B %Y", strtotime($Location["Date_Retour_EN"])))) . " à " . $Location["Heure_Retour"];
	
	//Duree
	if ($Location["Duree"] == 0){
		$DureeStr = $lang["Print"]["Non_Precisee"];
	} elseif ($Location["Duree"] == 1){
		$DureeStr = $lang["Print"]["Nuit"];
	} else {
		$DureeStr = $Location["Duree"] . $lang["Print"]["Nuits"];
	}

	//Ref tournage
	if ($Location["Ref"] != ""){
		$CurrRef = $Location["Ref"];
	} else {
		$CurrRef = $lang["Print"]["Non_Precisee"];
	}

	//Caution
	if ($Location["Caution"] != 0){
		$CautionStr = $Location["Caution"] . " &euro;";
	} else {
		$CautionStr = $lang["Print"]["Aucune"];
	}
	
	define('FPDF_FONTPATH',$_SERVER["DOCUMENT_ROOT"] . "/fpdf/font/");
	require($_SERVER["DOCUMENT_ROOT"] . "/fpdf/fpdf.php");

	class PDF extends FPDF{
		//En-tête
		function Header(){
			global $lang;
			
			$Client_Info = $_SESSION["Client_Info"];
			$Location = $_SESSION["Location"];
	
			//Informations client
			if (file_exists($_SERVER["DOCUMENT_ROOT"] . "/" . $Client_Info["Logo_Path"])){
				$this->Image($_SERVER["DOCUMENT_ROOT"] . "/" . $Client_Info["Logo_Path"],10,5,40);
				$this->Ln(8);
			} else {
				$this->SetFont('Arial','B',15);
				$this->Cell(30,10,$Client_Info["Nom"] . " " . $Client_Info["Prenom"],0,0,'C');
				$this->Ln(8);
			}
			$this->SetFont('Arial','',9);
			$this->Cell(40,10,$Client_Info["Adresse"],0,0,'C');
			$this->Ln(3);
			$this->Cell(40,10,$Client_Info["CP"] . " " . $Client_Info["Ville"],0,0,'C');
			$this->Ln(3);
			$this->Cell(40,10,$lang["Print"]["Tel"] . $Client_Info["Tel"],0,0,'C');
			$this->Ln(3);
			$this->Cell(40,10,$lang["Print"]["Fax"] . $Client_Info["Fax"],0,0,'C');
			$this->Ln(3);
			$this->Cell(40,10,$lang["Print"]["RCS"] . $Client_Info["RCS"],0,0,'C');
			$this->Ln(3);
			$this->Cell(40,10,$lang["Print"]["TVA_Intra"] . $Client_Info["TVA_Intra"],0,0,'C');
			$this->Ln(3);
			
			//Cellule Date
			$this->SetXY(-50,5);
			$this->Cell(45,6,$lang["Print"]["Date"],1,0,'C');
			$this->SetXY(-50,11);
			$this->Cell(45,6,date("d/m/Y"),1,0,'C');
			
			//Cellule N° Location
			$this->SetXY(-105,5);
			$this->Cell(50,6,$lang["Print"]["Numero_Fiche"],1,0,'C');
			$this->SetXY(-105,11);
			$this->Cell(50,6,$Location["Fiche_ID"] . "." . $Location["Revision"],1,0,'C');

			// Positionner fin d'en-tête pour reprise page
			$this->SetXY(5, 45);
		}

		//Pied de page
		function Footer(){
			global $lang;
			
			$Client_Info = $_SESSION["Client_Info"];
			$Location = $_SESSION["Location"];
	
			//Positionnement à 1,5 cm du bas
			$this->SetXY(5, -13);
			//Police Arial italique 8
			$this->SetFont('Arial','B',8);
			$Footer = $lang["Print"]["Numero_Fiche"] . $Location["Fiche_ID"] . "." . $Location["Revision"] . "   -   " . $lang["Print"]["Page"] . " " . $this->PageNo() . "/{nb}";
			$this->Cell(200,5,$Footer,'T',0,'C');
			$this->SetFont('Arial','',8);
			$this->SetY(-8);
			$Footer = $Client_Info["Nom"] . " - " . $Client_Info["Adresse"] . " - " . $Client_Info["CP"] . " " . $Client_Info["Ville"] . " - " . $lang["Print"]["Tel"] . $Client_Info["Tel"] . " - " . $lang["Print"]["Fax"] . $Client_Info["Fax"];
			$this->Cell(0,5,$Footer,0,0,'C');
		}
	}
	
	//Instanciation PDF
	$pdf=new PDF('P','mm','A4');
	
	$pdf->AliasNbPages();
	$pdf->AddPage();
	$pdf->SetLeftMargin(5);
	$pdf->SetAutoPageBreak(true, 15);
	$pdf->SetDisplayMode('real');
	
	//Sortie informations location
	$pdf->SetFont('Arial','',8);
	$pdf->SetXY(5, 45);
	$pdf->Cell(85,5,$lang["Print"]["Informations_Location"],1,0,'L');
	$pdf->SetXY(5, 50);
	$pdf->Cell(85,25,"",1,0);
	$pdf->SetXY(5, 50);
	$pdf->Cell(20,5,$lang["Print"]["Debut"],0,0,'R');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(62,5,$CurrDateDep,0,0,'L');
	$pdf->SetXY(5, 55);
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(20,5,$lang["Print"]["Fin"],0,0,'R');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(62,5,$CurrDateRet,0,0,'L');
	$pdf->SetXY(5, 60);
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(20,5,$lang["Print"]["Duree"],0,0,'R');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(62,5,$DureeStr,0,0,'L');
	$pdf->SetXY(5, 65);
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(20,5,$lang["Print"]["Ref"],0,0,'R');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(62,5,$CurrRef,0,0,'L');
	$pdf->SetXY(5, 70);
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(20,5,$lang["Print"]["Caution"],0,0,'R');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(62,5,$CautionStr,0,0,'L');
	
	//Nom client et adresse de livraison si besoin
	$Hauteur_Tableau = 10;
	$Filtre = "Select * from Clients where Client_ID = " . $Location["Client_ID"];
	$sql = mysql_query($Filtre,$db);
	$row = mysql_fetch_array($sql);
	if ($row["Adresse"] != ""){
		$CurrAdresse = $row["Adresse"];
		$Hauteur_Tableau += 5;
	} else {
		$CurrAdresse = "";
	}
	if ($row["Adresse2"] != ""){
		$CurrAdresse2 = $row["Adresse2"];
		$Hauteur_Tableau += 5;
	} else {
		$CurrAdresse2 = "";
	}
	if ($row["CP"] != "" || $row["Ville"] != ""){
		$CurrVille = $row["CP"] . " " . $row["Ville"];
		$Hauteur_Tableau += 5;
	} else {
		$CurrVille = "";
	}
	$Hauteur_Tableau-= 5;
	
	//Construire tableau adresse facturation et livraison si besoin
	$PosY = 70 - $Hauteur_Tableau;
	$pdf->SetXY(-85, $PosY);
	$pdf->Cell(80,5,$lang["Print"]["Informations_Client"],1,0,'L');
	$PosY += 5;
	$pdf->SetXY(-85, $PosY);
	$pdf->Cell(80,$Hauteur_Tableau,"",1,0,'L');
	$pdf->SetFont('Arial','B',10);
	$pdf->SetXY(-85, $PosY);
	$pdf->Cell(80,5,$row["Nom"] . " " . $row["Prenom"],0,0,'R');
	$PosY += 5;
	$pdf->SetFont('Arial','',8);
	$pdf->SetXY(-85, $PosY);
	if ($CurrAdresse != ""){
		$pdf->Cell(80,5,$CurrAdresse,0,0,'R');
		$PosY += 5;
		$pdf->SetXY(-85, $PosY);
	}
	if ($CurrAdresse2 != ""){
		$pdf->Cell(80,5,$CurrAdresse2,0,0,'R');
		$PosY += 5;
		$pdf->SetXY(-85, $PosY);
	}
	if ($CurrVille != ""){
		$pdf->Cell(80,5,$CurrVille,0,0,'R');
		$PosY += 5;
		$pdf->SetXY(-85, $PosY);
	}
	if ($CurrTel != ""){
		$pdf->Cell(80,5,$CurrTel,0,0,'R');
		$PosY += 5;
		$pdf->SetXY(-85, $PosY);
	}
	if ($CurrFax != ""){
		$pdf->Cell(80,5,$CurrFax,0,0,'R');
		$PosY += 5;
		$pdf->SetXY(-85, $PosY);
	}
	
	////////////////////////////////////////
	///		Remarques si besoin		///
	////////////////////////////////////////
	$PosY = 80;
	if ($Location["Remarques"] != ""){
		$pdf->SetXY(5, $PosY);
		$pdf->Cell(200,5,$lang["Print"]["Remarques"],1,1,'L');
		$pdf->MultiCell(200,5,$Location["Remarques"],0);
		$PosY = $pdf->GetY();
		$Hauteur_Cellule = $PosY - 80;
		$pdf->SetXY(5, 80);
		$pdf->Cell(200,$Hauteur_Cellule,"",1,1,'L');
		$pdf->Ln(5);
		$PosY = $pdf->GetY();
	}
	
	////////////////////////////////////////
	///	Listing du matériel dans la facture	///
	////////////////////////////////////////
	
	//En tetes colonnes
	$pdf->SetXY(5, $PosY);
	$pdf->SetFillColor(180, 180, 180);
	$pdf->SetTextColor(255, 255, 255);
	$pdf->SetDrawColor(255, 255, 255);
	$pdf->Cell(25,5,$lang["Print"]["Type"],0,0,'C', true);
	$pdf->Cell(75,5,$lang["Print"]["Modele"],'L',0,'C', true);
	$pdf->Cell(20,5,$lang["Print"]["PUHT"],'L',0,'C', true);
	$pdf->Cell(10,5,$lang["Print"]["Qte"],'L',0,'C', true);
	$pdf->Cell(20,5,$lang["Print"]["Duree"],'L',0,'C', true);
	$pdf->Cell(15,5,$lang["Print"]["TVA"],'L',0,'C', true);
	$pdf->Cell(15,5,$lang["Print"]["Remise"],'L',0,'C', true);
	$pdf->Cell(20,5,$lang["Print"]["Total_HT"],'L',0,'C', true);
	
	//Contour noir
	$pdf->SetXY(5, $PosY);
	$pdf->SetDrawColor(0, 0, 0);
	$pdf->SetFillColor(255, 255, 255);
	$pdf->SetTextColor(0, 0, 0);
	$pdf->Cell(200,5,"",1,1);
	
	$Filtre = "
		Select
			PU, Locations_Materiels.PU_Type, TVA, Qte, Remise, Duree, Inventaire.Designation, Inventaire.Modele, Inventaire.Statut
		from
			Locations_Materiels, Inventaire
		where
			Fiche_ID = '" . $Location["Fiche_ID"] . "' and Inventaire.ID = Locations_Materiels.Materiel_ID
		order by Locations_Materiels.ID asc";
	//echo $Filtre;
	$sql = mysql_query($Filtre,$db);

	$CurrMatosID = 0;
	while ($row = mysql_fetch_array($sql)){
		//Créer un groupe si besoin
		$FoundGroup = -1;
		for ($i=0;$i<$Groupes["Max_Materiels"];$i++){
			if ($row["Designation"] == $Groupes["Materiels"][$i]["Nom"]){
				//Matériel appartenant à un groupe... Sauver info
				$FoundGroup = $i;
				//echo "Trouvé : " . $ListResa["Designation"] . "<br />";
				break;
			}
		}
		
		//Ajouter le matériel à la liste du matériel
		$MatosInGroup[$CurrMatosID]["Group_ID"] = $FoundGroup;
		if ($row["Statut"] == 0){
			$MatosInGroup[$CurrMatosID]["Type"] = $lang["Print"]["Emplacement"];
			$MatosInGroup[$CurrMatosID]["Duree"] = $row["Duree"] . $lang["Print"]["Nuits"];
		} elseif ($row["Statut"] == 1) {
			$MatosInGroup[$CurrMatosID]["Type"] = $lang["Print"]["Service"];
			$MatosInGroup[$CurrMatosID]["Duree"] = "";
		} else {
			$MatosInGroup[$CurrMatosID]["Type"] = $lang["Print"]["Fourniture"];
			$MatosInGroup[$CurrMatosID]["Duree"] = "";
		}
		$MatosInGroup[$CurrMatosID]["Designation"] = $row["Designation"];
		$MatosInGroup[$CurrMatosID]["Modele"] = $row["Modele"];
		$MatosInGroup[$CurrMatosID]["PU_Type"] = $row["PU"];
		$MatosInGroup[$CurrMatosID]["TVA"] = $row["TVA"];
		$MatosInGroup[$CurrMatosID]["Qte"] = $row["Qte"];
		if ($row["Remise"] != "" && $row["Remise"] != 0){
			$MatosInGroup[$CurrMatosID]["Remise"] = number_format($row["Remise"], 2, ',', ' ') . "%";
		} else {
			$MatosInGroup[$CurrMatosID]["Remise"] = "";
		}
		
		//Recalculer valeurs HT pour affichage dans listing
		if ($row["PU_Type"] == "HT"){
			$MatosInGroup[$CurrMatosID]["PUHT"] = $row["PU"];
			if ($row["Statut"] == 0){
				$MatosInGroup[$CurrMatosID]["Total_HT"] = round($MatosInGroup[$CurrMatosID]["PUHT"] * $MatosInGroup[$CurrMatosID]["Duree"],2);
			} else {
				$MatosInGroup[$CurrMatosID]["Total_HT"] = round($MatosInGroup[$CurrMatosID]["PUHT"] * $MatosInGroup[$CurrMatosID]["Qte"],2);
			}
		} else {
			$MatosInGroup[$CurrMatosID]["PUTTC"] = $row["PU"];
			$MatosInGroup[$CurrMatosID]["PUHT"] = round($MatosInGroup[$CurrMatosID]["PUTTC"] / (1 + $MatosInGroup[$CurrMatosID]["TVA"] / 100),2);
			
			if ($row["Statut"] == 0){
				$MatosInGroup[$CurrMatosID]["Total_TTC"] = round($MatosInGroup[$CurrMatosID]["PUTTC"] * $MatosInGroup[$CurrMatosID]["Duree"],2);
			} else {
				$MatosInGroup[$CurrMatosID]["Total_TTC"] = round($MatosInGroup[$CurrMatosID]["PUTTC"] * $MatosInGroup[$CurrMatosID]["Qte"],2);
			}
			$MatosInGroup[$CurrMatosID]["Total_HT"] = round($MatosInGroup[$CurrMatosID]["Total_TTC"] / (1 + ($MatosInGroup[$CurrMatosID]["TVA"] / 100)),2);
		}

		//Augmenter ID matériel traité
		$CurrMatosID++;
	}	
	
	//Groupes et liste matériels
	for ($i=0;$i<$Groupes["Max_Materiels"];$i++){
		//Groupes
		$pdf->SetFont('Arial','B',7);
		$pdf->Cell(200,5,$Groupes["Materiels"][$i]["Nom"] . " ( " . $lang["Print"]["Qte"] . " : " . $Groupes["Materiels"][$i]["Max"] . " )",1,1);
		
		//Liste matériels appartenant à ce groupe
		for ($j=0;$j<$CurrMatosID;$j++){
			if ($MatosInGroup[$j]["Group_ID"] == $i){
				$CurrHeight = $pdf->GetY();
				if ($CurrHeight == 280){
					$Border = "T ";
				} else {
					$Border = "";
				}
				$pdf->SetFont('Arial','',7);
				$pdf->Cell(25,5,$MatosInGroup[$j]["Type"],$Border . 'L R',0,'L');
				$pdf->Cell(75,5,$MatosInGroup[$j]["Modele"],$Border . 'R',0,'L');
				$pdf->Cell(20,5,number_format($MatosInGroup[$j]["PUHT"], 2, ',', ' ') . " &euro;",$Border . 'R',0,'R');
				$pdf->Cell(10,5,number_format($MatosInGroup[$j]["Qte"], 0),$Border . 'R',0,'R');
				$pdf->Cell(20,5,$MatosInGroup[$j]["Duree"],$Border . 'R',0,'R');
				$pdf->Cell(15,5,number_format($MatosInGroup[$j]["TVA"], 2, ',', ' ') . "%",$Border . 'R',0,'R');
				$pdf->Cell(15,5,$MatosInGroup[$j]["Remise"],$Border . 'R',0,'R');
				$pdf->Cell(20,5,number_format($MatosInGroup[$j]["Total_HT"], 2, ',', ' ') . " &euro;",$Border . 'R',1,'R');
			}
		}
	}
	
	//Ajustement lignes tant que la hauteur de 21cm n'a pas été atteinte
	$CurrY = $pdf->GetY();
	while ($CurrY <= 230){
		$pdf->Cell(25,5,"","L R",0,'L');
		$pdf->Cell(75,5,"","L R",0,'L');
		$pdf->Cell(20,5,"","L R",0,'R');
		$pdf->Cell(10,5,"","L R",0,'R');
		$pdf->Cell(20,5,"","L R",0,'R');
		$pdf->Cell(15,5,"","L R",0,'R');
		$pdf->Cell(15,5,"","L R",0,'R');
		$pdf->Cell(20,5,"","L R",1,'R');
		
		$CurrY = $pdf->GetY();
	}
	$pdf->Cell(200,1,"","T",1);
	
	////////////////////////////////////////
	///		Listing des taux de tva		///
	////////////////////////////////////////
	
	//En tetes colonnes
	$PosY = 240;
	$pdf->SetXY(5, $PosY);
	$pdf->Cell(75,5,"   " . $lang["Print"]["TVA"],1,1);
	if ($Client_Info["Mention_TVA"] == ""){
		$PosY = 245;
		$pdf->SetXY(5, $PosY);
		$pdf->SetFillColor(180, 180, 180);
		$pdf->SetTextColor(255, 255, 255);
		$pdf->SetDrawColor(255, 255, 255);
		$pdf->Cell(10,5,$lang["Print"]["Nb"],0,0,'C', true);
		$pdf->Cell(10,5,$lang["Print"]["Articles"],'L',0,'C', true);
		$pdf->Cell(20,5,$lang["Print"]["Base"],'L',0,'C', true);
		$pdf->Cell(15,5,$lang["Print"]["Taux"],'L',0,'C', true);
		$pdf->Cell(20,5,$lang["Print"]["Montant"],'L',0,'C', true);
		
		//Contour noir
		$pdf->SetXY(5, $PosY);
		$pdf->SetDrawColor(0, 0, 0);
		$pdf->SetFillColor(255, 255, 255);
		$pdf->SetTextColor(0, 0, 0);
		$pdf->Cell(75,5,"",1,1);
		
		//Affichage des totaux de TVA
		$TVAStr = "";
		$CurrTaux = 0;
		for ($i=0;$i<$TVA_List["Max"];$i++){
			if ($TVA_List[$i]["Articles"] > 0){
				$pdf->Cell(10,5,($i + 1),$Border . 'L R',0,'R');
				$pdf->Cell(10,5,$TVA_List[$i]["Articles"],'R',0,'R');
				$pdf->Cell(20,5,number_format($TVA_List[$i]["Base"], 2, ',', ' ') . " &euro;",'R',0,'R');
				$pdf->Cell(15,5,number_format($TVA_List[$i]["Taux"], 2, ',', ' ') . " %",'R',0,'R');
				$pdf->Cell(20,5,number_format($TVA_List[$i]["Montant"], 2, ',', ' ') . " &euro;",$Border . 'R',1,'R');
				
				$CurrTaux++;
			}
		}
		$pdf->Cell(75,1,"","T",1);
	} else {
		$PosY = 245;
		$pdf->SetXY(5, $PosY);
		$pdf->MultiCell(75,5,$Client_Info["Mention_TVA"],1,'L');
	}
	
	////////////////////////////////////////
	///		      Totaux Facture		///
	////////////////////////////////////////
	$PosY = 240;
	$pdf->SetXY(-55, $PosY);
	$pdf->Cell(30,5,$lang["Print"]["SS_Total_HT"],'',0,'R');
	$pdf->Cell(20,5,number_format($Location["Total_HT"], 2, ',', ' ') . " &euro;",'1',1,'R');
	$pdf->Ln(2);
	$PosY = $pdf->GetY();
	$pdf->SetXY(-55, $PosY);
	$pdf->Cell(30,5,$lang["Print"]["Total_TVA"],'',0,'R');
	$pdf->Cell(20,5,number_format($Location["TVA_Montant"], 2, ',', ' ') . " &euro;",'1',1,'R');
	$pdf->Ln(2);
	if (number_format($Location["Remise_Montant"], 0) != 0){
		$PosY = $pdf->GetY();
		$pdf->SetXY(-55, $PosY);
		$pdf->Cell(30,5,$lang["Print"]["Total_Remises"],'',0,'R');
		$pdf->Cell(20,5,number_format($Location["Remise_Montant"], 2, ',', ' ') . " &euro;",'1',1,'R');
		$pdf->Ln(2);
	}
	$PosY = $pdf->GetY();
	$pdf->SetXY(-55, $PosY);
	$pdf->Cell(30,5,$lang["Print"]["Total_TTC"],'',0,'R');
	$pdf->Cell(20,5,number_format(($Location["Total_TTC"]-$Location["Remise_Montant"]), 2, ',', ' ') . " &euro;",'1',1,'R');
	$pdf->Ln(2);
	$PosY = $pdf->GetY();
	$pdf->SetXY(-55, $PosY);
	$pdf->Cell(30,5,$lang["Print"]["Accompte"],'',0,'R');
	$pdf->Cell(20,5,number_format($Location["Accompte"], 2, ',', ' ') . " &euro;",'1',1,'R');
	$pdf->Ln(2);
	$pdf->SetFont('Arial','B',7);
	$PosY = $pdf->GetY();
	$pdf->SetXY(-55, $PosY);
	$pdf->Cell(30,5,$lang["Print"]["A_Payer"],'',0,'R');
	$pdf->Cell(20,5,number_format($Location["A_Payer"], 2, ',', ' ') . " &euro;",'1',1,'R');
	
	//Sortie PDF
	$pdf->Output();
}

///////////////////////////////////////////////////////////
///	   		Sélection Location par N°			///
///////////////////////////////////////////////////////////
function select_nb(){
	global $db, $lang;
	
	print "
	<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">
	
	<html>
	<head>
	<title>". $lang["Select_NB"]["Titre_Page"] ."</title>
	<LINK REL=\"STYLESHEET\" TYPE=\"text/css\" HREF=\"planning.css\">
	<script type=\"text/javascript\" src=\"js/planning.js\"></script>
	<script type=\"text/javascript\" src=\"js/overlib/overlib.js\"></script>
	<script type=\"text/javascript\" src=\"js/overlib/overlib_anchor.js\"></script>
	</head>

	<body onload=\"ResizeWindow()\">
	<form action=\"" . $_SERVER["PHP_SELF"] . "\" method=\"post\" name=\"MainForm\" onSubmit=\"return CheckForm()\">
	<div class=\"section_titre\">
		". $lang["Select_NB"]["Titre_Section"] ."
	</div>
	<div class=\"section_block\" style=\"padding-top: 40px; padding-bottom: 40px;\">
		<div class=\"section_block_contenu\">
			<div class=\"champ_description\" style=\"width: 200px;\">". $lang["Select_NB"]["Numero_Fiche"] ."</div>
			<div style=\"float: left;\">
				<div class=\"champ_formulaire\" style=\"width: 400px;\">
					<div id=\"Div_Fiche\" style=\"float: left;\">
						<input type=\"text\" name=\"Fiche_ID\" size=\"15\" maxLength=\"10\" class=\"text_zone\" autocomplete=\"off\" onKeyUp=\"CheckFiche(event, this);\" onFocus=\"ShowMessage('Div_Fiche', 'inform', '" . addslashes($lang["Select_NB"]["Tooltip_Fiche"]) . "', 'Up');\" onBlur=\"return nd();\" />
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class=\"section_titre\" style=\"height: 21px;\">
		<div class=\"colonne_action\" style=\"width: 50%;\">
			<input type=\"submit\" class=\"form_element\" value=\"" . $lang["Select_NB"]["Bouton_Afficher"] . "\">
		</div>
		<div class=\"colonne_action\" style=\"width: 50%;\">
			<input type=\"button\" class=\"form_element\" value=\"" . $lang["Select_NB"]["Bouton_Fermer"] . "\" onClick=\"Javascript: self.close()\">
		</div>
	</div>
	<input type=\"hidden\" name=\"PHPSESSID\" value=\"" . session_id() . "\">
	<input type=\"hidden\" name=\"op\" value=\"do_select_nb\">
	</form>
	
	</body>
	</html>
	
	<script language=\"JavaScript\">
	function CheckFiche(event, textbox){
		if (CheckInteger(event, textbox) == false){
			ShowMessage('Div_Fiche', 'alert', '" . addslashes($lang["Select_NB"]["Tooltip_Erreur_Touche_Invalide"]) . "', 'Up');
		}
	}

	function CheckForm(){
		if (document.MainForm.Fiche_ID.value == ''){
			document.MainForm.Fiche_ID.focus();
			nd();
			ShowMessage('Div_Fiche', 'alert', '" . addslashes($lang["Select_NB"]["Tooltip_Erreur_Numero_Vide"]) . "', 'Up');
			return false;
		} else if (isNaN(document.MainForm.Fiche_ID.value)) {
			document.MainForm.Fiche_ID.focus();
			nd();
			ShowMessage('Div_Fiche', 'alert', '" . addslashes($lang["Select_NB"]["Tooltip_Erreur_NaN"]) . "', 'Up');
			return false;
		} else {
			return true;
		}
	}

	function CheckInteger(event, textbox){
		var keyCode = (event) ? event.keyCode : keyStroke.which;
		
		nd();
			
		//Tester contenu Qte
		Broken = false;
		NewVal = '';
		for (var i = 0; i < textbox.value.length; i++){
			CurrChar = textbox.value.substring(i,i+1);
			if (isNaN(CurrChar)) {
				NewVal = textbox.value.substring(0,i);
				Broken = true;
			}
		}
		if (Broken == true){
			textbox.value = NewVal;
			return false;
		} else {
			return true;
		}
	}
	
	function ResizeWindow(){
		Width = 660;
		Height = 300;
		window.resizeTo(Width,Height)
		StartX = eval(screen.width/2-Width/2);
		StartY = eval(screen.height/2-Height/2);
		self.moveTo(StartX,StartY);
		document.MainForm.Fiche_ID.focus();
	}
	</script>";	
}

///////////////////////////////////////////////////////////
///   		Calcul de la date de fin si durée modifiée		     ///
///////////////////////////////////////////////////////////
function set_date($Type, $Date, $Heure){
	$Location = $_SESSION["Location"];
	
	if ($Type == "Debut"){
		//Date début modifiée, transférer info
		$Location["Date_Depart_FR"] = $Date;
		$Location["Date_Depart_EN"] = substr($Location["Date_Depart_FR"],6,4) . "-" . substr($Location["Date_Depart_FR"],3,2) . "-" . substr($Location["Date_Depart_FR"],0,2);
		$Location["Heure_Depart"] = $Heure;
		$Location["Modifiee"] = 1;
	} else {
		//Date début modifiée, transférer info
		$Location["Date_Retour_FR"] = $Date;
		$Location["Date_Retour_EN"] = substr($Location["Date_Retour_FR"],6,4) . "-" . substr($Location["Date_Retour_FR"],3,2) . "-" . substr($Location["Date_Retour_FR"],0,2);
		$Location["Heure_Retour"] = $Heure;
		$Location["Modifiee"] = 1;
	}
	
	//Recalculer durée selon dates existantes
	$Date_Start = strtotime($Location["Date_Depart_EN"] . " " . $Location["Heure_Depart"]. " GMT");
	$Date_End = strtotime($Location["Date_Retour_EN"] . " " . $Location["Heure_Retour"]. " GMT");
	$Duree = $Date_End - $Date_Start;
	//print "Durée calculée : $Duree<br>";
	$Duree_Estimee = $Duree / 3600;
	//print "Durée estimée en heures : $Duree_Estimee";
	if ($Duree_Estimee < 24){
		$Location["Duree"] = 1;
	} else {
		$Jours_Estimes = round($Duree_Estimee / 24);
		//print "Durée estimée en Jours : $Jours_Estimes";
		
		//Offset sur heure si départ matin retour soir
		$Date_Start = strtotime($Location["Date_Depart_EN"] . " " . $Location["Heure_Depart"]. " GMT");
		$Date_End = strtotime($Location["Date_Depart_EN"] . " " . $Location["Heure_Retour"]. " GMT");
		$Offset = ($Date_End - $Date_Start) / 3600;
		//print "Offset heures trouvées : $Offset<br>";
		if ($Offset > 6){
			$Jours_Estimes++;
			//print "Durée estimée en Jours avec offset : $Jours_Estimes";
		}
		$Location["Duree"] = $Jours_Estimes;
	}
		
	$_SESSION["Location"] = $Location;
	
	add_location();
}

///////////////////////////////////////////////////////////
///	       Fonction initialisation Location existante		///
///////////////////////////////////////////////////////////
function view_location_init($Fiche_ID, $Output){
	global $db;
	
	$Location = $_SESSION["Location"];
	$TVA_List = $_SESSION["TVA_List"];
	$User = $_SESSION["User"];
	
	//Créer la location pour N° Fiche
	$Filtre = "
		Select
			Client_ID, Statut_ID, Ref, Remarques, Caution, Accompte, Duree, Date_Format(DateDep,'%Y-%m-%d') as Date_Depart_EN,
			Date_Format(DateRet,'%Y-%m-%d') as Date_Retour_EN, Date_Format(DateDep,'%d/%m/%Y') as Date_Depart_FR, Date_Format(DateRet,'%d/%m/%Y') as Date_Retour_FR,
			Date_Format(DateDep,'%H:%i') as Heure_Depart, Date_Format(DateRet,'%H:%i') as Heure_Retour
		from
			Locations
		where
			Fiche_ID = " . $Fiche_ID . " limit 1";
	//print $Filtre;
	mysql_query("SET NAMES 'utf8'");
	$sql = mysql_query($Filtre,$db);
	$row = mysql_fetch_array($sql);
	$Location["Client_ID"] = $row["Client_ID"];
	$Location["Statut_ID"] = $row["Statut_ID"];
	$Location["Ref"] = $row["Ref"];
	$Location["Remarques"] = $row["Remarques"];
	$Location["Duree"] = $row["Duree"];
	$Location["Date_Depart_EN"] = $row["Date_Depart_EN"];
	$Location["Date_Retour_EN"] = $row["Date_Retour_EN"];
	$Location["Date_Depart_FR"] = $row["Date_Depart_FR"];
	$Location["Date_Retour_FR"] = $row["Date_Retour_FR"];
	$Location["Heure_Depart"] = $row["Heure_Depart"];
	$Location["Heure_Retour"] = $row["Heure_Retour"];
	
	$Location["Caution"] = $row["Caution"];
	$Location["Accompte"] = $row["Accompte"];
	//Rapatrier N° Révision
	
	$Filtre = "Select Revision from Revisions where Fiche_ID = " . $Fiche_ID . " order by Revision desc limit 0,1";
	$sql = mysql_query($Filtre, $db);
	if (mysql_numrows($sql) != ""){
		$Location["Revision"] = mysql_result($sql,0,"Revision");
	} else {
		$Location["Revision"] = 0;
	}
	//print $Filtre;
	
	$Location["Action"] = "Edit";
	$Location["Fiche_ID"] = $Fiche_ID;
	$Location["Employe_ID"] = 0;
	
	$Location["Modif_Param"] = "";

	//Variables de Sauvegarde et Modification
	$Location["Historique"] = "";
	$Location["Saved"] = 0;
	$Location["Alert_Saved"] = "";
	$Location["Modifiee"] = 0;
	
	//Taille des Listings
	$Available_Space = $User["Util_ResY"] - 580;
	$Location["Canvas_Height_Materiels"] = $Available_Space ;
	
	$_SESSION["Location"] = $Location;

	$Groupes = array();
	$Groupes["Max_Materiels"] = 0;
	$Filtre = "
		Select
			Inventaire.Designation, count(Inventaire.Designation) as Qte
		from
			Locations_Materiels, Inventaire
		where
			Fiche_ID = " . $Location["Fiche_ID"] . " and Inventaire.ID = Locations_Materiels.Materiel_ID
		group by
			Inventaire.Designation
		order by
			Locations_Materiels.ID asc";
	//echo $Filtre . "<br />";
	//exit;
	$sql = mysql_query($Filtre,$db);
	while ($row = mysql_fetch_array($sql)){
		$Groupes["Materiels"][$Groupes["Max_Materiels"]]["Nom"] = $row["Designation"];
		$Groupes["Materiels"][$Groupes["Max_Materiels"]]["Max"] = $row["Qte"];
		$Groupes["Max_Materiels"]++;
	}

	$_SESSION["Groupes"] = $Groupes;

	//RAZ des taux de TVA
	for ($i=0;$i<$TVA_List["Max"];$i++){
		$TVA_List[$i]["Articles"] = 0;
		$TVA_List[$i]["Base"] = 0;
		$TVA_List[$i]["Montant"] = 0;
	}
	$_SESSION["TVA_List"] = $TVA_List;
	
	if ($Output == "Screen"){
		calcule_total();
	} else {
		calcule_total("Print");
		
		print_location();
	}
}
	
///////////////////////////////////////////////////////////
///	   Fonction voir les Révisions de la Fiche de Location	///
///////////////////////////////////////////////////////////
function view_revisions(){
	global $db, $lang;
	
	$Location = $_SESSION["Location"];

	
	$ListRevisionStr = "";
	
	//Rapatrier infos révisions
	$CurrFiche = 0;
	$LstRevisions = "";
	
	$Filtre = "
		Select
			Revisions.*, Date_Format(Revisions.Date, '%d/%m/%Y - %H:%m') as DateFR
		from
			Revisions
		where
			Fiche_ID='" . $Location["Fiche_ID"] . "'
		order by
			Revision desc";
	//echo $Filtre;
	mysql_query("SET NAMES 'utf8'");
	$sql = mysql_query($Filtre,$db);
	while ($row = mysql_fetch_array($sql)){
		if ($CurrFiche % 2 == 0){
			$CurrClass = "impaire";
		} else {
			$CurrClass = "paire";
		}
			
		$LstRevisions .= "
			<tr>
				<td class=\"listing_ligne_" . $CurrClass . "_centre\" style=\"width: 40px; vertical-align: top;\">" . $row["Revision"] . "</td>
				<td class=\"listing_ligne_" . $CurrClass . "_centre\" style=\"width: 125px; vertical-align: top;\">" . $row["DateFR"] . "</td>
				<td class=\"listing_ligne_" . $CurrClass . "_gauche\" style=\"width: 150px; vertical-align: top;\">" . $row["Employe"] . "</td>
				<td class=\"listing_ligne_" . $CurrClass . "_gauche\" style=\"vertical-align: top;\">" . $row["Historique"] . "</td>
			</tr>\n";
		$CurrFiche++;
	}
	
	print "
	<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">
	
	<html>
	<head>
	<title>". $lang["View_Revisions"]["Titre_Page"] . $Location["Fiche_ID"] . "</title>
	<script type=\"text/javascript\" src=\"js/planning.js\"></script>
	<LINK REL=\"STYLESHEET\" TYPE=\"text/css\" HREF=\"planning.css\">
	</head>
	
	<body onload=\"ResizeWindow()\">
	<div class=\"section_titre\">
		". $lang["View_Revisions"]["Titre_Section"] . $Location["Fiche_ID"] . "
	</div>
	
	<div class=\"section_block\" style=\"padding: 5px 5px 5px 5px; margin-bottom: 0px;\">
		<div style=\"width: 100%; text-align: left;\">
			<table border=\"0\" cellpadding=\"0\" cellspacing=\"2\" width=\"100%\" class=\"text\">
			<tr>
				<td class=\"listing_titre_centre\" style=\"width: 40px;\">" . $lang["View_Revisions"]["Numero"] . "</td>
				<td class=\"listing_titre_centre\" style=\"width: 125px;\">" . $lang["View_Revisions"]["Date"] . "</td>
				<td class=\"listing_titre_centre\" style=\"width: 150px;\">" . $lang["View_Revisions"]["Employe"] . "</td>
				<td class=\"listing_titre_gauche\">" . $lang["View_Revisions"]["Modifications"] . "</td>
			</tr>
			</table>
		</div>
		<div style=\"width: 100%; height: 350px; text-align: left; overflow: auto;\">
			<table border=\"0\" cellpadding=\"0\" cellspacing=\"2\" width=\"100%\" class=\"text\">
			</tr>
			" . $LstRevisions . "
			</table>
		</div>
	</div>
	
	<div class=\"section_titre\" style=\"height: 21px;\">
		<div class=\"colonne_action\" style=\"width: 100%;\">
			<input type=\"button\" class=\"form_element\" value=\"" . $lang["View_Revisions"]["Bouton_Fermer"] . "\" onClick=\"Javascript: self.close()\">
		</div>
	</div>
	
	</body>
	</html>
	
	<script language=\"JavaScript\">
	function ResizeWindow(){
		Width = 950;
		Height = 540;
		window.resizeTo(Width,Height)
		StartX = eval(screen.width/2-Width/2);
		StartY = eval(screen.height/2-Height/2);
		self.moveTo(StartX,StartY);
	}
	</script>";
}

?>
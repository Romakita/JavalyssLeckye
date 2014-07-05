<?php
/** section: Core
 * class SystemTerm
 * includes SystemEvent
 * Cette classe gère les constantes et terminologies du system.
 **/
require_once('abstract_system_event.php');

define('TABLE_SYSTEM', '`'.PRE_TABLE.'software_meta`');

class SystemTerm extends SystemEvent{
    /**
     * System.TABLE_NAME -> String
     * Table de configuration du système.
     **/
    const TABLE_NAME = 			TABLE_SYSTEM;
    /*
     * System.Meta -> Object
     * Liste des informations métas
     **/
    protected static $Meta =				NULL;
    /**
     * System.Meta -> Object
     * Liste des informations métas
     **/
    protected static $Lang =				false;

    public static function Initialize(){
        self::$Meta = new stdClass();
    }
/**
 * System.iDie([safemode]) -> void
 * - safemode (Boolean): Si la valeur est vrai le teste sur `safemode` ne sera pas fait.
 *
 * Emet une erreur si le système est non initialisé.
 *
 * #### SafeMode
 *
 * Ce mode est activé par défaut lorsque le système est initialisé sans utilisateur connecté. Certaines méthodes du système émetterons l'erreur `system.init.err`
 * si `safemode` est actif.
 **/
    public static function iDie($bool = false){
        if(!User::IsConnect() && !$bool) {
            self::eDie('system.init.err');
        }
    }
    /**
     * System.Define() -> void
     *
     * Cette méthode définie toutes les constantes du logiciel qui sont stockées dans la table `software_meta`.
     **/
    public static function Define(){
        self::$Meta = self::GetMetas();

        foreach(self::$Meta as $key => $value){
            if(!defined($key)){
                if(is_numeric($value) || is_string($value) || is_bool($value)) define($key, $value);
            }
        }
    }
    /**
     * System.Meta(key [, value]) -> String | Number | Array | Object
     * - key (String): Nom de la valeur stockée.
     * - value (String | Number | Array | Object): Valeur à stocker.
     *
     * Cette méthode retourne une valeur stocké en fonction du paramètre `key` dans la table `software_meta`.
     * Si le paramètre `value` est mentionné alors la méthode enregistrera cette valeur dans la table au nom de clef indiqué `key`.
     *
     * <p class="note">Si la clef n'existe pas et que `value` n'est pas mentionné la méthode retournera NULL.</p>
     *
     * <p class="note">Si la clef n'existe pas et que `value` est mentionné la méthode créera une nouvelle entrée dans la table.</p>
     *
     **/
    public static function Meta($key){
        if($key == '') return false;

        self::iDie(true);

        $num =      func_num_args();
        $request =          new Request();
        $request->select = 	'*';
        $request->from = 	self::TABLE_NAME;
        $request->where =	"Meta_Key = '".Sql::EscapeString($key)."'";

        if($num == 1){

            if(isset(self::$Meta->$key)){
                return self::$Meta->$key;
            }

            $meta = $request->exec('select');

            return self::$Meta->$key = ($meta['length'] == 0 ? false : unserialize($meta[0]['Meta_Value']));
        }

        if($num == 2){

            $value = func_get_arg(1);

            if($value === "false") 	$value = false;
            if($value === "true") 	$value = true;

            $meta = $request->exec('select');

            if($meta['length'] == 0){

                $request->fields = '(Meta_Key, Meta_Value)';
                $request->values = "('".Sql::EscapeString($key)."', '".Sql::EscapeString(serialize($value))."')";

                if($request->exec('insert')) return self::$Meta->$key = func_get_arg(1);

            }else{

                $request->set = 	"Meta_Value = '".Sql::EscapeString(serialize($value))."'";
                $request->where = 	"Meta_ID = ".$meta[0]['Meta_ID'];

                if($request->exec('update')) {
                    return self::$Meta->$key = func_get_arg(1);
                }
            }
        }

        return false;
    }
    /**
     * System.GetMetas() -> Array
     *
     * Cette méthode retourne l'ensemble des données stockés en table `software_meta`.
     **/
    public static function GetMetas(){

        $request = 			new Request();
        $request->select = 	'*';
        $request->from = 	self::TABLE_NAME;

        $meta = $request->exec('select');

        if(!$meta){
            Sql::PrintError();
        }

        if($meta['length'] == 0) return false;

        $array = new stdClass();

        for($i = 0; $i < $meta['length']; $i++){
            $key = $meta[$i]['Meta_Key'];

            if($meta[$i]['Meta_Value'] == '') {
                $array->$key = '';
            }else{
                $array->$key = @unserialize($meta[$i]['Meta_Value']);
            }
        }

        return $array;
    }
    /**
     * System.GetMeta(key) -> String | Number | Array | Object
     * - key (String): Nom de la valeur stockée.
     *
     * Cette méthode retourne la valeur d'une clef stockée dans la table `software_meta`.
     **/
    static public function GetMeta($key){
        return self::Meta($key);
    }

    public static function GetLang(){
        if(!self::$Lang) {
            if(User::IsConnect()){
                return self::$Lang = strtolower(User::Meta('LANG') ? User::Meta('LANG') : System::Meta('LANG'));
            }

            return self::$Lang = System::Meta('LANG');
        }
        return self::$Lang;
    }

}
<?php
/** section: Core
 * class SystemRoute
 * includes Permalink
 * Cette classe gère les routes HTTP. Permet la création d'API REST via la gestion intelligente des routes.
 **/
require_once(__DIR__ . '/route/class_request.php');

class SystemRoute{
    protected static $default =     null;
    protected static $request =     null;
    protected static $callback =    null;

    public static function Initialize(){

    }
    /**
     * SystemRoute.When(route, options) -> void
     *
     *
     **/
    public static function When($route, $options, $callback = ""){

        $request = new SystemRoute\Request($route);

        ///conversion
        if(is_array($options) && empty($callback) && !empty($options['callback'])) {
            $o = new stdClass();

            foreach($options as $key => $value){
                $o->$key = $value;
            }
            $options = $o;
        }else{
            if(empty($callback) && (is_array($options) || is_string($options))) {
                $callback = $options;
                $options = new stdClass();
            }
        }

        if(!empty($callback)) {
            $options->callback = $callback;
        }

        if(!empty($options->method)) {
            if(!$request->methodAccept($options->method)){
                return;
            }
        }

        if(!emtpy($options->https)) {
            if(!$request->useHTTPS()){
                return;
            }
        }

        if($request->match()){

            if(!emtpy($options->connected) && !User::IsConnect()){
                return;
            }

            if(!empty($options->roles) && !User::IsConnect() && !in_array(User::Get()->getRight(), $options->roles)){
                return;
            }

            if(!empty($options->appName)){
                if(!User::IsConnect()){
                    return;
                }

                if(!Plugin::HaveAccess($options->appName)){
                    return;
                }
            }

            self::$request =    $request;
            self::$callback =   $callback;
        }
    }
    /**
     * SystemRoute.Otherwise(route, callback) -> void
     **/
    public static function Otherwise(){

    }


    public static function Fire(){



    }
}

SystemRoute::Initialize();
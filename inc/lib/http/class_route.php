<?php
/** section: Library
 * class HTTP.Route
 * includes Permalink
 * Cette classe gère les routes HTTP. Permet la création d'API REST via la gestion intelligente des routes.
 **/
namespace HTTP;

require_once(__DIR__ . '/route/class_request.php');

class Route{
    protected static $defaultCallback =     null;
    protected static $request =             null;
    protected static $callback =            null;
    protected static $middlewares =         null;

    public static function Initialize(){
        self::$middlewares = array();
    }

    public static function UseMiddleware($pattern, $middleware){
        self::$middlewares[$pattern] = $middleware;
    }
    /**
     * Route.When(route, options) -> void
     *
     *
     **/
    public static function When($route, $options, $callback = ""){

        if(!empty(self::$request)){//la route est déjà chargée
            return;
        }

        $request = new Route\Request($route);

        ///conversion
        if(is_array($options) && empty($callback) && !empty($options['callback'])) {
            $o = new \stdClass();

            foreach($options as $key => $value){
                $o->$key = $value;
            }
            $options = $o;
        }else{
            if(empty($callback) && (is_array($options) || is_string($options))) {
                $callback = $options;
                $options = new \stdClass();
            }
        }

        if(!empty($callback)) {
            $options->callback = $callback;
        }

        $request->setOptions($options);

        if($request->match()){

            //MIDDLEWARES TEST
            $parameters = \Permalink::GetPage()->getParameters();
            $path = '';

            foreach($parameters as $param){
                $path .= '/'.$param;

                if(!empty(self::$middlewares[$path])){

                    $response = new stdClass();

                    if(call_user_func_array(self::$middlewares[$path], array($request, &$response))){
                        //TODO à changer
                        return;
                    }
                }
            }

            //PAS D'ERREUR

            /*if(!emtpy($options->connected) && !User::IsConnect()){
                return;
            }

            if(!empty($options->roles) && !User::IsConnect() && !in_array(User::Get()->getRight(), $options->roles)){
                return;
            }*/

            /*if(!empty($options->appName)){
                if(!User::IsConnect()){
                    return;
                }

                if(!Plugin::HaveAccess($options->appName)){
                    return;
                }
            }*/

            self::$request =    $request;
            self::$callback =   $callback;
        }
    }
    /**
     * Route.Otherwise(route, callback) -> void
     **/
    public static function Otherwise($callback){
        if(empty(self::$defaultCallback)){
            self::$defaultCallback = $callback;
        }
    }


    public static function Fire(){

        $response = new stdClass();

        if(!empty(self::$request)){
            call_user_func_array(self::$callback, array(self::$request, &$response));
        }else{
            if(!empty(self::$defaultCallback)){
                call_user_func_array(self::$callback, array(self::$request, &$response));
            }
        }

        //TODO BUILD RESPONSE

    }
}

Route::Initialize();
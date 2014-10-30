<?php
/** section: Library
 * class HTTP.Route
 *
 * Cette classe gère les routes HTTP. Permet la création d'API REST via la gestion intelligente des routes.
 **/
namespace HTTP;

use HTTP\Route\Response;

require_once(__DIR__ . '/route/class_request.php');
require_once(__DIR__ . '/route/class_response.php');

class Route{
    protected static $defaultCallback =     null;
    protected static $request =             null;
    protected static $callback =            null;
    protected static $middlewares =         null;
    private static $rawData =               null;
    protected static $routes =              null;

    public static function Initialize(){
        self::$middlewares = array();
        self::$routes = array();

        if($_SERVER['REQUEST_METHOD'] == 'PUT'){
            if(self::$rawData === null){
                parse_str(file_get_contents("php://input"), self::$rawData);
                $_POST = \Stream::CleanNullByte(self::$rawData);
            }
        }
    }

    public static function UseMiddleware($pattern, $middleware){
        self::$middlewares[$pattern] = $middleware;
    }

    public static function WhenGet($route, $callback = ""){
        self::When($route, array('method' => 'get'), $callback);
    }

    public static function WhenPost($route, $callback = ""){
        self::When($route, array('method' => 'post'), $callback);
    }

    public static function WhenPut($route, $callback = ""){
        self::When($route, array('method' => 'put'), $callback);
    }

    public static function WhenDelete($route, $callback = ""){
        self::When($route, array('method' => 'delete'), $callback);
    }
    /**
     * HTTP.Route.When(route, options) -> void
     *
     *
     **/
    public static function When($route, $options, $callback = ""){

        $request = new Route\Request($route);

        if(is_callable($options)){
            $callback = $options;
            $options =  new \stdClass();
        }

        if(is_array($options)){
            $o = new \stdClass();

            foreach($options as $key => $value){
                $o->$key = $value;
            }
            $options = $o;
        }

        $request->setOptions($options);

        self::$routes[] = $request;

        if(!empty(self::$request)){//la route est déjà chargée
            return;
        }

        if($request->match()){
            //MIDDLEWARES TEST
            $parameters = \Permalink::Get()->getParameters();
            $path = '';

            foreach($parameters as $param){
                $path .= '/'.$param;

                if(!empty(self::$middlewares[$path])){

                    $response = new Response();

                    if(call_user_func_array(self::$middlewares[$path], array($request, &$response))){

                        if(!$response->sent()){
                            $response->send(401, 'Cannot access to ' . implode('/', $parameters));
                        }

                        exit();
                    }
                }
            }

            self::$request =    $request;
            self::$callback =   $callback;
        }
    }
    /**
     * HTTP.Route.Otherwise(route, callback) -> void
     **/
    public static function Otherwise($callback){
        if(empty(self::$defaultCallback)){
            self::$defaultCallback = $callback;
        }
    }
    /**
     * HTTP.Route.Fire() -> void
     **/
    public static function Fire(){

        $response = new Response();

        if(!empty(self::$request)){
            call_user_func_array(self::$callback, array(self::$request, &$response));
        }else{

            if(!empty(self::$defaultCallback)){
                call_user_func_array(self::$defaultCallback, array(self::$request, &$response));
            }

        }

        if(!$response->sent()){
            $response->send(401, 'Cannot access to ' . implode('/', \Permalink::Get()->getParameters()));
        }

    }

    public static function GetRoutes(){
        return self::$routes;
    }
}

Route::Initialize();
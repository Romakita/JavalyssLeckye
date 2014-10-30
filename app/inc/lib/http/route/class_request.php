<?php
/** section: Library
 * class HTTP.Route.Request
 *
 * Cette classe gère les informations d'une requête
 **/
namespace HTTP\Route;

class Request{
    const HTTP =        'HTTP';
    const HTTPS =       'HTTPS';

    private $options =      null;
    /**
     * HTTP.Route.Request#params -> Object
     *
     * HashTable des paramètres de l'adresse de requête entrante.
     **/
    public $params =        null;
    /**
     * HTTP.Route.Request#query -> Array
     *
     * Variable GET
     **/
    public $query =         null;
    /**
     * HTTP.Route.Request#body -> Array
     *
     * Variable POST
     **/
    public $body =          null;
    /**
     * HTTP.Route.Request#files -> Array
     *
     * Variable FILES
     **/
    public $files =         null;

    protected $method =     'ALL';
    protected $protocol =   'ALL';
    protected $ip =         'ALL';
    protected $route =      '';
    protected $permalink =  '';

    public function __construct($route, $options = ''){

        $this->query =  self::a2o($_GET);
        $this->body =   self::a2o($_POST);
        $this->files =  self::a2o($_FILES);
        $this->route =  $route;

        if(is_object($options)){
            $this->setOptions($options);
        }
    }

    private static function a2o($a){
        $options = new \stdClass();

        foreach($a as $key => $value){
            $options->{$key} = $value;
        }

        return $options;
    }
    /**
     * HTTP.Route.Request#setOptions(options) -> HTTP.Route.Request
     *
     * Permet d'assigner les options de configuration de la route.
     **/
    public function setOptions($options){

        if(!empty($options->method)){
            $this->setMethod($options->method);
        }

        if(!empty($options->protocol)){
            $this->setProtocol($options->protocol);
        }

        if(!empty($options->ip)){
            $this->setIP($options->ip);
        }

        return $this;
    }
    /**
     * HTTP.Route.Request#match() -> Boolean
     *
     * Indique si la route correspond à l'adresse HTTP en cours.
     **/
    public function match($link = ''){

        if(empty($link)){
            $link = \Permalink::Get();
        }else{
            $link = new \Permalink($link);
        }

        //vérification de la méthode
        if(!$this->methodAccept()){
            return false;
        }

        //vérification du protocole
        if(!$this->protocolAccept()){
            return false;
        }

        $parameters =    $link->getParameters();
        $routeParams =   explode('/', $this->route);
        $nbParameters =  count($parameters);
        $nbRouteParams = count($routeParams);
        $options =       new \stdClass();
        //index
        if($nbParameters == 1 && $this->route == '/' && $parameters[0] == ''){
            return true;
        }

        //
        if($nbRouteParams < $nbParameters){// la route définie ne peut prendre en charge le nombre de paramètre
            return false;
        }

        for($i = 0; $i < $nbRouteParams; $i++){

            $startChar =    substr($routeParams[$i], 0, 1);
            $endChar =      substr($routeParams[$i], -1);
            $key =          str_replace(array(':', '?'), '', $routeParams[$i]);

            if($startChar == ':'){//variable à stocker

                if(empty($parameters[$i]) && $endChar != '?'){//le paramètre doit être mentionné dans le lien
                    return false;
                }

                $options->{$key} = \Stream::CleanNullByte(empty($parameters[$i]) ? null : $parameters[$i]);

            }else{

                if(empty($parameters[$i])){
                    return false;
                }

                if($key != $parameters[$i]){//chemin ne correspondant pas à la route
                    return false;
                }
            }
        }

        $this->params = $options;

        return true;
    }
    /**
     * HTTP.Route.Request#methodAccept() -> Boolean
     * Cette méthode vérifie que le méthode HTTP correspond bien à la configuration de la route;
     */
    public function methodAccept(){

        if($this->method == 'ALL'){
            return true;
        }

        $methods = explode(';', $this->method);

        return in_array($_SERVER['REQUEST_METHOD'], $methods);
    }
    /**
     * HTTP.Route.Request#setMethod(method) -> HTTP.Route.Request
     * - method (String): Méthodes acceptées (séparées par des ;)
     *
     * Cette méthode permet d'assigner les méthodes que la route peut accepter.
     **/
    public function setMethod($str){
        $this->method = strtoupper($str);
        return $this;
    }
    /**
     * HTTP.Route.Request#protocolAccept() -> Boolean
     * Cette méthode indique si le protocole accepté par la route correspond avec la requête entrante.
     **/
    public function protocolAccept(){
        if($this->protocol == 'ALL'){
            return true;
        }

        if($this->protocol == self::HTTPS && !\Permalink::IsHTTPS()){
            return false;
        }

        if($this->protocol == self::HTTP && \Permalink::IsHTTPS()){
            return false;
        }

        return true;
    }
    /**
     * HTTP.Route.Request#setProtocol(protocol) -> HTTP.Route.Request
     * Permet d'assigner le protocole accepté par la route (ALL, HTTPS, HTTP).
     **/
    public function setProtocol($str){
        $this->protocol = strtoupper($str);
        return $this;
    }
    /**
     * HTTP.Route.Request#ipAccept() -> Boolean
     * Cette méthode indique si l'adresse IP accepté par la route correspond avec l'adresse IP de la requête entrante.
     **/
    public function ipAccept(){
        if(strtoupper($this->ip) == 'ALL' || $this->ip == '0.0.0.0'){
            return true;
        }

        $ips = explode(';', $this->ip);

        return in_array($_SERVER['REMOTE_ADDR'], $ips);
    }
    /**
     * HTTP.Route.Request#setIP(ip) -> HTTP.Route.Request
     * - ip (String): Le ou les adresses IP (séparées par ;)
     *
     * Permet d'assigner le ou les adresses IP pouvant utiliser cette route.
     **/
    public function setIP($str){
        $this->ip = $str;
        return $this;
    }

    public function getRoute(){
        return $this->route;
    }

    public function getMethod(){
        return $this->method;
    }
}
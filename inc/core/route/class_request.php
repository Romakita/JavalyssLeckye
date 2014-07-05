<?php
/** section: Core
 * class SystemRoute.Request
 *
 * Cette classe gère les informations d'une requête
 **/
namespace SystemRoute;

class Request{

    public $params =        null;
    public $query =         null;
    public $body =          null;
    public $method =        null;
    public $url =           '';

    /**
     * @param $route
     */
    public function __construct($route){
        $this->query =  $_GET;
        $this->body =   $_POST;
        $this->files =  $_FILES;
        $this->params = new stdClass();
        $this->route =  $route;
        $this->url =    new Permalink();
    }

    /**
     *
     */
    public function match(){

        return true;
    }

    /**
     * @param $method
     * @return bool
     */
    public function methodAccept($method){

        return true;
    }

    /**
     * @return bool
     */
    public function useHTTPS(){

        return true;
    }
}
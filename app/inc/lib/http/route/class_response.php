<?php
/** section: Library
 * class HTTP.Route.Response
 *
 * Cette classe gère les réponses HTTP.
 **/
namespace HTTP\Route;

class Response {
    private $header =   array();
    private $code =     200;
    private $finish =   false;

    function __construct(){}
    /**
     * HTTP.Route.Response.header(key, value) -> HTTP.Route.Response
     * HTTP.Route.Response.header(object) -> HTTP.Route.Response
     * HTTP.Route.Response.header(array) -> HTTP.Route.Response
     * - key (String): Clef de l'entête.
     * - value (String): Valeur de l'entête.
     *
     * Cette méthode permet d'ajouter des informations dans l'entête de réponse.
     **/
    public function header($key, $value = ''){

        if(is_object($key) || is_array($key)){
            foreach($key as $k => $value){
                $this->header($k, $value);
            }
            return $this;
        }

        $this->header[] = $key . ': ' . $value;
        return $this;
    }
    /**
     * HTTP.Route.Response.status(code) -> HTTP.Route.Response
     * - code (Number): Code réponse HTTP
     *
     * Cette méthode permet d'assigner le code réponse HTTP.
     **/
    public function status($code){
        $this->code = $code;
        return $this;
    }
    /**
     * HTTP.Route.Response.type(type) -> HTTP.Route.Response
     * - type (String): Type mime du contenu à renvoyer.
     *
     * Cette méthode permet de renvoyer un type mime précis pour la réponse.
     **/
    public function type($type){

        switch(str_replace('.', '', $type)){
            case 'html':
                $this->header('Content-Type', 'text/html');
                break;
            case 'json':
                $this->header('Content-Type', 'text/json');
                break;
            case 'js':
            case 'javascript':
                $this->header('Content-Type', 'application/javascript');
                break;
            case 'css':
                $this->header('Content-Type', 'text/css');
                break;
            default:
                $this->header('Content-Type', $type);
        }

        return $this;
    }
    /**
     * HTTP.Route.Response.json(o) -> HTTP.Route.Response
     * HTTP.Route.Response.json(statut, o) -> HTTP.Route.Response
     * - o (Mixed): Données à renvoyer au format JSON.
     * - statut (Number): Code HTTP.
     *
     * Cette méthode permet de renvoyer une réponse avec des données au format JSON.
     **/
    public function json(){
        if(func_num_args() == 1){
            $o = func_get_arg(0);
        }else{
            $this->status(func_get_arg(0));
            $o = func_get_arg(1);
        }

        $this->type('json');

        return $this->end(json_encode($o));
    }
    /**
     * HTTP.Route.Response.jsonp(o) -> HTTP.Route.Response
     * HTTP.Route.Response.jsonp(statut, o) -> HTTP.Route.Response
     * - o (Mixed): Données à renvoyer au format JSON.
     * - statut (Number): Code HTTP.
     *
     * Cette méthode permet de renvoyer une réponse avec des données au format Javascript.
     **/
    public function jsonp(){
        if(func_num_args() == 1){
            $o = func_get_arg(0);
        }else{
            $this->status(func_get_arg(0));
            $o = func_get_arg(1);
        }

        $this->type('js');

        return $this->end(@$_REQUEST['callback'].'('.json_encode($o).')');
    }
    /**
     * HTTP.Route.Response.end([data]) -> HTTP.Route.Response
     * - data (String | Number): Données à renvoyer.
     *
     * Cette méthode envoie les données vers le navigateur.
     **/
    public function end($data = ''){

        if(!$this->sent()){

            @ob_end_clean();

            if($this->code != 200){
                $this->httpResponseCode($data);
            }

            foreach($this->header as $value){
                header($value);
            }

            if(!empty($data)){
                echo $data;
            }


            $this->finish = true;
        }

        return $this;
    }

    public function sent(){
        return $this->finish;
    }
    /**
     * HTTP.Route.Response.redirect(location) -> HTTP.Route.Response
     * HTTP.Route.Response.redirect(statut, location) -> HTTP.Route.Response
     * - location (String): Lien de redirection.
     * - statut (Number): Code HTTP.
     *
     * Cette méthode permet de rediriger l'utilisateur vers une nouvelle page.
     **/
    public function redirect(){
        if(func_num_args() == 1){
            $o = func_get_arg(0);
        }else{
            $this->status(func_get_arg(0));
            $o = func_get_arg(1);
        }

        return $this->location($o);
    }
    /**
     * HTTP.Route.Response.location(location) -> HTTP.Route.Response
     *
     * Cette méthode permet de rediriger l'utilisateur vers une nouvelle page.
     **/
    public function location($location){
        return $this->header('Location', $location)->end();
    }
    /**
     * HTTP.Route.Response.attachment(file) -> HTTP.Route.Response
     * - file (String): Lien du fichier à attacher.
     *
     * Cette méthode permet d'ajouter un fichier en pièce jointe.
     **/
    public function attachment($file){

        $base = basename($file);

        return $this->header(array(
            'Content-Type' =>               'application/octet-stream',
            'Content-Disposition' =>        "attachment; filename=" . $base
        ));
    }
    /**
     * HTTP.Route.Response.send(o) -> HTTP.Route.Response
     * HTTP.Route.Response.send(statut, o) -> HTTP.Route.Response
     * - statut (Number): Code HTTP.
     * - o (Mixed): Données à envoyer.
     *
     * Cette méthode permet d'envoyer une réponse.
     **/
    public function send(){

        if(func_num_args() == 1){
            $o = func_get_arg(0);
        }else{
            $this->status(func_get_arg(0));
            $o = func_get_arg(1);
        }

        return $this->end($o);
    }
    /** alias of: HTTP.Route.Response.download
     * HTTP.Route.Response.sendfile(file) -> HTTP.Route.Response
     * - file (String): Lien du fichier à attacher.
     *
     * Cette méthode permet de forcer le téléchargement d'un fichier.
     **/
    public function sendfile($file){
        return $this->download($file);
    }
    /**
     * HTTP.Route.Response.download(file [, $name = '']) -> HTTP.Route.Response
     * - file (String): Lien du fichier à attacher.
     * - name (String): Nom du fichier.
     *
     * Cette méthode permet de forcer le téléchargement d'un fichier.
     **/
    public function download($file, $name = ''){

        if(!$this->sent()){
            $size = filesize($file);
            $base = empty($name) ? basename($file) : $name;

            $this->header(array(
                'Content-Description' =>        'File Transfer',
                'Content-Type' =>               'application/force-download',
                'Content-Type' =>               'application/octet-stream',
                'Content-Disposition' =>        "attachment; filename=" . $base,
                'Content-Transfer-Encoding' =>  'binary',
                'Expires' =>                    '0',
                'Cache-Control' =>              'no-cache,must-revalidate',
                'Pragma' =>                     'public',
                'Content-Length' =>             $size
            ));

            $this->end()->flush();

            readfile($file);

            $this->finish = true;
        }

        return $this;
    }
    /*
     * HTTP.Route.Response.flush() -> HTTP.Route.Response
     *
     **/
    private function flush(){
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        flush();
        return $this;
    }
    /*
     * HTTP.Route.Response.httpResponseCode() -> HTTP.Route.Response
     *
     **/
    private function httpResponseCode($data){

        switch ($this->code) {
            case 100: $text = 'Continue'; break;
            case 101: $text = 'Switching Protocols'; break;

            default:
            case 200: $text = 'OK'; break;
            case 201: $text = 'Created'; break;
            case 202: $text = 'Accepted'; break;
            case 203: $text = 'Non-Authoritative Information'; break;
            case 204: $text = 'No Content'; break;
            case 205: $text = 'Reset Content'; break;
            case 206: $text = 'Partial Content'; break;
            case 300: $text = 'Multiple Choices'; break;
            case 301: $text = 'Moved Permanently'; break;
            case 302: $text = 'Moved Temporarily'; break;
            case 303: $text = 'See Other'; break;
            case 304: $text = 'Not Modified'; break;
            case 305: $text = 'Use Proxy'; break;
            case 400: $text = 'Bad Request'; break;
            case 401: $text = 'Unauthorized'; break;
            case 402: $text = 'Payment Required'; break;
            case 403: $text = 'Forbidden'; break;
            case 404: $text = 'Not Found'; break;
            case 405: $text = 'Method Not Allowed'; break;
            case 406: $text = 'Not Acceptable'; break;
            case 407: $text = 'Proxy Authentication Required'; break;
            case 408: $text = 'Request Time-out'; break;
            case 409: $text = 'Conflict'; break;
            case 410: $text = 'Gone'; break;
            case 411: $text = 'Length Required'; break;
            case 412: $text = 'Precondition Failed'; break;
            case 413: $text = 'Request Entity Too Large'; break;
            case 414: $text = 'Request-URI Too Large'; break;
            case 415: $text = 'Unsupported Media Type'; break;
            case 500: $text = 'Internal Server Error'; break;
            case 501: $text = 'Not Implemented'; break;
            case 502: $text = 'Bad Gateway'; break;
            case 503: $text = 'Service Unavailable'; break;
            case 504: $text = 'Gateway Time-out'; break;
            case 505: $text = 'HTTP Version not supported'; break;
        }

        $protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');

        $this->code = $protocol . ' ' . $this->code . ' ' . $text;
        $GLOBALS['http_response_code'] = $this->code;

        header($this->code);


        return $this;
    }
} 
<?php
/**
 * Created by PhpStorm.
 * User: romak_000
 * Date: 06/07/14
 * Time: 20:12
 */

namespace HTTP\Route;

class Response {
    /**
     * @var array
     */
    private $header =   array();
    /**
     * @var string
     */
    private $type =     'text/plain';
    /**
     * @var int
     */
    private $code =     200;

    /**
     *
     */
    function __construct(){

    }

    /**
     * @param $key
     * @param string $value
     */
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
     * @param $code
     * @return $this
     */
    public function status($code){
        $this->code = $code;
        return $this;
    }

    public function type($type){

        switch(str_replace('.', '', $type)){
            case 'html':
                $this->header('Content-Type', 'text/html');
                break;
            case 'json':
                $this->header('Content-Type', 'application/json');
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

    public function jsonp(){
        if(func_num_args() == 1){
            $o = func_get_arg(0);
        }else{
            $this->status(func_get_arg(0));
            $o = func_get_arg(1);
        }

        $this->type('js');

        return $this;
    }

    private function end($data = ''){

        $this->httpResponseCode();

        foreach($this->header as $key => $value){
            header($key.': ' . $value);
        }

        if($data){
            echo $data;
        }

        return $this;
    }

    public function redirect(){
        if(func_num_args() == 1){
            $o = func_get_arg(0);
        }else{
            $this->status(func_get_arg(0));
            $o = func_get_arg(1);
        }

        return $this->location($o);
    }

    public function location($location){
        return $this->header('Location', $location);
    }

    public function attachment($file){

        $base = basename($file);

        return $this->header(array(
            'Content-Type' =>               'application/octet-stream',
            'Content-Disposition' =>        "attachment; filename=" . $base
        ));
    }

    public function send(){

        if(func_num_args() == 1){
            $o = func_get_arg(0);
        }else{
            $this->status(func_get_arg(0));
            $o = func_get_arg(1);
        }

        return $this->end($o);
    }

    public function sendfile($file){
        return $this->download($file);
    }

    public function download($file, $name = ''){
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

        return $this;
    }

    private function flush(){
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        flush();
        return $this;
    }

    private function httpResponseCode(){

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

        return $this;
    }
} 
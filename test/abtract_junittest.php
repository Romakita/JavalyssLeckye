<?php
/** section: Javalyss Unit Test
 * class jTest
 **/
abstract class jUnitTest{

    private static $stacks =        array();
    private static $current =       '';
    private static $nbError =       0;
    private static $nbSuccess =     0;
    private static $nbAsserting =   0;

    static function Initialize(){

        define('ABS_PATH', str_replace('/test', '', str_replace('\\','/', dirname(__FILE__)) . '/' ));

        $dir = 	dirname($_SERVER['SCRIPT_NAME']).'/';
        $http = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https://' : 'http://';
        $base = $http.str_replace('//', '/', $_SERVER['SERVER_NAME'].$dir);
        define('URI_PATH', str_replace('test/', '', $base));

        include('../inc/inc.php');

        //Start Test
        $files = Stream::FileList('./class/', null, array('.php'));

        for($i = 0; $i < count($files); $i++){

            require_once('./class/' . $files[$i]->name);

            $class = "jUnitTest\\" .str_replace('.php', '', ucfirst($files[$i]->name));

            $o = new $class();
            $methods = get_class_methods($class);
            $statics = get_class_methods('jUnitTest');

            foreach($methods as $method){
                if($method == '__construct') continue;
                if(in_array($method, $statics)) continue;

                $currentTest = new stdClass();
                $currentTest->name =        str_replace('jUnitTest\\', '', $class) . '->' . $method;
                $currentTest->result =      true;
                $currentTest->messages =    [];

                self::$current = $currentTest;

                call_user_func_array(array(&$o, $method), array());

                if(self::$current->result){
                    self::$nbSuccess++;
                }else{
                    self::$nbError++;
                }

                self::$stacks[] = self::$current;
            }
        }

        self::Draw();

    }

    private static function Draw(){
        echo '<pre><code style="font-family: Courier New">';

        $result = true;

        for($i = 0; $i < count(self::$stacks); $i++){

            $current = self::$stacks[$i];

            $name = ($i+1). ") " . $current->name .' '.str_repeat('-', 100);

            echo "\n".substr($name, 0, 100);
            echo " ".(!$current->result ? '<span style="color:red">FAIL</span>' : '<span style="color:green">OK</span>'). "\n";

            if(!$current->result){
                $result = false;
            }


            $y = 0;
            foreach($current->messages as $message){
                $y++;
                echo "\t" . ($i+1). ".". $y . ") " . $message . "\n";
            }

        }

        echo "\n\n".(!$result ? '<span style="color:red">FAILURE !</span>' : '<span style="color:green">SUCCESS !</span>'). "\n";
        echo "Tests: ".count(self::$stacks).", Assertions: ".self::$nbAsserting.", Failures: ".self::$nbError.", Skipped: ".self::$nbSuccess.".";
        echo "</code></pre>";
    }

    static function AssertEquals($a, $b, $message = ''){
        self::$nbAsserting++;

        if($a != $b){
            self::$current->result = false;

            $msg = 'Assert Equals ('. $a . ' == ' . $b .') FAIL';

            if(!empty($message)) {
                $msg .= ' : ' .$message;
            }

            self::$current->messages[] = $msg;
        }


    }

    static function AssertEmpty($a, $message = ''){
        self::$nbAsserting++;

        if(!empty($a)){
            self::$current->result = false;

            $msg = 'Assert Empty('. $a . ') FAIL';

            if(!empty($message)) {
                $msg .= ' : ' .$message;
            }

            self::$current->messages[] = $msg;
        }
    }

    static function AssertNotEmpty($a, $message = ''){
        self::$nbAsserting++;

        if(empty($a)){
            self::$current->result = false;

            $msg = 'Assert NotEmpty('. $a . ') FAIL';

            if(!empty($message)) {
                $msg .= ' : ' .$message;
            }

            self::$current->messages[] = $msg;
        }
    }

    static function AssertTrue($a, $message = ''){
        self::$nbAsserting++;

        if($a !== true){
            self::$current->result = false;

            $msg = 'Assert True('. $a . ') FAIL';

            if(!empty($message)) {
                $msg .= ' : ' .$message;
            }

            self::$current->messages[] = $msg;
        }
    }

    static function AssertFalse($a, $message = ''){
        self::$nbAsserting++;

        if($a !== false){
            self::$current->result = false;

            $msg = 'Assert False('. $a . ') FAIL';

            if(!empty($message)) {
                $msg .= ' : ' .$message;
            }

            self::$current->messages[] = $msg;
        }
    }

}

jUnitTest::Initialize();
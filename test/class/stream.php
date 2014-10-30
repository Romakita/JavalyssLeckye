<?php
/**
 * Created by PhpStorm.
 * User: romak_000
 * Date: 06/07/14
 * Time: 14:31
 */

namespace jUnitTest;

class Stream extends \jUnitTest {

    function __construct(){

    }

    function cleanNullByte(){
        $str = "machainenullbyte".chr(0)."azldhaoi";

        self::AssertFalse(\Stream::CleanNullByte($str) == $str);
        self::AssertTrue(\Stream::CleanNullByte('uzydteauzf') == 'uzydteauzf', \Stream::CleanNullByte('uzydteauzf') . " == " .'uzydteauzf');

    }

}


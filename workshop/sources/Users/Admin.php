<?php

use ENV_CORS\ENVCORS;

include '../DataBase/DataBase.php';
include '../Auth/Auth.php';
include '../ENV_CORS/ENVCORS.php';

//CONSTANTES
const MinimoPasswordLength = 8;
const OFF = 'OFFLINE';
const ON = 'ONLINE';
const ADMIN = 'ADMIN';
const ENCRYPT = 'sha256';

//INSTANCE
$EnvCors = new ENVCORS();
$Auth = new Auth();

$host = $EnvCors->getHost();
$port = $EnvCors->getPort();
$user = $EnvCors->getUser();
$pass = $EnvCors->getPass();
$db_name = $EnvCors->getDBName();

$db = new DataBase($host, $port, $user, $pass, $db_name);

//ROUTE
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

//TODO ENDPOINT
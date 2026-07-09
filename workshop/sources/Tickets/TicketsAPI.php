<?php

include '../DataBase/DataBase.php';
include '../Auth/Auth.php';
include '../ENV_CORS/ENVCORS.php';

//CONSTANTES
const ROLEadmin = 'ADMIN';
const ROLEuser = 'USER';

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

//TODO ENDPOINT GET TICKETS (ALL)
if (str_ends_with($uri, '/TICKETS') && ($_SERVER['REQUEST_METHOD'] == 'GET')) {
    //===ROLE TIPOS===
    /*
         * ROLE: ADMIN
         * ROLE: USER
     */

    $input = json_decode(file_get_contents('php://input'), true);

    $authData = $Auth->validateToken($db);
    $auth_id = $authData['id'];
    $Role = $authData['role'];

    if ($Role === ROLEuser)
        $resTICKETS = $db->statementDB("SELECT * FROM tickets WHERE user_id = ?", [$auth_id]);

    if ($Role === ROLEadmin)
        $resTICKETS = $db->statementDB("SELECT * FROM tickets");

    if ($resTICKETS && count($resTICKETS) > 0) {
        http_response_code(200);
        echo json_encode(['TICKET', $resTICKETS[0]]);
    } else {
        http_response_code(404);
        echo json_encode(['TICKET NOT FOUND']);
    }
}

//TODO ENDPOINT GET TICKET (ID)
if (str_ends_with($uri, '/TICKET') && ($_SERVER['REQUEST_METHOD'] == 'GET')) {

    //===ROLE TIPOS===
    /*
         * ROLE: ADMIN
         * ROLE: USER
     */

    $input = json_decode(file_get_contents('php://input'), true);
    $idTicket = $input['id_ticket'] ?? null;

    if (empty($idTicket)) {
        http_response_code(400);
        echo json_encode(['ID TICKET NOT FOUND']);
        exit;
    }

    $authData = $Auth->validateToken($db);

    $auth_id = $authData['id'];
    $Role = $authData['role'];

    if ($Role == ROLEuser)
        $resTicket = $db->statementDB("SELECT * FROM tickets WHERE id = ? AND user_id = ?",
            [$idTicket, $auth_id]);

    if ($Role == ROLEadmin)
        $resTicket = $db->statementDB("SELECT * FROM tickets WHERE id = ?",
            [$idTicket]);

    if ($resTicket && count($resTicket) > 0) {
        http_response_code(200);
        echo json_encode(['TICKET', $resTicket[0]]);
    } else {
        http_response_code(404);
        echo json_encode(['TICKET NOT FOUND']);
    }
}
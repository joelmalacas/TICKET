<?php

include '../DataBase/DataBase.php';
include '../Auth/Auth.php';
include '../ENV_CORS/ENVCORS.php';

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

//TODO ENDPOINT RESPOSTAS
if (str_ends_with($uri, '/RESPOSTAS') && ($_SERVER['REQUEST_METHOD'] == 'GET')) {
    $input = json_decode(file_get_contents('php://input'), true);

    $idTicket = $input['ticket_id'] ?? null;

    if (empty($idTicket)) {
        http_response_code(400);
        echo json_encode(['PARAM ERROR']);
        exit;
    }

    $Auth->validateToken($db);

    $resResposta = $db->statementDB("SELECT * FROM respostas WHERE ticket_id = ?", [$idTicket]);

    if ($resResposta) {
        http_response_code(200);
        echo json_encode(['RESPOSTA' => $resResposta]);
    } else {
        http_response_code(400);
        echo json_encode(['ERROR GET RESPOSTA']);
    }
}

//TODO ENDPOINT POST RESPOSTAS
if (str_ends_with($uri, '/CREATERESPOSTA') && ($_SERVER['REQUEST_METHOD'] == 'POST')) {
    $input = json_decode(file_get_contents('php://input'), true);

    $idTicket = $input['ticket_id'] ?? null;
    $mensagem = $input['mensagem'] ?? null;

    if (empty($idTicket || empty($mensagem))) {
        http_response_code(400);
        echo json_encode(['PARAM ERROR']);
        exit;
    }

    $AuthData = $Auth->validateToken($db);
    $auth_id = $AuthData['id'];

    $resPOST = $db->statementDB("INSERT INTO respostas (ticket_id, user_id, mensagem) VALUES (?, ?, ?)",
        [$idTicket, $auth_id, $mensagem]);

    if ($resPOST) {
        http_response_code(200);
        echo json_encode(['RESPOSTA' => 'Inserida com Sucesso']);
    } else {
        http_response_code(400);
        echo json_encode(['ERROR POST RESPOSTA']);
    }
}
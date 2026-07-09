<?php

include '../DataBase/DataBase.php';
include '../Auth/Auth.php';
include '../ENV_CORS/ENVCORS.php';

//DATE CONFIG
$date = new DateTime();
$date->modify('+1 hour');

//CONSTANTES
const ROLEadmin = 'ADMIN';
const ROLEuser = 'USER';

define("DATE", $date->format('Y-m-d H:i:s'));

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

    if ($resTICKETS) {
        http_response_code(200);
        echo json_encode(['TICKET', $resTICKETS]);
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

//TODO ENDPOINT POST TICKET
if (str_ends_with($uri, '/CREATETICKET') && ($_SERVER['REQUEST_METHOD'] == 'POST')) {
    $input = json_decode(file_get_contents('php://input'), true);

    $titulo = $input['titulo'] ?? null;
    $descricao = $input['descricao'] ?? null;
    $categoria = $input['categoria'] ?? null;
    $prioridade = $input['prioridade'] ?? null;
    $estado = 'aberto';

    $variasPrioridades = array("baixa", "media", "alta", "critica");
    $encontrou = false;

    if (empty($titulo) || empty($descricao) || empty($categoria) || empty($prioridade)) {
        http_response_code(500);
        echo json_encode(['PARAM ERROR']);
        exit;
    }

    for ($i = 0; $i < count($variasPrioridades); $i++) {
        if ($variasPrioridades[$i] == $prioridade) {
            $encontrou = true;
        }
    }

    if (!$encontrou) {
        http_response_code(404);
        echo json_encode(['PRIORITY NOT FOUND']);
        exit;
    }

    $auth_data = $Auth->validateToken($db);
    $auth_id = $auth_data['id'];
    $Role = $auth_data['role'];

    if ($Role == ROLEuser) {
        $postTICKET = $db->statementDB("INSERT INTO tickets (user_id, titulo, descricao, categoria, prioridade, estado) VALUES (?, ?, ?, ?, ?, ?)",
            [$auth_id, $titulo, $descricao, $categoria, $prioridade, $estado]);

        if ($postTICKET) {
            http_response_code(200);
            echo json_encode(['TICKET', $postTICKET]);
        } else {
            http_response_code(500);
            echo json_encode(['ERROR POST TICKET']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['PERMISSION DENIED']);
    }
}

//TODO ENDPOINT UPDATE TICKET
if (str_ends_with($uri, '/UPDATETICKET') && ($_SERVER['REQUEST_METHOD'] == 'PUT')) {
    $input = json_decode(file_get_contents('php://input'), true);

    $id_ticket = $input['id_ticket'] ?? null;
    $estado = $input['estado'] ?? null;
    $estadosTicket = array("aberto", "em analise", "aguardar resposta", "resolvido", "cancelado");
    $encontrou = false;

    if (empty($estado) || empty($id_ticket)) {
        http_response_code(500);
        echo json_encode(['PARAM ERROR']);
        exit;
    }

    for ($i = 0; $i < count($estadosTicket); $i++) {
        if ($estadosTicket[$i] == $estado) {
            $encontrou = true;
        }
    }

    if (!$encontrou) {
        http_response_code(404);
        echo json_encode(['STATE NOT FOUND']);
        exit;
    }

    $auth_data = $Auth->validateToken($db);
    $auth_id = $auth_data['id'];
    $Role = $auth_data['role'];

    if ($Role == ROLEadmin) {
        $updateTICKET = $db->statementDB("UPDATE tickets SET estado = ?, updated_at = ? WHERE id = ?",
            [$estado, DATE ,$id_ticket]);

        if ($updateTICKET) {
            http_response_code(200);
            echo json_encode(['TICKET', $updateTICKET]);
        } else {
            http_response_code(500);
            echo json_encode(['ERROR POST TICKET']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['PERMISSION DENIED']);
    }
}

//TODO ENDPOINT DELETE TICKET
if (str_ends_with($uri, '/DELETETICKET') && ($_SERVER['REQUEST_METHOD'] == 'DELETE')) {
    $input = json_decode(file_get_contents('php://input'), true);

    $id = $input['id_ticket'] ?? null;

    if (empty($id)) {
        http_response_code(500);
        echo json_encode(['PARAM ERROR']);
        exit;
    }

    $auth_data = $Auth->validateToken($db);
    $auth_id = $auth_data['id'];
    $Role = $auth_data['role'];

    if ($Role == ROLEadmin) {
        $deleteTICKET = $db->statementDB("DELETE FROM tickets WHERE id = ?", [$id]);

        if ($deleteTICKET) {
            http_response_code(200);
            echo json_encode(['TICKET', $deleteTICKET]);
        } else {
            http_response_code(500);
            echo json_encode(['ERROR POST TICKET']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['PERMISSION DENIED']);
    }
}
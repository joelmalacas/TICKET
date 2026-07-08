<?php

include '../DataBase/DataBase.php';
include '../Auth/Auth.php';
include '../ENV_CORS/ENVCORS.php';

//DATE CONFIG
$date = new DateTime();
$date->modify('+1 hour');

//CONSTANTES
const MinimoPasswordLength = 5;
const OFF = 'OFFLINE';
const ON = 'ONLINE';
const ROLE = 'USER';
const ENCRYPT = 'sha256';

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

//TODO ENDPOINT CREATE USER
if (str_ends_with($uri, '/CreateUser') && ($_SERVER['REQUEST_METHOD'] == 'POST')) {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'];
    $email = $input['email'];
    $password = $input['password'];

    //CHECK EMAIL TRUE
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email']);
        exit;
    }

    //Verificar Param
    if ($username == null || $email == null || $password == null || strlen($password) < MinimoPasswordLength) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid parameters']);
        exit;
    }

    $HashedPassword = hash(ENCRYPT, $password); //ENCODE password to sha-256 (64 char)

    $resCreate = $db->statementDB("INSERT INTO users (username, email, password, estado, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        [$username, $email, $HashedPassword, OFF, DATE, DATE]);

    if ($resCreate) {
        http_response_code(200);
        echo json_encode(['success' => 'User created']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error creating user']);
    }
}

//TODO ENDPOINT LOGIN USER
if (str_ends_with($uri, '/LoginUser') && ($_SERVER['REQUEST_METHOD'] === 'POST')) {
    $input = json_decode(file_get_contents('php://input'), true);
    $emailOrUsername = $input['username'];
    $pass = $input['password'];

    //VERIFICAR PARAM
    if ($emailOrUsername == null || $pass == null || strlen($pass) < MinimoPasswordLength) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid parameters']);
        exit;
    }

    $hashedPassword = hash(ENCRYPT, $pass);

    $resLog = $db->statementDB(
        "SELECT id, username, email, password FROM users WHERE username = ? OR email = ?",
        [$emailOrUsername, $emailOrUsername]
    );

    if (!empty($resLog) && count($resLog) > 0) {
        $user = $resLog[0];

        if (hash(ENCRYPT, $pass) === $hashedPassword) {
            //TODO Mudar estado para online
            $resEstado = $db->statementDB("UPDATE users SET estado = ? WHERE id = ?", [ON, $user['id']]);

            $loginOk = true;
        } else {
            //TODO MUDAR ESTADO PARA OFFLINE
            $resEstado = $db->statementDB("UPDATE users SET estado = ? WHERE id = ?", [OFF, $user['id']]);

            $loginOk = false;
        }

        if ($loginOk) {
            //CREATE BARRER TOKEN
            $token = $Auth->token($db, $user['id'], ROLE);

            http_response_code(200);
            echo json_encode(['success' => 'Login successful']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Credenciais inválidas']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Utilizador não encontrado']);
    }
}

//TODO ENDPOINT LOGOUT USER
if (str_ends_with($uri, '/LogoutUser') && ($_SERVER['REQUEST_METHOD'] === 'PUT')) {
    $auth_user_id = $Auth->validateToken($db, ROLE);

    $resLog = $db->statementDB("UPDATE users SET estado = ? WHERE id = ?", [OFF, $auth_user_id]);
    $resNullToken = $db->statementDB("UPDATE users SET token = ? WHERE id = ?", [NULL, $auth_user_id]);

    if ($resLog && $resNullToken) {
        http_response_code(200);
        echo json_encode(['success' => 'Logout successful']);
    } else {
        http_response_code(500);
        echo json_encode(['Error' => 'Logout error']);
    }
}

//TODO ENDPOINT UPDATE USER
if (str_ends_with($uri, '/UpdateUser') && ($_SERVER['REQUEST_METHOD'] === 'PUT')) {
    $auth_user_id = $Auth->validateToken($db, ROLE);

    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'];
    $email = $input['email'];
    $password = $input['password'];

    $hashedPassword = hash(ENCRYPT, $password);

    $resUpdate = $db->statementDB("UPDATE users SET username = ?, email = ?, password = ?, updated_at = ? WHERE id = ?",
        [$username, $email, $hashedPassword, DATE, $auth_user_id]);

    if ($resUpdate) {
        http_response_code(200);
        echo json_encode(['success' => 'User updated']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating user']);
    }
}

//TODO ENDPOINT GET USER
if (str_ends_with($uri, '/InfoUser') && ($_SERVER['REQUEST_METHOD'] === 'GET')) {
    $auth_user_id = $Auth->validateToken($db, ROLE);

    $resGET = $db->statementDB("SELECT username, email,created_at FROM users WHERE id = ?", [$auth_user_id]);

    if ($resGET) {
        http_response_code(200);
        echo json_encode(['success' => $resGET]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error getting user']);
    }
}
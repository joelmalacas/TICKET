<?php

class Auth {

    function __Construct() {}

    public function token($db, $user_id, $role) : string {
        try{
            $token = bin2hex(random_bytes(32)); //64 char hex

            if ($role == 'ADMIN')
                $db->statementDB("UPDATE admin SET token = ? WHERE id = ?", [$token, $user_id]);
            else
                $db->statementDB("UPDATE users SET token = ? WHERE id = ?", [$token, $user_id]);

            return $token;
        } catch (Exception $ex) {
            http_response_code(500);
            echo json_encode(['Error' => $ex->getMessage()]);
            exit;
        }
    }

    public function validateToken($db) {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? '';

        if (!str_starts_with($auth, 'Bearer ')) {
            http_response_code(401);
            echo json_encode(['Error' => 'Token não fornecido']);
            exit;
        }

        $token = substr($auth, 7);

        // 1. Tenta encontrar o token na tabela admin
        $resAdmin = $db->statementDB("SELECT id FROM admin WHERE token = ?", [$token]);

        if ($resAdmin && count($resAdmin) > 0) {
            return ['id' => $resAdmin[0]['id'], 'role' => 'ADMIN'];
        }

        // 2. Se não for admin, tenta na tabela users
        $resUser = $db->statementDB("SELECT id FROM users WHERE token = ?", [$token]);

        if ($resUser && count($resUser) > 0) {
            return ['id' => $resUser[0]['id'], 'role' => 'USER'];
        }

        // 3. Se não encontrou em nenhuma das duas
        http_response_code(401);
        echo json_encode(['Error' => 'Token inválido ou expirado']);
        exit;
    }
}
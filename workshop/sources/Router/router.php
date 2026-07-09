<?php
// router.php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (str_contains($uri, '/admin')) {
    require __DIR__ . '/../Users/Admin.php';
    return true;
}

if (str_contains($uri, '/users')) {
    require __DIR__ . '/../Users/Users.php';
    return true;
}

if (str_contains($uri, '/tickets')) {
    require __DIR__ . '/../Tickets/TicketsAPI.php';
    return true;
}

if (str_contains($uri, '/Respostas')) {
    require __DIR__ . '/../Respostas/RespostasAPI.php';
    return true;
}

http_response_code(404);
echo json_encode(['error' => 'Rota não encontrada']);
return true;
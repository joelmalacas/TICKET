<?php
// router.php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$routes = [
    '/admin' => __DIR__ . '/../Users/Admin.php',
    '/users' => __DIR__ . '/../Users/Users.php',
    '/tickets' => __DIR__ . '/../Tickets/TicketsAPI.php',
    '/Respostas' => __DIR__ . '/../Respostas/RespostasAPI.php',
];

foreach ($routes as $path => $file) {
    if (str_starts_with($uri, $path)) {
        require $file;
        return true;
    }
}

http_response_code(404);
echo json_encode(['error' => 'Rota não encontrada']);
return true;
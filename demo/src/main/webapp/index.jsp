<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MB MOTORS-Main Page</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/navbar.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Rosarivo:ital@0;1&display=swap" rel="stylesheet">
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</head>

<body>
    <mi-cabecera></mi-cabecera>
    <div class="banner">
        <video id="miVideo" autoplay muted loop>
            <source src="resources/showcase.mp4" type="video/mp4">
            Tu navegador no soporta el elemento de video.
        </video>
        <div class="banner-text">
            <h1> MB <br> MOTORS </h1>
        </div>
    </div>

    <div class="buttons">
        <button onclick="myFunction()" class="cat">Nuestros coches</button>
        <script>
            function myFunction() {
                window.location.href = 'catalogo.html';
            }
        </script>
        <button class="prod" onclick="window.location.href='colecciones.html'">Nuestras Marcas</button>
    </div>
    <mi-footer></mi-footer>
    <script src="scripts/Cabecera.js"></script>
    <script src="scripts/footer.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
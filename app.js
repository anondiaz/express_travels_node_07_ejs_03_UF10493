const path = require("node:path"); // Importamos el módulo 'path' para manejar rutas de archivos
const fs = require("node:fs"); // Importamos el módulo 'fs' para manejar el sistema de archivos
const crypto = require("node:crypto"); // Importamos el módulo 'crypto' para generar un hash
const express = require("express"); // Importamos el framework Express
const app = express(); // Creamos una instancia de Express

process.loadEnvFile();
const PORT = process.env.PORT || 12346;

//Middleware para parsear el cuerpo de las peticiones
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios
app.use(express.json()); // Middleware para parsear JSON

//Ruta de acceso a los archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Importamos los datos
const jsonData = require("./data/travels.json");

jsonData.forEach( travel => {
  app.get(`${travel.ruta}`, (req, res) => {
    // Renderizamos la vista 'travels' y pasamos los datos del viaje
    res.render("travels", {
      "lugar" : `${travel.lugar}`,
      "descripcion" : `${travel.descripcion}`,
      "precio" : `${travel.precio}`,
      "nombre" : `${travel.nombre}`,
      "img" : `${travel.img}`,
      "travels" : jsonData
    });
  });
});

app.get('/admin', (req, res) => {
  res.render('admin', {jsonData
  });
});

app.post('/insert', (req, res) => {
  // console.log("Estamos en POST/INSERT"); // Mostramos un mensaje en la consola para comprobar que estamos en la ruta correcta
  // res.send("Estamos en POST/INSERT"); // Enviamos una respuesta al cliente
  // console.log(req.body); // Mostramos los datos del formulario en la consola
  const newTravel = req.body
  // console.log(newTravel); // Mostramos los datos del formulario en la consola
  newTravel.ruta = "/" + newTravel.ruta // Añadimos la barra al inicio de la ruta
  newTravel.precio = parseFloat(newTravel.precio); // Convertimos el precio a un número
  jsonData.push(newTravel); // Añadimos el nuevo viaje al array
  console.log(jsonData); // Mostramos el array actualizado en la consola
  fs.writeFileSync(path.join(__dirname, 'data', 'travels.json'), JSON.stringify(jsonData, null, 2), "utf-8"); // Guardamos los datos actualizados en el archivo JSON
  res.redirect('/admin'); // Redirigimos al usuario a la página de administración
});

// para comprobar el funcionamiento del servidor
// app.get('/', (req, res) => {
//   res.send('OK');
// });

// app.use((req, res) => {
//     res.status(404).render('404', {"title": "404 - Página no encontrada", "h1":"Página no encontrada"}); // Renderizar la vista '404.ejs'
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

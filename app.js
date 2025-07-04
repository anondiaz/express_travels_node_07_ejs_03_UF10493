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
  newTravel.id = crypto.randomUUID(); // Generamos un ID aleatorio para el nuevo viaje
  // console.log(newTravel); // Mostramos los datos del formulario en la consola
  if (newTravel.ruta[0] != '/') { // Comprobamos si la ruta no empieza con una barra
    newTravel.ruta = "/" + newTravel.ruta; // Si no, añadimos una barra al inicio de la ruta
  }
  // newTravel.ruta = "/" + newTravel.ruta // Añadimos la barra al inicio de la ruta
  newTravel.precio = parseFloat(newTravel.precio); // Convertimos el precio a un número
  jsonData.push(newTravel); // Añadimos el nuevo viaje al array
  console.log(jsonData); // Mostramos el array actualizado en la consola
  fs.writeFileSync(path.join(__dirname, 'data', 'travels.json'), JSON.stringify(jsonData, null, 2), "utf-8"); // Guardamos los datos actualizados en el archivo JSON
  res.redirect('/admin'); // Redirigimos al usuario a la página de administración
});

app.delete('/delete/:id', (req, res) => {
  // console.log(req.params.id); // Mostramos el ID del viaje a eliminar en la consola
  const idDelete = req.params.id; // Obtenemos el ID del viaje a eliminar desde los parámetros de la URL
  const newData = jsonData.filter(travel => travel.id != idDelete); // Filtramos el array para eliminar el viaje con el ID proporcionado
  fs.writeFileSync(path.join(__dirname, 'data', 'travels.json'), JSON.stringify(newData, null, 2), "utf-8"); // Guardamos los datos actualizados en el archivo JSON
  res.redirect('/admin'); // Redirigimos al usuario a la página de administración
});

app.put('/update/:id', (req, res) => {
  // console.log(req.body); // Mostramos el ID del viaje a actualizar en la consola
  const idChanged = req.params.id; // Obtenemos el ID del viaje a actualizar desde los parámetros de la URL
  const travelChanged = req.body

  const newData = jsonData.filter(travel => travel.id != idChanged); // Filtramos el array para eliminar el viaje con el ID proporcionado
  // travelChanged.id = crypto.randomUUID(); // Generamos un ID aleatorio para el nuevo viaje
  // console.log(newTravel); // Mostramos los datos del formulario en la consola
  if (travelChanged.ruta[0] != '/') { // Comprobamos si la ruta no empieza con una barra
    travelChanged.ruta = "/" + travelChanged.ruta; // Si no, añadimos una barra al inicio de la ruta
  }
  // newTravel.ruta = "/" + newTravel.ruta // Añadimos la barra al inicio de la ruta
  travelChanged.precio = parseFloat(travelChanged.precio); // Convertimos el precio a un número
  newData.push(travelChanged); // Añadimos el nuevo viaje al array
  // console.log(newData); // Mostramos el array actualizado en la consola
  fs.writeFileSync(path.join(__dirname, 'data', 'travels.json'), JSON.stringify(newData, null, 2), "utf-8"); // Guardamos los datos actualizados en el archivo JSON
  res.redirect('/admin'); // Redirigimos al usuario a la página de administración

});

// app.use((req, res) => {
//     res.status(404).render('404', {"title": "404 - Página no encontrada", "h1":"Página no encontrada"}); // Renderizar la vista '404.ejs'
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

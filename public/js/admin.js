const sectionInsert = document.querySelector('#insert');
const sectionUpdate = document.querySelector('#update');
// sectionInsert.style.display = 'none';
sectionUpdate.style.display = 'none';

function borrarDestino(id) {
    // if (confirm("¿Estás seguro de que quieres borrar este destino?")) {
    //     window.location.href = `/delete/${id}`;
    // }
    fetch(`/delete/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(setTimeout(() => location.reload() , 500))
    .catch(error => console.log(error))
}

function editarDestino(travel) {
    sectionInsert.style.display = 'none';
    sectionUpdate.style.display = 'block';
    // Aquí convertimos el string JSON a un objeto JavaScript
    let travelData = JSON.parse(travel);
    // console.log(travelData); // Muestra el objeto de viaje en la consola para depuración
    // Asignamos los valores del objeto a los campos del formulario de actualización
    document.getElementById('id_update').value = travelData.id;
    document.getElementById('ruta_update').value = travelData.ruta; // Aquí deberías poner el valor real
    document.getElementById('lugar_update').value = travelData.lugar; // Aquí deberías poner el valor real
    document.getElementById('nombre_update').value = travelData.nombre; // Aquí deberías poner el valor real
    document.getElementById('precio_update').value = travelData.precio; // Aquí deberías poner el valor real
    document.getElementById('descripcion_update').value = travelData.descripcion; // Aquí deberías poner el valor real
    document.getElementById('img_update').value = travelData.img; // Aquí deberías poner el valor real
}

const formUpdate = document.forms['update'];
formUpdate.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita el envío del formulario por defecto
    // Creamos un objeto con los datos del formulario
    let dataChanged = {};
    dataChanged.id = formUpdate["id_update"].value;
    dataChanged.ruta = formUpdate["ruta_update"].value;
    dataChanged.lugar = formUpdate["lugar_update"].value;
    dataChanged.nombre = formUpdate["nombre_update"].value;
    dataChanged.precio = formUpdate["precio_update"].value;
    dataChanged.descripcion = formUpdate["descripcion_update"].value;
    dataChanged.img = formUpdate["img_update"].value;

    fetch(`/update/${dataChanged.id}`,
    {method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(dataChanged) // Convertimos el objeto a JSON
    }
    )
    .then(response => response.json())
    .then(setTimeout(() => location.reload(), 500))
    .catch(error => console.log(error));
}); 

// function cancelarFormulario() {
//     sectionInsert.style.display = 'none';
//     sectionUpdate.style.display = 'none';
// }
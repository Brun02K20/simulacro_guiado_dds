const apiUrl = 'http://localhost:4001/paquetes'; // Reemplaza con la URL de tu API

// Función para cargar la grilla de paquetes
async function cargarPaquetes() {
    try {
        const response = await fetch('http://localhost:4001/paquetes') // hago la peticion al endpoint
        const data = await response.json(); // parseo las respuestas a un array
        const tbody = document.getElementById('lista-paquetes'); // elijo el cuerpo de la tabla
        tbody.innerHTML = ''; // Limpiar filas existentes antes de agregar nuevas
        data.forEach(paquete => { // recorro el array creando filas
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${paquete.destino}</td>
                <td>${paquete.duracion}</td>
                <td>${paquete.precio}</td>
                <td>${paquete.descripcion}</td>
                <td>
                    <button onclick="eliminarPaquete(${paquete.id})">Eliminar</button>
                    <button onclick="actualizarPaquete(${paquete.id})">Actualizar</button>
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error(error);
    }
}

// Función para buscar paquetes por descripción
async function buscarPaquetes() {
    const descripcion = document.getElementById('buscar-input').value; // obtener lo que escribio el usuario en el input
    try {
        const response = await fetch(`http://localhost:4001/paquetes/byDescripcion?desc=${descripcion}`) // hago la peticion al endpoint
        const data = await response.json(); // parseo las respuestas a un array
        const tbody = document.getElementById('lista-paquetes'); // elijo el cuerpo de la tabla
        tbody.innerHTML = ''; // Limpiar filas existentes antes de agregar nuevas
        data.forEach(paquete => { // recorro el array creando filas
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${paquete.destino}</td>
                <td>${paquete.duracion}</td>
                <td>${paquete.precio}</td>
                <td>${paquete.descripcion}</td>
                <td>
                    <button onclick="eliminarPaquete(${paquete.id})">Eliminar</button>
                    <button onclick="actualizarPaquete(${paquete.id})">Actualizar</button>
                </td>
            `;
            tbody.appendChild(row);

            // // Event listener para los botones de borrar
            // const botonBorrar = document.querySelectorAll('.delete'); // capturo todos los botones de borrar
            // botonBorrar.forEach(boton => { // por cada elemento de borrar, a cada uno crearle un addEventListener
            //     boton.addEventListener('click', async function () {
            //         const id = boton.dataset.id; // declaro el id del usuario, esto viene de que cuando creamos los botones le pusimos ese data-id
            //         try {
            //             const response = await fetch(`http://localhost:4001/usuarios/usuarioABorrar?id=${id}`, { // hago la peticion al endpoint para el borrado
            //                 method: 'DELETE'
            //             });
            //             if (!response.ok) { // si no lo logro borrar
            //                 throw new Error('Error al borrar el usuario');
            //             }
            //             // Si el borrado es exitoso, volver a cargar la tabla
            //             fetchData();
            //         } catch (error) {
            //             console.error(error);
            //         }
            //     });
            // });

            // // Añadir evento de clic a los botones de actualización, cada boton, si le hago click, me redirecciona
            // // a una pagina de la siguiente forma: actualizacionUsuario.html?id=1
            // const updateButtons = document.querySelectorAll('.update'); // capturo todos los botones de actualizar
            // updateButtons.forEach(button => { // por cada boton actualizar, declaro un evento de forma individual
            //     button.addEventListener('click', () => {
            //         const userId = button.dataset.id; // declaro el id del usuario, esto viene de que cuando creamos los botones le pusimos ese data-id
            //         window.location.href = `actualizacionUsuario.html?id=${userId}`;
            //     });
            // });
        });

    } catch (error) {
        console.error(error);
    }
}

// Función para agregar un nuevo paquete
async function agregarPaquete() {
    const form = document.getElementById('nuevo-paquete-form'); // obtengo el formulario

    // declaro un objeto de datos de todo lo que ingreso el usuario
    const data = {
        destino: form.destino.value,
        duracion: form.duracion.value,
        precio: form.precio.value,
        descripcion: form.descripcion.value,
    }

    try {
        await fetch('http://localhost:4001/paquetes/crear', { // envio los datos, parseandolos a un JSON
            method: 'POST', // especifico que lo que quiero hacer es un post
            headers: {
                'Content-Type': 'application/json' // indicar que el body de mi peticion debe ser un objeto en formato JSON
            },
            body: JSON.stringify(data) // Convertir los datos a JSON antes de enviarlos
        });

        await cargarPaquetes() // invoco a mi getAll()
    } catch (error) {
        console.log(error)
    }
}

// Función para eliminar un paquete
async function eliminarPaquete(id) {
    try {
        await fetch(`http://localhost:4001/paquetes/${id}`, { // hago la peticion al endpoint para el borrado
            method: 'DELETE'
        });

        // Si el borrado es exitoso, volver a cargar la tabla
        cargarPaquetes();
    } catch (error) {
        console.error(error);
    }
}

function actualizarPaquete(id) {
    window.location.href = `putForm.html?id=${id}`;
}


// Cargar la lista de paquetes al cargar la página
cargarPaquetes();
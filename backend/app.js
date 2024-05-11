const express = require('express');
const { Sequelize, DataTypes, Op } = require('sequelize');
const cors = require('cors');

// Configura la aplicación Express
const app = express();
app.use(express.json());
app.use(cors());

// Configura la conexión Sequelize (base de datos SQLite en memoria)
const sequelize = new Sequelize('sqlite::memory:');

// Define el modelo Paquete
const Paquete = sequelize.define('Paquete', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    destino: DataTypes.STRING,
    duracion: DataTypes.STRING,
    precio: DataTypes.FLOAT,
    descripcion: DataTypes.TEXT
}, { timestamps: false });

// Inicializa la base de datos e inserta datos de muestra
async function inicializarBaseDeDatos() {
    await sequelize.sync({ force: true });
    await Paquete.bulkCreate([
        { destino: 'Cancún, México', duracion: '7 días', precio: 1200, descripcion: 'Disfruta de playas paradisíacas y ruinas mayas.' },
        { destino: 'Machu Picchu, Perú', duracion: '5 días', precio: 850, descripcion: 'Explora la ciudad perdida de los Incas en los Andes.' },
        { destino: 'Roma, Italia', duracion: '10 días', precio: 1500, descripcion: 'Descubre la historia y cultura de la antigua Roma.' },
        { destino: 'París, Francia', duracion: '5 días', precio: 1300, descripcion: 'Romance y cultura en la ciudad de la luz.' },
        { destino: 'Tokio, Japón', duracion: '8 días', precio: 2100, descripcion: 'Experimenta la mezcla de tradición y modernidad.' },
        { destino: 'Nueva York, USA', duracion: '6 días', precio: 1700, descripcion: 'La ciudad que nunca duerme.' },
        { destino: 'Londres, Inglaterra', duracion: '7 días', precio: 1450, descripcion: 'Historia y cultura en la capital británica.' },
        { destino: 'Río de Janeiro, Brasil', duracion: '5 días', precio: 900, descripcion: 'Playas, carnaval y el Cristo Redentor.' },
        { destino: 'Buenos Aires, Argentina', duracion: '4 días', precio: 550, descripcion: 'Tango, gastronomía y cultura porteña.' },
        { destino: 'Madrid, España', duracion: '6 días', precio: 1100, descripcion: 'Arte, historia y vida nocturna.' },
    ]);
}


// Endpoint para obtener todos los paquetes
app.get('/paquetes', async (req, res) => {
    try {
        const paquetes = await Paquete.findAll()
        const data = paquetes.map(paquete => paquete.dataValues)
        return res.json(data)
    } catch (error) {
        return res.status(404).json({ error: "No encontre los paquetes :(" })
        // 404 significa "NO ENCONTRE"
    }
});

// Endpoint para buscar por descripción
app.get('/paquetes/byDescripcion', async (req, res) => {
    const { desc } = req.query
    try {
        const whereConditions = {}

        if (desc) {
            whereConditions.descripcion = { [Op.like]: `%${desc}%` };
        }

        const paquetesFiltrados = await Paquete.findAll({
            where: whereConditions
        })

        const data = paquetesFiltrados.map(paquete => paquete.dataValues)
        return res.json(data)
    } catch (error) {
        return res.status(404).json({ error: "No encontre los paquetes :(" })
        // 404 significa "NO ENCONTRE"
    }
});

app.get("/paquetes/byPais/:pais", async (req, res) => {
    try {
        const whereConditions = {}

        if (req.params.pais) {
            whereConditions.destino = { [Op.like]: `%${req.params.pais}%` };
        }

        const paquetesFiltrados = await Paquete.findAll({
            where: whereConditions
        })

        const data = paquetesFiltrados.map(paquete => paquete.dataValues)
        return res.json(data)
    } catch (error) {
        return res.status(404).json({ error: "No encontre los paquetes :(" })
        // 404 significa "NO ENCONTRE"
    }
})


app.post("/paquetes/crear", async (req, res) => {
    try {
        if (!req.body.destino || !req.body.duracion || !req.body.precio || !req.body.descripcion) {
            return res.status(400).json({ error: "Error, falta algun dato" })
        }

        const paquetesLength = await Paquete.findOne({
            attributes: ['id'],
            limit: 1,
            order: [['id', 'DESC']]
        })

        console.log("ID DEL ULTIMO PAQUETE: ", paquetesLength.dataValues.id)

        const paqueteCreado = await Paquete.create({
            id: paquetesLength.dataValues.id + 1,
            destino: req.body.destino,
            duracion: req.body.duracion,
            precio: req.body.precio,
            descripcion: req.body.descripcion,
        })

        return res.status(200).json(paqueteCreado.dataValues)
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
})

app.delete("/paquetes/:idPaquete", async (req, res) => {
    try {
        const paquete = await Paquete.findByPk(req.params.idPaquete);
        if (!paquete) {
            return res.status(404).json({ error: 'Paquete no encontrado' });
        }
        await paquete.destroy();
        return res.status(200).json({ message: 'Paquete eliminado exitosamente' });
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
})


app.put("/paquetes/actualizar/:idPaquete", async (req, res) => {
    try {
        const paquete = await Paquete.findByPk(req.params.idPaquete);
        if (!paquete) {
            return res.status(404).json({ error: 'Paquete no encontrado' });
        }

        paquete.destino = req.body.destino
        paquete.duracion = req.body.duracion
        paquete.precio = req.body.precio
        paquete.descripcion = req.body.descripcion

        // espero a que guarde en base de datos
        await paquete.save()
        return res.status(200).json(paquete.dataValues)
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
})


// Inicia el servidor
inicializarBaseDeDatos().then(() => {
    app.listen(4001, () => console.log('Servidor corriendo en http://localhost:4001'));
});
// scripts/seed.ts
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function seed() {
    const uri = "mongodb://localhost:27017/after_hours";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("after_hours");

        // LIMPIEZA TOTAL (Reset)
        console.log("🧹 Limpiando base de datos...");
        await db.collection("users").deleteMany({});
        await db.collection("branches").deleteMany({});
        await db.collection("orders").deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash("admin123", salt);

        // INSERTAR ADMIN GENERAL
        await db.collection("users").insertOne({
            username: "admin",
            email: "admin@afterhours.com",
            password: passHash,
            tipo: "empleado",
            createdAt: new Date(),
            empleadoInfo: {
                idEmpleado: 1,
                nombreCompleto: "Administrador General",
                telefono: "555-0000",
                tipoRol: "AdminGeneral",
                estado: "Activo",
                idSucursal: 0
            }
        });

        // INSERTAR UN MESERO DE PRUEBA (Para tu diagrama)
        await db.collection("users").insertOne({
            username: "josue.mesero",
            email: "josue@afterhours.com",
            password: passHash, // misma pass admin123
            tipo: "empleado",
            createdAt: new Date(),
            empleadoInfo: {
                idEmpleado: 101,
                nombreCompleto: "Josue Mesero Test",
                telefono: "555-1234",
                tipoRol: "Mesero",
                estado: "Activo",
                idSucursal: 1 // Vinculado a Sucursal 1
            }
        });

        // INSERTAR SUCURSAL CON SECCIONES Y MESAS (Infraestructura)
        await db.collection("branches").insertOne({
            idSucursal: 1,
            nombre: "After Hours Centro",
            ubicacion: "Calle Principal #123",
            secciones: [
                {
                    idSeccion: "TERRAZA-01",
                    nombreSeccion: "Terraza",
                    mesas: [
                        { numeroMesa: 1, capacidad: 4, estado: 1 }, // 1 = Libre
                        { numeroMesa: 2, capacidad: 2, estado: 1 },
                        { numeroMesa: 3, capacidad: 6, estado: 1 }
                    ]
                },
                {
                    idSeccion: "BARRA-01",
                    nombreSeccion: "Barra Alta",
                    mesas: [
                        { numeroMesa: 10, capacidad: 1, estado: 1 },
                        { numeroMesa: 11, capacidad: 1, estado: 1 }
                    ]
                }
            ]
        });

        console.log("✅ Base de datos reseteada y poblada con éxito.");
        console.log("👉 Admin: admin / admin123");
        console.log("👉 Mesero: josue.mesero / admin123");
        
    } catch (error) {
        console.error("❌ Error en el seed:", error);
    } finally {
        await client.close();
    }
}

seed();
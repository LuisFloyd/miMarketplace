const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { llavesecreta } = require('./llave_secreta')

const { registrarUsuario, verificaCredenciales, datosUsuario, 
        registrarProducto, mostrarProductos, datosProducto, fotosProducto,
        agregarFavorito, misFavoritos, eliminarFavorito,
        mostrarRegiones, mostrarComunas, mostrarComunasPorRegion,
        agregarAlCarrusel, mostrarCarrusel,
        mostrarCategorias,
//        comprarProducto, misCompras, //eliminarCompra
        compraVentaProducto, misComprasMisVentas, misPublicaciones,
        modificaContraseña
        } = require('./consultas')
const { verificarExistenciaCredenciales, validaToken, reporteConsulta } = require('./middlewares')
const app = express()

app.listen(3001, () => { console.log('servidor corriendo en 3001') })
app.use(cors())
app.use(express.json({limit: "10mb", extended: true}))
app.use(express.urlencoded({limit: "10mb", extended: true, parameterLimit: 50000}))
app.use(reporteConsulta)


app.post('/usuarios', verificarExistenciaCredenciales , async (req, res) => {    
    try {
        const { nombre, apellido, email, clave, telefono } = req.body
        await registrarUsuario(nombre, apellido, email, clave, telefono)
        res.status(201).send('usuario registrado con éxito!')
    } catch (error) {
        //agregué try en la consulta de registrarUsuario
        //console.log({error})
        // res.status(error.code || 500).send(error.detail)
        res.status(error.code || 500).send(error.message)
    }
});
app.post('/login', verificarExistenciaCredenciales ,  async (req, res) => {
    try {
        const { email, clave } = req.body
        console.log({email}, {clave})
        await verificaCredenciales(email, clave)
        const token = jwt.sign({ email }, llavesecreta/*, {expiresIn: 18000}*/)
        res.status(201).send(token)
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)        
    }
})
//muestra los datos del usuario logueado
app.get('/usuarios', validaToken, async (req, res) => {
    console.log(`app.get('/usuarios'`)
    try {
        const Authorization = req.header('Authorization')
        const token = Authorization.split("Bearer ")[1]
        const {email} = jwt.decode(token)
        const usuario = await datosUsuario(email)
        res.json(usuario)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})

//viene siendo el subir producto
//vista en el front está casi lista!
app.post('/productos', validaToken, async (req, res) => {
    try {
        const { nombre, descripcion, 
                precio, stock, 
                id_comuna, id_categoria, id_usuario, fotos } = req.body
                //aquí creo que no debería recibir el id_usuario, sino que yo lo debo ir a buscar a la bbdd de acuerdo al email que viene en el token!!!
                //porque sino, podría ingresar productos con mi token a otro usuario!
        await registrarProducto(nombre, descripcion, 
                                precio, stock, 
                                id_comuna,id_categoria,id_usuario, fotos)
        res.status(201).send('producto registrado con éxito!')
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})

//muestra los productos (sin login)
app.get('/productos', async (req, res) => {
    try {
        const queryStrings = req.query
        const productosEnVenta = await mostrarProductos(queryStrings)
        res.json(productosEnVenta)
    } catch (error) {
        console.log(error)
        res.status(500).send(`error al ejecutar "mostrarProductos"`)        
    }
})
app.get("/productos/producto/:id_producto/:id_usuario", reporteConsulta, async (req, res) => {
    try {
        const {id_producto, id_usuario} = req.params
        const producto = await datosProducto(id_producto, id_usuario)
        res.json(producto)
    } catch (error) {
        console.log(error)
        res.status(500).send(`error al ejecutar "datosProducto"`)        
    }
})



// //muestra los productos (con login)
// app.get('/productos', validaToken, async (req, res) => {
// })




//registrar un producto como favorito
app.post('/favoritos', validaToken, async (req, res) => {
    try {
        const {id_usuario, id_producto} = req.body
        const favoritos = await agregarFavorito(id_usuario, id_producto)
        res.status(201).send('producto registrado como favorito!')
    } catch (error) {
        res.status(error.code || 500).send(error.message)
    }
})
//funcionando!
app.get('/favoritos/:id_usuario', validaToken, async (req, res) => {
    try {
        const { id_usuario} = req.params
        const favoritos = await misFavoritos(id_usuario)
        res.json(favoritos)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})
app.delete('/favoritos', validaToken, async (req, res) => {
    try {
        const {id_usuario, id_producto} = req.body
        await eliminarFavorito(id_usuario, id_producto)
        res.status(201).send("Favorito eliminado con éxito!")
    } catch (error) {
        const {code, message} = error
        res.status(code).send(message)
    }

})


app.get('/regiones', async (req, res) => {
    try {
        const queryStrings = req.query
        const regiones = await mostrarRegiones(queryStrings)
        res.json(regiones)
    } catch (error) {
        console.log(error)
        res.status(500).send(`error al ejecutar "mostrarRegiones"`)        
    }
})

app.get('/comunas', async (req, res) => {
    try {
        const queryStrings = req.query
        const comunas = await mostrarComunas(queryStrings)
        res.json(comunas)
    } catch (error) {
        console.log(error)
        res.status(500).send(`error al ejecutar "mostrarComunas"`)        
    }
})

// Cuál será la diferencia (para manejar en el front) entre estos dos endponits????
app.get('/comunasParaUnaRegion', async (req, res) => {
    try {
        const {id_Region} = req.body
        const comunasPorRegion = await mostrarComunasPorRegion(id_Region)
        res.json(comunasPorRegion)
    } catch (error) {
        console.log(error)
        res.status(500).send(`error al ejecutar "mostrarComunas"`)        
    }
})
app.get("/comunasDeUnaRegion/:idRegion", async (req, res) => {
    try {
        const {idRegion} = req.params
        const comunasDeUnaRegion = await mostrarComunasPorRegion(idRegion)
        res.json(comunasDeUnaRegion)
    } catch (error) {
        console.log(error)
        res.status(500).send(`error al ejecutar "mostrarComunasPorRegion"`)        
    }
})


app.post('/carrusel', async (req, res) => {
    try {
        const { descripcion, imagen } = req.body
        await agregarAlCarrusel(descripcion, imagen)
        res.status(201).send('datos carrusel registrados con éxito!')
    } catch (error) {
        // console.log({error})
        res.status(error.code || 500).send(error.message)
    }    
})
app.get('/carrusel', async (req, res) => {
    try {
        const queryStrings = req.query
        const carrusel = await mostrarCarrusel(queryStrings)
        res.json(carrusel)
    } catch (error) {
        console.log(error)
        res.status(500).send(`error al ejecutar "mostrarCarrusel"`)        
    }
})

app.get('/categorias', async (req, res) => {
    try {
        const queryStrings = req.query
        const categorias = await mostrarCategorias(queryStrings)
        res.json(categorias)
    } catch (error) {
        console.log(error)
        res.status(500).send(`error al ejecutar "mostrarCategorias"`)        
    }
})





//registrar compra
//quizás deberíamos guardar el precio también!
// app.post('/compras', validaToken, async (req, res) => {
//     try {
//         const {id_usuario, id_producto} = req.body
//         const compras = await comprarProducto(id_usuario, id_producto)
//         res.send('compra realizada con éxito!')
//     } catch (error) {
//         res.status(error.code || 500).send(error.message)
//     }
// })
// app.get('/compras', validaToken, async (req, res) => {
//     try {
//         const {id_usuario} = req.body
//         const compras = await misCompras(id_usuario)
//         res.json(compras)
//     } catch (error) {
//         res.status(error.code || 500).send(error)
//     }
// })
// app.delete('/compras:id', validaToken, async (req, res) => {
//     try {
//         const {id_usuario, id_producto} = req.params
//         await eliminarCompra(id_usuario, id_producto)
//         res.send("compra eliminada con éxito!")
//     } catch (error) {
//         const {code, message} = error
//         res.status(code).send(message)
//     }
// })

//registrar venta
//igual que en compra, también quizás deberíamos guardar el precio!
//me doy cuenta de que en realidad debiese existir una tabla que contenga compras y ventas, así evito duplicidad de datos
//ya que si se realiza una compra debo registrar una venta también
app.post('/compra_venta', validaToken, async (req, res) => {
    try {
        const {id_usuario_compra, id_usuario_venta, id_producto, precio_unidad, cantidad} = req.body
        const ventas = await compraVentaProducto(id_usuario_compra, id_usuario_venta, id_producto, precio_unidad, cantidad)
        res.status(201).send('compra realizada con éxito!')
    } catch (error) {
        res.status(error.code || 500).send(error.message)
    }
})
app.get('/compra_venta/:id_usuario', validaToken, async (req, res) => {
    try {
        const {id_usuario} = req.params
        // const ventas = await misComprasMisVentas(id_usuario, compra_o_venta)
        //qué será mejor: traer de inmediato las compras y las ventas? o separadas de acuerdo a lo que se requiere ver en una ventana?
        //mejor todo al tiro! así que:
        const misCompraVentas = await misComprasMisVentas(id_usuario)
        res.json(misCompraVentas)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})
// app.delete('/compra_venta:id', validaToken, async (req, res) => {
//     try {
//         const {id_usuario, id_producto} = req.params
//         await eliminarCompraVenta(id_usuario, id_producto)
//         res.send("compra eliminada con éxito!")
//     } catch (error) {
//         const {code, message} = error
//         res.status(code).send(message)
//     }
// })

app.get('/fotosProducto/:id_producto', async (req, res) => {
    try {
        const {id_producto} = req.params
        const fotos = await fotosProducto(id_producto)
        console.log({fotos})
        res.json(fotos)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})

app.get('/misPublicaciones', validaToken, async (req, res) => {
    try {
        const queryStrings = req.query
        const dataMisPublicaciones = await misPublicaciones(queryStrings)
        res.json(dataMisPublicaciones)
    } catch (error) {
        console.log(error)
        res.status(500).send(`error al ejecutar "misPublicaciones"`)        
    }
})

app.put('/usuario/modificaClave/:id', validaToken, async (req, res) => {
    try {
        const { id } = req.params
        const {nuevaClave} = req.body
        await modificaContraseña(id, nuevaClave)
        res.status(201).send(`Contraseña modificada!`)
    } catch (error) {
        console.log(error)
        res.status(500).send(`error al ejecutar "modificaContraseña". ` + error.message)
    }    
})


// pendiente:
// listo.- ruta de fotos por productos
// listo.- ruta para "mis publicaciones"
// listo.- ruta modificar contraseña. parametros entrada: token id_usuario nuevacontraseña
// listo.- funcionalidad de buscar (o mejor dicho "filtar") productos por nombre
// .- contrato del hito 1
// .- test jest 

// existen diferentes formas de uso del get! se debería estandarizar a una sola forma

app.get("*", (req, res) => {
    res.status(404).send("problemas con la ruta, al parecer no existe!")
})
module.exports = app;
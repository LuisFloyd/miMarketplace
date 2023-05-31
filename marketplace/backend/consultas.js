const { Pool } = require('pg')

// const pool = new Pool({
//     host: 'localhost',
//     user: 'postgres',
//     password: 'pgadmin2020',
//     database: 'marketplace',
//     allowExitOnIdle: true
// })

const pool = new Pool({
    host: 'instanciadb.cqwzkon7o3pu.sa-east-1.rds.amazonaws.com',
    user: 'postgres11',
    password: 'dbLATAM12',
    database: 'Marketplace1',
    allowExitOnIdle: true
})


const bcrypt = require('bcryptjs')
const format = require('pg-format')
const e = require('express')

const registrarUsuario = async (nombre, apellido, email, clave, telefono) => {
    try {
        const passwordEncriptada = await bcrypt.hashSync(clave)
        const query = `INSERT INTO Usuarios (nombre, apellido, email, clave, telefono) VALUES ($1, $2, $3, $4, $5)`
        console.log({query})
        const values = [nombre, apellido, email, passwordEncriptada, telefono]
        await pool.query(query, values)    
    } catch (error) {
        console.log({error})
        const {detail} = error
        throw { code: 500, message: detail || error.message || error }
    }
}

const verificaCredenciales = async (email, clave) => {
    const query = `Select * from usuarios where email = $1`
    const values = [email]
    const { rows : [usuario],  rowCount } = await pool.query(query, values)
    if (rowCount === 0) { 
        throw { code: 401, message: "Email no existe!" }
    }
    const {clave: passwordEncriptada} = usuario
    const passwordEsCorrecta = await bcrypt.compareSync(clave, passwordEncriptada)
    if (!passwordEsCorrecta || !rowCount) 
        throw { code: 401, message: "contraseña incorrecta!" }
}

const datosUsuario = async (email) => {
    try {
        const query = `Select * from usuarios where email = $1`
        const values = [email]
        const { rows: [usuario], rowCount } = await pool.query(query, values)
        if (!rowCount) 
            throw { code: 404, message: "usuario no encontrado!" }
        delete usuario.clave
        return usuario
    } catch (error) {
        console.log({error})
        const {detail} = error
        throw { code: 500, message: detail || error.message || error }
    }
}

const registrarProducto = async (   nombre, descripcion, 
                                    precio, stock, 
                                    id_comuna, id_categoria, id_usuario,
                                    fotos) => {    
    // fecha_publicacion = será la fecha del servidor
    // estado_venta = debe ser activa, o sea 1

    try {
        const query = `INSERT INTO Productos (  fecha_publicacion, nombre, descripcion, 
                                                precio, stock, estado_venta, 
                                                id_comuna,id_categoria,id_usuario
                                                )
                                    VALUES (    current_date, $1, $2, 
                                                $3, $4, 1, 
                                                $5, $6, $7) returning id `
        const values = [nombre, descripcion, 
                        precio, stock, 
                        id_comuna,id_categoria,id_usuario]
        const nuevoProducto = await pool.query(query, values)
        const idNuevoProducto = nuevoProducto.rows[0].id;

        // console.log({idNuevoProducto})
        // console.log({fotos})
        // console.log(fotos)
        // Array.isArray(fotos) ? console.log('Sí, fotos es un array') : console.log('No, fotos NO es un array')
        // let totalFotos = fotos.length
        // let coma = ''
        // let queryValuesFotos = 'VALUES '
        let valuesFotos = []
        fotos.map((f) => {
            valuesFotos.push(`(${idNuevoProducto} , '${f}')`)
            // coma = ','
            // queryValuesFotos += `("${f}")` + coma
            // return{ saludo: 'hola' }
        })
        if (valuesFotos.length > 0) {
            valuesFotos = valuesFotos.join(', ')
            const queryInsertFotos = `Insert into imagenes_producto (id_producto, imagen) VALUES ` + valuesFotos
            console.log({queryInsertFotos})
            console.log('fin')
            await pool.query(queryInsertFotos)
        }
        // console.log(result)
        // const queryInsertFotos = `Insert into imagenes_producto VALUES` + queryValuesFotos
        //OPERADOR TERNARIO:
        //condicion ? sentencia si es verdadera) : sentencia si es falsa
    } catch (error) {
        console.log({error})
        const {detail} = error
        throw { code: 500, message: detail || error.message || error }
    }
}

const registrarFoto = async ( id_usuario, foto ) => {

}

//pendiente:
//1.- Podría mostrar la cantidad de favoritos del producto
//2.- Al actualizar datos de un producto, este se modificacría es los productos mostrados en los comprados por otro usuario, así 
//    tal como se guardó el precio, se debería guardar toda la data del producto en el momento de la compra???


const mostrarProductos = async ({idLogin = -1, limits = 66, page = 1, filtroNombre = "TODOS", idRegion = -1, idCategoria = -1, precioMin = -1, precioMax = -1}) => {
    try {
        const offset = (page - 1)  * limits
        const filtroNombreComillas = "'"+filtroNombre+"'"
        const filtroNombreLike = "'%"+filtroNombre+"%'"
        console.log({idLogin, limits, offset, page, filtroNombre, filtroNombreComillas, filtroNombreLike, idRegion, idCategoria, precioMin, precioMax})
        // const consultaTotalProductos = format(`   Select count(1) as "totalProductosEnVenta" from productos where estado_venta = 1`)
        // const { rows : totalProductos } = await pool.query(consultaTotalProductos)
        // // console.log({totalProductos})
        // const totalProductosEnVenta =  totalProductos[0].totalProductosEnVenta
        const consulta = format(`   Select		distinct
                                                p.id, p.fecha_publicacion, p.nombre, p.descripcion, p.precio, p.stock,
                                                p.estado_venta, c.id_region, p.id_comuna, p.id_categoria, p.id_usuario,
                                                evp.nombre as EstadoVenta, r.nombre as region, c.nombre as comuna, cat.nombre as categoria, 
                                                (u.nombre || ' ' || u.apellido) as nombre_vendedor, u.email, coalesce(u.telefono, ':(') as telefono,
                                                coalesce((Select	imagen from	imagenes_producto where	id_producto = p.id limit(1)), ':(') as imagen,
                                                CASE when coalesce(f.id, 0) > 0 then true else false END as favorito
                                    from		productos			    as p
                                    inner join	estado_venta_producto	as evp	on	evp.id	= p.estado_venta
                                    inner join	comunas			    	as c	on	c.id	= p.id_comuna
                                    inner join	regiones			    as r	on	r.id	= c.id_region
                                    inner join	categorias	    		as cat	on	cat.id	= p.id_categoria
                                    inner join	usuarios			    as u	on	u.id	= p.id_usuario
                                    left join   favoritos               as f	on	f.id_usuario	= %s
                                                                                and	p.id            = f.id_producto
                                    where		p.estado_venta = 1
                                    and         (upper(%s) = 'TODOS' or upper(p.nombre) like upper(%s))

                                    and         (%s = -1 or r.id = %s)
                                    and         (%s = -1 or cat.id = %s)
                                    and         (%s = -1 or p.precio >= %s)
                                    and         (%s = -1 or p.precio <= %s)

                                    order by p.fecha_publicacion desc, id
                                    LIMIT %s OFFSET %s`,
                                    idLogin, filtroNombreComillas, filtroNombreLike, idRegion,idRegion, idCategoria,idCategoria, precioMin,precioMin, precioMax,precioMax, limits, offset)
        // console.log({consulta})
        console.log(consulta)
        const { rows : productos } = await pool.query(consulta)
        const totalProductosEnVenta = productos.length
        const datos = {totalProductosEnVenta, productos}
        return datos
    } catch (error) {
        console.log({error})
        const {detail} = error
        throw { code: 500, message: detail || error.message || error }
    }

}



const datosProducto = async (id_producto, id_usuario) => {
    try {
        const consulta = format(`   Select		distinct
                                                p.id, p.fecha_publicacion, p.nombre, p.descripcion, p.precio, p.stock,
                                                p.estado_venta, c.id_region, p.id_comuna, p.id_categoria, p.id_usuario,
                                                evp.nombre as EstadoVenta, r.nombre as region, c.nombre as comuna, cat.nombre as categoria, 
                                                (u.nombre || ' ' || u.apellido) as nombre_vendedor, u.email, coalesce(u.telefono, ':(') as telefono,
                                                coalesce((Select	imagen from	imagenes_producto where	id_producto = p.id limit(1)), ':(') as imagen,
                                                CASE when coalesce(f.id, 0) > 0 then true else false END as favorito
                                    from		productos			    as p
                                    inner join	estado_venta_producto	as evp	on	evp.id	= p.estado_venta
                                    inner join	comunas			    	as c	on	c.id	= p.id_comuna
                                    inner join	regiones			    as r	on	r.id	= c.id_region
                                    inner join	categorias	    		as cat	on	cat.id	= p.id_categoria
                                    inner join	usuarios			    as u	on	u.id	= p.id_usuario
                                    left join   favoritos               as f	on	f.id_usuario	= %s
                                                                                and	p.id            = f.id_producto
                                    where		p.id = %s`,
                                    id_usuario, id_producto)
        console.log({consulta})
        const { rows : producto } = await pool.query(consulta)
        return producto
    } catch (error) {
        console.log({error})
        const {detail} = error
        throw { code: 500, message: detail || error.message || error }
    }
}
// pendiente:
// un usuario podría dejar como favorito un producto que él mismo está vendiendo!!!

const fotosProducto = async (id_producto) => {
    try {
        const consulta = format(`   Select		imagen
                                    from		imagenes_producto
                                    where		id_producto = %s`,
                                    id_producto)
        console.log({consulta})
        const { rows : fotos } = await pool.query(consulta)
        return fotos
    } catch (error) {
        console.log({error})
        const {detail} = error
        throw { code: 500, message: detail || error.message || error }
    }
}

const agregarFavorito = async ( id_usuario, id_producto) => {    
    try {
        const values = [id_usuario, id_producto]
        const queryVerSiExisteRegistro = `Select * from Favoritos where id_usuario = $1 and id_producto = $2`
        const { rowCount } = await pool.query(queryVerSiExisteRegistro, values)
        if (rowCount === 0) {
            const query = `INSERT INTO Favoritos ( id_usuario, id_producto ) VALUES ( $1, $2)`
            await pool.query(query, values)    
            console.log({query})
        }
    } catch (error) {
        console.log({error})
        const {detail} = error
        throw { code: 500, message: detail || error.message || error }
    }
}
const misFavoritos = async (id_usuario) => {
    try {
        const query = ` Select		p.id, p.fecha_publicacion, p.nombre, p.descripcion, p.precio, p.stock,
                                    p.estado_venta, c.id_region, p.id_comuna, p.id_categoria, p.id_usuario,
                                    evp.nombre as EstadoVenta, r.nombre as region, c.nombre as comuna, cat.nombre as categoria, 
                                    (u.nombre || ' ' || u.apellido) as nombre_vendedor, u.email, coalesce(u.telefono, ':(') as telefono,
                                    coalesce((Select	imagen from	imagenes_producto where	id_producto = p.id limit(1)), ':(') as imagen,
                                    true as favorito
                        from		favoritos	    		as f
                        inner join	productos		    	as p	on	p.id	= f.id_producto
                        inner join	estado_venta_producto	as evp	on	evp.id	= p.estado_venta
                        inner join	comunas	    			as c	on	c.id	= p.id_comuna
                        inner join	regiones	    		as r	on	r.id	= c.id_region
                        inner join	categorias		    	as cat	on	cat.id	= p.id_categoria
                        inner join	usuarios			    as u	on	u.id	= p.id_usuario
                        where		f.id_usuario = $1
                        order by p.fecha_publicacion desc`
        const values = [id_usuario]
        
        const { rows, rowCount } = await pool.query(query, values)
        // if (rowCount == 0){
        //     console.log('No tiene favoritos!')
        //     throw { code: 101, message: "No tiene favoritos!" }
        // }
        return rows
    } catch (error) {
        console.log({error})
        const {detail} = error
        throw { code: 500, message: detail || error.message || error }
    }
}

const eliminarFavorito = async (id_usuario, id_producto) => {
    try {
        const consulta = "Delete from favoritos where id_usuario = $1 and id_producto = $2"
        const values = [id_usuario, id_producto]
        const result = await pool.query(consulta, values)
        console.log({result})
        const {rowCount} = result
        if (rowCount == 0) {
            throw { code: 404, message: 'Favorito No Existe!'}
        }
        console.log("favorito eliminado")
    } catch (error) {
        console.log({error})
        const {detail} = error
        throw { code: 500, message: detail || error.message || error }
    }
}

const mostrarRegiones = async () => {
    const query = `Select * from regiones`    
    const { rows, rowCount } = await pool.query(query)
    if (rowCount == 0){
        console.log('No hay datos de las Regiones!')
        throw { code: 101, message: "No hay datos de las Regiones!" }
    } 
    return rows
}

const mostrarComunas = async () => {
    console.log('Mostrar comunas')
    const query = `Select * from comunas`    
    const { rows, rowCount } = await pool.query(query)
    if (rowCount == 0){
        console.log('No hay datos de las Comunas!')
        throw { code: 101, message: "No hay datos de las Comunas!" }
    } 
    return rows
}
const mostrarComunasPorRegion = async (idRegion) => {
    console.log('mostrarComunasPorRegion')
    // const query = `Select * from comunas where id_region = $1`
    const query = format(`Select * from comunas where id_region = %s`, [idRegion])
    console.log({query})
    const { rows : comunasPorRegion, rowCount } = await pool.query(query)
    if (rowCount == 0){
        console.log('No hay comunas para esta región!')
        throw { code: 101, message: "No hay comunas para esta región!" }
    } 
    return comunasPorRegion
}

const agregarAlCarrusel = async ( descripcion, imagen) => {    
    try {
        const query = `INSERT INTO Carrusel ( descripcion, imagen ) VALUES ( $1, $2)`
        const values = [descripcion, imagen]
        await pool.query(query, values)    
        console.log({query})
    } catch (error) {
        console.log({error})
        const {detail} = error
        throw { code: 500, message: detail || error.message || error }
    }
}
const mostrarCarrusel = async () => {
    const query = `Select * from Carrusel`    
    const { rows, rowCount } = await pool.query(query)
    if (rowCount == 0){
        console.log('No hay datos en Carrusel!')
        throw { code: 101, message: "No hay datos en Carrusel!" }
    } 
    return rows
}

const mostrarCategorias = async () => {
    const query = `Select * from Categorias`    
    const { rows, rowCount } = await pool.query(query)
    if (rowCount == 0){
        console.log('No hay datos en Categorias!')
        throw { code: 101, message: "No hay datos en Categorias!" }
    } 
    return rows
}

const compraVentaProducto = async ( id_usuario_compra, id_usuario_venta, id_producto, precio_unidad, cantidad) => {    
    try {
        const query = `INSERT INTO Compra_Venta ( id_usuario_compra, id_usuario_venta, id_producto, precio_unidad, cantidad, fecha_compra_venta ) VALUES ( $1, $2, $3, $4, $5, current_date)`
        const values = [id_usuario_compra, id_usuario_venta, id_producto, precio_unidad, cantidad]
        await pool.query(query, values)    
        console.log({query})
    } catch (error) {
        console.log({error})
        const {detail} = error
        throw { code: 500, message: detail || error.message || error }
    }
}

//pendiente 
//va siempre true en favorito linea 405 ver si se quita o se corrige
const misComprasMisVentas = async (id_usuario) => {
    let query = `Select		cv.id as id_compra_venta, cv.id_usuario_compra, cv.id_usuario_venta, cv.precio_unidad, cv.cantidad, fecha_compra_venta,
                                p.id as id_producto, p.fecha_publicacion, p.nombre, p.descripcion, p.precio, p.stock,
                                p.estado_venta, c.id_region, p.id_comuna, p.id_categoria, p.id_usuario,
                                evp.nombre as EstadoVenta, r.nombre as region, c.nombre as comuna, cat.nombre as categoria, 
                                (u.nombre || ' ' || u.apellido) as nombre_vendedor, u.email, coalesce(u.telefono, ':(') as telefono,
                                coalesce((Select	imagen from	imagenes_producto where	id_producto = p.id limit(1)), ':(') as imagen,
                                CASE when coalesce(f.id, 0) > 0 then true else false END as favorito
                    from		compra_venta    		as cv
                    inner join	productos		    	as p	on	p.id	= cv.id_producto
                    inner join	estado_venta_producto	as evp	on	evp.id	= p.estado_venta
                    inner join	comunas	    			as c	on	c.id	= p.id_comuna
                    inner join	regiones	    		as r	on	r.id	= c.id_region
                    inner join	categorias		    	as cat	on	cat.id	= p.id_categoria
                    inner join	usuarios			    as u	on	u.id	= p.id_usuario 
                    left join   favoritos               as f	on	f.id_usuario	= $1
                                                                and	p.id            = f.id_producto `
    const whereCompras  = `where		cv.id_usuario_compra = $2 `
    const whereVentas   = `where		cv.id_usuario_venta = $2 `
    const orderBy       = `order by cv.fecha_compra_venta desc`
    const values = [id_usuario, id_usuario]    

    const compras   = query + whereCompras + orderBy
    const ventas    = query + whereVentas + orderBy
    // console.log({compras}, {ventas})
    const { rows : misCompras, rowCount: rowCountMisCompras } = await pool.query(compras, values)
    const { rows : misVentas, rowCount: rowCountMisVentas }   = await pool.query(ventas, values)
    if (rowCountMisCompras == 0){
        console.log('No tiene compras!')
     } 
     if (rowCountMisVentas == 0){
        console.log('No tiene ventas!')
     } 
     const datos = {rowCountMisCompras, misCompras, rowCountMisVentas, misVentas}
    return datos
}


const misPublicaciones = async ({idLogin = 0, limits = 66, page = 1}) => {
    // En el thunder, los parámetros van en la seccion de Query/QueryParameters, y no en el body!
    try {
        const offset = (page - 1)  * limits
        const consultaTotalPublicaciones = format(`   Select count(1) as "totalPublicaciones" from productos where id_usuario = %s`, idLogin)
        const { rows : totalPublicaciones } = await pool.query(consultaTotalPublicaciones)
        // console.log({idLogin, offset, limits, totalPublicaciones})
        const totalDePublicaciones =  totalPublicaciones[0].totalPublicaciones
        const consulta = format(`   Select		distinct
                                                p.id, p.fecha_publicacion, p.nombre, p.descripcion, p.precio, p.stock,
                                                p.estado_venta, c.id_region, p.id_comuna, p.id_categoria, p.id_usuario,
                                                evp.nombre as EstadoVenta, r.nombre as region, c.nombre as comuna, cat.nombre as categoria, 
                                                (u.nombre || ' ' || u.apellido) as nombre_vendedor, u.email, coalesce(u.telefono, ':(') as telefono,
                                                coalesce((Select	imagen from	imagenes_producto where	id_producto = p.id limit(1)), ':(') as imagen,
                                                CASE when coalesce(f.id, 0) > 0 then true else false END as favorito
                                    from		productos			    as p
                                    inner join	estado_venta_producto	as evp	on	evp.id	= p.estado_venta
                                    inner join	comunas			    	as c	on	c.id	= p.id_comuna
                                    inner join	regiones			    as r	on	r.id	= c.id_region
                                    inner join	categorias	    		as cat	on	cat.id	= p.id_categoria
                                    inner join	usuarios			    as u	on	u.id	= p.id_usuario
                                    left join   favoritos               as f	on	f.id_usuario	= %s
                                                                                and	p.id            = f.id_producto
                                    where		p.id_usuario = %s
                                    order by p.fecha_publicacion desc, id
                                    LIMIT %s OFFSET %s`,
                                    idLogin, idLogin, limits, offset)
        // console.log(consulta)
        const { rows : productos } = await pool.query(consulta)
        const datos = {totalDePublicaciones, productos}
        return datos
    } catch (error) {
        console.log({error})
        const {detail} = error
        throw { code: 500, message: detail || error.message || error }
    }
}


const modificaContraseña = async (id, nuevaClave) => {
    try {
        //condicion ? sentencia si es verdadera) : sentencia si es falsa
        if (nuevaClave.length < 8) 
            {throw { code: 500, message: 'clave no puede ser de largo menor a ocho caracteres!' }}

        const passwordEncriptada = await bcrypt.hashSync(nuevaClave)
        const consulta = "Update usuarios set clave = $1 where id = $2"
        const values = [passwordEncriptada, id]
        const result = await pool.query(consulta, values)
        console.log({result})
        const {rowCount} = result
        if (rowCount == 0) {
            throw { code: 404, message: 'Usuario No Existe!'}
        }
        console.log("contraseña modificada!")
    } catch (error) {
        console.log({error})
        const {detail} = error
        throw { code: 500, message: detail || error.message || error }
    }
}



/*
Pendientes que hay que ver:
favoritos funciona con cualquier token válido, aún siendo un token de otro usuario!
*/
module.exports = {  registrarUsuario, verificaCredenciales, datosUsuario,
                    registrarProducto, mostrarProductos, datosProducto, fotosProducto,
                    agregarFavorito, misFavoritos, eliminarFavorito,
                    mostrarRegiones, mostrarComunas, mostrarComunasPorRegion,
                    agregarAlCarrusel, mostrarCarrusel,
                    mostrarCategorias,
                    // comprarProducto, misCompras
                    compraVentaProducto, misComprasMisVentas, misPublicaciones,
                    modificaContraseña
 }
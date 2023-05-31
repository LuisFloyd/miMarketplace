const request = require("supertest");
const server = require("../index.js");

let jwtGlobal = '';
let loginGlobal = '';

describe("Verifica carga de datos en tablas base", () => {
    // it("verificando existencia de datos en Estado_Venta_Producto", async () => {
    //     NO EXISTE RUTA PARA SOLO OBTENER REGISTROS DE TABLA Estado_Venta_Producto
    //     const response = await request(server).get("/productos").send();
    //     const status = response.statusCode;
    //     expect(status).toBe(200);
    // });
    it("verificando existencia de al menos una Categoria", async () => {
        const {_body: datos, statusCode : status} = await request(server).get("/categorias").send();
        expect(status).toBe(200);
        expect(datos).toBeInstanceOf(Array);
        expect(datos.length).toBeGreaterThan(0);
    });
    it("verificando existencia de 16 Regiones", async () => {
        const {_body: datos, statusCode : status} = await request(server).get("/regiones").send();
        expect(status).toBe(200);
        expect(datos).toBeInstanceOf(Array);
        expect(datos.length).toEqual(16);
    });
    it("verificando existencia de 346 Comunas", async () => {
        const {_body: datos, statusCode : status} = await request(server).get("/comunas").send();
        expect(status).toBe(200);
        expect(datos).toBeInstanceOf(Array);
        expect(datos.length).toEqual(346);
    });
});

describe("Operaciones asociados a Usuarios", () => {
    it(`ruta post("/usuarios"), agrega nuevo usuario, devuelve código 201`, async () => {
        const emailDistinto = Math.floor(Math.random() * 99999);
        const nuevoEmail = emailDistinto + '@nuevousuario'
        const usuario   = { nombre: "nombre nuevo usuario",
                            apellido: "ape nuevo usuario",
                            email: `${nuevoEmail}`,
                            clave: "claveNuevoUsuario",
                            telefono: "fono nuevo usuario"}
        response = await request(server).post("/usuarios").send(usuario);
        const status = response.statusCode;
        expect(status).toBe(201);
        const email = usuario.email
        const clave = usuario.clave
        loginGlobal = {email , clave}
    })

    it(`ruta post("/login") realiza login del nuevo usuario y se obtiene el token`, async () => {
        const token = await request(server).post("/login").send(loginGlobal);        
        const jwt = 'Bearer ' + token.text
        jwtGlobal = jwt;//así si viene undefine deja mal a jwtGlobal
        expect(jwtGlobal).not.toEqual('')
    });
    
    it(`ruta get("/usuarios") recuperando datos del usuario "logueado", que sea el mismo email del usuario creado de acuerdo al token`, async () => {
        const {_body : datosUsuario, statusCode : status} = await request(server)
                                                                .get("/usuarios")
                                                                .set('Authorization', jwtGlobal)
                                                                .send();
        expect(status).toBe(200);
        expect(datosUsuario.email).toEqual(loginGlobal.email);
    });
})


describe("Operaciones de Productos", () => {
    it(`ruta post("/productos"), agrega nuevo producto, devuelve código 201`, async () => {
        const producto   = { 
            nombre: "producto nuevo",
            descripcion: "producto agregado desde test" ,
            precio: 25 , 
            stock: 5 , 
            id_comuna: 80,
            id_categoria:  1,
            id_usuario: 1,
            fotos: ["foto1", "foto2"]            
        }
        response = await request(server).post("/productos").set('Authorization', jwtGlobal).send(producto);
        const status = response.statusCode;
        expect(status).toBe(201);
    })
    it(`ruta get("/productos") Obteniendo status code 200`, async () => {
        const {_body : datos, statusCode : status} = await request(server).get("/productos").send();
        expect(status).toBe(200);
        expect(datos.productos.length).toBeGreaterThan(0);
    });
    
})    
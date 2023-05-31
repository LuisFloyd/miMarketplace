import React from 'react'
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import MyContext from "../my_context.js";
import axios from "axios";

const Comprar = () => {

    const { productoSeleccionado, loginContext } = useContext(MyContext);

    const navigate = useNavigate();

    function aplicarMayuscula(str) {
        const palabras = str.split(" ").map(palabra => {
            return palabra[0].toUpperCase() + palabra.slice(1);
        });
        return palabras.join(" ");
    };

    const payloadCompra = {
        id_usuario_compra: loginContext.id,
        id_usuario_venta: productoSeleccionado.id_usuario,
        id_producto: productoSeleccionado.id,
        precio_unidad: productoSeleccionado.precio,
        cantidad: 1
    };

    const handleComprar = async () => {
        if (payloadCompra.id_usuario_compra === payloadCompra.id_usuario_venta) {
            alert("No puedes comprar tu producto en venta 😤")
        } else {
            const urlServer = "http://localhost:3001";
            const endpoint = "/compra_venta";
            const token = localStorage.getItem("token")
            try {
                await axios.post(urlServer + endpoint, payloadCompra, {
                    headers: { Authorization: "Bearer " + token }
                });
                alert("Tus datos han sido enviados al vendedor.");
                navigate("/misCompras");
            } catch (error) {
                alert("Algo salió mal ...");
                console.log(error);
            }
        };
    };

    return (
        <div className='m-5 bg-white rounded'>
            <h1 className='ms-3'>Confirma tu compra, los datos son:</h1>
            <div style={{ minWidth: '18rem' }}>
                <div
                    className="foto"
                    style={{ backgroundImage: `url(${productoSeleccionado.imagen})` }}
                ></div>
            </div>
            <div className="p-3 container">
                <div className='row p-1 border-bottom'>
                    <div className="col-4 border-end ">Producto</div>
                    <div className="col-8 ">{aplicarMayuscula(productoSeleccionado.nombre)}</div>
                </div>
                <div className='row p-1 border-bottom'>
                    <div className="col-4 border-end ">Vendedor</div>
                    <div className="col-8 ">{aplicarMayuscula(productoSeleccionado.nombre_vendedor)}</div>
                </div>
                <div className='row p-1 border-bottom'>
                    <div className="col-4 border-end ">Precio</div>
                    <div className="col-8 ">${Intl.NumberFormat('es-CL').format(`${productoSeleccionado.precio}`)}</div>
                </div>
                <div className='row p-1 border-bottom'>
                    <div className="col-4 border-end ">Ubicación</div>
                    <div className="col-8 ">{productoSeleccionado.comuna}, {productoSeleccionado.region}</div>
                </div>
                <div className='row p-1 border-bottom'>
                    <div className="col-4 border-end ">Teléfono</div>
                    <div className="col-8 ">{productoSeleccionado.telefono}</div>
                </div>
                <div className='row p-1 border-bottom'>
                    <div className="col-4 border-end ">Correo</div>
                    <div className="col-8 ">{productoSeleccionado.email}</div>
                </div>
            </div>
            <div className='d-flex justify-content-center pb-3'>
                <button className='btn btn-danger bg-gradient' onClick={() => handleComprar()}><strong>CONFIRMAR COMPRA</strong></button>
            </div>
        </div>
    )
}

export default Comprar
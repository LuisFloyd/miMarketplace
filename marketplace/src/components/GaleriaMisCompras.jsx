import React from 'react';
import { useState, useEffect, useContext } from "react";
import MyContext from "../my_context";
import Card from './Card';
import Loading from "./Loading";
import axios from 'axios';

const GaleriaMisCompras = () => {

    const { loginContext, favorite } = useContext(MyContext);
    const [totalProductos, setTotalProductos] = useState();

    const getDataProductos = async () => {
        const urlServer = "http://localhost:3001/compra_venta/";
        const endpoint = loginContext.id;
        const token = localStorage.getItem("token");
        try {
            /* console.log("pidiendo data con los siguientes parametros:")
            console.log(loginContext.id + " " + token) */
            const { data } = await axios.get(urlServer + endpoint, {
                headers: { Authorization: "Bearer " + token },
            });
            /* console.log("se carga data")
            console.log(data.misCompras) */
            //aca se sobrescriben los estados  & context//    
            setTotalProductos(data.misCompras);
            /* console.log("solicitud y carga de datos completada con éxito") */
        } catch {
            console.log("ya valió @");
        };
    };

    useEffect(() => {
        getDataProductos();
    }, [favorite]);

    return (
        <div>
            <div className="container p-3">
                <div className="row row-cols-1 row-cols-lg-2">

                    {totalProductos == undefined ?
                        <Loading /> :
                        totalProductos.map(producto => (
                            <div key={producto.id} className="col d-flex justify-content-center">
                                <Card
                                    imagen={producto.imagen}
                                    nombre={producto.nombre}
                                    precio={producto.precio}
                                    id={producto.id_producto}
                                    favorito={producto.favorito}
                                />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default GaleriaMisCompras
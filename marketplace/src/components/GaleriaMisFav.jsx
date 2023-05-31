import React from 'react'
import { useState, useEffect, useContext } from "react";
import MyContext from "../my_context";
import Card from './Card'
import Loading from "./Loading";
import axios from 'axios';

const GaleriaMisPub = () => {

    const { loginContext, favorite } = useContext(MyContext);
    const [loginLocal, setLoginLocal] = useState({});
    const [page, setPage] = useState(1);
    const [totalProductos, setTotalProductos] = useState();

    const getDataProductos = async () => {
        const urlServer = "http://localhost:3001/favoritos/";
        const endpoint = loginContext.id;
        const token = localStorage.getItem("token");

        try {
            /* console.log("voy pedir data con los siguientes parametros:")
            console.log(loginLocal)
            console.log(token) */
            const { data } = await axios.get(urlServer + endpoint, {
                headers: { Authorization: "Bearer " + token },
            });
            /* console.log("se carga data") */
            //aca se sobreescriben los estados  & context//    
            setTotalProductos(data);
            /* console.log(totalProductos) */
        } catch {
            /* console.log("ya valio @"); */
        }
    };

    useEffect(() => {
        getDataProductos();
    }, [favorite]);

    return (
        <div className='p-1'>
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
                                    id={producto.id}
                                    favorito={producto.favorito}
                                />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default GaleriaMisPub
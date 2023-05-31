import React from 'react';
import { useState, useEffect, useContext } from "react";
import MyContext from "../my_context";
import Card from './Card';
import Loading from "./Loading";
import axios from 'axios';

const GaleriaMisPub = () => {

    const { productosData, setProductosData, loginContext, favorite } = useContext(MyContext);
    const [loginLocal, setLoginLocal] = useState({});
    const [limits, setLimits] = useState(6);
    const [page, setPage] = useState(1);
    const [totalProductos, setTotalProductos] = useState();

    //endpoint con filtros   

    const getDataProductos = async () => {
        const urlServer = "https://54.147.207.191";
        const endpoint = "/misPublicaciones";
        const token = localStorage.getItem("token");

        try {
            const { data } = await axios.get(`${urlServer}${endpoint}?idLogin=${loginContext.id}&limits=${limits}&page=${page}`, {
                headers: { Authorization: "Bearer " + token },
            });
            //aca se sobreescriben los estados  & context//    
            setProductosData(data);
            setTotalProductos(data.totalDePublicaciones);
        } catch {
            console.log("ya valio @");
        };
    };

    const paginaSiguiente = () => {
        const pagesCount = totalProductos / limits;
        const paginaActual = page;
        if (page >= pagesCount) {
            alert("No existen más paginas");
        } else {
            setPage(paginaActual + 1);
        };
    };

    const paginaAnterior = () => {
        const paginaActual = page;
        if (page <= 1) {
            alert("Esta es la primera página");
        } else {
            setPage(paginaActual - 1);
        };
    };

    useEffect(() => {
        getDataProductos();
    }, [page, favorite]);

    return (
        <div>
            <div className="d-flex ms-5 me-5 btn-group justify-content-center">
                <button className="btn btn-secondary carousel-control-prev-icon" onClick={paginaAnterior} type="button"></button>
                <button className="btn btn-secondary carousel-control-next-icon" onClick={paginaSiguiente} type="button"></button>
            </div>
            <div className="container p-3">
                <div className="row row-cols-1 row-cols-lg-2">

                    {productosData.productos == undefined ?
                        <Loading /> :
                        productosData.productos.map(producto => (
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
import React from 'react'
import { useState, useEffect, useContext } from "react";
import MyContext from "../my_context";
import Card from '../components/Card'
import Loading from "../components/Loading";

const Galeria = () => {

    const { productosData, setProductosData, loginContext, favorite, searchedItem } = useContext(MyContext);

    const [limits, setLimits] = useState(6);
    const [page, setPage] = useState(1);
    const [totalProductos, setTotalProductos] = useState();

    const url = "http://54.147.207.191";
    const endpoint = "/productos";

    const getTotalProducts = async () => {
        const urlServer = `${url}${endpoint}?limits=9999999999999999`;
        const response = await fetch(urlServer);
        const data = await response.json();
        setTotalProductos(data.totalProductosEnVenta);
    };

    const getDataProductos = async () => {
        if (loginContext == "" || !loginContext) {
            const urlServer = `${url}${endpoint}?limits=${limits}&page=${page}&filtroNombre=${searchedItem}`;
            const response = await fetch(urlServer);
            const data = await response.json();
            setProductosData(data);
        }
        if (loginContext) {
            const urlServer = `${url}${endpoint}?limits=${limits}&page=${page}&filtroNombre=${searchedItem}&idLogin=${loginContext.id}`;
            const response = await fetch(urlServer);
            const data = await response.json();
            setProductosData(data);
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
        getTotalProducts();
    }, []);

    useEffect(() => {
        getDataProductos();
        getTotalProducts();
    }, [searchedItem]);

    return (
        <div className='mt-3'>
            <div className="d-flex ms-5 me-5 btn-group justify-content-center">
                <button className="btn btn-primary carousel-control-prev-icon" onClick={paginaAnterior} type="button"></button>
                <button className="btn btn-primary carousel-control-next-icon" onClick={paginaSiguiente} type="button"></button>
            </div>
            <div className="container p-3">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">

                    {productosData.productos === undefined ?
                        <Loading /> :
                        productosData.productos.map(producto => (
                            <div key={producto.id} className="col d-flex justify-content-center">
                                <Card
                                    imagen={producto.imagen}
                                    nombre={producto.nombre}
                                    id={producto.id}
                                    precio={producto.precio}
                                    favorito={producto.favorito}
                                />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default Galeria
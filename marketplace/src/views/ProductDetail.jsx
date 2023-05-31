import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from "react";
import MyContext from "../my_context.js";
import Heart from '../components/Heart';
import axios from "axios";
import Loading from '../components/Loading.jsx';


const ProductDetail = () => {

    const { loginContext, setFavorite, favorite, productoSeleccionado, setProductoSeleccionado } = useContext(MyContext);

    const { id } = useParams();

    const [productImages, setProductImages] = useState([])

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const url = "https://54.147.207.191";
    const endpoint = "/productos/producto";

    const getDataProductoSeleccionado = async () => {
        const urlServer = `${url}${endpoint}/${id}/${loginContext.id}`;
        const response = await fetch(urlServer);
        const data = await response.json();
        setProductoSeleccionado(data[0]);
    };

    function aplicarMayuscula(str) {
        const palabras = str.split(" ").map(palabra => {
            return palabra[0].toUpperCase() + palabra.slice(1);
        });
        return palabras.join(" ");
    };

    const agregarFavorito = async (payload) => {
        const urlServer = "https://54.147.207.191";
        const endpoint = "/favoritos";
        try {
            await axios.post(urlServer + endpoint, payload, {
                headers: { Authorization: "Bearer " + token }
            });
        } catch (error) {
            alert("Algo salió mal ...");
            console.log(error);
        }
    };

    const quitarFavorito = async (payload) => {
        const urlServer = "https://54.147.207.191";
        const endpoint = "/favoritos";
        try {
            await axios.delete(urlServer + endpoint, {
                headers: {
                    Authorization: "Bearer " + token
                },
                data: {
                    id_usuario: loginContext.id,
                    id_producto: id
                }
            });
        } catch (error) {
            alert("Algo salió mal ...");
            console.log(error);
        }
    }

    const handleClick = async (id, favorito) => {
        await setFavorite(favorito);
        if (loginContext == "" || !loginContext) {
            navigate("/login");
        };
        if (favorito) {
            localStorage.setItem("token", token);
            quitarFavorito({
                id_usuario: loginContext.id,
                id_producto: id
            });
            await setFavorite(false);
        }
        else {
            localStorage.setItem("token", token);
            agregarFavorito({
                id_usuario: loginContext.id,
                id_producto: id
            });
            await setFavorite(true);
        };
    };

    const getProductImages = async () => {
        const urlServer = `${url}/fotosProducto/${id}`;
        const response = await fetch(urlServer);
        const data = await response.json();
        setProductImages(data);
    };

    const renderCarrousel = () => {
        if (productImages === undefined) {
            <Loading />
        }
        if (productImages.length > 0) {
            return productImages.map((images, index) => (
                <div key={1 + Math.random()} className={`carousel-item ${index === 0 ? "active" : ""} justify-content-center d-flex`} data-bs-interval="5000">
                    <img src={images.imagen} style={{ maxHeight: '18rem', minHeight: '18rem' }} className="d-block" alt="..."></img>
                </div>
            ))
        };
    };

    useEffect( () => {
        setProductoSeleccionado([]);
        setProductImages([]);
        getDataProductoSeleccionado();
        getProductImages();
    }, [favorite]);

    return (
        <div className=''>
            <div>
                <div className="card container mt-4">
                    <h5 className="text-end">{productoSeleccionado.categoria}</h5>
                    <h1 className="card-title">{aplicarMayuscula(`${productoSeleccionado.nombre}`)}</h1>
                    <div className='row d-flex'>
                        <div className="col">
                            <h3>${Intl.NumberFormat('es-CL').format(`${productoSeleccionado.precio}`)}</h3>
                        </div>
                        <div className="col d-flex justify-content-end btn border-0" onClick={() => handleClick(productoSeleccionado.id, productoSeleccionado.favorito)}>
                            <Heart
                                filled={productoSeleccionado.favorito}
                            />
                        </div>
                    </div>
                    <h6 className="col d-flex justify-content-end mt-2">📍 {productoSeleccionado.comuna}, {productoSeleccionado.region}</h6>
                    <div id="carouselExampleIndicators" className="carousel slide">
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        </div>

                        <div className="carousel-inner carousel-fade">
                            {renderCarrousel()}
                        </div>

                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                    <div className="card-body">
                        <p className="card-text">{productoSeleccionado.descripcion}</p>
                        <Link to="/compra" className='btn btn-danger bg-gradient d-flex justify-content-center'><strong>COMPRAR</strong></Link>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ProductDetail;
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Heart from './Heart';
import MyContext from "../my_context.js";
import axios from "axios";

const Card = ({ imagen, nombre, id, favorito, precio }) => {

    const { loginContext, setFavorite } = useContext(MyContext);

    const navigate = useNavigate();

    function aplicarMayuscula(str) {
        const palabras = str.split(" ").map(palabra => {
            return palabra[0].toUpperCase() + palabra.slice(1);
        });
        return palabras.join(" ");
    };

    const token = localStorage.getItem("token");

    const agregarFavorito = async (payload) => {
        const urlServer = "https://54.147.207.191";
        const endpoint = "/favoritos";
        try {
            /* console.log('token :>> ', token); */
            await axios.post(urlServer + endpoint, payload, {
                headers: { Authorization: "Bearer " + token }
            });
        } catch (error) {
            alert("Algo salió mal ...");
            console.log(error);
        }
    };

    const quitarFavorito = async () => {
        const urlServer = "https://54.147.207.191";
        const endpoint = "/favoritos";
        try {
            /* console.log('token :>> ', token); */
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
            /* console.log("desfavoritear"); */
        }
        else {
            localStorage.setItem("token", token);
            agregarFavorito({
                id_usuario: loginContext.id,
                id_producto: id
            });
            await setFavorite(true);
            /* console.log("favoriteado"); */
        };
    };

    return (
        <div className="card m-3" style={{ minWidth: '18rem' }}>
            <div
                className="foto"
                style={{ backgroundImage: `url(${imagen})` }}
            >
            </div>
            <div className="card-body">
                <h5 className="card-title">{aplicarMayuscula(`${nombre}`)}</h5>
                <h6 className="card-title">${Intl.NumberFormat('es-CL').format(`${precio}`)}</h6>
                <div className='row d-flex align-items-end'>
                    <div className="col d-flex align-items-end">
                        <button
                            onClick={loginContext == "" || !loginContext ?
                                () => navigate("/login") :
                                () => navigate(`/detalle_producto/${id}`)}
                            className='btn btn-danger bg-gradient'
                            style={{ textDecoration: "none" }}>
                            Detalle
                        </button>
                    </div>
                    <div className="col d-flex justify-content-end">
                        <div className="btn border-0" onClick={() => handleClick(id, favorito)}>
                            <Heart
                                filled={favorito}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card
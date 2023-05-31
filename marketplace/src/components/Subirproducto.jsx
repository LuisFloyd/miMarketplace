import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SubirFoto from "./UploadFoto";
import MyContext from "../my_context";
import Select from "react-select";

// formato contrato
//  {
//    "nombre": "thunder2",
//    "descripcion": "desde thunder" ,
//    "precio": 25000 ,
//    "stock": 25 ,
//    "id_comuna": 8,
//    "id_categoria":  2,
//    "id_usuario": 1
//    "fotos":[]
//  }

const SubirProducto = () => {
  // Estados & context a utilizar
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("none");
  const [selectedOption2, setSelectedOption2] = useState("none");
  const [dataConsultaComunas, setDataConsultaComunas] = useState([]);
  const [dataConsultaCategorias, setDataConsultaCategorias] = useState([]);
  const [payload, setPayload] = useState([]);
  const { images, setImages, loginContext } = useContext(MyContext);


  //consulta de apis al cargar componente

  function handleUser(e) {
    loginContext.id === undefined
      ? console.log("esperando")
      : setPayload(
        {
          ...payload,
          id_usuario: loginContext.id,
        },
        /* console.log(payload) */
      );
  }

  useEffect(() => {
    consultaApiComunas();
    consultaApiCategorias();
  }, []);

  useEffect(() => {
    handleUser();
  }, [loginContext.id]);

  //CONSULTAs BD

  const consultaApiComunas = async () => {
    const endpoint = "http://localhost:3001/comunas";
    const response = await fetch(endpoint);
    const data = await response.json();
    /* console.log("dataaa") */
    setDataConsultaComunas(
      data.map(valor =>
      ({
        value: valor.id,
        label: valor.nombre
      }))
    );
  };

  const consultaApiCategorias = async () => {
    const endpoint2 = "http://localhost:3001/categorias";
    const response2 = await fetch(endpoint2);
    const data2 = await response2.json();
    /* console.log("dataaa") */
    /* console.log(data2) */
    setDataConsultaCategorias(
      data2.map(valor =>
      ({
        value: valor.id,
        label: valor.nombre
      }))
    );
  };

  //funcion con POST al hacer click en "enviar"
  const registrarProducto = async (e) => {
    e.preventDefault();
    const urlServer = "http://localhost:3001";
    const endpoint = "/productos";
    const token = localStorage.getItem("token")
    try {
      await axios.post(urlServer + endpoint, payload, {
        headers: { Authorization: "Bearer " + token }
      });
      alert("Producto registrado con éxito")
      setImages([]);
      navigate("/");
    } catch (error) {
      alert("Algo salió mal ...");
      console.log(error);
    }
  };

  // funciones para  cargar data a estado de payload segun seleccion de forma
  function handleNombreProducto(e) {
    setPayload({
      ...payload,
      nombre: e.target.value,
    });
  }

  function handleDescripcion(e) {
    setPayload({
      ...payload,
      descripcion: e.target.value,
    });
  }
  function handlePrecio(e) {
    setPayload({
      ...payload,
      precio: e.target.value,
    });
  }

  function handleStock(e) {
    setPayload({
      ...payload,
      stock: e.target.value,
    });
  }

  const handleTypeSelect = e => {
    setSelectedOption(e.value);
    setPayload({
      ...payload,
      id_comuna: e.value,
    });
  };

  const handleTypeSelect2 = e => {
    setSelectedOption2(e.value);
    setPayload({
      ...payload,
      id_categoria: e.value,
    });
  };
  ;

  // agrega foTos a estado del payload al apretar boton confirmar seleccion.
  function handleFotos() {

    setPayload({
      ...payload,
      fotos: images.map((agregarFoto) => {
        return agregarFoto.data_url;
      }

      )
    })
  }


  return (
    <div className="col-10 col-sm-6 m-auto mt-3 mb-5 p-4 bg-white border border-secondary-subtle rounded" style={{overflow: "scroll"}}>
      <h2 className="col-12 m-auto mb-2">Datos de producto</h2>
      <form className="row g-3">
        <div>
          <label className="form-label">Nombre del producto</label>
          <input
            type="text"
            className="form-control"
            id="inputEmail4"
            onChange={handleNombreProducto}
          />
        </div>
        <div className="m-0">
          <label className="form-label ">Precio</label>
          <input
            type="text"
            className="form-control"
            id="inputEmail4"
            onChange={handlePrecio}
          />
        </div>
        <div className="m-0">
          <label className="form-label  ">Cantidad Disponible</label>
          <input
            type="text"
            className="form-control"
            id="inputEmail4"
            onChange={handleStock}
          />
        </div>

        {/* SELECTOR Categoria */}

        <div className="m-0">
          <label for="selector" className=" form-label">
            Categoría
          </label>

          <Select
            options={dataConsultaCategorias}
            onChange={handleTypeSelect2}
            value={dataConsultaCategorias.filter(function (option) {
              return option.value === selectedOption2;
            })}
            label="Single select"
          />
        </div>

        {/* SELECTOR COMUNA */}

        <div className="m-0">
          <label for="selector" className="form-label ">
            Comuna
          </label>

          <Select
            options={dataConsultaComunas}
            onChange={handleTypeSelect}
            value={dataConsultaComunas.filter(function (option) {
              return option.value === selectedOption;
            })}
            label="Single select"
          />
        </div>

        <div className="m-0">
          <label className="form-label ">Descripcion del Producto</label>
          <textarea
            onChange={handleDescripcion}
            className="form-control"
            aria-label="With textarea"
          ></textarea>
        </div>

        <div className="m-0">
          <h3 className="pt-3 col-12 d-flex justify-content-evenly " > Selecciona hasta 3 imágenes!</h3>
          <SubirFoto />
          <div className="form-check pt-3 col-12 d-flex justify-content-evenly">
            <input
              onClick={handleFotos}
              className="form-check-input"
              type="checkbox"

              value=""
              id="flexCheckDefault"
            />
            <label className="form-check-label  " for="flexCheckDefault">
              Estoy seguro que estas son las imágenes!
            </label>
          </div>
        </div>

        <div className="col-12 d-flex justify-content-evenly">
          <button
            type="submit"
            onClick={registrarProducto}
            className="btn btn-outline-dark container me-1"
          >
            Enviar!
          </button>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/MisDatos";
            }}
            className="btn btn-outline-dark container me-1"
          >
            Cancelar!
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubirProducto;
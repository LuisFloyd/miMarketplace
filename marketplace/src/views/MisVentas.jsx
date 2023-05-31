import React from 'react';
import PrivateNav from '../components/PrivateNav';
import GaleriaMisVentas from '../components/GaleriaMisVentas';


const MisVentas = () => {
    return (
        <div className="text-center m-5 p-2 bg-white border border-secondary-subtle rounded">
            <h1 className="mb-3">Mis Ventas</h1>
            <div className="row  ">
                <div className="col-3">
                    <PrivateNav />
                </div>
                <div className="col-9">
                    <GaleriaMisVentas />
                </div>
            </div>
        </div>
    )
}

export default MisVentas
import React from 'react';
import PrivateNav from '../components/PrivateNav';
import GaleriaMisCompras from '../components/GaleriaMisCompras';

const MisCompras = () => {
    return (
        <div className="text-center m-5 p-2 bg-white border border-secondary-subtle rounded">
            <h1 className="mb-3">Mis Compras</h1>
            <div className="row  ">
                <div className="col-3">
                    <PrivateNav />
                </div>
                <div className="col-9">
                    < GaleriaMisCompras />
                </div>

            </div>
        </div>
    );
};

export default MisCompras;
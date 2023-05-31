import React from 'react';
import PrivateNav from '../components/PrivateNav';
import GaleriaMisPub from '../components/GaleriaMisPubs';

const MisPublicaciones = () => {
    return (
        <div className="text-center m-5 p-2 bg-white border border-secondary-subtle rounded">
            <h1 className="mb-5">Mis Publicaciones</h1>
            <div className="row">
                <div className="col-3">
                    <PrivateNav />
                </div>
                <div className="col-9 ">
                    <GaleriaMisPub />
                </div>
            </div>
        </div>
    )
}

export default MisPublicaciones
import React from 'react'
import { Link } from 'react-router-dom'
import PrivateNav from '../components/PrivateNav'
import GaleriaMisFav from '../components/GaleriaMisFav'

const MisFavoritos = () => {
    return (
        <div className="text-center m-5 p-2 bg-white border border-secondary-subtle rounded">
            <h1 className="mb-3">Mis Favoritos</h1>
            <div className="row">
                <div className="col-3 ">
                    <PrivateNav />
                </div>
                <div className="col-9">
                    {<GaleriaMisFav />}
                </div>

            </div>
        </div>
    )
}

export default MisFavoritos
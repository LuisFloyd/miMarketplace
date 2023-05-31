import { useState, useContext } from "react";
import MyContext from "../my_context"
import React from "react";
import ImageUploading from "react-images-uploading";


export function SubirFoto() {
  const { images, setImages } = useContext(MyContext);



  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList)
  };

  return (
    <div className="SubirFoto">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={3}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div>
            <div className="upload__image-wrapper col-12 d-flex justify-content-evenly">
              <button

                type="button" class="btn btn-outline-dark container me-1" style={isDragging ? { color: 'red' } : undefined}
                onClick={
                  onImageUpload
                }


                {...dragProps}
              >
                Cargar Imágenes!
              </button>
              &nbsp;
              <button type="button" class="btn btn-outline-dark container me-1" onClick={onImageRemoveAll}>Remove all images</button>
            </div>
            <div className="col-12 d-flex justify-content-evenly mt-3" >
              {imageList.map((image, index) => (
                <div key={index} className="image-item ">
                  <img src={image['data_url']} alt="" width="100" />
                  <div className="image-item__btn-wrapper">
                  </div>
                </div>

              ))}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
export default SubirFoto;
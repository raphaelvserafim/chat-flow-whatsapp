import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

function SingleImageUpload(props) {
  const [image, setImage] = useState(null);
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    props.onFile(file);
    setImage({
      preview: URL.createObjectURL(file),
      file,
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  return (
    <div {...getRootProps()} style={{ border: '1px dashed #ccc', padding: 5, textAlign: 'center' }}>
      <input {...getInputProps()} accept='image/*' />
      <div>
        {(image?.preview || props?.url) && (
          <img src={image?.preview || props?.url} alt={image?.file.name} style={{ maxWidth: 250, height: 'auto' }} />
        )}
      </div>
      <p>Arraste e solte uma imagem aqui, ou clique para selecionar uma.</p>
    </div>
  );
}

export default SingleImageUpload;

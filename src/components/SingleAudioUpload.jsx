import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

function SingleAudioUpload(props) {
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (props.url) {
      setFile({
        preview: props.url,
      });
    }
  }, [props.url]);

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    props.onFile(selectedFile);
    setFile({
      preview: URL.createObjectURL(selectedFile),
      name: selectedFile.name,
      type: selectedFile.type,
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'audio/*',
  });

  return (
    <div {...getRootProps()} style={{ border: '1px dashed #ccc', padding: 10, textAlign: 'center' }}>
      <input {...getInputProps()} accept='audio/*'/>
      <div>
        {file && (
          <audio controls>
            <source src={file.preview} type={file.type || 'audio/mpeg'} />
            Seu navegador não suporta o elemento de áudio.
          </audio>
        )}
      </div>
      <p>Arraste e solte um arquivo de áudio aqui, ou clique para selecionar um.</p>
    </div>
  );
}

export default SingleAudioUpload;

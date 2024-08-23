import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

function SingleFileUpload(props) {
  const [file, setFile] = useState(null);
  useEffect(() => {
    if (props.url) {
      setFile({
        preview: props.url,
        name: props?.metaData?.metadata?.name,
        type: props?.metaData?.contentType
      });
    }
  }, [props?.metaData?.contentType, props?.metaData?.metadata?.name, props.url]);

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
    accept: ['.pdf', '.xls', '.xlsx'],
    multiple: false,
  });

  const renderFilePreview = () => {
    if (file) {
      if (file.type === 'application/pdf') {
        return <iframe src={file.preview} style={{ width: '100%', height: 200 }} title="PDF Preview" />;
      } else if (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return <p>{file.name}</p>;
      } else {
        return <p>{file.name}</p>;
      }
    }
    return null;
  };

  return (
    <div {...getRootProps()} style={{ border: '1px dashed #ccc', padding: 10, textAlign: 'center' }}>
      <input {...getInputProps()} />
      <div>
        {renderFilePreview()}
      </div>
      <p>Arraste e solte aqui, ou clique para selecionar um.</p>
    </div>
  );
}

export default SingleFileUpload;

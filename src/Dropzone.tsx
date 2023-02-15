// Import the useDropzone hooks from react-dropzone
import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop, accept }) => {
  // Initializing useDropzone hooks with options
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  /* 
    useDropzone hooks exposes two functions called getRootProps and getInputProps
    and also exposes isDragActive boolean
  */

  return (
    <div
      className={isDragActive ? "dropzone dropzone-hover" : "dropzone"}
      {...getRootProps()}
    >
      <input className="dropzone-input" {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="dropzone-content"></p>
        ) : (
          <p className="dropzone-content">
            <i className="upload icon"></i>
            Drop files here, or click to select file{" "}
          </p>
        )}
      </div>
    </div>
  );
};

export default Dropzone;

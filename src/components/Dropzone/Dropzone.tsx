import React, { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";

import "./styles.css";

type DropzoneProps = {
  image: string;
  setImage: (data: string) => void;
};

const baseStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#bdbdbd",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export const Dropzone = ({ image, setImage }: DropzoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      acceptedFiles.forEach((file: any) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          const binaryStr = reader.result;
          setImage(binaryStr as string);
        };
        reader.readAsDataURL(file);
      });
    },
    [setImage]
  );
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop, accept: { "image/*": [] } });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div>
      {!image ? (
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop your profile picture here, or click to select</p>
        </div>
      ) : null}
      {image ? (
        <div className="image-upload">
          <img className="image-preview" src={image} alt="pfp" />
          <button onClick={() => setImage("")}>Delete</button>
        </div>
      ) : null}
    </div>
  );
};

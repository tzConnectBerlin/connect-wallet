import React, { useRef, useState } from "react";
import { UploadToIPFS } from "../utils/uploadToIpfs";
import styles from "../styles/Home.module.css";

export const MintNFT = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState();

  const handleChange = (e: any) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (image) {
      UploadToIPFS(image);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" ref={inputRef} onChange={handleChange} required />
      <button className={styles.button} type="submit">
        Mint NFT
      </button>
    </form>
  );
};

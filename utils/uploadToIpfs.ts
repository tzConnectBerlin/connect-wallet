import axios from "axios";

export const UploadToIPFS = async (fileImage:any) => {
  const data = new FormData();
  data.append("file", fileImage);

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    data,
    {
      headers: {
        pinata_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
        pinata_secret_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_SECRET}`,
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
    }
  );
  console.log(res);
  const ipfsHash =  res.data.IpfsHash;
  return ipfsHash;
};


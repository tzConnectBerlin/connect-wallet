import axios from "axios";

export const UploadToIPFS = async () => {
  const data = new FormData();
  data.append("file", "/shohreh.jpg");

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    data,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
    }
  );
  console.log(res);
};

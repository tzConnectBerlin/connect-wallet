import axios from "axios";

export async function getAccount(address: string) {
  console.log(address);
  try {
    const { data } = await axios.get(
      `https://api.tzkt.io/v1/tokens/balances?account=${address}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
}

import { useEffect, useState } from "react";
import { movePublisher } from "../config";
import { AptosClient } from "aptos";

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

export default function AptosCounter() {
  const [loader, setLoader] = useState(false);
  const [count, setCount] = useState<MoveStructValue>(0);
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoader(true);
    const resources = await client.getAccountResources(movePublisher);
    const resource = resources.find(
      (el) => el.type === `${movePublisher}::counter::CountHolder`,
    );
    setCount(resource?.data?.count || 0);
    setLoader(false);
  };

  if (loader) {
    return <h2>Loading...</h2>;
  }
  return (
    <>
      <h1>APTOS COUNTER</h1>
      <h2>Your Counter: {count}</h2>
    </>
  );
}

import { useEffect, useState } from "react";
import { movePublisher } from "../config";
import { AptosClient } from "aptos";
import LoadingSpinner from "./LoadingSpinner";

const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");

export default function AptosCounter() {
  const [loader, setLoader] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [txnLink, setTxnLink] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [walletAddress]);

  const load = async () => {
    setLoader(true);
    try {
      if (walletAddress == null) {
        setLoader(false);
        return;
      }
      const resources = await client.getAccountResources(walletAddress!);
      const resource = resources.find(
        (el) => el.type === `${movePublisher}::counter::CountHolder`,
      );
      setCount((resource!.data as any).count);
    } catch (e) {
      console.log(e);
    }
    setLoader(false);
  };

  const connect = async () => {
    setLoader(true);
    if (window.martian == null) {
      alert("Please install the Martian Wallet");
      setLoader(false);
      return;
    }
    const _wallet = await window.martian.connect();
    setWalletAddress(_wallet.address);
    setLoader(false);
  };

  const bump = async () => {
    setLoader(true);
    if (window.martian == null) {
      alert("Please install the Martian Wallet");
      setLoader(false);
      return;
    }
    try {
      const payload = {
        function: `${movePublisher}::counter::bump`,
        type_arguments: [],
        arguments: [],
      };
      const transaction = await window.martian.generateTransaction(
        walletAddress,
        payload,
      );
      const txnHash =
        await window.martian.signAndSubmitTransaction(transaction);
      setTxnLink(
        `https://explorer.aptoslabs.com/txn/${txnHash}?network=devnet`,
      );
      load();
    } catch (e) {
      console.log(e);
      alert("Transaction Failed. Make sure you have enough balance.");
    }
    setLoader(false);
  };

  if (loader) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <br />
      <h1>APTOS COUNTER</h1>
      <hr />
      {walletAddress != null ? (
        <>
          {count == null ? (
            <>
              <h4>Counter not created!</h4>
              <button onClick={bump}>Create your counter</button>
            </>
          ) : (
            <>
              <h2>Your Count: {count}</h2>
              <button onClick={bump}>Bump</button>
            </>
          )}
          <hr />
          <h5>
            {txnLink == null ? null : (
              <a href={txnLink!} target="_blank">
                View Transaction
              </a>
            )}
          </h5>
        </>
      ) : (
        <button onClick={connect}>Connect</button>
      )}
    </>
  );
}

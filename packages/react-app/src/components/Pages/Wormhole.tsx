import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
  Bridge__factory,
  attestFromEth,
  ChainId,
  CHAIN_ID_BSC,
  getEmitterAddressEth,
  createWrappedOnEth,
  getSignedVAAWithRetry,
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
  createNonce,
  getBridgeFeeIx,
  getEmitterAddressSolana,
  hexToNativeString,
  ixFromRust,
  parseSequenceFromLogEth,
  parseSequenceFromLogSolana,
} from "@certusone/wormhole-sdk";

import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
const Wormhole = (props: any) => {
  const goerliTokenBridgeAddress = "0xF890982f9310df57d00f659cf4fd87e65adEd8d7";
  const goerliCoreBridgeAddress = "0x706abc4E45D419950511e474C7B9Ed348A4a716c";
  const bscTokenBridgeAddress = "0x68605AD7b15c732a30b1BbC62BE8F2A509D74b4D";

  const { signer, tokenAddress } = props;
  const [receipt, setReceipt] = useState({});
  const [signedVaa, setSignedVaa] = useState({});
  const [sequence, setSequence] = useState({});
  const [contractReceipt, setContractReceipt] = useState({});


  var receiptSaved = require('./receipt.json');
  var signedVaaSaved = require('./signedVaa.json');
  useEffect(() => {
    // const getReceipt = async () => {
    //  let r = await attestFromEth("0xF890982f9310df57d00f659cf4fd87e65adEd8d7", signer, tokenAddress);
    //  setReceipt(r);
    // }
    // getReceipt();
  }, [])

  return <div>
    GMZV3 token address: {JSON.stringify(tokenAddress)}
    <br />
    GMZ V3 exists on Goerli, we want to register and attest it on BSC testnet
    <br />
    <br />
    <button onClick={
      async () => {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        // Prompt user for account connections
        await provider.send("eth_requestAccounts", []);
        const signerMeta = provider.getSigner();
        // console.warn( tokenAddress, signerMeta, tokenAddress)
        let bridge = Bridge__factory.connect(goerliTokenBridgeAddress, signerMeta);
        // let r = await bridge.chainId();
        let receipt = await attestFromEth(goerliTokenBridgeAddress, signerMeta, tokenAddress);
        setReceipt(receipt);
        const sequence = parseSequenceFromLogEth(
          receipt,
          goerliCoreBridgeAddress
        );

        const emitterAddress = getEmitterAddressEth(goerliTokenBridgeAddress);

        const { vaaBytes } = await getSignedVAAWithRetry(
          ["https://wormhole-v2-testnet-api.certus.one"],
          2,
          emitterAddress,
          sequence,
          {
            transport: NodeHttpTransport(),
          })
        setSignedVaa(vaaBytes);

      }
    }>Register GmzV3</button>
    <br />

    <button onClick={async () => {
        const contractReceipt = await createWrappedOnEth(bscTokenBridgeAddress, signer, signedVaaSaved);
        setContractReceipt(contractReceipt);
    }}> Create Wrapped on BSC
    </button> <br />
    signer
    {JSON.stringify(signer)}
    <br />
    Receipt here:
    {JSON.stringify(receipt)}
    <br />
    VAA here
    {JSON.stringify(signedVaa)}
    <br />
    Contract Receipt BSC here:
    {JSON.stringify(contractReceipt)}
    <br /><br /><br /><br />

  </div>
}



export default Wormhole
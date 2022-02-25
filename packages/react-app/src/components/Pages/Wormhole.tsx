import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
  approveEth,
  Bridge__factory,
  attestFromEth,
  ChainId,
  CHAIN_ID_BSC,
  getEmitterAddressEth,
  createWrappedOnEth,
  getSignedVAAWithRetry,
  hexToUint8Array,
  nativeToHexString,
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
  createNonce,
  getBridgeFeeIx,
  getEmitterAddressSolana,
  hexToNativeString,
  ixFromRust,
  parseSequenceFromLogEth,
  parseSequenceFromLogSolana,
  bridge,
  transferFromEth,
  redeemOnEth,
  transferFromEthNative,
  redeemOnEthNative
} from "@certusone/wormhole-sdk";

import detectEthereumProvider from '@metamask/detect-provider';
import { parseUnits } from "@ethersproject/units";
// import { BscConnector } from '@binance-chain/bsc-connector';

import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
const Wormhole = (props: any) => {
  const goerliTokenBridgeAddress = "0xF890982f9310df57d00f659cf4fd87e65adEd8d7";
  const goerliCoreBridgeAddress = "0x706abc4E45D419950511e474C7B9Ed348A4a716c";
  const ropstenTokenBridgeAddress = "0xF174F9A837536C449321df1Ca093Bb96948D5386";
  const bscTokenBridgeAddress = "  0x9dcF9D205C9De35334D646BeE44b2D2859712A09";
  const bscCoreBridgeAddress = "0x68605AD7b15c732a30b1BbC62BE8F2A509D74b4D";
  const ropstenCoreBridgeAddress = "0x210c5F5e2AF958B4defFe715Dc621b7a3BA888c5";

  const { signer, tokenAddress, address } = props;
  const [receipt, setReceipt] = useState({});
  const [signedVaaVar, setSignedVaaVar] = useState(new Uint8Array());
  const [sequence, setSequence] = useState("");
  const [contractReceipt, setContractReceipt] = useState({});
  const [signedVaaTransfer, setSignedVaaTransfer] = useState(new Uint8Array());
  const [reedemTransaction, setReedemTransaction] = useState({});
  // const
  const [burnSequence, setBurnSequence] = useState("");
  const [receiptUnwrap, setReceiptUnwrap] = useState({});
  const [signedVaaUnwrapReturn, setSignedVaaUnwrapReturn] = useState(new Uint8Array());




  const receiptSaved = require('./receipt.json');
  const signedVaaSaved = require('./signedVaa.json');
  const signedVaaStringSaved = require('./signedVaaString.json');
  const signedVaaArray = require('./signedArray.json');


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
        // setSignedVaa(vaaBytes);

      }
    }>Register GmzV3 from Goerli</button>
    <br />

    <button onClick={async () => {
      const sequence = parseSequenceFromLogEth(
        receiptSaved,
        goerliCoreBridgeAddress
      );

      setSequence(sequence);


    }}>
      Get Sequence from GMZ registration
    </button>
    <br />

    <button onClick={async () => {

      const emitterAddress = getEmitterAddressEth(goerliTokenBridgeAddress);

      const { vaaBytes } = await getSignedVAAWithRetry(
        ["https://wormhole-v2-testnet-api.certus.one"],
        2,
        emitterAddress,
        "671",
        {
          transport: NodeHttpTransport(),
        })

      setSignedVaaVar(vaaBytes)


    }}>
      Set Vaa for registering GMZ on Ropsten
    </button>

    <br />

    <button onClick={async () => {

      const emitterAddress = getEmitterAddressEth(goerliTokenBridgeAddress);

      const { vaaBytes } = await getSignedVAAWithRetry(
        ["https://wormhole-v2-testnet-api.certus.one"],
        2,
        emitterAddress,
        "673",
        {
          transport: NodeHttpTransport(),
        })

      setSignedVaaTransfer(vaaBytes)


    }}>
      Set Vaa for transfer GMZ to Ropsten
    </button>



    <button onClick={async () => {

      let provider: any = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        const networkId = await provider.request({ method: 'net_version' })
        provider = new ethers.providers.Web3Provider(provider);
        let signer = provider.getSigner();
        console.warn(await signer.getAddress());
        // let ac = await bsc.getAccount();
        // console.warn("proveider", bsc.getProvider())
        try {
          // let bridge = Bridge__factory.connect(bscTokenBridgeAddress, signer);
          // const contractReceipt = await createWrappedOnEth(bscTokenBridgeAddress, signer, signedVaa);
          const contractReceipt = await createWrappedOnEth(ropstenTokenBridgeAddress, signer, signedVaaVar);

          console.warn(contractReceipt)
          setContractReceipt(contractReceipt);
        }
        catch (e: any) {
          console.warn("errore", e)
          return;
        }
      }
    }
    }> Create Wrapped on Ropsten

    </button>
    <br />
    <br />

    <button onClick={async () => {
      let provider: any = await detectEthereumProvider();
      await provider.request({ method: 'eth_requestAccounts' });
      provider = new ethers.providers.Web3Provider(provider);
      let signer = provider.getSigner();
      const amount = parseUnits("1", 18);
      await approveEth(goerliTokenBridgeAddress, tokenAddress, signer, amount);
      const receipt = await transferFromEth(goerliTokenBridgeAddress, signer, tokenAddress, amount, 10001, hexToUint8Array(
        nativeToHexString(address.toString(), 10001) || ""
      ));
      const sequence = parseSequenceFromLogEth(receipt, goerliCoreBridgeAddress);
      setSequence(sequence);
      console.warn("sequence transfer", sequence);
      const emitterAddress = getEmitterAddressEth(goerliTokenBridgeAddress);
      const { vaaBytes } = await getSignedVAAWithRetry(
        ["https://wormhole-v2-testnet-api.certus.one"],
        2,
        emitterAddress,
        sequence
      );
      setSignedVaaTransfer(vaaBytes)
    }}>
      transfer from Goerli (lock to token bridge)
    </button>

    <br />
    <br />
    <br />
    <button onClick={async () => {
      let provider: any = await detectEthereumProvider();
      await provider.request({ method: 'eth_requestAccounts' });
      provider = new ethers.providers.Web3Provider(provider);
      let signer = provider.getSigner();
      const reedem = await redeemOnEth(ropstenTokenBridgeAddress, signer, signedVaaTransfer);
      console.warn('reedem', reedem);
      setReedemTransaction(reedem);
    }
    }>
      Reedem wrapped tokens on Ropsten
    </button>

    <h1>UNWRAP NOW</h1>


    <button onClick={async () => {
      let provider: any = await detectEthereumProvider();
      await provider.request({ method: 'eth_requestAccounts' });
      provider = new ethers.providers.Web3Provider(provider);
      let signer = provider.getSigner();
      const amount = parseUnits("0.01", 18);
      const GMZWormholeAddress = "0x9dc9eD73F00382cdeBf784919E6883c32e535a4d";
      await approveEth(ropstenTokenBridgeAddress, GMZWormholeAddress, signer, amount);
      let addr = hexToUint8Array(
        nativeToHexString(address.toString(), 2) || ""
      )
      const receipt = await transferFromEth(ropstenTokenBridgeAddress, signer, GMZWormholeAddress, amount, 2, addr);
      console.log(receipt)
      setReceiptUnwrap(receipt)
      let sequence = parseSequenceFromLogEth(receipt, ropstenCoreBridgeAddress);
      setBurnSequence(sequence);
    }
    }>
      Return wrapped Token to Ropsten TB
    </button>

    <br />
    <br />

    <button onClick={async () => {
      const sequence = "836" //parseSequenceFromLogEth(receipt, ropstenTokenBridgeAddress);
      const emitterAddress = getEmitterAddressEth(ropstenTokenBridgeAddress);
      const { vaaBytes } = await getSignedVAAWithRetry(
        ["https://wormhole-v2-testnet-api.certus.one"],
        10001,
        emitterAddress,
        sequence
      );
      setSignedVaaUnwrapReturn(vaaBytes)
    }
    }>
      Set VAA for GMZ Tokne Return (unwrapped)
    </button>


    <button onClick={async () => {
      let provider: any = await detectEthereumProvider();
      await provider.request({ method: 'eth_requestAccounts' });
      provider = new ethers.providers.Web3Provider(provider);
      let signer = provider.getSigner();
      const amount = parseUnits("0.01", 18);
      const GMZWormholeAddress = "0x9dc9eD73F00382cdeBf784919E6883c32e535a4d";
      // execution reverted: invalid token, can only unwrap WETH when using redeemOnEthNative
      const receiptUnwrap =  redeemOnEth(goerliTokenBridgeAddress, signer, signedVaaUnwrapReturn);
      setReceiptUnwrap(receiptUnwrap);
    }}>
      Unwrap 🎉
    </button>



    <h1>RESPONSES</h1>

    <br />
    signer
    {JSON.stringify(signer)}
    <br />
    Receipt here:
    {JSON.stringify(receipt)}
    <br />
    Sequence-- 673(transfer from goerli)
    {sequence}
    <br />

    VAA here:
    {/* 1 - {JSON.stringify(signedVaa)} */}
    2 - {signedVaaVar}
    {/* 3 - {JSON.stringify(signedVaaSaved)} */}
    { }
    <br />

    <br />
    Contract Receipt BSC here:
    {JSON.stringify(contractReceipt)}
    <br /><br /><br /><br />
    Transaction on Ropsten for creating wrapped GMZ https://ropsten.etherscan.io/tx/0x79ccdf60d2e89563652ed60b66396c54b74e0949c8d096d176141df5c57e5684
    <br />
    signedVaaVar transactionHash

    {JSON.stringify(signedVaaTransfer)}

    <br />

    reedemTransaction
    {JSON.stringify(reedemTransaction)}
    <br />
    <br />

    Parse

    {JSON.stringify(parseUnits("1", 18))}

    <h1>RESPONSES for unwrapped transactions</h1>


    Receipt Unwrap Transaction
    <br />

    {JSON.stringify(receiptUnwrap)}
    <br />
    Sequence
    {burnSequence} 
    <br />
    here
    {JSON.stringify(signedVaaUnwrapReturn)}

    <br />
    <br />
    <br />

    {JSON.stringify(receiptUnwrap)}


  </div >
}



export default Wormhole
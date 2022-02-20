import React from 'react';
import {
    ChainId,
    CHAIN_ID_BSC,
    CHAIN_ID_ETH,
    CHAIN_ID_SOLANA,
    createNonce,
    getBridgeFeeIx,
    getEmitterAddressEth,
    getEmitterAddressSolana,
    hexToNativeString,
    ixFromRust,
    parseSequenceFromLogEth,
    parseSequenceFromLogSolana,
  } from "@certusone/wormhole-sdk";
  import { uint8ArrayToNative } from "@certusone/wormhole-sdk/lib/esm";

const Wormhole = (props: any) => {
    
    const {tokenBridgeAddress, signer, tokenAddress} = props;
    

    return JSON.stringify("")
}



export default Wormhole
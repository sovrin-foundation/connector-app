import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import bs58 from "bs58";

export const getKeyPairFromSeed = seed =>
  nacl.sign.keyPair.fromSeed(naclUtil.decodeUTF8(seed));

export const getBs58Signature = (secretKey, message) =>
  bs58.encode(nacl.sign.detached(naclUtil.decodeUTF8(message), secretKey));

export const verifyBs58Signature = (signature, publicKey, message) =>
  nacl.sign.detached.verify(
    naclUtil.decodeUTF8(message),
    bs58.decode(signature),
    publicKey
  );

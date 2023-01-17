import Web3 from "web3";
import { network as defaultNetwork, etheriumProvider, unknownNetwork } from "../constant/constant";
let netConnected;

if (window.ethereum && window.ethereum.networkVersion === "56") {
  netConnected = 'bscmainnet'
  localStorage.setItem('network', netConnected)
}
else if (window.ethereum && window.ethereum.networkVersion === "97") {
  netConnected = 'bsctestnet'
  localStorage.setItem('network', netConnected)
} else {
  let web3 = new Web3(etheriumProvider)
  web3.eth.net.getNetworkType()
    .then(res => {
      if (res) {
        if (res == 'private') {
          netConnected = unknownNetwork
          localStorage.setItem('network', netConnected)
        } else {
          netConnected = res
          localStorage.setItem('network', res)
        }
      } else {
        netConnected = unknownNetwork
        localStorage.setItem('network', netConnected)
      }
    });
}


export function readContractByName(name, network = netConnected, address) {
  try {
    let contractABI = [];
    let contractAddress = "";
    let decimal = 0;
    let data = getContractABIByName(name, network);
    contractABI = data.contractABI;
    if (address) {
      contractAddress = address;
    } else {
      contractAddress = data.contractAddress;
    }
    if (data.decimal) {
      decimal = data.decimal;
    }
    // Get network provider and web3 instance.
    const web3 = new Web3(etheriumProvider);
    const instance = new web3.eth.Contract(contractABI, contractAddress);
    return {
      web3,
      instance,
      contractABI,
      contractAddress,
      decimal,
    };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export function getContractABIByName(name, network) {

  let contract = require(`./../contracts/OlympusNFT.json`);
  if (contract) {
    let response = {
      contractAddress: contract[network] ? contract[network] : contract[defaultNetwork],
      contractABI: contract.abi,
    };
    if (contract.decimal) {
      response["decimal"] = contract.decimal;
    }
    return response;
  }
  return { address: "", abi: [] };
}

export function getContractAddressByName(name, network) {
  try {
    let contract = require(`./../contracts/OlympusNFT.json`);
    if (contract) {
      return contract[network];
    }
    return "";
  } catch (error) {
    return "";
  }
}

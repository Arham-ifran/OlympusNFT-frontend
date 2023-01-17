const infuraBaseUrl = {
  bscmainnet: "https://bsc-dataseed1.ninicoin.io",
  bsctestnet: "https://data-seed-prebsc-1-s1.binance.org:8545/",
};

export const supportedImgs = ['image/gif', 'image/jpeg', 'image/png', 'image/psd', 'image/bmp', 'image/tiff', 'image/jp2', 'image/iff', 'image/vnd.wap.wbmp', 'image/xbm'];
export const supportedVideos = ['video/mp4', 'video/mov', 'video/mpg', 'video/flv', 'video/ogg', 'video/webm'];

export const domain = "olympusgate.io";
export const currentPrice = "binance-usd";

export const usdSymbol = "$";
export const ethSymbol = "BUSD ";
export const bidMaxVal = 0.25;
export const unknownNetwork = 'bsctestnet';
export const network = localStorage.getItem('network') != null ? localStorage.getItem('network') : unknownNetwork;
export const infuraUrl = infuraBaseUrl[network];
export const infuraId = "55965aed0f8e4bd08a07ceb71d71e28d";//"88904a7034a74f0fa8c2de15a4928e34";
export const etheriumProvider = window.ethereum ? window.ethereum : infuraUrl;
export const ipfsUrl = "https://ipfs.io/ipfs";
export const ipfsInfuraUrl = "https://ipfs.infura.io:5001";

export const supportedNetworkVersions = ["97", "56"] //  '97', '56' => Kovan, BSC TEST, BSC Mainnet 
export const supportedNetworks = "BSC Testnet or BSC mainnet" // '97', '56' => Kovan, BSC TEST, BSC Mainnet 
export const networkName = network;

const networkUrls = {
  bscmainnet: "https://bscscan.com/",
  bsctestnet: "https://testnet.bscscan.com"
};
/**EXPLORERS END POINTS */
export const explorerNetworkURL = networkUrls[network];

const contractAdd = {
  bscmainnet: "",
  bsctestnet: "0xBB8E0C6F5C6e96F63819fd9a32987fe4dF740b68"
};

export const contractAddress = contractAdd[network]
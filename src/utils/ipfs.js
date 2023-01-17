import { ipfsInfuraUrl } from "../constant/constant";
const { create } = require("ipfs-http-client");

const ipfs = create(ipfsInfuraUrl);

export async function UploadMediaOnIpfs(buffer) {
  return new Promise((resolve, reject) => {
    ipfs.add(buffer).then((result, error) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}

export async function UploadMediaArrayOnIpfs(arr) {
  try {
    let promises = [];
    for (let index = 0; index < arr.length; index++) {
      promises.push(UploadMediaOnIpfs(arr[index]["buffer"]));
    }
    let data = await Promise.all(promises);
    for (let index = 0; index < arr.length; index++) {
      delete arr[index]["buffer"];
      arr[index]["hash"] = data[index]["path"];
    }
    return arr;
  } catch (error) {
    console.log(error);
  }
}
export default ipfs;

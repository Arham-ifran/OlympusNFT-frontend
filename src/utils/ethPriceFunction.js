import { EthereumPriceApi } from './../container/Api/api'
import { currentPrice } from "./../constant/constant";

export const EthPriceCalculation = async () => {
  let res = await EthereumPriceApi()
  let ethereumPrice = '';
  let result = 0
  try {
    if (res.status === 200) {
      ethereumPrice = res.data[currentPrice].usd
    }
  } catch (err) {
    console.error(err, "error")
  }
  if (ethereumPrice) {
    result = ethereumPrice
    return result
  } else {
    return ''
  }
}

const EthPriceByValueCalculation = async (price) => {
  let res = await EthereumPriceApi(price)
  let ethereumPrice = '';
  let result = 0
  try {
    if (res.status === 200) {
      ethereumPrice = res.data[currentPrice].usd
    }
  } catch (err) {
    console.error(err, "error")
  }
  if (ethereumPrice) {
    result = price / ethereumPrice
    return result
  } else {
    return ''
  }
}

export const UsdToEthPriceCalculation = (price) => {
  return async function () {
    await EthPriceByValueCalculation(price)
  }
}
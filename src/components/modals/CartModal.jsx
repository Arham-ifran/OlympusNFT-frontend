import { etheriumProvider, supportedNetworkVersions, supportedNetworks, networkName } from "../../constant/constant";
import Web3 from 'web3';
import { readContractByName } from "../../utils/contracts";
import React, { useEffect, useState } from 'react';
import { createOrder } from "./../../container/Api/api"
import SmallLoader from '../loader/SmallLoader'
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import { Message } from '../../utils/message';
import { notification } from 'antd';
import {ethSymbol, ipfsUrl} from './../../constant/constant';


let $ = window.jQuery;

let transactionFee;

function CartModal({ Data, ethereum, Logo, productId, ethPriceState, wonBidUserId, bidId, ethPrice, itemCheck }) {

  const [accountId, setAccountId] = useState('')
  const [smallLoader, setSmallLoader] = useState(false)
  const [order, setOrder] = useState(false)
  let user_id = localStorage.getItem('id')
  let prodData = Data;
  let price_usd = Data.priceUsd;
  if ((Data.priceType == "1" || Data.priceType == "2") && Data.wonBidPrice !== "") {
    price_usd = Data.wonBidPrice;
  }

  let tokenId = Data.tokenId
  const ethereumPrice = price_usd ? price_usd / ethereum : '';
  const history = useHistory();
  let connected = localStorage.getItem('walletConn')


  useEffect(async () => {
    const web3 = new Web3(etheriumProvider)
    if (window.ethereum && window.ethereum !== 'undefined') {
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      setAccountId(accounts[0])
    }
  }, [])


  const pay = async () => {
    setSmallLoader(true)
    if (!connected || supportedNetworkVersions.indexOf(window.ethereum.networkVersion) === -1) {
      Message('error', 'Sorry', "Connect to supported network (" + supportedNetworks + ") first or connect wallet.")
      return;
    }

    let data = await readContract();
    let transactionDetail = data.transaction;
    if (transactionDetail.status) {
      notification['success']({
        message: 'Transaction',
        description:
          `Transaction Completed 
          from:${transactionDetail.from}
          to:${transactionDetail.to}
          transaction:${transactionDetail.transactionHash}`,
      });
      __close();
    }

    if (transactionDetail) {
      let payload = { user_id, price_usd, total: price_usd, transaction_hash: transactionDetail.transactionHash, to_address: accountId, order_status: 3, product_id: productId, from_address: transactionDetail.from, earned_price: transactionFee, wonBidUserId: wonBidUserId ? wonBidUserId : '', bid_id: bidId, order_id: Data.OrderId }
      const res = await createOrder(payload)
      try {
        if (res) {
          if (res.data.status === 1) {
            Message('success', 'Order Successful', 'You have successfully purchased an NFT')
            __close()
            history.push("/my-orders");
          }
          setOrder(true)
          setSmallLoader(false)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }


  const readContract = async () => {
    const web3 = new Web3(etheriumProvider)
    let transaction;
    try {
      let { instance } = readContractByName("OlympusNFTMintableToken", networkName);
      let price = ethereumPrice.toFixed(6)
      let weiValue = web3.utils.toWei(price.toString(), "ether")
      let royaltyAddress = '0x0000000000000000000000000000000000000000', royaltyPercentage = 0;
      if (prodData.isRelistedProduct == 1) {
        royaltyAddress = prodData.royaltyAddress;
        royaltyPercentage = prodData.royaltyPercentage
      }
      // completePurchase(buyersAddress, sellerAddress, _tokenId, tokenUri, royalityAddress, royalityPercentage)
      transaction = await instance.methods.completePurchase(accountId, prodData.currentOwner, prodData.tokenId, ipfsUrl, royaltyAddress, royaltyPercentage).send({
        from: accountId,
        value: weiValue
      });

      const { gasPrice } = await web3.eth.getTransaction(transaction.transactionHash)
      const { gasUsed } = await web3.eth.getTransactionReceipt(transaction.transactionHash)

      transactionFee = (gasPrice * gasUsed) / 10E18

      return { transaction }
    } catch (error) {
      Message('error', 'Error', "Transaction Denied")
      setSmallLoader(false)
      return error
    }
  }

  const redirectToMyOrders = () => {
    __close()
    history.push("/my-orders");
  }

  function __close() {
    $('.cart').hide();
    $('body').removeClass('modal-open');
    $('body').css('padding-right', '0px');
    $('.modal-backdrop').remove();
  }

  return (
    <div className='modal fade cart' tabIndex={-1} role='dialog' aria-labelledby='myLargeModalLabel' aria-hidden='true'>
      <div className='modal-dialog modal-xl modal-dialog-centered'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='exampleModalLabel'>Item Checkout</h5>
            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>×</span>
            </button>
          </div>
          <div className='modal-body'>
            <div className='cart'>
              <div className='items-detail'>
                <div className='table-responsive'>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th colSpan={2}>Item Image</th>
                        <th>Item name</th>
                        <th>Token ID</th>
                        <th>Seller</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={2}>
                          {Object.keys(Data).length !== 0 ? <div className='image'>
                            <img src={Object.keys(Data.mediaFiles).length > 0 ? Data.mediaFiles[0].ipfsImageHash : ''} alt='' className='img-fluid' />
                          </div> : ''}
                        </td>
                        <td>{Data.title ? Data.title : ''}</td>
                        <td title={Data.tokenId ? Data.tokenId : ''}>{Data.tokenId ? (Data.tokenId).substring(0, 15) + '...' : ''}</td>
                        <td>{Data.seller ? Data.seller : ''}</td>
                        {!ethPriceState ? <td>${price_usd}</td> : <td>{ethSymbol}: {(price_usd / ethereum).toFixed(4)}</td>}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className='order-summary'>
                <h5>Order Summary</h5>
                <div className='detail'>
                  <label>Current {ethSymbol} price</label>
                  <span className='value'><b>1 {ethSymbol} = ${ethereum}</b></span>
                </div>
                <div className='detail'>
                  <label>Total</label>
                  <span className='value'><b> ${price_usd}<br /><small>{ethereumPrice ? ethereumPrice.toFixed(6) : ''} {ethSymbol}</small></b></span>
                </div>

                {order ?
                  <button
                    className='btn-default hvr-bounce-in'
                    onClick={() => redirectToMyOrders()}>
                    <span className='icon'>
                      <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                    </span>View My Orders
                  </button> :

                  <button
                    className='btn-default hvr-bounce-in'
                    disabled={itemCheck}
                    onClick={() => pay()}>
                    <span className='icon'>
                      <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                    </span>{itemCheck ? 'SOLD' : 'PROCEED TO PAY'}   {smallLoader ? <SmallLoader /> : ''}</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    ethPriceState: state.userReducer.ethPriceState,
  }
}

export default connect(mapStateToProps)(CartModal)
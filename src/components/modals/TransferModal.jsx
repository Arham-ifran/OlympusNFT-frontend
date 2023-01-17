import { getContractAddressByName } from "../../utils/contracts";
import { etheriumProvider, explorerNetworkURL, supportedNetworkVersions, supportedNetworks, networkName } from '../../constant/constant'
import React, { useEffect, useState } from 'react';
import SmallLoader from '../loader/SmallLoader'
import Web3 from 'web3';
import { readContractByName } from "../../utils/contracts";
import { Message } from './../../utils/message';
import { useHistory } from "react-router-dom";
import { createOrder } from "./../../container/Api/api"


let transactionFee;

export default function TransferModal(props) {
  let connected = localStorage.getItem('walletConn')

  const tokenId = props.tokenId;
  const originalCreator = props.originalCreator;
  const user_id = localStorage.getItem('id')
  const price_usd = props.priceUsd
  const productId = props.id
  const contractAddr = getContractAddressByName("OlympusNFTMintableToken", networkName);
  const [receivingAddress, setReceivingAddress] = useState('')
  const [errors, setErrors] = useState('')
  const [accountId, setAccountId] = useState('')
  const [smallLoader, setSmallLoader] = useState(false)
  const history = useHistory();

  useEffect(() => {
    _fetchAccount()
  }, [])

  async function _fetchAccount() {
    const web3 = new Web3(etheriumProvider)
    if (window.ethereum && window.ethereum !== 'undefined') {
      await window.ethereum.enable();
    }
    const accounts = await web3.eth.getAccounts();
    setAccountId(accounts[0] ? accounts[0] : '')
  }

  const handleChange = (e) => {
    setReceivingAddress(e.target.value)
  }

  const transferNFT = async () => {

    let validAddress = Web3.utils.isAddress(receivingAddress)
    if (!receivingAddress || !validAddress) {
      setErrors("Please Enter Valid Receiving Address")
      return;
    }
    if (!connected || supportedNetworkVersions.indexOf(window.ethereum.networkVersion) === -1) {
      Message('error', 'Sorry', "Connect to supported network (" + supportedNetworks + ") first or connect wallet.")
      return;
    }
    setSmallLoader(true)
    let data = await readContract();
    setErrors("")
    if (data) {
      let transactionDetail = data.transaction
      let payload = { user_id, price_usd, total: price_usd, transaction_hash: transactionDetail.transactionHash, to_address: receivingAddress, order_status: 3, product_id: productId, from_address: transactionDetail.from, earned_price: transactionFee }
      const res = await createOrder(payload)
      setSmallLoader(false)
      Message('success', 'Success', 'Nft transferred successfully.');
      window.location();
      return
    }

  }

  const readContract = async () => {
    const web3 = new Web3(etheriumProvider)
    try {
      let { instance } = readContractByName("OlympusNFTMintableToken", networkName);

      if (accountId && originalCreator === accountId) {

        let transaction = await instance.methods.completeTransfer(originalCreator, receivingAddress, tokenId).send({
          from: accountId
        });


        const { gasPrice } = await web3.eth.getTransaction(transaction.transactionHash)
        const { gasUsed } = await web3.eth.getTransactionReceipt(transaction.transactionHash)

        transactionFee = (gasPrice * gasUsed) / 10E18
        return { transaction }
      }
      else {
        Message('error', 'Error', 'You are not the owner of this NFT')
      }
    } catch (error) {
      console.log(error);
      setSmallLoader(false)
      Message('error', 'Sorry', "Transaction Denied")
    }
  }

  return (
    <React.Fragment>
      <div className={`modal fade transfer transferModel-${props.id}`} tabIndex={-1} role='dialog' aria-labelledby='myLargeModalLabel' aria-hidden='true'>
      <div className='modal-dialog  modal-dialog-centered'>
        <div className='modal-content'>
          <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
            <span aria-hidden='true'>×</span>
          </button>
          <div className='modal-title'>
            <h4>Enter Receiving Address</h4>
          </div>
          <div className='seller-info'>
            <div className='item'>
              <span className='title'>Token ID:</span>
              <span className='value'>{tokenId}</span>
            </div>
            <div className='item'>
              <span className='title'>Your smart contract's address:</span>
              <span className='value'><a target="_blank" href={`${explorerNetworkURL}address/${contractAddr}`}>{contractAddr}</a></span>
            </div>
          </div>
          <div className='form-group'>
            <label className='control-label'>Enter receiving address</label>
            <input maxLength={100} type='text' required='required' className='form-control' name="receivingAddress" onChange={(e) => handleChange(e)} />
          </div>
          {<div className={errors ? 'alert alert-danger ' : ''} role='alert' style={{ color: 'red', fontWeight: 'bold' }}>{errors}</div>}
          <button type='submit' className='btn-default hvr-bounce-in' onClick={() => transferNFT()}>Transfer {smallLoader ? <SmallLoader /> : ''}</button>
        </div>
      </div>
    </div>
    </React.Fragment>
  )
}

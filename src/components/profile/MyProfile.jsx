// import Logo from './../../assets/img/olympusnft-logo.gif'
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { etheriumProvider } from '../../constant/constant'
import Web3 from 'web3'
const $ = window.jQuery;

function MyProfile(props) {
  $(window).scrollTop('0');
  const [username, setUsername] = useState('');
  const [wallet_address, setWallet_address] = useState('');
  let connected = Boolean(localStorage.getItem('walletConn'))

  useEffect(() => {
    _fetchAcc()
    if (!connected) {
      setWallet_address('')
    }
  }, [connected, props.walletConnection])

  async function _fetchAcc() {
    const web3 = new Web3(etheriumProvider)
    if (window.ethereum && window.ethereum !== 'undefined') {
      await window.ethereum.enable();
    }
    const accounts = await web3.eth.getAccounts();
    setWallet_address(accounts[0] ? accounts[0] : '');
  }

  useEffect(() => {
    if (!props.loading) {
      setUsername(props.data.username);
    }
  }, [props.data]);

  return (
    <>
      <div className="content-box">
        <h3>My Profile
        </h3>
        <div className="profile-info">
          <p> <Link to={`user/${username}`}>{username}</Link> </p>
          <p>{connected ? wallet_address : 'No wallet connected'}</p>
        </div>
      </div>
    </>
  )
}
const mapStateToProps = state => {
  return {
    data: state.userReducer.userData,
    loading: state.userReducer.loading,
    walletConnection: state.userReducer.walletConnection
  }
}

export default connect(mapStateToProps)(withRouter(MyProfile));
import React, { useEffect, useState } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';
import CreateItemModal from '../modals/CreateItemModal';
import Photo from './../../assets/img/profile.jpeg';
import { LogoutApi } from './../../container/Api/api';
import { connect } from 'react-redux';
import { userLogoutAction } from './../../store/actions/userAction'
import { ErrorHandler, Message } from '../../utils/message';
import { supportedNetworkVersions, etheriumProvider, supportedNetworks } from '../../constant/constant'
import { useHistory } from "react-router-dom";
import Web3 from 'web3'
import Loader from './../loader/Loader'
const $ = window.jQuery;
function ProfileSideBar(props) {
  $(window).scrollTop('0');
  const [username, setUsername] = useState('');
  const [wallet_address, setWallet_address] = useState('');
  const [ProfileImage, setProfileImage] = useState('');
  const [redirect, setRedirect] = useState(false);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [kill, setKill] = useState(false);

  let connected = Boolean(localStorage.getItem('walletConn'))

  useEffect(() => {
    if (!props.loading) {
      setUsername(props.data.username);
      setProfileImage(props.data.profile_image);
    }
  }, [props.data]);

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

  const handleCreateItemModal = () => {
    if (!connected || supportedNetworkVersions.indexOf(window.ethereum.networkVersion) === -1) {
      Message('error', 'Sorry', "Please Connect to supported network (" + supportedNetworks + ") first or connect wallet.")
      return;
    }
    history.push("/create-item");
    // setOpen(x => !x);
    // setShow(false);
  };

  const handleDisplayPortion = () => {
    setShow(true);
  };

  const handleLogout = async () => {
    setKill(true)
    let res = await LogoutApi();
    try {
      if (res.data.status === 1) {
        let web3 = new Web3(window.ethereum)
        web3.eth.accounts.wallet.clear()
        props.dispatch(userLogoutAction())
        setRedirect(true)
        setKill(false)
        Message('success', 'Success', 'Logout Successfully')
      }
    } catch (err) {
      ErrorHandler(err)
    }
  };


  if (redirect) {
    return <Redirect to='/' />
  } else if (kill) {
    return <Loader />
  } return (
    <>
      <div className='col-lg-3 col-md-4'>
        <div className='sidebar'>
          <div className='profile'>
            <div className='profile-img'>
              <img src={ProfileImage ? ProfileImage : Photo} alt={username} className='img-fluid' />
            </div>
            <div className='profile-info'>
              <h5>{username}</h5>
              <p title={connected ? wallet_address : ''}>{connected ? wallet_address.substring(0, 15) : 'No wallet connected'}</p>
            </div>
          </div>
          <hr />
          <div className='other-info'>
            <button className='address btn-default hvr-bounce-in'>{connected ? wallet_address : 'No wallet connected'}</button>
            <button className='btn-default hvr-bounce-in' onClick={handleCreateItemModal}>
              <span className='icon fas fa-plus' />{!open ? 'Create an item' : 'Done'}</button>
          </div>
          <hr />
          <div className='links-list'>
            <ul>
              <li><Link className={props.location.pathname === '/profile' ? 'active' : ''} to='/profile'><span className='icon fas fa-home' />Stores</Link></li>

              <li><Link className={props.location.pathname === '/my-nft' ? 'active' : ''} to='/my-nft'><span className='icon fas fa-wallet' />My NFTs</Link></li>

              <li><Link className={props.location.pathname === '/my-earnings' ? 'active' : ''} to='/my-earnings'><span className='icon fas fa-money-bill' />My Earnings</Link></li>
              <li>
                <div className='dropdown'>
                  <a className={props.location.pathname === '/my-orders' ? 'dropdown-toggle active' : 'dropdown-toggle'} data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                    <span className='icon fas fa-bars' />Orders
                  </a>
                  <div className='dropdown-menu'>
                    <ul>
                      <li> <Link className={props.location.pathname === '/my-orders' ? 'active' : ''} to='/my-orders'><span className='icon fas fa-shopping-bag' />My Orders</Link></li>
                      <li> <Link className={props.location.pathname === '/won-auctions' ? 'active' : ''} to='/won-auctions'>Won Auctions</Link></li>
                      <li> <Link className={props.location.pathname === '/biding-history' ? 'active' : ''} to='/biding-history'>Biding History</Link></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li><Link className={props.location.pathname === '/products-reviews' ? 'active' : ''} to='/products-reviews'><span className='icon fas fa-thumbs-up' />Reviews</Link></li>
              <li>
                <div className='dropdown'>
                  <a className={props.location.pathname === '/current-item-list' ? 'dropdown-toggle active' : 'dropdown-toggle'} data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                    <span className='icon fas fa-bars' />Listing
                  </a>
                  <div className='dropdown-menu'>
                    <ul>
                      <li> <Link className={props.location.pathname === '/current-item-list' ? 'active' : ''} to='/current-item-list'>Current Item List</Link></li>
                      <li> <Link className={props.location.pathname === '/sold-item-list' ? 'active' : ''} to='/sold-item-list'>Sold Item List</Link></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li><Link className={props.location.pathname === '/products-history' ? 'active' : ''} to='/products-history'><span className='icon fas fa-history' />History</Link></li>
              <li><Link className={props.location.pathname === '/ad-manager' ? 'active' : ''} to='/ad-manager'><span className='icon fas fa-bullhorn' />Ad Manager</Link></li>
            </ul>
          </div>
          <hr />
          <div className='other-info'>
            <Link to='/edit-profile' className='btn-default hvr-bounce-in' ><span className='icon fas fa-cog' />Settings</Link>
            <button className='btn-default hvr-bounce-in' onClick={handleLogout} >
              <span className='icon fas fa-sign-out-alt' />Log out</button>
          </div>
        </div>
      </div>
      <CreateItemModal Open={open} Display={show} handleModal={handleCreateItemModal} handleDisplay={handleDisplayPortion} />
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

export default connect(mapStateToProps)(withRouter(ProfileSideBar));

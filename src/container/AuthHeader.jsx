import Logo from "./../assets/img/olympusnft-logo.gif";
import Flag from "./../assets/img/flag.png";
import englishFlag from "./../assets/img/english.png";
import { useEffect, useState } from "react";
import { Link, withRouter, useHistory } from "react-router-dom";
import { API, Config } from "./../utils";
import Web3 from "web3";
import { LogoutApi } from "./Api/api";
import { connect } from "react-redux";
import {
  fetchUserProfileData,
  userLogoutAction,
  disconnectWalletFromHeader,
  connectWalletFromHeader,
} from "./../store/actions/userAction";
import { fetchCategoryAndMessageData } from "./../store/actions/siteAction";
import { ErrorHandler, Message, HotMessage } from "../utils/message";
import { supportedNetworkVersions, supportedNetworks, etheriumProvider, domain } from "../constant/constant";
import LogModals from "./../components/logmodals/LogModals";
import Cookies from "universal-cookie";
import Loader from "../components/loader/Loader";
import ResetPasswordModal from "../components/logmodals/ResetPasswordModal";

const $ = window.jQuery;

function AuthHeader(props) {
  let walletConn = Boolean(localStorage.getItem("walletConn"));
  let id = localStorage.getItem("id");
  const [username, setUsername] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [kill, setKill] = useState(false);
  const [networkVersion, __setNetworkVersion] = useState(
    window.ethereum && window.ethereum.networkVersion
  );
  const [resetToken, setResetToken] = useState("");
  const [connetedWallet, setConnectedWallet] = useState(walletConn);
  const history = useHistory();

  useEffect(() => {
    fetchCategoryAsyncCall();
    // asyncCallForWeb3();
    if (props.location.pathname.includes("/resetPassword")) {
      let path = props.location.pathname.split("/").pop();
      setResetToken(path);
      $(".resetpassword-modal-lg").modal("show");
    }

    $(document).click(function (event) {
      var clickover = $("html");
      var _opened = $(".navbar-collapse").hasClass(
        "navbar-collapse collapse show"
      );

      if (_opened === true && !clickover.hasClass("navbar-toggler")) {
        $("button.navbar-toggler").click();
      }
    });
  }, []);

  useEffect(() => {
    if (props.token || localStorage.getItem("token")) {
      fetchUserAsyncCall();
    }
  }, [props.token, localStorage.getItem("token")]);

  useEffect(() => {
    if (!props.loading) {
      setUsername(props.data.username);
    }
  }, [props]);

  useEffect(() => {
    let __versionCheck =
      networkVersion === "97" || networkVersion === "56" ? true : false;
    if (connetedWallet && walletConn && !__versionCheck) {
      HotMessage(
        "warning",
        "Sorry",
        "Please connect to supported network (" +
        supportedNetworks +
        ") first or connect wallet."
      );
    }
    window.ethereum?.on("chainChanged", (_chainId) => window.location.reload());
    window.ethereum?.on("accountsChanged", () => window.location.reload());
    // window.ethereum?.request({ method: 'eth_requestAccounts' })
    //   .then(res => console.log(res, "response is here"))
    //   .catch(err => Message('error', 'Rejected', err.message))
  }, [networkVersion, props.walletConnection, window]);

  useEffect(() => {
    setConnectedWallet(walletConn);
    __setNetworkVersion(window.ethereum?.networkVersion);
  }, [props.walletConnection, walletConn]);

  async function fetchCategoryAsyncCall() {
    await props.dispatch(fetchCategoryAndMessageData());
  }

  const asyncCallForWeb3 = async () => {
    if (window.ethereum) {
      __setNetworkVersion(window.ethereum?.networkVersion);
    }
    let web3 = new Web3(etheriumProvider);
    let accounts = await web3.eth.getAccounts();
    if (accounts[0] === undefined) {
      localStorage.removeItem("walletConn");
      setConnectedWallet(false);
    }
  };

  async function fetchUserAsyncCall() {
    await props.dispatch(fetchUserProfileData());
  }

  const openSignUpTab = (param) => {
    $(`#${param}`).tab("show");
  };

  async function loadWeb3() {
    let isValid = false;
    if (window.ethereum) {
      let __versionCheck =
        networkVersion === "97" || networkVersion === "56" ? true : false;
      if (!__versionCheck) {
        Message(
          "error",
          "Sorry",
          "Unsupported Network , please switch to supported networks (" +
          supportedNetworks +
          ")."
        );
        return isValid;
      }
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      isValid = true;
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      isValid = true;
    } else {
      Message(
        "error",
        "Sorry",
        "Non-Ethereum browser detected. You should consider trying MetaMask or any other Wallet!"
      );
    }
    return isValid;
  }

  async function loadBlockChain() {
    let isValid = await loadWeb3();
    if (isValid) {
      const web3 = new Web3(etheriumProvider);
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setConnecting(false);
        props.dispatch(connectWalletFromHeader(true));
      }
      await updateWalletAddressToDb(accounts[0]);
      await props.dispatch(fetchUserProfileData());
    }
  }

  const handleWalletConnect = async () => {
    if (props.token || localStorage.getItem("token")) {
      setConnecting(true);
      await loadBlockChain();
    } else {
      openSignUpTab("v-pills-login-tab");
    }
  };

  const updateWalletAddressToDb = async (address) => {
    let body = {
      user_id: id,
      wallet_address: address,
    };
    await API.post("api/update-wallet-address", body, Config()).then((res) => {
      if (res.data.status === 1) {
        props.dispatch(connectWalletFromHeader(true));
      } else {
        localStorage.setItem("walletConn", false);
      }
    });
  };

  async function handleLogout() {
    setKill(true);
    props.dispatch(userLogoutAction());
    let res = await LogoutApi();
    try {
      if (res.data.status === 1) {
        onDisconnect();
        Message("success", "Success", "Logout Successfully");
        setKill(false);
      }
    } catch (err) {
      onDisconnect();
      ErrorHandler(err);
      setKill(false);
    }
  }

  function onDisconnect() {
    let web3 = new Web3(etheriumProvider);
    web3.eth.accounts.wallet.clear();
    props.dispatch(disconnectWalletFromHeader(false));
  }

  function translateLanguage(value, flag = Flag) {
    if (flag !== Flag) {
      localStorage.setItem("flag", flag);
    } else {
      localStorage.removeItem("flag");
    }
    const cookies = new Cookies();

    if (value !== "en") {
      cookies.set("googtrans", `/${value}`, { path: "/", domain: "" });
      cookies.set("googtrans", `/${value}`, {
        path: "/",
        domain: "." + domain,
      });
    } else {
      cookies.set("googtrans", `/en`, { path: "/", domain: "" });
      cookies.set("googtrans", `/en`, { path: "/", domain: "." + domain });
    }
    window.location.reload(true);
  }

  const handleCreateItemModal = () => {
    if (
      !walletConn ||
      supportedNetworkVersions.indexOf(
        window.ethereum && window.ethereum.networkVersion
      ) === -1
    ) {
      Message(
        "error",
        "Sorry",
        "Please Connect to supported network (" +
        supportedNetworks +
        ") first or connect wallet."
      );
      return;
    }
    history.push("/create-item");
  };
  const LocalFlag = localStorage.getItem("flag");
  let slug = "news";

  if (kill) {
    return <Loader />;
  }
  return (
    <>
      <header id="header">
        <div className="container-fluid main-menu">
          <div className="row">
            <nav className="navbar navbar-expand-lg w-100 fixed-top main-padding">
              <Link to="/" className="navbar-brand">
                <img src={Logo} className="logo img-fluid" alt="OlympusNFT logo" />
              </Link>

              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon fa fa-bars" />
              </button>
              <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item active">
                    <Link
                      to="/category/music"
                      className="nav-link hvr-float-shadow "
                    >
                      Music{" "}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/category/art"
                      className="nav-link hvr-float-shadow"
                    >
                      Art
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/category/film"
                      className="nav-link hvr-float-shadow"
                    >
                      Film
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/page/marketing"
                      className="nav-link hvr-float-shadow"
                    >
                      Marketing
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to={{ pathname: `/blogs/${slug}` }}
                      className="nav-link hvr-float-shadow"
                    >
                      Blog
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a href="#community" className="nav-link hvr-float-shadow">
                      Community
                    </a>
                  </li>
                </ul>
              </div>
              <div className="custom-items ">
                {!connetedWallet ? (
                  <button
                    className="btn-default"
                    data-toggle={
                      props.token || localStorage.getItem("token")
                        ? ""
                        : "modal"
                    }
                    data-target={
                      props.token || localStorage.getItem("token")
                        ? ""
                        : ".bd-example-modal-lg"
                    }
                    onClick={handleWalletConnect}
                  >
                    Connect Wallet
                  </button>
                ) : (
                  <button className="btn-default" disabled>
                    {connecting ? "Connecting..." : "Connected"}
                  </button>
                )}
                <div className="flags-dropdown btn-group">
                  <button
                    type="button"
                    className="btn"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <img
                      className="img-fluid"
                      src={!LocalFlag ? Flag : LocalFlag}
                      alt="Flag"
                    />
                  </button>
                  {props.languageData &&
                    Object.keys(props.languageData).length > 0 ? (
                    <div className="dropdown-menu">
                      <a
                        className="dropdown-item english"
                        onClick={(e) => translateLanguage("en")}
                      >
                        <img
                          className="img-fluid"
                          src={englishFlag}
                          alt="Flag"
                        />
                      </a>

                      {props.languageData.map((item, i) => {
                        return (
                          <a
                            className="dropdown-item"
                            key={i}
                            onClick={() =>
                              translateLanguage(item.code, item.lang_flag)
                            }
                          >
                            {item.name}
                            <img
                              className="flag img-fluid"
                              src={item.lang_flag}
                              alt={item.name}
                            />
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="login-signup">
                  {props.token || localStorage.getItem("token") ? (
                    <div className="account-dropdown btn-group">
                      <button
                        type="button"
                        className="btn dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <span className="img fa fa-user" />
                        {username}
                      </button>
                      <div className="dropdown-menu">
                        <Link
                          to="/profile"
                          className="dropdown-item"
                          role="button"
                        >
                          Profile
                        </Link>
                        <Link
                          to="/messages"
                          className="dropdown-item"
                          role="button"
                        >
                          Messages
                        </Link>
                        <Link
                          to="/create-store"
                          className="dropdown-item"
                          role="button"
                        >
                          Create a Store
                        </Link>
                        <a
                          className="dropdown-item"
                          onClick={handleCreateItemModal}
                          role="button"
                        >
                          Create an Item
                        </a>
                        {walletConn ? (
                          <a
                            className="dropdown-item"
                            role="button"
                            onClick={onDisconnect}
                          >
                            Disconnect my wallet
                          </a>
                        ) : (
                          <a
                            className="dropdown-item"
                            role="button"
                            onClick={handleWalletConnect}
                          >
                            Connect my wallet
                          </a>
                        )}

                        <a
                          className="dropdown-item"
                          role="button"
                          data-toggle="modal"
                          data-target=".buy-busd"
                        >
                          Add Funds
                        </a>

                        <Link
                          to="/help"
                          className="dropdown-item"
                          role="button"
                        >
                          Help
                        </Link>
                        <Link
                          to="/"
                          className="dropdown-item"
                          role="button"
                          onClick={handleLogout}
                        >
                          Log out
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="login-signup">
                      <a
                        data-toggle="modal"
                        data-target=".bd-example-modal-lg"
                        onClick={() => openSignUpTab("v-pills-login-tab")}
                      >
                        Sign in
                      </a>{" "}
                      |{" "}
                      <a
                        data-toggle="modal"
                        data-target=".bd-example-modal-lg"
                        onClick={() => openSignUpTab("v-pills-signup-tab")}
                      >
                        Sign up
                      </a>
                    </div>
                  )}
                </div>
                <div className="mobile login-signup">
                  {props.token || localStorage.getItem("token") ? (
                    <div className="account-dropdown btn-group">
                      <button
                        type="button"
                        className="btn dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <span className="img fa fa-user" />
                        {username}
                      </button>
                      <div className="dropdown-menu">
                        <Link
                          to="/profile"
                          className="dropdown-item"
                          role="button"
                        >
                          Profile
                        </Link>
                        <Link
                          to="/messages"
                          className="dropdown-item"
                          role="button"
                        >
                          Messages
                        </Link>
                        <Link
                          to="/create-store"
                          className="dropdown-item"
                          role="button"
                        >
                          Create a Store
                        </Link>
                        <a
                          className="dropdown-item"
                          onClick={handleCreateItemModal}
                          role="button"
                        >
                          Create an Item
                        </a>
                        {walletConn ? (
                          <a
                            className="dropdown-item"
                            role="button"
                            onClick={onDisconnect}
                          >
                            Disconnect my wallet
                          </a>
                        ) : (
                          <a
                            className="dropdown-item"
                            role="button"
                            onClick={handleWalletConnect}
                          >
                            Connect my wallet
                          </a>
                        )}
                        <Link
                          to="/help"
                          className="dropdown-item"
                          role="button"
                        >
                          Help
                        </Link>
                        <Link
                          to="/"
                          className="dropdown-item"
                          role="button"
                          onClick={handleLogout}
                        >
                          Log out
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="">
                      <a
                        data-toggle="modal"
                        data-target=".bd-example-modal-lg"
                        onClick={() => openSignUpTab("v-pills-login-tab")}
                      >
                        Sign in
                      </a>{" "}
                      |{" "}
                      <a
                        data-toggle="modal"
                        data-target=".bd-example-modal-lg"
                        onClick={() => openSignUpTab("v-pills-signup-tab")}
                      >
                        Sign up
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>
        <LogModals />
        {!localStorage.getItem("token") ? (
          <ResetPasswordModal token={resetToken} />
        ) : (
          ""
        )}
      </header>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    data: state.userReducer.userData,
    token: state.userReducer.token,
    userId: state.userReducer.id,
    loading: state.userReducer.loading,
    ethPriceState: state.userReducer.ethPriceState,
    walletConnection: state.userReducer.walletConnection,

    languageData: state.siteSettingReducer.languages,
  };
};
export default connect(mapStateToProps)(withRouter(AuthHeader));

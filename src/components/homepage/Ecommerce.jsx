import { Redirect } from "react-router-dom";
import sale from "./../../assets/img/sale.png";
import {
  supportedNetworkVersions,
  supportedNetworks,
} from "./../../constant/constant";
import { Message } from "../../utils/message";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Logo from "./../../assets/img/olympusnft-logo.gif";
const $ = window.jQuery;
function Ecommerce(props) {
  let connected = Boolean(localStorage.getItem("walletConn"));
  let token = Boolean(localStorage.token);
  const [redirect, setRedirect] = useState(false);
  const [connect, setConnect] = useState(false);

  useEffect(() => {
    if (connected) {
      setConnect(true);
    } else if (!connected) {
      setConnect(false);
    }
  }, [props.walletConnection]);

  useEffect(() => {
    if (connected) {
      setConnect(true);
    } else if (!connected) {
      setConnect(false);
    }
  }, [token, props.token]);
  const [ownToken, setOwnToken] = useState(localStorage.getItem("token"));
  const openTab = () => {
    if (
      !connected ||
      connected === null ||
      supportedNetworkVersions.indexOf(window.ethereum.networkVersion) === -1
    ) {
      Message(
        "error",
        "Sorry",
        "Please Connect to supported network (" +
          supportedNetworks +
          ") first or connect wallet."
      );
      return;
    } else {
      setRedirect(true);
    }
  };

  const openSignUpTab = (param) => {
    $(`#${param}`).tab("show");
  };

  if (redirect) {
    return <Redirect to="/create-item" />;
  }
  return (
    <section className="art-commerce main-padding">
      <div className="row justify-content-center">
        <div className="col-12 d-flex justify-content-center">
          <div className="content">
            <div className="pre-sale">
              <img src={sale} alt="About" className="img-fluid" />

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
const mapStateToProps = (state) => {
  return {
    walletConnection: state.userReducer.walletConnection,
    token: state.userReducer.token,
  };
};

export default connect(mapStateToProps)(Ecommerce);

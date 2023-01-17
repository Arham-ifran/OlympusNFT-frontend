import React from "react";
import footer2 from "./../../assets/img/foote-2.png";

function Blockchain(props) {
  return (
    <React.Fragment>
      <section className="blockchain">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="heading">
                <h1>Its on the Blockchain!</h1>
                <p>
                  Unsold tokens from previous rounds will be moved into the next
                  round.
                </p>
                <p>
                  The token sale will automatically go to the next round when
                  tokens are sold out in the prior round.
                </p>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-lg-end justify-content-center mt-md-0 mt-3">
              {" "}
              <img src={footer2} alt="About" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
export default Blockchain;

import React, { useState, useEffect } from "react";
import { SubscibeApi } from "../../container/Api/api";
import { Message, messageFormater } from "../../utils/message";
import SmallLoader from "../loader/SmallLoader";
import { connect } from "react-redux";
import { selectedUserType } from "./../../store/actions/userAction";
import { createGlobalStyle } from "styled-components";

const $ = window.jQuery;

function CreatorInvestor(props) {
  const [time, setTime] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [day, setDay] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [state, setState] = useState({
    email: "",
    name: "",
    isSubmitted: false,
    errors: "",
    loading: false,
    success: false,
  });

  useEffect(() => {
    setTime(props.launch_time);
  }, [props.launch_time]);

  useEffect(() => {
    let countDownDate = new Date(time * 1000).getTime();
    let x = setInterval(function () {
      let now = new Date().getTime();
      let distance = countDownDate - now;
      setDay(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHours(
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      );
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
      if (distance < 0) {
        clearInterval(x);
        setDay(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
    }, 1000);
  }, [time]);

  const openSignUpTab = (param, value) => {
    $(`#${param}`).tab("show");
    props.dispatch(selectedUserType(value));
  };

  const openSubscribeModel = () => {
    $(`#subscribeModel`).modal("show");
  };

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
      errors: "",
    });
  };

  const closeSubscribeModel = () => {
    setState({
      email: "",
      name: "",
      isSubmitted: false,
      errors: "",
      loading: false,
      success: false,
    });
  };

  const subscribeHandler = async () => {
    const { name, email } = state;
    if (!email) {
      Message("error", "Error", "Please enter email");
    } else {
      let body = {};
      if (name) {
        body["name"] = name;
      }
      if (email) {
        body["email"] = email;
      }
      setState({
        ...state,
        loading: true,
      });
      let res = await SubscibeApi(body);
      if (res && res.data.status && res.data.status === 1) {
        Message("success", "Success", "Successfully Subscibe");
        $(`#subscribeModel`).modal("hide");
        setState({
          ...state,
          email: "",
          name: "",
          isSubmitted: false,
          errors: "",
          loading: false,
          success: false,
        });
      } else if (res && res.data.status && res.data.status === 403) {
        setState({
          ...state,
          email: "",
          name: "",
          isSubmitted: false,
          errors: "",
          loading: false,
          success: false,
        });
        Message("error", "Error", "Email is already exists");
      } else {
        if (res && res.data && res.data.status === 0) {
          let message = "";
          if (typeof res.data.message === "string") {
            message = res.data.message;
          } else if (typeof res.data.message === "object") {
            message = res.data.message.email;
          }
          let errorMessage = messageFormater(message);
          if (errorMessage) {
            Message("error", "Error", errorMessage);
          }
        }
        setState({
          ...state,
          email: "",
          name: "",
          isSubmitted: false,
          errors: "",
          loading: false,
          success: false,
        });
      }
    }
  };

  useEffect(() => {
    let tok = Boolean(localStorage.getItem("token"));
    if (tok) {
      setToken(localStorage.getItem("token"));
    } else {
      setToken(props.token);
    }
  }, [props.token]);

  return (
    // <section className="creater-investor">
    <div className="container">
      <div className="row"></div>
     
    </div>
    // </section>
  );
}
const mapStateToProps = (state) => {
  return {
    launch_time: state.siteSettingReducer.launch_time,
    token: state.userReducer.token,
  };
};

export default connect(mapStateToProps)(CreatorInvestor);

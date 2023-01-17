import { useState, useEffect } from "react"
import AuthHeader from "./AuthHeader"
import { connect } from 'react-redux'

function Header(props) {
  const [state, setState] = useState({
    categories: [],
    languages: []
  })
  const [isAuthenticated, updateAuth] = useState(false)

  useEffect(() => {
    if (props.token || localStorage.getItem('token')) {
      updateAuth(true)
    } else {
      updateAuth(false)
    }
  }, [props.token])

  return <AuthHeader />


}
const mapStateToProps = state => {
  return {
    token: state.userReducer.token
  }
}
export default connect(mapStateToProps)(Header)
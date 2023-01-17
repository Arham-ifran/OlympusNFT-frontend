import Swal from 'sweetalert2'

export const Message = (icon, title, text) => {
  Swal.fire({
    icon,
    title,
    text,
    showConfirmButton: true,
    timer: icon === 'error' ? 0 : 1500
  })
}

export const HotMessage = (icon, title, text) => {
  Swal.fire({
    icon,
    title,
    text,
    showConfirmButton: false,
    hideOnOverlayClick: false,
    allowOutsideClick: false,
    closeClick: false,
    helpers: {
      overlay: { closeClick: false }
    }
  })
}

export const messageFormater = (message) => {
  let result = '';
  if (typeof message === 'string') {
    result = message
  } else if (typeof message === 'object' && message.length > 0) {
    for (let index = 0; index < message.length; index++) {
      result = result ? result + message[index] : message[index]
    }
  }
  return result
}
export const ErrorHandler = (error) => {
  if (error && error.response && error.response.status === 401) {
    localStorage.clear()
    this.props.history.push('/')
    window.location.reload(true)
  }
}
import isEmpty from 'lodash/isEmpty'

export function signupValidation(data) {
  let errors = {}
  if (!data.username) {
    errors = `Please enter username`
  } else if (!data.email) {
    errors = `Please enter email`
  } else if (!data.confirmEmail) {
    errors = `Please enter confirm email`
  } else if (!data.password) {
    errors = `Please enter confirm email`
  } else if (!data.accept) {
    errors = `Please accept terms and conditions`
  } else if (data.username.length > 20) {
    errors = `Username can't be exceed 20 characters`
  } else if (data.username.length < 5) {
    errors = `Username must have atleast 5 characters`
  } else if (!data.username.match(/^[A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*$/)) {
    errors = `Username: No special characters and space allow except _ i.e:name_one`
  } else if (!data.email.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
    errors = `Email is invalid`
  } else if (data.confirmEmail !== data.email) {
    errors = `Emails must be same`
  } else if (!data.password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
    errors = `Password must contain uppercase alphanumeric and symbol`
  } else if (data.password.length < 8) {
    errors = `Password must contain atleast 8 characters`
  } else if (!data.user_type) {
    errors = `Please select user type`
  }

  return {
    isValid: isEmpty(errors),
    errors
  }

}

export function loginValidation(data) {
  let errors = {}
  if (!data.email || !data.password) {
    errors = `All fields are require`
  } else if (!data.email.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
    errors = `Email is invalid`
  } else if (!data.password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
    errors = `Password is invalid`
  }
  return {
    isValid: isEmpty(errors),
    errors
  }
}

export function forgetValidation(data) {
  let errors = {}
  if (!data.email) {
    errors = `Please enter your email`
  } else if (!data.email.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
    errors = `Email is invalid`
  }
  return {
    isValid: isEmpty(errors),
    errors
  }
}

export function changePassword(data) {
  let errors = {}
  if (!data.current_password) {
    errors = `Please enter your password`
  } else if (!data.new_password) {
    errors = `Please enter new password`
  } else if (!data.new_password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
    errors = `Password must contain numeric, alphabet and symbol`
  } else if (data.new_password.length < 8) {
    errors = `New password must have atleast 8 characters`
  }
  return {
    isValid: isEmpty(errors),
    errors
  }
}

export function resetPasswordValidation(data) {
  let errors = {}
  if (!data.newPassword) {
    errors = `Please enter your new password`
  } else if (!data.confirmPassword) {
    errors = `Please enter confirm password`
  } else if (!data.newPassword.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
    errors = `New Password must contain numeric, alphabet and symbol`
  } else if (data.confirmPassword !== data.newPassword) {
    errors = `Both passwords must be same`
  } else if (data.newPassword.length < 8) {
    errors = `New password must have atleast 8 characters`
  }
  return {
    isValid: isEmpty(errors),
    errors
  }
}

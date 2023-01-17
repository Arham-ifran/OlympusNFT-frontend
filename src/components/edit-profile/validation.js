import isEmpty from 'lodash/isEmpty'

export function editProfileValidation(data) {
  let errors = {}
  if (!data.username) {
    errors = `Username can't be empty`
  } else if (data.username.length > 20) {
    errors = `Username can't be exceed 20 characters`
  } else if (data.username.length < 8) {
    errors = `Username must have atleast 8 characters`
  } else if (!data.username.match(/^[A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*$/)) {
    errors = `Username: No special characters and space allow except _ i.e:name_one`
  }

  return {
    isValid: isEmpty(errors),
    errors
  }

}
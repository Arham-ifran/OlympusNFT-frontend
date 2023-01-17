import isEmpty from 'lodash/isEmpty'

export function createStoreValidation(data) {
  let errors = {}
  if (!data.category_id) {
    errors = `Please select category.`
  } else if (!data.store_title) {
    errors = `Please proide store title.`
  } else if (!data.sub_title) {
    errors = 'Please provide sub title.'
  } else if (data.tags.length === 0) {
    errors = 'Please provide tags.'
  } else if (!data.image) {
    errors = 'Please select store image.'
  } else if (!data.description) {
    errors = 'Please enter store description.'
  }

  return {
    isValid: isEmpty(errors),
    errors
  }

}
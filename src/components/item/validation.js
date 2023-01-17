import isEmpty from 'lodash/isEmpty'

export function createItemValidation(data) {
  let errors = ''
  if (!data.category_id) {
    errors = `Select category from dropdown`
  } else if (!data.title) {
    errors = `Listing title is require`
  } else if (!data.sub_title) {
    errors = 'Listing subtitle is require'
  } else if (data.sub_title.length < 4) {
    errors = 'Listing subtitle must have at least four characters'
  } else if (!data.description) {
    errors = 'Description is require'
  } else if (!data.files) {
    errors = 'Please provide Item image'
  }
  else if (data.files) {
    let files = data.files
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      let allowedType = ["image/jpeg", "image/jpg", "image/png", "video/mp4", "video/movie", "image/gif"];
      if (allowedType.indexOf(element.type) === -1) {
        errors = "Please Upload only jpeg, jpg, png, gif image or mp4 video file.";
        break;
      }
      // errors = {}
    }
  }
  else if (data.fixed && !data.price_usd) {
    errors = 'Invalid fixed price'
  } else if (data.fixed && data.price_usd <= 0) {
    errors = 'Invalid fixed price'
  } else if (data.auction && !data.auction_length_id) {
    errors = 'Select auction length'
  } else if (data.auction && !data.bid_price_usd) {
    errors = 'Provide bid price'
  } else if (data.auction && data.bid_price_usd <= 0) {
    errors = 'Invalid bid price'
  } else if (data.auction_with_buy && !data.auction_length_id) {
    errors = 'Select auction length'
  } else if (data.auction_with_buy && !data.bid_price_usd) {
    errors = 'Provide Buy NFT price'
  } else if (data.auction_with_buy && !data.price_usd) {
    errors = 'Provide fixed price'
  } else if (data.auction_with_buy && data.bid_price_usd <= 0) {
    errors = 'Invalid bid price'
  } return {
    isValid: isEmpty(errors),
    errors
  }

}

export function editItemValidation(data) {
  let errors = {}
  if (!data.category_id) {
    errors = `Select category from dropdown`
  } else if (!data.title) {
    errors = `Listing title is require`
  } else if (!data.sub_title) {
    errors = 'Listing subtitle is require'
  } else if (data.sub_title.length < 4) {
    errors = 'Listing subtitle must have at least four characters'
  } else if (!data.description) {
    errors = 'Description is require'
  } else if (data.tags.length < 1) {
    errors = 'Please enter listing tags'
  } else if (data.fixed && !data.price_usd) {
    errors = 'Provide bid price'
  } else if (data.fixed && data.price_usd <= 0) {
    errors = 'Invalid fixed price'
  } else if (data.auction && !data.auction_length_id) {
    errors = 'Select auction length'
  } else if (data.auction && !data.bid_price_usd) {
    errors = 'Provide bid price'
  } else if (data.auction && data.bid_price_usd <= 0) {
    errors = 'Invalid bid price'
  }


  else if (data.auction_with_buy && !data.auction_length_id) {
    errors = 'Select auction length'
  } else if (data.auction_with_buy && !data.bid_price_usd) {
    errors = 'Provide Buy NFT price'
  } else if (data.auction_with_buy && !data.price_usd) {
    errors = 'Provide Fixed price'
  }
  else if (data.auction_with_buy && data.bid_price_usd <= 0) {
    errors = 'invalid bid price'
  }

  return {
    isValid: isEmpty(errors),
    errors
  }

}
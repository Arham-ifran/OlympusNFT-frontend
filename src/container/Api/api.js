import { API, Config } from './../../utils'
import { currentPrice } from "./../../constant/constant";

export const UserProfileApi = () => {
  let response = API.get(`api/profile/${localStorage.getItem('id')}`, Config(localStorage.getItem('token')))
  return response
}

export const VideoGuideAPi = () => {
  let response = API.get('api/video-guide')
  return response
}

export const FetchStoreApi = () => {
  let response = API.get('api/store', Config(localStorage.getItem('token')))
  return response
}

export const UploadUserImage = (body) => {
  let response = API.post('api/upload-user-image', body, Config(localStorage.getItem('token')))
  return response
}

export const UpdateProfileApi = (body) => {
  let response = API.post('api/update-profile', body, Config(localStorage.getItem('token')))
  return response
}
export const UserStoreListCreateItemApi = () => {
  let response = API.get(`api/get-user-stores-list?user_id=${localStorage.getItem('id')}`, Config(localStorage.getItem('token')))
  return response
}
/** Profile Stores API */
export const UserProfileStoreApi = () => {
  let response = API.get(`api/get-user-stores?user_id=${localStorage.getItem('id')}`, Config(localStorage.getItem('token')))
  return response
}
export const UserProfileReviewsApi = (query) => {
  let url = "";
  if (query) {
    url = `api/get-user-reviews/${localStorage.getItem('id')}?${query}`
  } else {
    url = `api/get-user-reviews/${localStorage.getItem('id')}`
  }
  let response = API.get(url, Config(localStorage.getItem('token')))
  return response;
}
export const getAllProductscApi = (query) => {
  let response = API.get(`/api/all-products?category=${query}`, Config(localStorage.getItem('token')))
  return response;
}

export const SearchUserStoreApi = (val) => {
  let response = API.get(`api/get-user-stores?user_id=${localStorage.getItem('id')}&search_store=${val}`, Config(localStorage.getItem('token')))
  return response
}
/*-------END-------*/
export const StoreDetailsApi = (storeId) => {
  let response = API.get(`api/get-store-detail/${storeId}`, Config(localStorage.getItem('token')))
  return response
}
export const PaginatedUserStoreApi = (val) => {
  let response = API.get(`api/get-user-stores?user_id=${localStorage.getItem('id')}&offset=${val}`, Config(localStorage.getItem('token')))
  return response
}

export const UserItemsListApi = () => {
  let response = API.get(`api/user-products?user_id=${localStorage.getItem('id')}`, Config(localStorage.getItem('token')))
  return response
}
export const UserItemsTransactionsApi = () => {
  let response = API.get(`api/get-user-transactions?user_id=${localStorage.getItem('id')}`, Config(localStorage.getItem('token')))
  return response
}

export const SearchUserItemsListApi = (val) => {
  let response = API.get(`api/user-products?user_id=${localStorage.getItem('id')}&search_product=${val}`, Config(localStorage.getItem('token')))
  return response
}

export const PaginatedUserItemsListApi = (val) => {
  let response = API.get(`api/user-products?user_id=${localStorage.getItem('id')}&offset=${val}`, Config(localStorage.getItem('token')))
  return response
}
export const productDeleteApi = (body) => {
  let response = API.post(`api/delete-product`, body, Config(localStorage.getItem('token')))
  return response
}
export const UserSoldItemsListApi = () => {
  let response = API.get(`api/user-sold-products?user_id=${localStorage.getItem('id')}`, Config(localStorage.getItem('token')))
  return response
}

export const SearchUserSoldItemsListApi = (val) => {
  let response = API.get(`api/user-sold-products?user_id=${localStorage.getItem('id')}&search_product=${val}`, Config(localStorage.getItem('token')))
  return response
}

export const PaginatedUserSoldItemsListApi = (val) => {
  let response = API.get(`api/user-sold-products?user_id=${localStorage.getItem('id')}&offset=${val}`, Config(localStorage.getItem('token')))
  return response
}

export const UserNFTItemsListApi = () => {
  let response = API.get(`api/user-nfts-list?user_id=${localStorage.getItem('id')}`, Config(localStorage.getItem('token')))
  return response
}
export const SearchUserNFTItemsListApi = (val) => {
  let response = API.get(`api/user-nfts-list?user_id=${localStorage.getItem('id')}&search_product=${val}`, Config(localStorage.getItem('token')))
  return response
}
export const PaginatedUserNFTItemsListApi = (val) => {
  let response = API.get(`api/user-nfts-list?user_id=${localStorage.getItem('id')}&offset=${val}`, Config(localStorage.getItem('token')))
  return response
}

export const EditItemsApi = (id) => {
  let body = { product_id: id }
  let response = API.post(`api/edit-product`, body, Config(localStorage.getItem('token')))
  return response
}

export const UpdateItemsAPi = (body) => {
  let response = API.post(`api/update-product`, body, Config(localStorage.getItem('token')))
  return response
}

export const CreateStoreApi = (body) => {
  let response = API.post('api/create-store', body, Config(localStorage.getItem('token')))
  return response
}

export const CreateItemApi = (body) => {
  let response = API.post('api/create-product', body, Config(localStorage.getItem('token')))
  return response
}

export const AuctionLengthAndCategoriesApi = () => {
  let response = API.get('api/product', Config(localStorage.getItem('token')))
  return response
}

export const ProductDetailsApi = (productId) => {
  let response = API.get(`api/product/${productId}`)
  return response
}
export const ReviewsDetailsApi = (orderId) => {
  let response = API.get(`api/review-detail?user_id=${localStorage.getItem('id')}&order_id=${orderId}`, Config(localStorage.getItem('token')))
  return response
}

export const PlaceBidApi = (body) => {
  let response = API.post('api/create-bid', body, Config(localStorage.getItem('token')))
  return response
}
export const contactUs = (body) => {
  let response = API.post('api/contact-us', body)
  return response
}
export const ReportItemAPi = (body) => {
  let response = API.post('api/report-item', body, Config(localStorage.getItem('token')))
  return response
}

export const MainThreeCategoryApi = () => {
  let response = API.get('api/main-categories')
  return response
}

export const LanguagesApi = () => {
  let response = API.get('api/categories-languages')
  return response
}

export const BannersApi = () => {
  let response = API.get('api/home-page-banner-images')
  return response
}
/**Messages API's */
export const FetchMessagesThreadApi = (user_id, limit = 10, offset = 0) => {
  let response = API.get(`api/fetch-message-threads?user_id=${user_id}&limit=${limit}&offset=${offset}`, Config(localStorage.getItem('token')))
  return response
}

export const FetchMessagesListApi = (user_id, thread_id = 0) => {
  let response = API.get(`api/fetch-messages?user_id=${user_id}&thread_id=${thread_id}`, Config(localStorage.getItem('token')))
  return response
}

export const SendMessagesApi = (body) => {
  let response = API.post(`api/send-message`, body, Config(localStorage.getItem('token')))
  return response
}

export const SearchUserApi = (searchUserParams) => {
  let response = API.get(`api/get-users-for-message?search_user=${searchUserParams}&senderId=${localStorage.getItem('id')}`, Config(localStorage.getItem('token')))
  return response
}

export const AdmanagerApi = () => {
  let response = API.get(`api/user-ads?user_id=${localStorage.getItem('id')}`, Config(localStorage.getItem('token')))
  return response
}

export const PublishAdApi = (body) => {
  let response = API.post(`api/create-user-ad`, body, Config(localStorage.getItem('token')))
  return response
}

export const DeleteAdApi = (body) => {
  let response = API.post(`api/delete-ad`, body, Config(localStorage.getItem('token')))
  return response
}

export const EarningApi = () => {
  let response = API.get(`api/my-earning?user_id=${localStorage.getItem('id')}`, Config(localStorage.getItem('token')))
  return response
}

/**Ethereum USD API*/
export const EthereumPriceApi = () => {
  let response = API.get('https://api.coingecko.com/api/v3/simple/price?ids=' + currentPrice + '&vs_currencies=usd')
  return response
}

export const LoginApi = (body) => {
  let response = API.post('api/login', body)
  return response
}

export const SignupApi = (body) => {
  let response = API.post('api/register', body)
  return response
}

export const LogoutApi = () => {
  let response = API.post('api/logout', {}, Config(localStorage.getItem('token')))
  return response
}

export const ForgetPasswordApi = (body) => {
  let response = API.post('api/forgot-password', body, Config(localStorage.getItem('token')))
  return response
}

export const ChangePasswordApi = (body) => {
  let response = API.post('api/change-password', body, Config(localStorage.getItem('token')))
  return response
}

/**
 * PUBLIC PROFILE
 */
export const UserPublicProfileApi = (username) => {
  let response = API.get(`api/public-profile/${username}`, Config(localStorage.getItem('token')))
  return response
}

export const UserPublicProfileProductsApi = (username, body) => {
  let response = API.post(`api/get-user-products/${username}`, body, Config(localStorage.getItem('token')))
  return response
}
export const UserProductsReviews = (username, body) => {
  let response = API.get(`api/reviews/${username}`)
  return response
}
/**
 * PUBLIC RFQ
 */
export const getFaQsApi = () => {
  let response = API.get(`/api/faqs`, Config(localStorage.getItem('token')))
  return response
}

/**
 * PUBLIC CMS 
 */
export const getCmsPagesApi = () => {
  let response = API.get(`/api/cms-pages`, Config(localStorage.getItem('token')))
  return response
}
export const getCmsDetailPagesApi = (pageName) => {
  let response = API.get(`api/cms-page/${pageName}`, Config(localStorage.getItem('token')))
  return response
}
/**
 * PUBLIC Subscribe
 */
export const SubscibeApi = (body) => {
  let response = API.post(`api/subscribe-us`, body, Config(localStorage.getItem('token')))
  return response
}
export const addReviewsApi = (body) => {
  let response = API.post(`api/create-review`, body, Config(localStorage.getItem('token')))
  return response;
}

// Create Order

export const createOrder = (body) => {
  let response = API.post(`api/create-order`, body, Config(localStorage.getItem('token')))
  return response;
}

export const getBoughtItemsApi = (query) => {
  let url = "";
  if (query) {
    url = `/api/my-bought-items?user_id=${localStorage.getItem('id')}${query}`
  } else {
    url = `api/get-user-reviews/${localStorage.getItem('id')}`
  }
  let response = API.get(url, Config(localStorage.getItem('token')))
  return response
}
export const getBidingHistoryApi = (query) => {
  let url = "";
  url = `api/my-bids?user_id=${localStorage.getItem('id')}${query}`
  let response = API.get(url, Config(localStorage.getItem('token')))
  return response
}
export const getWonAuctionApi = (query) => {
  let url = "";
  url = `api/won-auctions?user_id=${localStorage.getItem('id')}${query}`
  let response = API.get(url, Config(localStorage.getItem('token')))
  return response
}
export const getSettings = () => {
  let response = API.get(`api/settings`)
  return response
}
export const IncreaseProductViewCounter = (id) => {
  let body = { productId: id, userId: localStorage.getItem('id') ? localStorage.getItem('id') : null }
  let response = API.post(`api/increase-product-view-counter`, body)
  return response
}

export const BlogNewsApi = (cat, offset, search) => {
  let response = API.get(`api/blogs/${cat}?offset=${offset}&&search_blog=${search}`)
  return response
}
export const DetailBlogApi = (blog_name) => {
  let response = API.get(`api/blog/${blog_name}`)
  return response
}
export const BoostedProductsApi = (addId) => {
  let response = API.get(`api/ad-boasted-product-click?adId=${addId}`)
  return response
}

export const ResetPasswordApi = (body) => {
  let response = API.post(`api/reset-password`, body)
  return response
}
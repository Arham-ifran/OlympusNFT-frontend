import { combineReducers } from 'redux'
import userReducer from './userReducer'
import siteSettingReducer from './siteSettingReducer'
import productsByCategoryReducer from './productsByCategoryReducer'
import mostWatchedProductReducer from './mostWatchedPrdoduct'
import topSellingProductsReducer from "./topSellingProducts"
import productDetailsReducer from './productDetailsReducer'
import storeDetailsReducer from './storeDetailsReducer'
import MessagesReducer from './messagesReducer'
import adManagerReducer from './ad-managerReducer'
import blogsReducer from './blogsReducer'

const reducer = combineReducers({
    userReducer,
    siteSettingReducer,
    productsByCategoryReducer,
    mostWatchedProductReducer,
    topSellingProductsReducer,
    productDetailsReducer,
    storeDetailsReducer,
    MessagesReducer,
    adManagerReducer,
    blogsReducer
    // routing: routerReducer
})

export default reducer;
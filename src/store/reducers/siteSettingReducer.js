import * as actions from '../actions/action_type'
let initialState = {
  id: '',
  site_name: '',
  site_title: '',
  site_keywords: '',
  site_description: '',
  site_email: '',
  inquiry_email: '',
  site_phone: '',
  site_mobile: '',
  site_address: '',
  facebook: '',
  twitter: '',
  discord: '',
  linkedin: '',
  insta: '',
  tiktok: '',
  twitch: '',
  youtube: '',
  skype: '',
  suggested_cpc_price: '',
  current_average_cpc_price: '',
  created_at: '',
  updated_at: '',
  loading: true,
  launch_time: '',
  categories: [],
  languages: [],
  bannerImages: [],
  bannerLoading: true
};

let siteSettingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SITE_SETTING:
      return { ...state }
    case actions.SITE_SETTING_SUCCESS:

      return {
        ...state,
        homeVideo: action.payload.data.home_page_video,
        facebook: action.payload.data.facebook,
        twitter: action.payload.data.twitter,
        discord: action.payload.data.discord,
        insta: action.payload.data.insta,
        youtube: action.payload.data.youtube,
        site_name: action.payload.data.site_name,
        site_mobile: action.payload.data.site_mobile,
        site_email: action.payload.data.site_email,
        site_phone: action.payload.data.site_phone,
        suggested_cpc_price: action.payload.data.suggested_cpc_price,
        current_average_cpc_price: action.payload.data.current_average_cpc_price,
        loading: false,
        launch_time: action.payload.data.launch_time
      }
    case actions.CAT_LANGUGAE_SUCCESS:
      return {
        ...state, languages: action.payload.languages, categories: action.payload.categories
      }
    case actions.CAT_LANGUGAE:
      return {
        ...state, languages: [], categories: []
      }
    case actions.BANNER_IMAGES_SUCCESS:
      return {
        ...state, bannerImages: action.payload.data, bannerLoading: false
      }
    case actions.BANNER_IMAGES:
      return {
        ...state, bannerImages: [], bannerLoading: false
      }
    default:
      return state
  }
}


export default siteSettingReducer;
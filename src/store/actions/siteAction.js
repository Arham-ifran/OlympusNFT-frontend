import { SITE_SETTING, SITE_SETTING_SUCCESS, CAT_LANGUGAE_SUCCESS, CAT_LANGUGAE, BANNER_IMAGES, BANNER_IMAGES_SUCCESS } from './action_type'
import { API } from './../../utils'
import { LanguagesApi, BannersApi } from './../../container/Api/api'
import { ErrorHandler } from '../../utils/message'
export let siteSetting = () => ({ type: SITE_SETTING })
export let siteSettingSuccess = data => ({
  type: SITE_SETTING_SUCCESS,
  payload: { data },
})

export function fetchSiteSettingData() {
  return dispatch => {
    dispatch(siteSetting())
    API.get(`api/settings`)
      .then(response => {
        if (response.status === 200 && response.data.status === 1) {
          let data = response.data.data
          dispatch(siteSettingSuccess(data))
        } else if (response.status === 200 && response.data.status === 0) {
          let data = []
          dispatch(siteSettingSuccess(data))
        }
      }).catch(err => err ? dispatch(siteSetting()) : '')
  }
}
// LanguagesApi
export let categoryAndLanguage = () => ({ type: CAT_LANGUGAE })
export let categoryAndLanguageSuccess = (languages, categories) => ({
  type: CAT_LANGUGAE_SUCCESS,
  payload: { languages, categories },
})

export function fetchCategoryAndMessageData() {
  return async (dispatch) => {
    dispatch(categoryAndLanguage())
    let response = await LanguagesApi()
    try {
      if (response.status === 200 && response.data.status === 1) {
        let languages = response.data.data.languages
        let categories = response.data.data.categories
        dispatch(categoryAndLanguageSuccess(languages, categories))
      } else if (response.status === 200 && response.data.status === 0) {
        dispatch(categoryAndLanguageSuccess([]))
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }
}

//Banner Images Action
export let BannerImagesAction = () => ({ type: BANNER_IMAGES })
export let BannerImagesActionSuccess = (data) => ({
  type: BANNER_IMAGES_SUCCESS,
  payload: { data },
})

export function fetchBannerImagesData() {
  return async (dispatch) => {
    dispatch(BannerImagesAction())
    let response = await BannersApi()
    try {
      if (response.status === 200 && response.data.status === 1) {
        let data = response.data.data
        dispatch(BannerImagesActionSuccess(data))
      } else if (response.status === 200 && response.data.status === 0) {
        dispatch(BannerImagesActionSuccess([]))
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }
}
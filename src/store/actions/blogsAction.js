import { BLOG_NEWS, BLOG_NEWS_SUCCESS, BLOG_DETAIL, BLOG_DETAIL_SUCCESS } from './action_type'
import { BlogNewsApi, DetailBlogApi } from './../../container/Api/api'
import { ErrorHandler } from '../../utils/message'
export let blogNews = () => ({ type: BLOG_NEWS })
export let blogNewsSuccess = data => ({
	type: BLOG_NEWS_SUCCESS,
	payload: { data },
})

export function fetchBlogNewsData(cat = 'news', offset = 0, search = '') {
	return async dispatch => {
		dispatch(blogNews())
		const response = await BlogNewsApi(cat, offset, search)
		try {
			if (response.status === 200 && response.data.status === 1) {
				let data = response.data.data
				dispatch(blogNewsSuccess(data))
			} else if (response.status === 200 && response.data.status === 0) {
				let data = []
				dispatch(blogNewsSuccess(data))
			}
		} catch (err) {
			ErrorHandler(err)
		}
	}
}

export let detailBlog = () => ({ type: BLOG_DETAIL })
export let detailBlogSuccess = data => ({
	type: BLOG_DETAIL_SUCCESS,
	payload: { data },
})

export function fetchCompleteBlog(blog_name) {
	return async dispatch => {
		dispatch(detailBlog())
		const response = await DetailBlogApi(blog_name)
		try {
			if (response.status === 200 && response.data.status === 1) {
				let data = response.data.data
				dispatch(detailBlogSuccess(data))
			} else if (response.status === 200 && response.data.status === 0) {
				let data = []
				dispatch(detailBlogSuccess(data))
			}
		} catch (err) {
			ErrorHandler(err)
		}
	}
}
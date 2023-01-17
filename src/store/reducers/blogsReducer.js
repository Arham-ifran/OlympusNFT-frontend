import * as actions from '../actions/action_type'
let initialState = {
	blogs: [],
	recentBlogs: [],
	blogCategories: [],
	loading: true,
	detailBlogLoading: true,
	detailBlog: '',
	total_records: 0,
};

let blogsReducer = (state = initialState, action) => {
	switch (action.type) {
		case actions.BLOG_NEWS:
			return { ...state, loading: true }
		case actions.BLOG_NEWS_SUCCESS:
			return {
				...state,
				loading: false,
				blogs: action.payload.data.blogs,
				recentBlogs: action.payload.data.recentBlogs,
				blogCategories: action.payload.data.blogCategories,
				total_records: action.payload.data.total_records
			}
		case actions.BLOG_DETAIL:
			return { ...state }
		case actions.BLOG_DETAIL_SUCCESS:
			return { ...state, detailBlogLoading: false, detailBlog: action.payload.data }
		default:
			return state
	}
}


export default blogsReducer;
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Header from "./container/Header";
import Footer from "./container/Footer";
import HomePage from "./components/homepage/HomePage";
import Admanager from "./components/ad-manager/Admanager";
import Category from "./components/category/Category";
import News from "./components/news/News";
import NewsDetail from "./components/news/detail";
// import BlitzMarketing from './components/blitzmarketing/BlitzMarketing'
import Createitem from "./components/item/Createitem";
import CurrentItemList from "./components/item/Currentitemlist";
import SoldItemslist from "./components/item/SoldItemslist";
import MyNFTList from "./components/item/MyNFTList";
import Product from "./components/product/Product";
import Profile from "./components/profile/Profile";
import Reviews from "./components/profile/Reviews";
import History from "./components/profile/History";
import MyOrder from "./components/profile/MyOrder";
import BidingHistory from "./components/profile/BidingHistory";
import UserProfile from "./components/userProfile/Profile";
import AddReview from "./components/profile/AddReview";
import WonAuction from "./components/profile/WonAuction";
import Createstore from "./components/create-store/Createstore";
import StoreDetail from "./components/store-detail/StoreDetail";
import ProductDetails from "./components/product-bid/ProductDetails";
import About from "./components/about/About";
import Help from "./components/help/Help";
import Messages from "./components/messages/Messages";
import EditProfile from "./components/edit-profile/EditProfile";
import EditItem from "./components/item/EditItem";
import MyEarnings from "./components/my-earnings/MyEarnings";

const App = () => {
  const AuthenticatedRoutes = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("token") ? (
          <Component {...props} />
        ) : (
          <Redirect {...props} />
        )
      }
    />
  );
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route
            exact
            path="/resetPassword/:_find/:_token"
            component={HomePage}
          />
          <AuthenticatedRoutes path="/ad-manager" component={Admanager} />
          <Route exact path="/category/music" component={Category} />
          <Route exact path="/category/art" component={Category} />
          <Route exact path="/category/film" component={Category} />
          <Route exact path="/blogs/:slug" component={News} />
          <Route exact path="/blog/:slug" component={NewsDetail} />
          {/* <Route exact path="/blitz-marketing" component={BlitzMarketing} /> */}
          <AuthenticatedRoutes path="/create-item" component={Createitem} />
          <AuthenticatedRoutes path="/edit-item/:id" component={EditItem} />
          <AuthenticatedRoutes path="/create-store" component={Createstore} />
          <AuthenticatedRoutes
            path="/current-item-list"
            component={CurrentItemList}
          />
          <AuthenticatedRoutes
            path="/sold-item-list"
            component={SoldItemslist}
          />
          <AuthenticatedRoutes path="/my-nft" component={MyNFTList} />
          <AuthenticatedRoutes path="/profile" component={Profile} />
          <AuthenticatedRoutes
            path="/biding-history"
            component={BidingHistory}
          />
          <AuthenticatedRoutes path="/won-auctions" component={WonAuction} />
          <AuthenticatedRoutes path="/my-earnings" component={MyEarnings} />
          <AuthenticatedRoutes path="/products-reviews" component={Reviews} />
          <AuthenticatedRoutes path="/products-history" component={History} />
          <AuthenticatedRoutes path="/my-orders" component={MyOrder} />
          <Route path="/user/:username" component={UserProfile} />
          <Route path="/review/:productId/:orderId" component={AddReview} />
          <AuthenticatedRoutes path="/edit-profile" component={EditProfile} />
          <AuthenticatedRoutes
            path="/messages/:username"
            component={Messages}
          />
          <AuthenticatedRoutes path="/messages" component={Messages} />
          <AuthenticatedRoutes path="/product" component={Product} />
          <AuthenticatedRoutes
            path="/store-detail/:id"
            component={StoreDetail}
          />
          <Route path="/product-detail/:slug/:id" component={ProductDetails} />
          <Route path="/page/:pageName" component={About} />
          <Route path="/help" component={Help} />
        </Switch>
        <Footer />
      </Router>
    </Provider>
  );
};

export default App;

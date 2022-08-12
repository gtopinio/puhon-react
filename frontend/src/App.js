import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import SearchUser from "./pages/SearchUser";
import FriendRequests from "./pages/FriendRequests";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Routes>
          <Route exact={true} path="/" element={<Home/>} ></Route>
          <Route exact={true} path="/sign-up" element={<SignUp/>} ></Route>
          <Route exact={true} path="/log-in" element={<Login/>} ></Route>
          <Route exact={true} path="/feed" element={<Feed/>} ></Route>
          <Route exact={true} path="/search-user" element={<SearchUser/>} ></Route>
          <Route exact={true} path="/friend-requests" element={<FriendRequests/>} ></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

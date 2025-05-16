import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import NotFoundPage from "./pages/NotFoundPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardLayout from "./modules/dashboard/DashboardLayout";
import PostManage from "./modules/post/PostManage";
import PostAddNew from "./modules/post/PostAddNew";
import UserManage from "./modules/user/UserManage";
import CategoryAddNew from "./modules/category/CategoryAddNew";
import UserAddNew from "./modules/user/UserAddNew";
import UserProfile from "./modules/user/UserProfile";
import CategoryManage from "./modules/category/CategoryManage";
import CategoryUpdate from "./modules/category/CategoryUpdate";
import UserUpdate from "./modules/user/UserUpdate";
import PostUpdate from "./modules/post/PostUpdate";
import CategoryPage from "./pages/CategoryPage";
// import Header from "./components/layout/Header";

function App() {
  return (
    <>
      {/* <Header></Header> */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path="/sign-up" element={<SignUpPage></SignUpPage>}></Route>
          <Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>

          <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
          <Route
            path="/:slug"
            element={<PostDetailsPage></PostDetailsPage>}
          ></Route>
          <Route
            path="/c/:slug"
            element={<CategoryPage></CategoryPage>}
          ></Route>
          <Route element={<DashboardLayout></DashboardLayout>}>
            <Route
              path="/dashboard"
              element={<DashboardPage></DashboardPage>}
            ></Route>
            <Route
              path="/manage/post"
              element={<PostManage></PostManage>}
            ></Route>
            <Route
              path="/manage/add-post"
              element={<PostAddNew></PostAddNew>}
            ></Route>
            <Route
              path="/manage/update-post"
              element={<PostUpdate></PostUpdate>}
            ></Route>
            <Route
              path="/manage/category"
              element={<CategoryManage></CategoryManage>}
            ></Route>
            <Route
              path="/manage/add-category"
              element={<CategoryAddNew></CategoryAddNew>}
            ></Route>
            <Route
              path="/manage/update-category"
              element={<CategoryUpdate></CategoryUpdate>}
            ></Route>
            <Route
              path="/manage/user"
              element={<UserManage></UserManage>}
            ></Route>
            <Route
              path="/manage/add-user"
              element={<UserAddNew></UserAddNew>}
            ></Route>
            <Route
              path="/manage/update-user"
              element={<UserUpdate></UserUpdate>}
            ></Route>
            <Route
              path="/profile"
              element={<UserProfile></UserProfile>}
            ></Route>
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;

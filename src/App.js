import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";

import React, { Suspense } from "react";
// import Header from "./components/layout/Header";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const SignUpPage = React.lazy(() => import("./pages/SignUpPage"));
const SignInPage = React.lazy(() => import("./pages/SignInPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));
const PostDetailsPage = React.lazy(() => import("./pages/PostDetailsPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const CategoryPage = React.lazy(() => import("./pages/CategoryPage"));

const DashboardLayout = React.lazy(() =>
  import("./modules/dashboard/DashboardLayout")
);

const PostManage = React.lazy(() => import("./modules/post/PostManage"));
const PostAddNew = React.lazy(() => import("./modules/post/PostAddNew"));
const PostUpdate = React.lazy(() => import("./modules/post/PostUpdate"));

const UserManage = React.lazy(() => import("./modules/user/UserManage"));
const UserAddNew = React.lazy(() => import("./modules/user/UserAddNew"));
const UserUpdate = React.lazy(() => import("./modules/user/UserUpdate"));
const UserProfile = React.lazy(() => import("./modules/user/UserProfile"));

const CategoryAddNew = React.lazy(() =>
  import("./modules/category/CategoryAddNew")
);
const CategoryManage = React.lazy(() =>
  import("./modules/category/CategoryManage")
);
const CategoryUpdate = React.lazy(() =>
  import("./modules/category/CategoryUpdate")
);

function App() {
  return (
    <>
      {/* <Header></Header> */}
      <AuthProvider>
        <Suspense>
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
        </Suspense>
      </AuthProvider>
    </>
  );
}

export default App;

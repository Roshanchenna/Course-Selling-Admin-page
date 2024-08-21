import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import AdminSignin from "./components/admin/Signin.jsx";
import AdminSignup from "./components/admin/Signup.jsx";
import UserSignin from "./components/user/Signin.jsx";
import UserSignup from "./components/user/Signup.jsx";
import AddCourse from "./components/Admin/AddCourse.jsx";
import Courses from "./components/Admin/Courses.jsx";
import Course from "./components/Admin/Course.jsx";
import {Landing} from "./components/Landing.jsx";
import { userState } from "./store/atoms/user.js";
import { RecoilRoot, useSetRecoilState, useRecoilValue } from 'recoil';
import axios from "axios";
import {BASE_URL} from "./config.js";
import {useEffect} from "react";
import AdminSidebar from "./components/Admin/AdminSidebar.jsx";
import UserSidebar from "./components/User/UserSidebar.jsx";
import UserCourses from "./components/User/UserCourses.jsx";
import PurchasedCourses from "./components/User/PurchasedCourses.jsx"

function App() {
    return (
        <RecoilRoot>
            <div style={{
                width: "100%",
                height: "100vh",
                backgroundColor: "#eeeeee",
                overflowX: "hidden"
            }}>
                <Router>
                    <InitUser />
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        
                        {/* Admin routes */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="addcourse" element={<AddCourse />} />
                            <Route path="courses" element={<Courses />} />
                            <Route path="course/:courseId" element={<Course />} />
                        </Route>
                        <Route path="/admin/signin" element={<AdminSignin />} />
                        <Route path="/admin/signup" element={<AdminSignup />} />
                        
                        {/* User routes */}
                        <Route path="/user" element={<UserLayout />}>
                            <Route index element={<UserDashboard />} />
                            <Route path="courses" element={<UserCourses />} />
                            <Route path="purchasedCourses" element={<PurchasedCourses />} />
                        </Route>
                        <Route path="/user/signin" element={<UserSignin />} />
                        <Route path="/user/signup" element={<UserSignup />} />
                    </Routes>
                </Router>
            </div>
        </RecoilRoot>
    );
}

function AdminLayout() {
    const user = useRecoilValue(userState);
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <AdminSidebar adminName={user.userEmail}/>
            <div style={{ flexGrow: 1, overflow: 'auto', padding: 0 }}>
                <Outlet />
            </div>
        </div>
    );
}

function UserLayout() {
    const user = useRecoilValue(userState);
    return (
        <div style={{ display: 'flex' }}>
            <UserSidebar userName = {user.userEmail}/>
            <div style={{ flexGrow: 1, overflow: 'auto', padding: 0 }}>
                <Outlet />
            </div>
        </div>
    );
}

function AdminDashboard() {
    return <h1>Admin Dashboard</h1>;
}

function UserDashboard() {
    return <h1>User Dashboard</h1>;
}

function InitUser() {
    const setUser = useSetRecoilState(userState);
    const init = async() => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/me`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })

            if (response.data.username) {
                setUser({
                    isLoading: false,
                    userEmail: response.data.username
                })
            } else {
                setUser({
                    isLoading: false,
                    userEmail: null
                })
            }
        } catch (e) {

            setUser({
                isLoading: false,
                userEmail: null
            })
        }
    };

    useEffect(() => {
        init();
    }, []);

    return <></>
}

export default App;
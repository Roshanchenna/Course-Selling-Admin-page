import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from "./components/admin/Signin.jsx";
import Signup from "./components/admin/Signup.jsx";
import AddCourse from "./components/Admin/AddCourse.jsx";
import Courses from "./components/Admin/Courses.jsx";
import Course from "./components/Admin/Course.jsx";
import {Landing} from "./components/Landing.jsx";
import { userState } from "./store/atoms/user.js";
import {
    RecoilRoot,
    useSetRecoilState
} from 'recoil';
import axios from "axios";
import {BASE_URL} from "./config.js";
import {useEffect} from "react";

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
                        <Route path={"/Admin/addcourse"} element={<AddCourse />} />
                        <Route path={"/Admin/course/:courseId"} element={<Course />} />
                        <Route path={"/Admin/courses"} element={<Courses />} />
                        <Route path={"/Admin/signin"} element={<Signin />} />
                        <Route path={"/Admin/signup"} element={<Signup />} />
                        <Route path={"/"} element={<Landing />} />
                    </Routes>
                </Router>
            </div>
        </RecoilRoot>
    );
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
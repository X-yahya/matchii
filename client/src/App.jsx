import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import Login from "./pages/login/Login";
import "./App.css";
import Navbar from "./components/navbar/Navbar"; 
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Gigs from "./pages/Gigs/Gigs"; 
import Gig from "./pages/gig/Gig";
import Orders from "./pages/orders/Orders";
import MyGigs from "./pages/myGigs/MyGig";
import Add from "./pages/add/Add";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message"
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import VerifyOtp from "./pages/verification/VerifyOtp";
import AddProject from "./pages/addProject/AddProject" ; 
import Projects from "./pages/projects/Projects";
import Project from "./pages/project/Project";
import MyProjects from "./pages/myProjects/myProjects";
import Proposals from "./pages/proposal/Proposal";
import ForgotPasswordEmail from "./pages/ForgotPassword/ForgotPassword" ;
import EditGig from "./pages/editGig/EditGig";
import AssignedProjects from "./pages/assignedProjects/AssignedProjects";


function App() {
  const queryClient = new QueryClient()

  const Layout = () => {
    return (
      <>
        <QueryClientProvider client={queryClient}>
        <Navbar />
        <Outlet />
        <Footer />
        </QueryClientProvider>
      </>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/gigs",
          element: <Gigs />
        },
        {
          path: "/gig/:id",
          element: <Gig />
        },
        {
          path : "/edit-gig/:id",
          element: <EditGig />
        },
        {
          path: "/orders",
          element: <Orders />
        },
        {
          path: "/mygigs",
          element: <MyGigs />
        },
        {
          path: "/add",
          element: <Add />
        },
        {
          path: "/messages",
          element: <Messages />
        },
        {
          path: "/message/:id",
          element: <Message /> 
        },
        {
          path: "/profile",
          element: <Profile />
        },
        {
          path: "/verify-otp",
          element: <VerifyOtp />
        },
        { path: "projects", element: <Projects /> },
        { path: "projects/:id", element: <Project /> },
        {path : "projects/myprojects" , element : <MyProjects />},
        {path : "projects/assigned" , element : <AssignedProjects />},
        {path : "projects/add" , element : <AddProject />},
          {
        path: "/proposals",
         element: <Proposals />,
       }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordEmail />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;

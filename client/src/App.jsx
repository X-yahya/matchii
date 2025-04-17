import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Login from './pages/login/Login';
import './App.css';
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Gigs from "./pages/gigs/MyGigs";
import Gig from "./pages/gig/Gig";
import Orders from "./pages/orders/Orders";
import MyGigs from "./pages/gigs/MyGigs";
import Add from "./pages/add/Add";
import Messages from "./pages/messages/Messages";

function App() {
  const Layout = () => {
    return (
      <>
        <Navbar />
        <Outlet />
        <Footer />
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
          element: <Messages /> // Fix typo: "message" to "Messages"
        },
      ]
    },
    {
      path: "/login",
      element: <Login />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;

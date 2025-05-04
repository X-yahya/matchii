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
import Register from "./pages/register/Register";



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
    },
    {
      path: "/register",
      element: <Register />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;

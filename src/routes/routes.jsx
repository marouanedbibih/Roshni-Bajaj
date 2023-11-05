import { createBrowserRouter, Navigate } from "react-router-dom";
// Layouts
import GuestLayout from "../layouts/GuestLayout";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../views/auth/Login";
import UserForm from "../views/users/UserForm";
import CustomerForm from "../views/customers/CustomerForm";
import CustomerShow from "../views/customers/CustomerShow";
import ResumeForm from "../views/resume/ResumeForm";
import Template from "../views/resume/Template";
import Template1 from "../views/resume/template/Template1";
import Template2 from "../views/resume/template/Template2";
import Template3 from "../views/resume/template/Template3";
import Users from "../views/users/Users";
import CustomerLayout from "../layouts/CustomerLayout";
import Customers from "../views/customers/Customers";
import ResumeLayout from "../layouts/ResumeLayout";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      // User Pages
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/create",
        element: <UserForm key="userCreate" />,
      },
      {
        path: "/users/update/:id",
        element: <UserForm key="userUpdate" />,
      },
    ],
  },
  {
    path: "/",
    element: <ResumeLayout />,
    children: [
      {
        path: "/resume",
        element: <ResumeForm />,
      },
      {
        path: "/template",
        element: <Template />,
      },
      {
        path: "/template/1",
        element: <Template1 />,
      },
      {
        path: "/template/2",
        element: <Template2 />,
      },
      {
        path: "/template/3",
        element: <Template3 />,
      },
    ],
  },
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      // Customer Pages
      {
        path: "/customers",
        element: <Customers />,
      },
      {
        path: "/customers/create",
        element: <CustomerForm key="customerCreate" />,
      },
      {
        path: "/customers/update/:id",
        element: <CustomerForm key="customerUpdate" />,
      },
      {
        path: "/customers/:id",
        element: <CustomerShow />,
      },
    ],
  },

  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default routes;

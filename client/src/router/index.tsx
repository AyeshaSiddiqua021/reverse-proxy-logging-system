import { createBrowserRouter } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import { LogDashboardPage, LoginPage, SignupPage, UserDashboardPage } from "@/views/app"
import { Layout } from "@/layout/layout"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <SignupPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout>
          <UserDashboardPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/logs",
    element: (
      <ProtectedRoute>
        <Layout>
          <LogDashboardPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
])

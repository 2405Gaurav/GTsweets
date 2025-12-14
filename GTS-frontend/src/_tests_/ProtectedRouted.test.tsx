// import { render, screen } from "@testing-library/react";
// import { describe, test, expect, vi, beforeEach } from "vitest";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ProtectedRoute } from "../components/ProtectedRoute";
// import * as AuthContext from "../contexts/AuthContext";

// vi.mock("../contexts/AuthContext", async () => {
//   const actual = await vi.importActual("../contexts/AuthContext");
//   return {
//     ...actual,
//     useAuth: vi.fn(),
//   };
// });

// const TestComponent = () => <div>Protected Content</div>;
// const LoginPage = () => <div>Login Page</div>;
// const HomePage = () => <div>Home Page</div>;

// const renderProtectedRoute = (requireAdmin = false) => {
//   return render(
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route
//           path="/protected"
//           element={
//             <ProtectedRoute requireAdmin={requireAdmin}>
//               <TestComponent />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// describe("ProtectedRoute Component Tests", () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//     window.history.pushState({}, "", "/protected");
//   });

//   test("shows loading spinner while authentication is loading", () => {
//     vi.mocked(AuthContext.useAuth).mockReturnValue({
//       user: null,
//       isAuthenticated: false,
//       isLoading: true,
//       isAdmin: false,
//       login: vi.fn(),
//       register: vi.fn(),
//       logout: vi.fn(),
//     });

//     renderProtectedRoute();

//     expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
//     expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
//   });

//   test("redirects to login when user is not authenticated", () => {
//     vi.mocked(AuthContext.useAuth).mockReturnValue({
//       user: null,
//       isAuthenticated: false,
//       isLoading: false,
//       isAdmin: false,
//       login: vi.fn(),
//       register: vi.fn(),
//       logout: vi.fn(),
//     });

//     renderProtectedRoute();

//     expect(screen.getByText("Login Page")).toBeInTheDocument();
//     expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
//   });

//   test("renders protected content when user is authenticated", () => {
//     vi.mocked(AuthContext.useAuth).mockReturnValue({
//       user: { name: "Test User", email: "test@example.com", role: "customer", _id: "user1" },
//       isAuthenticated: true,
//       isLoading: false,
//       isAdmin: false,
//       login: vi.fn(),
//       register: vi.fn(),
//       logout: vi.fn(),
//     });

//     renderProtectedRoute();

//     expect(screen.getByText("Protected Content")).toBeInTheDocument();
//     expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
//   });

//   test("allows admin to access admin-protected route", () => {
//     vi.mocked(AuthContext.useAuth).mockReturnValue({
//       user: { name: "Admin User", email: "admin@example.com", role: "admin", _id: "admin1" },
//       isAuthenticated: true,
//       isLoading: false,
//       isAdmin: true,
//       login: vi.fn(),
//       register: vi.fn(),
//       logout: vi.fn(),
//     });

//     renderProtectedRoute(true);

//     expect(screen.getByText("Protected Content")).toBeInTheDocument();
//   });

//   test("redirects non-admin user to home from admin-protected route", () => {
//     vi.mocked(AuthContext.useAuth).mockReturnValue({
//       user: { name: "Regular User", email: "user@example.com", role: "customer", _id: "user1" },
//       isAuthenticated: true,
//       isLoading: false,
//       isAdmin: false,
//       login: vi.fn(),
//       register: vi.fn(),
//       logout: vi.fn(),
//     });

//     renderProtectedRoute(true);

//     expect(screen.getByText("Home Page")).toBeInTheDocument();
//     expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
//   });

//   test("allows authenticated non-admin user to access non-admin protected route", () => {
//     vi.mocked(AuthContext.useAuth).mockReturnValue({
//       user: { name: "Regular User", email: "user@example.com", role: "customer", _id: "user1" },
//       isAuthenticated: true,
//       isLoading: false,
//       isAdmin: false,
//       login: vi.fn(),
//       register: vi.fn(),
//       logout: vi.fn(),
//     });

//     renderProtectedRoute(false);

//     expect(screen.getByText("Protected Content")).toBeInTheDocument();
//   });

//   test("redirects unauthenticated user from admin route to login", () => {
//     vi.mocked(AuthContext.useAuth).mockReturnValue({
//       user: null,
//       isAuthenticated: false,
//       isLoading: false,
//       isAdmin: false,
//       login: vi.fn(),
//       register: vi.fn(),
//       logout: vi.fn(),
//     });

//     renderProtectedRoute(true);

//     expect(screen.getByText("Login Page")).toBeInTheDocument();
//     expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
//   });

//   test("does not show protected content during loading state", () => {
//     vi.mocked(AuthContext.useAuth).mockReturnValue({
//       user: { name: "Test User", email: "test@example.com", role: "customer", _id: "user1" },
//       isAuthenticated: true,
//       isLoading: true,
//       isAdmin: false,
//       login: vi.fn(),
//       register: vi.fn(),
//       logout: vi.fn(),
//     });

//     renderProtectedRoute();

//     expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
//   });
// });
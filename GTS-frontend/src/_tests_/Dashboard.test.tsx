// import { render, screen, fireEvent } from "@testing-library/react";
// import { describe, test, expect, vi, beforeEach } from "vitest";
// import { Dashboard } from "../pages/Dashboard";
// import * as AuthContext from "../contexts/AuthContext";

// const mockLogout = vi.fn();

// vi.mock("../contexts/AuthContext", async () => {
//   const actual = await vi.importActual("../contexts/AuthContext");
//   return {
//     ...actual,
//     useAuth: vi.fn(),
//   };
// });

// const renderWithAuth = (authValue: {
//   user: { name: string; email: string; role?: string } | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   logout: () => void;
//   isAdmin: boolean;
// }) => {
//   vi.mocked(AuthContext.useAuth).mockReturnValue({
//     ...authValue,
//     login: vi.fn(),
//     register: vi.fn(),
//   } as any);
  
//   render(<Dashboard />);
// };

// describe("Dashboard – User Tests", () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   test("shows loading state", () => {
//     renderWithAuth({
//       user: null,
//       isLoading: true,
//       isAuthenticated: false,
//       logout: mockLogout,
//       isAdmin: false,
//     });

//     expect(screen.getByText(/loading/i)).toBeInTheDocument();
//   });

//   test("renders dashboard for authenticated user", () => {
//     renderWithAuth({
//       user: { name: "Gaurav", email: "gaurav@test.com" },
//       isLoading: false,
//       isAuthenticated: true,
//       logout: mockLogout,
//       isAdmin: false,
//     });

//     expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
//     expect(screen.getByText(/gaurav/i)).toBeInTheDocument();
//   });

//   test("shows not authorized when user is null", () => {
//     renderWithAuth({
//       user: null,
//       isLoading: false,
//       isAuthenticated: false,
//       logout: mockLogout,
//       isAdmin: false,
//     });

//     expect(screen.getByText(/not authorized/i)).toBeInTheDocument();
//   });

//   test("logout button works", () => {
//     renderWithAuth({
//       user: { name: "Gaurav", email: "gaurav@test.com" },
//       isLoading: false,
//       isAuthenticated: true,
//       logout: mockLogout,
//       isAdmin: false,
//     });

//     const logoutButton = screen.getByRole("button", { name: /logout/i });
//     fireEvent.click(logoutButton);
//     expect(mockLogout).toHaveBeenCalledTimes(1);
//   });
// });
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import { describe, test, expect, vi, beforeEach } from "vitest";
// import { Shop } from "../pages/Shop";
// import * as AuthContext from "../contexts/AuthContext";
// import * as CartContext from "../contexts/CartContext";
// import * as ToastContext from "../contexts/ToastContext";
// import { sweetsApi } from "../services/api";

// vi.mock("../contexts/AuthContext", async () => {
//   const actual = await vi.importActual("../contexts/AuthContext");
//   return {
//     ...actual,
//     useAuth: vi.fn(),
//   };
// });

// vi.mock("../contexts/CartContext", async () => {
//   const actual = await vi.importActual("../contexts/CartContext");
//   return {
//     ...actual,
//     useCart: vi.fn(),
//   };
// });

// vi.mock("../contexts/ToastContext", async () => {
//   const actual = await vi.importActual("../contexts/ToastContext");
//   return {
//     ...actual,
//     useToast: vi.fn(),
//   };
// });

// vi.mock("../services/api", () => ({
//   sweetsApi: {
//     getAll: vi.fn(),
//     search: vi.fn(),
//     purchase: vi.fn(),
//   },
// }));

// const mockSweets = [
//   {
//     _id: "1",
//     name: "Chocolate Cake",
//     description: "Delicious chocolate cake",
//     price: 10.99,
//     quantity: 5,
//     category: "cake",
//     imageUrl: "https://example.com/cake.jpg",
//   },
//   {
//     _id: "2",
//     name: "Candy Cane",
//     description: "Sweet candy cane",
//     price: 2.99,
//     quantity: 10,
//     category: "candy",
//     imageUrl: "https://example.com/candy.jpg",
//   },
//   {
//     _id: "3",
//     name: "Dark Chocolate",
//     description: "Premium dark chocolate",
//     price: 15.99,
//     quantity: 3,
//     category: "chocolate",
//     imageUrl: "https://example.com/choco.jpg",
//   },
// ];

// describe("Shop Component Tests", () => {
//   const mockShowToast = vi.fn();
//   const mockAddToCart = vi.fn();

//   beforeEach(() => {
//     vi.clearAllMocks();

//     vi.mocked(AuthContext.useAuth).mockReturnValue({
//       user: { name: "Test User", email: "test@example.com", role: "customer" },
//       isAuthenticated: true,
//       isLoading: false,
//       isAdmin: false,
//       login: vi.fn(),
//       register: vi.fn(),
//       logout: vi.fn(),
//     });

//     vi.mocked(CartContext.useCart).mockReturnValue({
//       cart: [],
//       addToCart: mockAddToCart,
//       removeFromCart: vi.fn(),
//       updateQuantity: vi.fn(),
//       clearCart: vi.fn(),
//       totalItems: 0,
//       totalPrice: 0,
//     });

//     vi.mocked(ToastContext.useToast).mockReturnValue({
//       showToast: mockShowToast,
//     });

//     vi.mocked(sweetsApi.getAll).mockResolvedValue(mockSweets);
//   });

//   test("displays loading spinner initially", () => {
//     render(<Shop />);
//     expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
//   });

//   test("displays all sweets after loading", async () => {
//     render(<Shop />);

//     await waitFor(() => {
//       expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
//       expect(screen.getByText("Candy Cane")).toBeInTheDocument();
//       expect(screen.getByText("Dark Chocolate")).toBeInTheDocument();
//     });
//   });

//   test("filters sweets by category", async () => {
//     render(<Shop />);

//     await waitFor(() => {
//       expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
//     });

//     const cakeButton = screen.getByRole("button", { name: /cake/i });
//     fireEvent.click(cakeButton);

//     await waitFor(() => {
//       expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
//       expect(screen.queryByText("Candy Cane")).not.toBeInTheDocument();
//       expect(screen.queryByText("Dark Chocolate")).not.toBeInTheDocument();
//     });
//   });

//   test("sorts sweets by price low to high", async () => {
//     render(<Shop />);

//     await waitFor(() => {
//       expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
//     });

//     const sortSelect = screen.getByRole("combobox");
//     fireEvent.change(sortSelect, { target: { value: "price-low" } });

//     await waitFor(() => {
//       const sweetCards = screen.getAllByText(/\$/);
//       expect(sweetCards[0]).toHaveTextContent("$2.99");
//     });
//   });

//   test("sorts sweets by price high to low", async () => {
//     render(<Shop />);

//     await waitFor(() => {
//       expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
//     });

//     const sortSelect = screen.getByRole("combobox");
//     fireEvent.change(sortSelect, { target: { value: "price-high" } });

//     await waitFor(() => {
//       const sweetCards = screen.getAllByText(/\$/);
//       expect(sweetCards[0]).toHaveTextContent("$15.99");
//     });
//   });

//   test("adds item to cart when authenticated", async () => {
//     mockAddToCart.mockResolvedValue({ success: true });

//     render(<Shop />);

//     await waitFor(() => {
//       expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
//     });

//     const addToCartButtons = screen.getAllByRole("button", { name: /add cart/i });
//     fireEvent.click(addToCartButtons[0]);

//     await waitFor(() => {
//       expect(mockAddToCart).toHaveBeenCalledWith("1", 1);
//       expect(mockShowToast).toHaveBeenCalledWith("Added to cart successfully!", "success");
//     });
//   });

//   test("shows error when unauthenticated user tries to add to cart", async () => {
//     vi.mocked(AuthContext.useAuth).mockReturnValue({
//       user: null,
//       isAuthenticated: false,
//       isLoading: false,
//       isAdmin: false,
//       login: vi.fn(),
//       register: vi.fn(),
//       logout: vi.fn(),
//     });

//     render(<Shop />);

//     await waitFor(() => {
//       expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
//     });

//     const addToCartButtons = screen.getAllByRole("button", { name: /add cart/i });
//     fireEvent.click(addToCartButtons[0]);

//     await waitFor(() => {
//       expect(mockShowToast).toHaveBeenCalledWith("Please login to add items to cart", "error");
//     });
//   });

//   test("prevents admin from adding to cart", async () => {
//     vi.mocked(AuthContext.useAuth).mockReturnValue({
//       user: { name: "Admin", email: "admin@example.com", role: "admin" },
//       isAuthenticated: true,
//       isLoading: false,
//       isAdmin: true,
//       login: vi.fn(),
//       register: vi.fn(),
//       logout: vi.fn(),
//     });

//     render(<Shop />);

//     await waitFor(() => {
//       expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
//     });
//   });

//   test("displays no sweets message when filtered results are empty", async () => {
//     render(<Shop />);

//     await waitFor(() => {
//       expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
//     });

//     const lollipopButton = screen.getByRole("button", { name: /lollipop/i });
//     fireEvent.click(lollipopButton);

//     await waitFor(() => {
//       expect(screen.getByText(/no sweets found/i)).toBeInTheDocument();
//     });
//   });

//   test("handles API error gracefully", async () => {
//     vi.mocked(sweetsApi.getAll).mockRejectedValue(new Error("API Error"));

//     render(<Shop />);

//     await waitFor(() => {
//       expect(mockShowToast).toHaveBeenCalledWith("Failed to load sweets", "error");
//     });
//   });
// });
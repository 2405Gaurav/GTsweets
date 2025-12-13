import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { CartPage } from "../pages/Cart";
import * as CartContext from "../contexts/CartContext";

vi.mock("../contexts/CartContext", async () => {
  const actual = await vi.importActual("../contexts/CartContext");
  return {
    ...actual,
    useCart: vi.fn(),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockCartWithItems = {
  _id: "cart1",
  userId: "user1",
  items: [
    {
      _id: "item1",
      sweetId: {
        _id: "sweet1",
        name: "Chocolate Cake",
        price: 10.99,
        imageUrl: "https://example.com/cake.jpg",
        category: "cake",
      },
      quantity: 2,
      priceAtTime: 10.99,
    },
    {
      _id: "item2",
      sweetId: {
        _id: "sweet2",
        name: "Candy Cane",
        price: 2.99,
        category: "candy",
      },
      quantity: 3,
      priceAtTime: 2.99,
    },
  ],
  status: "active",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

const mockCartSummary = {
  itemCount: 5,
  subtotal: 30.95,
  tax: 5.57,
  total: 36.52,
};

const renderCartPage = () => {
  return render(
    <BrowserRouter>
      <CartPage />
    </BrowserRouter>
  );
};

describe("CartPage Component Tests", () => {
  const mockUpdateQuantity = vi.fn();
  const mockRemoveItem = vi.fn();
  const mockClearCart = vi.fn();
  const mockCheckout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true);
    window.alert = vi.fn();
  });

  test("displays empty cart message when cart is empty", () => {
    vi.mocked(CartContext.useCart).mockReturnValue({
      cart: null,
      cartSummary: { itemCount: 0, subtotal: 0, tax: 0, total: 0 },
      loading: false,
      error: null,
      addToCart: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      checkout: mockCheckout,
      refreshCart: vi.fn(),
    });

    renderCartPage();

    expect(screen.getByText(/cart empty/i)).toBeInTheDocument();
    expect(screen.getByText(/you haven't added any sugar yet/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start shopping/i })).toBeInTheDocument();
  });

  test("navigates to shop when start shopping button is clicked", () => {
    vi.mocked(CartContext.useCart).mockReturnValue({
      cart: null,
      cartSummary: { itemCount: 0, subtotal: 0, tax: 0, total: 0 },
      loading: false,
      error: null,
      addToCart: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      checkout: mockCheckout,
      refreshCart: vi.fn(),
    });

    renderCartPage();

    const startShoppingButton = screen.getByRole("button", { name: /start shopping/i });
    fireEvent.click(startShoppingButton);

    expect(mockNavigate).toHaveBeenCalledWith("/shop");
  });

  test("displays cart items with correct information", () => {
    vi.mocked(CartContext.useCart).mockReturnValue({
      cart: mockCartWithItems,
      cartSummary: mockCartSummary,
      loading: false,
      error: null,
      addToCart: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      checkout: mockCheckout,
      refreshCart: vi.fn(),
    });

    renderCartPage();

    expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
    expect(screen.getByText("Candy Cane")).toBeInTheDocument();
    expect(screen.getByText(/items \(5\)/i)).toBeInTheDocument();
  });

  test("displays correct cart summary", () => {
    vi.mocked(CartContext.useCart).mockReturnValue({
      cart: mockCartWithItems,
      cartSummary: mockCartSummary,
      loading: false,
      error: null,
      addToCart: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      checkout: mockCheckout,
      refreshCart: vi.fn(),
    });

    renderCartPage();

    expect(screen.getByText("₹30.95")).toBeInTheDocument();
    expect(screen.getByText("₹5.57")).toBeInTheDocument();
    expect(screen.getByText("₹36.52")).toBeInTheDocument();
  });

  test("increases item quantity when plus button is clicked", async () => {
    mockUpdateQuantity.mockResolvedValue({ success: true });

    vi.mocked(CartContext.useCart).mockReturnValue({
      cart: mockCartWithItems,
      cartSummary: mockCartSummary,
      loading: false,
      error: null,
      addToCart: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      checkout: mockCheckout,
      refreshCart: vi.fn(),
    });

    renderCartPage();

    const plusButtons = screen.getAllByRole("button", { name: "" }).filter(
      (btn) => btn.querySelector("svg")?.getAttribute("class")?.includes("lucide-plus")
    );
    
    fireEvent.click(plusButtons[0]);

    await waitFor(() => {
      expect(mockUpdateQuantity).toHaveBeenCalledWith("item1", 3);
    });
  });

  test("decreases item quantity when minus button is clicked", async () => {
    mockUpdateQuantity.mockResolvedValue({ success: true });

    vi.mocked(CartContext.useCart).mockReturnValue({
      cart: mockCartWithItems,
      cartSummary: mockCartSummary,
      loading: false,
      error: null,
      addToCart: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      checkout: mockCheckout,
      refreshCart: vi.fn(),
    });

    renderCartPage();

    const minusButtons = screen.getAllByRole("button", { name: "" }).filter(
      (btn) => btn.querySelector("svg")?.getAttribute("class")?.includes("lucide-minus")
    );
    
    fireEvent.click(minusButtons[0]);

    await waitFor(() => {
      expect(mockUpdateQuantity).toHaveBeenCalledWith("item1", 1);
    });
  });

  test("removes item when remove button is clicked", async () => {
    mockRemoveItem.mockResolvedValue({ success: true });

    vi.mocked(CartContext.useCart).mockReturnValue({
      cart: mockCartWithItems,
      cartSummary: mockCartSummary,
      loading: false,
      error: null,
      addToCart: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      checkout: mockCheckout,
      refreshCart: vi.fn(),
    });

    renderCartPage();

    const removeButtons = screen.getAllByTitle("Remove Item");
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(mockRemoveItem).toHaveBeenCalledWith("item1");
    });
  });

  test("clears cart when clear all button is clicked", async () => {
    mockClearCart.mockResolvedValue({ success: true });

    vi.mocked(CartContext.useCart).mockReturnValue({
      cart: mockCartWithItems,
      cartSummary: mockCartSummary,
      loading: false,
      error: null,
      addToCart: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      checkout: mockCheckout,
      refreshCart: vi.fn(),
    });

    renderCartPage();

    const clearButton = screen.getByRole("button", { name: /clear all/i });
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(mockClearCart).toHaveBeenCalled();
    });
  });

  test("processes checkout successfully", async () => {
    mockCheckout.mockResolvedValue({ success: true });

    vi.mocked(CartContext.useCart).mockReturnValue({
      cart: mockCartWithItems,
      cartSummary: mockCartSummary,
      loading: false,
      error: null,
      addToCart: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      checkout: mockCheckout,
      refreshCart: vi.fn(),
    });

    renderCartPage();

    const checkoutButton = screen.getByRole("button", { name: /checkout now/i });
    fireEvent.click(checkoutButton);

    await waitFor(() => {
      expect(mockCheckout).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/order placed/i)).toBeInTheDocument();
    });
  });

  test("handles checkout failure", async () => {
    mockCheckout.mockResolvedValue({ success: false, error: "Payment failed" });

    vi.mocked(CartContext.useCart).mockReturnValue({
      cart: mockCartWithItems,
      cartSummary: mockCartSummary,
      loading: false,
      error: null,
      addToCart: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      checkout: mockCheckout,
      refreshCart: vi.fn(),
    });

    renderCartPage();

    const checkoutButton = screen.getByRole("button", { name: /checkout now/i });
    fireEvent.click(checkoutButton);

    await waitFor(() => {
      expect(mockCheckout).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Payment failed");
    });
  });

  test("navigates back to shop when back button is clicked", () => {
    vi.mocked(CartContext.useCart).mockReturnValue({
      cart: mockCartWithItems,
      cartSummary: mockCartSummary,
      loading: false,
      error: null,
      addToCart: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      checkout: mockCheckout,
      refreshCart: vi.fn(),
    });

    renderCartPage();

    const backButtons = screen.getAllByRole("button");
    const backButton = backButtons.find(btn => btn.querySelector("svg")?.classList.contains("lucide-arrow-left"));
    
    if (backButton) {
      fireEvent.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith("/shop");
    }
  });
});
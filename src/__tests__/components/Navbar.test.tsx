import "@testing-library/jest-dom";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Navbar from "../../app/(app)/(home)/_components/Navbar";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface SidebarProps {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock the Sidebar component for integration testing
jest.mock("../../app/(app)/(home)/_components/Sidebar", () => {
  return function MockSidebar({ open, onOpenChange, items }: SidebarProps) {
    return (
      <div data-testid="sidebar" data-open={open}>
        {items.map((item: NavbarItem) => (
          <div key={item.href} data-testid="sidebar-item">
            {item.children}
          </div>
        ))}
        <button onClick={() => onOpenChange(false)}>Close Sidebar</button>
      </div>
    );
  };
});

describe("Navbar Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe("Mobile Menu Integration", () => {
    const getMobileMenuButton = () => {
      const allButtons = screen.getAllByRole("button");
      return allButtons.find(
        (button) =>
          button.querySelector("svg.lucide-menu") ||
          button.querySelector('svg[class*="lucide-menu"]')
      );
    };

    // Integration Test: Tests interaction between Navbar and Sidebar components
    it("should toggle sidebar when mobile menu button is clicked", () => {
      render(<Navbar />);

      const mobileMenuButton = getMobileMenuButton();
      expect(mobileMenuButton).toBeInTheDocument();

      const sidebar = screen.getByTestId("sidebar");

      // Initially sidebar should be closed
      expect(sidebar).toHaveAttribute("data-open", "false");

      // Click menu button to open sidebar
      fireEvent.click(mobileMenuButton!);
      expect(sidebar).toHaveAttribute("data-open", "true");
    });

    // Integration Test: Tests how Navbar passes data to Sidebar
    it("should pass navigation items to sidebar component", () => {
      render(<Navbar />);

      const sidebarItems = screen.getAllByTestId("sidebar-item");
      expect(sidebarItems).toHaveLength(5);

      const itemTexts = sidebarItems.map((item) => item.textContent);
      expect(itemTexts).toEqual([
        "Home",
        "About",
        "Features",
        "Pricing",
        "Contact",
      ]);
    });

    // Integration Test: Tests bidirectional component communication
    it("should close sidebar when onOpenChange is called", () => {
      render(<Navbar />);

      const mobileMenuButton = getMobileMenuButton();
      const sidebar = screen.getByTestId("sidebar");

      // Open sidebar
      fireEvent.click(mobileMenuButton!);
      expect(sidebar).toHaveAttribute("data-open", "true");

      // Close sidebar using the callback
      const closeSidebarButton = screen.getByText("Close Sidebar");
      fireEvent.click(closeSidebarButton);
      expect(sidebar).toHaveAttribute("data-open", "false");
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure", () => {
      render(<Navbar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });

    it("should maintain focus management for keyboard navigation", () => {
      render(<Navbar />);
      const homeLink = screen.getByRole("link", { name: /home/i });
      homeLink.focus();
      expect(homeLink).toHaveFocus();
    });
  });
});

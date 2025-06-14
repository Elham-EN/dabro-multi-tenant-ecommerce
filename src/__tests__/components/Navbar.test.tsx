import "@testing-library/jest-dom";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { usePathname } from "next/navigation";
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

// Mock Next.js navigation hooks
// This tells Jest to create a fake version of Next.js's "usePathname" hook
// instead of using the real one during tests. This lets us control what
// pathname (URL) our component thinks it's on, so we can test how the
// navigation highlights different pages without actually changing URLs.
jest.mock("next/navigation", () => ({
  // This creates a controllable fake function
  usePathname: jest.fn(),
}));

// Mock the Sidebar component since it's a separate component
// Test ONLY the Navbar - not the Sidebar's internal behavior
// We create a fake/simplified version of the Sidebar component because:
// 1. We only want to test the Navbar, not the complex Sidebar behavior
// 2. The real Sidebar might have animations, overlays, or other complex UI
//    that would make our Navbar tests slow and unreliable
// 3. We can control exactly what the fake Sidebar does to test our Navbar's
//    interaction with it (like opening/closing)
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
  const mockUsePathname = usePathname as jest.MockedFunction<
    typeof usePathname
  >;

  beforeEach(() => {
    // Reset pathname mock to home before each test
    // This ensures every test starts fresh on the "/" page, so tests don't
    // accidentally affect each other. Without this, if one test sets the path
    // to "/about", the next test might still think it's on "/about" instead
    // of starting clean.
    mockUsePathname.mockReturnValue("/");
  });

  afterEach(() => {
    // Clean up after each test to prevent memory leaks and test interference
    // Resets all mock function call history and return value
    jest.clearAllMocks();
    // Removes rendered components from the DOM to free up memory
    cleanup();
  });

  describe("Brand Logo and Navigation", () => {
    // Test case 1:
    it("should render the Dabro brand logo with correct link", () => {
      render(<Navbar />);

      const brandLink = screen.getByRole("link", { name: /dabro/i });
      expect(brandLink).toBeInTheDocument();
      expect(brandLink).toHaveAttribute("href", "/");
    });

    // Test case 2:
    it("should render all navigation items in desktop view", () => {
      render(<Navbar />);

      // Check all navigation links are present
      expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /features/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /pricing/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /contact/i })
      ).toBeInTheDocument();
    });

    // Test case 3:
    it("should have correct href attributes for navigation links", () => {
      render(<Navbar />);

      expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
        "href",
        "/"
      );
      expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute(
        "href",
        "/about"
      );
      expect(screen.getByRole("link", { name: /features/i })).toHaveAttribute(
        "href",
        "/features"
      );
      expect(screen.getByRole("link", { name: /pricing/i })).toHaveAttribute(
        "href",
        "/pricing"
      );
      expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute(
        "href",
        "/contact"
      );
    });
  });

  describe("Active Navigation State", () => {
    it("should highlight the home navigation item when on home page", () => {
      // Tell the fake usePathname to return "/"
      mockUsePathname.mockReturnValue("/");
      render(<Navbar />);

      const homeLink = screen.getByRole("link", { name: /home/i });
      // Check if the active styling classes are applied
      expect(homeLink).toHaveClass("bg-black", "text-white");
    });

    it("should highlight the about navigation item when on about page", () => {
      // Tell the fake usePathname to return "/about"
      mockUsePathname.mockReturnValue("/about");
      render(<Navbar />);

      const aboutLink = screen.getByRole("link", { name: /about/i });
      expect(aboutLink).toHaveClass("bg-black", "text-white");

      // Ensure other links are not active
      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).not.toHaveClass("bg-black", "text-white");
    });

    it("should highlight features navigation item when on features page", () => {
      // Tell the fake usePathname to return "/features"
      mockUsePathname.mockReturnValue("/features");
      render(<Navbar />);

      const featuresLink = screen.getByRole("link", { name: /features/i });
      expect(featuresLink).toHaveClass("bg-black", "text-white");
    });

    it("should highlight pricing navigation item when on pricing page", () => {
      // Tell the fake usePathname to return "/pricing"
      mockUsePathname.mockReturnValue("/pricing");
      render(<Navbar />);

      const pricingLink = screen.getByRole("link", { name: /pricing/i });
      expect(pricingLink).toHaveClass("bg-black", "text-white");
    });

    it("should highlight contact navigation item when on contact page", () => {
      // Tell the fake usePathname to return "/contact"
      mockUsePathname.mockReturnValue("/contact");
      render(<Navbar />);

      const contactLink = screen.getByRole("link", { name: /contact/i });
      expect(contactLink).toHaveClass("bg-black", "text-white");
    });
  });

  describe("Authentication Buttons", () => {
    it("should render log in button with correct link", () => {
      render(<Navbar />);

      const loginButton = screen.getByRole("link", { name: /log in/i });
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toHaveAttribute("href", "/sign-in");
    });

    it("should render start selling button with correct link", () => {
      render(<Navbar />);

      const signUpButton = screen.getByRole("link", { name: /start selling/i });
      expect(signUpButton).toBeInTheDocument();
      expect(signUpButton).toHaveAttribute("href", "/sign-up");
    });

    it("should apply correct styling to authentication buttons", () => {
      render(<Navbar />);

      const loginButton = screen.getByRole("link", { name: /log in/i });
      const signUpButton = screen.getByRole("link", { name: /start selling/i });

      // Check that login button has secondary styling
      expect(loginButton.parentElement).toHaveClass(
        "bg-white",
        "hover:bg-pink-400"
      );

      // Check that sign up button has primary styling
      expect(signUpButton.parentElement).toHaveClass(
        "bg-black",
        "text-white",
        "hover:bg-pink-400"
      );
    });
  });

  describe("Mobile Menu Functionality", () => {
    const getMobileMenuButton = () => {
      const allButtons = screen.getAllByRole("button");
      return allButtons.find(
        (button) =>
          button.querySelector("svg.lucide-menu") ||
          button.querySelector('svg[class*="lucide-menu"]')
      );
    };

    it("should render mobile menu button with menu icon", () => {
      render(<Navbar />);

      const mobileMenuButton = getMobileMenuButton();
      expect(mobileMenuButton).toBeInTheDocument();
    });

    // Integration Test:
    // Tests interaction between Navbar and Sidebar components
    // Tests the complete flow: click button → sidebar state changes
    it("should toggle sidebar when mobile menu button is clicked", () => {
      render(<Navbar />);

      const mobileMenuButton = getMobileMenuButton();
      expect(mobileMenuButton).toBeInTheDocument();

      // Finds our fake/mocked version, not the actual Sidebar component.
      const sidebar = screen.getByTestId("sidebar");

      // Initially sidebar should be closed
      expect(sidebar).toHaveAttribute("data-open", "false");

      // Click menu button to open sidebar
      fireEvent.click(mobileMenuButton!);
      expect(sidebar).toHaveAttribute("data-open", "true");
    });

    // Integration Test:
    // Tests how Navbar passes data (props) to Sidebar
    // Verifies the communication between two components
    it("should pass navigation items to sidebar component", () => {
      render(<Navbar />);

      const sidebarItems = screen.getAllByTestId("sidebar-item");
      // The mocked Sidebar receives the real props that the actual Navbar component
      // passes to it. The Navbar doesn't know it's talking to a fake Sidebar. It
      // sends the real navigation items, and our mock displays them so we can test
      // that the Navbar is passing the correct data.
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

    // Integration Test:
    // Tests the callback interaction between Sidebar and Navbar
    // Tests bidirectional component communication
    it("should close sidebar when onOpenChange is called", () => {
      render(<Navbar />);

      const mobileMenuButton = getMobileMenuButton();
      const sidebar = screen.getByTestId("sidebar");

      // Open sidebar
      fireEvent.click(mobileMenuButton!);
      expect(sidebar).toHaveAttribute("data-open", "true");

      // Close sidebar using the mock close button
      const closeSidebarButton = screen.getByText("Close Sidebar");
      fireEvent.click(closeSidebarButton);
      expect(sidebar).toHaveAttribute("data-open", "false");
    });
  });

  describe("Responsive Behavior", () => {
    it("should hide desktop navigation on mobile screens", () => {
      render(<Navbar />);

      // Desktop navigation should have lg:flex class (hidden on mobile)
      const desktopNav = screen
        .getByRole("link", { name: /home/i })
        .closest("div");
      expect(desktopNav).toHaveClass("lg:flex", "hidden");
    });

    it("should hide authentication buttons on mobile screens", () => {
      render(<Navbar />);

      const authSection = screen
        .getByRole("link", { name: /log in/i })
        .closest("div");
      expect(authSection).toHaveClass("hidden", "lg:flex");
    });

    it("should show mobile menu button only on mobile screens", () => {
      render(<Navbar />);

      const allButtons = screen.getAllByRole("button");
      const mobileMenuButton = allButtons.find(
        (button) =>
          button.querySelector("svg.lucide-menu") ||
          button.querySelector('svg[class*="lucide-menu"]')
      );

      const mobileMenuSection = mobileMenuButton?.closest("div");
      expect(mobileMenuSection).toHaveClass("flex", "lg:hidden");
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure", () => {
      render(<Navbar />);

      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });

    it("should have accessible button for mobile menu", () => {
      render(<Navbar />);

      const allButtons = screen.getAllByRole("button");
      const mobileMenuButton = allButtons.find(
        (button) =>
          button.querySelector("svg.lucide-menu") ||
          button.querySelector('svg[class*="lucide-menu"]')
      );

      expect(mobileMenuButton).toBeInTheDocument();
      expect(mobileMenuButton).toBeEnabled();
    });

    it("should maintain focus management for keyboard navigation", () => {
      render(<Navbar />);

      const homeLink = screen.getByRole("link", { name: /home/i });
      homeLink.focus();
      expect(homeLink).toHaveFocus();
    });
  });

  describe("Navigation Items Configuration", () => {
    it("should maintain consistent navigation structure", () => {
      render(<Navbar />);

      const expectedItems = [
        { text: "Home", href: "/" },
        { text: "About", href: "/about" },
        { text: "Features", href: "/features" },
        { text: "Pricing", href: "/pricing" },
        { text: "Contact", href: "/contact" },
      ];

      expectedItems.forEach(({ text, href }) => {
        const link = screen.getByRole("link", { name: new RegExp(text, "i") });
        expect(link).toHaveAttribute("href", href);
      });
    });
  });
});

// All other tests are Unit tests because they:
// Test individual Navbar behaviors in isolation
// Don't test component-to-component interactions
// Focus on single responsibilities (rendering, styling, links, etc.)

// Why these 3 are Integration:
// They test how two components work together (Navbar + Sidebar), even though we're
// using a mocked Sidebar.
// The integration is about testing the contract/interface between components -
// how they pass data and communicate with each other.

// Why it's mostly Unit:
// We mocked the Sidebar component (isolated the Navbar)
// We mocked usePathname hook (controlled external dependency)
// We're testing the Navbar's behavior in isolation from real dependencies

// True Integration testing would use the real Sidebar component and real Next.js
// routing, testing how they actually work together in a real environment.

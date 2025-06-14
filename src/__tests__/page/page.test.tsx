import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "../../app/(app)/(home)/page";

describe("Page", () => {
  it("should render the button in the DOM", () => {
    render(<Page />);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });
});

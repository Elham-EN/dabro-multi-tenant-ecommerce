import { RefObject } from "react";

// Dropdown always appears in the correct spot relative to the button
function useDropdownPosition(ref: RefObject<HTMLDivElement | null>) {
  const getDropdownPosition = () => {
    // If we can't detect that div element, then we don't try putting
    // in a special position, just return the default
    if (!ref.current) return { top: 0, left: 0 };

    // Providing information about the size of an element and
    // its position relative to the viewport
    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; // (w-60 = 15rem = 240px)
    // Calculate the initial position:
    // rect.left = Distance from left edge of visible screen
    // window.scrollX = How far the user scrolled horizontally
    // rect.left + window.scrollX = Actual distance from left edge
    // of entire webpage
    let left = rect.left + window.scrollX;
    // rect.top = Distance from bottom of visible screen
    // window.scrollY = How far the user scrolled vertically
    // rect.top + window.scrollY = Actual distance from bottom of
    // entire webpage
    const top = rect.bottom + window.scrollY;

    // Check if dropdown would go off the right edge of the viewport
    if (left + dropdownWidth > window.innerWidth) {
      // If dropdown extends past screen width, position it to the left of
      // the button
      left = rect.right + window.scrollX - dropdownWidth;
      // If still off-screen: Even on the left side, is it still too far
      // left?", place it at the right edge with padding
      if (left < 0) {
        // innerWidth - width of the window's layout viewport in pixels
        left = window.innerWidth - dropdownWidth - 16;
      }
    }
    // Ensure dropdown doesn't go off left edge
    if (left < 0) {
      left = 16; // Keep 16px padding from left edge
    }
    return { top, left };
  };

  return { getDropdownPosition };
}

export default useDropdownPosition;

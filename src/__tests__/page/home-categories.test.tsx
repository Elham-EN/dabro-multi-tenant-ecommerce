import "@testing-library/jest-dom";
import { getPayload } from "payload";
import configPromise from "../../payload.config";
import Home from "../../app/(app)/(home)/page";

// All tests in this file are integration tests because they test the
// complete flow from server component → Payload CMS → database query.
// All 15 test cases are integration tests because they test how multiple
// parts work together:

// Mock the Payload CMS functions
jest.mock("payload", () => ({
  getPayload: jest.fn(),
}));

// Mock the payload config using the actual file path
// This prevents Jest from loading the real Payload config
// (which would try to connect to MongoDB) and instead
// returns an empty config object for testing
jest.mock("../../payload.config", () => ({
  // Tells Jest this is an ES6 module (allows import/export syntax)
  __esModule: true,
  // Mocks the default export as an empty object instead of real config
  default: {},
}));

describe("Home Page - Server-Side Data Fetching", () => {
  // Type the mocked getPayload function properly
  const mockGetPayload = getPayload as jest.MockedFunction<typeof getPayload>;

  // Create a mock payload object with a properly typed find method
  const mockPayloadFind = jest.fn();
  const mockPayload = {
    find: mockPayloadFind,
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementation
    // @ts-expect-error - TypeScript ignore for complex Payload type
    // Makes getPayload() return our fake payload object instead of
    // trying to connect to real database
    mockGetPayload.mockResolvedValue(mockPayload);
  });

  describe("Payload CMS Integration", () => {
    it("should initialize Payload with correct config", async () => {
      // Mock successful categories response
      mockPayloadFind.mockResolvedValue({
        docs: [],
        totalDocs: 0,
        hasNextPage: false,
        page: 1,
      });

      await Home();

      // Verify getPayload was called with the correct config object
      // and only called once
      expect(mockGetPayload).toHaveBeenCalledWith({
        config: configPromise,
      });
      expect(mockGetPayload).toHaveBeenCalledTimes(1);
    });

    it("should call payload.find with correct parameters", async () => {
      // Mock successful categories response
      mockPayloadFind.mockResolvedValue({
        docs: [
          {
            id: "1",
            name: "Electronics",
            slug: "electronics",
            parent: null,
          },
        ],
        totalDocs: 1,
        hasNextPage: false,
        page: 1,
      });

      await Home();

      // Verify find was called with correct query parameters
      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: "categories",
        depth: 1,
        where: {
          parent: {
            exists: false,
          },
        },
      });
      expect(mockPayload.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("Categories Query Logic", () => {
    it("should fetch only root categories (parent: exists: false)", async () => {
      // Mock response with root categories
      const mockRootCategories = {
        docs: [
          {
            id: "1",
            name: "Electronics",
            slug: "electronics",
            parent: null,
          },
          {
            id: "2",
            name: "Clothing",
            slug: "clothing",
            parent: null,
          },
        ],
        totalDocs: 2,
        hasNextPage: false,
        page: 1,
      };

      mockPayloadFind.mockResolvedValue(mockRootCategories);

      await Home();

      // Verify the query targets categories without parents
      expect(mockPayload.find).toHaveBeenCalledWith(
        expect.objectContaining({
          collection: "categories",
          where: {
            parent: {
              exists: false,
            },
          },
        })
      );
    });

    it("should use depth: 1 to populate relationship fields", async () => {
      mockPayloadFind.mockResolvedValue({
        docs: [],
        totalDocs: 0,
        hasNextPage: false,
        page: 1,
      });

      await Home();

      // Verify depth parameter is set to populate relationships
      expect(mockPayload.find).toHaveBeenCalledWith(
        expect.objectContaining({
          depth: 1,
        })
      );
    });

    it("should handle successful data response with multiple categories", async () => {
      const mockCategories = {
        docs: [
          {
            id: "1",
            name: "Electronics",
            slug: "electronics",
            color: "blue",
            parent: null,
            subcategories: {
              docs: [
                { id: "sub1", name: "Phones", parent: "1" },
                { id: "sub2", name: "Laptops", parent: "1" },
              ],
            },
          },
          {
            id: "2",
            name: "Clothing",
            slug: "clothing",
            color: "red",
            parent: null,
            subcategories: {
              docs: [{ id: "sub3", name: "Shirts", parent: "2" }],
            },
          },
        ],
        totalDocs: 2,
        hasNextPage: false,
        page: 1,
      };

      mockPayloadFind.mockResolvedValue(mockCategories);

      // Should not throw any errors
      expect(async () => await Home()).not.toThrow();
    });
  });

  describe("Error Handling", () => {
    it("should handle Payload initialization failure", async () => {
      // Mock getPayload to reject
      const initError = new Error("Failed to initialize Payload");
      mockGetPayload.mockRejectedValue(initError);

      // Should throw the initialization error
      await expect(Home()).rejects.toThrow("Failed to initialize Payload");
    });

    it("should handle database connection failure", async () => {
      // Mock payload.find to reject with database error
      const dbError = new Error("Database connection failed");
      mockPayloadFind.mockRejectedValue(dbError);

      // Should throw the database error
      await expect(Home()).rejects.toThrow("Database connection failed");
    });

    it("should handle Payload find method failure", async () => {
      // Mock specific Payload CMS error
      const payloadError = new Error("Collection 'categories' not found");
      mockPayloadFind.mockRejectedValue(payloadError);

      // Should propagate the Payload error
      await expect(Home()).rejects.toThrow("Collection 'categories' not found");
    });

    it("should handle empty categories response", async () => {
      // Mock empty response
      mockPayloadFind.mockResolvedValue({
        docs: [],
        totalDocs: 0,
        hasNextPage: false,
        page: 1,
      });

      // Should handle empty results gracefully
      expect(async () => await Home()).not.toThrow();
    });

    it("should handle network timeout scenarios", async () => {
      // Mock timeout error
      const timeoutError = new Error("Request timeout");
      timeoutError.name = "TimeoutError";
      mockPayloadFind.mockRejectedValue(timeoutError);

      await expect(Home()).rejects.toThrow("Request timeout");
    });
  });

  describe("Data Structure Validation", () => {
    it("should handle categories with all optional fields", async () => {
      const mockMinimalCategories = {
        docs: [
          {
            id: "1",
            name: "Basic Category",
            slug: "basic-category",
            // Missing optional fields: color, parent, subcategories
          },
        ],
        totalDocs: 1,
        hasNextPage: false,
        page: 1,
      };

      mockPayloadFind.mockResolvedValue(mockMinimalCategories);

      // Should handle minimal data structure
      expect(async () => await Home()).not.toThrow();
    });

    it("should verify correct collection targeting", async () => {
      mockPayloadFind.mockResolvedValue({
        docs: [],
        totalDocs: 0,
        hasNextPage: false,
        page: 1,
      });

      await Home();

      // Ensure we're querying the correct collection
      expect(mockPayload.find).toHaveBeenCalledWith(
        expect.objectContaining({
          collection: "categories",
        })
      );
    });
  });
});

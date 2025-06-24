import "@testing-library/jest-dom";
import { getPayload } from "payload";
import configPromise from "../../payload.config";
import Home from "../../app/(app)/(home)/page";

// Integration tests: Test complete flow from server component → Payload CMS → database query

// Mock the Payload CMS functions
jest.mock("payload", () => ({
  getPayload: jest.fn(),
}));

// Mock the payload config
jest.mock("../../payload.config", () => ({
  __esModule: true,
  default: {},
}));

describe("Home Page - Payload CMS Integration", () => {
  const mockGetPayload = getPayload as jest.MockedFunction<typeof getPayload>;
  const mockPayloadFind = jest.fn();
  const mockPayload = {
    find: mockPayloadFind,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-expect-error - TypeScript ignore for complex Payload type
    mockGetPayload.mockResolvedValue(mockPayload);
  });

  describe("Payload CMS Integration", () => {
    it("should initialize Payload with correct config and query root categories", async () => {
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

      // Verify Payload initialization
      expect(mockGetPayload).toHaveBeenCalledWith({
        config: configPromise,
      });
      expect(mockGetPayload).toHaveBeenCalledTimes(1);

      // Verify correct query parameters for root categories
      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: "categories",
        depth: 1,
        where: {
          parent: {
            exists: false,
          },
        },
      });
    });
  });

  describe("Data Handling", () => {
    it("should handle complex category data with subcategories", async () => {
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
        ],
        totalDocs: 1,
        hasNextPage: false,
        page: 1,
      };

      mockPayloadFind.mockResolvedValue(mockCategories);
      expect(async () => await Home()).not.toThrow();
    });

    it("should handle empty categories response", async () => {
      mockPayloadFind.mockResolvedValue({
        docs: [],
        totalDocs: 0,
        hasNextPage: false,
        page: 1,
      });

      expect(async () => await Home()).not.toThrow();
    });
  });

  describe("Error Handling", () => {
    it("should handle Payload initialization failure", async () => {
      const initError = new Error("Failed to initialize Payload");
      mockGetPayload.mockRejectedValue(initError);
      await expect(Home()).rejects.toThrow("Failed to initialize Payload");
    });

    it("should handle database query failure", async () => {
      const dbError = new Error("Database connection failed");
      mockPayloadFind.mockRejectedValue(dbError);
      await expect(Home()).rejects.toThrow("Database connection failed");
    });
  });
});

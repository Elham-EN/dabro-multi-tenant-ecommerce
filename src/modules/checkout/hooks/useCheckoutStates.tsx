import { parseAsBoolean, useQueryStates } from "nuqs";

export const useCheckoutStates = () => {
  // lets you manage multiple URL parameters at once. Think of
  // it like useState, but the state is stored in the URL
  return useQueryStates({
    success: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    }),
    cancel: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    }),
  });
};

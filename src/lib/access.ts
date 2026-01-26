import { ClientUser } from "payload";
import type { User } from "@/payload-types";

export const isSuperAdmin = (
  user: User | ClientUser | null
) => {
  return Boolean(user?.roles?.includes("super-admin"));
};

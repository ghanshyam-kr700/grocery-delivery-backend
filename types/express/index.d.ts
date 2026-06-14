import { DeliveryPartner } from "../../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        isAdmin?: boolean;
      };
      partner?: DeliveryPartner;
    }
  }
}

export {};
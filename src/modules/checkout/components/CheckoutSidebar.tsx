import { Button } from "@/components/ui/button";
import { formatAsCurrency } from "@/modules/products/utils/formatAsCurrency";
import { CircleXIcon } from "lucide-react";
import React from "react";

type Props = {
  total: number;
  onPurchase: () => void;
  isCanceled?: boolean;
  disabled?: boolean;
};

export default function CheckoutSidebar({
  total,
  onPurchase,
  isCanceled,
  disabled,
}: Props): React.ReactElement {
  return (
    <div className="border rounded-md overflow-hidden bg-white flex flex-col">
      {/* Total Price */}
      <div className="flex items-center justify-between p-4 border-b">
        <h4 className="font-medium text-lg">Total</h4>
        <p className="font-medium text-lg">
          {formatAsCurrency(total)}
        </p>
      </div>
      {/* Button */}
      <div className="p-4 flex ite justify-center">
        <Button
          variant={"elevated"}
          disabled={disabled}
          onClick={onPurchase}
          className="text-base w-full text-white bg-primary hover:bg-pink-400 
          hover:text-primary"
        >
          Checkout
        </Button>
      </div>
      {isCanceled && (
        <div className="p-4 flex justify-center items-center border-t">
          <div
            className="bg-red-100 broder border-red-400 font-medium px-4 py-3 
          rounded flex items-center w-full"
          >
            <div className="flex items-center">
              <CircleXIcon className="size-6 mr-2 fill-red-500 text-red-100" />
              <span>
                Checkout failed. Please try again.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

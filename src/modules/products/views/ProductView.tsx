import Image from "next/image";
import { ReactElement } from "react";

type Props = {
  productId: string;
  tenantSlug: string;
};

function ProductView({
  productId,
  tenantSlug,
}: Props): ReactElement {
  return (
    <div className="px-4 lg:px-12 py-10 ">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={"/productImage.png"}
            alt="cover"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default ProductView;

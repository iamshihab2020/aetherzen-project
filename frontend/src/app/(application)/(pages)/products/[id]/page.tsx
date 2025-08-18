
"use client";
import { useGetProductByIdQuery } from "@/store/slices/api/api.slice";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cart.slice";
import { toast } from "sonner";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id as string);
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
      toast.success("Product added to cart");
    }
  };

  return (
    <div className="container mx-auto py-10">
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading product</p>
      ) : product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center justify-between mb-4">
              <p className="text-2xl font-bold">${product.price}</p>
              <Badge>{product.category.name}</Badge>
            </div>
            <Button onClick={handleAddToCart}>Add to Cart</Button>
          </div>
        </div>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  );
};

export default ProductDetailsPage;

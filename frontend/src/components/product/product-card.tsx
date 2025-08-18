
import { Product } from "@/types/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cart.slice";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success("Product added to cart");
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{product.description}</p>
          <div className="flex justify-between items-center mt-4">
            <p className="text-lg font-bold">${product.price}</p>
            <Badge>{product.category.name}</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddToCart}>Add to Cart</Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

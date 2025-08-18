"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetCategoriesQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/store/slices/api.slice";
import { Checkbox } from "@/components/ui/checkbox";
import { Category } from "@/types/types";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  priceCents: z.coerce.number().min(1, {
    message: "Price must be at least 1 cent.",
  }),
  inventory: z.coerce.number().min(0, {
    message: "Inventory must be a non-negative number.",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required.",
  }),
  isRestricted: z.boolean().optional(),
  isEmergencyItem: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

  const { data: product, isLoading: isProductLoading } = useGetProductByIdQuery(
    id,
    {
      skip: !id,
    }
  );
  const { data: categories, isLoading: areCategoriesLoading } =
    useGetCategoriesQuery();
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      priceCents: 0,
      inventory: 0,
      categoryId: "",
      isRestricted: false,
      isEmergencyItem: false,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.title,
        description: product.description || "",
        priceCents: product.priceCents,
        inventory: product.inventory,
        categoryId: product.categoryId,
        isRestricted: product.isPrescriptionRequired,
        isEmergencyItem: product.isEmergencyItem,
      });
    }
  }, [product, form]);

  async function onSubmit(values: FormValues) {
    if (!id) return;

    try {
      await updateProduct({
        id,
        ...values,
      }).unwrap();

      toast.success("Product updated successfully");
      router.push("/dashboard/products");
    } catch (error) {
      toast.error("Failed to update product");
      console.error("Update error:", error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      {isProductLoading ? (
        <p>Loading...</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Product description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceCents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (in cents)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Price in cents"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-sm text-muted-foreground">
                    ${(field.value / 100).toFixed(2)}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inventory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inventory</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Inventory quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={areCategoriesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {areCategoriesLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading categories...
                        </SelectItem>
                      ) : categories && categories.length === 0 ? (
                        <SelectItem value="no-categories" disabled>
                          No categories available
                        </SelectItem>
                      ) : (
                        categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="isRestricted"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Requires Prescription</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isEmergencyItem"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Emergency Item</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Product"}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/products")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default EditProductPage;

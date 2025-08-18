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
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "@/store/slices/api.slice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

const EditCategoryPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data: category, isLoading: isCategoryLoading } =
    useGetCategoryByIdQuery(id as string);
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset(category);
    }
  }, [category, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateCategory({ id: id as string, ...values }).unwrap();
      toast.success("Category updated successfully");
      router.push("/dashboard/categories");
    } catch (error) {
      toast.error("Failed to update category");
    }
  }

  return (
    <div className="container mx-auto py-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      {isCategoryLoading ? (
        <p>Loading...</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Category"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default EditCategoryPage;

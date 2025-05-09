"use client";
import { Search, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";

export default function SearchForm() {
  const form = useForm({
    defaultValues: {
      searchText: "",
    },
  });

  const router = useRouter();

  const onSubmit = async ({ searchText }: any) => {
    const trimmed = searchText.trim();
    if (!trimmed) return;
    router.push(`/loggedin/search/${trimmed}`);
  };

  return (
    <Form {...form}>
      <form
        className="lg:flex lg:items-center justify-end w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="relative flex gap-2 items-center w-full ">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <FormField
            control={form.control}
            name="searchText"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    id="searchText"
                    type="search"
                    required
                    placeholder="Buscar Tareas..."
                    className="w-full appearance-none bg-background pl-8 shadow-none h-10"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          ></FormField>
          <Button className="hover:bg-orange-600 px-4">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

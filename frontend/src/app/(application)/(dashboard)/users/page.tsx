import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const AllUsers = () => {
  return (
    <div>
      <Link href={"/create"}>
        <Button>Create</Button>
      </Link>
    </div>
  );
};

export default AllUsers;

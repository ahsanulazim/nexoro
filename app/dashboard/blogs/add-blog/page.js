import AddBlog from "@/components/dashboard/blogs/AddBlog";
import DashBread from "@/components/dashboard/DashBread";
import React from "react";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
//export const instant = false;

const page = () => {
  return (
    <main className="flex flex-col gap-4">
      <section className="">
        <DashBread title="Blogs" subtitle="Create Blog" />
        <div className="flex items-center justify-between gap-5">
          <h1 className="text-4xl font-semibold">Create a Blog</h1>
        </div>
      </section>
      <section>
        <AddBlog />
      </section>
    </main>
  );
};

export default page;

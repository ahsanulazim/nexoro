import AllBlogs from "@/components/blog/AllBlogs";
import GradText from "@/components/ui/GradText";
import TitleBanner from "@/components/ui/TitleBanner";

const Blog = () => {
  return <main>
    <TitleBanner>Blog</TitleBanner>
    <div className="max-w-[1426px] mx-auto px-5 py-10 sm:py-20">
      <div className="mb-10">
        <h2 className="text-3xl lg:text-5xl font-semibold text-center mb-3">
          Nexoro Solutions <GradText>Blogs</GradText>
        </h2>
        <p className="text-center">Read the latest tech articles by the industry experts!</p>
      </div>
      <section>
        <AllBlogs />
      </section>
    </div>
  </main>;
};

export default Blog;

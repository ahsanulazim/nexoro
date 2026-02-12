import TitleBanner from "@/components/ui/TitleBanner";
import { LuCalendar } from "react-icons/lu";
import parse from 'html-react-parser';
import moment from "moment";
import LatestBlogs from "@/components/blog/LatestBlogs";

const articles = async ({ params }) => {
  const { article } = await params;

  const blogData = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/blogs/getBlog/${article}`).then((res) => res.json());

  return (
    <main>
      <TitleBanner subtitle="Articles">{blogData.title}</TitleBanner>
      <div className="max-w-[1426px] mx-auto px-5 py-10 sm:py-20">
        <div className="grid lg:grid-cols-4 md:mb-10 gap-5 items-start">
          <div className="lg:col-span-3 bg-base-300 rounded-xl overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-semibold">{blogData.title}</h1>
              <p className="text-gray-500">
                By{" "}
                <span className="link link-hover link-info">
                  {blogData.author}
                </span>{" "}
                | Category:{" "}
                <span className="text-main">{blogData.category}</span>
              </p>
              <p className="flex gap-2 items-center opacity-50 text-sm">
                <LuCalendar />
                {moment(blogData.added).format('lll')}
              </p>
              <div className="divider"></div>
              <p className="p-6 bg-base-100 rounded-box mb-6">
                <span className="font-semibold">Summery:</span>{" "}
                {blogData.description}
              </p>
              <div className="blog-content">{parse(blogData.content.replace(/\u00A0/g, " "))}</div>
            </div>
          </div>
          <div className="lg:col-span-1 lg:sticky lg:top-28">
            <LatestBlogs />
          </div>
        </div>
      </div>
    </main>
  );
};

export default articles;

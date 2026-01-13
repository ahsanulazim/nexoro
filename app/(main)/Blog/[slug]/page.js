import TitleBanner from "@/components/ui/TitleBanner";

const Slug = async ({ params }) => {

    const { slug } = await params;

    const blogData = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/blogs/${slug}`).then(res => res.json())

    console.log(blogData);


    return (
        <main>
            <TitleBanner subtitle="Blog">{blogData.title}</TitleBanner>
            <div className="max-w-[1426px] mx-auto px-5 py-10 sm:py-20">
                <div className="mb-10">
                    {/* <h2 className="text-3xl lg:text-5xl font-semibold text-center mb-3">
          Nexoro Solutions <GradText>Blogs</GradText>
        </h2>
        <p className="text-center">Read the latest tech articles by the industry experts!</p> */}
                </div>
            </div>
        </main>
    )
}

export default Slug
const articles = async ({ params }) => {
  const { article } = await params;

  const blogData = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/blogs/${article}`
  ).then((res) => res.json());

  return <div>{blogData.title}</div>;
};

export default articles;

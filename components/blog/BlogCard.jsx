import Link from "next/link"
import { LuHeart, LuMessageCircle } from "react-icons/lu"

const BlogCard = ({ blog }) => {
    return (
        <div className="card bg-base-300 shadow-sm overflow-hidden">
            <Link href={`/blog/${blog.slug}`} className="w-full">
                <img className="object-cover aspect-square"
                    src={blog.image}
                    alt={blog.title} />
            </Link>
            <div className="card-body justify-between">
                <div>
                    <div className="badge badge-success">{blog.category.category}</div>
                    <Link href={`/blog/${blog.slug}`} className="card-body p-0 mt-1 line-clamp-3">
                        <h2 className="card-title">{blog.title}</h2>
                    </Link>
                    <p className="flex gap-2"><span className="opacity-50">{new Date(blog.added).toLocaleString("en-BD", {
                        timeZone: "Asia/Dhaka",
                        dateStyle: "medium"
                    })}</span>•<span className="link link-hover link-info">{blog.author}</span></p>
                    <Link href={`/blog/${blog.slug}`} className="card-body p-0 mt-3">
                        <p className="line-clamp-2">{blog.description}</p>
                    </Link>
                </div>
                <div className="card-actions gap-2">
                    <button className="btn btn-soft btn-secondary"><LuHeart />Like</button>
                    <button className="btn btn-soft btn-info"><LuMessageCircle />Comments</button>
                </div>
            </div>
        </div>
    )
}

export default BlogCard
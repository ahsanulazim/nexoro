import { LuCalendar, LuHeart, LuMessageCircle } from "react-icons/lu"
import DOMPurify from "isomorphic-dompurify"

const BlogCard = ({ blog }) => {

    const clean = DOMPurify.sanitize(blog?.content, { USE_PROFILES: { html: true } });

    return (
        <div className="card md:flex-row bg-base-100 overflow-hidden">
            <figure className="md:max-w-52">
                <img className="object-cover aspect-square"
                    src={blog.image}
                    alt={blog.title} />
            </figure>
            <div className="card-body">
                <div className="badge badge-success">{blog.category.category}</div>
                <div className="flex max-xs:flex-col xs:gap-2 xs:items-end">
                    <h2 className="card-title text-xl">{blog.title}</h2>
                    <p>by <span className="link link-hover link-info">{blog.author}</span></p>
                </div>
                <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: clean }} />
                <div>
                    <button className="btn btn-ghost btn-secondary"><LuHeart />Like</button>
                    <button className="btn btn-ghost btn-info"><LuMessageCircle />Comments</button>
                    <button className="btn btn-ghost btn-info" disabled><LuCalendar />10th Jan, 2026</button>
                </div>
            </div>
        </div>
    )
}

export default BlogCard
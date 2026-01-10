import { LuCalendar, LuHeart, LuMessageCircle } from "react-icons/lu"

const BlogCard = () => {
    return (
        <div className="card md:flex-row bg-base-100 overflow-hidden">
            <figure className="md:max-w-52">
                <img className="object-cover aspect-square"
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <div className="badge badge-success">Category</div>
                <div className="flex max-xs:flex-col xs:gap-2 xs:items-end">
                    <h2 className="card-title text-xl">Card Title</h2>
                    <p>by <span className="link link-hover link-info">Author Name</span></p>
                </div>
                <p className="line-clamp-2">A card component has a figure, a body part, and inside body there are title and actions parts</p>
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
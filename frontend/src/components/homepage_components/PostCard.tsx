import { Link } from "react-router-dom";
import { getDay } from "../../common/date";

type Props = {
    content: {
        blog_id?: string;
        title: string;
        banner: string;
        des: string;
        tags?: string[];
        activity: {
            total_likes: number;
        };
        publishedAt: string;
    };
    author: {
        name: string;
        surname: string;
        profile_img: string;
        username: string;
    };
};

export const PostCard = (props: Props) => {
    const { publishedAt, tags, title, des, banner, activity: { total_likes }, blog_id: id } = props.content;
    const { profile_img, username } = props.author;

    return (
        <Link to={`/post/${id}`} className="flex gap-8 items-center border-b border-grey pb-5 mb-4">
            <div className="w-full">
                <div className="flex gap-2 items-center mb-5">
                    <img src={profile_img} className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">@{username}</p>
                    <p className="min-w-fit">{getDay(publishedAt)}</p>
                </div>

                <h1 className="post-title">{title}</h1>

                <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
                    {des}
                </p>

                <div className="flex gap-4 mt-7">
                    <span className="btn-light py-1 px-4">{tags![0]}</span>
                    <span className="ml-3 flex items-center gap-2 text-dark-grey">
                        <i className="fi fi-rr-heart text-xl"></i>{total_likes}
                    </span>
                </div>
            </div>

            <div className="xl:h-44 xl:w-72 h-28 xl:aspect-video bg-grey">
                <img src={banner} className="w-full h-full aspect-video object-cover" />
            </div>
        </Link>
    );
};

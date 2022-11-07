import Card from "./Tag";
import { ITag } from "@/utils/interface";

const Tags = ({ posts }: { posts: ITag[] }) => {
  return (
    <>
      <div className="container my-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
        {posts.map((post) => (
          <Card post={post} key={post.slug} />
        ))}
      </div>
    </>
  );
};

export default Tags;

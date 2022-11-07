import Link from "next/link";
import { format } from "date-fns";
import NextImage from "@/components/Image";

import { ITag } from "@/utils/interface";

const Tag = ({ post }: { post: ITag }) => {
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden shadow-md shadow-slate-300 hover:shadow-2xl hover:shadow-slate-300">
      <Link href={`/tag/${post.slug}`}>
        <a>
          <NextImage src={post.thumbnail} alt={post.name} />
        </a>
      </Link>
      <main className="px-4">
        <h2 className="py-2">
          <Link href={`/tag/${post.slug}`}>
            <a>{post.name}</a>
          </Link>
        </h2>
        <p className="line-clamp-3">{post.description}</p>
      </main>
      <footer className="px-4 py-2 flex justify-between text-slate-800">
        <Link href={`/tag/${post.slug}`}>
          <a>{typeof post.category === "object" && post.category.name}</a>
        </Link>
        <span>{format(new Date(post.createdAt as string), "dd/MM/yyyy")}</span>
      </footer>
    </div>
  );
};

export default Tag;

import { Inter } from "next/font/google";
import { ChangeEvent } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/useDebounce";
import RouterReady from "@/RouterReady";

const inter = Inter({ subsets: ["latin"] });

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const fetchPosts = async (query?: string) => {
  if (query) {
    const repsonse = await fetch(
      `https://jsonplaceholder.typicode.com/posts?title_like=^${query}`
    );
    const data = await repsonse.json();
    return data as Promise<Post[]>;
  }

  const repsonse = await fetch(`https://jsonplaceholder.typicode.com/posts`);
  const data = await repsonse.json();
  return data as Promise<Post[]>;
};

const PostsList = () => {
  const router = useRouter();
  const { searchQuery } = router.query as { searchQuery: string };

  const debouncedSearechQuery = useDebounce(searchQuery, 500);

  const handleChangeSearchQuery = (event: ChangeEvent<HTMLInputElement>) => {
    router.push({
      pathname: "/",
      query: {
        searchQuery: event.target.value,
      },
    });
  };

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts", { debouncedSearechQuery }],
    queryFn: () => fetchPosts(debouncedSearechQuery),
  });
  return (
    <>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleChangeSearchQuery}
          className="text-black px-4 py-2"
        />

        <h3 className="text-white py-8">Search query: {searchQuery}</h3>
        <h3 className="text-white py-8">
          Debounced search query: {debouncedSearechQuery}
        </h3>
      </div>
      {isLoading ? <div>Loading...</div> : <div>Fetched</div>}
      <div className="pt-4 flex flex-col">
        {posts.map((post) => (
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
            key={post.id}
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              {post.title}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`text-sm opacity-50`}>{post.body}</p>
          </a>
        ))}
      </div>
    </>
  );
};

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <RouterReady>
        <PostsList />
      </RouterReady>
    </main>
  );
}

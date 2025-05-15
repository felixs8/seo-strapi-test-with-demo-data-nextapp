import Link from "next/link";
import articlesExampleData from "@/public/example_api_response.json";
import Image from "next/image";

export const dynamic = "force-dynamic"; // Enable SSR on every request

async function fetchArticles() {
  console.log("Fetching articles from Strapi...");

  const res = await fetch(
    `${process.env.STRAPI_API_URL}/api/articles?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      cache: "no-store", // force server-side rendering
    }
  );

  if (!res.ok) {
    console.error("Error fetching articles:", res.statusText);
    throw new Error("Failed to fetch articles");
  }

  const data = await res.json();

  console.log("Articles fetched successfully:", data.data.length);

  return data.data;
}

export default async function ArticlesPage() {
  const articles = await fetchArticles();
  //const articles = articlesExampleData.data; // Use example data for testing

  return (
    <main className="p-6 mx-auto max-w-md md:max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Articles</h1>
      <ul className="space-y-4">
        {articles.map((article: any) => (
          <li key={article.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{article.title}</h2>
            {article.cover.formats.thumbnail.url && (
              <Image
                width={article.cover.formats.thumbnail.width}
                height={article.cover.formats.thumbnail.height}
                src={article.cover.formats.thumbnail.url}
                alt={article.cover.alternativeText || "Thumbnail"}
                className="mt-2 w-40 h-auto mb-4 rounded"
              />
            )}
            <p>{article.description}</p>
            <Link href={`/articles/${article.slug}`} className="text-accent">
              Read more
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

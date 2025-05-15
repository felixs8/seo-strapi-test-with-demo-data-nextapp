import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

// Enable SSG with ISR every 5 minutes
export const revalidate = 300;

async function fetchArticleBySlug(slug: string) {
  const res = await fetch(
    `${process.env.STRAPI_API_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      next: {
        revalidate: 300,
      },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch article:", res.statusText);
    throw new Error("Error fetching article");
  }

  const json = await res.json();
  return json.data?.[0];
}

// ⬇️ Generate static params from Strapi slugs
export async function generateStaticParams() {
  const res = await fetch(`${process.env.STRAPI_API_URL}/api/articles`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    next: {
      revalidate: 300,
    },
  });

  const json = await res.json();

  return json.data.map((article: any) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await fetchArticleBySlug(slug);

  if (!article) return notFound();

  const { title, description, cover, author, blocks } = article;

  const imageUrl = cover?.formats?.large?.url || cover?.url;
  const imageWidth = cover?.formats?.large?.width || cover?.width;
  const imageHeight = cover?.formats?.large?.height || cover?.height;

  return (
    <main className="p-6 mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      {imageUrl && (
        <Image
          src={imageUrl}
          alt={cover?.alternativeText || title}
          width={imageWidth}
          height={imageHeight}
          className="rounded mb-6"
        />
      )}

      <p className="text-lg mb-6 text-gray-700">{description}</p>

      {blocks?.map((block: any) => {
        switch (block.__component) {
          case "shared.rich-text":
            return (
              <div
                key={"shared.rich-text," + block.id}
                className="prose prose-lg my-6"
              >
                <ReactMarkdown>{block.body}</ReactMarkdown>
              </div>
            );
          case "shared.quote":
            return (
              <blockquote
                key={"shared.quote," + block.id}
                className="border-l-4 pl-4 italic text-gray-600 my-6"
              >
                <p>“{block.body}”</p>
                <footer className="text-sm mt-2 text-gray-500">
                  — {block.title}
                </footer>
              </blockquote>
            );
          case "shared.media":
            return (
              <div
                key={"shared.media," + block.id}
                className="my-6 text-gray-500 italic"
              >
                [Media block placeholder]
              </div>
            );
          case "shared.slider":
            return (
              <div
                key={"shared.slider," + block.id}
                className="my-6 text-gray-500 italic"
              >
                [Slider block placeholder]
              </div>
            );
          default:
            return null;
        }
      })}
    </main>
  );
}

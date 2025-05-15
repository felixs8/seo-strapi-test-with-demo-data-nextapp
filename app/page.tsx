import Link from "next/link";

export default function Home() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Seo Strapi Test</h1>
          <p className="py-6">
            This website demonstrates the use of Strapi as a headless CMS for
            managing content and Next.js for server-side rendering and static
            site generation. The website is designed to be SEO-friendly,
            ensuring that search engines can easily crawl and index the content.
          </p>
          <Link href="/articles" className="btn btn-primary">
            Example Content
          </Link>
        </div>
      </div>
    </div>
  );
}

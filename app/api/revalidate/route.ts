import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");

  console.log("[REVALIDATE] Received request");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const slug = body.entry?.slug;

  if (slug) {
    console.log(`[REVALIDATE] Article: ${slug}`);
    revalidatePath(`/articles/${slug}`);
  } else {
    console.warn(
      "[REVALIDATE] No slug found — possibly a test event or malformed payload."
    );
    console.log(body);
  }

  console.log("[REVALIDATE] List: /articles");
  revalidatePath("/articles");

  return new Response("Revalidated", { status: 200 });
}

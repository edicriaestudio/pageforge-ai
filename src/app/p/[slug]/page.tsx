import { getPageSpecBySlug } from "@/app/actions/pages";
import { Renderer } from "@/components/renderer/Renderer";
import { notFound } from "next/navigation";

export default async function PublicPage({ params }: { params: { slug: string } }) {
  const spec = await getPageSpecBySlug(params.slug);

  if (!spec) {
    notFound();
  }

  return <Renderer spec={spec} />;
}

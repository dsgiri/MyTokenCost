import { Metadata } from "next";
import { sanityClient } from "@/lib/sanity";
import { AlertTriangle } from "lucide-react";
import BlogCard from "@/components/blogs/BlogCard";

export const metadata: Metadata = {
  title: "Compliance Intelligence Blog | MyTokenCost",
  description: "Latest insights on regulatory shifts, grid telemetry, and physical infrastructure mapping for high-density compute.",
};

async function getPosts() {
  try {
    return await sanityClient.fetch(
      `*[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        publishedAt,
        body,
        "slug": slug.current
      }`,
      {},
      { next: { revalidate: 60 } }
    );
  } catch (error) {
    console.error("Failed to fetch blog posts from Sanity:", error);
    return [];
  }
}

export default async function BlogsPage() {
  const posts = await getPosts();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen py-24 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight text-white">
            Compliance <span className="text-[#00f0ff] font-extrabold">Intelligence</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            Inside briefings, telemetry assessments, and legal guides covering the intersection of physical power grids and artificial intelligence infrastructure.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-slate-800 rounded-2xl max-w-md mx-auto">
            <AlertTriangle className="w-12 h-12 text-[#00f0ff] mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-white mb-2">Syncing Briefings...</h2>
            <p className="text-sm text-slate-400 px-6">
              Our intelligence articles are currently syncing from the secure distributed CMS. Please refresh in a moment.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Featured Post */}
            {featuredPost && (
              <BlogCard post={featuredPost} featured={true} />
            )}

            {/* Remaining Posts Grid */}
            {remainingPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                {remainingPosts.map((post: any) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}


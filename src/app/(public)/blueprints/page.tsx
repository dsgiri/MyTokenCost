import { Metadata } from "next";
import { sanityClient } from "@/lib/sanity";
import { ShieldAlert } from "lucide-react";
import BlueprintCard from "@/components/blueprints/BlueprintCard";

export const metadata: Metadata = {
  title: "SOP Blueprints | MyTokenCost",
  description: "Browse our repository of standardized operating procedures and compliance blueprints.",
};

async function getBlueprints() {
  try {
    return await sanityClient.fetch(
      `*[_type == "blueprint"] | order(title asc) {
        _id,
        title,
        regulatoryBody,
        penaltyRisk,
        steps,
        "slug": slug.current
      }`,
      {},
      { next: { revalidate: 60 } }
    );
  } catch (error) {
    console.error("Failed to fetch blueprints from Sanity:", error);
    return [];
  }
}

export default async function BlueprintsPage() {
  const blueprints = await getBlueprints();

  return (
    <div className="min-h-screen py-24 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight text-white">
            Compliance <span className="text-[#00f0ff] font-extrabold">Blueprints</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            Standard operating procedures (SOPs) engineered to map high-density compute loads to complex physical grid frameworks. Non-invasive, legal-grade compliance checklists.
          </p>
        </div>

        {blueprints.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-slate-800 rounded-2xl max-w-md mx-auto">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-white mb-2">Syncing with Secure Node...</h2>
            <p className="text-sm text-slate-400 px-6">
              Our compliance blueprints are currently syncing from the secure distributed CMS. Please refresh in a moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {blueprints.map((bp: any) => (
              <BlueprintCard key={bp._id} blueprint={bp} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}


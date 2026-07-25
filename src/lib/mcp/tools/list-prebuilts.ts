import { defineTool } from "@lovable.dev/mcp-js";
import { prebuilts } from "@/data/prebuilts";

export default defineTool({
  name: "list_prebuilts",
  title: "List prebuilt PCs",
  description:
    "List all prebuilt PC models offered by Monterey Bay PCs with tier, price (USD), tagline, and slug. Use `get_prebuilt` for full specs and performance benchmarks.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const summary = prebuilts.map((p) => ({
      slug: p.slug,
      name: p.name,
      tier: p.tier,
      price: p.price,
      tagline: p.tagline,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: { prebuilts: summary },
    };
  },
});

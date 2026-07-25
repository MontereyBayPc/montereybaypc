import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getPrebuilt, prebuilts } from "@/data/prebuilts";

export default defineTool({
  name: "get_prebuilt",
  title: "Get prebuilt PC details",
  description:
    "Get full details for one prebuilt PC by slug — specs, performance benchmarks, what's in the box, and best use cases.",
  inputSchema: {
    slug: z
      .string()
      .min(1)
      .describe(
        `Prebuilt slug. One of: ${prebuilts.map((p) => p.slug).join(", ")}.`,
      ),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const pc = getPrebuilt(slug);
    if (!pc) {
      return {
        content: [{ type: "text", text: `No prebuilt found with slug "${slug}".` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(pc, null, 2) }],
      structuredContent: { prebuilt: pc },
    };
  },
});

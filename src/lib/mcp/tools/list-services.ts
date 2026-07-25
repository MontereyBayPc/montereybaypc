import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const services = [
  {
    slug: "custom-pc-building",
    title: "Custom PC Building",
    description:
      "From part selection to final testing, we build your dream rig from scratch with meticulous attention to detail.",
    startingPrice: 75,
  },
  {
    slug: "upgrades",
    title: "Upgrades",
    description:
      "CPU, GPU, RAM, storage upgrades. We'll help you pick the right parts and install them professionally.",
    startingPrice: 40,
  },
  {
    slug: "troubleshooting-repair",
    title: "Troubleshooting & Repair",
    description:
      "Diagnosing hardware failures, software issues, boot problems, and more. Fast turnaround.",
    startingPrice: 50,
  },
  {
    slug: "cleaning-optimization",
    title: "Cleaning & Optimization",
    description:
      "Deep cleaning, thermal paste replacement, dust removal, OS optimization, and cable management refresh.",
    startingPrice: 35,
  },
];

export default defineTool({
  name: "list_services",
  title: "List services",
  description:
    "List all Monterey Bay PCs services offered (custom builds, upgrades, repair, cleaning) with descriptions and starting prices in USD.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(services, null, 2) }],
    structuredContent: { services },
  }),
});

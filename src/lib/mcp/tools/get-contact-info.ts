import { defineTool } from "@lovable.dev/mcp-js";

const contact = {
  business: "Monterey Bay PCs",
  location: "Monterey Bay, California",
  email: "montereybaypc@gmail.com",
  instagram: "https://instagram.com/montereybaypcs",
  website: "https://montereybaypcs.com",
  serviceArea: "Local pickup in Monterey Bay; local delivery within 30 miles ($75).",
};

export default defineTool({
  name: "get_contact_info",
  title: "Get contact info",
  description:
    "Get contact information for Monterey Bay PCs — email, Instagram, website, and service area.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(contact, null, 2) }],
    structuredContent: contact,
  }),
});

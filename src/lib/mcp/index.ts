import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listServicesTool from "./tools/list-services";
import listPrebuiltsTool from "./tools/list-prebuilts";
import getPrebuiltTool from "./tools/get-prebuilt";
import getContactInfoTool from "./tools/get-contact-info";

// Vite inlines the stable ref; the published SUPABASE_URL may be a proxy.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "monterey-bay-pcs",
  title: "Monterey Bay PCs",
  version: "0.1.0",
  instructions:
    "Catalog for Monterey Bay PCs, a local custom PC builder and repair shop in the Monterey Bay area. Use `list_services` for repair/build services, `list_prebuilts` + `get_prebuilt` for prebuilt PC models and specs, and `get_contact_info` for how to reach the shop.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listServicesTool, listPrebuiltsTool, getPrebuiltTool, getContactInfoTool],
});

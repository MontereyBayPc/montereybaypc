import { defineMcp } from "@lovable.dev/mcp-js";
import listServicesTool from "./tools/list-services";
import listPrebuiltsTool from "./tools/list-prebuilts";
import getPrebuiltTool from "./tools/get-prebuilt";
import getContactInfoTool from "./tools/get-contact-info";

export default defineMcp({
  name: "monterey-bay-pcs-mcp",
  title: "Monterey Bay PCs",
  version: "0.1.0",
  instructions:
    "Public catalog for Monterey Bay PCs, a local custom PC builder and repair shop in the Monterey Bay area. Use `list_services` for repair/build services, `list_prebuilts` + `get_prebuilt` for prebuilt PC models and specs, and `get_contact_info` for how to reach the shop.",
  tools: [listServicesTool, listPrebuiltsTool, getPrebuiltTool, getContactInfoTool],
});

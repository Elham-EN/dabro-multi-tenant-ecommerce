// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Products } from "./collections/Products";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Everything from your Database choice to the appearance of the
// Admin Panel is fully controlled through the Payload Config.
export default buildConfig({
  // The configuration options for the Admin Panel, including
  // Custom Components, Live Preview,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // An array of Collections for Payload to manage
  collections: [Users, Media, Categories, Products],
  // The Rich Text Editor which will be used by richText fields.
  editor: lexicalEditor(),
  // Payload will use for any encryption workflows -
  // for example, password salt / hashing.
  secret: process.env.PAYLOAD_SECRET || "",
  // Configure TypeScript settings here
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  // The Database Adapter which will be used by Payload.
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  // If you would like Payload to offer cropping, focal point
  // selection, and automatic media resizing, install and pass
  // the Sharp module to the config here.
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
});

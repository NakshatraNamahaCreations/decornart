// beautiful section removed. Route kept as a 404 stub so any stray link
// (bookmarks, external referrers) fails cleanly instead of crashing.
import { notFound } from "next/navigation";

export default function beautifulPage() {
  notFound();
}

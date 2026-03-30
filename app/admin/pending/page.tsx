import { redirect } from "next/navigation";

export default function PendingApprovalsRedirectPage() {
  redirect("/admin");
}

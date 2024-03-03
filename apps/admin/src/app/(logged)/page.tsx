import { redirect } from "next/navigation";

export default function Home() {
  console.log("redirect");
  redirect("./dashboard");
}

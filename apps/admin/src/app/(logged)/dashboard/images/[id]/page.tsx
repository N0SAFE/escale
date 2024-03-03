import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getImage } from "../actions";

export default async function ServiceView({
  params,
}: {
  params: { id: string };
}) {
  const service = await getImage(+params.id);
  console.log(service);
  return <div>{JSON.stringify(service?.data)}</div>;
}

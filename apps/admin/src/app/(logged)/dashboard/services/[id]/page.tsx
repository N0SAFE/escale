import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getService } from "../actions";

export default async function ServiceView({
  params,
}: {
  params: { id: string };
}) {
  const service = await getService(+params.id);
  console.log(service);
  return <div>{JSON.stringify(service?.data)}</div>;
}

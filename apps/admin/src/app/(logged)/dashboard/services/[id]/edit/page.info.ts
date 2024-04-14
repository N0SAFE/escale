import { z } from "zod";

export const Route = {
  name: "LoggedDashboardServicesIdEdit",
  params: z.object({
    id: z.string(),
  })
};


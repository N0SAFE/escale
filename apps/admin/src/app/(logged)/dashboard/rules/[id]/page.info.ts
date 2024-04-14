import { z } from "zod";

export const Route = {
  name: "LoggedDashboardRulesId",
  params: z.object({
    id: z.string(),
  })
};


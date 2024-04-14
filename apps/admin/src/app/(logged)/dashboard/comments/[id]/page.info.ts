import { z } from "zod";

export const Route = {
  name: "LoggedDashboardCommentsId",
  params: z.object({
    id: z.string(),
  })
};


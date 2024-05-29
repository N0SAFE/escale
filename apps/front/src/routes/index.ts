// Automatically generated by declarative-routing, do NOT edit
import { z } from "zod";
import { makeRoute } from "./makeRoute";

const defaultInfo = {
  search: z.object({})
};

import * as HomeRoute from "@/app/page.info";
import * as ContactRoute from "@/app/contact/page.info";
import * as FaqRoute from "@/app/faq/page.info";
import * as ReglementRoute from "@/app/reglement/page.info";
import * as ReservationidviewRoute from "@/app/reservation/[id]/(view)/page.info";
import * as ReservationidconfirmRoute from "@/app/reservation/[id]/confirm/page.info";

export const Home = makeRoute(
  "/",
  {
    ...defaultInfo,
    ...HomeRoute.Route
  }
);
export const Contact = makeRoute(
  "/contact",
  {
    ...defaultInfo,
    ...ContactRoute.Route
  }
);
export const Faq = makeRoute(
  "/faq",
  {
    ...defaultInfo,
    ...FaqRoute.Route
  }
);
export const Reglement = makeRoute(
  "/reglement",
  {
    ...defaultInfo,
    ...ReglementRoute.Route
  }
);
export const Reservationidview = makeRoute(
  "/reservation/[id]/(view)",
  {
    ...defaultInfo,
    ...ReservationidviewRoute.Route
  }
);
export const Reservationidconfirm = makeRoute(
  "/reservation/[id]/confirm",
  {
    ...defaultInfo,
    ...ReservationidconfirmRoute.Route
  }
);


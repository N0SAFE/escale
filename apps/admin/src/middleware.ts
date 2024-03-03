// middleware.ts

import axios from "axios";
import { stackMiddlewares } from "./middlewares/stackMiddlewares";
import { withHeaders } from "./middlewares/WithHeaders";
import { withHealthCheck } from "./middlewares/WithHealthCheck";
import { withAuth } from "./middlewares/AuthMiddlewares";
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const middlewares = [withHeaders, withHealthCheck, withAuth];
export default stackMiddlewares(middlewares);

// Automatically generated by declarative-routing, do NOT edit
import { z } from 'zod'
import { makeRoute } from './makeRoute'

const defaultInfo = {
    search: z.object({}),
}

import * as LoggedDashboardAvailabilitiesCalendarRoute from '@/app/(logged)/dashboard/availabilities/calendar/page.info'
import * as LoggedDashboardAvailabilitiesListRoute from '@/app/(logged)/dashboard/availabilities/list/page.info'
import * as LoggedDashboardCommentsRoute from '@/app/(logged)/dashboard/comments/page.info'
import * as LoggedDashboardCommentsIdRoute from '@/app/(logged)/dashboard/comments/[id]/page.info'
import * as LoggedDashboardCommentsIdEditRoute from '@/app/(logged)/dashboard/comments/[id]/edit/page.info'
import * as LoggedDashboardImagesRoute from '@/app/(logged)/dashboard/files/images/page.info'
import * as LoggedDashboardImagesIdRoute from '@/app/(logged)/dashboard/files/images/[id]/page.info'
import * as LoggedDashboardImagesIdEditRoute from '@/app/(logged)/dashboard/files/images/[id]/edit/page.info'
import * as LoggedDashboardReservationsCalendarRoute from '@/app/(logged)/dashboard/reservations/calendar/page.info'
import * as LoggedDashboardReservationsListRoute from '@/app/(logged)/dashboard/reservations/list/page.info'
import * as LoggedDashboardRulesRoute from '@/app/(logged)/dashboard/rules/page.info'
import * as LoggedDashboardRulesIdRoute from '@/app/(logged)/dashboard/rules/[id]/page.info'
import * as LoggedDashboardRulesIdEditRoute from '@/app/(logged)/dashboard/rules/[id]/edit/page.info'
import * as LoggedDashboardServicesRoute from '@/app/(logged)/dashboard/services/page.info'
import * as LoggedDashboardServicesIdRoute from '@/app/(logged)/dashboard/services/[id]/page.info'
import * as LoggedDashboardServicesIdEditRoute from '@/app/(logged)/dashboard/services/[id]/edit/page.info'
import * as LoggedDashboardSpasRoute from '@/app/(logged)/dashboard/spas/page.info'
import * as LoggedDashboardSpasIdRoute from '@/app/(logged)/dashboard/spas/[spaId]/page.info'
import * as LoggedDashboardSpasIdEditRoute from '@/app/(logged)/dashboard/spas/[spaId]/edit/page.info'
import * as LoggedDashboardTagsRoute from '@/app/(logged)/dashboard/tags/page.info'
import * as LoggedDashboardTagsIdRoute from '@/app/(logged)/dashboard/tags/[id]/page.info'
import * as LoggedDashboardTagsIdEditRoute from '@/app/(logged)/dashboard/tags/[id]/edit/page.info'
import * as LoggedDashboardUsersRoute from '@/app/(logged)/dashboard/users/page.info'
import * as LoggedDashboardUsersIdRoute from '@/app/(logged)/dashboard/users/[userId]/page.info'
import * as LoggedDashboardUsersIdEditRoute from '@/app/(logged)/dashboard/users/[userId]/edit/page.info'
import * as LoggedDashboardWebsiteFaqRoute from '@/app/(logged)/dashboard/website/faq/page.info'
import * as LoggedDashboardWebsiteHomeRoute from '@/app/(logged)/dashboard/website/home/page.info'
import * as LoggeddashboardwebsiterulesRoute from '@/app/(logged)/dashboard/website/rules/page.info'
import * as LoginRoute from '@/app/login/page.info'

export const LoggedDashboardAvailabilitiesCalendar = makeRoute(
    '/(logged)/dashboard/availabilities/calendar',
    {
        ...defaultInfo,
        ...LoggedDashboardAvailabilitiesCalendarRoute.Route,
    }
)
export const LoggedDashboardAvailabilitiesList = makeRoute(
    '/(logged)/dashboard/availabilities/list',
    {
        ...defaultInfo,
        ...LoggedDashboardAvailabilitiesListRoute.Route,
    }
)
export const LoggedDashboardComments = makeRoute(
    '/(logged)/dashboard/comments',
    {
        ...defaultInfo,
        ...LoggedDashboardCommentsRoute.Route,
    }
)
export const LoggedDashboardCommentsId = makeRoute(
    '/(logged)/dashboard/comments/[id]',
    {
        ...defaultInfo,
        ...LoggedDashboardCommentsIdRoute.Route,
    }
)
export const LoggedDashboardCommentsIdEdit = makeRoute(
    '/(logged)/dashboard/comments/[id]/edit',
    {
        ...defaultInfo,
        ...LoggedDashboardCommentsIdEditRoute.Route,
    }
)
export const LoggedDashboardImages = makeRoute(
    '/(logged)/dashboard/files/images',
    {
        ...defaultInfo,
        ...LoggedDashboardImagesRoute.Route,
    }
)
export const LoggedDashboardImagesId = makeRoute(
    '/(logged)/dashboard/files/images/[id]',
    {
        ...defaultInfo,
        ...LoggedDashboardImagesIdRoute.Route,
    }
)
export const LoggedDashboardImagesIdEdit = makeRoute(
    '/(logged)/dashboard/files/images/[id]/edit',
    {
        ...defaultInfo,
        ...LoggedDashboardImagesIdEditRoute.Route,
    }
)
export const LoggedDashboardReservationsCalendar = makeRoute(
    '/(logged)/dashboard/reservations/calendar',
    {
        ...defaultInfo,
        ...LoggedDashboardReservationsCalendarRoute.Route,
    }
)
export const LoggedDashboardReservationsList = makeRoute(
    '/(logged)/dashboard/reservations/list',
    {
        ...defaultInfo,
        ...LoggedDashboardReservationsListRoute.Route,
    }
)
export const LoggedDashboardRules = makeRoute('/(logged)/dashboard/rules', {
    ...defaultInfo,
    ...LoggedDashboardRulesRoute.Route,
})
export const LoggedDashboardRulesId = makeRoute(
    '/(logged)/dashboard/rules/[id]',
    {
        ...defaultInfo,
        ...LoggedDashboardRulesIdRoute.Route,
    }
)
export const LoggedDashboardRulesIdEdit = makeRoute(
    '/(logged)/dashboard/rules/[id]/edit',
    {
        ...defaultInfo,
        ...LoggedDashboardRulesIdEditRoute.Route,
    }
)
export const LoggedDashboardServices = makeRoute(
    '/(logged)/dashboard/services',
    {
        ...defaultInfo,
        ...LoggedDashboardServicesRoute.Route,
    }
)
export const LoggedDashboardServicesId = makeRoute(
    '/(logged)/dashboard/services/[id]',
    {
        ...defaultInfo,
        ...LoggedDashboardServicesIdRoute.Route,
    }
)
export const LoggedDashboardServicesIdEdit = makeRoute(
    '/(logged)/dashboard/services/[id]/edit',
    {
        ...defaultInfo,
        ...LoggedDashboardServicesIdEditRoute.Route,
    }
)
export const LoggedDashboardSpas = makeRoute('/(logged)/dashboard/spas', {
    ...defaultInfo,
    ...LoggedDashboardSpasRoute.Route,
})
export const LoggedDashboardSpasId = makeRoute(
    '/(logged)/dashboard/spas/[spaId]',
    {
        ...defaultInfo,
        ...LoggedDashboardSpasIdRoute.Route,
    }
)
export const LoggedDashboardSpasIdEdit = makeRoute(
    '/(logged)/dashboard/spas/[spaId]/edit',
    {
        ...defaultInfo,
        ...LoggedDashboardSpasIdEditRoute.Route,
    }
)
export const LoggedDashboardTags = makeRoute('/(logged)/dashboard/tags', {
    ...defaultInfo,
    ...LoggedDashboardTagsRoute.Route,
})
export const LoggedDashboardTagsId = makeRoute(
    '/(logged)/dashboard/tags/[id]',
    {
        ...defaultInfo,
        ...LoggedDashboardTagsIdRoute.Route,
    }
)
export const LoggedDashboardTagsIdEdit = makeRoute(
    '/(logged)/dashboard/tags/[id]/edit',
    {
        ...defaultInfo,
        ...LoggedDashboardTagsIdEditRoute.Route,
    }
)
export const LoggedDashboardUsers = makeRoute('/(logged)/dashboard/users', {
    ...defaultInfo,
    ...LoggedDashboardUsersRoute.Route,
})
export const LoggedDashboardUsersId = makeRoute(
    '/(logged)/dashboard/users/[userId]',
    {
        ...defaultInfo,
        ...LoggedDashboardUsersIdRoute.Route,
    }
)
export const LoggedDashboardUsersIdEdit = makeRoute(
    '/(logged)/dashboard/users/[userId]/edit',
    {
        ...defaultInfo,
        ...LoggedDashboardUsersIdEditRoute.Route,
    }
)
export const LoggedDashboardWebsiteFaq = makeRoute(
    '/(logged)/dashboard/website/faq',
    {
        ...defaultInfo,
        ...LoggedDashboardWebsiteFaqRoute.Route,
    }
)
export const LoggedDashboardWebsiteHome = makeRoute(
    '/(logged)/dashboard/website/home',
    {
        ...defaultInfo,
        ...LoggedDashboardWebsiteHomeRoute.Route,
    }
)
export const Loggeddashboardwebsiterules = makeRoute(
    '/(logged)/dashboard/website/rules',
    {
        ...defaultInfo,
        ...LoggeddashboardwebsiterulesRoute.Route,
    }
)
export const Login = makeRoute('/login', {
    ...defaultInfo,
    ...LoginRoute.Route,
})

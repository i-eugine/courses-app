import { createBrowserRouter, Navigate, redirect } from 'react-router-dom';

import { AppLayout, NotFoundPage } from '@components';
import { loadMainData, userLoader } from '@loaders';
import { CourseInfo, Courses, EditCourse } from '@modules/Courses';
import { EmptyCourseList } from '@modules/Courses/EmptyCourseList';
import { UserLogin, UserRegistration } from '@modules/User';
import { TokenManager } from '@store/token-manager';
import { getHref } from '@utils/get-href';

import { ROUTE_PARAM } from './route-param';
import { ROUTES } from './routes';

export const protectedRoutes = [
  {
    path: '',
    element: <Navigate to={ROUTES.courses} />,
  },
  {
    path: ROUTES.courses,
    element: <Courses />,
  },
  {
    path: `${ROUTES.courses}/:${ROUTE_PARAM.courseId}`,
    element: <CourseInfo />,
  },
  {
    path: `${ROUTES.courses}/:${ROUTE_PARAM.courseId}/${ROUTES.edit}`,
    element: <EditCourse />,
  },
  {
    path: `${ROUTES.courses}/${ROUTES.create}`,
    element: <EditCourse />,
  },
  {
    path: ROUTES.noCourses,
    element: <EmptyCourseList />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const unprotectedRoutes = [
  {
    path: ROUTES.login,
    element: <UserLogin />,
  },
  {
    path: ROUTES.registration,
    element: <UserRegistration />,
  },
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,

    children: [
      {
        path: '',
        children: [...protectedRoutes],
        loader: async () => {
          if (!TokenManager.getToken()) {
            return redirect(getHref(ROUTES.login));
          }

          await Promise.all([loadMainData(), userLoader()]);
          return null;
        },
      },
      ...unprotectedRoutes,
    ],
  },
]);

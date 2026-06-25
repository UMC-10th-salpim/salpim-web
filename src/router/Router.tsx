import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LoginPage from '@/pages/LoginPage';
import OnboardingPage from '@/pages/OnboardingPage';
import SurveyPage from '@/pages/SurveyPage';
import RecommendationPage from '@/pages/RecommendationPage';
import BenefitPage from '@/pages/BenefitPage';
import BenefitDetailPage from '@/pages/BenefitDetailPage';
import MapPage from '@/pages/MapPage';
import FacilityDetailPage from '@/pages/FacilityDetailPage';
import MyPage from '@/pages/MyPage';
import NotFoundPage from '@/pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <RecommendationPage /> },
      { path: 'recommendation', element: <RecommendationPage /> },
      { path: 'benefits', element: <BenefitPage /> },
      { path: 'benefits/:id', element: <BenefitDetailPage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'facility/:id', element: <FacilityDetailPage /> },
      { path: 'mypage', element: <MyPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/onboarding', element: <OnboardingPage /> },
  { path: '/survey', element: <SurveyPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;

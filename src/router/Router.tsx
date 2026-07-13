import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LoginPage from '@/pages/LoginPage';
import FontSizePage from '@/pages/FontSizePage';
import OnboardingPage from '@/pages/OnboardingPage';
import SignUpPage from '@/pages/SignUpPage';
import OAuthKakaoPage from '@/pages/OAuthKakaoPage';
import SurveyPage from '@/pages/SurveyPage';
import RecommendationPage from '@/pages/RecommendationPage';
import BenefitPage from '@/pages/BenefitPage';
import BenefitSearchPage from '@/pages/BenefitSearchPage';
import BenefitDetailPage from '@/pages/BenefitDetailPage';
import MapPage from '@/pages/MapPage';
import FacilityDetailPage from '@/pages/FacilityDetailPage';
import MyPage from '@/pages/MyPage';
import NotFoundPage from '@/pages/NotFoundPage';
import HelperPage from '@/pages/HelperPage';

const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/font-size', element: <FontSizePage /> },
  {
    element: <Layout />,
    children: [
      { path: 'recommendation', element: <RecommendationPage /> },
      { path: 'benefits', element: <BenefitPage /> },
      { path: 'benefits/search', element: <BenefitSearchPage /> },
      { path: 'benefits/:id', element: <BenefitDetailPage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'facility/:id', element: <FacilityDetailPage /> },
      { path: 'mypage', element: <MyPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'oauth/kakao', element: <OAuthKakaoPage /> },
      { path: 'survey', element: <SurveyPage /> },
      { path: 'helper/:id', element: <HelperPage/>},
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;

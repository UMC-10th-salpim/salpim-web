import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/router/ProtectedRoute';
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
import LikedBenefitsPage from '@/pages/LikedBenefitsPage';
import EditProfilePage from '@/pages/EditProfilePage';
import InquiryPage from '@/pages/InquiryPage';
import PasswordChangePage from '@/pages/PasswordChangePage';
import PasswordFindPage from '@/pages/PasswordFindPage';
import NotFoundPage from '@/pages/NotFoundPage';
import HelperPage from '@/pages/HelperPage';

const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/font-size', element: <FontSizePage /> },
  {
    element: <Layout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'oauth/kakao', element: <OAuthKakaoPage /> },
      { path: 'benefits/:id', element: <BenefitDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: 'recommendation', element: <RecommendationPage /> },
          { path: 'benefits', element: <BenefitPage /> },
          { path: 'benefits/search', element: <BenefitSearchPage /> },
          { path: 'map', element: <MapPage /> },
          { path: 'facility/:id', element: <FacilityDetailPage /> },
          { path: 'mypage', element: <MyPage /> },
          { path: 'mypage/liked', element: <LikedBenefitsPage /> },
          { path: 'mypage/edit', element: <EditProfilePage /> },
          { path: 'mypage/font-size', element: <FontSizePage /> },
          { path: 'mypage/inquiry', element: <InquiryPage /> },
          { path: 'mypage/password', element: <PasswordChangePage /> },
          { path: 'mypage/password/find', element: <PasswordFindPage /> },
          { path: 'survey', element: <SurveyPage /> },
          { path: 'helper/:id', element: <HelperPage /> },
        ],
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;

import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/router/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import FontSizePage from '@/pages/FontSizePage';
import OnboardingPage from '@/pages/OnboardingPage';
import SignUpPage from '@/pages/SignUpPage';
import OAuthKakaoPage from '@/pages/OAuthKakaoPage';

/*
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
import PublicPasswordResetPage from '@/pages/PublicPasswordResetPage';
import NotFoundPage from '@/pages/NotFoundPage';
import HelperPage from '@/pages/HelperPage';
*/
const SurveyPage = lazy(() => import('@/pages/SurveyPage'));
const RecommendationPage = lazy(() => import('@/pages/RecommendationPage'));
const BenefitPage = lazy(() => import('@/pages/BenefitPage'));
const BenefitSearchPage = lazy(() => import('@/pages/BenefitSearchPage'));
const BenefitDetailPage = lazy(() => import('@/pages/BenefitDetailPage'));
const MapPage = lazy(() => import('@/pages/MapPage'));
const FacilityDetailPage = lazy(() => import('@/pages/FacilityDetailPage'));
const MyPage = lazy(() => import('@/pages/MyPage'));
const LikedBenefitsPage = lazy(() => import('@/pages/LikedBenefitsPage'));
const EditProfilePage = lazy(() => import('@/pages/EditProfilePage'));
const InquiryPage = lazy(() => import('@/pages/InquiryPage'));
const PasswordChangePage = lazy(() => import('@/pages/PasswordChangePage'));
const PasswordFindPage = lazy(() => import('@/pages/PasswordFindPage'));
const PublicPasswordResetPage = lazy(() => import('@/pages/PublicPasswordResetPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const HelperPage = lazy(() => import('@/pages/HelperPage'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<div className="flex min-h-[100svh] items-center justify-center">로딩중...</div>}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/font-size', element: <FontSizePage /> },
  {
    element: <Layout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'password/find', element: withSuspense(PublicPasswordResetPage ) },
      { path: 'oauth/kakao', element: <OAuthKakaoPage /> },
      { path: 'benefits/:id', element: withSuspense(BenefitDetailPage ) },
      { path: '*', element: withSuspense(NotFoundPage) },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: 'recommendation', element: withSuspense(RecommendationPage)},
          { path: 'benefits', element: withSuspense(BenefitPage ) },
          { path: 'benefits/search', element: withSuspense(BenefitSearchPage ) },
          { path: 'map', element: withSuspense(MapPage) },
          { path: 'facility/:id', element: withSuspense(FacilityDetailPage) },
          { path: 'mypage', element: withSuspense(MyPage)},
          { path: 'mypage/liked', element: withSuspense(LikedBenefitsPage) },
          { path: 'mypage/edit', element: withSuspense(EditProfilePage) },
          { path: 'mypage/font-size', element: <FontSizePage /> },
          { path: 'mypage/inquiry', element: withSuspense(InquiryPage) },
          { path: 'mypage/password', element: withSuspense(PasswordChangePage) },
          { path: 'mypage/password/find', element: withSuspense(PasswordFindPage) },
          { path: 'survey', element: withSuspense(SurveyPage) },
          { path: 'helper/:id', element: withSuspense(HelperPage) },
        ],
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;

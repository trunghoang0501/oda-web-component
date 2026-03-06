import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import ApiError from '@/components/common/modals/api-error';
import SubscriptionPlanPermissionModal from '@/components/common/modals/subscription-plan-permission-modal';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { useRoute } from '@/hooks/useRoute';
import { useSettings } from '@/hooks/useSettings';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import UserLayout from '@/layouts/UserLayout';
import { NavSubMenu } from '@/layouts/types';
import { useNavigationItems } from '@/layouts/useNavigationItems';
import { ModalProvider } from '@/libs/my-mui-modal-provider';
import { AppDispatch } from '@/store/app-dispatch';
import { insertRouterHistory } from '@/store/slices/app';
import { companySelectors } from '@/store/slices/company';
import { userActions } from '@/store/slices/user';
import { IAuth, IAuthBranch } from '@/types';
import { IBranch } from '@/types/branch';
import {
  LanguageEnum,
  ResponseBaseFixed,
  callAppFunction,
  handleLogoutAndRedirect,
} from '@/utils';
import { AppFunctionName } from '@/utils/constants';
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/cookies';
import { getBranches } from '@/utils/getBranches';
import { LOCAL_STORAGE_KEY, localStorageUtil } from '@/utils/localStorage';
import { logUtil } from '@/utils/log';
import {
  generateChooseBranchUrl,
  generateExpiredTokenUrl,
  generateForgotPasswordUrl,
  generateHomeUrl,
  generateLoginUrl,
  generateWebLinkUrl,
  getAboutUsUrl,
  getApprovalUrl,
  getBookDemoUrl,
  getForbiddenUrl,
  getOperationRegulationsUrl,
  getPrivacyPolicyUrl,
  getRegisterUrl,
  getTermOfServiceUrl,
} from '@/utils/routing';
import { getHeadquartersOrderUrl } from '@/utils/routing/headquarters';
import { SplashScreen } from '../SplashScreen';

interface IAuthPagesAppProps {
  Component: NextPage;
  Element: ReactElement;
  pageProps: any;
}

enum LinkTypeEnum {
  LandingPage = 1,
  Weblink = 2,
  UnAuth = 3,
  Auth = 4,
}

const loginUrl = generateLoginUrl();
const expiredTokenUrl = generateExpiredTokenUrl();
const chooseBranchUrl = generateChooseBranchUrl();
const ROUTER_LIST = {
  LANDING: [
    generateHomeUrl(),
    getAboutUsUrl(),
    getBookDemoUrl(),
    getPrivacyPolicyUrl(),
    getTermOfServiceUrl(),
    getOperationRegulationsUrl(),
  ],
  WEBLINK: [generateWebLinkUrl(), getApprovalUrl()],
  UNAUTH: [
    loginUrl,
    getRegisterUrl(),
    generateForgotPasswordUrl(),
    generateExpiredTokenUrl(),
  ],
};
const DELAY_TIME_TO_STOP_SETUP_LOADING = 300;

enum MotionAnimationKeyEnum {
  Splash = 'splash',
  Normal = 'normal',
}

export const PagesWrapper = (props: IAuthPagesAppProps) => {
  const { Component, Element, pageProps } = props;
  const router = useRouter();
  const route = useRoute();
  const currentAsPath = router.asPath;
  const dispatch = useAppDispatch();
  const { navigationFullItems, navigationItems } = useNavigationItems();
  const { checkRouterPermission } = usePermission();
  const { getAccountInfo } = useAuth();
  const menuDisplaySetting = useAppSelector(
    companySelectors.getMenuDisplaySetting
  );
  const isStaffPermissionDenied = useAppSelector(
    (state) => state.app.isStaffPermissionDenied
  );
  const { settings, saveSettings } = useSettings();

  // useEffect(() => {
  //   if (!router.isReady) return;
  //   setTimeout(() => {
  //     if (typeof window !== 'undefined' && document.body && router.pathname !== '/') {
  //       if (
  //         window.matchMedia('(min-width: 780px) and (max-width: 2280px)')
  //           .matches
  //       ) {
  //         (document.body.style as any).zoom = '80%';
  //       } else {
  //         (document.body.style as any).zoom = '100%';
  //       }
  //     }
  //   }, 1000);
  // }, [router.isReady]);

  const currentLinkType = useMemo(() => {
    if (ROUTER_LIST.LANDING.some((item) => item === router.pathname)) {
      return LinkTypeEnum.LandingPage;
    }

    if (ROUTER_LIST.WEBLINK.some((item) => item === router.pathname)) {
      return LinkTypeEnum.Weblink;
    }

    if (ROUTER_LIST.UNAUTH.some((item) => item === router.pathname)) {
      return LinkTypeEnum.UnAuth;
    }

    return LinkTypeEnum.Auth;
  }, [router.pathname]);

  const [isSplashScreenLoading, setIsSplashScreenLoading] = useState(() => {
    return currentLinkType !== LinkTypeEnum.LandingPage;
  });
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const hasPermission = useMemo(() => {
    if (!menuDisplaySetting) {
      return true;
    }

    const checkPathInMenu = (list: NavSubMenu[], pathName: string) => {
      return list.some((item) => {
        const path = (item as NavSubMenu).path;
        if (path) {
          const subMenu = (item as NavSubMenu).subMenu;
          if (subMenu && subMenu.length > 0) {
            return subMenu?.some((childItem) =>
              pathName.includes(childItem.path ?? '')
            );
          }
          return pathName.includes((item as NavSubMenu).path ?? '');
        }

        return false;
      });
    };

    const hasUserPermission = checkRouterPermission(router.pathname);

    const routeInFullNavigation = checkPathInMenu(
      navigationFullItems,
      router.pathname
    );
    const hasCompanyPermission = routeInFullNavigation
      ? checkPathInMenu(navigationItems, router.pathname)
      : true;

    return hasUserPermission && hasCompanyPermission;
  }, [
    router.pathname,
    navigationFullItems,
    navigationItems,
    menuDisplaySetting,
  ]);

  // Setup hide splash screen
  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const hideSplashScreen = () => {
      setTimeout(() => {
        setIsSplashScreenLoading(false);
      }, DELAY_TIME_TO_STOP_SETUP_LOADING);
    };

    /*
      Nhóm router không cần hiển thị splash screen
      NOTE: Landing page là public page, nhưng vẫn có thể gọi getAccountInfo() để:
      - Check xem user có phải là headquarters user không
      - Nếu là headquarters user, giữ lại session (cookie và localStorage)
      - Nếu không phải, getAccountInfo() sẽ xử lý bình thường
    */
    (async () => {
      if (currentLinkType !== LinkTypeEnum.LandingPage) return;

      try {
        // Gọi getAccountInfo() để check headquarters user
        // Nếu là headquarters user, nó sẽ không resetAuthState()
        await getAccountInfo();
      } catch (error) {
        // Error đã được xử lý trong getAccountInfo()
        // Nếu là headquarters user, nó sẽ không throw error
        logUtil.error(() => error);
      }
    })();

    /*
      Nhóm router cần hiển thị splash screen, lấy thông tin account, tuy nhiên kể cả khi fail vẫn không xử lý gì hết
    */
    (async () => {
      if (currentLinkType !== LinkTypeEnum.Weblink) return;

      try {
        await getAccountInfo();
      } catch (error) {
        logUtil.error(() => error);
      }

      setIsSplashScreenLoading(false);
    })();

    /*
      Nhóm router cần hiển thị splash screen, lấy thông tin account, nếu success sẽ redirect vào trang khác, không đứng tại trang hiện tại
    */
    (async () => {
      if (currentLinkType !== LinkTypeEnum.UnAuth) return;

      const accessToken = getAccessToken();

      // Check if there are branches in localStorage (from previous session) or fetch from API
      const branchList = await getBranches();

      if (!accessToken) {
        // Only remove localStorage if there are no branches (no previous session to restore)
        if (branchList.length === 0) {
          callAppFunction(AppFunctionName.logger, 'remove branch 2');
          localStorageUtil.removeItem(LOCAL_STORAGE_KEY.BRANCHES);
          localStorageUtil.removeItem(LOCAL_STORAGE_KEY.CURRENT_BRANCH);
          localStorageUtil.removeItem(LOCAL_STORAGE_KEY.SUB_BRANCHES);
          localStorageUtil.removeItem(LOCAL_STORAGE_KEY.CURRENT_SUB_BRANCH);
        }

        if (
          window.location.href.includes(getRegisterUrl()) ||
          window.location.href.includes(generateForgotPasswordUrl()) ||
          window.location.href.includes(generateExpiredTokenUrl()) ||
          window.location.href.includes(getApprovalUrl())
        ) {
          hideSplashScreen();
        } else {
          // Case 2: UnAuth route - no accessToken, redirect to login
          // Use handleLogoutAndRedirect to ensure webview is notified
          handleLogoutAndRedirect({
            useRouter: true,
            router,
            onComplete: hideSplashScreen,
          });
        }
        return;
      }

      if (!accessToken) {
        callAppFunction(AppFunctionName.logger, 'remove branch 3');
        localStorageUtil.removeItem(LOCAL_STORAGE_KEY.BRANCHES);
        localStorageUtil.removeItem(LOCAL_STORAGE_KEY.CURRENT_BRANCH);
        localStorageUtil.removeItem(LOCAL_STORAGE_KEY.SUB_BRANCHES);
        localStorageUtil.removeItem(LOCAL_STORAGE_KEY.CURRENT_SUB_BRANCH);
        hideSplashScreen();
        return;
      }

      // Check if currentBranch.id = -1 and currentSubBranch.id = -1, redirect to headquarter view
      const currentBranchFromStorage = localStorageUtil.getItem<IAuthBranch>(
        LOCAL_STORAGE_KEY.CURRENT_BRANCH
      );
      const currentSubBranch = localStorageUtil.getItem<IBranch>(
        LOCAL_STORAGE_KEY.CURRENT_SUB_BRANCH
      );

      if (currentBranchFromStorage?.id === -1 && currentSubBranch?.id === -1) {
        router.push(getHeadquartersOrderUrl()).then(() => hideSplashScreen());
        return;
      }

      const currentBranch = localStorageUtil.getItem<IBranch>(
        LOCAL_STORAGE_KEY.CURRENT_SUB_BRANCH
      );

      if (!currentBranch) {
        // Check if there's a branch with id = -1 and is_real_headquarter = true
        const headquarterBranch = branchList.find(
          (branch) => branch.id === -1 && branch.is_real_headquarter === true
        );

        if (headquarterBranch) {
          // Set current branch and redirect to headquarter page without calling getAccountInfo
          dispatch(userActions.setCurrentBranch(headquarterBranch));
          localStorageUtil.setItem(
            LOCAL_STORAGE_KEY.CURRENT_BRANCH,
            headquarterBranch
          );
          localStorageUtil.setItem(
            LOCAL_STORAGE_KEY.SUB_BRANCHES,
            headquarterBranch.sub_branches || []
          );

          // Set default sub_branch if sub_branches is empty
          if (
            !headquarterBranch.sub_branches ||
            headquarterBranch.sub_branches.length === 0
          ) {
            const defaultSubBranch = {
              id: -1,
              name: headquarterBranch.name,
              picture: headquarterBranch.picture,
              is_default: true,
            };
            localStorageUtil.setItem(
              LOCAL_STORAGE_KEY.CURRENT_SUB_BRANCH,
              defaultSubBranch
            );
          }

          router.push(getHeadquartersOrderUrl()).then(() => hideSplashScreen());
          return;
        }

        if (branchList.length > 0) {
          router.push(chooseBranchUrl).then(() => hideSplashScreen());
          return;
        }
      }

      try {
        const accountInfoResp = await getAccountInfo();

        if (accountInfoResp.success) {
          setTimeout(() => {
            router
              .push(route.firstDisplayPageRef.current)
              .then(() => hideSplashScreen());
          }, 100);

          return;
        }
        // Case 3: UnAuth route - getAccountInfo failed, redirect to login
        handleLogoutAndRedirect({
          useRouter: true,
          router,
          onComplete: hideSplashScreen,
        });
      } catch (error) {
        // Case 4: UnAuth route - getAccountInfo error, redirect to login
        handleLogoutAndRedirect({
          useRouter: true,
          router,
          onComplete: hideSplashScreen,
        });
        logUtil.error(() => error);
      }
    })();

    /*
      Nhóm router cần hiển thị splash screen, lấy thông tin account, nếu success sẽ đứng tại trang hiện tại
    */
    (async () => {
      if (currentLinkType !== LinkTypeEnum.Auth) return;

      const urlCheckLoginToken = '/buy/user-favorite';
      const checkLoginToken =
        router.pathname === urlCheckLoginToken && router.query?.token;

      if (checkLoginToken) {
        callAppFunction(AppFunctionName.logger, 'remove branch 4');
        localStorageUtil.removeItem(LOCAL_STORAGE_KEY.BRANCHES);
        localStorageUtil.removeItem(LOCAL_STORAGE_KEY.CURRENT_BRANCH);
        localStorageUtil.removeItem(LOCAL_STORAGE_KEY.SUB_BRANCHES);
        localStorageUtil.removeItem(LOCAL_STORAGE_KEY.CURRENT_SUB_BRANCH);
        localStorageUtil.removeItem(LOCAL_STORAGE_KEY.ZALO_ORDER_TOKEN);
        // set language
        saveSettings({
          ...settings,
          language: router.query?.locale as LanguageEnum,
        });

        const API_BASE_URL = `${process.env.NEXT_PUBLIC_HOST_API}/web/${process.env.NEXT_PUBLIC_VERSION_API}`;
        const loginResp = await axios({
          url: `${API_BASE_URL}/guest/zalo-bot/login-by-token`,
          method: 'POST',
          data: {
            token: (router.query?.token as string) ?? '',
          },
        });
        const loginRespData: ResponseBaseFixed<IAuth> = loginResp.data;

        if (
          loginRespData.success &&
          loginRespData.data?.accessToken &&
          loginRespData.data?.user &&
          loginRespData.data?.branches &&
          loginRespData.data?.branches.length > 0
        ) {
          // set zalo order token
          localStorageUtil.setItem(
            LOCAL_STORAGE_KEY.ZALO_ORDER_TOKEN,
            (router.query?.token as string) ?? ''
          );

          // save token
          setAccessToken(loginRespData.data.accessToken);

          localStorageUtil.setItem(
            LOCAL_STORAGE_KEY.BRANCHES,
            loginRespData.data.branches
          );

          localStorageUtil.setItem(
            LOCAL_STORAGE_KEY.SUB_BRANCHES,
            loginRespData.data?.sub_branches
          );

          localStorageUtil.setItem(
            LOCAL_STORAGE_KEY.CURRENT_BRANCH,
            loginRespData.data?.branches[0]
          );

          localStorageUtil.setItem(
            LOCAL_STORAGE_KEY.CURRENT_SUB_BRANCH,
            loginRespData.data?.sub_branches[0]
          );
        } else {
          if (router.query?.token) {
            router.push(expiredTokenUrl).then(() => hideSplashScreen());
            return;
          }
        }
      }

      const accessToken = getAccessToken();

      if (!accessToken) {
        callAppFunction(AppFunctionName.logger, 'remove branch 5');
        localStorageUtil.removeItem(LOCAL_STORAGE_KEY.BRANCHES);
        localStorageUtil.removeItem(LOCAL_STORAGE_KEY.CURRENT_BRANCH);
        localStorageUtil.removeItem(LOCAL_STORAGE_KEY.SUB_BRANCHES);
        localStorageUtil.removeItem(LOCAL_STORAGE_KEY.CURRENT_SUB_BRANCH);
        // Case 5: Auth route - no accessToken, redirect to login
        handleLogoutAndRedirect({
          useRouter: true,
          router,
          onComplete: hideSplashScreen,
        });
        return;
      }

      const currentSubBranch = localStorageUtil.getItem<IBranch>(
        LOCAL_STORAGE_KEY.CURRENT_SUB_BRANCH
      );
      const currentBranch = localStorageUtil.getItem<IAuthBranch>(
        LOCAL_STORAGE_KEY.CURRENT_BRANCH
      );

      // Check if current branch is real headquarter - skip getAccountInfo
      if (currentBranch?.is_real_headquarter === true) {
        hideSplashScreen();
        return;
      }

      if (!currentSubBranch) {
        const branchList = await getBranches();

        if (branchList.length > 0) {
          const isChooseBranchPage = currentAsPath.startsWith(chooseBranchUrl);

          if (!isChooseBranchPage) {
            router.push(chooseBranchUrl).then(() => hideSplashScreen());
            return;
          }

          hideSplashScreen();
          return;
        }

        removeAccessToken();
        // Case 6: Auth route - no branches and no subBranch, redirect to login
        handleLogoutAndRedirect({
          useRouter: true,
          router,
          onComplete: hideSplashScreen,
        });
        return;
      }

      try {
        const accountInfoResp = await getAccountInfo();
        if (accountInfoResp.success) {
          const isChooseBranchPage = router.asPath.startsWith(chooseBranchUrl);
          if (isChooseBranchPage && !currentBranch) {
            setTimeout(() => {
              router
                .push(route.firstDisplayPageRef.current)
                .then(() => hideSplashScreen());
            }, 100);

            return;
          }

          if (checkLoginToken) {
            router.push(urlCheckLoginToken).then(() => hideSplashScreen());
          } else {
            hideSplashScreen();
          }
        } else {
          // Case 7: Auth route - getAccountInfo failed, redirect to login
          handleLogoutAndRedirect({
            useRouter: true,
            router,
            onComplete: hideSplashScreen,
          });
        }
      } catch (error) {
        // Case 8: Auth route - getAccountInfo error, redirect to login
        handleLogoutAndRedirect({
          useRouter: true,
          router,
          onComplete: hideSplashScreen,
        });
      }
    })();
  }, [router.isReady]);

  // What does this code do ?
  useEffect(() => {
    if (!router.isReady) return;
    dispatch(insertRouterHistory(router.asPath));
  }, [router.isReady, router.asPath]);

  // Check if current route is a POS-related route
  const isPOSRoute = useMemo(() => {
    const path = router.pathname;

    // Check for POS sales items route (must come before general pos-sales check)
    if (path === '/pos-sales/items' || path.startsWith('/pos-sales/items/')) {
      return {
        isPOSRoute: true,
        featureKey: 'pos-items' as const,
      };
    }

    // Check for other POS sales routes (list, detail, create, import, etc.)
    if (path === '/pos-sales' || path.startsWith('/pos-sales/')) {
      return {
        isPOSRoute: true,
        featureKey: 'pos-sales' as const,
      };
    }

    // Check for menu management routes
    if (path === '/menus' || path.startsWith('/menus/')) {
      return {
        isPOSRoute: true,
        featureKey: 'menu-management' as const,
      };
    }

    return {
      isPOSRoute: false,
      featureKey: null,
    };
  }, [router.pathname]);

  useEffect(() => {
    if (
      currentLinkType === LinkTypeEnum.Auth &&
      !showPermissionModal &&
      (!hasPermission || isStaffPermissionDenied)
    ) {
      setShowPermissionModal(true);
      router.push(getForbiddenUrl()).then(() => setShowPermissionModal(false));
    }
  }, [hasPermission, isStaffPermissionDenied]);

  // Check POS feature access and redirect to forbidden if disabled
  useEffect(() => {
    const forbiddenPath = getForbiddenUrl();
    const currentPath = router.asPath.split('?')[0];

    // Skip if not an auth route, not a POS route, or already on forbidden page
    if (
      currentLinkType !== LinkTypeEnum.Auth ||
      !isPOSRoute.isPOSRoute ||
      !router.isReady ||
      currentPath === forbiddenPath
    ) {
      return;
    }

    // Wait for menu display setting to be loaded
    if (!menuDisplaySetting) {
      return;
    }

    const posSetting = menuDisplaySetting.pos;

    // If POS main menu is disabled, redirect all POS routes
    if (!posSetting?.is_enable) {
      router.push(getForbiddenUrl());
      return;
    }

    // Check specific feature access
    if (isPOSRoute.featureKey) {
      const featureEnabled =
        posSetting.features[isPOSRoute.featureKey]?.is_enable;
      if (!featureEnabled) {
        router.push(getForbiddenUrl());
      }
    }
  }, [
    currentLinkType,
    isPOSRoute,
    menuDisplaySetting,
    router.isReady,
    router.pathname,
    router.asPath,
  ]);

  // Setup default layout
  const children = Component?.getLayout ? (
    Component?.getLayout(Element)
  ) : (
    <UserLayout>{hasPermission && Element}</UserLayout>
  );

  return (
    <ModalProvider>
      {currentLinkType === LinkTypeEnum.LandingPage ? (
        <Component {...pageProps} />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={
              isSplashScreenLoading
                ? MotionAnimationKeyEnum.Splash
                : MotionAnimationKeyEnum.Normal
            }
            initial={isSplashScreenLoading ? { opacity: 0.6 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {isSplashScreenLoading ? (
              <SplashScreen key={MotionAnimationKeyEnum.Splash} />
            ) : (
              <div key={MotionAnimationKeyEnum.Normal}>
                {children}
                <ApiError />
                <SubscriptionPlanPermissionModal />
                <AppDispatch />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </ModalProvider>
  );
};

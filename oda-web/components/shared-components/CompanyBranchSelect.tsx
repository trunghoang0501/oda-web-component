import { AddOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckIcon from '@mui/icons-material/Check';
import {
  Avatar,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Typography,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  useGetHeadquartersUsersCompanyListQuery,
  useGetUsersCompanyListQuery,
} from '@/apis';
import { ALL_PAGE } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import useMobileDetect from '@/hooks/useMobileDetect';
import { useRoute } from '@/hooks/useRoute';
import { useSettings } from '@/hooks/useSettings';
import { useAppSelector } from '@/hooks/useStore';
import { dispatch } from '@/store/app-dispatch';
import { appRunningProcess } from '@/store/slices/app';
import { userActions, userSelectors } from '@/store/slices/user';
import { IAuthBranch, ICompany, ISubBranch } from '@/types';
import { ROUTER_PATH, getAddBranchUrl, handleLogoutAndRedirect } from '@/utils';
import { APP_RUNNING_PROCESS_TYPE } from '@/utils/appRunningProcess';
import { IMAGE_DEFAULT, mediaMobileMax } from '@/utils/constants';
import { LOCAL_STORAGE_KEY, localStorageUtil } from '@/utils/localStorage';
import { getHeadquartersOrderUrl } from '@/utils/routing/headquarters';
import NextLink from './NextLink';

const CompanyBranchSelect = () => {
  const router = useRouter();
  const route = useRoute();
  const { t } = useTranslation();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { getAccountInfo } = useAuth();

  // Check if current route is headquarter page
  const isHeadquarterRoute =
    router.isReady && router.asPath.includes('/headquarters');

  // Use different API based on route
  const { data: companiesResp, isFetching: isCompaniesFetching } =
    useGetUsersCompanyListQuery(
      {
        page: ALL_PAGE,
        is_all_branch: true,
      },
      {
        skip: isHeadquarterRoute,
      }
    );

  const {
    data: headquartersCompaniesResp,
    isFetching: isHeadquartersCompaniesFetching,
  } = useGetHeadquartersUsersCompanyListQuery(
    {
      page: ALL_PAGE,
      is_all_branch: true,
    },
    {
      skip: !isHeadquarterRoute,
    }
  );

  const companies =
    (isHeadquarterRoute
      ? headquartersCompaniesResp?.data
      : companiesResp?.data) ?? [];

  const mobile = useMobileDetect();

  const currentBranch = localStorageUtil.getItem(
    LOCAL_STORAGE_KEY.CURRENT_BRANCH
  );

  const currentSubBranch = localStorageUtil.getItem(
    LOCAL_STORAGE_KEY.CURRENT_SUB_BRANCH
  );

  // Find selected company value
  // If in headquarter route and currentBranch has id = -1 and is_real_headquarter = true,
  // find company by is_real_headquarter flag instead of id
  const selectedCompanyValue =
    isHeadquarterRoute &&
    currentBranch?.id === -1 &&
    currentBranch?.is_real_headquarter === true
      ? companies.find((company) => company.is_real_headquarter === true)
      : companies.find((company) => company.id === currentBranch?.id);

  // If current branch is real headquarter, show company instead of sub branch
  const currentItem =
    isHeadquarterRoute && currentBranch?.is_real_headquarter === true
      ? selectedCompanyValue
      : currentSubBranch ?? selectedCompanyValue;

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState<IAuthBranch | null>(
    null
  );
  const [branches, setBranches] = useState<ISubBranch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSingleBranch, setIsSingleBranch] = useState(false);

  const { createBranch: hasPermissionCreateBranch } = useSelector(
    userSelectors.getUserPermissions
  );

  const runningProcess = useAppSelector(appRunningProcess);

  const isDisableCreateBranch =
    !hasPermissionCreateBranch ||
    (runningProcess &&
      runningProcess.some(
        (process) => process?.type === APP_RUNNING_PROCESS_TYPE.BRANCH
      ));

  useEffect(() => {
    // Only set selectedCompany from localStorage if it's not already set by user selection
    // This prevents overriding user's current selection
    if (selectedCompanyValue && !selectedCompany) {
      setSelectedCompany(selectedCompanyValue);
    }
  }, [
    selectedCompanyValue,
    isHeadquarterRoute,
    currentBranch,
    selectedCompany,
  ]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchTerm('');
  };

  const handleSelectCompany = (company: IAuthBranch) => {
    setSearchTerm('');
    setSelectedCompany(company);

    // Check if company is real headquarter and redirect
    if (company.is_real_headquarter === true) {
      // Set company to localStorage for headquarter (special case)
      dispatch(userActions.setCurrentBranch(company));
      localStorageUtil.setItem(LOCAL_STORAGE_KEY.CURRENT_BRANCH, company);
      localStorageUtil.setItem(
        LOCAL_STORAGE_KEY.SUB_BRANCHES,
        company.sub_branches || []
      );

      // Set a default sub_branch for headquarter company if sub_branches is empty
      if (!company.sub_branches || company.sub_branches.length === 0) {
        const defaultSubBranch: ISubBranch = {
          id: -1,
          name: company.name,
          picture: company.picture,
          is_default: true,
        };
        localStorageUtil.setItem(
          LOCAL_STORAGE_KEY.CURRENT_SUB_BRANCH,
          defaultSubBranch
        );
      }

      // Close popover and redirect to headquarter page
      handleClose();
      window.location.href = getHeadquartersOrderUrl();
      return;
    }

    const subBranches = company.sub_branches;
    const subBranchWithoutCompany = subBranches.filter((row) => row.id > 0);

    if (companies.length === 1 && subBranchWithoutCompany.length === 1) {
      setIsSingleBranch(true);
      return;
    }

    if (subBranchWithoutCompany.length === 1) {
      handleSelectBranch(subBranches[0], company);
    } else {
      setBranches(subBranches);
    }
  };

  const handleSelectBranch = async (
    branch: ISubBranch,
    company?: IAuthBranch
  ) => {
    // Find company from branch or use provided company
    let newCompany = company ?? selectedCompany;

    // If no company provided, try to find it from companies list
    if (!newCompany) {
      newCompany =
        companies.find(
          (c) =>
            !c.is_real_headquarter &&
            c.sub_branches?.some((b) => b.id === branch.id)
        ) ?? null;
    }

    if (!newCompany) {
      return;
    }

    try {
      // Set company to localStorage
      dispatch(userActions.setCurrentBranch(newCompany));
      localStorageUtil.setItem(LOCAL_STORAGE_KEY.CURRENT_BRANCH, newCompany);
      localStorageUtil.setItem(
        LOCAL_STORAGE_KEY.SUB_BRANCHES,
        newCompany.sub_branches || []
      );
      localStorageUtil.setItem(LOCAL_STORAGE_KEY.CURRENT_SUB_BRANCH, branch);

      // Close popover
      handleClose();

      // Get account info to refresh user data
      const accountInfoResp = await getAccountInfo();

      if (accountInfoResp.success) {
        // Redirect to normal user page with full reload to ensure all state is refreshed
        window.location.href = route.firstDisplayPageRef.current;
      } else {
        // Case 12: CompanyBranchSelect - getAccountInfo failed after selecting branch, redirect to login
        handleLogoutAndRedirect({
          useRouter: true,
          router,
        });
        enqueueSnackbar(
          t(
            'error:the_system_is_currently_experiencing_an_error_please_refresh_your_browser_or_contact_oda_team_for_support'
          ),
          {
            variant: 'error',
          }
        );
      }
    } catch (error) {
      // Case 13: CompanyBranchSelect - getAccountInfo error after selecting branch, redirect to login
      handleLogoutAndRedirect({
        useRouter: true,
        router,
      });
      enqueueSnackbar(
        t(
          'error:the_system_is_currently_experiencing_an_error_please_refresh_your_browser_or_contact_oda_team_for_support'
        ),
        {
          variant: 'error',
        }
      );
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (open && companies.length > 1) {
      setBranches([]);
    }
  }, [open]);

  useEffect(() => {
    if (companies.length === 1) {
      handleSelectCompany(companies[0]);
    }
  }, [companies]);

  return (
    <div>
      <Button
        onClick={handleClick}
        variant="outlined"
        endIcon={<ArrowDropDownIcon />}
        style={{
          textTransform: 'none',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
        }}
      >
        <Avatar
          src={currentItem?.picture || IMAGE_DEFAULT.COMPANY}
          alt={currentItem?.name}
          sx={{ width: 24, height: 24, marginRight: 1 }}
        />
        <Typography
          variant="body1"
          sx={{
            [mediaMobileMax]: {
              display: 'none',
            },
          }}
        >
          {currentItem?.name}
        </Typography>
      </Button>
      <Popover
        sx={{ display: isSingleBranch ? 'none' : 'block' }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box p={2} width="400px" maxWidth="100%">
          <Box px={2} pt={2}>
            {branches.length > 0 ? (
              <Box
                onClick={() => setBranches([])}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: 2,
                }}
              >
                <IconButton
                  sx={{
                    py: 0,
                    pl: 0,
                    display: companies.length > 1 ? 'block' : 'none',
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                  {t('branch')} ({branches.length})
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                {t('company')} ({companies.length})
              </Typography>
            )}
            <TextField
              fullWidth
              placeholder={
                branches.length > 0
                  ? t('search_branch_name')
                  : t('search_company_name')
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
              margin="dense"
            />
          </Box>
          <List
            style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '8px' }}
          >
            {branches.length > 0
              ? filteredBranches.map((branch, index) => {
                  // Find company that contains this branch to ensure we have the correct company
                  const branchCompany =
                    selectedCompany ||
                    companies.find(
                      (c) =>
                        !c.is_real_headquarter &&
                        c.sub_branches?.some((b) => b.id === branch.id)
                    );

                  // Check if both branch and parent company match
                  const isSelected =
                    currentSubBranch?.id === branch.id &&
                    currentBranch?.id === branchCompany?.id;

                  return (
                    <ListItem
                      button
                      key={branch.id}
                      onClick={() =>
                        handleSelectBranch(branch, branchCompany || undefined)
                      }
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: theme.spacing(14), // 56px
                        py: 0,
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          src={branch.picture || IMAGE_DEFAULT.COMPANY}
                          alt={branch.name}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={branch.name}
                        secondary={
                          branch.id < 0 ? (
                            <Chip
                              size="small"
                              label={t('company')}
                              sx={{ mt: 0.5 }}
                              component="span"
                            />
                          ) : null
                        }
                        secondaryTypographyProps={{
                          component: 'div',
                        }}
                      />
                      {isSelected && (
                        <CheckIcon
                          sx={{
                            color: theme.palette.success.main,
                            ml: 'auto',
                            fontSize: theme.spacing(5),
                          }}
                        />
                      )}
                    </ListItem>
                  );
                })
              : filteredCompanies.map((company) => {
                  const isDisabled =
                    mobile.isMobile() && company.is_real_headquarter === true;
                  const isSelected =
                    selectedCompanyValue?.id === company.id ||
                    (isHeadquarterRoute &&
                      company.is_real_headquarter === true &&
                      currentBranch?.is_real_headquarter === true);
                  return (
                    <ListItem
                      key={company.id}
                      sx={{
                        ...(isDisabled && {
                          opacity: 0.5,
                          cursor: 'not-allowed',
                          pointerEvents: 'none',
                        }),
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: theme.spacing(14), // 56px
                        py: 0,
                      }}
                    >
                      <ListItemButton
                        disabled={isDisabled}
                        onClick={() => {
                          if (!isDisabled) {
                            handleSelectCompany(company);
                          }
                        }}
                        sx={{
                          width: '100%',
                          minHeight: theme.spacing(14), // 56px
                          py: 0,
                        }}
                      >
                        <ListItemIcon>
                          <Avatar
                            src={company.picture || IMAGE_DEFAULT.COMPANY}
                            alt={company.name}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={company.name}
                          secondary={
                            company.is_real_headquarter === true ? (
                              <Chip
                                size="small"
                                label={t('headquarters')}
                                sx={{ mt: 0.5 }}
                                component="span"
                              />
                            ) : null
                          }
                          secondaryTypographyProps={{
                            component: 'div',
                          }}
                        />
                        {isSelected && (
                          <CheckIcon
                            sx={{
                              color: theme.palette.success.main,
                              ml: 'auto',
                              fontSize: theme.spacing(5),
                            }}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
          </List>
          {branches.length > 0 && (
            <Button
              variant="text"
              fullWidth
              sx={{
                color: theme.palette.customColors.colorCyan,
                justifyContent: 'flex-start',
                p: 4,
                flex: '0 1 auto',
              }}
              onClick={() => router.push(getAddBranchUrl())}
              disabled={isDisableCreateBranch}
            >
              <AddOutlined sx={{ mr: 2 }} /> {t('create_a_branch')}
            </Button>
          )}
          {branches.length > 0
            ? filteredBranches.length === 0 && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  No results found
                </Typography>
              )
            : filteredCompanies.length === 0 && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  No results found
                </Typography>
              )}
        </Box>
      </Popover>
    </div>
  );
};

export default CompanyBranchSelect;

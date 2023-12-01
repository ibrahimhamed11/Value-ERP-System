import BusinessIcon from '@mui/icons-material/Business';
import LanguageIcon from '@mui/icons-material/Language';
import LocationCityIcon from '@mui/icons-material/LocationCity';

export const companyOptions = [
  { value: 'company1', label: 'Company 1', icon: <BusinessIcon /> },
  { value: 'company2', label: 'Company 2', icon: <BusinessIcon /> },
  { value: 'company3', label: 'Company 3', icon: <BusinessIcon /> }
];

export const branchOptions = [
  { value: 'branch1', label: 'Branch 1', icon: <LocationCityIcon /> },
  { value: 'branch2', label: 'Branch 2', icosn: <LocationCityIcon /> },
  { value: 'branch3', label: 'Branch 3', icon: <LocationCityIcon /> }
];

export const languageOptions = [
  {
    value: 'ar',
    label: 'Arabic',
    icon: <LanguageIcon className="selectIcon" />
  },
  { value: 'en', label: 'English', icon: <LanguageIcon /> }
];

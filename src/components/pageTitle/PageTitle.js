import styled from '@emotion/styled';
import { Typography } from '@mui/material';

const StyledTypography = styled(Typography)`
  font-family: ${({ fontFamily }) => fontFamily || 'Roboto, sans-serif'};

  @media (max-width: 600px) {
    font-size: ${({ responsiveFontSize }) => responsiveFontSize || '28px'};
  }
`;

const PageTitle = ({ text, fontFamily, responsiveFontSize }) => (
  <StyledTypography variant="h1" fontFamily={fontFamily} responsiveFontSize={responsiveFontSize} sx={{my:0,fontWeight:"500"}}>
    {text}
  </StyledTypography>
);

export default PageTitle;

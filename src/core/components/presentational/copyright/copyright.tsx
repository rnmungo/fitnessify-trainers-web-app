import MuiTypography from '@mui/material/Typography';

interface CopyrightProps {
  enterprise?: string;
  startYear?: number;
}

const Copyright = ({ enterprise = '', startYear }: CopyrightProps) => {
  const currentYear = new Date().getFullYear();

  const year = startYear && startYear < currentYear ? `${startYear}-${currentYear}` : currentYear;

  return (
    <MuiTypography variant="body2" color="textSecondary" align="center">
      {`Copyright © ${enterprise} ${year}`}
    </MuiTypography>
  );
};

export default Copyright;

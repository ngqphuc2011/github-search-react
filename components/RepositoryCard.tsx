import { Box, Card } from '@mui/material';
import styled from 'styled-components';
import { IRepository } from '../types';
import { formatNumber } from '../utils/format-number';

const StyledPrimaryText = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;
const StyledEllipsisText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const StyledSecondaryText = styled.div`
  font-size: 12px;
`;

const RepositoryCard: React.FC<IRepository> = (props) => {
  return (
    <Card
      sx={{
        display: 'flex',
        borderRadius: '10px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          padding: '8px',
          justifyContent: 'space-between',
        }}
      >
        <StyledPrimaryText>
          <StyledEllipsisText>{props.name}</StyledEllipsisText>
        </StyledPrimaryText>
        <div>
          <StyledSecondaryText>
            {formatNumber(props.stars)} stars
          </StyledSecondaryText>
          <StyledSecondaryText>
            {formatNumber(props.forks)} forks
          </StyledSecondaryText>
        </div>
      </Box>
    </Card>
  );
};

export default RepositoryCard;

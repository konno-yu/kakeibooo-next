import { css, Theme } from '@emotion/react';
import Logo from '../../../images/icon.svg';

export const AppTitle = () => (
  <div css={container}>
    <img src={Logo} width={30} alt="logo" />
    <div css={title}>Kakeibooo</div>
  </div>
);

const container = (theme: Theme) => css`
  font-family: 'M PLUS Rounded 1c', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.units.px8};
`;

const title = (theme: Theme) => css`
  color: ${theme.colors.black_400};
  font-weight: ${theme.fontWeights.extraBold};
  font-size: ${theme.fontSizes.pt12};
`;

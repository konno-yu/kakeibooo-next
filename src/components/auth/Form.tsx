import { css, Theme, useTheme } from '@emotion/react';
import { ChangeEvent, useState } from 'react';
import { HiMail, HiKey } from 'react-icons/hi';
import { ApiError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../common/button/Button';
import { Input } from '../common/input/Input';
import ImagePath from '../../images/white_icon.svg';
import { useAppDispatch } from '../../store';
import { signIn } from '../../reducer/authSlice';

interface FormProps {
  error: ApiError | null | undefined;
}

export const Form = ({ error }: FormProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleOnChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleOnChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleLogin = async () => {
    await dispatch(signIn({ email: address, password })).then((res) => {
      if (res.payload) {
        navigate('/home');
      }
    });
  };

  return (
    <div css={loginForm}>
      <div css={icon}>
        <div css={circle}>
          <img
            src={ImagePath}
            alt="icon_circle"
            css={css`
              width: 60%;
              height: 60%;
            `}
          />
        </div>
      </div>
      <div css={title}>{t('WELCOME_BACK')}</div>
      <div css={input}>
        <Input
          width={280}
          icon={<HiMail color={theme.colors.black_400} />}
          value={address}
          onChange={handleOnChangeAddress}
          placeholder={t('MAIL_ADDRESS')}
        />
        <Input
          width={280}
          type="password"
          icon={<HiKey color={theme.colors.black_400} />}
          value={password}
          onChange={handleOnChangePassword}
          placeholder={t('PASSWORD')}
        />
        <div css={message}>{error && <span>{t('LOGIN_FAILURE')}</span>}</div>
      </div>
      <div css={btn}>
        <Button width="80%" variant="filled" color="normal" onClick={handleLogin} label={t('LOG_IN')} />
      </div>
    </div>
  );
};

const loginForm = (theme: Theme) => css`
  height: 500px;
  width: 350px;
  border: 1px solid ${theme.colors.gray_200};
  border-radius: ${theme.units.px8};
  padding: ${theme.units.px16};
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${theme.colors.white};
`;

const icon = css`
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const title = (theme: Theme) => css`
  font-family: 'M PLUS Rounded 1c', sans-serif;
  height: 10%;
  font-weight: ${theme.fontWeights.extraBold};
  font-size: ${theme.fontSizes.pt24};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${theme.colors.black_400};
`;

const input = css`
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const message = (theme: Theme) => css`
  height: 10%;
  width: 100%;
  font-size: ${theme.fontSizes.pt10};
  text-align: center;
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary_400};
`;

const btn = css`
  height: 20%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const circle = (theme: Theme) => css`
  background: ${theme.colors.primary_400};
  width: 90px;
  height: 90px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

import { css } from '@emotion/css';

export const app = css`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const section = css`
  flex: 1;
`;

export const buttonClass = css`
  border: 0;
  font-size: 3.7rem;
  border-right: 1px solid #858694;
  border-top: 1px solid #858694;
  flex: 1;
`;

export const getButtonColorClass = (operation: boolean) => css`
  ${operation ? 'background-color: #f5923e; color: white;' : 'background-color: #e0e0e0; color: black;'}
`;

export const getContainerWidthClass = (wide: boolean) => css`
  ${wide ? 'width: 75%;' : 'width: 25%;'}
`;

export const containerClass = css`
  height: 100%;
  display: inline-flex;
`;

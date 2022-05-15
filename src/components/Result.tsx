import { css } from '@emotion/css';

const getStyle = () => css`
  color: #fff;
  width: 100%;
  background: #858694;
  font-size: 6.25rem;
  text-align: right;
  height: 100%;
  flex: 1;
`;

const resultStyle = css`
  font-size: 6.25rem;
`;

const getInputStyle = (inputting: boolean) => css`
  font-size: 2.5rem;
  ${inputting &&
  `
      font-size: 6.25rem;
      margin-bottom: -.5rem;
    `}
`;

interface ResultProps {
  input: string;
  result: string;
}

const Result = ({ input, result }: ResultProps) => {
  const inputting = Boolean(input?.length && !result);
  return (
    <div className={`${getStyle()}`}>
      <div className={`${getInputStyle(inputting)}`}>{input}</div>
      {result && <div className={`${resultStyle}`}>{result}</div>}
    </div>
  );
};

export default Result;

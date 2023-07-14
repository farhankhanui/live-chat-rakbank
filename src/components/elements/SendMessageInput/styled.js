import styled from "styled-components";

const placeholder = (style) => {
    return {
        '&::-webkit-input-placeholder': style,
        '&::-moz-placeholder': style,
        '&:-ms-input-placeholder': style,
        '&:-moz-placeholder': style,
    };
};

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  border: none;
  resize: none;
  font-size: 16px;
  line-height: 22px;
  overflow: auto;
  height: auto;
  color: #3b3a3a;
  outline: none;
  placeholder({
    opacity: 0.2;
  });
`;

export const TextareaWrapper = styled.form`
  display: flex;
  align-items: center;
  margin: auto 24px 0 24px;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid ${props => (props.error ? "#e40202" : "#c8ced2")};
  &:last-child {
    margin-bottom: 24px;
  }
`;

export const StyledButton = styled.button`
  display: flex;
  margin-top: auto;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  transition: 0.2s;
  :active {
    opacity: 0.4;
  }
`;

export const StyledErrorWrapper = styled.div`
  margin: 5px 16px;
  width: 328px;
  box-sizing: border-box;
  border: none;
  resize: none;
  overflow: auto;
  outline: none;
`;

export const StyledError = styled.span`
  width: 100%;
  padding: 0;
  font-size: 10px;
  line-height: 12px;
  color: #e40202;
`;

import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { CONNECTED_STATUS, EMOJI_HANDLER } from "../../../constants";

import {
  TextareaWrapper,
  StyledButton,
  StyledTextarea,
  StyledError,
  StyledErrorWrapper
} from "./styled";

// import SendMessage  from "../../../assets/sendMessage.svg";

const MIN_ROWS = 1;
const MAX_ROWS = 5;
const TEXTAREA_LINE_HEIGHT = 22; //StyledTextarea line-height

function SendMessageInputScreen({ placeholder, chatInstance, application }) {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState(1);
  const [error, setError] = useState("");

  const handleChange = useCallback(event => {
    const previousRows = event.target.rows;
    event.target.rows = MIN_ROWS;

    const currentRows = ~~(event.target.scrollHeight / TEXTAREA_LINE_HEIGHT);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= MAX_ROWS) {
      event.target.rows = MAX_ROWS;
      event.target.scrollTop = event.target.scrollHeight;
    }

    setValue(event.target.value);
    setRows(Math.min(currentRows, MAX_ROWS));
    setError("");
  }, []);

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      const chat = chatInstance.getInstance();
      const isConnected = chat && chat.cometD.getStatus() === CONNECTED_STATUS;
      const message = application === 'Internet Banking' ? value.replace(EMOJI_HANDLER, '?') : value;
      if (isConnected && message && message.trim() !== '') {
        chat
          .sendChatMessage(message)
          .then(() => {
            setValue("");
            setRows(1);
          })
          .catch(e => {
            setError(e);
            console.warn("error " + e);
          });
      }
    },
    [chatInstance, value]
  );

  const handleKeyDown = useCallback(
    e => {
      if (e.keyCode === 13 && e.shiftKey === false) {
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  return (
    <>
      <TextareaWrapper onSubmit={handleSubmit} error={error}>
        <StyledTextarea
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <StyledButton type="submit">
          {/* <SendMessage /> */}
        </StyledButton>
      </TextareaWrapper>
      {error && (
        <StyledErrorWrapper>
          <StyledError>{error}</StyledError>
        </StyledErrorWrapper>
      )}
    </>
  );
}

SendMessageInputScreen.propTypes = {
  placeholder: PropTypes.string,
  chatInstance: PropTypes.func,
  application: PropTypes.string,
};

export const SendMessageInput = React.memo(SendMessageInputScreen);

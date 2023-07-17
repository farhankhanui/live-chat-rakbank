import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

// import User from "../../assets/user.svg";

const Container = styled.div`
  display: flex;
  flex-direction: ${({ incoming }) => (incoming ? "row-reverse" : "row")};
  justify-content: ${({ incoming }) => (incoming ? "flex-end" : "flex-end")};
  min-width: 202px;
  padding-top: 20px;
  margin-right: ${({ incoming }) => (incoming ? "auto" : "0")};
  margin-left: ${({ incoming }) => (incoming ? "0" : "auto")};
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ incoming }) => (incoming ? "flex-start" : "flex-end")};
  margin: 0 10px;
  max-width: 240px;
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    overflow-y: hidden;
  }
`;

const MessageStyled = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: auto;
  padding: 12px 16px;
  border-radius: 16px;
  background-color: ${({ incoming }) => (incoming ? "rgba(112, 112, 112, 0.15)" : "#3b3a3a")};
  font-size: 14px;
  font-weight: 600;
  color: ${({ incoming }) => (incoming ? "#3b3a3a" : "#fff")};
  overflow-wrap: break-word;
  white-space: normal !important;
`;

const DateStyled = styled.div`
  font-size: 12px;
  color: #263d4c;
  opacity: 0.5;
  margin-top: 5px;
`;

const Avatar = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background-color: ${({ incoming }) => (incoming ? "#ec2d1b" : "#3b3a3a")};
  font-size: 20px;
  text-transform: uppercase;
  line-height: 30px;
  color: #fff;
  border-radius: 100%;
`;

const Message = ({ body, date, incoming, name, style }) => (
  <Container incoming={incoming} style={style}>
    <MessageWrapper incoming={incoming}>
      <MessageStyled incoming={incoming}>{body}</MessageStyled>
      <DateStyled>{date}</DateStyled>
    </MessageWrapper>
    <Avatar incoming={incoming}>
      {incoming ? <></> : name ? name.charAt(0) : ""}
    </Avatar>
  </Container>
);

Message.propTypes = {
  body: PropTypes.string,
  date: PropTypes.string,
  incoming: PropTypes.bool
};

export { Message };

import React, { useState } from "react";
import * as S from "./style";
import styled from "styled-components";
import { idealList } from "../../constants/registerConstants";
import { useToggle } from "../../components/hooks/useToggle";
import { isMaxArrayReached } from "../../util/arrayUtils";
export const ModalIdeal = ({ formData, handleIdealClick }) => {
  const { ideal } = formData;
  const { opened, onOpen, onClose } = useToggle();
  const isMaxIdealReached = isMaxArrayReached(ideal, 5);

  return (
    <>
      <S.ToggleButtonWrapper>
        <S.ToggleButton onClick={onOpen}>나의 이상형은?</S.ToggleButton>
      </S.ToggleButtonWrapper>
      <S.Box>
        {opened && (
          <S.Modal>
            <h3 style={{ textAlign: "center" }}>이상형</h3>
            {isMaxIdealReached && (
              <p style={{ color: "red" }}>
                You can only select up to 5 Ideals.
              </p>
            )}
            <ButtonContainer>
              {idealList.map((elements, index) => (
                <ModalButton
                  key={index}
                  active={ideal.includes(elements)}
                  onClick={() => handleIdealClick(elements)}
                >
                  <div style={{ textAlign: "center" }}>{elements}</div>
                </ModalButton>
              ))}
            </ButtonContainer>
            <button onClick={onClose}>Close</button>
          </S.Modal>
        )}
        {ideal.length > 0 && (
          <S.HobbyBoxContainer>
            {ideal.map((item, index) => (
              <IdealBox key={index} style={{ marginLeft: "20px" }}>
                {item}
              </IdealBox>
            ))}
          </S.HobbyBoxContainer>
        )}
      </S.Box>
    </>
  );
};

const IdealBox = styled.div`
  width: 3.8rem;
  height: 2rem;
  border-radius: 2rem;
  background-color: rgb(248, 143, 255);
  /* margin: 0rem; */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 0.7rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  flex: 1;
`;
const ModalButton = styled.div`
  background-color: ${({ active }) => (active ? "#fa9393" : "white")};
  width: 3.5rem;
  /* height: 2rem; */
  border-radius: 1rem;
  padding: 10px;
  border: 1px solid black;
  cursor: pointer;
  font-size: 0.7rem;
`;

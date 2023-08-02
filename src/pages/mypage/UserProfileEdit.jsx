import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useToggle } from "../../components/hooks/useToggle";
import * as S from "./style";
import { mbtiList } from "../../constants/registerConstants";
import { ModalHobby } from "../register/ModalHobby";
import { ModalPersonality } from "../register/ModalPersonality";
import { ModalIdeal } from "../register/ModalIdeal";
import * as Api from "../../api";
import { showAlert, showSuccess } from "../../assets/alert";
import { DispatchContext } from "../../App";
const UserProfileEdit = ({ user }) => {
  const dispatch = useContext(DispatchContext);
  const { opened, onOpen, onClose } = useToggle();
  const [previewURL, setPreviewURL] = useState(null);
  const [selectedFile, setSelectedFile] = useState("phto.png");
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    // setErrorMessage("");
    setPreviewURL(URL.createObjectURL(file));
  };
  // const [imageUrl, handleImageUpload] = useState("");
  useEffect(() => {
    // Destructure the hobby, personality, and ideal properties from user
    const { hobby, personality, ideal } = user;

    // Create a new formData object by spreading the existing formData and
    // overwriting the hobby, personality, and ideal properties
    setFormData((prev) => ({
      ...prev,
      hobby: hobby || [],
      personality: personality || [],
      ideal: ideal || [],
    }));
  }, [user]);

  const [formData, setFormData] = useState({
    name: user.name || "",
    nickname: user?.nickname || "",
    password: user.password,
    gender: user?.gender || "",
    birthdate: user.birthdate,
    job: user?.job || "",
    region: user?.region || "",
    height: user?.height || "",
    mbti: user?.mbti || "",
    hobby: user?.hobby || [],
    personality: user?.personality || [],
    ideal: user?.ideal || [],
    introduce: user?.introduce || "",
  });
  const {
    name,
    nickname,
    password,
    gender,
    birthdate,
    job,
    region,
    height,
    mbti,
    introduce,
  } = formData;
  // console.log(formData); //onChange 할때마다 렌더링 새로되는듯

  const onChange = (e) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onArrayChange = (array, element, arrayPropertyName, maxLimit) => {
    setFormData((prev) => {
      const newArray = array.includes(element)
        ? array.filter((e) => e !== element)
        : [...array, element];

      if (newArray.length > maxLimit) {
        newArray.splice(maxLimit);
      }
      return {
        ...prev,
        [arrayPropertyName]: newArray,
      };
    });
  };

  const handleHobbyClick = (element) => {
    onArrayChange(formData.hobby, element, "hobby", 5);
  };

  const handlePersonalityClick = (element) => {
    onArrayChange(formData.personality, element, "personality", 5);
  };

  const handleIdealClick = (element) => {
    onArrayChange(formData.ideal, element, "ideal", 5);
  };
  const updatedHobby =
    formData.hobby && formData.hobby.length > 0
      ? formData.hobby
      : user.hobby !== undefined
      ? user.hobby
      : [];
  const updatedPersonality =
    formData.personality && formData.personality.length > 0
      ? formData.personality
      : user.personality !== undefined
      ? user.personality
      : [];
  const updatedIdeal =
    formData.ideal && formData.ideal.length > 0
      ? formData.ideal
      : user.ideal !== undefined
      ? user.ideal
      : [];
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (selectedFile) {
        const formImgData = new FormData();
        formImgData.append("image", selectedFile);
        response = await Api.post("files", formImgData);
      }
      const requestData = await Api.put("users/mypage", {
        nickname: formData.nickname === "" ? user.nickname : formData.nickname,
        job: formData.job === "" ? user.job : formData.job,
        region: formData.region === "" ? user.region : formData.region,
        mbti: formData.mbti === "" ? user.mbti : formData.mbti,
        height: formData.height === "" ? user.height : formData.height,
        hobby: updatedHobby,
        personality: updatedPersonality,
        ideal: updatedIdeal,
        introduce:
          formData.introduce === "" ? user.introduce : formData.introduce,
        profileImage: ["profile", response.data],
      });
      if (requestData.status === 200) {
        showSuccess("변경된 정보가 저장되었습니다.");
        const userData = await Api.get("users/mypage");
        const user = userData.data;

        dispatch({
          type: "UPDATE_USER",
          payload: user,
        });
        onClose();
        // window.location.replace("/mypage");
      } else {
        showAlert("정보 변경에 실패했습니다.");
      }
    } catch (err) {
      // showAlert(err.response.data.message);
      console.log(err.response);
    }
  };

  return (
    <>
      <S.ToggleButton style={{ textAlign: "center" }} onClick={() => onOpen()}>
        정보 수정하기
      </S.ToggleButton>
      {opened && (
        <S.Modal style={{ marginTop: "200px" }}>
          {/* <ProfilePicture
            src="https://ojsfile.ohmynews.com/STD_IMG_FILE/2018/1002/IE002401068_STD.jpg"
            alt="Profile Picture"
          /> */}

          <S.Box>
            <S.Heading>Name: {user.name}</S.Heading>
          </S.Box>
          <S.Box>
            <S.Heading>닉네임</S.Heading>
            <S.Input
              name="nickname"
              value={nickname}
              placeholder={user.nickname}
              onChange={onChange}
            />
          </S.Box>
          <S.Box>
            <S.Heading>비밀번호</S.Heading>
            <S.Input name="password" value={password} onChange={onChange} />
          </S.Box>

          <S.Box>
            <S.Heading>직업</S.Heading>
            <S.Input
              name="job"
              value={job}
              placeholder={user.job}
              onChange={onChange}
            />
          </S.Box>
          <S.Box>
            <S.Heading>지역</S.Heading>
            <S.Input
              name="region"
              value={region}
              placeholder={user.region}
              onChange={onChange}
            />
          </S.Box>
          <S.Heading>사진</S.Heading>
          <S.Box>
            <S.Input type="file" onChange={handleFileChange} />
          </S.Box>
          {selectedFile && (
            <div>
              <h6>미리보기</h6>
              <img
                src={previewURL}
                alt="Selected Image"
                style={{ width: "50%" }}
                thumbnail
              />
            </div>
          )}
          <S.Box>
            <S.Heading>키</S.Heading>
            <S.Input
              name="height"
              value={height}
              placeholder={user.height}
              onChange={onChange}
            />
          </S.Box>
          <S.Box>
            <S.Heading>mbti</S.Heading>
            <S.Select
              name="mbti"
              value={mbti}
              placeholder={user.mbti}
              onChange={onChange}
            >
              <option>{user.mbti}</option>
              {mbtiList.map((mbti) => (
                <option key={mbti} value={mbti}>
                  {mbti}
                </option>
              ))}
            </S.Select>
          </S.Box>
          <ModalHobby formData={formData} handleHobbyClick={handleHobbyClick} />
          <ModalPersonality
            formData={formData}
            handlePersonalityClick={handlePersonalityClick}
          />
          <ModalIdeal formData={formData} handleIdealClick={handleIdealClick} />

          <S.Heading>한줄 자기소개</S.Heading>
          <S.Box>
            <S.Input name="introduce" value={introduce} onChange={onChange} />
          </S.Box>

          <button onClick={handleSubmit}>정보 수정하기</button>
          <button onClick={onClose}>Close</button>
        </S.Modal>
      )}
    </>
  );
};
export default UserProfileEdit;
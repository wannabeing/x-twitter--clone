import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;
const Left = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 50px;
  padding: 20% 0;
`;
const Logo = styled.div`
  width: 50px;
  height: 50px;
  background-color: red;
`;
const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  padding-bottom: 10%;
`;
const SubTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  padding-bottom: 8%;
`;
const ThirdTitle = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  padding-bottom: 20px;
`;

const BtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min-content;
  padding-bottom: 50px;
`;
const Btn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  padding: 10px;
  background-color: white;
  color: black;
  font-weight: bold;
  border-radius: 15px;
`;
const BtnLine = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const LineText = styled.span`
  font-size: 12px;
  white-space: nowrap;
`;
const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: white;
`;
const LoginWrapper = styled.div``;

export default function Logout() {
  return (
    <>
      <Wrapper>
        <Left>
          <Logo />
        </Left>
        <Right>
          <Title>지금 일어나고 있는 일</Title>
          <SubTitle>지금 가입하세요.</SubTitle>
          <BtnWrapper>
            <Btn>Google로 가입하기</Btn>
            <Btn>Github로 가입하기</Btn>
            <BtnLine>
              <Line />
              <LineText>또는</LineText>
              <Line />
            </BtnLine>
            <Btn>계정 만들기</Btn>
          </BtnWrapper>
          <LoginWrapper>
            <ThirdTitle>이미 트위터에 가입하셨나요?</ThirdTitle>
            <Btn>로그인</Btn>
          </LoginWrapper>
        </Right>
      </Wrapper>
    </>
  );
}

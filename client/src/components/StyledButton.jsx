import styled from "styled-components";

const StyledButton = ({ text = "HOVER" }) => {
  return (
    <StyledWrapper>
      <div className="button">
        {text.split("").map((char, index) => (
          <div
            className="box"
            key={index}
            data-letter={char}
            data-direction={index % 2 === 0 ? "down" : "up"} // alternate directions
          >
            {char}
          </div>
        ))}
      </div>
    </StyledWrapper>
  );
};

export default StyledButton;

const StyledWrapper = styled.div`
  .button {
    display: flex;
  }

  .box {
    width: 35px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    position: relative;
    background: rgb(58, 165, 253);
    cursor: pointer;
    overflow: hidden;
  }

  /* Base hover layer */
  .box::before {
    content: attr(data-letter);
    position: absolute;
    inset: 0;
    background: #0f0f0f;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.4s;
  }

  /* DOWN = come from below */
  .box[data-direction="down"]::before {
    transform: translateY(100%);
  }

  /* UP = come from above */
  .box[data-direction="up"]::before {
    transform: translateY(-100%);
  }

  /* Hover brings the overlay into view */
  .button:hover .box::before {
    transform: translateY(0);
  }
`;

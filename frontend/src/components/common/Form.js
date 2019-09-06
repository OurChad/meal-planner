import styled from 'styled-components';

const Form = styled.form`
  fieldset {
    border: none;
    margin: 0;
    padding: 0;
  }
  
  button {
    width: auto;
    background: ${(props) => props.theme.primaryGreen};
    color: white;
    border: 0;
    font-size: 1.5rem;
    padding: 0.5rem 1.2rem;
  }
`;

export default Form;

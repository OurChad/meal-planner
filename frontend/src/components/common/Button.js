import styled from 'styled-components';

const Button = styled.button`
    width: auto;
    background: ${(props) => (props.primary ? props.theme.primaryGreen : props.theme.secondaryDark)};
    color: white;
    border: 0;
    font-size: 1.2rem;
    padding: 0.5rem 1.2rem;
    border-radius: 4px;
    outline: none;

    &:hover {
        background: ${(props) => (props.primary ? props.theme.secondaryGreen : props.theme.primaryDark)};
    }
`;

export default Button;

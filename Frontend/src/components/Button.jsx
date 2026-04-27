import { useContext } from "react";
import { buttonContext } from "../buttonContext";

const Button = ({ type= "button", className, disabled, ...rest}) => {
  const { label } = useContext(buttonContext);

  return (
    <button type={type} disabled={disabled} {...rest} style={{ padding: '15px 30px' }} className={`bg-[#1E2753] cursor-pointer block text-white ${className}`}>
      {label}
    </button>
  );
};

export default Button;

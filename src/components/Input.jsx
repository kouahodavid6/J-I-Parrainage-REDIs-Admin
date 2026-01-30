import PropTypes from "prop-types";

const Input = ({ type, placeholder, className, ...props }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`w-full px-4 py-2 border border-[#105bff] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 mt-1 ${className}`}
            {...props}
        />
    );
};

Input.propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

export default Input;
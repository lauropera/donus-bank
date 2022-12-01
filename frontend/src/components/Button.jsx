import { string, func } from 'prop-types';

function Button({ text, type, customStyle, handleClick }) {
  return (
    <button
      className={`w-full bg-emerald-600 hover:bg-emerald-800
    text-white font-bold py-2 px-4 mb-6
      rounded transition-all ${customStyle}`}
      type={type}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}

Button.defaultProps = {
  customStyle: '',
  handleClick: () => {},
};

Button.propTypes = {
  text: string.isRequired,
  type: string.isRequired,
  customStyle: string,
  handleClick: func,
};

export default Button;

import { string, any } from 'prop-types';

function ActionButton({ color, icon, text }) {
  return (
    <div
      className={`text-slate-900 font-medium
    flex flex-col items-center gap-1`}
    >
      <button
        aria-label={text}
        className={`${color} text-slate-100 text-center
        py-2 px-4 rounded-full h-14 w-14 inline-flex items-center`}
        type='button'
      >
        {icon}
      </button>
      <p>{text}</p>
    </div>
  );
}

ActionButton.propTypes = {
  color: string.isRequired,
  icon: any.isRequired,
  text: string.isRequired,
};

export default ActionButton;

const Input = ({
  className,
  placeholder,
  type,
  name,
  disable = false,
  value,
}) => {
  return (
    <div className="relative w-[100%] mb-4">
      <input
        type={type}
        className={className}
        placeholder={placeholder}
        name={name}
        disabled={disable}
        value={value}
      ></input>
    </div>
  );
};
export default Input;

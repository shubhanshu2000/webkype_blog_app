import Select from "react-select";

type MultiSelectPropTypes = {
  options: { label: ""; value: "" }[];
  onChange: () => void;
  value: { label: ""; value: "" }[];
};

const MultiSelect = ({ options, onChange, value }: MultiSelectPropTypes) => (
  <Select
    isMulti
    name="colors"
    options={options}
    onChange={onChange}
    value={value}
    className="basic-multi-select"
    classNamePrefix="select"
  />
);

export default MultiSelect;

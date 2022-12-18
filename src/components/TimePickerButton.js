import TimePicker from "react-time-picker";
import { useState } from "react";

const TimePickerButton = props => {
  const [value, onChange] = useState("00:00");
  const index = props.index;
  const id = props.id;

  if (props.isEndTime) {
    return (
      <div>
        <TimePicker locale="fi" onChange={onChange} value={value} />
        <button onClick={() => props.sendEndTime(id, value, index)}>
          send
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <TimePicker locale="fi" onChange={onChange} value={value} />
        <button onClick={() => props.sendStartTime(id, value, index)}>
          send
        </button>
      </div>
    );
  }
};

export default TimePickerButton;

import DateTimePicker from "react-datetime-picker";
import { useState, useEffect } from "react";
import taskService from "../services/taskService";
import {
  differenceInMinutes,
  parseJSON,
  compareAsc,
  compareDesc,
} from "date-fns";

const Time = () => {
  // Set starting time to zero:
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // starttime start of today:
  const [startTime, onChangeStart] = useState(new Date(today));
  const [endTime, onChangeEnd] = useState();
  const [tasks, setTasks] = useState([]);

  // Two for loops to find all unique contexts from tasks:
  const contexts = [];
  tasks.forEach(task => {
    task.contexts.forEach(context => {
      !contexts.includes(context) && contexts.push(context);
    });
  });

  // First page load -> get tasks from db.json
  useEffect(() => {
    taskService.getAll().then(res => setTasks(res.data));
  }, []);

  /*
    Compare difference in minutes to timer end match. index is same. 
    Special case: if timer is now active, compare to current time instead of 
    timer end.
    Condition: time start must be after current starting time (state)
    and time start must be before end time.
    return the total active time of this task after time start:
  */
  const calculateActiveTime = task => {
    let totalActiveSum = 0;
    task.timerStarts.map(
      (timeStart, index) =>
        /* User's parameters applied here. */
        compareAsc(parseJSON(timeStart), startTime) === 1 &&
        compareDesc(parseJSON(timeStart), endTime) !== -1 &&
        (totalActiveSum += differenceInMinutes(
          /* Special case: if timer active(no end time): use time now */
          parseJSON(task.timerEnds[index] || parseJSON(new Date())),
          parseJSON(timeStart)
        ))
    );
    return totalActiveSum;
  };

  const calculateTimeForContext = context => {
    let totalContextTime = 0;
    tasks.map(task => {
      task.contexts.includes(context) &&
        (totalContextTime += calculateActiveTime(task));
    });
    return totalContextTime;
  };

  return (
    <div>
      <h3>Time</h3>
      Start time:
      <DateTimePicker locale="fi" onChange={onChangeStart} value={startTime} />
      <br />
      <br />
      End time:
      <DateTimePicker locale="fi" onChange={onChangeEnd} value={endTime} />
      <br />
      <br />
      <ol>
        <h4>Time active between start and end time for each task:</h4>
        {tasks.map(
          task =>
            calculateActiveTime(task) > 0 && (
              <li key={task.id}>
                {task.name}
                <br />
                Time active: {calculateActiveTime(task)} min
                <br />
              </li>
            )
        )}
      </ol>
      <ol>
        <h4>Time active between start and end time for each context:</h4>
        {/* For each context iterate all tasks: if matches, add time to sum */}
        {contexts.map(
          context =>
            calculateTimeForContext(context) > 0 && (
              <li key={context}>
                {context}
                <br />
                Time active: {calculateTimeForContext(context)} min
                <br />
              </li>
            )
        )}
      </ol>
    </div>
  );
};

export default Time;

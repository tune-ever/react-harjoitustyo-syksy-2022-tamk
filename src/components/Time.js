import DateTimePicker from "react-datetime-picker";
import TimePicker from "react-time-picker";
import { useState, useEffect } from "react";
import taskService from "../services/taskService";
import {
  differenceInMinutes,
  parseJSON,
  compareAsc,
  compareDesc,
} from "date-fns";
import TimePickerButton from "./TimePickerButton.js";

const Time = () => {
  // Set starting time to zero:
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // starttime start of today:
  const [startTime, onChangeStart] = useState(new Date(today));
  const [endTime, onChangeEnd] = useState();
  const [intervalTimes, onChange] = useState([]);

  // tasks
  const [tasks, setTasks] = useState([]);

  // showInterval Index:
  const [showIntervalIndex, setShowIntervalIndex] = useState([]);

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

  // Function to send new interval time: same logic as adding context:
  const sendEndTime = (id, time, index) => {
    const newTasksArray = [];
    // Iterate tasks, find match, add the new time
    tasks.forEach(task => {
      if (task.id === id) {
        // edited date:
        let date = parseJSON(task.timerEnds[index]);
        date.setHours(time.slice(0, 2), time.slice(3, 5), 0);
        task.timerEnds[index] = date;
        // Update this specific task in db: sends new timer event
        taskService.updateById(id, task);
      }
      newTasksArray.push(task);
    });
    setTasks(newTasksArray);
  };

  // Function to send new interval time: same logic as adding context:
  const sendStartTime = (id, time, index) => {
    const newTasksArray = [];
    // Iterate tasks, find match, add the new time
    tasks.forEach(task => {
      if (task.id === id) {
        // edited date:
        let date = parseJSON(task.timerStarts[index]);
        date.setHours(time.slice(0, 2), time.slice(3, 5), 0);
        task.timerStarts[index] = date;
        // Update this specific task in db: sends new timer event
        taskService.updateById(id, task);
      }
      newTasksArray.push(task);
    });
    setTasks(newTasksArray);
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
        {tasks.map((task, index) => (
          <li key={task.id}>
            {task.name}
            <br />
            Time active:{" "}
            {calculateActiveTime(task) > 60
              ? (calculateActiveTime(task) / 60).toFixed(0) + " h"
              : calculateActiveTime(task) + " min"}
            <br />
            {showIntervalIndex !== index && (
              <button onClick={() => setShowIntervalIndex(index)}>
                Show intervals
              </button>
            )}
            {showIntervalIndex === index && (
              <button onClick={() => setShowIntervalIndex("")}>
                Hide intervals
              </button>
            )}
            {/* Listing intervals: apply filters too: 
                    Complicated code here: apply filters, count differences
                    using date-fns here.
                */}
            {showIntervalIndex === index &&
              task.timerStarts.map(
                (timerStart, index) =>
                  compareAsc(parseJSON(timerStart), startTime) === 1 &&
                  compareDesc(parseJSON(timerStart), endTime) !== -1 && (
                    <div key={index}>
                      <br />
                      <strong>task interval</strong>
                      <br />
                      {new Date(timerStart).toString().slice(0, 24)}
                      <br />
                      - edit start time:
                      <TimePickerButton
                        time={timerStart}
                        index={index}
                        id={task.id}
                        sendStartTime={sendStartTime}
                        sendEndTime={sendEndTime}
                      />
                      {task.timerEnds[index]
                        ? new Date(task.timerEnds[index])
                            .toString()
                            .slice(0, 24)
                        : "active now"}
                      <br />
                      - edit end time:
                      <TimePickerButton
                        time={task.timerEnds[index]}
                        isEndTime={true}
                        index={index}
                        id={task.id}
                        sendStartTime={sendStartTime}
                        sendEndTime={sendEndTime}
                      />
                      {task.timerEnds[index]
                        ? differenceInMinutes(
                            parseJSON(task.timerEnds[index]),
                            parseJSON(timerStart)
                          ) > 60
                          ? (
                              differenceInMinutes(
                                parseJSON(task.timerEnds[index]),
                                parseJSON(timerStart)
                              ) / 60
                            ).toFixed(0) + "h"
                          : differenceInMinutes(
                              parseJSON(task.timerEnds[index]),
                              parseJSON(timerStart)
                            ) + "min"
                        : differenceInMinutes(
                            parseJSON(parseJSON(new Date())),
                            parseJSON(timerStart)
                          )}
                    </div>
                  )
              )}
            <br />
          </li>
        ))}
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
                Time active:{" "}
                {calculateTimeForContext(context) > 60
                  ? (calculateTimeForContext(context) / 60).toFixed(0) + " h"
                  : calculateTimeForContext(context) + " min"}
                <br />
              </li>
            )
        )}
      </ol>
    </div>
  );
};

export default Time;

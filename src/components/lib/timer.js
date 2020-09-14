import React, {useEffect, useState} from 'react';

const Timer = (props) => {
  const [deadline, setDeadline] =
      useState((props.deadline - new Date().getTime()) / 1000);

  useEffect(() => {
    deadline > 0 && setTimeout(() => setDeadline(deadline - 1), 1000);
  }, [deadline]);

  const getDeadline = () => {
    if (deadline < 0) setDeadline(0);
    const days = Math.floor(deadline / 86400);
    let left = deadline - days * 86400;
    const hours = Math.floor(left / 3600);
    left -= hours * 3600;
    const minutes = Math.floor(left / 60);
    left -= minutes * 60;
    const seconds = Math.floor(left);

    return fTime(days) + ':' + fTime(hours) + ':' + fTime(minutes) + ':' +
        fTime(seconds);
  };

  return (
      <span className={props.className}>{getDeadline()}</span>
  );
};

function fTime(time) {
  return ('0' + time).slice(-2);
}

export default Timer;

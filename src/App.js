import "./App.css";
import { useEffect, useRef, useState } from "react";
import { timer, fromEvent } from "rxjs";
import { timeInterval } from "rxjs/operators";
const observable = timer(1, 1000);
let subscription;
let waitButtonSubscription;
function App() {
  const waitRef = useRef(); //reference for fromEvent operator
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [timeString, setTimeString] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(0); //time since 0 seconds
  const [waitWasClicked, setwaitWasClicked] = useState(false);
  //Stop/Start button func

  const timerStart_Stop = () => {
    if (subscription?.closed || subscription === undefined) {
      //testing if no subscription/subscription is closed
      if (waitWasClicked) {
        subscription = observable.subscribe((t) => {
          setTimeInSeconds(t + timeElapsed);
        });
      } else {
        subscription = observable.subscribe((t) => {
          setTimeInSeconds(t);
        });
      }
    } else {
      //if timer is on stop and set to 0
      setwaitWasClicked(false);
      subscription.unsubscribe();
      setTimeInSeconds(0);
    }
  };

  //reset button func

  const timerReset = () => {
    subscription.unsubscribe();
    setwaitWasClicked(false);
    subscription = observable.subscribe((t) => {
      setTimeInSeconds(t);
    });
  };

  //wait button func

  useEffect(() => {
    waitButtonSubscription = fromEvent(waitRef.current, "mousedown")
      .pipe(timeInterval())
      .subscribe((i) => {
        console.log(i.interval);
        if (i.interval < 300) {
          setTimeElapsed(timeInSeconds);
          setwaitWasClicked(true);
          subscription.unsubscribe();
        }
      });
    return () => waitButtonSubscription.unsubscribe();
  }, [timeInSeconds]);

  //Time string update

  useEffect(() => {
    setTimeString(new Date(timeInSeconds * 1000).toISOString().substr(11, 8));
  }, [timeInSeconds]);
  return (
    <div className="App">
      <div className="clock">{timeString}</div>
      <button onClick={timerStart_Stop} className="start">
        Start/Stop
      </button>
      <button ref={waitRef} className="wait">
        Wait
      </button>
      <button onClick={timerReset} className="reset">
        Reset
      </button>
    </div>
  );
}

export default App;

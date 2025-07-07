// import { AppProviders } from "./providers/app-providers"
// import { AppRouter } from "./components/routing/app-router"

import {useCallback, useEffect, useRef, useState} from "react";

function App() {
    const [duration, setDuration] = useState(60);
    const [timerCount, setTimerCount] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);

    const timerRef = useRef<any>();

    const startTimer = useCallback(() => {
        clearInterval(timerRef.current);
        setTimerCount(duration);

        setIsRunning(true);
        timerRef.current = setInterval(() => {
            setTimerCount(prevState => {
                const nValue = prevState - 1;
                return nValue < 0 ? 0 : nValue;
            });
        }, 1000);
    }, [duration]);

    const resetTimer = useCallback(() => {
        clearInterval(timerRef.current);
        setTimerCount(duration);
        setIsRunning(false);
    }, [duration, setTimerCount, setIsRunning])

    useEffect(() => {
        if (timerCount <= 0) {
            clearInterval(timerRef.current);
            setIsRunning(false);
        }
    }, [timerCount]);

    useEffect(() => {
        if (isRunning && duration < timerCount) {
            resetTimer();
            alert("Duration is less than the current timer value")
        } else if (isRunning) {
            startTimer();
        }
    }, [duration, isRunning, startTimer]);

    const handleButtonClick = useCallback(() => {
        isRunning ? resetTimer() : startTimer();
    }, [startTimer, isRunning, resetTimer])

    return (
        // <AppProviders>
        //     <AppRouter />
        // </AppProviders>

        <div className="w-full max-w-lg mx-auto my-20 border p-10">
            <p>Timer</p>
            <div>
                <p>Elapsed Time</p>
                <div className="relative w-full h-10 border border-slate-300 rounded overflow-hidden">
                    <div style={{width: `${(duration - timerCount) / duration * 100}%`}}
                         className="bg-blue-500 h-full absolute left-0 top-0 z-[1]"/>
                    <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-[2]">{timerCount.toFixed(1).replace('.0', '')}s</p>
                </div>
            </div>
            <div>
                <p>Duration</p>
                <input
                    type='range' value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    min={10}
                    max={120}
                    step={0.1}
                />
            </div>

            <button onClick={handleButtonClick} className="bg-blue-400 rounded-full flex items-center justify-center h-10 mt-6 text-white w-full">{isRunning ? "Reset" : "Start"}</button>
        </div>
    )
}

export default App

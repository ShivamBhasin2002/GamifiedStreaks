import { useState, useEffect, useRef } from "react";
import {
  Input,
  Progress,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { FaPlus, FaCheck } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

function App() {
  const [show, setShow] = useState(false);
  const [challenges, setChallenges] = useState(
    localStorage.getItem("challenges") === undefined
      ? []
      : JSON.parse(localStorage.getItem("challenges"))
  );
  useEffect(() => {
    if (challenges)
      localStorage.setItem("challenges", JSON.stringify(challenges));
  }, [challenges, setChallenges]);
  const challengeName = useRef(null);
  const challengeDuration = useRef(null);
  return (
    <div className="min-h-screen w-screen bg-amber-400 overflow-hidden">
      <header className="flex flex-row bg-black/5 h-[60px] border-b-2 border-b-white/20 justify-center">
        <div className="w-[600px] px-8 flex items-center justify-between">
          <span className="text-lg md:text-3xl font-bold">
            Gamified Streaks
          </span>
          <FaPlus
            className="px-1 border-4 border-black cursor-pointer hover:bg-black hover:text-white "
            onClick={() => setShow((prevState) => !prevState)}
            size="2rem"
          />
        </div>
      </header>
      <main className="flex flex-col w-[700px] mx-auto gap-2 p-4">
        {show && (
          <section className="bg-transparent/20 p-4 rounded-xl border-black/80 border-4">
            <div className="flex justify-between w-full items-center gap-4">
              <Input
                placeholder="Basic usage"
                variant="flushed"
                borderColor="black"
                _placeholder={{ opacity: 0.5, color: "black" }}
                ref={challengeName}
              />
              <NumberInput
                size="md"
                maxW={20}
                defaultValue={1}
                min={1}
                allowMouseWheel
                borderColor="black"
              >
                <NumberInputField ref={challengeDuration} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FaCheck
                className="px-1 border-4 border-black cursor-pointer hover:bg-black hover:text-white "
                onClick={() => {
                  setChallenges((prevState) =>
                    prevState
                      ? [
                          ...prevState,
                          {
                            name: challengeName.current.value,
                            duration: parseInt(challengeDuration.current.value),
                            currentDay: Date.now(),
                            streak: 0,
                          },
                        ]
                      : [
                          {
                            name: challengeName.current.value,
                            duration: parseInt(challengeDuration.current.value),
                            currentDay: Date.now(),
                            streak: 0,
                          },
                        ]
                  );
                  challengeName.current.value = "";
                  challengeDuration.current.value = 1;
                  setShow(false);
                }}
                size="2rem"
              />
            </div>
          </section>
        )}
        <article className="flex flex-col-reverse gap-4">
          {challenges &&
            challenges.map((challenge, i) => {
              let failed = (Date.now() - challenge.currDay) / 86400000 > 1.5;
              let complete = challenge.streak >= challenge.duration;
              return (
                <section
                  key={i}
                  className={`flex flex-col ${
                    complete
                      ? "bg-green-500"
                      : failed
                      ? "bg-red-500"
                      : "bg-transparent/20"
                  } p-4 rounded-xl border-black/40 border-4 gap-4`}
                >
                  <div className="flex flex-row justify-between">
                    <span>{challenge.name}</span>
                    <span>
                      {challenge.streak} / {challenge.duration}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between gap-4 items-center">
                    <Progress
                      className="border-[1px] border-black flex-grow"
                      colorScheme="green"
                      size="md"
                      hasStripe
                      value={(challenge.streak / challenge.duration) * 100}
                    />
                    {(failed || !complete) && (
                      <FaPlus
                        className="px-1 border-4 border-black cursor-pointer hover:bg-black hover:text-white "
                        onClick={() => {
                          setChallenges((prevState) => {
                            const streak = prevState[i].streak;
                            return [
                              ...prevState.slice(0, i),
                              {
                                ...prevState[i],
                                streak: streak + 1,
                                currDay: Date.now(),
                              },
                              ...prevState.slice(i + 1),
                            ];
                          });
                        }}
                        size="2.5rem"
                      />
                    )}
                    <AiFillDelete
                      className="px-1 border-4 border-black cursor-pointer hover:bg-black hover:text-white"
                      size="2.5rem"
                      onClick={() => {
                        setChallenges((prevState) => [
                          ...prevState.slice(0, i),
                          ...prevState.slice(i + 1),
                        ]);
                      }}
                    />
                  </div>
                </section>
              );
            })}
        </article>
      </main>
    </div>
  );
}

export default App;

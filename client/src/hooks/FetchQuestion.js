import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { getServerData } from "../helper/helper";

/** redux actions */
import * as Action from '../redux/question_reducer'

function generateUniqueRandom() {
    const usedNumbers = [];
  
    return () => {
      let randomNumber;
  
      do {
        randomNumber = Math.floor(Math.random() * 15) + 1;
      } while (usedNumbers.includes(randomNumber));
  
      usedNumbers.push(randomNumber);
  
      if (usedNumbers.length === 10) {
        // Reset usedNumbers array if all numbers are used
        usedNumbers.length = 0;
      }
  
      return randomNumber;
    };
}

/** fetch question hook to fetch api data and set value to store */
export const useFetchQestion = () => {
    const dispatch = useDispatch();   
    const [getData, setGetData] = useState({ isLoading : false, apiData : [], serverError: null});

    useEffect(() => {
        setGetData(prev => ({...prev, isLoading : true}));

        /** async function fetch backend data */
        (async () => {
            try {
                const [{ questions, answers }] = await getServerData(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/questions`, (data) => data)
                // ******************  Modified ********************* //
                for (let i = questions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [questions[i], questions[j]] = [questions[j], questions[i]];
                }

                let randomFiveObjects = questions.slice(0, 10);

                let answerArr = randomFiveObjects.map((obj,i) => {
                    return obj.answer
                  })

                // ******************  Modified ********************* //
                if(questions.length > 0){
                    setGetData(prev => ({...prev, isLoading : false}));
                    setGetData(prev => ({...prev, apiData : randomFiveObjects}));

                    /** dispatch an action */
                    dispatch(Action.startExamAction({ question : randomFiveObjects, answers : answerArr }))

                } else{
                    throw new Error("No Question Avalibale");
                }
            } catch (error) {
                setGetData(prev => ({...prev, isLoading : false}));
                setGetData(prev => ({...prev, serverError : error}));
            }
        })();
    }, [dispatch]);

    return [getData, setGetData];
}


/** MoveAction Dispatch function */
export const MoveNextQuestion = () => async (dispatch) => {
    try {
        dispatch(Action.moveNextAction()); /** increase trace by 1 */
    } catch (error) {
        console.log(error)
    }
}

/** PrevAction Dispatch function */
export const MovePrevQuestion = () => async (dispatch) => {
    try {
        dispatch(Action.movePrevAction()); /** decrease trace by 1 */
    } catch (error) {
        console.log(error)
    }
}
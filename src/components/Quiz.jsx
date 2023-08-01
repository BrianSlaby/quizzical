import React from "react"

export default function Quiz(props) {
    
    const quizQuestionElements = props.quizQuestions.map(question => {
        const answerElements = []
        question.all_answers.forEach(answer => {
            const styles = {
                backgroundColor: answer.selected ? "#7DBFE8" : "#F3E188"
            }
            answerElements.push(
                <button 
                    className="quiz-answer answer-btn" 
                    key={answer.id}
                    onClick={() => props.selectAnswer(question.id, answer.id)}
                    style={styles}
                >{answer.value}</button>
            )
        })
        return (
            <div key={question.id}>
                <h3 className="quiz-question">{question.question}</h3>
                <div className="question-answers-container">{answerElements}</div>
                <hr/>
            </div>
        )
    })
    
    const quizQuestionCheckedElements = props.quizQuestions.map(question => {
        const answerElements = []
        question.all_answers.forEach(answer => {
            
            function styleBackground() {
                if (answer.value === question.correct_answer) {
                    return "#95C655"
                } else if (answer.selected && answer.value !== question.correct_answer) {
                    return "#EBC5C2"
                } else {
                    return "#F3E188"
                }
            }
            
            const styles = {
                cursor: "not-allowed",
                opacity: answer.value === question.correct_answer ? 1 : 0.7,
                backgroundColor: styleBackground()
            }
            answerElements.push(
                <button 
                    className="quiz-answer answer-btn" 
                    key={answer.id}
                    style={styles}
                >{answer.value}</button>
            )
        })
        return (
            <div key={question.id}>
                <h3 className="quiz-question">{question.question}</h3>
                <div className="question-answers-container">{answerElements}</div>
                <hr/>
            </div>
        )
    })
    
    const summaryElements = (
        <div className="summary-container">
            <p className="score-p">{`You scored ${props.score}/5 correct answers`}</p>
            <button
                className="btn play-again-btn"
                onClick={props.startNewQuiz}
            >Play Again</button>
            <button
                className="btn reset-btn"
                onClick={props.resetQuiz}
            >Reset</button>
        </div>
    )
    
    const checkBtnElement = (
        <div className="summary-container">
            <button 
                className="btn check-answer-btn"
                onClick={props.checkAnswers}
            >Check Answers</button>
        </div>
    )
    
    return (
        <div className="quiz-container">
            {props.answersChecked ? quizQuestionCheckedElements : quizQuestionElements}
            {props.answersChecked ? summaryElements : checkBtnElement}
        </div>
    )
}
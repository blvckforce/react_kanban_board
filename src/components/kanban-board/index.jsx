import React, {useMemo} from "react";
import "./index.css";

const random = (max = 1000000000000) => Math.floor(Math.random() * max);

const stagesNames = ['Backlog', 'To Do', 'Ongoing', 'Done'];

export default function KanbanBoard(props) {

    const [tasks, setTasks] = React.useState([
        {id: random(), name: '1', stage: 0},
        {id: random(), name: '2', stage: 0},
    ]);


    const stagesTasks = useMemo(
        () => stagesNames.map(
            (stage, i) => tasks.filter(
                (task) => task.stage === i
            )
        ),
        [tasks]
    );

    const handleAddTask = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const name = document.getElementById("create-task-input").value;
        document.getElementById("create-task-input").value = "";

        if (name) {
            setTasks((prev) => [...prev, {id: random(), name, stage: 0}]);
        }
    };

    const handleButtonShiftRight = (id) => () => {
        setTasks(
            (prev) => {
                const toChange = prev.findIndex((task) => task.id === id);

                if (toChange === -1) {
                    return prev;
                }

                const prevTask = prev[toChange];

                if (prevTask.stage + 1 >= stagesNames.length) {
                    return prev;
                }

                prev[toChange] = Object.assign(prevTask, {stage: prevTask.stage + 1});

                return [...prev];
            }
        );
    };

    const handleButtonShiftLeft = (id) => () => {
        setTasks(
            (prev) => {
                const toChange = prev.findIndex((task) => task.id === id);

                if (toChange === -1) {
                    return prev;
                }

                const prevTask = prev[toChange];

                if (prevTask.stage - 1 < 0) {
                    return prev;
                }

                prev[toChange] = Object.assign(prevTask, {stage: prevTask.stage - 1});

                return [...prev];
            }
        );
    };

    const handleDelete = (id) => () => {
        setTasks((prev) => prev.filter(
            (task) => task.id !== id
        ));
    };

    return (
        <div className="mt-20 layout-column justify-content-center align-items-center">
            <form onSubmit={handleAddTask}>
                <section className="mt-50 layout-row align-items-center justify-content-center">
                    <input id="create-task-input" type="text" className="large" placeholder="New task name"
                           data-testid="create-task-input"/>
                    <button type="submit" className="ml-30" data-testid="create-task-button">Create task</button>
                </section>
            </form>

            <div className="mt-50 layout-row">
                {stagesTasks.map((tasks, i) => {
                    return (
                        <div className="card outlined ml-20 mt-0" key={`${i}`}>
                            <div className="card-text">
                                <h4>{stagesNames[i]}</h4>
                                <ul className="styled mt-50" data-testid={`stage-${i}`}>
                                    {tasks.map((task, index) => {
                                        return <li className="slide-up-fade-in" key={task.id}>
                                            <div
                                                className="li-content layout-row justify-content-between align-items-center">
                                                <span
                                                    data-testid={`${task.name.split(' ').join('-')}-name`}>{task.name}</span>
                                                <div className="icons">
                                                    <button
                                                        disabled={task.stage === 0}
                                                        className="icon-only x-small mx-2"
                                                        data-testid={`${task.name.split(' ').join('-')}-back`}
                                                        onClick={handleButtonShiftLeft(task.id)}
                                                    >
                                                        <i className="material-icons">arrow_back</i>
                                                    </button>
                                                    <button
                                                        disabled={task.stage === stagesNames.length - 1}
                                                        className="icon-only x-small mx-2"
                                                        data-testid={`${task.name.split(' ').join('-')}-forward`}
                                                        onClick={handleButtonShiftRight(task.id)}
                                                    >
                                                        <i className="material-icons">arrow_forward</i>
                                                    </button>
                                                    <button className="icon-only danger x-small mx-2"
                                                            data-testid={`${task.name.split(' ').join('-')}-delete`}
                                                            onClick={handleDelete(task.id)}
                                                    >
                                                        <i className="material-icons">delete</i>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    })}
                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
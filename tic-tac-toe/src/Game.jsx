import "./styles.css";
function Square() {
    return <button className="square">{value}</button>
}


export default function Game() {
    return (
        <div className="tic-tac-container">
            <div className="tic-tac-board">
                <div className="row">
                    <Square />
                    <Square />
                    <Square />
                </div>
                <div className="row">
                    <Square />
                    <Square />
                    <Square />
                </div>
                <div className="row">
                    <Square />
                    <Square />
                    <Square />
                </div>

            </div>
        </div>
    );
}
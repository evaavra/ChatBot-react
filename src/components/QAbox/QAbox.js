import "./style.css";

function QAbox({ text }) {
  //var exactTime = new Date().toLocaleTimeString();
  const colorClass = text.isQuestion ? "container light" : "container darker";
  const imageToggle = !text.isQuestion
    ? "icons8-chatbot-94.png"
    : "userIcon.png";
  return (
    <div className={colorClass}>
      <img src={imageToggle} alt="Avatar" className="left" />
      <p>{text.message}</p>
      <span className="time-right">{text.time}</span>
    </div>
  );
}

export default QAbox;

import { useState, useEffect } from "react";
import { Configuration, OpenAIApi } from "openai";
import "./styles.css";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import QAbox from "../QAbox/QAbox";
import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

function Chat() {
  const [question, setQuestion] = useState("");
  const [loads, setLoads] = useState(false);
  const [texts, setTexts] = useState([]);
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  const readQuestion = (e) => {
    setQuestion(e.target.value);
  };

  const clearText = () => {
    setTexts([]);
  };

  const enterPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      generateAnswer();
    }
  };

  const generateAnswer = async () => {
    setLoads(true);
    setTexts((prev) => [
      ...prev,
      {
        message: question,
        isQuestion: true,
        time: new Date().toLocaleTimeString(),
      },
    ]);
    setQuestion("");
    await openai
      .createEmbedding({
        model: "text-embedding-ada-002",
        input: question,
      })
      .then((res) => {
        axios({
          url: "https://localhost:7269/api/Pinecone",
          method: "POST",
          headers: {},
          data: res.data.data[0].embedding,
        }).then((response) => {
          openai
            .createCompletion({
              model: "text-davinci-003",
              prompt: `Text: '${response.data}'.Your name is Axi and you are a chatbot for "Test" website providing assistance to "Test" users. From the above text considering the previous conversation, answer to the question : ${question}? `,
              temperature: 0,
              max_tokens: 1000,
            })
            .then((resp) => {
              setLoads(false);
              //   setAnswer(resp.data.choices[0].text);
              setTexts((prev) => [
                ...prev,
                {
                  message: resp.data.choices[0].text,
                  isQuestion: false,
                  time: new Date().toLocaleTimeString(),
                },
              ]);
            });
        });
      });
  };

  return (
    <div className="container" id="section">
      <h2>Ask anything about us...</h2>
      <Form.Control
        className="myInput"
        onKeyDown={enterPress}
        value={question}
        as="textarea"
        rows={1}
        onChange={readQuestion}
      ></Form.Control>
      <br />
      <div className="buttons">
        <Button
          variant="danger"
          onClick={generateAnswer}
          id="buttonAnswer"
          style={{ backgroundColor: "#6de2e2", border: "none" }}
        >
          Send
        </Button>

        <Button
          className="buttons"
          id="buttonClear"
          onClick={clearText}
          style={{ backgroundColor: "#ce2d4f", border: "none" }}
        >
          Clear
        </Button>
      </div>
      {loads && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      {texts.map((text) => (
        <QAbox text={text}></QAbox>
      ))}
    </div>
  );
}

export default Chat;

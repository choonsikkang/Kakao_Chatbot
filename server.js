const express = require('express');
const app = express();
const router = express.Router();
const logger = require('morgan');
const port = 3000;

app.use(express.json())
app.use(logger('dev', {}));
app.use(express.urlencoded({
  extended: true
}));

router.post('/menu', (req, res) => {
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            'name': '아메리카노',
            'money': '4,500원'
          }
        }
      ]
    }
  };

  res.status(200).send(responseBody);
});

app.listen(port, () => {
  console.log(`Example skill server listening on ${port}!`);
});
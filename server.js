const express = require('express');
const app = express();
const logger = require('morgan');
const port = 3000;
const apiRouter = express.Router();

app.use(express.json())
app.use(logger('dev', {}));
app.use(express.urlencoded({
  extended: true
}));

app.use('/api', apiRouter);

apiRouter.post('/sayHello', (req, res) => {
    const responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "hello I'm Ryan"
            }
          }
        ]
      }
    };
  
    res.status(200).send(responseBody);
  });
  
apiRouter.post('/showHello', (req, res) => {
    console.log(req.body);
  
    const responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleImage: {
              imageUrl: "https://t1.daumcdn.net/friends/prod/category/M001_friends_ryan2.jpg",
              altText: "hello I'm Ryan"
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
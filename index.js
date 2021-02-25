let express = require("express");
let fs = require("fs");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

let port = 8080;
let roomdata = JSON.parse(
  fs.readFileSync("room.json", "UTF-8", (err, data) => {
    console.log(data);
  })
);

let bookinglist = JSON.parse(
  fs.readFileSync("roombook.json", "UTF-8", (err, data) => {
    console.log(data);
  })
);

app.get("/room", (req, res) => {
  res.json(roomdata);
});

app.get("/bookinglist", (req, res) => {
  res.json(bookinglist);
});

app.post("/booking", (req, res) => {
  try {
    let booking = {
      id: bookinglist.length + 1,
      name: req.body.name,
      date: req.body.date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      type: req.body.type,
      status: "yes",
    };
    var status = 1;
    for (var i in bookinglist) {
      if (
        bookinglist[i].date == req.body.date &&
        bookinglist[i].start_time < req.body.start_time &&
        bookinglist[i].end_time > req.body.end_time &&
        bookinglist[i].type == req.body.type
      ) {
        status = 0;
        res.json({
          message: "Room booked. not available",
        });
      }
    }
    if (status) {
      bookinglist.push(booking);
      fs.writeFileSync("roombook.json", JSON.stringify(bookinglist));
      res.json({
        message: "Successfully Booked",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      message: "something wrong",
    });
  }
});

app.get("/bookinglist/:id", (req, res) => {
  if (bookinglist[req.params.id - 1]) {
    res.json(bookinglist[req.params.id - 1]);
  } else {
    res.json({
      message: "no such record",
    });
  }
});

app.listen(port, () => {
  console.log(`server started at port : ${port}`);
});

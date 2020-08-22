const moment = require("moment-timezone");
const _ = require("lodash");
const periodBoard = require("./periodBoard");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
moment.locale("vi-VN");

const parseTime = (time) => moment(time, "DD/MM/YYYY");

const generateTimestamps = (start, end, day) => {
  let timeLine = [];
  // Set ngày bắt đầu
  start.weekday(day);
  // Kiểm tra ngày bắt đầu còn nhỏ hơn ngày kết thúc không , nếu có thêm vào timeline
  while (start.isSameOrBefore(end)) {
    timeLine.push(start.clone());
    //Tăng thêm 1 tuần để kiểm tra tiếp
    start.add(1, "week");
  }
  return timeLine;
};

//Chuyển thời gian sang thời gian học và kết thúc từng môn
const generateClasses = (timeRanges, startPeriod, endPeriod) => {
  return timeRanges.map((timeStamps) => ({
    start: timeStamps
      .clone()
      .hour(periodBoard[startPeriod].start.hour)
      .minute(periodBoard[startPeriod].start.minute),
    end: timeStamps
      .clone()
      .hour(periodBoard[endPeriod].end.hour)
      .minute(periodBoard[endPeriod].end.minute),
  }));
};

// Tạo time line
const generateTimeline = (subjects) => {
  let timelines = [];
  for (let subject of subjects) {
    for (let phase of subject.thoiGian) {
      for (let range of phase.ranges) {
        console.log(range);
        let timeline = generateClasses(
          generateTimestamps(
            parseTime(phase.start),
            parseTime(phase.end),
            parseInt(range.day) - 2
          ),
          range.periods[0],
          range.periods[range.periods.length - 1]
        );
        timeline.forEach((timestamp) => {
          let data = { timestamp, ...subject, ...range };
          delete data.thoiGian;
          delete data.STT;
          timelines.push(data);
        });
      }
    }
  }
  timelines.sort((first, last) => first.timestamp.start - last.timestamp.start);
  return timelines;
};
//
const generateTimelineByDay = (timelines) => {
  let days = _.groupBy(timelines, (timeline) => {
    return timeline.timestamp.start.clone().startOf("day");
  });
  return days;
};

module.exports = { generateTimeline, generateTimelineByDay };

export const timerCountDown = (timestamp) => {
  let countDownDate = new Date(timestamp * 1000).getTime();
  let x = setInterval(function () {
    let now = new Date().getTime();
    let distance = countDownDate - now;
    let Days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let Hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let Minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let Seconds = Math.floor((distance % (1000 * 60)) / 1000);
    let result = Days + "Days :" + Hours + "Hours :" + Minutes + "Minutes :" + Seconds + "Seconds";
    if (distance < 0) {
      clearInterval(x);
    }
    return result
  }, 1000)
}

export const UnixTimestampConvert = (UNIX_timestamp) => {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
}
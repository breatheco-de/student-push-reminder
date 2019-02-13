var request = require('request');
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var smtpPassword = require('aws-smtp-credentials');

var options = {
  url: 'https://github.com/search?o=desc&q=author%3Amaddogpc&s=committer-date&type=Commits',
  headers: {
    'User-Agent': 'maddogpc'
  }
};

var mailOptions = {
  from: 'info@breatheco.de',
  to: 'madisonverger613@gmail.com',
  text: 'This is some text',
  html: '<b>You should have pushed today!</b>',
};

// Send e-mail using SMTP
mailOptions.subject = 'Nodemailer SMTP transporter';
var smtpTransporter = nodemailer.createTransport({
  port: 465,
  host: 'email-smtp.us-west-2.amazonaws.com',
  secure: true,
  auth: {
    user: 'AKIAJLLQICJRVPDC5CTQ',
    pass: 'BHQXgziR9QyixgNtYdgbOFvUndd1xhuVHe3NoXo4O5xl',
  },
  debug: true
});

var d = new Date();
const currentYear = String(d.getFullYear());
var tempMonth = String(d.getMonth() + 1);
const currentMonth = tempMonth.length > 1 ? tempMonth : '0' + tempMonth;
var tempDay = String(d.getDate());
const currentDay = tempDay.length > 1 ? tempDay : '0' + tempDay;
 
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var lines = body.split("\n");
    for (let i=0; i<lines.length; i++) {
    	let index = lines[i].indexOf("datetime");
    	let text = lines[i].substring(index+10, index+20);
    	if (index !== -1) {
    		let sameYear = text.slice(0,4) === currentYear;
    		let sameMonth = text.slice(5,7) === currentMonth;
    		let sameDay = text.slice(8,10) === currentDay;
    		console.log(sameYear);
    		console.log(currentMonth);
    		console.log(currentDay);
    		console.log(text.slice(0,4));
    		console.log(text.slice(5,7));
    		console.log(text.slice(8,10));
    		if (!(sameYear && sameMonth && sameDay)) {
    			smtpTransporter.sendMail(mailOptions, emailCallback);
    		}
    		break;
    	}
    }
  }
}

function emailCallback(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Message sent: ' + info.response);
  }
}

request(options, callback);
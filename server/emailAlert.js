const nodemailer = require('nodemailer');
const config = require('./config.json');

const transporter = nodemailer.createTransport({
  service: config.emailProvider,
  auth: {
    user: config.email,
    pass: config.emailPassword
  }
});

module.exports = {
  sendAlert: function(action) {
    this.mailOptions = {
      from: config.email,
      to: config.email,
      subject: action + 'action',
      html: `<h1>Hello!</h1><p>A ${action} action was just made.</p>`
    };

    transporter.sendMail(this.mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return;
  }
};




const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Store appointments in memory (for simplicity, use a database in production)
let appointments = [];

// Route to schedule an appointment
app.post('/schedule', (req, res) => {
    const { Name, mail, age, gender, number, appointmentTime } = req.body;

    const meetingId = `meeting-${new Date().getTime()}`;
    const meetingUrl = `https://meet.jit.si/${meetingId}`;

    // Store appointment
    const appointment = { Name, mail, age, gender, number, appointmentTime, meetingUrl };
    appointments.push(appointment);

    // Send email to participants (example using Nodemailer)
    const transporter = nodemailer.createTransport({
        service: 'Mailo',
        auth: {
            user: '',
            pass: '',
        },
    });

    const mailOptions = {
        from: 'equal.society@mailo.com',
        to: 'cyberworldorganization@gmail.com, mail, equal.society@mailo.com',
        subject: 'Online Appointment has been Scheduled',
        text: `Meeting Details:\nDoctor: ${Name}\nYour Mail ID: ${mail}\nTime: ${appointmentTime}\nJoin Meeting: ${meetingUrl}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error scheduling meeting');
        } else {
            res.status(200).send('Meeting scheduled successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

package ems.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailSenderService {

    private final JavaMailSender mailSender;

    public MailSenderService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendDecisionEmail(String to, String status) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("hrcompanyems@gmail.com");  // ✅ Required for Gmail
        message.setTo(to);

        if ("Accepted".equalsIgnoreCase(status)) {
            message.setSubject("Congratulations! Your Application is Accepted");
            message.setText("""
                    Dear candidate,

                    Your profile has been shortlisted. Our team will reach out soon.

                    Thank you,
                    HR Team
                    """);
        } else {
            message.setSubject("Update on Your Application");
            message.setText("""
                    Dear candidate,

                    We appreciate your interest, but your profile was not shortlisted.

                    Best wishes,
                    HR Team
                    """);
        }

        System.out.println("📤 Sending mail to: " + to + " [" + status + "]");
        mailSender.send(message);
        System.out.println("===> Mail sent successfully to: " + to);
    }
}

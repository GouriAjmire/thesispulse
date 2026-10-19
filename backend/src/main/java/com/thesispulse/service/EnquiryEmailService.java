package com.thesispulse.service;

import com.thesispulse.web.Dtos.EnquiryRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EnquiryEmailService {
    private static final Logger log = LoggerFactory.getLogger(EnquiryEmailService.class);

    private final JavaMailSender mailSender;
    private final String recipient;
    private final String sender;
    private final String smtpUsername;
    private final String smtpPassword;

    public EnquiryEmailService(
            JavaMailSender mailSender,
            @Value("${app.enquiries.recipient}") String recipient,
            @Value("${spring.mail.username:}") String smtpUsername,
            @Value("${spring.mail.password:}") String smtpPassword,
            @Value("${app.enquiries.from:}") String sender) {
        this.mailSender = mailSender;
        this.recipient = recipient;
        this.sender = sender;
        this.smtpUsername = smtpUsername;
        this.smtpPassword = smtpPassword;
    }

    public void send(EnquiryRequest enquiry) {
        if (smtpUsername.isBlank() || smtpPassword.isBlank() || sender.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Enquiry email is not configured. Please try again later.");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(sender);
        message.setTo(recipient);
        message.setReplyTo(enquiry.email().trim());
        message.setSubject("New ThesisPulse enquiry from " + enquiry.name().trim().replaceAll("[\\r\\n]+", " "));
        message.setText("""
                A new enquiry was submitted through the ThesisPulse contact form.

                Name: %s
                Email: %s
                Phone / WhatsApp: %s
                University: %s
                Specialty: %s
                Service needed: %s
                Submission deadline: %s

                Additional details:
                %s
                """.formatted(
                enquiry.name().trim(),
                enquiry.email().trim(),
                enquiry.phone(),
                valueOrNotProvided(enquiry.university()),
                valueOrNotProvided(enquiry.specialty()),
                valueOrNotProvided(enquiry.serviceCode()),
                valueOrNotProvided(enquiry.deadline()),
                valueOrNotProvided(enquiry.message())));

        try {
            mailSender.send(message);
        } catch (MailException ex) {
            log.error("Failed to send contact enquiry notification.", ex);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "We couldn't send your enquiry right now. Please try again later.", ex);
        }
    }

    private static String valueOrNotProvided(Object value) {
        return value == null || value.toString().isBlank() ? "Not provided" : value.toString().trim();
    }
}

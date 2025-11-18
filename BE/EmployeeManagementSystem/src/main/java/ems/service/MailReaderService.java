package ems.service; // change to your actual package name

import jakarta.mail.*;
import jakarta.mail.Flags;
import jakarta.mail.search.FlagTerm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Properties;

import ems.entity.Candidate;        // adjust package as per your project
import ems.repository.CandidateRepository; // adjust package as per your project


@Service
public class MailReaderService {

    @Value("${mail.imap.username}")
    private String username;

    @Value("${mail.imap.password}")
    private String password;

    private final CandidateRepository repo;

    public MailReaderService(CandidateRepository repo) {
        this.repo = repo;
    }

    @Scheduled(fixedRate = 60000) // every 1 minute
    public void checkInbox() {
        try {
            Properties props = new Properties();
            props.setProperty("mail.store.protocol", "imaps");

            Session session = Session.getInstance(props, null);
            Store store = session.getStore();
            store.connect("imap.gmail.com", username, password);

            Folder inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_WRITE);

            Message[] messages = inbox.search(new FlagTerm(new Flags(Flags.Flag.SEEN), false));

            for (Message message : messages) {
                Address[] froms = message.getFrom();
                String senderEmail = froms[0].toString();

                String subject = message.getSubject();
                String name = senderEmail.contains("<") ? senderEmail.split("<")[0].trim() : senderEmail;

                if (message.isMimeType("multipart/*")) {
                    Multipart multipart = (Multipart) message.getContent();
                    for (int i = 0; i < multipart.getCount(); i++) {
                        BodyPart part = multipart.getBodyPart(i);
                        if (Part.ATTACHMENT.equalsIgnoreCase(part.getDisposition())) {
                            String fileName = part.getFileName();
                            File file = new File("uploads/" + fileName);
                            try (InputStream is = part.getInputStream();
                                 FileOutputStream fos = new FileOutputStream(file)) {
                                byte[] buf = new byte[4096];
                                int bytesRead;
                                while ((bytesRead = is.read(buf)) != -1) {
                                    fos.write(buf, 0, bytesRead);
                                }
                            }

                            Candidate c = new Candidate();
                            c.setName(name);
                            c.setEmail(senderEmail.replaceAll(".*<|>.*", ""));
                            c.setSubject(subject);
                            c.setResumePath(fileName);
                            repo.save(c);
                        }
                    }
                }

                message.setFlag(Flags.Flag.SEEN, true);
            }

            inbox.close(true);
            store.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

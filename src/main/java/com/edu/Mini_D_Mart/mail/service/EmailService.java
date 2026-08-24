package com.edu.Mini_D_Mart.mail.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.from:offers@onemart.com}")
    private String fromEmail;

    @Value("${app.mail.sender-name:OneMart Supermarket}")
    private String senderName;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    /**
     * Sends a welcome VIP grocery discount voucher email to the specified recipient.
     *
     * @param toEmail   Recipient email address
     * @param promoCode Promo code to provide
     * @return true if email was successfully dispatched through SMTP relay, false otherwise
     */
    public boolean sendVoucherEmail(String toEmail, String promoCode) {
        String subject = "🎉 Your ₹50 OFF Grocery Voucher is Ready — OneMart";
        String htmlContent = buildVoucherEmailHtml(toEmail, promoCode);

        // Check if JavaMailSender is configured with credentials
        if (mailSender == null || mailUsername == null || mailUsername.trim().isEmpty()) {
            log.info("📧 [EmailService] SMTP credentials not configured. Simulated email to: {} | Voucher Code: {}", toEmail, promoCode);
            log.debug("HTML Body:\n{}", htmlContent);
            return false;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, senderName);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("✅ [EmailService] Real offer email successfully sent to: {} with voucher: {}", toEmail, promoCode);
            return true;
        } catch (Exception e) {
            log.error("⚠️ [EmailService] Failed to send real email to {}: {}", toEmail, e.getMessage());
            return false;
        }
    }

    private String buildVoucherEmailHtml(String toEmail, String promoCode) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<title>Welcome to OneMart VIP Club</title>" +
                "</head>" +
                "<body style='margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;'>" +
                "  <table width='100%' border='0' cellspacing='0' cellpadding='0' style='background-color: #f1f5f9; padding: 30px 10px;'>" +
                "    <tr>" +
                "      <td align='center'>" +
                "        <table width='600' border='0' cellspacing='0' cellpadding='0' style='background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);'>" +
                "          <!-- Brand Header -->" +
                "          <tr>" +
                "            <td style='background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0f766e 100%); padding: 32px 30px; text-align: center; color: #ffffff;'>" +
                "              <h1 style='margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;'>One <span style='color: #fbbf24;'>Mart</span></h1>" +
                "              <p style='margin: 6px 0 0 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #a7f3d0;'>Supermarket & Fresh Grocery</p>" +
                "            </td>" +
                "          </tr>" +
                "          <!-- Main Body -->" +
                "          <tr>" +
                "            <td style='padding: 36px 32px; color: #1e293b;'>" +
                "              <span style='background-color: #fef3c7; color: #92400e; font-weight: 800; font-size: 11px; padding: 4px 12px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px;'>VIP Savings Club</span>" +
                "              <h2 style='margin: 16px 0 10px 0; font-size: 22px; font-weight: 900; color: #0f172a; line-height: 1.3;'>Welcome to the OneMart Family!</h2>" +
                "              <p style='margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;'>Here is your exclusive welcome discount code to save on fresh farm vegetables, dairy, grains, and daily supermarket essentials.</p>" +
                "              " +
                "              <!-- Voucher Box -->" +
                "              <div style='background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px dashed #10b981; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;'>" +
                "                <p style='margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 1px;'>Your Flat ₹50 OFF Coupon Code</p>" +
                "                <div style='font-size: 32px; font-weight: 900; font-family: Courier, monospace; color: #064e3b; letter-spacing: 4px; padding: 10px; background-color: #ffffff; border-radius: 10px; display: inline-block; box-shadow: 0 2px 6px rgba(0,0,0,0.06);'>" + promoCode + "</div>" +
                "                <p style='margin: 10px 0 0 0; font-size: 12px; font-weight: 600; color: #065f46;'>Valid on orders ₹299+ • Express 15-min Pickup & Fast Home Delivery</p>" +
                "              </div>" +
                "              " +
                "              <!-- Perks List -->" +
                "              <table width='100%' border='0' cellspacing='0' cellpadding='0' style='margin: 20px 0; border-top: 1px solid #f1f5f9; padding-top: 16px;'>" +
                "                <tr>" +
                "                  <td style='padding: 6px 0; font-size: 13px; color: #334155;'>🚚 <strong>Free Home Delivery</strong> on all orders above ₹500</td>" +
                "                </tr>" +
                "                <tr>" +
                "                  <td style='padding: 6px 0; font-size: 13px; color: #334155;'>🏪 <strong>Express Counter Pickup</strong> ready in 15 mins zero wait</td>" +
                "                </tr>" +
                "                <tr>" +
                "                  <td style='padding: 6px 0; font-size: 13px; color: #334155;'>🔄 <strong>7-Day Hassle-Free Returns</strong> & instant replacements</td>" +
                "                </tr>" +
                "              </table>" +
                "              " +
                "              <!-- CTA Button -->" +
                "              <div style='text-align: center; margin-top: 28px;'>" +
                "                <a href='http://localhost:5173' style='background-color: #059669; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 14px; font-weight: 800; border-radius: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(5,150,105,0.3);'>Shop Fresh Groceries Now →</a>" +
                "              </div>" +
                "            </td>" +
                "          </tr>" +
                "          <!-- Footer -->" +
                "          <tr>" +
                "            <td style='background-color: #064e3b; padding: 20px 30px; text-align: center; color: #a7f3d0; font-size: 11px;'>" +
                "              <p style='margin: 0;'>OneMart Supermarket App • Customer Helpline: +91 8000-ONEMART</p>" +
                "              <p style='margin: 4px 0 0 0; color: #6ee7b7;'>You received this email because you subscribed on OneMart.</p>" +
                "            </td>" +
                "          </tr>" +
                "        </table>" +
                "      </td>" +
                "    </tr>" +
                "  </table>" +
                "</body>" +
                "</html>";
    }
}

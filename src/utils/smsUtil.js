const sendOtpSms = async (mobileNumber, otp) => {
    try {
        const recipientNumber = mobileNumber.startsWith("+") ? mobileNumber : "+91" + mobileNumber;
        const templateId = "1207177443793984658";
        const senderId = "MAFOND";
        const apiKey = "A55b05332b18076587504bca8d0eade7f";
        const url = "https://api.in.kaleyra.io/v2/HXIN1760510224IN/messages";

        const templateData = { "#var#": otp };

        const payload = {
            to: recipientNumber,
            sender: senderId,
            type: "TXN",
            channel: "SMS",
            template_id: templateId,
            template_data: templateData
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify(payload)
        });

        // The response might be JSON or plain text
        let responseBody;
        try {
            responseBody = await response.json();
        } catch (e) {
            responseBody = await response.text();
        }

        if (response.ok) {
            return {
                success: true,
                message: "OTP sent successfully",
                details: responseBody
            };
        } else {
            return {
                success: false,
                message: "Failed to send OTP",
                details: responseBody
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "Error occurred",
            error: error.message
        };
    }
};

module.exports = {
    sendOtpSms
};

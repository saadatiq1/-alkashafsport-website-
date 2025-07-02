// SMS API Integration for Admin 2FA
// يمكن استخدام خدمات مختلفة لإرسال SMS

class SMSService {
    constructor() {
        // إعدادات الخدمة - يمكن تغييرها حسب المزود
        this.apiKey = 'YOUR_API_KEY'; // ضع مفتاح API هنا
        this.apiUrl = 'https://api.sms-service.com/send'; // رابط خدمة SMS
        this.senderName = 'AlKashaf'; // اسم المرسل
    }

    // إرسال SMS باستخدام خدمة مجانية (للاختبار)
    async sendSMSFree(phoneNumber, code) {
        try {
            // استخدام خدمة SMS مجانية مثل TextBelt
            const response = await fetch('https://textbelt.com/text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: phoneNumber,
                    message: `كود التحقق للكشاف سبورت: ${code}`,
                    key: 'textbelt' // مفتاح مجاني محدود
                })
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('تم إرسال SMS بنجاح');
                return { success: true, message: 'تم الإرسال بنجاح' };
            } else {
                throw new Error(result.error || 'فشل في الإرسال');
            }
        } catch (error) {
            console.error('خطأ في إرسال SMS:', error);
            return { success: false, error: error.message };
        }
    }

    // إرسال SMS باستخدام Twilio
    async sendSMSTwilio(phoneNumber, code) {
        try {
            const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
            const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
            const fromNumber = 'YOUR_TWILIO_PHONE_NUMBER';

            const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    From: fromNumber,
                    To: phoneNumber,
                    Body: `كود التحقق للكشاف سبورت: ${code}`
                })
            });

            if (response.ok) {
                return { success: true, message: 'تم الإرسال بنجاح' };
            } else {
                throw new Error('فشل في إرسال SMS');
            }
        } catch (error) {
            console.error('خطأ في Twilio:', error);
            return { success: false, error: error.message };
        }
    }

    // إرسال SMS باستخدام خدمة عربية (مثل Unifonic)
    async sendSMSUnifonicArabic(phoneNumber, code) {
        try {
            const apiKey = 'YOUR_UNIFONIC_API_KEY';
            
            const response = await fetch('https://api.unifonic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipient: phoneNumber,
                    body: `كود التحقق للكشاف سبورت: ${code}`,
                    sender: 'AlKashaf'
                })
            });

            const result = await response.json();
            
            if (result.success) {
                return { success: true, message: 'تم الإرسال بنجاح' };
            } else {
                throw new Error(result.message || 'فشل في الإرسال');
            }
        } catch (error) {
            console.error('خطأ في Unifonic:', error);
            return { success: false, error: error.message };
        }
    }

    // إرسال SMS باستخدام خدمة محلية سعودية
    async sendSMSSaudiService(phoneNumber, code) {
        try {
            // مثال لخدمة SMS سعودية
            const response = await fetch('https://sms.sa/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_API_KEY'
                },
                body: JSON.stringify({
                    to: phoneNumber,
                    message: `كود التحقق للكشاف سبورت: ${code}`,
                    from: 'AlKashaf'
                })
            });

            const result = await response.json();
            
            if (result.status === 'success') {
                return { success: true, message: 'تم الإرسال بنجاح' };
            } else {
                throw new Error(result.message || 'فشل في الإرسال');
            }
        } catch (error) {
            console.error('خطأ في الخدمة السعودية:', error);
            return { success: false, error: error.message };
        }
    }

    // الطريقة الرئيسية لإرسال SMS
    async sendVerificationCode(phoneNumber, code) {
        // جرب الخدمات بالترتيب حتى تنجح إحداها
        const services = [
            () => this.sendSMSFree(phoneNumber, code),
            () => this.sendSMSTwilio(phoneNumber, code),
            () => this.sendSMSUnifonicArabic(phoneNumber, code),
            () => this.sendSMSSaudiService(phoneNumber, code)
        ];

        for (const service of services) {
            try {
                const result = await service();
                if (result.success) {
                    return result;
                }
            } catch (error) {
                console.log('فشلت خدمة، جاري المحاولة مع الخدمة التالية...');
                continue;
            }
        }

        // إذا فشلت جميع الخدمات، استخدم المحاكاة
        console.log('فشلت جميع خدمات SMS، استخدام المحاكاة');
        return this.simulateSMS(phoneNumber, code);
    }

    // محاكاة إرسال SMS (للاختبار)
    async simulateSMS(phoneNumber, code) {
        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // عرض الكود في وحدة التحكم وتنبيه
        console.log(`SMS محاكاة - الرقم: ${phoneNumber}, الكود: ${code}`);
        
        // في بيئة التطوير، يمكن عرض الكود للمطور
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            alert(`كود التحقق للاختبار: ${code}`);
        }
        
        return { 
            success: true, 
            message: 'تم إرسال الكود (محاكاة)',
            simulation: true 
        };
    }

    // توليد كود تحقق عشوائي
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // التحقق من صحة رقم الجوال السعودي
    validateSaudiPhone(phone) {
        // إزالة المسافات والرموز
        phone = phone.replace(/[\s\-\(\)]/g, '');
        
        // التحقق من الصيغة السعودية
        const saudiPhoneRegex = /^(\+966|966|0)?5[0-9]{8}$/;
        return saudiPhoneRegex.test(phone);
    }

    // تنسيق رقم الجوال السعودي
    formatSaudiPhone(phone) {
        // إزالة المسافات والرموز
        phone = phone.replace(/[\s\-\(\)]/g, '');
        
        // إزالة الصفر من البداية إذا وجد
        if (phone.startsWith('0')) {
            phone = phone.substring(1);
        }
        
        // إضافة رمز الدولة إذا لم يكن موجود
        if (!phone.startsWith('+966') && !phone.startsWith('966')) {
            phone = '+966' + phone;
        } else if (phone.startsWith('966')) {
            phone = '+' + phone;
        }
        
        return phone;
    }
}

// تصدير الكلاس للاستخدام
window.SMSService = SMSService;

// مثال على الاستخدام:
/*
const smsService = new SMSService();

// إرسال كود تحقق
const phoneNumber = '+966501234567';
const code = smsService.generateVerificationCode();

smsService.sendVerificationCode(phoneNumber, code)
    .then(result => {
        if (result.success) {
            console.log('تم إرسال الكود بنجاح');
        } else {
            console.error('فشل في إرسال الكود:', result.error);
        }
    });
*/


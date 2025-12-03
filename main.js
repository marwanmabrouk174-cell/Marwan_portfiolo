//
// ====================================
//    وظائف JavaScript المحسنة
// ====================================
//

// 1. وظيفة شريط التنقل للموبايل (Burger Menu) وتتبع الروابط النشطة
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const navItemLinks = document.querySelectorAll('.nav-item-link');

    // تبديل القائمة
    burger.addEventListener('click', () => {
        // تبديل كلاس القائمة النشطة
        nav.classList.toggle('nav-active');

        // تبديل شكل البرجر
        burger.classList.toggle('toggle');

        // تحريك الروابط
        navLinks.forEach((link, index) => {
            if (nav.classList.contains('nav-active')) {
                // تطبيق أنيميشن الظهور
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            } else {
                // إزالة الأنيميشن عند إغلاق القائمة
                link.style.animation = '';
            }
        });
    });

    // إغلاق القائمة عند النقر على أي رابط (لتحسين تجربة الموبايل)
    navItemLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(l => l.style.animation = ''); // إعادة تعيين الأنيميشن
            }
        });
    });

    // تتبع الروابط النشطة بناءً على القسم الظاهر
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // يتم اعتبار القسم نشطاً إذا كان على بعد 100 بكسل من أعلى نافذة العرض
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navItemLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}
navSlide();


// 2. وظيفة تأثير الكتابة الديناميكي (Dynamic Typing Effect)
const dynamicTypingEffect = () => {
    const textElement = document.querySelector('.typing-text');
    // استخراج النص من خاصية البيانات بدلاً من القيمة الحالية
    const textToType = textElement.getAttribute('data-typing-text');
    let charIndex = 0;

    // مسح النص الموجود مسبقاً
    textElement.textContent = '';

    function typeChar() {
        if (charIndex < textToType.length) {
            textElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 70); // سرعة كتابة أسرع قليلاً
        } else {
            // إضافة مؤشر التنقيط النهائي أو أي تأثير CSS هنا
            textElement.style.borderRight = 'none';
        }
    }

    // إضافة تأثير المؤشر قبل البدء في الكتابة
    textElement.style.fontFamily = 'var(--code-font)';
    textElement.style.borderRight = '3px solid var(--primary-color)';
    textElement.style.paddingRight = '5px';
    
    setTimeout(typeChar, 500); // تأخير بسيط قبل بدء الكتابة
}


// 3. وظيفة تحديث حقوق النشر وتفعيل تأثير الكتابة
window.addEventListener('load', () => {
    // تحديث سنة حقوق النشر تلقائياً
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // تشغيل تأثير الكتابة
    dynamicTypingEffect();
});

// كود معالجة نموذج Formspree
// ----------------------------

const form = document.getElementById('contactForm');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', async (e) => {
    // 1. منع الإرسال الافتراضي للصفحة
    e.preventDefault();

    // 2. إظهار رسالة تحميل
    formMessage.innerHTML = '... يتم إرسال رسالتك';
    formMessage.style.color = '#3498db'; // أزرق

    // 3. جمع بيانات النموذج
    const data = new FormData(form);

    try {
        // 4. إرسال البيانات إلى Formspree باستخدام fetch API
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        // 5. تحليل الرد
        if (response.ok) {
            // نجاح الإرسال
            formMessage.innerHTML = '✅ شكراً لك! تم استلام رسالتك بنجاح.';
            formMessage.style.color = '#2ecc71'; // أخضر
            form.reset(); // إفراغ حقول النموذج
        } else {
            // فشل الإرسال (مثل خطأ في الخادم أو التحقق)
            const errorData = await response.json();
            if (Object.hasOwn(errorData, 'errors')) {
                 // عرض رسالة الخطأ من Formspree
                 formMessage.innerHTML = `❌ حدث خطأ: ${errorData.errors.map(err => err.message).join(', ')}`;
            } else {
                 formMessage.innerHTML = '❌ لم يتم الإرسال. يرجى المحاولة مرة أخرى لاحقاً.';
            }
            formMessage.style.color = '#e74c3c'; // أحمر
        }
    } catch (error) {
        // خطأ في الاتصال (مثل عدم وجود إنترنت)
        console.error('Network Error:', error);
        formMessage.innerHTML = '❌ حدث خطأ في الاتصال. تحقق من اتصالك بالإنترنت.';
        formMessage.style.color = '#e74c3c'; // أحمر
    }

    // إخفاء الرسالة بعد 5 ثوانٍ
    setTimeout(() => {
        formMessage.innerHTML = '';
    }, 5000);
});